import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';

export function PricingModal({ isOpen, onClose, onSelectTier }: { isOpen: boolean; onClose: () => void; onSelectTier: (tier: string) => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-4xl w-full shadow-2xl relative max-h-[90vh] flex flex-col"
          >
            <div className="flex justify-between items-center mb-8 sticky top-0 bg-slate-900 z-10">
              <h2 className="text-3xl font-black uppercase text-center font-display flex-grow">Choose Your Plan</h2>
              <button onClick={onClose} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-grow pr-2">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Free Trial */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black uppercase font-display text-pitch-green">🆓 Free Trial</h3>
                    <p className="text-xl font-bold">3 Months Free</p>
                    <p className="text-slate-400 text-sm">Get full access to Touchline Hub and discover how easy team management can be. No payment required during your trial.</p>
                  </div>
                  <ul className="space-y-3 text-sm text-slate-300">
                    <li className="flex items-center gap-2"><Check size={16} className="text-pitch-green" /> All Features Included</li>
                    <li className="flex items-center gap-2"><Check size={16} className="text-pitch-green" /> Unlimited Players</li>
                    <li className="flex items-center gap-2"><Check size={16} className="text-pitch-green" /> Matchday Management</li>
                    <li className="flex items-center gap-2"><Check size={16} className="text-pitch-green" /> Attendance Tracking</li>
                    <li className="flex items-center gap-2"><Check size={16} className="text-pitch-green" /> Mobile & Desktop Access</li>
                  </ul>
                  <button onClick={() => onSelectTier('free')} className="w-full py-3 bg-slate-800 text-white font-bold uppercase rounded-lg hover:bg-slate-700">Start Free Trial</button>
                </div>

                {/* Coach Pass */}
                <div className="bg-pitch-green text-slate-950 border border-pitch-green rounded-2xl p-6 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black uppercase font-display">⚽ Coach Pass</h3>
                    <p className="text-xl font-bold">£14.99 / Month</p>
                    <p className="text-slate-800 text-sm">Everything needed to run a modern grassroots football team from one platform.</p>
                  </div>
                  <ul className="space-y-3 text-sm text-slate-900">
                    <li className="flex items-center gap-2"><Check size={16} /> Squad Management</li>
                    <li className="flex items-center gap-2"><Check size={16} /> Fixtures & Results</li>
                    <li className="flex items-center gap-2"><Check size={16} /> Matchday Controller</li>
                    <li className="flex items-center gap-2"><Check size={16} /> Attendance & Availability</li>
                    <li className="flex items-center gap-2"><Check size={16} /> Team Statistics</li>
                  </ul>
                  <button onClick={() => onSelectTier('paid')} className="w-full py-3 bg-slate-950 text-white font-bold uppercase rounded-lg hover:bg-slate-800">Choose Coach Pass</button>
                </div>
              </div>
              <p className="text-center text-slate-500 text-xs mt-8">Built for coaches. Designed for grassroots football. Start with a free 3-month trial, then continue for just £14.99 per month. Cancel anytime.</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
