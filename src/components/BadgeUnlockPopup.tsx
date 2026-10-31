import React from 'react';
import { AchievementBadge } from '../types';
import { Sparkles, Trophy, Star, Award } from 'lucide-react';

interface BadgeUnlockPopupProps {
  badge: AchievementBadge | null;
  onClose: () => void;
}

export const BadgeUnlockPopup: React.FC<BadgeUnlockPopupProps> = ({ badge, onClose }) => {
  if (!badge) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl border-4 border-amber-400 relative overflow-hidden flex flex-col items-center">
        {/* Shimmer background */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-200/40 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-orange-200/40 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center gap-1 text-amber-600 font-bold text-xs mb-3 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          <Sparkles className="w-3.5 h-3.5 fill-amber-400 text-amber-500 animate-spin" />
          <span>実績バッジ獲得！！</span>
        </div>

        {/* Leaping Badge Icon */}
        <div className="relative my-2">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-200 text-amber-950 flex items-center justify-center text-5xl shadow-xl border-3 border-white ring-4 ring-amber-300/60 animate-bounce">
            {badge.icon}
          </div>
        </div>

        <h3 className="text-2xl font-black text-slate-900 mt-2 mb-1 font-sans">
          {badge.title}
        </h3>
        <p className="text-xs font-semibold text-slate-600 mb-4 px-2">
          {badge.description}
        </p>

        {/* Reward Pill */}
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-2xl border border-amber-300 mb-6">
          <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
          <span className="text-xs font-bold text-amber-900">ボーナススター</span>
          <span className="text-base font-black text-amber-950">+{badge.rewardStars} ⭐</span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-amber-950 font-black text-base rounded-2xl shadow-lg border-2 border-amber-200 cursor-pointer transition-transform active:scale-95 shadow-amber-900/20"
        >
          やったね！
        </button>
      </div>
    </div>
  );
};
