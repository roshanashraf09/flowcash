import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Check, Sparkles, X, Shield, Zap, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PremiumModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleUpgrade = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
    alert('🎉 Thank you for trying FlowCash Pro! Premium features unlocked for this session.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-gradient-to-b from-[#1c1c24] to-[#121216] rounded-3xl shadow-2xl border border-purple-500/30 overflow-hidden text-white p-6 relative"
      >
        <div className="absolute top-0 right-0 p-4">
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        <div className="text-center space-y-4 pt-2">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Crown size={32} className="text-yellow-300" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
              FlowCash Pro
            </span>
            <h3 className="text-xl font-extrabold mt-2 text-white">
              Supercharge Your Cash Flow
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Unlock intelligent multi-currency forecasting, AI auto-categorization, and cloud multi-device vault sync.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#22222a] border border-slate-700/60 text-left space-y-2.5 text-xs">
            <div className="flex items-center gap-2.5 text-slate-200">
              <Check size={16} className="text-emerald-400 shrink-0" />
              <span>Unlimited bank statement imports (Revolut, Monzo, Barclays)</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-200">
              <Check size={16} className="text-emerald-400 shrink-0" />
              <span>Automated recurring subscription calendar & reminders</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-200">
              <Check size={16} className="text-emerald-400 shrink-0" />
              <span>Zero-knowledge client-side encrypted backup vault</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-200">
              <Check size={16} className="text-emerald-400 shrink-0" />
              <span>Priority 24/7 dedicated finance advisor assistance</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleUpgrade}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:opacity-90 text-white font-extrabold text-xs shadow-lg shadow-purple-500/25 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Zap size={15} className="text-yellow-300" />
              <span>Unlock Premium ($4.99 / mo)</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
