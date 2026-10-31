export type AlphabetMode = 'hiragana' | 'katakana' | 'mixed';

export type GameMode = 
  | 'letter_catch'   // Target letter fishing (ひらがな / カタカナ)
  | 'word_catch'     // Spell target words by catching letters in sequence
  | 'pair_match'     // Hiragana ↔ Katakana bridge fishing
  | 'word_combiner'  // Free sandbox combining caught cards to make words
  | 'zukan';         // 50-sound chart & aquarium collection

export interface KanaItem {
  id: string;
  hiragana: string;
  katakana: string;
  romaji: string;
  row: string; // 'a', 'ka', 'sa', 'ta', 'na', 'ha', 'ma', 'ya', 'ra', 'wa'
  col: number; // 0 to 4
  exampleWord: string;
  exampleReading: string;
  exampleMeaning: string;
  exampleEmoji: string;
}

export interface FishSpecies {
  id: string;
  name: string;
  nameKana: string;
  type: 'tai' | 'tako' | 'ika' | 'kani' | 'kujira' | 'iruka' | 'maguro' | 'same' | 'kurage' | 'ebi' | 'kame' | 'manbou' | 'clownfish' | 'rainbow';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  size: 'small' | 'medium' | 'large' | 'huge';
  depth: 'shallow' | 'mid' | 'deep';
  baseSpeed: number;
}

export interface TargetWord {
  id: string;
  word: string; // e.g. "さかな"
  katakana: string; // "サカナ"
  letters: string[]; // ["さ", "か", "な"]
  katakanaLetters: string[]; // ["サ", "カ", "ナ"]
  meaning: string;
  emoji: string;
  category: 'sea_animal' | 'nature' | 'food' | 'animal';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface SwimmingFish {
  id: string;
  species: FishSpecies;
  kana: KanaItem;
  displayMode: 'hiragana' | 'katakana';
  x: number; // percentage 0 - 100
  y: number; // percentage 15 - 85
  direction: 1 | -1; // 1 = moving right, -1 = moving left
  speed: number;
  wobbleOffset: number;
  wobbleSpeed: number;
  scale: number;
  isCaught: boolean;
}

export interface CaughtRecord {
  kanaId: string;
  count: number;
  firstCaughtAt: number;
  lastCaughtAt: number;
}

export interface GameStats {
  score: number;
  stars: number;
  totalCaught: number;
  wordsCompleted: number;
  caughtLetters: Record<string, number>; // kanaId -> count
  completedWords: string[]; // word IDs
}

export interface DailyChallengeState {
  dateStr: string; // "YYYY-MM-DD"
  targetWordId: string;
  isCompleted: boolean;
  streakCount: number;
  history: Record<string, boolean>; // dateStr -> boolean
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  category: 'catch' | 'words' | 'kana' | 'streak' | 'craft';
  icon: string;
  maxProgress: number;
  unit: string;
  rewardStars: number;
  checkProgress: (stats: PlayerStats, caughtLetters: Record<string, number>) => number;
}

export interface PlayerStats {
  totalLettersCaught: number;
  totalWordsCompleted: number;
  totalPairMatches: number;
  totalCombinerCrafts: number;
  streakCount: number;
  dailyClearsCount: number;
}


