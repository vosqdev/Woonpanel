import React from 'react';

interface WoonpanelLogoProps {
  variant?: 'dark' | 'light' | 'auto';
  badge?: boolean; // When true, wraps in the signature dark #131722 container like the official brand lockup
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  subtitleText?: string;
  className?: string;
}

export const WoonpanelLogo: React.FC<WoonpanelLogoProps> = ({
  variant = 'dark',
  badge = false,
  size = 'md',
  showSubtitle = true,
  subtitleText = 'BEWONERS • MENING • INZICHT',
  className = '',
}) => {
  const isDark = variant === 'dark' || badge;

  const config = {
    sm: {
      iconSize: 34,
      titleSize: 'text-lg',
      subSize: 'text-[8.5px] tracking-[0.24em]',
      gap: 'gap-2.5',
      pad: 'px-2.5 py-1.5',
    },
    md: {
      iconSize: 42,
      titleSize: 'text-2xl',
      subSize: 'text-[10px] tracking-[0.25em]',
      gap: 'gap-3',
      pad: 'px-3.5 py-2',
    },
    lg: {
      iconSize: 52,
      titleSize: 'text-3xl',
      subSize: 'text-xs tracking-[0.26em]',
      gap: 'gap-3.5',
      pad: 'px-4.5 py-2.5',
    },
  }[size];

  const content = (
    <div className={`inline-flex items-center ${config.gap} select-none leading-none ${!badge ? className : ''}`}>
      {/* Icon: App Squircle with House + Rising Lime Data / Opinion Bars */}
      <div
        className="shrink-0 flex items-center justify-center"
        style={{ width: config.iconSize, height: config.iconSize }}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
        >
          {/* White Squircle App Tile */}
          <rect
            x="1.5"
            y="1.5"
            width="45"
            height="45"
            rx="11.5"
            fill="#FFFFFF"
            stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)'}
            strokeWidth="1.2"
          />

          {/* Chimney on the roof */}
          <rect
            x="31.8"
            y="13"
            width="4.2"
            height="8.5"
            rx="1"
            fill="#131722"
          />

          {/* House Outline (Roof apex + walls + floor) */}
          <path
            d="M 9.5 22.5 L 21.8 11.8 C 22.4 11.2 23.4 11.2 24.0 11.8 L 38.5 23.5 V 37.5 C 38.5 38.6 37.6 39.5 36.5 39.5 H 11.5 C 10.4 39.5 9.5 38.6 9.5 37.5 Z"
            fill="none"
            stroke="#131722"
            strokeWidth="3.6"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* 4 Rising Chart / Opinion Bars in Lime Green (#C4F000) */}
          {/* Bar 1 (Shortest, left) */}
          <rect
            x="13.2"
            y="29"
            width="3.6"
            height="8"
            rx="1.8"
            fill="#C4F000"
          />
          {/* Bar 2 (Medium) */}
          <rect
            x="19.2"
            y="21"
            width="3.6"
            height="16"
            rx="1.8"
            fill="#C4F000"
          />
          {/* Bar 3 (Tallest peak) */}
          <rect
            x="25.2"
            y="16.5"
            width="3.6"
            height="20.5"
            rx="1.8"
            fill="#C4F000"
          />
          {/* Bar 4 (Medium-high, right) */}
          <rect
            x="31.2"
            y="23.5"
            width="3.6"
            height="13.5"
            rx="1.8"
            fill="#C4F000"
          />
        </svg>
      </div>

      {/* Typography: WOON + PANEL & Subtitle Payoff */}
      <div className="flex flex-col justify-center">
        <div
          className={`${config.titleSize} font-extrabold tracking-tight font-sans flex items-center leading-none`}
        >
          {/* WOON in White (on dark) or Anthracite (on light) */}
          <span className={isDark ? 'text-white' : 'text-[#131722]'}>
            WOON
          </span>

          {/* PANEL in Signature Lime Green #C4F000 */}
          <span
            className="text-[#C4F000] ml-0.5"
            style={{
              textShadow: isDark ? '0 0 24px rgba(196,240,0,0.35)' : undefined,
            }}
          >
            PANEL
          </span>
        </div>

        {/* Payoff line: BEWONERS • MENING • INZICHT */}
        {showSubtitle && (
          <div
            className={`${config.subSize} uppercase font-bold font-sans mt-1 text-nowrap whitespace-nowrap leading-none ${
              isDark ? 'text-[#94A3B8]' : 'text-stone-500'
            }`}
          >
            {subtitleText}
          </div>
        )}
      </div>
    </div>
  );

  if (badge) {
    return (
      <div
        className={`inline-flex items-center bg-[#131722] ${config.pad} rounded-xl border border-slate-800/80 shadow-md ${className}`}
      >
        {content}
      </div>
    );
  }

  return content;
};
