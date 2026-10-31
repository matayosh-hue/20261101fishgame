import { AchievementBadge, PlayerStats } from '../types';
import { GOJUON_LIST } from './japaneseData';

const A_ROW_IDS = ['a', 'i', 'u', 'e', 'o'];

export const ACHIEVEMENT_BADGES: AchievementBadge[] = [
  // 1. 文字釣りマイルストーン
  {
    id: 'catch_1',
    title: 'はじめての1匹',
    description: '魚を1文字釣った！',
    category: 'catch',
    icon: '🎣',
    maxProgress: 1,
    unit: '文字',
    rewardStars: 3,
    checkProgress: (stats) => Math.min(1, stats.totalLettersCaught),
  },
  {
    id: 'catch_10',
    title: '駆け出しつり人',
    description: '合計10個の文字を釣った！',
    category: 'catch',
    icon: '🐟',
    maxProgress: 10,
    unit: '文字',
    rewardStars: 5,
    checkProgress: (stats) => Math.min(10, stats.totalLettersCaught),
  },
  {
    id: 'catch_50',
    title: '大漁まつり',
    description: '合計50個の文字を釣った！',
    category: 'catch',
    icon: '🐬',
    maxProgress: 50,
    unit: '文字',
    rewardStars: 10,
    checkProgress: (stats) => Math.min(50, stats.totalLettersCaught),
  },
  {
    id: 'catch_100',
    title: '伝説の釣り名人',
    description: '合計100個の文字を釣った！',
    category: 'catch',
    icon: '👑',
    maxProgress: 100,
    unit: '文字',
    rewardStars: 20,
    checkProgress: (stats) => Math.min(100, stats.totalLettersCaught),
  },
  {
    id: 'catch_200',
    title: '海の主ハンター',
    description: '合計200個の文字を釣った！',
    category: 'catch',
    icon: '🏆',
    maxProgress: 200,
    unit: '文字',
    rewardStars: 30,
    checkProgress: (stats) => Math.min(200, stats.totalLettersCaught),
  },

  // 2. 単語完成マイルストーン
  {
    id: 'word_1',
    title: 'はじめての言葉',
    description: 'ことばつりで単語を1個完成させた！',
    category: 'words',
    icon: '🧩',
    maxProgress: 1,
    unit: '個',
    rewardStars: 5,
    checkProgress: (stats) => Math.min(1, stats.totalWordsCompleted),
  },
  {
    id: 'word_5',
    title: 'ことばの探検隊',
    description: '単語を5個完成させた！',
    category: 'words',
    icon: '📚',
    maxProgress: 5,
    unit: '個',
    rewardStars: 10,
    checkProgress: (stats) => Math.min(5, stats.totalWordsCompleted),
  },
  {
    id: 'word_10',
    title: 'ことばマスター',
    description: '単語を10個完成させた！',
    category: 'words',
    icon: '🏅',
    maxProgress: 10,
    unit: '個',
    rewardStars: 20,
    checkProgress: (stats) => Math.min(10, stats.totalWordsCompleted),
  },
  {
    id: 'word_20',
    title: 'ことば博士',
    description: '単語を20個完成させた！',
    category: 'words',
    icon: '🌟',
    maxProgress: 20,
    unit: '個',
    rewardStars: 35,
    checkProgress: (stats) => Math.min(20, stats.totalWordsCompleted),
  },

  // 3. 五十音制覇
  {
    id: 'kana_row_a',
    title: 'あ行の達人',
    description: 'あ行（あ・い・う・え・お）の文字をすべて釣った！',
    category: 'kana',
    icon: '🅰️',
    maxProgress: 5,
    unit: '文字',
    rewardStars: 10,
    checkProgress: (_, caughtLetters) => {
      let count = 0;
      A_ROW_IDS.forEach((id) => {
        if ((caughtLetters[id] || 0) > 0) count++;
      });
      return count;
    },
  },
  {
    id: 'kana_25',
    title: '五十音の旅人',
    description: '25種類以上の異なる文字を釣った！',
    category: 'kana',
    icon: '🗺️',
    maxProgress: 25,
    unit: '種類',
    rewardStars: 15,
    checkProgress: (_, caughtLetters) => {
      return Math.min(
        25,
        Object.keys(caughtLetters).filter((id) => (caughtLetters[id] || 0) > 0).length
      );
    },
  },
  {
    id: 'kana_all',
    title: '五十音コンプリート',
    description: '全50音すべての文字を1回以上釣った！',
    category: 'kana',
    icon: '🌈',
    maxProgress: GOJUON_LIST.length,
    unit: '種類',
    rewardStars: 50,
    checkProgress: (_, caughtLetters) => {
      return Object.keys(caughtLetters).filter((id) => (caughtLetters[id] || 0) > 0).length;
    },
  },

  // 4. デイリー＆継続
  {
    id: 'daily_1',
    title: 'デイリー初制覇',
    description: '今日の目標単語チャレンジを1回クリアした！',
    category: 'streak',
    icon: '🎯',
    maxProgress: 1,
    unit: '回',
    rewardStars: 10,
    checkProgress: (stats) => Math.min(1, stats.dailyClearsCount),
  },
  {
    id: 'daily_streak_3',
    title: '3日連続マスター',
    description: 'デイリーチャレンジを3日連続でクリアした！',
    category: 'streak',
    icon: '🔥',
    maxProgress: 3,
    unit: '日',
    rewardStars: 25,
    checkProgress: (stats) => Math.min(3, stats.streakCount),
  },

  // 5. へんしん＆工房
  {
    id: 'pair_5',
    title: 'へんしんの達人',
    description: 'へんしんペア釣りでカタカナとひらがなを5回合わせた！',
    category: 'craft',
    icon: '🔄',
    maxProgress: 5,
    unit: '回',
    rewardStars: 10,
    checkProgress: (stats) => Math.min(5, stats.totalPairMatches),
  },
  {
    id: 'craft_3',
    title: '言葉の錬金術師',
    description: '文字あわせ工房で言葉を3個作った！',
    category: 'craft',
    icon: '🧪',
    maxProgress: 3,
    unit: '個',
    rewardStars: 10,
    checkProgress: (stats) => Math.min(3, stats.totalCombinerCrafts),
  },
];
