import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { KanaItem, FishSpecies } from '../types';
import { GOJUON_LIST, FISH_SPECIES_LIST } from '../data/japaneseData';
import { FishSvg } from './FishSvg';
import { LetterCard } from './LetterCard';
import {
  playCatchSuccess,
  playSplash,
  playMiss,
  playFanfare,
  speakJapanese,
  speakLetter,
} from '../utils/audio';
import { Sparkles, ArrowRightLeft, RefreshCw, Volume2, Trophy, Star } from 'lucide-react';

interface PairMatchGameProps {
  onMatchSuccess: (kana: KanaItem) => void;
  stars: number;
}

interface MatchFish {
  id: string;
  kana: KanaItem;
  species: FishSpecies;
  x: number;
  y: number;
  direction: 1 | -1;
  speed: number;
}

export const PairMatchGame: React.FC<PairMatchGameProps> = ({
  onMatchSuccess,
  stars,
}) => {
  // Mode: show Hiragana, catch Katakana (or show Katakana, catch Hiragana)
  const [directionMode, setDirectionMode] = useState<'h2k' | 'k2h'>('h2k');
  const [targetKana, setTargetKana] = useState<KanaItem>(GOJUON_LIST[0]);
  const [fishes, setFishes] = useState<MatchFish[]>([]);
  const [celebrationPair, setCelebrationPair] = useState<KanaItem | null>(null);

  // Pick random target
  const pickTarget = () => {
    const random = GOJUON_LIST[Math.floor(Math.random() * GOJUON_LIST.length)];
    setTargetKana(random);
    setCelebrationPair(null);

    const questionChar = directionMode === 'h2k' ? random.hiragana : random.katakana;
    const answerType = directionMode === 'h2k' ? 'カタカナ' : 'ひらがな';
    speakJapanese(`「${questionChar}」とおなじ${answerType}をつろう！`, 0.9, 1.15);
  };

  useEffect(() => {
    pickTarget();
  }, [directionMode]);

  // Spawn swimming fish pool for pair match
  useEffect(() => {
    if (!targetKana) return;

    // Distractor kana
    const distractors = GOJUON_LIST.filter((k) => k.id !== targetKana.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);

    const pool = [targetKana, targetKana, ...distractors];
    const newFishes: MatchFish[] = pool.map((k, i) => {
      const species = FISH_SPECIES_LIST[i % FISH_SPECIES_LIST.length];
      const dir: 1 | -1 = i % 2 === 0 ? 1 : -1;
      return {
        id: `match-fish-${i}-${Date.now()}`,
        kana: k,
        species,
        x: dir === 1 ? -12 - i * 16 : 112 + i * 16,
        y: 28 + (i % 4) * 16,
        direction: dir,
        speed: 0.11 + (i % 3) * 0.03,
      };
    });

    setFishes(newFishes);
  }, [targetKana]);

  // Swim loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = (currentTime - lastTime) / 16.66;
      lastTime = currentTime;

      setFishes((prev) =>
        prev.map((fish) => {
          let newX = fish.x + fish.direction * fish.speed * dt;
          if (fish.direction === 1 && newX > 115) {
            newX = -15;
          } else if (fish.direction === -1 && newX < -15) {
            newX = 115;
          }
          return { ...fish, x: newX };
        })
      );

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleCatchFish = (fish: MatchFish) => {
    if (fish.kana.id === targetKana.id) {
      // MATCH FOUND!
      playCatchSuccess();
      playSplash();
      setCelebrationPair(targetKana);

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.4 },
      });

      speakJapanese(
        `大正解！ひらがなの「${targetKana.hiragana}」と、カタカナの「${targetKana.katakana}」！`,
        0.9,
        1.2
      );

      onMatchSuccess(targetKana);

      setTimeout(() => {
        pickTarget();
      }, 2200);
    } else {
      // MISMATCH
      playMiss();
      const fishChar = directionMode === 'h2k' ? fish.kana.katakana : fish.kana.hiragana;
      speakJapanese(`これは「${fishChar}」だよ。もういちどさがそう！`, 0.9, 1.1);
    }
  };

  const questionChar = directionMode === 'h2k' ? targetKana.hiragana : targetKana.katakana;
  const questionType = directionMode === 'h2k' ? 'ひらがな' : 'カタカナ';
  const targetAnswerType = directionMode === 'h2k' ? 'カタカナ' : 'ひらがな';

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto space-y-4">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/95 p-3.5 rounded-2xl border border-sky-100 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-sky-100 rounded-xl flex items-center">
            <button
              type="button"
              onClick={() => setDirectionMode('h2k')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                directionMode === 'h2k' ? 'bg-white text-sky-800 shadow-sm' : 'text-slate-600'
              }`}
            >
              ひらがな ➔ カタカナ
            </button>
            <button
              type="button"
              onClick={() => setDirectionMode('k2h')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                directionMode === 'k2h' ? 'bg-white text-sky-800 shadow-sm' : 'text-slate-600'
              }`}
            >
              カタカナ ➔ ひらがな
            </button>
          </div>

          <button
            type="button"
            onClick={pickTarget}
            className="p-1.5 text-sky-600 hover:text-sky-800 hover:bg-sky-100 rounded-lg cursor-pointer transition-colors"
            title="べつの文字"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-xl border border-amber-200 text-amber-700 font-bold text-sm">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>{stars} 星</span>
        </div>
      </div>

      {/* Target Mission Banner */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-5 rounded-3xl shadow-lg border-b-4 border-indigo-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/30 backdrop-blur-sm">
            <ArrowRightLeft className="w-7 h-7 text-yellow-300" />
          </div>
          <div>
            <div className="text-xs font-semibold text-purple-100 flex items-center gap-1">
              <span>へんしんペア釣り</span>
              <span>・</span>
              <span>{questionType}とおなじ音の{targetAnswerType}をつろう！</span>
            </div>
            <div className="text-2xl font-black flex items-center gap-2">
              <span>「{questionChar}」とおなじ音の魚はどれ？</span>
              <button
                type="button"
                onClick={() => speakLetter(questionChar)}
                className="p-1 bg-white/20 hover:bg-white/30 rounded-lg cursor-pointer"
              >
                <Volume2 className="w-5 h-5 text-yellow-200" />
              </button>
            </div>
          </div>
        </div>

        {/* Big Question Card */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-purple-100 mb-1">
              {questionType}
            </span>
            <div className="w-16 h-20 bg-white text-slate-800 rounded-2xl flex items-center justify-center text-4xl font-black shadow-lg border-2 border-yellow-300 font-sans">
              {questionChar}
            </div>
          </div>

          <div className="text-2xl font-black text-yellow-300">＝</div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-purple-100 mb-1">
              つる魚 ({targetAnswerType})
            </span>
            <div className="w-16 h-20 bg-white/20 border-2 border-dashed border-white/60 rounded-2xl flex items-center justify-center text-3xl font-black text-yellow-200">
              ?
            </div>
          </div>
        </div>
      </div>

      {/* Ocean Fishing Stage */}
      <div className="relative w-full h-[480px] rounded-3xl overflow-hidden border-4 border-indigo-300/80 shadow-2xl bg-gradient-to-b from-sky-400 via-indigo-600 to-purple-950 select-none">
        {/* Swimming target-answer fish */}
        {fishes.map((fish) => {
          const displayChar =
            directionMode === 'h2k' ? fish.kana.katakana : fish.kana.hiragana;
          const isTarget = fish.kana.id === targetKana.id;

          return (
            <div
              key={fish.id}
              onClick={() => handleCatchFish(fish)}
              className="absolute -translate-y-1/2 flex items-center gap-1 cursor-pointer transition-transform duration-100 hover:scale-110 active:scale-95 group z-20"
              style={{
                left: `${fish.x}%`,
                top: `${fish.y}%`,
              }}
            >
              <FishSvg
                species={fish.species}
                direction={fish.direction}
                width={76}
                height={48}
              />

              <div
                className={`relative -ml-3 flex items-center justify-center w-11 h-11 rounded-xl border-2 font-black text-2xl shadow-lg transition-transform ${
                  isTarget
                    ? 'bg-amber-300 border-amber-500 text-amber-950 ring-4 ring-amber-300/70'
                    : 'bg-white/95 border-purple-200 text-purple-950'
                }`}
              >
                <span className="font-sans leading-none">{displayChar}</span>
                <div className="absolute -top-1.5 w-2 h-2 rounded-full border border-amber-500 bg-white" />
              </div>
            </div>
          );
        })}

        {/* Celebration Popup when matched */}
        {celebrationPair && (
          <div className="absolute inset-0 bg-purple-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border-4 border-amber-400 flex flex-col items-center">
              <div className="flex items-center gap-1 text-amber-500 font-bold text-sm mb-2">
                <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
                <span>へんしん大成功！</span>
                <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
              </div>

              <div className="flex items-center justify-center gap-4 my-4">
                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-slate-400 mb-1">ひらがな</span>
                  <div className="w-16 h-20 bg-sky-100 border-2 border-sky-400 text-sky-950 rounded-2xl flex items-center justify-center text-4xl font-black font-sans shadow-md">
                    {celebrationPair.hiragana}
                  </div>
                </div>

                <div className="text-3xl font-black text-amber-500">↔</div>

                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-slate-400 mb-1">カタカナ</span>
                  <div className="w-16 h-20 bg-amber-100 border-2 border-amber-400 text-amber-950 rounded-2xl flex items-center justify-center text-4xl font-black font-sans shadow-md">
                    {celebrationPair.katakana}
                  </div>
                </div>
              </div>

              <p className="text-base font-bold text-slate-700 mb-4">
                よみかた: 「{celebrationPair.hiragana}」({celebrationPair.romaji})
              </p>

              <button
                type="button"
                onClick={() => speakLetter(celebrationPair.hiragana)}
                className="w-full py-2.5 px-4 bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Volume2 className="w-5 h-5" />
                <span>音を聞く</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
