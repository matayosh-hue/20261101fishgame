import { TargetWord, DailyChallengeState } from '../types';
import { TARGET_WORDS } from '../data/japaneseData';

export const DAILY_BONUS_STARS = 10;
export const DAILY_STORAGE_KEY = 'mojitsuri_daily_challenge_v1';

/**
 * Returns YYYY-MM-DD string in local time
 */
export function getTodayDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats YYYY-MM-DD into friendly Japanese "M月D日 (曜日)"
 */
export function getFormattedJapaneseDate(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const daysJa = ['日', '月', '火', '水', '木', '金', '土'];
    const dayOfWeek = daysJa[date.getDay()];
    return `${m}月${d}日 (${dayOfWeek})`;
  } catch {
    return dateStr;
  }
}

/**
 * Deterministically picks a target word for a given date
 */
export function getDailyTargetWord(dateStr: string): TargetWord {
  // Simple deterministic hash of the date string
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) >>> 0;
  }
  const index = hash % TARGET_WORDS.length;
  return TARGET_WORDS[index];
}

/**
 * Calculates current consecutive streak of daily completions
 */
export function calculateStreak(history: Record<string, boolean>, todayStr: string): number {
  let streak = 0;
  const d = new Date(todayStr);

  // If today is completed, start checking from today; otherwise from yesterday
  if (history[todayStr]) {
    streak = 1;
    d.setDate(d.getDate() - 1);
  } else {
    // Check if yesterday was completed
    d.setDate(d.getDate() - 1);
    const yesterdayStr = getTodayDateString(d);
    if (!history[yesterdayStr]) {
      return 0;
    }
  }

  // Count backwards
  while (true) {
    const curStr = getTodayDateString(d);
    if (history[curStr]) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Load saved daily challenge state
 */
export function loadDailyChallengeState(): DailyChallengeState {
  const todayStr = getTodayDateString();
  const todayTarget = getDailyTargetWord(todayStr);

  try {
    const saved = localStorage.getItem(DAILY_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const history = parsed.history || {};
      const isCompleted = !!history[todayStr];
      const streak = calculateStreak(history, todayStr);

      return {
        dateStr: todayStr,
        targetWordId: todayTarget.id,
        isCompleted,
        streakCount: streak,
        history,
      };
    }
  } catch {}

  return {
    dateStr: todayStr,
    targetWordId: todayTarget.id,
    isCompleted: false,
    streakCount: 0,
    history: {},
  };
}

/**
 * Save daily challenge state
 */
export function saveDailyChallengeState(state: DailyChallengeState) {
  try {
    localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(state));
  } catch {}
}
