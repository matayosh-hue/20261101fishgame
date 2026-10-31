import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { KanaItem, SwimmingFish, AlphabetMode } from '../types';
import { GOJUON_LIST, ROW_GROUPS, FISH_SPECIES_LIST } from '../data/japaneseData';
import { FishSvg } from './FishSvg';
import { LetterCard } from './LetterCard';
import {
  playBubble,
  playCast,
  playSplash,
  playReel,
  playCatchSuccess,
  playMiss,
  speakLetter,
  speakJapanese,
} from '../utils/audio';
import { Volume2, RefreshCw, Trophy, Sparkles, Anchor, Compass } from 'lucide-react';

interface FishingGameProps {
  onCatchKana: (kana: KanaItem) => void;
  stars: number;
}

export const FishingGame: React.FC<FishingGameProps> = ({ onCatchKana, stars }) => {
  const [alphabetMode, setAlphabetMode] = useState<AlphabetMode>('hiragana');
  const [selectedRow, setSelectedRow] = useState<string>('all'); // 'all' or 'a', 'ka', etc.
  const [currentTarget, setCurrentTarget] = useState<KanaItem>(GOJUON_LIST[0]);
  const [fishes, setFishes] = useState<SwimmingFish[]>([]);
  
  // Fishing rod & hook state
  const [rodX, setRodX] = useState<number>(50); // percentage 0 - 100
  const [hookY, setHookY] = useState<number>(18); // percentage: 18 = at surface / rod tip
  const [hookState, setHookState] = useState<'idle' | 'dropping' | 'reeling' | 'caught'>('idle');
  const [caughtFish, setCaughtFish] = useState<SwimmingFish | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; isCorrect: boolean } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Filter available kana based on selected row
  const availableKana = selectedRow === 'all'
    ? GOJUON_LIST
    : GOJUON_LIST.filter((k) => k.row === selectedRow);

  // Pick a new target
  const pickNewTarget = useCallback((targetPool = availableKana) => {
    if (targetPool.length === 0) return;
    const random = targetPool[Math.floor(Math.random() * targetPool.length)];
    setCurrentTarget(random);
    const char = alphabetMode === 'katakana' ? random.katakana : random.hiragana;
    speakJapanese(`「${char}」をつろう！`, 0.9, 1.15);
  }, [availableKana, alphabetMode]);

  // Initial setup & re-pick on row/alphabet change
  useEffect(() => {
    pickNewTarget(availableKana);
  }, [selectedRow, alphabetMode]);

  // Spawn initial swimming fish pool
  useEffect(() => {
    const initialFishes: SwimmingFish[] = [];
    const pool = availableKana.length > 0 ? availableKana : GOJUON_LIST;

    // Always ensure current target is in the fish pool!
    const numFishes = 6;
    for (let i = 0; i < numFishes; i++) {
      const kana = i === 0 ? currentTarget : pool[Math.floor(Math.random() * pool.length)];
      const species = FISH_SPECIES_LIST[Math.floor(Math.random() * FISH_SPECIES_LIST.length)];
      const direction: 1 | -1 = Math.random() > 0.5 ? 1 : -1;
      const startX = direction === 1 ? -15 - i * 15 : 115 + i * 15;
      const depthY = 32 + (i % 4) * 14 + (Math.random() * 8);

      initialFishes.push({
        id: `fish-${Date.now()}-${i}`,
        species,
        kana,
        displayMode: alphabetMode === 'katakana' ? 'katakana' : 'hiragana',
        x: startX,
        y: depthY,
        direction,
        speed: (species.baseSpeed * 0.12) + (Math.random() * 0.05),
        wobbleOffset: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.04 + Math.random() * 0.02,
        scale: 0.9 + Math.random() * 0.25,
        isCaught: false,
      });
    }
    setFishes(initialFishes);
  }, [currentTarget, alphabetMode, selectedRow]);

  // Animation Loop for swimming fish
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = (currentTime - lastTime) / 16.66; // normalize to ~60fps
      lastTime = currentTime;

      setFishes((prev) =>
        prev.map((fish) => {
          if (fish.isCaught) return fish;

          let newX = fish.x + fish.direction * fish.speed * dt;
          let newDirection = fish.direction;

          // Wrap around screen boundaries with fresh kana
          if (fish.direction === 1 && newX > 115) {
            newX = -15;
            // Maybe swap kana
            const pool = availableKana.length > 0 ? availableKana : GOJUON_LIST;
            const newKana = Math.random() < 0.35 ? currentTarget : pool[Math.floor(Math.random() * pool.length)];
            return {
              ...fish,
              x: newX,
              kana: newKana,
              y: 30 + Math.random() * 50,
            };
          } else if (fish.direction === -1 && newX < -15) {
            newX = 115;
            const pool = availableKana.length > 0 ? availableKana : GOJUON_LIST;
            const newKana = Math.random() < 0.35 ? currentTarget : pool[Math.floor(Math.random() * pool.length)];
            return {
              ...fish,
              x: newX,
              kana: newKana,
              y: 30 + Math.random() * 50,
            };
          }

          return {
            ...fish,
            x: newX,
            direction: newDirection,
            wobbleOffset: fish.wobbleOffset + fish.wobbleSpeed * dt,
          };
        })
      );

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [availableKana, currentTarget]);

  // Move boat & rod via mouse/touch
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (hookState !== 'idle') return; // locked while fishing
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xRatio = Math.max(0.1, Math.min(0.9, (e.clientX - rect.left) / rect.width));
    setRodX(xRatio * 100);
  };

  // Check collision between hook and swimming fish
  const checkCatch = (targetHookY: number, targetRodX: number) => {
    // Find closest fish within bounding range
    const hitRadiusX = 9; // percentage
    const hitRadiusY = 8; // percentage

    for (const fish of fishes) {
      if (fish.isCaught) continue;
      const dx = Math.abs(fish.x - targetRodX);
      const dy = Math.abs(fish.y - targetHookY);

      if (dx < hitRadiusX && dy < hitRadiusY) {
        return fish;
      }
    }
    return null;
  };

  // Hook dropping and reeling logic
  const triggerDropHook = (targetX = rodX, directFishTarget: SwimmingFish | null = null) => {
    if (hookState !== 'idle') return;

    setRodX(targetX);
    setHookState('dropping');
    playSplash();

    const maxDepth = directFishTarget ? directFishTarget.y : 75;
    let currentY = 18;
    const dropSpeed = 1.8;

    const dropInterval = setInterval(() => {
      currentY += dropSpeed;
      setHookY(currentY);

      // Check collision during descent
      const hitFish = directFishTarget || checkCatch(currentY, targetX);

      if (hitFish && (currentY >= hitFish.y - 4 || directFishTarget)) {
        clearInterval(dropInterval);
        handleHitFish(hitFish);
      } else if (currentY >= maxDepth) {
        // Reached max depth without hitting
        clearInterval(dropInterval);
        handleReelBackEmpty();
      }
    }, 24);
  };

  // Direct tap on swimming fish card
  const handleTapFish = (fish: SwimmingFish) => {
    if (hookState !== 'idle') return;
    triggerDropHook(fish.x, fish);
  };

  // When fish is hooked
  const handleHitFish = (fish: SwimmingFish) => {
    const isTarget = fish.kana.id === currentTarget.id;

    if (isTarget) {
      // SUCCESS!
      setHookState('caught');
      setCaughtFish(fish);
      playCatchSuccess();
      playReel();

      // Confetti burst
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { x: rodX / 100, y: 0.3 },
      });

      const char = alphabetMode === 'katakana' ? currentTarget.katakana : currentTarget.hiragana;
      setFeedbackMsg({
        text: `釣れた！「${char}」！大成功！`,
        isCorrect: true,
      });

      // Reel in with fish attached
      let y = fish.y;
      const reelInterval = setInterval(() => {
        y -= 2.2;
        setHookY(y);
        if (y <= 18) {
          clearInterval(reelInterval);
          setHookState('idle');
          setCaughtFish(null);
          onCatchKana(fish.kana);

          // Audio celebration
          speakJapanese(`すごい！「${char}」！`, 0.9, 1.2);

          // Mark caught
          setFishes((prev) =>
            prev.map((f) => (f.id === fish.id ? { ...f, isCaught: true } : f))
          );

          // Pick new target after brief celebration
          setTimeout(() => {
            setFeedbackMsg(null);
            pickNewTarget();
          }, 1400);
        }
      }, 24);
    } else {
      // WRONG KANA: Gentle friendly guidance
      setHookState('reeling');
      playMiss();
      playReel();

      const caughtChar = alphabetMode === 'katakana' ? fish.kana.katakana : fish.kana.hiragana;
      const targetChar = alphabetMode === 'katakana' ? currentTarget.katakana : currentTarget.hiragana;

      setFeedbackMsg({
        text: `おしい！これは「${caughtChar}」だよ！「${targetChar}」をさがそう！`,
        isCorrect: false,
      });

      speakJapanese(`おしい！これは「${caughtChar}」だよ！`, 0.9, 1.1);

      // Reel up empty
      let y = fish.y;
      const reelInterval = setInterval(() => {
        y -= 2.5;
        setHookY(y);
        if (y <= 18) {
          clearInterval(reelInterval);
          setHookState('idle');
          setTimeout(() => setFeedbackMsg(null), 1800);
        }
      }, 24);
    }
  };

  // Reel back when nothing caught
  const handleReelBackEmpty = () => {
    setHookState('reeling');
    playReel();
    let y = hookY;
    const interval = setInterval(() => {
      y -= 2.8;
      setHookY(y);
      if (y <= 18) {
        clearInterval(interval);
        setHookState('idle');
      }
    }, 24);
  };

  const targetChar = alphabetMode === 'katakana' ? currentTarget.katakana : currentTarget.hiragana;

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto space-y-4">
      {/* Top Controls: Mode & Row filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-sky-100 shadow-sm">
        {/* Hiragana / Katakana switch */}
        <div className="flex items-center gap-1.5 p-1 bg-sky-100/70 rounded-xl">
          <button
            type="button"
            onClick={() => setAlphabetMode('hiragana')}
            className={`px-3.5 py-1.5 text-sm font-bold rounded-lg transition-all cursor-pointer ${
              alphabetMode === 'hiragana'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-slate-600 hover:text-sky-800'
            }`}
          >
            ひらがな
          </button>
          <button
            type="button"
            onClick={() => setAlphabetMode('katakana')}
            className={`px-3.5 py-1.5 text-sm font-bold rounded-lg transition-all cursor-pointer ${
              alphabetMode === 'katakana'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-slate-600 hover:text-sky-800'
            }`}
          >
            カタカナ
          </button>
        </div>

        {/* Row Selector dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">練習する行:</span>
          <select
            value={selectedRow}
            onChange={(e) => setSelectedRow(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-sky-50 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
          >
            <option value="all">ぜんぶ (All Rows)</option>
            {ROW_GROUPS.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => pickNewTarget()}
            className="p-1.5 text-sky-600 hover:text-sky-800 hover:bg-sky-100 rounded-lg transition-colors cursor-pointer"
            title="べつの文字にかえる"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Stars count */}
        <div className="flex items-center gap-1.5 text-amber-500 font-bold px-3 py-1 bg-amber-50 rounded-xl border border-amber-200">
          <Sparkles className="w-4 h-4 fill-amber-400 text-amber-500" />
          <span className="text-sm font-black">{stars}</span>
          <span className="text-xs text-amber-700 font-semibold">つかまえた魚</span>
        </div>
      </div>

      {/* Target Mission Banner */}
      <div className="relative flex items-center justify-between bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-3.5 rounded-2xl shadow-md border-b-4 border-blue-700 overflow-hidden">
        {/* Subtle wave pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="flex items-center gap-4 z-10">
          <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30 shadow-inner">
            <Anchor className="w-6 h-6 text-yellow-300" />
          </div>

          <div>
            <div className="text-xs font-semibold text-sky-100 flex items-center gap-1">
              <span>ミッション</span>
              <span>・</span>
              <span>この文字をつろう！</span>
            </div>
            <div className="text-xl md:text-2xl font-black flex items-center gap-2">
              <span>「{targetChar}」の魚をつかまえよう！</span>
              <button
                type="button"
                onClick={() => speakLetter(targetChar)}
                className="p-1 bg-white/20 hover:bg-white/30 rounded-lg transition-transform active:scale-95 cursor-pointer"
                title="音声をきく"
              >
                <Volume2 className="w-5 h-5 text-yellow-200" />
              </button>
            </div>
          </div>
        </div>

        {/* Big Target Letter Card preview */}
        <div className="z-10 flex items-center gap-3">
          <div className="flex flex-col items-center">
            <LetterCard
              kana={currentTarget}
              mode={alphabetMode === 'katakana' ? 'katakana' : 'hiragana'}
              size="lg"
              highlighted={true}
              showRomaji={true}
              className="bg-yellow-100 border-yellow-300 shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Interactive Fishing Stage (Ocean Aquarium) */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        className="relative w-full h-[540px] md:h-[600px] rounded-3xl overflow-hidden border-4 border-sky-400/80 shadow-2xl select-none cursor-crosshair bg-gradient-to-b from-sky-300 via-sky-500 to-blue-900"
      >
        {/* Sky & Distant Horizon */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-sky-200 to-sky-300 overflow-hidden pointer-events-none">
          {/* Sun */}
          <div className="absolute top-4 right-12 w-14 h-14 bg-amber-200 rounded-full blur-xs opacity-90 shadow-[0_0_40px_rgba(251,191,36,0.6)]" />

          {/* Distant Island / Lighthouse */}
          <div className="absolute bottom-4 left-1/4 flex items-end opacity-40">
            <div className="w-20 h-5 bg-emerald-700/60 rounded-t-full" />
            <div className="w-3 h-10 bg-rose-600/70 ml-2" />
          </div>

          {/* Clouds */}
          <div className="absolute top-6 left-12 w-28 h-8 bg-white/80 rounded-full blur-[1px] animate-pulse" />
          <div className="absolute top-10 right-40 w-36 h-9 bg-white/70 rounded-full blur-[1px]" />
        </div>

        {/* Water Surface Wave Effect */}
        <div className="absolute top-24 left-0 right-0 h-6 bg-gradient-to-b from-sky-300/60 to-transparent pointer-events-none z-10 flex items-center">
          <div className="w-full h-1 bg-white/40 animate-pulse" />
        </div>

        {/* Ocean Backdrop Caustic & Bubbles */}
        <div className="absolute inset-0 top-24 pointer-events-none overflow-hidden">
          {/* Rising bubbles */}
          {[12, 28, 45, 62, 78, 88].map((leftPct, idx) => (
            <div
              key={idx}
              className="absolute bottom-0 w-3 h-3 bg-white/30 rounded-full animate-bounce"
              style={{
                left: `${leftPct}%`,
                animationDuration: `${3 + (idx % 3)}s`,
                animationDelay: `${idx * 0.7}s`,
              }}
            />
          ))}

          {/* Sandy Seabed & Seaweed */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-200/50 via-amber-100/30 to-transparent" />
          <div className="absolute bottom-0 left-8 flex items-end gap-3 opacity-60">
            <div className="w-3 h-16 bg-emerald-600 rounded-t-full origin-bottom rotate-6" />
            <div className="w-4 h-24 bg-emerald-500 rounded-t-full origin-bottom -rotate-6" />
            <div className="w-3 h-14 bg-emerald-600 rounded-t-full origin-bottom rotate-12" />
          </div>
          <div className="absolute bottom-0 right-16 flex items-end gap-2 opacity-60">
            <div className="w-4 h-20 bg-emerald-500 rounded-t-full origin-bottom -rotate-12" />
            <div className="w-3 h-28 bg-teal-600 rounded-t-full origin-bottom rotate-6" />
          </div>
        </div>

        {/* Fishing Boat & Fisherman (Positioned at rodX) */}
        <div
          className="absolute top-12 -translate-x-1/2 transition-all duration-75 z-20 pointer-events-none"
          style={{ left: `${rodX}%` }}
        >
          {/* Fisherman Cat / Character */}
          <div className="relative flex flex-col items-center">
            {/* Cute Angler Character */}
            <div className="relative w-12 h-12 bg-amber-400 rounded-full border-2 border-amber-600 flex items-center justify-center shadow-md">
              {/* Straw Hat */}
              <div className="absolute -top-3 w-16 h-3 bg-amber-200 border border-amber-500 rounded-full" />
              <div className="absolute -top-5 w-8 h-4 bg-amber-300 border border-amber-500 rounded-t-lg" />
              {/* Face */}
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-slate-900 rounded-full" />
                <div className="w-2 h-2 bg-slate-900 rounded-full" />
              </div>
              <div className="absolute bottom-2.5 w-1.5 h-1 bg-rose-500 rounded-full" />
              <div className="absolute bottom-2 left-1.5 w-1.5 h-1 bg-pink-300 rounded-full" />
              <div className="absolute bottom-2 right-1.5 w-1.5 h-1 bg-pink-300 rounded-full" />
            </div>

            {/* Boat */}
            <div className="relative -mt-2 w-28 h-9 bg-amber-800 border-2 border-amber-950 rounded-b-2xl shadow-lg flex items-center justify-center">
              <span className="text-[10px] text-amber-200 font-bold tracking-widest">
                もじつり丸
              </span>
            </div>

            {/* Fishing Rod Angle */}
            <div className="absolute top-3 left-10 w-24 h-1 bg-amber-900 origin-left rotate-45 rounded-full" />
          </div>
        </div>

        {/* Fishing Line & Hook */}
        <div
          className="absolute top-22 -translate-x-1/2 pointer-events-none z-30 transition-[left] duration-75"
          style={{ left: `${rodX}%` }}
        >
          {/* Vertical Fishing Line (from boat to hook) */}
          <div
            className="w-0.5 bg-white/80 shadow-[0_0_2px_rgba(255,255,255,0.8)] mx-auto"
            style={{ height: `${Math.max(10, (hookY - 18) * 5.4)}px` }}
          />

          {/* Red and White Bobber */}
          <div className="relative -mt-1 mx-auto w-4 h-4 rounded-full border border-slate-700 overflow-hidden shadow-sm">
            <div className="h-2 bg-rose-600" />
            <div className="h-2 bg-white" />
          </div>

          {/* The Hook */}
          <div className="relative -mt-0.5 mx-auto w-5 h-6">
            <svg viewBox="0 0 20 25" className="w-full h-full text-slate-300 drop-shadow">
              <path
                d="M 10 0 L 10 16 C 10 22, 18 22, 18 16 L 18 13"
                stroke="#E2E8F0"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <polygon points="18,13 15,16 19,16" fill="#CBD5E1" />
            </svg>
          </div>

          {/* Caught Fish Displayed on Hook */}
          {hookState === 'caught' && caughtFish && (
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1 animate-bounce">
              <FishSvg species={caughtFish.species} direction={1} width={70} height={45} />
              <LetterCard
                kana={caughtFish.kana}
                mode={alphabetMode === 'katakana' ? 'katakana' : 'hiragana'}
                size="fishTag"
                highlighted={true}
              />
            </div>
          )}
        </div>

        {/* Swimming Fish in the Ocean */}
        {fishes.map((fish) => {
          if (fish.isCaught) return null;

          const isTargetMatch = fish.kana.id === currentTarget.id;
          const wobbleY = Math.sin(fish.wobbleOffset) * 6;

          return (
            <div
              key={fish.id}
              onClick={() => handleTapFish(fish)}
              className="absolute -translate-y-1/2 flex items-center gap-1 cursor-pointer transition-transform duration-100 hover:scale-105 active:scale-95 group z-20"
              style={{
                left: `${fish.x}%`,
                top: `${fish.y + wobbleY}%`,
                transform: `scale(${fish.scale})`,
              }}
              title="タップして釣る！"
            >
              {/* Fish SVG */}
              <div className="relative">
                <FishSvg
                  species={fish.species}
                  direction={fish.direction}
                  width={75}
                  height={48}
                  animateTail={true}
                />
              </div>

              {/* Letter Card carried by fish */}
              <div className="relative -ml-3 z-10">
                <LetterCard
                  kana={fish.kana}
                  mode={alphabetMode === 'katakana' ? 'katakana' : 'hiragana'}
                  size="fishTag"
                  highlighted={isTargetMatch}
                />
              </div>
            </div>
          );
        })}

        {/* In-game Feedback Overlay Message */}
        {feedbackMsg && (
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 animate-fade-in pointer-events-none">
            <div
              className={`px-6 py-3.5 rounded-2xl shadow-2xl font-black text-lg md:text-xl border-4 backdrop-blur-md flex items-center gap-2 ${
                feedbackMsg.isCorrect
                  ? 'bg-amber-400/95 border-white text-amber-950 ring-4 ring-amber-300'
                  : 'bg-white/95 border-rose-400 text-rose-700'
              }`}
            >
              <Sparkles className="w-6 h-6 animate-spin" />
              <span>{feedbackMsg.text}</span>
            </div>
          </div>
        )}

        {/* Bottom Ocean Floor Controls: "Drop Hook" big button */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
          <button
            type="button"
            onClick={() => triggerDropHook()}
            disabled={hookState !== 'idle'}
            className={`px-8 py-3 rounded-2xl font-black text-lg shadow-xl border-2 transition-all duration-150 flex items-center gap-2 cursor-pointer ${
              hookState === 'idle'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 border-amber-200 hover:scale-105 active:scale-95 shadow-amber-900/30'
                : 'bg-slate-300 text-slate-500 border-slate-400 cursor-not-allowed opacity-70'
            }`}
          >
            <Anchor className="w-5 h-5 text-amber-900" />
            <span>
              {hookState === 'idle'
                ? 'つり針をおとす！'
                : hookState === 'dropping'
                ? 'おとし中...'
                : hookState === 'caught'
                ? 'HIT!! 釣り上げ中！'
                : '巻き上げ中...'}
            </span>
          </button>
        </div>

        {/* Tip pill */}
        <div className="absolute top-28 left-4 z-20 pointer-events-none hidden sm:flex items-center gap-1.5 text-xs font-semibold text-white/90 bg-sky-900/40 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/20">
          <Compass className="w-3.5 h-3.5 text-yellow-300" />
          <span>魚を直接タップするか、ボートを動かして「つり針をおとす」を押してね！</span>
        </div>
      </div>
    </div>
  );
};
