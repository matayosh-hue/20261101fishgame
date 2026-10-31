import { KanaItem, TargetWord, FishSpecies } from '../types';

export const GOJUON_LIST: KanaItem[] = [
  // あ行
  { id: 'a', hiragana: 'あ', katakana: 'ア', romaji: 'a', row: 'a', col: 0, exampleWord: 'あめ', exampleReading: 'あめ', exampleMeaning: '雨・飴', exampleEmoji: '🍬' },
  { id: 'i', hiragana: 'い', katakana: 'イ', romaji: 'i', row: 'a', col: 1, exampleWord: 'いぬ', exampleReading: 'いぬ', exampleMeaning: '犬', exampleEmoji: '🐶' },
  { id: 'u', hiragana: 'う', katakana: 'ウ', romaji: 'u', row: 'a', col: 2, exampleWord: 'うみ', exampleReading: 'うみ', exampleMeaning: '海', exampleEmoji: '🌊' },
  { id: 'e', hiragana: 'え', katakana: 'エ', romaji: 'e', row: 'a', col: 3, exampleWord: 'えび', exampleReading: 'えび', exampleMeaning: '海老', exampleEmoji: '🦐' },
  { id: 'o', hiragana: 'お', katakana: 'オ', romaji: 'o', row: 'a', col: 4, exampleWord: 'おに', exampleReading: 'おに', exampleMeaning: '鬼', exampleEmoji: '👹' },

  // か行
  { id: 'ka', hiragana: 'か', katakana: 'カ', romaji: 'ka', row: 'ka', col: 0, exampleWord: 'かに', exampleReading: 'かに', exampleMeaning: '蟹', exampleEmoji: '🦀' },
  { id: 'ki', hiragana: 'き', katakana: 'キ', romaji: 'ki', row: 'ka', col: 1, exampleWord: 'きつね', exampleReading: 'きつね', exampleMeaning: '狐', exampleEmoji: '🦊' },
  { id: 'ku', hiragana: 'く', katakana: 'ク', romaji: 'ku', row: 'ka', col: 2, exampleWord: 'くじら', exampleReading: 'くじら', exampleMeaning: '鯨', exampleEmoji: '🐳' },
  { id: 'ke', hiragana: 'け', katakana: 'ケ', romaji: 'ke', row: 'ka', col: 3, exampleWord: 'けむし', exampleReading: 'けむし', exampleMeaning: '毛虫', exampleEmoji: '🐛' },
  { id: 'ko', hiragana: 'こ', katakana: 'コ', romaji: 'ko', row: 'ka', col: 4, exampleWord: 'こま', exampleReading: 'こま', exampleMeaning: '独楽', exampleEmoji: '🪀' },

  // さ行
  { id: 'sa', hiragana: 'さ', katakana: 'サ', romaji: 'sa', row: 'sa', col: 0, exampleWord: 'さかな', exampleReading: 'さかな', exampleMeaning: '魚', exampleEmoji: '🐟' },
  { id: 'shi', hiragana: 'し', katakana: 'シ', romaji: 'shi', row: 'sa', col: 1, exampleWord: 'しか', exampleReading: 'しか', exampleMeaning: '鹿', exampleEmoji: '🦌' },
  { id: 'su', hiragana: 'す', katakana: 'ス', romaji: 'su', row: 'sa', col: 2, exampleWord: 'すいか', exampleReading: 'すいか', exampleMeaning: '西瓜', exampleEmoji: '🍉' },
  { id: 'se', hiragana: 'せ', katakana: 'セ', romaji: 'se', row: 'sa', col: 3, exampleWord: 'せみ', exampleReading: 'せみ', exampleMeaning: '蝉', exampleEmoji: '🦗' },
  { id: 'so', hiragana: 'そ', katakana: 'ソ', romaji: 'so', row: 'sa', col: 4, exampleWord: 'そら', exampleReading: 'そら', exampleMeaning: '空', exampleEmoji: '🌤️' },

  // た行
  { id: 'ta', hiragana: 'た', katakana: 'タ', romaji: 'ta', row: 'ta', col: 0, exampleWord: 'たい', exampleReading: 'たい', exampleMeaning: '鯛', exampleEmoji: '🐠' },
  { id: 'chi', hiragana: 'ち', katakana: 'チ', romaji: 'chi', row: 'ta', col: 1, exampleWord: 'ちょう', exampleReading: 'ちょう', exampleMeaning: '蝶', exampleEmoji: '🦋' },
  { id: 'tsu', hiragana: 'つ', katakana: 'ツ', romaji: 'tsu', row: 'ta', col: 2, exampleWord: 'つり', exampleReading: 'つり', exampleMeaning: '釣り', exampleEmoji: '🎣' },
  { id: 'te', hiragana: 'て', katakana: 'テ', romaji: 'te', row: 'ta', col: 3, exampleWord: 'てんとうむし', exampleReading: 'てんとう', exampleMeaning: '天道虫', exampleEmoji: '🐞' },
  { id: 'to', hiragana: 'と', katakana: 'ト', romaji: 'to', row: 'ta', col: 4, exampleWord: 'とら', exampleReading: 'とら', exampleMeaning: '虎', exampleEmoji: '🐯' },

  // な行
  { id: 'na', hiragana: 'な', katakana: 'ナ', romaji: 'na', row: 'na', col: 0, exampleWord: 'なみ', exampleReading: 'なみ', exampleMeaning: '波', exampleEmoji: '🌊' },
  { id: 'ni', hiragana: 'に', katakana: 'ニ', romaji: 'ni', row: 'na', col: 1, exampleWord: 'にじ', exampleReading: 'にじ', exampleMeaning: '虹', exampleEmoji: '🌈' },
  { id: 'nu', hiragana: 'ぬ', katakana: 'ヌ', romaji: 'nu', row: 'na', col: 2, exampleWord: 'ぬいぐるみ', exampleReading: 'ぬい', exampleMeaning: '縫い包み', exampleEmoji: '🧸' },
  { id: 'ne', hiragana: 'ね', katakana: 'ネ', romaji: 'ne', row: 'na', col: 3, exampleWord: 'ねこ', exampleReading: 'ねこ', exampleMeaning: '猫', exampleEmoji: '🐱' },
  { id: 'no', hiragana: 'の', katakana: 'ノ', romaji: 'no', row: 'na', col: 4, exampleWord: 'のり', exampleReading: 'のり', exampleMeaning: '海苔', exampleEmoji: '🍙' },

  // は行
  { id: 'ha', hiragana: 'は', katakana: 'ハ', romaji: 'ha', row: 'ha', col: 0, exampleWord: 'はな', exampleReading: 'はな', exampleMeaning: '花', exampleEmoji: '🌸' },
  { id: 'hi', hiragana: 'ひ', katakana: 'ヒ', romaji: 'hi', row: 'ha', col: 1, exampleWord: 'ひこうき', exampleReading: 'ひこうき', exampleMeaning: '飛行機', exampleEmoji: '✈️' },
  { id: 'fu', hiragana: 'ふ', katakana: 'フ', romaji: 'fu', row: 'ha', col: 2, exampleWord: 'ふね', exampleReading: 'ふね', exampleMeaning: '船', exampleEmoji: '⛵' },
  { id: 'he', hiragana: 'へ', katakana: 'ヘ', romaji: 'he', row: 'ha', col: 3, exampleWord: 'へび', exampleReading: 'へび', exampleMeaning: '蛇', exampleEmoji: '🐍' },
  { id: 'ho', hiragana: 'ほ', katakana: 'ホ', romaji: 'ho', row: 'ha', col: 4, exampleWord: 'ほし', exampleReading: 'ほし', exampleMeaning: '星', exampleEmoji: '⭐' },

  // ま行
  { id: 'ma', hiragana: 'ま', katakana: 'マ', romaji: 'ma', row: 'ma', col: 0, exampleWord: 'まぐろ', exampleReading: 'まぐろ', exampleMeaning: '鮪', exampleEmoji: '🐟' },
  { id: 'mi', hiragana: 'み', katakana: 'ミ', romaji: 'mi', row: 'ma', col: 1, exampleWord: 'みかん', exampleReading: 'みかん', exampleMeaning: '蜜柑', exampleEmoji: '🍊' },
  { id: 'mu', hiragana: 'む', katakana: 'ム', romaji: 'mu', row: 'ma', col: 2, exampleWord: 'むし', exampleReading: 'むし', exampleMeaning: '虫', exampleEmoji: '🐞' },
  { id: 'me', hiragana: 'め', katakana: 'メ', romaji: 'me', row: 'ma', col: 3, exampleWord: 'めがね', exampleReading: 'めがね', exampleMeaning: '眼鏡', exampleEmoji: '👓' },
  { id: 'mo', hiragana: 'も', katakana: 'モ', romaji: 'mo', row: 'ma', col: 4, exampleWord: 'もも', exampleReading: 'もも', exampleMeaning: '桃', exampleEmoji: '🍑' },

  // や行
  { id: 'ya', hiragana: 'や', katakana: 'ヤ', romaji: 'ya', row: 'ya', col: 0, exampleWord: 'やま', exampleReading: 'やま', exampleMeaning: '山', exampleEmoji: '⛰️' },
  { id: 'yu', hiragana: 'ゆ', katakana: 'ユ', romaji: 'yu', row: 'ya', col: 1, exampleWord: 'ゆき', exampleReading: 'ゆき', exampleMeaning: '雪', exampleEmoji: '⛄' },
  { id: 'yo', hiragana: 'よ', katakana: 'ヨ', romaji: 'yo', row: 'ya', col: 2, exampleWord: 'よる', exampleReading: 'よる', exampleMeaning: '夜', exampleEmoji: '🌙' },

  // ら行
  { id: 'ra', hiragana: 'ら', katakana: 'ラ', romaji: 'ra', row: 'ra', col: 0, exampleWord: 'らっこ', exampleReading: 'らっこ', exampleMeaning: '海獺', exampleEmoji: '🦦' },
  { id: 'ri', hiragana: 'り', katakana: 'リ', romaji: 'ri', row: 'ra', col: 1, exampleWord: 'りんご', exampleReading: 'りんご', exampleMeaning: '林檎', exampleEmoji: '🍎' },
  { id: 'ru', hiragana: 'る', katakana: 'ル', romaji: 'ru', row: 'ra', col: 2, exampleWord: 'るびー', exampleReading: 'るびー', exampleMeaning: 'ルビー', exampleEmoji: '💎' },
  { id: 're', hiragana: 'れ', katakana: 'レ', romaji: 're', row: 'ra', col: 3, exampleWord: 'れもん', exampleReading: 'れもん', exampleMeaning: '檸檬', exampleEmoji: '🍋' },
  { id: 'ro', hiragana: 'ろ', katakana: 'ロ', romaji: 'ro', row: 'ra', col: 4, exampleWord: 'ろうそく', exampleReading: 'ろうそく', exampleMeaning: '蝋燭', exampleEmoji: '🕯️' },

  // わ行
  { id: 'wa', hiragana: 'わ', katakana: 'ワ', romaji: 'wa', row: 'wa', col: 0, exampleWord: 'わに', exampleReading: 'わに', exampleMeaning: '鰐', exampleEmoji: '🐊' },
  { id: 'wo', hiragana: 'を', katakana: 'ヲ', romaji: 'wo', row: 'wa', col: 1, exampleWord: 'ほんをよむ', exampleReading: 'を', exampleMeaning: '助詞', exampleEmoji: '📖' },
  { id: 'n', hiragana: 'ん', katakana: 'ン', romaji: 'n', row: 'wa', col: 2, exampleWord: 'みかん', exampleReading: 'ん', exampleMeaning: '撥音', exampleEmoji: '🍊' },
];

export const ROW_GROUPS = [
  { id: 'a', name: 'あ行 (a, i, u, e, o)' },
  { id: 'ka', name: 'か行 (ka, ki, ku, ke, ko)' },
  { id: 'sa', name: 'さ行 (sa, shi, su, se, so)' },
  { id: 'ta', name: 'た行 (ta, chi, tsu, te, to)' },
  { id: 'na', name: 'な行 (na, ni, nu, ne, no)' },
  { id: 'ha', name: 'は行 (ha, hi, fu, he, ho)' },
  { id: 'ma', name: 'ま行 (ma, mi, mu, me, mo)' },
  { id: 'ya', name: 'や行 (ya, yu, yo)' },
  { id: 'ra', name: 'ら行 (ra, ri, ru, re, ro)' },
  { id: 'wa', name: 'わ行 (wa, wo, n)' },
];

export const FISH_SPECIES_LIST: FishSpecies[] = [
  {
    id: 'tai',
    name: 'たい',
    nameKana: 'タイ (鯛)',
    type: 'tai',
    primaryColor: '#F43F5E', // coral pink
    secondaryColor: '#FDA4AF',
    accentColor: '#FFE4E6',
    size: 'medium',
    depth: 'mid',
    baseSpeed: 1.1,
  },
  {
    id: 'tako',
    name: 'たこ',
    nameKana: 'タコ (蛸)',
    type: 'tako',
    primaryColor: '#E11D48', // red
    secondaryColor: '#FB7185',
    accentColor: '#FFF1F2',
    size: 'medium',
    depth: 'deep',
    baseSpeed: 0.8,
  },
  {
    id: 'ika',
    name: 'いか',
    nameKana: 'イカ (烏賊)',
    type: 'ika',
    primaryColor: '#38BDF8', // cyan
    secondaryColor: '#BAE6FD',
    accentColor: '#F0F9FF',
    size: 'medium',
    depth: 'mid',
    baseSpeed: 1.3,
  },
  {
    id: 'kani',
    name: 'かに',
    nameKana: 'カニ (蟹)',
    type: 'kani',
    primaryColor: '#EA580C', // orange
    secondaryColor: '#FDBA74',
    accentColor: '#FFF7ED',
    size: 'small',
    depth: 'deep',
    baseSpeed: 0.7,
  },
  {
    id: 'kujira',
    name: 'くじら',
    nameKana: 'クジラ (鯨)',
    type: 'kujira',
    primaryColor: '#2563EB', // blue
    secondaryColor: '#93C5FD',
    accentColor: '#EFF6FF',
    size: 'huge',
    depth: 'mid',
    baseSpeed: 0.6,
  },
  {
    id: 'iruka',
    name: 'いるか',
    nameKana: 'イルカ (海豚)',
    type: 'iruka',
    primaryColor: '#0284C7', // sky deep
    secondaryColor: '#7DD3FC',
    accentColor: '#E0F2FE',
    size: 'large',
    depth: 'shallow',
    baseSpeed: 1.5,
  },
  {
    id: 'kurage',
    name: 'くらげ',
    nameKana: 'クラゲ (水母)',
    type: 'kurage',
    primaryColor: '#C084FC', // purple
    secondaryColor: '#E9D5FF',
    accentColor: '#FAF5FF',
    size: 'small',
    depth: 'mid',
    baseSpeed: 0.6,
  },
  {
    id: 'ebi',
    name: 'えび',
    nameKana: 'エビ (海老)',
    type: 'ebi',
    primaryColor: '#F97316', // bright orange
    secondaryColor: '#FED7AA',
    accentColor: '#FFF7ED',
    size: 'small',
    depth: 'deep',
    baseSpeed: 1.0,
  },
  {
    id: 'kame',
    name: 'うみがめ',
    nameKana: 'ウミガメ (亀)',
    type: 'kame',
    primaryColor: '#10B981', // emerald green
    secondaryColor: '#6EE7B7',
    accentColor: '#ECFDF5',
    size: 'large',
    depth: 'mid',
    baseSpeed: 0.9,
  },
  {
    id: 'manbou',
    name: 'まんぼう',
    nameKana: 'マンボウ (翻車魚)',
    type: 'manbou',
    primaryColor: '#64748B', // slate blue
    secondaryColor: '#CBD5E1',
    accentColor: '#F8FAFC',
    size: 'large',
    depth: 'deep',
    baseSpeed: 0.5,
  },
  {
    id: 'clownfish',
    name: 'くまのみ',
    nameKana: 'クマノミ',
    type: 'clownfish',
    primaryColor: '#F59E0B', // amber yellow
    secondaryColor: '#FDE68A',
    accentColor: '#FFFFFF',
    size: 'small',
    depth: 'shallow',
    baseSpeed: 1.2,
  },
  {
    id: 'rainbow',
    name: 'にじいろフィッシュ',
    nameKana: 'レインボーフィッシュ',
    type: 'rainbow',
    primaryColor: '#EC4899', // pink to rainbow
    secondaryColor: '#818CF8',
    accentColor: '#34D399',
    size: 'medium',
    depth: 'shallow',
    baseSpeed: 1.4,
  },
];

export const TARGET_WORDS: TargetWord[] = [
  // 2-letter easy words
  {
    id: 'tai',
    word: 'たい',
    katakana: 'タイ',
    letters: ['た', 'い'],
    katakanaLetters: ['タ', 'イ'],
    meaning: 'おめでたい赤いきれいな魚',
    emoji: '🐠',
    category: 'sea_animal',
    difficulty: 'easy',
  },
  {
    id: 'tako',
    word: 'たこ',
    katakana: 'タコ',
    letters: ['た', 'こ'],
    katakanaLetters: ['タ', 'コ'],
    meaning: '8ぽんのあしがあるうみのいきもの',
    emoji: '🐙',
    category: 'sea_animal',
    difficulty: 'easy',
  },
  {
    id: 'ika',
    word: 'いか',
    katakana: 'イカ',
    letters: ['い', 'か'],
    katakanaLetters: ['イ', 'カ'],
    meaning: '10ぽんのあしがあるよ',
    emoji: '🦑',
    category: 'sea_animal',
    difficulty: 'easy',
  },
  {
    id: 'kani',
    word: 'かに',
    katakana: 'カニ',
    letters: ['か', 'に'],
    katakanaLetters: ['カ', 'ニ'],
    meaning: 'ちょきちょきハサミをもっているよ',
    emoji: '🦀',
    category: 'sea_animal',
    difficulty: 'easy',
  },
  {
    id: 'ebi',
    word: 'えび',
    katakana: 'エビ',
    letters: ['え', 'び'],
    katakanaLetters: ['エ', 'ビ'],
    meaning: 'ながいヒゲとおいしいみがあるよ',
    emoji: '🦐',
    category: 'sea_animal',
    difficulty: 'easy',
  },
  {
    id: 'same',
    word: 'さめ',
    katakana: 'サメ',
    letters: ['さ', 'め'],
    katakanaLetters: ['サ', 'メ'],
    meaning: 'するどいハをもつ海のハンター',
    emoji: '🦈',
    category: 'sea_animal',
    difficulty: 'easy',
  },
  {
    id: 'kame',
    word: 'かめ',
    katakana: 'カメ',
    letters: ['か', 'め'],
    katakanaLetters: ['カ', 'メ'],
    meaning: 'こうらをせおってのんびり泳ぐよ',
    emoji: '🐢',
    category: 'sea_animal',
    difficulty: 'easy',
  },
  {
    id: 'umi',
    word: 'うみ',
    katakana: 'ウミ',
    letters: ['う', 'み'],
    katakanaLetters: ['ウ', 'ミ'],
    meaning: 'ひろくてあおい海',
    emoji: '🌊',
    category: 'nature',
    difficulty: 'easy',
  },
  {
    id: 'fune',
    word: 'ふね',
    katakana: 'フネ',
    letters: ['ふ', 'ね'],
    katakanaLetters: ['フ', 'ネ'],
    meaning: '海をすすむのりもの',
    emoji: '⛵',
    category: 'nature',
    difficulty: 'easy',
  },
  {
    id: 'nami',
    word: 'なみ',
    katakana: 'ナミ',
    letters: ['な', 'み'],
    katakanaLetters: ['ナ', 'ミ'],
    meaning: 'ざぶーんと寄せる海の波',
    emoji: '🌊',
    category: 'nature',
    difficulty: 'easy',
  },
  {
    id: 'hoshi',
    word: 'ほし',
    katakana: 'ホシ',
    letters: ['ほ', 'し'],
    katakanaLetters: ['ホ', 'シ'],
    meaning: 'きらきら光る星・ヒトデ',
    emoji: '⭐',
    category: 'nature',
    difficulty: 'easy',
  },

  // 3-letter medium words
  {
    id: 'sakana',
    word: 'さかな',
    katakana: 'サカナ',
    letters: ['さ', 'か', 'な'],
    katakanaLetters: ['サ', 'カ', 'ナ'],
    meaning: '海や川をスイスイ泳ぐよ',
    emoji: '🐟',
    category: 'sea_animal',
    difficulty: 'medium',
  },
  {
    id: 'kujira',
    word: 'くじら',
    katakana: 'クジラ',
    letters: ['く', 'じ', 'ら'],
    katakanaLetters: ['ク', 'ジ', 'ラ'],
    meaning: '世界でいちばん大きないきもの',
    emoji: '🐳',
    category: 'sea_animal',
    difficulty: 'medium',
  },
  {
    id: 'iruka',
    word: 'いるか',
    katakana: 'イルカ',
    letters: ['い', 'る', 'か'],
    katakanaLetters: ['イ', 'ル', 'カ'],
    meaning: 'ジャンプがとくいな海のともだち',
    emoji: '🐬',
    category: 'sea_animal',
    difficulty: 'medium',
  },
  {
    id: 'kurage',
    word: 'くらげ',
    katakana: 'クラゲ',
    letters: ['く', 'ら', 'げ'],
    katakanaLetters: ['ク', 'ラ', 'ゲ'],
    meaning: 'ふわふわ海をただようよ',
    emoji: '🪼',
    category: 'sea_animal',
    difficulty: 'medium',
  },
  {
    id: 'maguro',
    word: 'まぐろ',
    katakana: 'マグロ',
    letters: ['ま', 'ぐ', 'ろ'],
    katakanaLetters: ['マ', 'グ', 'ロ'],
    meaning: 'スピードがとってもはやい魚',
    emoji: '🐟',
    category: 'sea_animal',
    difficulty: 'medium',
  },
  {
    id: 'rakko',
    word: 'らっこ',
    katakana: 'ラッコ',
    letters: ['ら', 'っ', 'こ'],
    katakanaLetters: ['ラ', 'ッ', 'コ'],
    meaning: 'おなかのうえで貝をわるよ',
    emoji: '🦦',
    category: 'sea_animal',
    difficulty: 'medium',
  },

  // 4-letter words
  {
    id: 'manbou',
    word: 'まんぼう',
    katakana: 'マンボウ',
    letters: ['ま', 'ん', 'ぼ', 'う'],
    katakanaLetters: ['マ', 'ン', 'ボ', 'ウ'],
    meaning: 'おおきくてまるいユーモラスな魚',
    emoji: '🐡',
    category: 'sea_animal',
    difficulty: 'hard',
  },
  {
    id: 'pengin',
    word: 'ぺんぎん',
    katakana: 'ペンギン',
    letters: ['ぺ', 'ん', 'ぎ', 'ん'],
    katakanaLetters: ['ペ', 'ン', 'ギ', 'ン'],
    meaning: '海をすいすい飛ぶように泳ぐ鳥',
    emoji: '🐧',
    category: 'sea_animal',
    difficulty: 'hard',
  },
];

// Map for quick kana lookups
export const KANA_BY_ID = new Map<string, KanaItem>(
  GOJUON_LIST.map((k) => [k.id, k])
);

export const KANA_BY_HIRAGANA = new Map<string, KanaItem>(
  GOJUON_LIST.map((k) => [k.hiragana, k])
);

export const KANA_BY_KATAKANA = new Map<string, KanaItem>(
  GOJUON_LIST.map((k) => [k.katakana, k])
);

// Helper to get Kana item from char (either hiragana or katakana)
export function getKanaByChar(char: string): KanaItem | undefined {
  return KANA_BY_HIRAGANA.get(char) || KANA_BY_KATAKANA.get(char);
}

// Valid Japanese craftable words for sandbox card combiner
export const COMBINABLE_WORDS = [
  ...TARGET_WORDS.map(w => ({ word: w.word, katakana: w.katakana, meaning: w.meaning, emoji: w.emoji })),
  { word: 'あめ', katakana: 'アメ', meaning: '雨または甘いお菓子', emoji: '🍬' },
  { word: 'いぬ', katakana: 'イヌ', meaning: 'ワンワン鳴く可愛い動物', emoji: '🐶' },
  { word: 'ねこ', katakana: 'ネコ', meaning: 'ニャーと鳴く可愛い動物', emoji: '🐱' },
  { word: 'とり', katakana: 'トリ', meaning: '空をとぶ鳥', emoji: '🐦' },
  { word: 'そら', katakana: 'ソラ', meaning: '青く広がる大空', emoji: '🌤️' },
  { word: 'やま', katakana: 'ヤマ', meaning: 'たかい山', emoji: '⛰️' },
  { word: 'かわ', katakana: 'カワ', meaning: '水が流れる川', emoji: '🏞️' },
  { word: 'はな', katakana: 'ハナ', meaning: 'きれいに咲く花', emoji: '🌸' },
  { word: 'き', katakana: 'キ', meaning: '緑の大きな木', emoji: '🌳' },
  { word: 'つき', katakana: 'ツキ', meaning: '夜空に浮かぶ月', emoji: '🌙' },
  { word: 'ひ', katakana: 'ヒ', meaning: 'あたたかい太陽や火', emoji: '☀️' },
  { word: 'みず', katakana: 'ミズ', meaning: '命をうるおすきれいな水', emoji: '💧' },
  { word: 'くも', katakana: 'クモ', meaning: '空にうかぶ白い雲', emoji: '☁️' },
  { word: 'にじ', katakana: 'ニジ', meaning: '雨あがりのきれいな虹', emoji: '🌈' },
  { word: 'ゆき', katakana: 'ユキ', meaning: '冬のしろい雪', emoji: '❄️' },
];
