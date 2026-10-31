import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { TargetWord, KanaItem, AlphabetMode, FishSpecies } from '../types';
import { TARGET_WORDS, GOJUON_LIST, FISH_SPECIES_LIST, getKanaByChar } from '../data/japaneseData';
import { FishSvg } from './FishSvg';
import { LetterCard } from './LetterCard';
import {
  playCatchSuccess,
  playFanfare,
  playSplash,
  playReel,
  playMiss,
  speakLetter,
  speakJapanese,
} from '../utils/audio';
import { Sparkles, Trophy, ChevronRight, Volume2, Anchor, Star, RefreshCw } from 'lucide-react';

interface WordCraftingGameProps {
  onCompleteWord: (word: TargetWord) => void;
  stars: number;
  initialTargetWordId?: string;
  dailyTargetWordId?: string;
  isDailyCompleted?: boolean;
  onDailyChallengeCleared?: () => void;
}

interface SwimmingLetterFish {
  id: string;
  char: string;
  kanaItem: KanaItem;
  species: FishSpecies;
  x: number;
  y: number;
  direction: 1 | -1;
  speed: number;
  scale: number;
  wobble: number;
}

export const WordCraftingGame: React.FC<WordCraftingGameProps> = ({
  onCompleteWord,
  stars,
  initialTargetWordId,
  dailyTargetWordId,
  isDailyCompleted = false,
  onDailyChallengeCleared,
}) => {
  const [alphabetMode, setAlphabetMode] = useState<AlphabetMode>('hiragana');
  const [selectedWordIndex, setSelectedWordIndex] = useState<number>(() => {
    if (initialTargetWordId) {
      const idx = TARGET_WORDS.findIndex((w) => w.id === initialTargetWordId);
      if (idx !== -1) return idx;
    }
    return 0;
  });
  const [filledLetters, setFilledLetters] = useState<string[]>([]);
  const [swimmingFish, setSwimmingFish] = useState<SwimmingLetterFish[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [caughtAnimChar, setCaughtAnimChar] = useState<string | null>(null);

  // Sync when initialTargetWordId prop changes
  useEffect(() => {
    if (initialTargetWordId) {
      const idx = TARGET_WORDS.findIndex((w) => w.id === initialTargetWordId);
      if (idx !== -1 && idx !== selectedWordIndex) {
        setSelectedWordIndex(idx);
        setFilledLetters([]);
        setIsCompleted(false);
      }
    }
  }, [initialTargetWordId]);

  const target = TARGET_WORDS[selectedWordIndex];
  const targetChars = alphabetMode === 'katakana' ? target.katakanaLetters : target.letters;
  const currentNeededChar = targetChars[filledLetters.length] || null;

  // Change target word or alphabet mode
  const handleSelectWord = (idx: number) => {
    setSelectedWordIndex(idx);
    setFilledLetters([]);
    setIsCompleted(false);
    const w = TARGET_WORDS[idx];
    const wordText = alphabetMode === 'katakana' ? w.katakana : w.word;
    speakJapanese(`「${wordText}」をつくろう！`, 0.9, 1.15);
  };

  // Switch alphabet
  useEffect(() => {
    setFilledLetters([]);
    setIsCompleted(false);
    const wordText = alphabetMode === 'katakana' ? target.katakana : target.word;
    speakJapanese(`「${wordText}」をつくろう！`, 0.9, 1.15);
  }, [alphabetMode]);

  // Generate swimming letter fish pool for this word
  useEffect(() => {
    if (!target) return;

    // Distractor characters from Gojuon
    const distractors = GOJUON_LIST.slice(0, 20);

    const neededKana = targetChars.map((ch) => {
      const found = getKanaByChar(ch);
      return {
        char: ch,
        kana: found || GOJUON_LIST[0],
      };
    });

    const newFish: SwimmingLetterFish[] = [];

    // Ensure needed characters are in the water, plus distractors
    const charPool = [
      ...neededKana,
      ...neededKana, // duplicate so they appear regularly
      ...distractors.map((k) => ({
        char: alphabetMode === 'katakana' ? k.katakana : k.hiragana,
        kana: k,
      })),
    ];

    charPool.slice(0, 8).forEach((item, i) => {
      const species = FISH_SPECIES_LIST[i % FISH_SPECIES_LIST.length];
      const dir: 1 | -1 = i % 2 === 0 ? 1 : -1;
      newFish.push({
        id: `word-fish-${i}-${Date.now()}`,
        char: item.char,
        kanaItem: item.kana,
        species,
        x: dir === 1 ? -10 - i * 14 : 110 + i * 14,
        y: 28 + (i % 4) * 16,
        direction: dir,
        speed: 0.12 + (i % 3) * 0.03,
        scale: 0.9 + (i % 2) * 0.15,
        wobble: i * 1.5,
      });
    });

    setSwimmingFish(newFish);
  }, [selectedWordIndex, alphabetMode]);

  // Swimming animation loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = (currentTime - lastTime) / 16.66;
      lastTime = currentTime;

      setSwimmingFish((prev) =>
        prev.map((fish) => {
          let newX = fish.x + fish.direction * fish.speed * dt;

          if (fish.direction === 1 && newX > 115) {
            newX = -15;
            // Respawn with needed or distractor
            const randomChar = Math.random() < 0.6 && currentNeededChar
              ? currentNeededChar
              : targetChars[Math.floor(Math.random() * targetChars.length)];
            const foundKana = getKanaByChar(randomChar) || fish.kanaItem;
            return {
              ...fish,
              x: newX,
              char: randomChar,
              kanaItem: foundKana,
              y: 28 + Math.random() * 52,
            };
          } else if (fish.direction === -1 && newX < -15) {
            newX = 115;
            const randomChar = Math.random() < 0.6 && currentNeededChar
              ? currentNeededChar
              : targetChars[Math.floor(Math.random() * targetChars.length)];
            const foundKana = getKanaByChar(randomChar) || fish.kanaItem;
            return {
              ...fish,
              x: newX,
              char: randomChar,
              kanaItem: foundKana,
              y: 28 + Math.random() * 52,
            };
          }

          return {
            ...fish,
            x: newX,
            wobble: fish.wobble + 0.05 * dt,
          };
        })
      );

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [currentNeededChar, targetChars]);

  // Handle fishing a letter fish
  const handleCatchLetterFish = (fish: SwimmingLetterFish) => {
    if (isCompleted) return;

    if (fish.char === currentNeededChar) {
      // MATCH!
      playCatchSuccess();
      playSplash();
      setCaughtAnimChar(fish.char);
      speakLetter(fish.char);

      const nextFilled = [...filledLetters, fish.char];
      setFilledLetters(nextFilled);

      // Check if word is complete!
      if (nextFilled.length === targetChars.length) {
        setIsCompleted(true);
        const isDaily = target.id === dailyTargetWordId && !isDailyCompleted;

        setTimeout(() => {
          playFanfare();
          confetti({
            particleCount: isDaily ? 160 : 100,
            spread: isDaily ? 100 : 90,
            origin: { y: 0.4 },
          });
          const fullWord = alphabetMode === 'katakana' ? target.katakana : target.word;
          if (isDaily) {
            speakJapanese(`大成功！今日の目標「${fullWord}」を達成！ボーナススター獲得！`, 0.9, 1.2);
            onDailyChallengeCleared?.();
          } else {
            speakJapanese(`大成功！${fullWord}がつれたよ！`, 0.9, 1.2);
          }
          onCompleteWord(target);
        }, 500);
      }

      setTimeout(() => setCaughtAnimChar(null), 1000);
    } else {
      // WRONG LETTER
      playMiss();
      speakJapanese(`これは「${fish.char}」だよ。「${currentNeededChar}」をつろう！`, 0.9, 1.1);
    }
  };

  const currentWordText = alphabetMode === 'katakana' ? target.katakana : target.word;

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto space-y-4">
      {/* Top Header: Mode & Target selection */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/95 p-3.5 rounded-2xl border border-sky-100 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-sky-100 rounded-xl flex items-center">
            <button
              type="button"
              onClick={() => setAlphabetMode('hiragana')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                alphabetMode === 'hiragana' ? 'bg-white text-sky-800 shadow-sm' : 'text-slate-600'
              }`}
            >
              ひらがな
            </button>
            <button
              type="button"
              onClick={() => setAlphabetMode('katakana')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                alphabetMode === 'katakana' ? 'bg-white text-sky-800 shadow-sm' : 'text-slate-600'
              }`}
            >
              カタカナ
            </button>
          </div>

          <span className="text-xs font-bold text-slate-500 hidden sm:inline">
            ・ 文字カードをあわせて魚をつろう！
          </span>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-xl border border-amber-200 text-amber-700 font-bold text-sm">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>{stars} 星</span>
        </div>
      </div>

      {/* Target Fish Selection Bar (Horizontal scroll of sea creatures) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
        {TARGET_WORDS.map((w, idx) => {
          const isCurrent = idx === selectedWordIndex;
          const isDaily = w.id === dailyTargetWordId;
          const displayW = alphabetMode === 'katakana' ? w.katakana : w.word;
          return (
            <button
              key={w.id}
              type="button"
              onClick={() => handleSelectWord(idx)}
              className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl border-2 transition-all cursor-pointer shrink-0 text-left ${
                isCurrent
                  ? 'bg-sky-500 border-sky-600 text-white shadow-md -translate-y-0.5'
                  : isDaily
                  ? 'bg-amber-50 border-amber-300 text-slate-800 hover:border-amber-400'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-sky-300 hover:bg-sky-50'
              }`}
            >
              {isDaily && (
                <span className="absolute -top-2 -right-1 bg-amber-400 text-amber-950 text-[9px] font-black px-1.5 py-0.2 rounded-full border border-amber-500 shadow-xs">
                  {isDailyCompleted ? '💮' : '🎯今日'}
                </span>
              )}
              <span className="text-xl">{w.emoji}</span>
              <div>
                <div className="text-sm font-black leading-tight flex items-center gap-1">
                  <span>{displayW}</span>
                </div>
                <div
                  className={`text-[10px] ${
                    isCurrent ? 'text-sky-100' : 'text-slate-400'
                  }`}
                >
                  {w.letters.length}もじ
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Word Crafting Workbench Banner */}
      <div className="bg-gradient-to-r from-teal-500 via-sky-600 to-blue-600 text-white p-5 rounded-3xl shadow-lg border-b-4 border-blue-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-white/30 backdrop-blur-sm">
            {target.emoji}
          </div>
          <div>
            <div className="text-xs font-semibold text-teal-100 flex items-center gap-1">
              <span>つりたい魚</span>
              <span>・</span>
              <span>{target.meaning}</span>
            </div>
            <div className="text-2xl md:text-3xl font-black flex items-center gap-2">
              <span>{currentWordText}</span>
              <button
                type="button"
                onClick={() => speakJapanese(currentWordText, 0.9, 1.1)}
                className="p-1 bg-white/20 hover:bg-white/30 rounded-lg cursor-pointer transition-transform active:scale-95"
                title="音声をきく"
              >
                <Volume2 className="w-5 h-5 text-yellow-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Word Letter Slots (The Puzzle) */}
        <div className="flex items-center gap-3">
          {targetChars.map((char, index) => {
            const isFilled = index < filledLetters.length;
            const isCurrentNeeded = index === filledLetters.length;
            const kana = getKanaByChar(char) || GOJUON_LIST[0];

            return (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`relative w-16 h-20 rounded-2xl flex flex-col items-center justify-center font-black text-3xl shadow-md transition-all duration-300 border-2 ${
                    isFilled
                      ? 'bg-amber-400 border-amber-500 text-amber-950 scale-105 shadow-amber-900/30'
                      : isCurrentNeeded
                      ? 'bg-white/90 border-yellow-300 text-slate-400 ring-4 ring-yellow-300/80 animate-pulse'
                      : 'bg-white/40 border-white/40 text-white/50 border-dashed'
                  }`}
                >
                  {isFilled ? (
                    <span className="font-sans leading-none">{char}</span>
                  ) : isCurrentNeeded ? (
                    <span className="text-sm font-bold text-sky-800">つぎ！</span>
                  ) : (
                    <span className="text-lg opacity-40">?</span>
                  )}

                  {/* Little number indicator */}
                  <span className="absolute -bottom-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-900/80 text-white">
                    {index + 1}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Underwater Fishing Ocean Canvas */}
      <div className="relative w-full h-[480px] rounded-3xl overflow-hidden border-4 border-teal-400/80 shadow-2xl bg-gradient-to-b from-sky-400 via-teal-600 to-blue-950 select-none">
        {/* Surface light caustics */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

        {/* Seaweed & corals */}
        <div className="absolute bottom-0 left-12 flex items-end gap-3 opacity-60 pointer-events-none">
          <div className="w-4 h-24 bg-emerald-600 rounded-t-full rotate-6" />
          <div className="w-3 h-16 bg-teal-500 rounded-t-full -rotate-6" />
        </div>
        <div className="absolute bottom-0 right-20 flex items-end gap-2 opacity-60 pointer-events-none">
          <div className="w-4 h-28 bg-teal-600 rounded-t-full -rotate-12" />
          <div className="w-3 h-20 bg-emerald-500 rounded-t-full rotate-6" />
        </div>

        {/* Floating instructions */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none bg-sky-900/60 backdrop-blur-xs text-white px-3 py-1.5 rounded-xl border border-white/20 text-xs font-bold flex items-center gap-1.5">
          <Anchor className="w-3.5 h-3.5 text-yellow-300" />
          <span>
            {currentNeededChar
              ? `つぎは「${currentNeededChar}」の文字カードをもつ魚をタップして釣ろう！`
              : '全部つれたよ！大漁！'}
          </span>
        </div>

        {/* Swimming Letter Fish */}
        {swimmingFish.map((fish) => {
          const isTarget = fish.char === currentNeededChar;
          const wobbleY = Math.sin(fish.wobble) * 5;

          return (
            <div
              key={fish.id}
              onClick={() => handleCatchLetterFish(fish)}
              className="absolute -translate-y-1/2 flex items-center gap-1 cursor-pointer transition-transform duration-100 hover:scale-110 active:scale-95 group z-20"
              style={{
                left: `${fish.x}%`,
                top: `${fish.y + wobbleY}%`,
                transform: `scale(${fish.scale})`,
              }}
            >
              {/* Fish SVG */}
              <FishSvg
                species={fish.species}
                direction={fish.direction}
                width={76}
                height={48}
              />

              {/* Letter Card tag */}
              <div
                className={`relative -ml-3 flex items-center justify-center w-11 h-11 rounded-xl border-2 font-black text-2xl shadow-lg transition-transform ${
                  isTarget
                    ? 'bg-amber-300 border-amber-500 text-amber-950 ring-4 ring-amber-300/80 scale-110'
                    : 'bg-white/95 border-sky-300 text-sky-950'
                }`}
              >
                <span className="font-sans leading-none">{fish.char}</span>
                <div className="absolute -top-1.5 w-2 h-2 rounded-full border border-amber-600 bg-white" />
              </div>
            </div>
          );
        })}

        {/* Caught animation popup */}
        {caughtAnimChar && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none animate-bounce">
            <div className="px-6 py-3 bg-amber-400 text-amber-950 border-4 border-white font-black text-3xl rounded-3xl shadow-2xl flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-white animate-spin" />
              <span>「{caughtAnimChar}」GET!!</span>
            </div>
          </div>
        )}

        {/* Word Completed Big Celebration Modal */}
        {isCompleted && (
          <div className="absolute inset-0 bg-blue-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border-4 border-amber-400 flex flex-col items-center">
              {target.id === dailyTargetWordId && (
                <div className="mb-3 px-4 py-1.5 bg-gradient-to-r from-amber-400 to-orange-400 text-amber-950 rounded-full font-black text-xs shadow-md border border-amber-300 flex items-center gap-1.5 animate-bounce">
                  <span>💮</span>
                  <span>今日のデイリーチャレンジ達成！ボーナス+10⭐</span>
                </div>
              )}
              <div className="text-7xl mb-3 animate-bounce">{target.emoji}</div>
              <div className="flex items-center gap-1 text-amber-500 font-bold text-sm mb-1">
                <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
                <span>すばらしい！大漁だ！</span>
                <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
              </div>

              <h2 className="text-3xl font-black text-slate-800 mb-2 font-sans">
                {currentWordText}
              </h2>
              <p className="text-sm font-semibold text-slate-500 mb-6">
                {target.meaning}
              </p>

              <div className="flex gap-2 mb-6">
                {targetChars.map((c, i) => (
                  <div
                    key={i}
                    className="w-12 h-14 bg-amber-400 text-amber-950 rounded-xl flex items-center justify-center font-black text-2xl shadow-md border-2 border-amber-500 font-sans"
                  >
                    {c}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 w-full">
                <button
                  type="button"
                  onClick={() => speakJapanese(`${currentWordText}！大成功！`)}
                  className="flex-1 py-3 px-4 bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>もういちど聞く</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const nextIdx = (selectedWordIndex + 1) % TARGET_WORDS.length;
                    handleSelectWord(nextIdx);
                  }}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-transform active:scale-95"
                >
                  <span>つぎの魚へ！</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
