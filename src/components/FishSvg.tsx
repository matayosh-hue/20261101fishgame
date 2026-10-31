import React from 'react';
import { FishSpecies } from '../types';

interface FishSvgProps {
  species: FishSpecies;
  direction?: 1 | -1; // 1 = facing right, -1 = facing left
  width?: number;
  height?: number;
  className?: string;
  animateTail?: boolean;
}

export const FishSvg: React.FC<FishSvgProps> = ({
  species,
  direction = 1,
  width = 80,
  height = 50,
  className = '',
  animateTail = true,
}) => {
  const { type, primaryColor, secondaryColor, accentColor } = species;
  const flip = direction === -1 ? 'scale-x-[-1]' : '';

  switch (type) {
    case 'tai':
      return (
        <svg
          viewBox="0 0 100 65"
          width={width}
          height={height}
          className={`${flip} ${className} overflow-visible`}
        >
          {/* Tail */}
          <path
            d="M 22 32 C 10 18, 0 15, 2 32 C 0 49, 10 46, 22 32 Z"
            fill={primaryColor}
            className={animateTail ? 'animate-pulse' : ''}
          />
          {/* Dorsal Fin */}
          <path
            d="M 40 18 C 50 6, 70 8, 75 22 Z"
            fill={secondaryColor}
          />
          {/* Body */}
          <ellipse cx="56" cy="33" rx="34" ry="22" fill={primaryColor} />
          {/* Belly */}
          <path
            d="M 32 36 C 45 52, 75 52, 86 36 C 75 44, 45 44, 32 36 Z"
            fill={secondaryColor}
          />
          {/* Gills */}
          <path
            d="M 68 25 C 64 33, 64 39, 68 45"
            stroke={secondaryColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Pectoral Fin */}
          <ellipse cx="54" cy="38" rx="8" ry="5" fill={secondaryColor} transform="rotate(15 54 38)" />
          {/* Eye */}
          <circle cx="78" cy="28" r="6" fill="#FFFFFF" />
          <circle cx="80" cy="28" r="3.5" fill="#1E293B" />
          <circle cx="81.5" cy="26.5" r="1.5" fill="#FFFFFF" />
          {/* Mouth */}
          <path d="M 89 33 Q 86 36 84 33" stroke="#9F1239" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'tako':
      return (
        <svg
          viewBox="0 0 80 75"
          width={width}
          height={height}
          className={`${flip} ${className} overflow-visible`}
        >
          {/* Tentacles */}
          <path
            d="M 18 50 Q 14 68 22 70 Q 28 72 26 55"
            fill={primaryColor}
            stroke={secondaryColor}
            strokeWidth="1.5"
          />
          <path
            d="M 28 53 Q 28 73 36 71 Q 40 68 37 54"
            fill={primaryColor}
            stroke={secondaryColor}
            strokeWidth="1.5"
          />
          <path
            d="M 42 54 Q 45 74 53 71 Q 56 68 51 53"
            fill={primaryColor}
            stroke={secondaryColor}
            strokeWidth="1.5"
          />
          <path
            d="M 54 50 Q 64 68 58 70 Q 52 72 48 53"
            fill={primaryColor}
            stroke={secondaryColor}
            strokeWidth="1.5"
          />
          {/* Head */}
          <ellipse cx="40" cy="34" rx="28" ry="24" fill={primaryColor} />
          {/* Head shine */}
          <ellipse cx="32" cy="22" rx="10" ry="6" fill={secondaryColor} opacity="0.6" transform="rotate(-20 32 22)" />
          {/* Eyes */}
          <circle cx="30" cy="34" r="5.5" fill="#FFFFFF" />
          <circle cx="31.5" cy="34" r="3.2" fill="#1E293B" />
          <circle cx="32.5" cy="32.5" r="1.2" fill="#FFFFFF" />

          <circle cx="50" cy="34" r="5.5" fill="#FFFFFF" />
          <circle cx="51.5" cy="34" r="3.2" fill="#1E293B" />
          <circle cx="52.5" cy="32.5" r="1.2" fill="#FFFFFF" />

          {/* Cheeks */}
          <circle cx="23" cy="39" r="3" fill="#FDA4AF" opacity="0.8" />
          <circle cx="57" cy="39" r="3" fill="#FDA4AF" opacity="0.8" />

          {/* Cute round snout / mouth */}
          <ellipse cx="40" cy="42" rx="5" ry="3.5" fill="#BE123C" />
          <ellipse cx="40" cy="42" rx="2.5" ry="1.8" fill="#FFF1F2" />
        </svg>
      );

    case 'ika':
      return (
        <svg
          viewBox="0 0 95 60"
          width={width}
          height={height}
          className={`${flip} ${className} overflow-visible`}
        >
          {/* Fin / Mantle pointy tip */}
          <polygon points="90,30 65,12 65,48" fill={primaryColor} />
          {/* Mantle Body */}
          <ellipse cx="50" cy="30" rx="26" ry="17" fill={primaryColor} />
          <ellipse cx="54" cy="25" rx="14" ry="7" fill={secondaryColor} opacity="0.5" />
          {/* Eyes */}
          <circle cx="36" cy="25" r="5" fill="#FFFFFF" />
          <circle cx="35" cy="25" r="3" fill="#0F172A" />
          <circle cx="34" cy="24" r="1.2" fill="#FFFFFF" />
          {/* Tentacles extending backwards */}
          <path d="M 26 24 C 15 20, 8 28, 0 25" stroke={primaryColor} strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M 25 30 C 14 30, 6 36, 2 34" stroke={secondaryColor} strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M 26 36 C 15 40, 8 32, 1 37" stroke={primaryColor} strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {/* Long tentacles */}
          <path d="M 24 28 C 10 32, 2 18, -10 24" stroke={primaryColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <ellipse cx="-10" cy="24" rx="4" ry="2.5" fill={secondaryColor} />
        </svg>
      );

    case 'kani':
      return (
        <svg
          viewBox="0 0 85 65"
          width={width}
          height={height}
          className={`${flip} ${className} overflow-visible`}
        >
          {/* Crab Legs */}
          <path d="M 20 40 Q 10 52 14 60" stroke={primaryColor} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 26 44 Q 22 55 28 62" stroke={primaryColor} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 60 44 Q 64 55 58 62" stroke={primaryColor} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 66 40 Q 76 52 72 60" stroke={primaryColor} strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Claws */}
          <path d="M 24 28 Q 12 18 16 10 C 24 6, 26 18, 22 24" fill={primaryColor} />
          <path d="M 62 28 Q 74 18 70 10 C 62 6, 60 18, 64 24" fill={primaryColor} />
          {/* Body */}
          <ellipse cx="43" cy="38" rx="22" ry="15" fill={primaryColor} />
          <ellipse cx="43" cy="35" rx="16" ry="9" fill={secondaryColor} />
          {/* Eye stalks */}
          <line x1="36" y1="26" x2="36" y2="18" stroke={primaryColor} strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="36" cy="16" r="4.5" fill="#FFFFFF" />
          <circle cx="36.5" cy="16" r="2.5" fill="#0F172A" />

          <line x1="50" y1="26" x2="50" y2="18" stroke={primaryColor} strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="50" cy="16" r="4.5" fill="#FFFFFF" />
          <circle cx="50.5" cy="16" r="2.5" fill="#0F172A" />
          {/* Smile */}
          <path d="M 40 42 Q 43 45 46 42" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'kujira':
      return (
        <svg
          viewBox="0 0 120 70"
          width={width}
          height={height}
          className={`${flip} ${className} overflow-visible`}
        >
          {/* Water Spout */}
          <path
            d="M 75 14 C 72 2, 65 4, 60 8 C 65 2, 85 2, 75 14 Z"
            fill="#38BDF8"
            className="animate-bounce"
          />
          {/* Fluke / Tail */}
          <path
            d="M 24 35 C 10 22, 2 20, 6 35 C 2 50, 10 48, 24 35 Z"
            fill={primaryColor}
          />
          {/* Big Whale Body */}
          <path
            d="M 24 35 C 30 18, 60 14, 85 18 C 105 22, 114 36, 110 45 C 102 56, 50 56, 24 35 Z"
            fill={primaryColor}
          />
          {/* White Belly */}
          <path
            d="M 40 43 C 55 52, 85 53, 105 44 C 98 52, 60 54, 40 43 Z"
            fill="#F0F9FF"
          />
          {/* Belly grooves */}
          <path d="M 60 48 Q 72 49 84 46" stroke="#93C5FD" strokeWidth="1.5" fill="none" />
          <path d="M 64 51 Q 74 52 82 50" stroke="#93C5FD" strokeWidth="1.5" fill="none" />
          {/* Flipper */}
          <ellipse cx="62" cy="42" rx="10" ry="5" fill={secondaryColor} transform="rotate(20 62 42)" />
          {/* Eye */}
          <circle cx="96" cy="33" r="4.5" fill="#FFFFFF" />
          <circle cx="97" cy="33" r="2.8" fill="#0F172A" />
          <circle cx="98" cy="32" r="1" fill="#FFFFFF" />
          {/* Smile */}
          <path d="M 104 38 Q 98 42 92 40" stroke="#1E3A8A" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'iruka':
      return (
        <svg
          viewBox="0 0 110 60"
          width={width}
          height={height}
          className={`${flip} ${className} overflow-visible`}
        >
          {/* Tail */}
          <path d="M 20 30 C 8 20, 2 22, 5 30 C 2 38, 8 40, 20 30 Z" fill={primaryColor} />
          {/* Dorsal Fin */}
          <path d="M 52 14 C 58 4, 66 8, 68 20 Z" fill={primaryColor} />
          {/* Body */}
          <path
            d="M 20 30 C 35 18, 60 16, 85 22 C 98 25, 106 30, 104 34 C 100 36, 92 34, 88 38 C 65 48, 38 42, 20 30 Z"
            fill={primaryColor}
          />
          {/* Belly */}
          <path
            d="M 36 34 C 55 42, 75 42, 88 38 C 75 45, 50 43, 36 34 Z"
            fill={secondaryColor}
          />
          {/* Pectoral Fin */}
          <polygon points="62,35 68,48 55,42" fill={secondaryColor} />
          {/* Eye */}
          <circle cx="88" cy="28" r="4" fill="#FFFFFF" />
          <circle cx="89" cy="28" r="2.5" fill="#0F172A" />
          <circle cx="90" cy="27" r="1" fill="#FFFFFF" />
          {/* Snout smile */}
          <path d="M 100 33 Q 95 36 91 33" stroke="#0369A1" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'kurage':
      return (
        <svg
          viewBox="0 0 75 75"
          width={width}
          height={height}
          className={`${flip} ${className} overflow-visible`}
        >
          {/* Tentacles */}
          <path d="M 25 45 Q 22 62 26 72" stroke={primaryColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M 33 46 Q 37 60 32 74" stroke={secondaryColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M 42 46 Q 38 60 43 74" stroke={secondaryColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M 50 45 Q 53 62 49 72" stroke={primaryColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Bell Dome */}
          <path
            d="M 16 42 C 16 18, 59 18, 59 42 C 54 40, 48 45, 42 42 C 37 45, 31 40, 26 43 C 21 40, 18 43, 16 42 Z"
            fill={primaryColor}
            fillOpacity="0.85"
          />
          {/* Inner Glow */}
          <ellipse cx="37.5" cy="30" rx="14" ry="9" fill={secondaryColor} fillOpacity="0.6" />
          {/* Eyes */}
          <circle cx="30" cy="32" r="3.5" fill="#FFFFFF" />
          <circle cx="30.5" cy="32" r="2" fill="#581C87" />
          <circle cx="45" cy="32" r="3.5" fill="#FFFFFF" />
          <circle cx="45.5" cy="32" r="2" fill="#581C87" />
          {/* Smile */}
          <path d="M 35 37 Q 37.5 40 40 37" stroke="#6B21A8" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'clownfish':
      return (
        <svg
          viewBox="0 0 90 55"
          width={width}
          height={height}
          className={`${flip} ${className} overflow-visible`}
        >
          {/* Tail */}
          <path d="M 20 28 C 8 16, 2 18, 4 28 C 2 38, 8 40, 20 28 Z" fill={primaryColor} />
          {/* Dorsal Fin */}
          <path d="M 38 14 C 48 8, 62 10, 68 20 Z" fill={primaryColor} />
          {/* Body */}
          <ellipse cx="50" cy="28" rx="30" ry="19" fill={primaryColor} />
          {/* White stripes */}
          <path d="M 36 12 C 34 22, 34 34, 37 44 C 40 44, 40 22, 38 12 Z" fill="#FFFFFF" />
          <path d="M 52 10 C 50 20, 50 36, 53 46 C 56 46, 56 20, 54 10 Z" fill="#FFFFFF" />
          <path d="M 68 15 C 66 22, 66 32, 69 40 C 71 40, 71 22, 70 15 Z" fill="#FFFFFF" />
          {/* Eye */}
          <circle cx="72" cy="24" r="5" fill="#FFFFFF" />
          <circle cx="73" cy="24" r="3" fill="#1E293B" />
          <circle cx="74" cy="23" r="1.2" fill="#FFFFFF" />
          {/* Fin */}
          <ellipse cx="48" cy="32" rx="7" ry="4" fill={secondaryColor} transform="rotate(15 48 32)" />
        </svg>
      );

    case 'rainbow':
      return (
        <svg
          viewBox="0 0 95 60"
          width={width}
          height={height}
          className={`${flip} ${className} overflow-visible`}
        >
          <defs>
            <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EC4899" />
              <stop offset="25%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="75%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
          {/* Tail */}
          <path
            d="M 22 30 C 6 12, 0 16, 2 30 C 0 44, 6 48, 22 30 Z"
            fill="url(#rainbowGrad)"
            className={animateTail ? 'animate-pulse' : ''}
          />
          {/* Dorsal Fin */}
          <path d="M 40 14 C 52 4, 70 6, 74 18 Z" fill="#38BDF8" opacity="0.8" />
          {/* Body */}
          <ellipse cx="54" cy="30" rx="32" ry="20" fill="url(#rainbowGrad)" />
          {/* Sparkles / scales */}
          <circle cx="48" cy="25" r="2" fill="#FFFFFF" opacity="0.9" />
          <circle cx="56" cy="34" r="2.5" fill="#FEF08A" opacity="0.9" />
          <circle cx="42" cy="33" r="1.8" fill="#FFFFFF" opacity="0.9" />
          {/* Eye */}
          <circle cx="74" cy="25" r="5.5" fill="#FFFFFF" />
          <circle cx="75.5" cy="25" r="3.2" fill="#1E293B" />
          <circle cx="76.5" cy="23.5" r="1.3" fill="#FFFFFF" />
          {/* Fin */}
          <ellipse cx="52" cy="34" rx="8" ry="4.5" fill="#F472B6" transform="rotate(20 52 34)" />
        </svg>
      );

    default:
      // Generic happy fish
      return (
        <svg
          viewBox="0 0 90 55"
          width={width}
          height={height}
          className={`${flip} ${className} overflow-visible`}
        >
          <path d="M 20 28 C 8 16, 2 18, 4 28 C 2 38, 8 40, 20 28 Z" fill={primaryColor} />
          <ellipse cx="52" cy="28" rx="32" ry="18" fill={primaryColor} />
          <path d="M 35 32 C 45 44, 68 44, 78 32 C 68 38, 45 38, 35 32 Z" fill={secondaryColor} />
          <circle cx="70" cy="24" r="5" fill="#FFFFFF" />
          <circle cx="71.5" cy="24" r="3" fill="#0F172A" />
          <circle cx="72.5" cy="22.5" r="1.2" fill="#FFFFFF" />
          <ellipse cx="50" cy="32" rx="7" ry="4" fill={secondaryColor} transform="rotate(15 50 32)" />
        </svg>
      );
  }
};
