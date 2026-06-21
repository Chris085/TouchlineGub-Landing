import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin using default credentials
try {
  admin.initializeApp();
  console.log("Firebase Admin successfully initialized.");
} catch (e: any) {
  console.log("Firebase Admin already initialized or configuration missed:", e);
}

// Load custom database ID dynamically from config
let dbId = "ai-studio-fa9edb88-e327-4d3f-9cbc-eec6ce79e0cf"; // fallback
try {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    if (config.firestoreDatabaseId) {
      dbId = config.firestoreDatabaseId;
      console.log(`Using custom Firestore database ID: ${dbId}`);
    }
  }
} catch (e) {
  console.error("Failed to read firebase-applet-config.json", e);
}

const getDb = () => {
  return getFirestore(dbId);
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Auto-verify endpoint to programmatically mark users as verified and ensure user & team documents exist
  app.post("/api/verify-user", async (req, res) => {
    let { uid, email, password, teamName, league, ageGroup, plan } = req.body;
    
    try {
      let authUser: admin.auth.UserRecord | null = null;

      // 1. If uid is not provided but email is, let's find or create the Auth user
      if (!uid && email) {
        try {
          authUser = await admin.auth().getUserByEmail(email);
          uid = authUser.uid;
          console.log(`Found existing auth user for email: ${email}, uid: ${uid}`);
        } catch (authErr: any) {
          if (authErr.code === 'auth/user-not-found') {
            if (password) {
              authUser = await admin.auth().createUser({
                email,
                password,
                emailVerified: true
              });
              uid = authUser.uid;
              console.log(`Successfully created new Firebase Auth user for email: ${email}, uid: ${uid}`);
            } else {
              return res.status(400).json({ error: "User not found and no password provided to create account" });
            }
          } else {
            throw authErr;
          }
        }
      }

      if (!uid) {
        return res.status(400).json({ error: "Missing uid or email parameter" });
      }

      // 2. Mark user auto-verified in Auth
      if (!authUser) {
        authUser = await admin.auth().getUser(uid);
      }
      
      if (!authUser.emailVerified) {
        await admin.auth().updateUser(uid, {
          emailVerified: true
        });
        console.log(`Successfully verified email for user: ${uid}`);
      }

      const userEmail = authUser.email || email || "";
      const displayName = authUser.displayName || userEmail.split('@')[0] || "Coach";
      const nowStr = new Date().toISOString();

      // 3. Handle Team creation/update if teamName is provided
      let teamId = null;
      if (teamName && teamName.trim() !== "") {
        const db = getDb();
        const teamsColl = db.collection("teams");
        
        // Find existing team by this user
        const existingTeamsQuery = await teamsColl.where("createdBy", "==", uid).limit(1).get();
        let teamRef;
        let originalVerified = false;

        if (!existingTeamsQuery.empty) {
          const existingTeamDoc = existingTeamsQuery.docs[0];
          teamRef = existingTeamDoc.ref;
          teamId = existingTeamDoc.id;
          originalVerified = existingTeamDoc.data().verified ?? false;
          console.log(`Found existing team: ${teamId} for user: ${uid}`);

          await teamRef.set({
            name: teamName.trim(),
            coachId: uid,
            createdBy: uid,
            verified: originalVerified,
          }, { merge: true });
        } else {
          // Create new team
          teamRef = teamsColl.doc();
          teamId = teamRef.id;
          console.log(`Creating new team: ${teamId} for user: ${uid}`);

          const startDate = new Date();
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + 90);

          const generateTeamCode = () => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let code = '';
            for (let i = 0; i < 6; i++) {
              code += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return code;
          };
          const generatedCode = generateTeamCode();

          const teamData: any = {
            name: teamName.trim(),
            code: generatedCode,
            teamCode: generatedCode,
            coachId: uid,
            createdBy: uid,
            createdAt: startDate.toISOString(),
            subscriptionType: plan || "free",
            subscriptionStatus: "active",
            subscriptionStartDate: startDate.toISOString(),
            subscriptionEndDate: plan === "trial" ? endDate.toISOString() : null,
            planName: plan === "trial" ? "3 Month Free Trial" : "Touchline Hub Coach Pass",
            trialUsed: plan === "trial",
            stripeCustomerId: null,
            stripeSubscriptionId: null,
            isReadOnly: true,
            verified: false, // Set verified: false as requested
          };

          if (league && league.trim()) teamData.league = league.trim();
          if (ageGroup && ageGroup.trim()) teamData.ageGroup = ageGroup.trim();

          await teamRef.set(teamData, { merge: true });
        }
      }

      // 4. Create or update Firestore user profile document via Admin SDK
      const userRef = getDb().collection("users").doc(uid);
      const userSnap = await userRef.get();

      if (!userSnap.exists) {
        const userProfile: any = {
          uid: uid,
          displayName: displayName,
          email: userEmail,
          role: "coach",
          createdAt: nowStr,
          lastLogin: nowStr,
          isActive: true,
        };
        if (teamId) {
          userProfile.teamId = teamId;
        }
        await userRef.set(userProfile, { merge: true });
        console.log(`Successfully created Firestore users/${uid} document on server.`);
      } else {
        const updateData: any = {
          lastLogin: nowStr
        };
        if (teamId) {
          updateData.teamId = teamId;
        }
        await userRef.update(updateData);
        console.log(`Successfully updated user users/${uid} on server.`);
      }

      return res.json({ 
        success: true, 
        emailVerified: true, 
        uid: uid, 
        teamId: teamId 
      });
    } catch (err: any) {
      console.error("Failed in verification/creation process on server:", err);
      return res.status(500).json({ error: err.message || "Internal server error" });
    }
  });

  // Support team contact endpoint using Resend
  app.post("/api/contact", async (req, res) => {
    const { userId, userName, userEmail, type, message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message content is required." });
    }

    const trySendEmail = async (recipient: string) => {
      const apiKey = process.env.RESEND_API_KEY || "re_UWcDvm4r_24N3YXh5hkadLVaDEXxQqDhz";
      const emailBody = {
        from: "Touchline Hub <onboarding@resend.dev>",
        to: recipient,
        subject: `[Touchline Hub] Support request: ${type || 'Other'}`,
        reply_to: userEmail || undefined,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #4f46e5; margin-bottom: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">Support Request</h2>
            <p><strong>Sender Name:</strong> ${userName || 'Anonymous User'}</p>
            <p><strong>Sender Email:</strong> ${userEmail || 'N/A'}</p>
            <p><strong>User ID:</strong> ${userId || 'N/A'}</p>
            <p><strong>Category:</strong> <span style="background-color: #f1f5f9; padding: 2px 8px; border-radius: 4px; font-weight: bold; text-transform: uppercase; font-size: 12px; color: #475569;">${type || 'other'}</span></p>
            <div style="margin-top: 20px; padding: 15px; background-color: #f8fafc; border-left: 4px solid #4f46e5; font-style: italic; white-space: pre-wrap; color: #0f172a;">
              ${message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/\n/g, '<br />')}
            </div>
            <p style="margin-top: 30px; font-size: 11px; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 15px;">This email was sent via Resend API Integration in your Touchline Hub instance.</p>
          </div>
        `
      };

      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(emailBody)
      });

      if (!resendResponse.ok) {
        const errText = await resendResponse.text();
        console.error(`Resend API error for recipient ${recipient}:`, errText);
        throw new Error(errText);
      }

      return await resendResponse.json();
    };

    try {
      console.log(`Sending support email via Resend... Type: ${type}`);
      let resendData;
      try {
        // Try the requested address (chrosjeal9@gmail.com) first
        resendData = await trySendEmail("chrosjeal9@gmail.com");
      } catch (firstError: any) {
        console.warn("Failed sending to chrosjeal9@gmail.com, trying fallback to chrisjeal9@gmail.com...", firstError.message);
        // Fallback to verified/registered sandbox address (chrisjeal9@gmail.com)
        resendData = await trySendEmail("chrisjeal9@gmail.com");
      }

      console.log("Resend email sent successfully:", resendData);
      return res.json({ success: true, id: resendData.id });
    } catch (error: any) {
      console.error("Support email sending failed entirely:", error);
      
      let clientMsg = "Failed to send email through Resend API.";
      try {
        const parsed = JSON.parse(error.message);
        if (parsed.message) clientMsg = parsed.message;
      } catch (pErr) {
        if (error.message) clientMsg = error.message;
      }

      return res.status(500).json({ error: clientMsg });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
