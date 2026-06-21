import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { auth, db } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Mail, Lock, Zap } from 'lucide-react';

export function Signup() {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan') || 'free';
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleGoogleSignup = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists() || !userSnap.data().teamId) {
        navigate(`/onboarding?plan=${plan}`);
      } else {
        window.location.href = 'https://app.touchlinehub.com/login';
      }
    } catch (error: any) {
      console.error('Error with Google signup:', error);
      setErrorMsg(error?.message || 'An error occurred during Google signup');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    setErrorMsg('');
    try {
      if (isLogin) {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const user = result.user;
        
        // Auto-verify on login if not already
        try {
          await fetch('/api/verify-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid: user.uid }),
          });
        } catch (err) {
          console.error('Auto-verification request failed', err);
        }

        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists() || !userSnap.data().teamId) {
          navigate(`/onboarding?plan=${plan}`);
        } else {
          window.location.href = 'https://app.touchlinehub.com/login';
        }
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;
        
        // Auto-verify on signup
        try {
          await fetch('/api/verify-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid: user.uid }),
          });
        } catch (err) {
          console.error('Auto-verification request failed', err);
        }

        try {
          await sendEmailVerification(user, {
            url: 'https://app.touchlinehub.com/login',
            handleCodeInApp: false,
          });
        } catch (verifyError) {
          console.error('Error sending verification email', verifyError);
          // Continue anyway so they can complete onboarding
        }

        // Proceed to onboarding where they'll configure their team.
        navigate(`/onboarding?plan=${plan}`);
      }
    } catch (error: any) {
      console.error('Error with Email auth:', error);
      if (error.code === 'auth/email-already-in-use') {
         setErrorMsg('Email is already in use. Please sign in instead.');
      } else if (error.code === 'auth/weak-password') {
         setErrorMsg('Password should be at least 6 characters.');
      } else if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
         setErrorMsg('Invalid email or password. Please try again.');
      } else {
         setErrorMsg(error?.message || 'An error occurred');
      }
    } finally {
       setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white flex flex-col items-center justify-center p-4">
      <Helmet>
        <title>{isLogin ? 'Log In' : 'Create Account'} | Touchline Hub</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Zap size={32} className="text-pitch-green" />
          </div>
          <h1 className="text-3xl font-black uppercase font-display mb-2">
            {isLogin ? 'Log In' : 'Create Account'}
          </h1>
          <p className="text-slate-400">
            {isLogin ? 'Sign in to access your dashboard' : 'Join Touchline Hub to manage your team.'}
          </p>
        </div>

        <div className="flex bg-slate-800/50 p-1 rounded-xl mb-6 border border-slate-700/50">
          <button
            onClick={() => { setIsLogin(false); setErrorMsg(''); }}
            className={`flex-1 py-2 text-sm font-bold uppercase rounded-lg transition-colors ${
              !isLogin ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => { setIsLogin(true); setErrorMsg(''); }}
            className={`flex-1 py-2 text-sm font-bold uppercase rounded-lg transition-colors ${
              isLogin ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Log In
          </button>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm text-center">
            {errorMsg}
          </div>
        )}

        <button 
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full mb-6 bg-white text-slate-900 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-100 transition-colors disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-px bg-slate-800 flex-1"></div>
          <span className="text-slate-500 text-sm font-medium uppercase">Or with email</span>
          <div className="h-px bg-slate-800 flex-1"></div>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2 uppercase">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-pitch-green transition-colors"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2 uppercase">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-pitch-green transition-colors"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-4 bg-pitch-green text-slate-950 font-black uppercase rounded-xl flex items-center justify-center gap-2 hover:bg-green-500 transition-colors disabled:opacity-50"
          >
            {loading ? (isLogin ? 'Logging in...' : 'Creating Account...') : (isLogin ? 'Log In' : 'Continue')}
          </button>
        </form>
      </div>
    </div>
  );
}
