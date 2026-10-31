import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { KanaItem, TargetWord } from '../types';
import { GOJUON_LIST, COMBINABLE_WORDS, getKanaByChar } from '../data/japaneseData';
import { LetterCard } from './LetterCard';
import {
  playCatchSuccess,
  playFanfare,
  playBubble,
  speakJapanese,
  speakLetter,
} from '../utils/audio';
import { Sparkles, Trash2, Plus, Volume2, Wand2, Star, Fish } from 'lucide-react';

interface CardCombinerProps {
  caughtLetterCounts: Record<string, number>;
  onWordDiscovered: (word: string) => void;
}

export const CardCombiner: React.FC<CardCombinerProps> = ({
  caughtLetterCounts,
  onWordDiscovered,
}) => {
  const [combinerSlots, setCombinerSlots] = useState<KanaItem[]>([]);
  const [createdResult, setCreatedResult] = useState<{
    word: string;
    katakana: string;
    meaning: string;
    emoji: string;
  } | null>(null);

  // Available letter cards: either from caught inventory, or all Gojuon if inventory is empty
  const hasInventory = Object.values(caughtLetterCounts).some((c) => c > 0);
  const cardList = hasInventory
    ? GOJUON_LIST.filter((k) => (caughtLetterCounts[k.id] || 0) > 0)
    : GOJUON_LIST.slice(0, 25);

  // Add letter to slot
  const handleAddLetter = (kana: KanaItem) => {
    if (combinerSlots.length >= 5) return;
    playBubble();
    speakLetter(kana.hiragana);
    setCombinerSlots([...combinerSlots, kana]);
    setCreatedResult(null);
  };

  // Remove letter from slot
  const handleRemoveSlot = (index: number) => {
    playBubble();
    setCombinerSlots(combinerSlots.filter((_, i) => i !== index));
    setCreatedResult(null);
  };

  // Clear slots
  const handleClearSlots = () => {
    setCombinerSlots([]);
    setCreatedResult(null);
  };

  // Combine and evaluate
  const handleCombine = () => {
    if (combinerSlots.length === 0) return;

    const assembledHiragana = combinerSlots.map((k) => k.hiragana).join('');
    const assembledKatakana = combinerSlots.map((k) => k.katakana).join('');

    // Check if word exists in combinable dictionary
    const foundWord = COMBINABLE_WORDS.find(
      (w) => w.word === assembledHiragana || w.katakana === assembledKatakana
    );

    if (foundWord) {
      // SUCCESSFUL WORD CREATION!
      playFanfare();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5 },
      });
      setCreatedResult(foundWord);
      speakJapanese(`できた！「${foundWord.word}」！${foundWord.meaning}`, 0.9, 1.2);
      onWordDiscovered(foundWord.word);
    } else {
      // Free phonetic combination
      playCatchSuccess();
      setCreatedResult({
        word: assembledHiragana,
        katakana: assembledKatakana,
        meaning: 'オリジナルの言葉をつくったよ！',
        emoji: '✨',
      });
      speakJapanese(assembledHiragana, 0.85, 1.15);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto space-y-6">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-5 rounded-3xl shadow-lg border-b-4 border-orange-700 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/30 backdrop-blur-sm">
            🎣
          </div>
          <div>
            <div className="text-xs font-semibold text-amber-100 flex items-center gap-1">
              <span>文字あわせ工房</span>
              <span>・</span>
              <span>カードをならべて言葉を作ろう！</span>
            </div>
            <h2 className="text-2xl font-black">文字カード合体スロット</h2>
          </div>
        </div>

        <div className="text-xs font-semibold bg-white/20 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-white/30 text-amber-50">
          {hasInventory
            ? `つかまえた文字カード: ${cardList.length}種類`
            : '練習用の文字カードをつかえるよ！'}
        </div>
      </div>

      {/* The Combination Workbench (Slots) */}
      <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-amber-200">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-bold text-slate-600 flex items-center gap-1.5">
            <Wand2 className="w-4 h-4 text-amber-500" />
            <span>ならべたカード（タップして外せます）</span>
          </span>

          {combinerSlots.length > 0 && (
            <button
              type="button"
              onClick={handleClearSlots}
              className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-rose-50 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ぜんぶ消す</span>
            </button>
          )}
        </div>

        {/* Card Drop Slots */}
        <div className="flex flex-wrap items-center justify-center gap-3 min-h-[120px] p-4 bg-amber-50/60 rounded-2xl border-2 border-dashed border-amber-300 mb-6">
          {combinerSlots.length === 0 ? (
            <div className="text-center text-slate-400 py-4 font-semibold text-sm">
              したの一覧から文字カードをタップして、ここに並べてね！
            </div>
          ) : (
            combinerSlots.map((kana, idx) => (
              <div
                key={`${kana.id}-${idx}`}
                onClick={() => handleRemoveSlot(idx)}
                className="relative group cursor-pointer animate-fade-in"
                title="タップして外す"
              >
                <LetterCard
                  kana={kana}
                  size="lg"
                  highlighted={true}
                  className="bg-amber-100 border-amber-400 shadow-md group-hover:scale-95 group-hover:bg-rose-50 group-hover:border-rose-400 transition-all"
                />
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-black shadow opacity-0 group-hover:opacity-100 transition-opacity">
                  ✕
                </div>
              </div>
            ))
          )}
        </div>

        {/* Combine Action Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleCombine}
            disabled={combinerSlots.length === 0}
            className={`px-8 py-3.5 rounded-2xl font-black text-lg shadow-xl flex items-center gap-2 cursor-pointer transition-all duration-150 ${
              combinerSlots.length > 0
                ? 'bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-amber-950 border-2 border-amber-200 hover:scale-105 active:scale-95 shadow-orange-900/20'
                : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-5 h-5 text-amber-950" />
            <span>文字を合体する！(よみあげる)</span>
          </button>
        </div>

        {/* Discovery Result Card */}
        {createdResult && (
          <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-amber-100 via-orange-100 to-rose-100 border-2 border-amber-300 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-center gap-4">
              <span className="text-5xl">{createdResult.emoji}</span>
              <div>
                <div className="text-xs font-bold text-amber-800">ことばが完成！</div>
                <div className="text-3xl font-black text-slate-900 flex items-center gap-2 font-sans">
                  <span>{createdResult.word}</span>
                  <span className="text-lg text-slate-500 font-normal font-sans">
                    ({createdResult.katakana})
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-600 mt-1">
                  {createdResult.meaning}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => speakJapanese(createdResult.word, 0.9, 1.15)}
              className="py-2.5 px-4 bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 font-bold rounded-xl flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
            >
              <Volume2 className="w-5 h-5 text-amber-600" />
              <span>もういちど聞く</span>
            </button>
          </div>
        )}
      </div>

      {/* Letter Inventory / Card Selection Deck */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-sky-100">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <Fish className="w-4 h-4 text-sky-500" />
            <span>えらべる文字カード（タップしてスロットへ追加）</span>
          </span>
          <span className="text-xs text-slate-400">
            {cardList.length} まいのカード
          </span>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2.5 max-h-[320px] overflow-y-auto p-2">
          {cardList.map((kana) => {
            const count = caughtLetterCounts[kana.id] || 0;
            return (
              <div key={kana.id} className="relative group flex flex-col items-center">
                <LetterCard
                  kana={kana}
                  size="md"
                  onClick={() => handleAddLetter(kana)}
                  className="hover:scale-105 active:scale-95"
                />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 text-[9px] font-black px-1.5 py-0.2 rounded-full bg-sky-600 text-white border border-white shadow">
                    ×{count}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
