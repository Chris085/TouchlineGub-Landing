import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Trophy, Users, LayoutGrid, ArrowRight, Zap, Target, CreditCard, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { LANDING_IMAGES } from '../assets/images';
import { SignupCoachButton } from '../components/SignupCoachButton';
import { useNavigate } from 'react-router-dom';

export function Landing() {
  const features = [
// ... (rest of features)
    { icon: Zap, title: 'Live Match Controller', description: 'Track live events in real-time.' },
    { icon: Users, title: 'Squad Management', description: 'Organize your team efficiently.' },
    { icon: Target, title: 'Performance Stats', description: 'In-depth analysis for every player.' },
    { icon: LayoutGrid, title: 'Automated Notes', description: 'Simplify match reports.' },
  ];

  const [openPlan, setOpenPlan] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignup = (plan: string) => {
    navigate(`/signup?plan=${plan}`);
  };

  return (
// ...
    <div className="min-h-screen bg-slate-950 text-white p-6 relative overflow-hidden">
      <Helmet>
        <title>Touchline Hub - Modern Youth Football Management</title>
        <meta name="description" content="Streamline your youth football team management, track live stats, and unify your team's communication—all in one place." />
        <meta property="og:title" content="Touchline Hub - Modern Youth Football Management" />
        <meta property="og:description" content="Streamline your youth football team management, track live stats, and unify your team's communication—all in one place." />
        <meta property="og:type" content="website" />
      </Helmet>
      {/* Background patterns */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(22,163,74,0.1),transparent_70%)]" />
        <div className="absolute inset-0 opacity-5 pitch-grid" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 p-4">
        <nav className="flex justify-center gap-8">
          <a href="#features" className="text-sm font-bold uppercase hover:text-pitch-green transition-colors">Features</a>
          <a href="#showcases" className="text-sm font-bold uppercase hover:text-pitch-green transition-colors">Showcase</a>
          <a href="#pricing" className="text-sm font-bold uppercase hover:text-pitch-green transition-colors">Pricing</a>
        </nav>
      </header>

      <div className="relative z-10 w-full max-w-6xl mx-auto space-y-24 pt-20">

        {/* Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8 pt-20"
        >
          <div className="inline-flex items-center gap-2 bg-pitch-green/10 text-pitch-green border border-pitch-green/20 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest font-display rotate-3">
            <Trophy size={14} /> The Future of Youth Football
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic font-display leading-[0.9]">
            The Touchline Hub
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            Streamline youth football management, track live stats, and unify your team's communication—all in one place.
          </p>
          <SignupCoachButton />
        </motion.div>

        {/* Features */}
        <div id="features" className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 scroll-mt-24">
          {features.map((feat, i) => (
            <motion.div 
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-slate-900 border border-slate-800 p-4 md:p-8 rounded-2xl space-y-3 md:space-y-4 hover:border-pitch-green/50 transition-colors"
            >
              <feat.icon className="text-pitch-green w-8 h-8 md:w-10 md:h-10" />
              <h3 className="text-lg md:text-xl font-bold font-display">{feat.title}</h3>
              <p className="text-slate-400 text-sm md:text-base">{feat.description}</p>
            </motion.div>
          ))}
        </div>


        {/* Showcases */}
        <div id="showcases" className="space-y-12 md:space-y-24 px-4 md:px-0 scroll-mt-24">
          <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-black uppercase font-display leading-tight">Master Your Matchday</h2>
              <p className="text-slate-400 text-lg">From squad selection to live match tracking, everything you need for success at your fingertips. Manage lineups, substitution patterns, and live updates instantly.</p>
              <ul className="space-y-3">
                {['Live Match Controller', 'Real-time Stats', 'Squad Availability Tracking'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-slate-200 font-medium">
                    <Check className="text-pitch-green bg-pitch-green/20 p-1 rounded-full" size={24} /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-2 md:p-4 overflow-hidden shadow-2xl">
              <img src={LANDING_IMAGES.STATS} alt="Team Stats" className="w-full h-auto rounded-2xl" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-center">
            <div className="order-2 md:order-1 bg-slate-900/50 border border-slate-800 rounded-3xl p-2 md:p-4 overflow-hidden shadow-2xl">
              <img src={LANDING_IMAGES.SCHEDULE} alt="Schedule" className="w-full h-auto rounded-2xl" />
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-black uppercase font-display leading-tight">Seamless Scheduling</h2>
              <p className="text-slate-400 text-lg">Organize matches, trainings, and availability in seconds. Keep parents and coaches aligned with automated updates.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-black uppercase font-display leading-tight">In-Depth Player Stats</h2>
              <p className="text-slate-400 text-lg">Track progress, goals, assists and more. Get a comprehensive overview of each player's performance over the season.</p>
              <ul className="space-y-3">
                {['Performance Tracking', 'Goals & Assists', 'MOTM Awards'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-slate-200 font-medium">
                    <Check className="text-pitch-green bg-pitch-green/20 p-1 rounded-full" size={24} /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-2 md:p-4 overflow-hidden shadow-2xl">
              <img src={LANDING_IMAGES.PLAYER_STATS} alt="Player Stats" className="w-full h-auto rounded-2xl" />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div id="pricing" className="space-y-12 scroll-mt-24">
          <h2 className="text-4xl font-black uppercase text-center font-display">Simple Pricing</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Trial */}
            <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl space-y-6">
              <h3 className="text-3xl font-black uppercase font-display text-pitch-green">🆓 Free Trial</h3>
              <p className="text-2xl font-bold">3 Months Free</p>
              <button 
                onClick={() => setOpenPlan(openPlan === 'free' ? null : 'free')}
                className="text-pitch-green underline font-bold"
              >
                {openPlan === 'free' ? 'Hide Details' : 'More Info'}
              </button>
              {openPlan === 'free' && (
                <p className="text-slate-400">Experience everything Touchline Hub has to offer with a completely free 3-month trial. Manage players, track attendance, organise fixtures, run matchday operations, and keep your team connected from one simple platform. No commitment, no hidden costs—just three months to see how much time and effort Touchline Hub can save.</p>
              )}
              <div className="space-y-3">
                <p className="font-bold text-lg">Includes:</p>
                <ul className="space-y-2">
                  {['Full access to all features', 'Unlimited players', 'Matchday management tools', 'Attendance tracking', 'Team statistics and insights', 'Mobile and desktop access'].map(f => (
                    <li key={f} className="flex items-center gap-2 text-slate-300">
                      <Check size={16} className="text-pitch-green" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-sm text-slate-500">No payment required during the trial period.</p>
              <button 
                onClick={() => handleSignup('free')} 
                className="w-full py-3 bg-white text-slate-950 font-bold uppercase rounded-xl hover:bg-slate-200 transition-colors"
              >
                Start Free Trial
              </button>
            </div>
            
            {/* Coach Pass */}
            <div className="bg-pitch-green text-slate-950 p-6 md:p-8 rounded-2xl space-y-6">
              <h3 className="text-3xl font-black uppercase font-display">⭐ Coach Pass</h3>
              <p className="text-2xl font-bold">£14.99 per Month</p>
              <button 
                onClick={() => setOpenPlan(openPlan === 'paid' ? null : 'paid')}
                className="text-slate-950 underline font-bold"
              >
                {openPlan === 'paid' ? 'Hide Details' : 'More Info'}
              </button>
              {openPlan === 'paid' && (
                <p className="text-slate-950 font-medium">Designed for grassroots football teams that want to spend less time on administration and more time coaching. Touchline Hub Premium provides everything needed to manage squads, fixtures, attendance, player information, and matchday operations from a single platform.<br/><br/>Whether you're a volunteer coach, team manager, or club administrator, Touchline Hub helps keep everything organised and accessible wherever you are.</p>
              )}
              <div className="space-y-3">
                <p className="font-bold text-lg">Premium Features:</p>
                <ul className="space-y-2">
                  {['Unlimited players and team data', 'Squad and player management', 'Attendance and availability tracking', 'Fixtures and results management', 'Matchday Controller', 'Team statistics and performance tracking', 'Coach notes and player records', 'Notifications and updates', 'Mobile and desktop access', 'Ongoing feature updates and improvements'].map(f => (
                    <li key={f} className="flex items-center gap-2">
                      <Check size={16} /> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-sm text-slate-900 font-medium">£14.99 per month after the 3-month free trial. Cancel anytime.</p>
              <button 
                onClick={() => handleSignup('paid')} 
                className="w-full py-3 bg-slate-950 text-white font-bold uppercase rounded-xl hover:bg-slate-800 transition-colors"
                >
                Choose Coach Pass
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 mt-24 py-8 px-6 md:px-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Touchline Hub. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex gap-6">
            <button 
              onClick={() => navigate('/terms')}
              className="hover:text-pitch-green transition-colors"
            >
              Terms & Conditions
            </button>
            <button 
              onClick={() => navigate('/privacy')}
              className="hover:text-pitch-green transition-colors"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
