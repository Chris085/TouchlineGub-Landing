import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import { PricingModal } from './PricingModal';
import { useNavigate } from 'react-router-dom';

export function SignupCoachButton() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSignup = (plan: string) => {
    setShowModal(false);
    navigate(`/signup?plan=${plan}`);
  };

  return (
    <>
      <button 
        onClick={() => setShowModal(true)} 
        className="px-8 py-4 bg-pitch-green text-slate-950 font-black uppercase rounded-xl flex items-center gap-2 hover:bg-green-500 transition-colors mx-auto"
      >
        <Zap size={18} /> Sign up as Coach
      </button>
      <PricingModal isOpen={showModal} onClose={() => setShowModal(false)} onSelectTier={handleSignup} />
    </>
  );
}
