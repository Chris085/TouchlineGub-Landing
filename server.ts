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

  // Helper to send beautiful Touchline Hub welcome and verification confirmation email via Resend
  const sendWelcomeVerificationEmail = async (email: string, displayName: string) => {
    try {
      const apiKey = process.env.RESEND_API_KEY || "re_UWcDvm4r_24N3YXh5hkadLVaDEXxQqDhz";
      console.log(`Sending onboarding welcome verification email via Resend to: ${email}`);
      
      const emailBody = {
        from: "Touchline Hub <onboarding@resend.dev>",
        to: email,
        subject: "Welcome to Touchline Hub - Email Verified & Confirmed",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 30px; border: 1px solid #1e293b; background-color: #020617; border-radius: 20px; color: #f8fafc;">
            <div style="text-align: center; margin-bottom: 35px;">
              <div style="display: inline-block; padding: 12px; background-color: rgba(22, 163, 74, 0.1); border-radius: 16px; border: 1px solid rgba(22, 163, 74, 0.2); margin-bottom: 16px;">
                <svg style="color: #16a34a; width: 44px; height: 44px; display: block;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="44" height="44">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#16a34a" />
                </svg>
              </div>
              <h1 style="color: #ffffff; font-size: 26px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: -0.5px;">Touchline Hub</h1>
              <p style="color: #16a34a; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin: 6px 0 0 0;">ACCOUNT VERIFIED SUCCESSFULLY</p>
            </div>
            
            <div style="background-color: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 28px; margin-bottom: 25px;">
              <p style="margin-top: 0; color: #ffffff; font-size: 18px; font-weight: 700;">Hello ${displayName || 'Coach'},</p>
              <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
                Welcome to <strong style="color: #ffffff;">Touchline Hub</strong>! We are absolutely thrilled to have you lead your team using our professional football analytics and matchday dashboard.
              </p>
              <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
                Your coach profile has been successfully set up, and your email address has been programmatically verified on our platform. No further action is required to unlock your account.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://app.touchlinehub.com/login" style="display: inline-block; background-color: #16a34a; color: #ffffff; font-weight: 800; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; padding: 15px 30px; border-radius: 10px; text-decoration: none; border: 1px solid #15803d; box-shadow: 0 4px 12px rgba(22, 163, 74, 0.2);">
                  Access Coach Dashboard
                </a>
              </div>
            </div>

            <div style="border-top: 1px solid #1e293b; padding-top: 25px; font-size: 12px; color: #64748b; text-align: center; line-height: 1.5;">
              <p style="margin: 0 0 8px 0;">Need immediate support, want to request features, or have any suggestions? Simply reply to this email, and our feedback loop will route it directly to our lead engineering team.</p>
              <p style="margin: 0;">&copy; 2026 Touchline Hub. All rights reserved.</p>
            </div>
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
        throw new Error(`Resend API returned status ${resendResponse.status}: ${errText}`);
      }

      const resendData: any = await resendResponse.json();
      console.log(`Successfully sent custom welcome verification email through Resend:`, resendData);
    } catch (err: any) {
      console.error("Resend welcome verification email sending failed:", err);
    }
  };

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
                emailVerified: false
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

      if (!authUser) {
        authUser = await admin.auth().getUser(uid);
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

          const updateFields: any = {
            name: teamName.trim(),
            coachId: uid,
            createdBy: uid,
            verified: originalVerified,
            isVerified: false,
          };

          await teamRef.set(updateFields, { merge: true });
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
            verified: false,
            isVerified: false,
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
          isVerified: false,
          emailVerified: false,
          verificationToken: Math.random().toString(36).substring(2, 12).toUpperCase(),
        };
        if (teamId) {
          userProfile.teamId = teamId;
        }
        await userRef.set(userProfile, { merge: true });
        console.log(`Successfully created Firestore users/${uid} document on server.`);

        // Send a beautiful custom verification/welcome email via Resend
        if (userEmail) {
          await sendWelcomeVerificationEmail(userEmail, displayName);
        }
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
        emailVerified: false, 
        uid: uid, 
        teamId: teamId 
      });
    } catch (err: any) {
      console.error("Failed in verification/creation process on server:", err);
      return res.status(500).json({ error: err.message || "Internal server error" });
    }
  });

  // Unique source of truth for email verification of coaches
  app.all("/api/verify-email", async (req, res) => {
    const token = req.query.token || req.body.token;
    const uid = req.query.uid || req.body.uid;

    if (!token && !uid) {
      return res.status(400).json({ error: "Missing verification parameters. 'token' or 'uid' is required." });
    }

    try {
      const db = getDb();
      let userDocToVerify = null;

      if (token) {
        const userQuery = await db.collection("users").where("verificationToken", "==", token).limit(1).get();
        if (!userQuery.empty) {
          userDocToVerify = userQuery.docs[0];
        }
      } else if (uid) {
        const userDoc = await db.collection("users").doc(uid).get();
        if (userDoc.exists) {
          userDocToVerify = userDoc;
        }
      }

      if (!userDocToVerify) {
        return res.status(404).json({ error: "Invalid or expired verification token." });
      }

      const userRef = userDocToVerify.ref;
      const userData = userDocToVerify.data();
      const userId = userDocToVerify.id;

      // Update Firebase Auth user's emailVerified state to true
      try {
        await admin.auth().updateUser(userId, {
          emailVerified: true
        });
        console.log(`Successfully verified email in Firebase Auth for user: ${userId}`);
      } catch (authErr) {
        console.error("Failed to update emailVerified in Firebase Auth, but proceeding with Firestore verification:", authErr);
      }

      // Update Firestore user document
      await userRef.update({
        isVerified: true,
        emailVerified: true,
        verificationToken: admin.firestore.FieldValue.delete()
      });

      console.log(`Firestore user ${userId} has been marked as verified.`);

      // Update team if user has a team
      const teamId = userData.teamId;
      if (teamId) {
        const teamRef = db.collection("teams").doc(teamId);
        const teamSnap = await teamRef.get();
        if (teamSnap.exists) {
          await teamRef.update({
            isVerified: true,
            isReadOnly: false
          });
          console.log(`Successfully verified team ${teamId} and set isReadOnly to false.`);
        }
      }

      return res.json({
        success: true,
        message: "Email and team registration verified successfully."
      });
    } catch (err: any) {
      console.error("Email verification failed:", err);
      return res.status(500).json({ error: err.message || "Email verification failed" });
    }
  });

  // Cleanup user "limbo" status (registered in Auth but does not exist in Firestore users collection)
  app.post("/api/cleanup-limbo", async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email parameter is required." });
    }

    try {
      console.log(`Checking limbo status for email: ${email}`);
      let authUser;
      try {
        authUser = await admin.auth().getUserByEmail(email);
      } catch (authErr: any) {
        if (authErr.code === 'auth/user-not-found') {
          return res.json({ status: "not_found", message: "Email is not in Firebase Auth." });
        }
        throw authErr;
      }

      const uid = authUser.uid;
      const userRef = getDb().collection("users").doc(uid);
      const userSnap = await userRef.get();

      if (!userSnap.exists) {
        console.log(`User ${uid} with email ${email} exists in Auth but not Firestore. Deleting limbo Auth user...`);
        await admin.auth().deleteUser(uid);
        return res.json({ status: "cleaned", message: "Limbo user successfully cleaned up from Auth." });
      }

      return res.json({ status: "active", message: "Email is registered with a completed account." });
    } catch (err: any) {
      console.error("Limbo cleanup error:", err);
      return res.status(500).json({ error: err.message || "Failed to check or cleanup email limbo status." });
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
