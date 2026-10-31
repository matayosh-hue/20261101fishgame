import React, { useState } from 'react';
import { KanaItem, FishSpecies } from '../types';
import { GOJUON_LIST, ROW_GROUPS, FISH_SPECIES_LIST, TARGET_WORDS } from '../data/japaneseData';
import { LetterCard } from './LetterCard';
import { FishSvg } from './FishSvg';
import { speakLetter, speakJapanese } from '../utils/audio';
import { Volume2, Trophy, BookOpen, Fish, Sparkles, CheckCircle2 } from 'lucide-react';

interface ZukanChartProps {
  caughtLetterCounts: Record<string, number>;
  stars: number;
  onOpenAchievements?: () => void;
  unlockedBadgesCount?: number;
}

export const ZukanChart: React.FC<ZukanChartProps> = ({
  caughtLetterCounts,
  stars,
  onOpenAchievements,
  unlockedBadgesCount = 0,
}) => {
  const [activeTab, setActiveTab] = useState<'chart' | 'aquarium'>('chart');
  const [displayMode, setDisplayMode] = useState<'hiragana' | 'katakana' | 'both'>('hiragana');
  const [selectedKana, setSelectedKana] = useState<KanaItem | null>(null);

  // Stats calculation
  const totalLettersMastered = Object.keys(caughtLetterCounts).filter(
    (k) => (caughtLetterCounts[k] || 0) > 0
  ).length;
  const totalGojuon = GOJUON_LIST.length;

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto space-y-6">
      {/* Top Banner & Tab Controls */}
      <div className="bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-700 text-white p-6 rounded-3xl shadow-lg border-b-4 border-blue-900 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/30 backdrop-blur-sm">
            📖
          </div>
          <div>
            <div className="text-xs font-semibold text-cyan-100 flex items-center gap-1">
              <span>お魚＆もじ図鑑</span>
              <span>・</span>
              <span>あつめた魚と文字をチェックしよう！</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black">
              {activeTab === 'chart' ? '五十音チャート' : 'マイ・水族館'}
            </h2>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 p-1.5 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
          <button
            type="button"
            onClick={() => setActiveTab('chart')}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'chart'
                ? 'bg-white text-blue-900 shadow-md'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>五十音ひょう</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('aquarium')}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'aquarium'
                ? 'bg-white text-blue-900 shadow-md'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <Fish className="w-4 h-4" />
            <span>水族館</span>
          </button>
        </div>
      </div>

      {/* Progress overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            🎣
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400">つかまえた魚</div>
            <div className="text-xl font-black text-slate-800">{stars} 匹</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            ✨
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400">覚えた文字</div>
            <div className="text-xl font-black text-slate-800">
              {totalLettersMastered} / {totalGojuon}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            📈
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400">達成率</div>
            <div className="text-xl font-black text-slate-800">
              {Math.round((totalLettersMastered / totalGojuon) * 100)}%
            </div>
          </div>
        </div>

        <div
          onClick={onOpenAchievements}
          className="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm flex items-center gap-3 cursor-pointer hover:border-amber-300 hover:shadow-md transition-all group"
          title="実績バッジ図鑑を開く"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
            🏅
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <span>実績バッジ</span>
              <span className="text-amber-500 text-[10px]">詳細を見る</span>
            </div>
            <div className="text-xl font-black text-slate-800">
              {unlockedBadgesCount} 個獲得
            </div>
          </div>
        </div>
      </div>

      {/* Tab 1: 50-sound chart (五十音図) */}
      {activeTab === 'chart' && (
        <div className="bg-white rounded-3xl p-6 shadow-md border border-sky-100">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
            <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>カードをタップして発音や単語を学ぼう</span>
            </span>

            {/* Display toggle */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setDisplayMode('hiragana')}
                className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                  displayMode === 'hiragana' ? 'bg-white text-sky-800 shadow-sm' : 'text-slate-600'
                }`}
              >
                ひらがな
              </button>
              <button
                type="button"
                onClick={() => setDisplayMode('katakana')}
                className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                  displayMode === 'katakana' ? 'bg-white text-sky-800 shadow-sm' : 'text-slate-600'
                }`}
              >
                カタカナ
              </button>
              <button
                type="button"
                onClick={() => setDisplayMode('both')}
                className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                  displayMode === 'both' ? 'bg-white text-sky-800 shadow-sm' : 'text-slate-600'
                }`}
              >
                両方表示
              </button>
            </div>
          </div>

          {/* Gojuon Rows */}
          <div className="space-y-4">
            {ROW_GROUPS.map((rowGroup) => {
              const rowKanas = GOJUON_LIST.filter((k) => k.row === rowGroup.id);

              return (
                <div
                  key={rowGroup.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-2xl bg-sky-50/50 hover:bg-sky-50 transition-colors border border-sky-100/60"
                >
                  <div className="w-24 shrink-0 text-xs font-bold text-sky-800">
                    {rowGroup.name.split(' ')[0]}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {rowKanas.map((kana) => {
                      const count = caughtLetterCounts[kana.id] || 0;
                      const isCaught = count > 0;

                      return (
                        <div
                          key={kana.id}
                          className="relative group cursor-pointer"
                          onClick={() => {
                            setSelectedKana(kana);
                            speakLetter(kana.hiragana);
                          }}
                        >
                          <LetterCard
                            kana={kana}
                            mode={displayMode}
                            size="md"
                            highlighted={isCaught}
                            showRomaji={true}
                            className={
                              isCaught
                                ? 'bg-white border-amber-300 shadow-sm'
                                : 'bg-slate-50 border-slate-200 opacity-80'
                            }
                          />

                          {/* Catch count badge */}
                          {count > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 text-[9px] font-black px-1.5 py-0.2 rounded-full bg-amber-500 text-white border border-white shadow">
                              ×{count}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Aquarium (水族館) */}
      {activeTab === 'aquarium' && (
        <div className="relative w-full h-[520px] rounded-3xl overflow-hidden border-4 border-cyan-400 shadow-2xl bg-gradient-to-b from-sky-400 via-cyan-600 to-blue-950 p-6 flex flex-col justify-between select-none">
          {/* Surface light & bubbles */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between text-white">
            <div className="bg-sky-950/60 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/20">
              <h3 className="text-base font-black flex items-center gap-2">
                <span>🌊 ゆらゆら水族館</span>
              </h3>
              <p className="text-xs text-sky-200">
                つかまえた魚たちが元気に泳いでいるよ！タップして声をきいてみよう！
              </p>
            </div>
          </div>

          {/* Aquarium Swimming Fish */}
          <div className="relative flex-1 w-full overflow-hidden">
            {FISH_SPECIES_LIST.map((species, i) => {
              // Only show if stars > i * 2 or default 4 species
              const isUnlocked = stars >= i || i < 4;
              if (!isUnlocked) return null;

              const topPct = 15 + ((i * 17) % 65);
              const leftPct = 10 + ((i * 24) % 75);
              const dir: 1 | -1 = i % 2 === 0 ? 1 : -1;

              return (
                <div
                  key={species.id}
                  onClick={() => {
                    speakJapanese(`これは「${species.name}」だよ！`);
                  }}
                  className="absolute cursor-pointer hover:scale-125 transition-transform duration-200 group"
                  style={{
                    top: `${topPct}%`,
                    left: `${leftPct}%`,
                  }}
                  title={species.name}
                >
                  <FishSvg
                    species={species}
                    direction={dir}
                    width={75}
                    height={48}
                    animateTail={true}
                  />
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {species.name}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Seabed with plants */}
          <div className="relative z-10 flex items-center justify-between text-white/80 text-xs">
            <span>つかまえた魚の総数: {stars}匹</span>
            <span>魚をタップすると名前を教えてくれるよ！</span>
          </div>
        </div>
      )}

      {/* Kana Detail Modal */}
      {selectedKana && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl border-4 border-sky-400 relative">
            <button
              type="button"
              onClick={() => setSelectedKana(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-black cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center justify-center gap-6 my-4">
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-400 mb-1">ひらがな</span>
                <div className="w-20 h-24 bg-sky-50 border-2 border-sky-300 text-sky-950 rounded-2xl flex items-center justify-center text-5xl font-black font-sans shadow-md">
                  {selectedKana.hiragana}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-400 mb-1">カタカナ</span>
                <div className="w-20 h-24 bg-amber-50 border-2 border-amber-300 text-amber-950 rounded-2xl flex items-center justify-center text-5xl font-black font-sans shadow-md">
                  {selectedKana.katakana}
                </div>
              </div>
            </div>

            <div className="text-sm font-bold text-slate-500 mb-4">
              ローマ字表記: <span className="font-mono uppercase text-sky-700 font-black">{selectedKana.romaji}</span>
            </div>

            {/* Example word */}
            <div className="bg-sky-50 p-4 rounded-2xl border border-sky-200 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedKana.exampleEmoji}</span>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-400">ことばのれい</div>
                  <div className="text-lg font-black text-slate-800">
                    {selectedKana.exampleWord} ({selectedKana.exampleMeaning})
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => speakJapanese(`${selectedKana.hiragana}！${selectedKana.exampleWord}！`)}
                className="p-2 bg-white hover:bg-sky-100 text-sky-700 rounded-xl border border-sky-200 shadow-sm cursor-pointer"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => speakLetter(selectedKana.hiragana)}
              className="w-full py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-base rounded-2xl shadow-lg cursor-pointer flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <Volume2 className="w-5 h-5" />
              <span>もういちど声を聞く</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
