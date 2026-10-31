import React from 'react';
import { TargetWord, DailyChallengeState } from '../types';
import {
  getFormattedJapaneseDate,
  DAILY_BONUS_STARS,
  getTodayDateString,
} from '../utils/dailyChallenge';
import { speakJapanese } from '../utils/audio';
import {
  Calendar,
  Sparkles,
  Trophy,
  Flame,
  Volume2,
  CheckCircle2,
  ArrowRight,
  Star,
  Award,
} from 'lucide-react';

interface DailyChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyState: DailyChallengeState;
  targetWord: TargetWord;
  onStartChallenge: (word: TargetWord) => void;
}

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  isOpen,
  onClose,
  dailyState,
  targetWord,
  onStartChallenge,
}) => {
  if (!isOpen) return null;

  const todayStr = dailyState.dateStr;
  const formattedDate = getFormattedJapaneseDate(todayStr);

  // Generate last 7 days for the streak stamp card
  const pastDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(todayStr);
    d.setDate(d.getDate() - (6 - i));
    const str = getTodayDateString(d);
    const dayNum = d.getDate();
    const isToday = str === todayStr;
    const isCleared = !!dailyState.history[str];
    return { str, dayNum, isToday, isCleared };
  });

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full text-slate-800 shadow-2xl border-4 border-amber-400 relative overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-black cursor-pointer transition-colors z-10"
        >
          ✕
        </button>

        {/* Top Header */}
        <div className="flex items-center gap-2.5 text-xs font-bold text-amber-700 bg-amber-50 px-3.5 py-1.5 rounded-xl border border-amber-200 w-fit mb-4">
          <Calendar className="w-4 h-4 text-amber-600" />
          <span>{formattedDate} のデイリーチャレンジ</span>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
            今日の目標単語
          </h2>
          <p className="text-xs font-semibold text-slate-500">
            今日の魚の文字カードをあつめて、ボーナススターをゲットしよう！
          </p>
        </div>

        {/* Target Word Showcase Card */}
        <div
          className={`relative rounded-3xl p-6 border-3 shadow-md mb-6 transition-all ${
            dailyState.isCompleted
              ? 'bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 border-amber-400'
              : 'bg-gradient-to-br from-sky-50 via-teal-50/50 to-blue-50 border-sky-300'
          }`}
        >
          {/* Completed Stamp Watermark if cleared */}
          {dailyState.isCompleted && (
            <div className="absolute top-3 right-4 rotate-12 bg-rose-500 text-white font-black text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1 animate-pulse">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>本日クリア！💮</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white shadow-md border-2 border-amber-200 flex items-center justify-center text-5xl">
              {targetWord.emoji}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-3xl font-black text-slate-900 font-sans">
                  {targetWord.word}
                </span>
                <span className="text-lg font-bold text-slate-400 font-sans">
                  ({targetWord.katakana})
                </span>
                <button
                  type="button"
                  onClick={() =>
                    speakJapanese(`きょうのもくひょうは、${targetWord.word}！`)
                  }
                  className="p-1.5 text-sky-600 hover:text-sky-800 hover:bg-sky-100 rounded-lg cursor-pointer transition-colors"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs font-semibold text-slate-500 mt-1">
                {targetWord.meaning}
              </p>

              {/* Letter Card Slots */}
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
                {targetWord.letters.map((char, i) => (
                  <div
                    key={i}
                    className="w-9 h-11 bg-white border-2 border-amber-400 text-amber-950 font-black text-xl rounded-xl flex items-center justify-center shadow-xs font-sans"
                  >
                    {char}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reward & Streak Details */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Bonus Star Pill */}
          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center">
              <Star className="w-5 h-5 fill-amber-950 text-amber-950" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-amber-700">クリア報酬</div>
              <div className="text-base font-black text-amber-950">
                +{DAILY_BONUS_STARS} スター！
              </div>
            </div>
          </div>

          {/* Consecutive Streak Pill */}
          <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center">
              <Flame className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-rose-700">連続クリア</div>
              <div className="text-base font-black text-rose-950">
                {dailyState.streakCount} 日連続！
              </div>
            </div>
          </div>
        </div>

        {/* Stamp Card (直近7日間の記録) */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6">
          <div className="text-xs font-bold text-slate-500 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>今週のスタンプカード</span>
            </span>
            <span>毎日チャレンジしよう！</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center">
            {pastDays.map((day) => (
              <div
                key={day.str}
                className={`py-2 px-1 rounded-xl flex flex-col items-center border transition-all ${
                  day.isToday
                    ? 'border-amber-400 bg-amber-50/80 font-black'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <span className="text-[10px] text-slate-400 font-semibold">
                  {day.dayNum}日
                </span>
                <span className="text-lg my-0.5">
                  {day.isCleared ? '💮' : day.isToday ? '🎯' : '⚪'}
                </span>
                <span className="text-[9px] text-slate-400">
                  {day.isCleared ? 'クリア' : day.isToday ? 'きょう' : '-'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div>
          {dailyState.isCompleted ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onStartChallenge(targetWord);
                }}
                className="flex-1 py-3 px-4 bg-sky-100 hover:bg-sky-200 text-sky-800 font-black text-sm rounded-2xl cursor-pointer transition-colors flex items-center justify-center gap-2"
              >
                <span>もう一度あそぶ</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-sm rounded-2xl cursor-pointer shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <span>とじる</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                onStartChallenge(targetWord);
              }}
              className="w-full py-4 px-6 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-400 text-amber-950 font-black text-lg rounded-2xl shadow-xl border-2 border-amber-200 cursor-pointer flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-amber-900/20"
            >
              <Sparkles className="w-6 h-6 text-amber-950 animate-spin" />
              <span>「{targetWord.word}」の釣りをスタート！</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
