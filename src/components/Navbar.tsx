import React from 'react';
import { GameMode } from '../types';
import { Volume2, VolumeX, Sparkles, Anchor, BookOpen, Layers, Wand2, ArrowRightLeft } from 'lucide-react';

interface NavbarProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  stars: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenDailyChallenge: () => void;
  isDailyCompleted: boolean;
  onOpenAchievements: () => void;
  unlockedBadgesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  stars,
  isMuted,
  onToggleMute,
  onOpenDailyChallenge,
  isDailyCompleted,
  onOpenAchievements,
  unlockedBadgesCount,
}) => {
  const navItems: { mode: GameMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'letter_catch', label: '文字つり', icon: <Anchor className="w-4 h-4" /> },
    { mode: 'word_catch', label: 'ことばつり', icon: <Layers className="w-4 h-4" /> },
    { mode: 'pair_match', label: 'へんしんペア', icon: <ArrowRightLeft className="w-4 h-4" /> },
    { mode: 'word_combiner', label: '文字あわせ工房', icon: <Wand2 className="w-4 h-4" /> },
    { mode: 'zukan', label: 'もじ図鑑・水族館', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <div
          onClick={() => onSelectMode('letter_catch')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 text-white flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition-transform">
            🎣
          </div>
          <div>
            <div className="text-base sm:text-lg font-black text-slate-800 tracking-tight flex items-center gap-1">
              <span>もじつりアイランド</span>
            </div>
            <div className="text-[10px] font-semibold text-sky-600 hidden sm:block">
              ひらがな・カタカナ釣り学習ゲーム
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {navItems.map((item) => {
            const isActive = currentMode === item.mode;
            return (
              <button
                key={item.mode}
                type="button"
                onClick={() => onSelectMode(item.mode)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-sm -translate-y-0.5'
                    : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Utility / Audio / Score */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Daily Challenge Button */}
          <button
            type="button"
            onClick={onOpenDailyChallenge}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border font-black text-xs transition-all cursor-pointer ${
              isDailyCompleted
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                : 'bg-gradient-to-r from-amber-400 to-orange-400 text-amber-950 border-amber-300 hover:from-amber-300 hover:to-orange-300 shadow-xs animate-pulse'
            }`}
            title="今日の目標単語チャレンジ"
          >
            <span>{isDailyCompleted ? '💮' : '🎯'}</span>
            <span className="hidden sm:inline">今日の目標</span>
            {!isDailyCompleted && (
              <span className="text-[10px] bg-amber-950 text-amber-200 px-1 rounded-sm font-bold">
                +10⭐
              </span>
            )}
          </button>

          {/* Achievements Button */}
          <button
            type="button"
            onClick={onOpenAchievements}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-amber-200 bg-amber-50/80 hover:bg-amber-100 text-amber-900 font-black text-xs transition-colors cursor-pointer"
            title="実績バッジ図鑑を開く"
          >
            <span>🏅</span>
            <span className="hidden sm:inline">実績</span>
            <span className="text-[10px] bg-amber-200 text-amber-950 px-1.5 py-0.2 rounded-full font-bold">
              {unlockedBadgesCount}
            </span>
          </button>

          {/* Mute/Sound toggle */}
          <button
            type="button"
            onClick={onToggleMute}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isMuted
                ? 'bg-rose-50 border-rose-200 text-rose-500 hover:bg-rose-100'
                : 'bg-sky-50 border-sky-200 text-sky-600 hover:bg-sky-100'
            }`}
            title={isMuted ? '音声をオンにする' : '音声をミュートする'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Stars */}
          <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 font-bold text-xs">
            <Sparkles className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span className="font-black text-sm">{stars}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
