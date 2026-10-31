import React, { useState } from 'react';
import { AchievementBadge, PlayerStats } from '../types';
import { ACHIEVEMENT_BADGES } from '../data/achievementBadges';
import { speakJapanese } from '../utils/audio';
import { Trophy, Lock, CheckCircle2, Star, Sparkles, Filter } from 'lucide-react';

interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedBadges: Record<string, number>; // badgeId -> timestamp
  playerStats: PlayerStats;
  caughtLetters: Record<string, number>;
}

export const AchievementModal: React.FC<AchievementModalProps> = ({
  isOpen,
  onClose,
  unlockedBadges,
  playerStats,
  caughtLetters,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [inspectedBadge, setInspectedBadge] = useState<AchievementBadge | null>(null);

  if (!isOpen) return null;

  const totalBadges = ACHIEVEMENT_BADGES.length;
  const unlockedCount = Object.keys(unlockedBadges).length;
  const progressPercent = Math.round((unlockedCount / totalBadges) * 100);

  const filteredBadges = selectedCategory === 'all'
    ? ACHIEVEMENT_BADGES
    : ACHIEVEMENT_BADGES.filter((b) => b.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'すべて' },
    { id: 'catch', label: '🎣 文字釣り' },
    { id: 'words', label: '📚 ことば' },
    { id: 'kana', label: '🌈 五十音' },
    { id: 'streak', label: '🎯 デイリー' },
    { id: 'craft', label: '🧪 へんしん・工房' },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5 animate-fade-in">
      <div className="bg-white rounded-3xl p-5 sm:p-8 max-w-2xl w-full text-slate-800 shadow-2xl border-4 border-amber-400 relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-black cursor-pointer transition-colors z-10"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 flex items-center justify-center text-2xl shadow-md border border-amber-300">
            🏅
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              実績バッジ図鑑
            </h2>
            <p className="text-xs font-semibold text-slate-500">
              目標をたっせいして豪華なバッジとボーナススターを集めよう！
            </p>
          </div>
        </div>

        {/* Global Progress Card */}
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-4 border border-amber-200 mb-4 shrink-0 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-amber-900 mb-2">
            <span className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>バッジ獲得数</span>
            </span>
            <span>
              {unlockedCount} / {totalBadges} 個獲得 ({progressPercent}%)
            </span>
          </div>

          <div className="w-full h-3.5 bg-amber-200/60 rounded-full overflow-hidden p-0.5 border border-amber-300">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-3 shrink-0">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                selectedCategory === c.id
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Badge Grid (Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredBadges.map((badge) => {
              const isUnlocked = !!unlockedBadges[badge.id];
              const curProgress = badge.checkProgress(playerStats, caughtLetters);
              const pct = Math.min(100, Math.round((curProgress / badge.maxProgress) * 100));

              return (
                <div
                  key={badge.id}
                  onClick={() => {
                    setInspectedBadge(badge);
                    if (isUnlocked) {
                      speakJapanese(`バッジ「${badge.title}」！${badge.description}`);
                    } else {
                      speakJapanese(`目標: ${badge.title}。${badge.description}`);
                    }
                  }}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden flex items-center gap-3.5 ${
                    isUnlocked
                      ? 'bg-white border-amber-300 hover:border-amber-400 hover:shadow-md'
                      : 'bg-slate-50/80 border-slate-200 hover:border-slate-300 opacity-90'
                  }`}
                >
                  {/* Badge Icon */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 border shadow-xs transition-transform hover:scale-105 ${
                      isUnlocked
                        ? 'bg-gradient-to-tr from-amber-100 to-yellow-50 border-amber-300'
                        : 'bg-slate-200/70 border-slate-300 grayscale opacity-60'
                    }`}
                  >
                    {isUnlocked ? badge.icon : '🔒'}
                  </div>

                  {/* Badge Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <div className="text-sm font-black text-slate-900 truncate font-sans">
                        {badge.title}
                      </div>

                      {isUnlocked ? (
                        <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-0.5 shrink-0">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>獲得済</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full flex items-center gap-0.5 shrink-0">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>+{badge.rewardStars}</span>
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] font-semibold text-slate-500 line-clamp-1 mt-0.5">
                      {badge.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-1">
                        <span>進捗状況</span>
                        <span>
                          {curProgress} / {badge.maxProgress} {badge.unit}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isUnlocked ? 'bg-amber-500' : 'bg-sky-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
