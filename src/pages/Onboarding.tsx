import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { doc, getDoc, setDoc, collection, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { PlanType, SubscriptionStatus } from '../constants/subscription';
import { Users, Zap, ShieldCheck, Key } from 'lucide-react';

// Generates a random 6-character alphanumeric string for teamCode
const generateTeamCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export function Onboarding() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planParam = searchParams.get('plan') || 'free';
  const selectedPlan = planParam === 'free' ? PlanType.TRIAL : PlanType.COACH_PASS;
  
  const [mode, setMode] = useState<'create' | 'join'>('create');
  
  // Create Team State
  const [teamName, setTeamName] = useState('');
  const [league, setLeague] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  
  // Join Team State
  const [joinCode, setJoinCode] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [user, setUser] = useState<any>(null);
  const [setupComplete, setSetupComplete] = useState(false);

  // User-friendly error translator
  const formatUserError = (err: any): string => {
    if (!err) return 'An unexpected error occurred';
    const msg = err.message || String(err);
    
    console.error("Detailed Onboarding Error:", err);
    
    try {
      if (msg.trim().startsWith('{') && msg.trim().endsWith('}')) {
        const parsed = JSON.parse(msg);
        if (parsed?.error) {
          const authStatus = parsed.authInfo?.userId 
            ? `UID: ${parsed.authInfo.userId} (Email: ${parsed.authInfo.email || 'N/A'}, Verified: ${parsed.authInfo.emailVerified})`
            : "Not authenticated";
          return `Database setup failed: ${parsed.error} (Path: ${parsed.path || 'Unknown'}, Operation: ${parsed.operationType}, Auth: ${authStatus}). Please ensure your Firebase security rules allow this user to write to that path.`;
        }
      }
    } catch (e) {
      // Ignore JSON parse error and fallback
    }

    return `Error: ${msg}`;
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // Auto-verify user email state via backend
        try {
          await fetch('/api/verify-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid: currentUser.uid }),
          });
        } catch (err) {
          console.error('Auto-verification request failed in Onboarding', err);
        }
        
        // Idempotency check: If user and team documents already exist, bypass onboarding
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            if (userData?.teamId) {
              const teamDocRef = doc(db, 'teams', userData.teamId);
              const teamDocSnap = await getDoc(teamDocRef);
              
              if (teamDocSnap.exists()) {
                console.log('User has already completed onboarding. Redirecting...');
                window.location.href = 'https://app.touchlinehub.com/login';
              }
            }
          }
        } catch (err) {
          console.error("Error during onboarding idempotency check:", err);
          // Let coach perform setup if verification fails
        }
      } else {
        // Wait a brief moment to ensure auth state isn't just initializing
        timeoutId = setTimeout(() => {
          navigate('/');
        }, 1000);
      }
    });
    return () => {
      unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!teamName.trim() || !user) return;

    setLoading(true);
    try {
      console.log('Sending onboarding and team setup details to the server...');
      
      const response = await fetch('/api/verify-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          teamName: teamName.trim(),
          league: league.trim(),
          ageGroup: ageGroup.trim(),
          plan: selectedPlan,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Server rejected onboarding request.');
      }

      const result = await response.json();
      console.log('Onboarding was successfully processed on the server:', result);

      // Redirect user directly to the application
      window.location.href = 'https://app.touchlinehub.com/login';
    } catch (error: any) {
      console.error('Error creating team:', error);
      setErrorMsg(formatUserError(error));
      setLoading(false);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!joinCode.trim() || !user) return;

    setLoading(true);
    try {
      console.log('Starting team join process with code:', joinCode.trim().toUpperCase());
      const teamsRef = collection(db, 'teams');
      
      // First, try to query using the 'code' field as requested
      let q = query(teamsRef, where('code', '==', joinCode.trim().toUpperCase()));
      let querySnapshot = await getDocs(q);

      // Fallback to checking the 'teamCode' field
      if (querySnapshot.empty) {
        q = query(teamsRef, where('teamCode', '==', joinCode.trim().toUpperCase()));
        querySnapshot = await getDocs(q);
      }

      if (querySnapshot.empty) {
        throw new Error('Invalid team code. Team does not exist.');
      }

      const teamDoc = querySnapshot.docs[0];
      const userRef = doc(db, 'users', user.uid);
      const startDate = new Date();
      
      const userData = {
        uid: user.uid,
        displayName: user.displayName || 'Coach',
        email: user.email || '',
        role: 'coach',
        teamId: teamDoc.id,
        createdAt: startDate.toISOString(),
        lastLogin: startDate.toISOString(),
        isActive: true,
      };

      try {
        console.log('Writing user profile document for join:', user.uid);
        await setDoc(userRef, userData, { merge: true });
        console.log('Joined team and user profile created successfully');
      } catch (err: any) {
        handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
      }

      // Make sure the record exists
      const finalUserSnap = await getDoc(userRef);
      if (!finalUserSnap.exists()) {
        throw new Error("Verification failed: Could not confirm successful storage of join data. Please try again.");
      }

      console.log('Onboarding join step validated. Proceeding to destination...');
      window.location.href = 'https://app.touchlinehub.com/login';
    } catch (error: any) {
      console.error('Error joining team:', error);
      setErrorMsg(formatUserError(error));
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-slate-700 border-t-pitch-green animate-spin" />
      </div>
    );
  }

  if (setupComplete) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(22,163,74,0.1),transparent_70%)]" />
          <div className="absolute inset-0 opacity-5 pitch-grid" />
        </div>

        <div className="relative z-10 w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-pitch-green/20 rounded-2xl flex items-center justify-center border border-pitch-green/30">
              <ShieldCheck className="text-pitch-green w-8 h-8" />
            </div>
          </div>
          
          <h1 className="text-3xl font-black uppercase font-display mb-4">Team Created!</h1>
          <p className="text-slate-400 mb-6 font-medium">
            We've sent a verification link to <span className="text-white">{user.email}</span>.
          </p>
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 mb-8">
             <p className="text-sm text-slate-300">
               Please check your inbox and click the verification link to activate your account and access the app.
             </p>
          </div>
          <button 
            onClick={() => window.location.href = 'https://app.touchlinehub.com/login'}
            className="text-pitch-green font-bold text-sm uppercase hover:text-green-400 transition-colors"
          >
            I've already verified my email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 relative overflow-hidden">
      <Helmet>
        <title>Setup Your Team | Touchline Hub</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {/* Background patterns */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(22,163,74,0.1),transparent_70%)]" />
        <div className="absolute inset-0 opacity-5 pitch-grid" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700">
            {mode === 'create' ? (
              <Users className="text-pitch-green w-8 h-8" />
            ) : (
              <Key className="text-pitch-green w-8 h-8" />
            )}
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black uppercase font-display mb-2">Welcome to Touchline Hub</h1>
          <p className="text-slate-400">
            {mode === 'create' ? "Let's create your team." : "Join an existing team."}
          </p>
        </div>

        <div className="flex bg-slate-800/50 p-1 rounded-xl mb-8 border border-slate-700/50">
          <button
            onClick={() => { setMode('create'); setErrorMsg(''); }}
            className={`flex-1 py-2 text-sm font-bold uppercase rounded-lg transition-colors ${
              mode === 'create' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Team
          </button>
          <button
            onClick={() => { setMode('join'); setErrorMsg(''); }}
            className={`flex-1 py-2 text-sm font-bold uppercase rounded-lg transition-colors ${
              mode === 'join' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Join Team
          </button>
        </div>

        {mode === 'create' ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="teamName" className="block text-sm font-bold text-slate-300 uppercase mb-2">Team Name *</label>
              <input
                id="teamName"
                type="text"
                required
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. AFC Example"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-pitch-green focus:ring-1 focus:ring-pitch-green transition-all"
              />
            </div>

            <div>
              <label htmlFor="ageGroup" className="block text-sm font-bold text-slate-300 uppercase mb-2">Age Group <span className="text-slate-500 normal-case font-normal">(Optional)</span></label>
              <input
                id="ageGroup"
                type="text"
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                placeholder="e.g. Under 12s"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-pitch-green focus:ring-1 focus:ring-pitch-green transition-all"
              />
            </div>

            <div>
              <label htmlFor="league" className="block text-sm font-bold text-slate-300 uppercase mb-2">League <span className="text-slate-500 normal-case font-normal">(Optional)</span></label>
              <input
                id="league"
                type="text"
                value={league}
                onChange={(e) => setLeague(e.target.value)}
                placeholder="e.g. Sunday Youth League"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-pitch-green focus:ring-1 focus:ring-pitch-green transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={!teamName.trim() || loading}
              className="w-full py-4 bg-pitch-green text-slate-950 font-black uppercase rounded-xl flex items-center justify-center gap-2 hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? 'Setting up...' : <><Zap size={18} /> Create Team</>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleJoin} className="space-y-6">
            <div>
              <label htmlFor="joinCode" className="block text-sm font-bold text-slate-300 uppercase mb-2">Team Code *</label>
              <input
                id="joinCode"
                type="text"
                required
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Enter your team code"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-pitch-green focus:ring-1 focus:ring-pitch-green transition-all font-mono"
              />
              <p className="text-slate-500 text-xs mt-2 font-medium">
                Ask your team manager for the team code located in their settings.
              </p>
            </div>

            <button
              type="submit"
              disabled={!joinCode.trim() || loading}
              className="w-full py-4 bg-pitch-green text-slate-950 font-black uppercase rounded-xl flex items-center justify-center gap-2 hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? 'Joining...' : 'Join Team'}
            </button>
          </form>
        )}

        {errorMsg && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm text-center">
            {errorMsg}
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-2 text-slate-500 text-sm">
          <ShieldCheck size={16} />
          <span>Secure checkout & data privacy</span>
        </div>
      </div>
    </div>
  );
}
