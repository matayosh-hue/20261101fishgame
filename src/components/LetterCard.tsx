import React from 'react';
import { KanaItem } from '../types';
import { speakLetter } from '../utils/audio';

interface LetterCardProps {
  kana: KanaItem;
  mode?: 'hiragana' | 'katakana' | 'both';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fishTag';
  highlighted?: boolean;
  selected?: boolean;
  onClick?: () => void;
  showRomaji?: boolean;
  showSoundButton?: boolean;
  className?: string;
}

export const LetterCard: React.FC<LetterCardProps> = ({
  kana,
  mode = 'hiragana',
  size = 'md',
  highlighted = false,
  selected = false,
  onClick,
  showRomaji = false,
  showSoundButton = false,
  className = '',
}) => {
  const displayChar = mode === 'katakana' ? kana.katakana : kana.hiragana;
  const secondaryChar = mode === 'hiragana' ? kana.katakana : kana.hiragana;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    speakLetter(displayChar);
    if (onClick) onClick();
  };

  if (size === 'fishTag') {
    return (
      <div
        onClick={handleClick}
        className={`relative flex items-center justify-center font-bold transition-transform duration-200 cursor-pointer shadow-md select-none rounded-xl border-2 ${
          highlighted
            ? 'bg-amber-300 border-amber-500 text-amber-950 scale-110 ring-4 ring-amber-300/60'
            : 'bg-white/95 border-sky-300 text-sky-950 hover:border-amber-400'
        } ${className}`}
        style={{ width: '42px', height: '42px' }}
      >
        <span className="text-2xl leading-none font-black tracking-normal font-sans">
          {displayChar}
        </span>
        {/* Little hook ring loop on top of card */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border-2 border-amber-500/80 bg-white" />
      </div>
    );
  }

  // Size configurations
  const sizeStyles = {
    sm: 'w-10 h-12 text-lg rounded-lg border',
    md: 'w-14 h-16 text-2xl rounded-xl border-2',
    lg: 'w-20 h-24 text-4xl rounded-2xl border-2',
    xl: 'w-28 h-32 text-6xl rounded-3xl border-3',
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`group relative flex flex-col items-center justify-center font-bold transition-all duration-150 cursor-pointer select-none active:scale-95 ${sizeStyles[size]} ${
        selected
          ? 'bg-amber-100 border-amber-500 text-amber-900 shadow-md ring-2 ring-amber-400 -translate-y-1'
          : highlighted
          ? 'bg-yellow-50 border-yellow-400 text-yellow-900 shadow-lg ring-4 ring-yellow-300/70 scale-105'
          : 'bg-white border-slate-200 text-slate-800 hover:border-sky-400 hover:shadow-md hover:-translate-y-0.5'
      } ${className}`}
    >
      <span className="font-black leading-none drop-shadow-sm font-sans">
        {displayChar}
      </span>

      {mode === 'both' && (
        <span className="text-xs text-slate-400 mt-1 font-normal">
          {secondaryChar}
        </span>
      )}

      {showRomaji && (
        <span className="text-[10px] text-slate-400 font-mono tracking-wider font-semibold uppercase mt-0.5">
          {kana.romaji}
        </span>
      )}

      {showSoundButton && (
        <div className="absolute top-1 right-1 opacity-60 group-hover:opacity-100 transition-opacity">
          <svg className="w-3.5 h-3.5 text-sky-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
        </div>
      )}
    </button>
  );
};
