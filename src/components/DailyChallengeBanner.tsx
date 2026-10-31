import React from 'react';
import { TargetWord, DailyChallengeState } from '../types';
import { getFormattedJapaneseDate, DAILY_BONUS_STARS } from '../utils/dailyChallenge';
import { Calendar, Star, CheckCircle2, ChevronRight, Flame } from 'lucide-react';

interface DailyChallengeBannerProps {
  dailyState: DailyChallengeState;
  targetWord: TargetWord;
  onOpenModal: () => void;
}

export const DailyChallengeBanner: React.FC<DailyChallengeBannerProps> = ({
  dailyState,
  targetWord,
  onOpenModal,
}) => {
  const formattedDate = getFormattedJapaneseDate(dailyState.dateStr);

  return (
    <div
      onClick={onOpenModal}
      className={`w-full max-w-5xl mx-auto rounded-2xl p-3 sm:px-5 sm:py-3 cursor-pointer transition-all duration-200 border-2 shadow-xs hover:shadow-md flex items-center justify-between gap-3 ${
        dailyState.isCompleted
          ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border-emerald-300 hover:border-emerald-400'
          : 'bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border-amber-300 hover:border-amber-400 hover:-translate-y-0.5'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Date / Status Icon */}
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
            dailyState.isCompleted
              ? 'bg-emerald-500 text-white shadow-xs'
              : 'bg-amber-400 text-amber-950 shadow-xs'
          }`}
        >
          {dailyState.isCompleted ? '💮' : targetWord.emoji}
        </div>

        {/* Challenge details */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate} の目標</span>
            </span>

            {dailyState.streakCount > 0 && (
              <span className="text-[10px] font-black text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <Flame className="w-3 h-3 fill-rose-500 text-rose-500" />
                <span>{dailyState.streakCount}日連続</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-black text-slate-900 font-sans">
              「{targetWord.word}」をつかまえよう！
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">
              ({targetWord.meaning})
            </span>
          </div>
        </div>
      </div>

      {/* Reward / Status Badge */}
      <div className="flex items-center gap-3 shrink-0">
        {dailyState.isCompleted ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100/90 text-emerald-800 font-black text-xs border border-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">ボーナス獲得済！</span>
            <span>達成！</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs shadow-xs border border-amber-500">
            <Star className="w-4 h-4 fill-amber-950 text-amber-950" />
            <span>ボーナス +{DAILY_BONUS_STARS} ⭐</span>
          </div>
        )}

        <ChevronRight className="w-4 h-4 text-slate-400" />
      </div>
    </div>
  );
};
