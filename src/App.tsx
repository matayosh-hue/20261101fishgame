/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  GameMode,
  KanaItem,
  TargetWord,
  DailyChallengeState,
  AchievementBadge,
  PlayerStats,
} from './types';
import { Navbar } from './components/Navbar';
import { FishingGame } from './components/FishingGame';
import { WordCraftingGame } from './components/WordCraftingGame';
import { PairMatchGame } from './components/PairMatchGame';
import { CardCombiner } from './components/CardCombiner';
import { ZukanChart } from './components/ZukanChart';
import { DailyChallengeBanner } from './components/DailyChallengeBanner';
import { DailyChallengeModal } from './components/DailyChallengeModal';
import { AchievementModal } from './components/AchievementModal';
import { BadgeUnlockPopup } from './components/BadgeUnlockPopup';
import { ACHIEVEMENT_BADGES } from './data/achievementBadges';
import {
  loadDailyChallengeState,
  saveDailyChallengeState,
  getDailyTargetWord,
  calculateStreak,
  DAILY_BONUS_STARS,
} from './utils/dailyChallenge';
import { getMuted, setMuted, speakJapanese, playFanfare } from './utils/audio';

const STORAGE_KEY = 'mojitsuri_save_v1';
const BADGES_STORAGE_KEY = 'mojitsuri_badges_v1';
const STATS_STORAGE_KEY = 'mojitsuri_stats_v1';

export default function App() {
  const [currentMode, setCurrentMode] = useState<GameMode>('letter_catch');
  const [activeWordId, setActiveWordId] = useState<string | undefined>(undefined);
  const [isDailyModalOpen, setIsDailyModalOpen] = useState<boolean>(false);
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState<boolean>(false);
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState<AchievementBadge | null>(null);

  // Daily Challenge State
  const [dailyState, setDailyState] = useState<DailyChallengeState>(() =>
    loadDailyChallengeState()
  );

  const todayTargetWord = getDailyTargetWord(dailyState.dateStr);

  const [stars, setStars] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        return data.stars || 0;
      }
    } catch {}
    return 0;
  });

  const [caughtLetterCounts, setCaughtLetterCounts] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        return data.caughtLetters || {};
      }
    } catch {}
    return {};
  });

  const [discoveredWords, setDiscoveredWords] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        return data.completedWords || [];
      }
    } catch {}
    return [];
  });

  // Player Stats for achievements
  const [playerStats, setPlayerStats] = useState<PlayerStats>(() => {
    try {
      const saved = localStorage.getItem(STATS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return {
      totalLettersCaught: 0,
      totalWordsCompleted: 0,
      totalPairMatches: 0,
      totalCombinerCrafts: 0,
      streakCount: 0,
      dailyClearsCount: 0,
    };
  });

  // Unlocked Badges (badgeId -> timestamp)
  const [unlockedBadges, setUnlockedBadges] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(BADGES_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return {};
  });

  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(() => getMuted());

  // Save progress & stats & badges
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          stars,
          caughtLetters: caughtLetterCounts,
          completedWords: discoveredWords,
        })
      );
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(playerStats));
      localStorage.setItem(BADGES_STORAGE_KEY, JSON.stringify(unlockedBadges));
    } catch {}
  }, [stars, caughtLetterCounts, discoveredWords, playerStats, unlockedBadges]);

  // Check achievements helper
  const checkAchievements = (
    updatedStats: PlayerStats,
    updatedCaughtLetters: Record<string, number>
  ) => {
    for (const badge of ACHIEVEMENT_BADGES) {
      if (!unlockedBadges[badge.id]) {
        const progress = badge.checkProgress(updatedStats, updatedCaughtLetters);
        if (progress >= badge.maxProgress) {
          // UNLOCKED!
          const now = Date.now();
          setUnlockedBadges((prev) => ({
            ...prev,
            [badge.id]: now,
          }));

          setStars((prev) => prev + badge.rewardStars);
          setNewlyUnlockedBadge(badge);

          playFanfare();
          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.5 },
          });

          speakJapanese(`やったね！実績バッジ「${badge.title}」を獲得したよ！`, 0.9, 1.2);
          break; // Show one at a time for maximum celebration impact
        }
      }
    }
  };

  // Audio toggle
  const handleToggleMute = () => {
    const next = !isAudioMuted;
    setIsAudioMuted(next);
    setMuted(next);
  };

  // When player catches a letter in any mode
  const handleCatchKana = (kana: KanaItem) => {
    setStars((prev) => prev + 1);
    const nextCounts = {
      ...caughtLetterCounts,
      [kana.id]: (caughtLetterCounts[kana.id] || 0) + 1,
    };
    setCaughtLetterCounts(nextCounts);

    const nextStats: PlayerStats = {
      ...playerStats,
      totalLettersCaught: playerStats.totalLettersCaught + 1,
    };
    setPlayerStats(nextStats);

    checkAchievements(nextStats, nextCounts);
  };

  // When player completes a word in WordCraftingGame
  const handleCompleteWord = (targetWord: TargetWord) => {
    setStars((prev) => prev + 3); // bonus stars for regular word completion
    const nextCounts = { ...caughtLetterCounts };
    targetWord.letters.forEach((l) => {
      nextCounts[l] = (nextCounts[l] || 0) + 1;
    });
    setCaughtLetterCounts(nextCounts);

    if (!discoveredWords.includes(targetWord.word)) {
      setDiscoveredWords((prev) => [...prev, targetWord.word]);
    }

    const nextStats: PlayerStats = {
      ...playerStats,
      totalWordsCompleted: playerStats.totalWordsCompleted + 1,
    };
    setPlayerStats(nextStats);

    checkAchievements(nextStats, nextCounts);
  };

  // When player matches a pair in PairMatchGame
  const handlePairMatchSuccess = (kana: KanaItem) => {
    handleCatchKana(kana);
    const nextStats: PlayerStats = {
      ...playerStats,
      totalLettersCaught: playerStats.totalLettersCaught + 1,
      totalPairMatches: playerStats.totalPairMatches + 1,
    };
    setPlayerStats(nextStats);
    checkAchievements(nextStats, caughtLetterCounts);
  };

  // Handle Daily Challenge completion & bonus award
  const handleDailyChallengeCleared = () => {
    if (dailyState.isCompleted) return;

    setStars((prev) => prev + DAILY_BONUS_STARS);

    const newHistory = {
      ...dailyState.history,
      [dailyState.dateStr]: true,
    };
    const newStreak = calculateStreak(newHistory, dailyState.dateStr);

    const updatedState: DailyChallengeState = {
      ...dailyState,
      isCompleted: true,
      streakCount: newStreak,
      history: newHistory,
    };

    setDailyState(updatedState);
    saveDailyChallengeState(updatedState);

    const nextStats: PlayerStats = {
      ...playerStats,
      dailyClearsCount: playerStats.dailyClearsCount + 1,
      streakCount: newStreak,
    };
    setPlayerStats(nextStats);

    checkAchievements(nextStats, caughtLetterCounts);
  };

  // Launch daily challenge from banner / modal
  const handleStartDailyChallenge = (word: TargetWord) => {
    setActiveWordId(word.id);
    setCurrentMode('word_catch');
    setIsDailyModalOpen(false);
  };

  // When player discovers a word in CardCombiner
  const handleWordDiscovered = (word: string) => {
    setStars((prev) => prev + 2);
    if (!discoveredWords.includes(word)) {
      setDiscoveredWords((prev) => [...prev, word]);
    }

    const nextStats: PlayerStats = {
      ...playerStats,
      totalCombinerCrafts: playerStats.totalCombinerCrafts + 1,
    };
    setPlayerStats(nextStats);

    checkAchievements(nextStats, caughtLetterCounts);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 via-blue-50/50 to-amber-50/30 text-slate-800">
      {/* Navigation bar */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={(mode) => {
          setCurrentMode(mode);
          setActiveWordId(undefined);
        }}
        stars={stars}
        isMuted={isAudioMuted}
        onToggleMute={handleToggleMute}
        onOpenDailyChallenge={() => setIsDailyModalOpen(true)}
        isDailyCompleted={dailyState.isCompleted}
        onOpenAchievements={() => setIsAchievementModalOpen(true)}
        unlockedBadgesCount={Object.keys(unlockedBadges).length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-5 flex flex-col items-center space-y-4">
        {/* Daily Challenge Interactive Banner */}
        <DailyChallengeBanner
          dailyState={dailyState}
          targetWord={todayTargetWord}
          onOpenModal={() => setIsDailyModalOpen(true)}
        />

        {currentMode === 'letter_catch' && (
          <FishingGame onCatchKana={handleCatchKana} stars={stars} />
        )}

        {currentMode === 'word_catch' && (
          <WordCraftingGame
            onCompleteWord={handleCompleteWord}
            stars={stars}
            initialTargetWordId={activeWordId || todayTargetWord.id}
            dailyTargetWordId={todayTargetWord.id}
            isDailyCompleted={dailyState.isCompleted}
            onDailyChallengeCleared={handleDailyChallengeCleared}
          />
        )}

        {currentMode === 'pair_match' && (
          <PairMatchGame onMatchSuccess={handlePairMatchSuccess} stars={stars} />
        )}

        {currentMode === 'word_combiner' && (
          <CardCombiner
            caughtLetterCounts={caughtLetterCounts}
            onWordDiscovered={handleWordDiscovered}
          />
        )}

        {currentMode === 'zukan' && (
          <ZukanChart
            caughtLetterCounts={caughtLetterCounts}
            stars={stars}
            onOpenAchievements={() => setIsAchievementModalOpen(true)}
            unlockedBadgesCount={Object.keys(unlockedBadges).length}
          />
        )}
      </main>

      {/* Daily Challenge Modal */}
      <DailyChallengeModal
        isOpen={isDailyModalOpen}
        onClose={() => setIsDailyModalOpen(false)}
        dailyState={dailyState}
        targetWord={todayTargetWord}
        onStartChallenge={handleStartDailyChallenge}
      />

      {/* Achievement Badges Modal */}
      <AchievementModal
        isOpen={isAchievementModalOpen}
        onClose={() => setIsAchievementModalOpen(false)}
        unlockedBadges={unlockedBadges}
        playerStats={playerStats}
        caughtLetters={caughtLetterCounts}
      />

      {/* Real-time Badge Unlock Celebration Popup */}
      <BadgeUnlockPopup
        badge={newlyUnlockedBadge}
        onClose={() => setNewlyUnlockedBadge(null)}
      />

      {/* Footer */}
      <footer className="mt-auto py-4 px-6 border-t border-sky-100 text-center text-xs text-slate-400">
        <p>もじつりアイランド · ひらがな・カタカナ・言葉のカード釣り学習ゲーム</p>
      </footer>
    </div>
  );
}
