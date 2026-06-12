/**
 * /frontend/src/components/logo/index.tsx
 *
 * Zynctra brand logo — animated SVG with your exact geometry.
 * All animations are pure CSS @keyframes — zero JS animation overhead.
 *
 * Usage:
 *   <ZynctraLogo size={32} />           — static icon (navbar, buttons)
 *   <AnimatedLogo size={320} />         — hero animation (two halves assemble)
 *   <ZynctraLogoWordmark iconSize={32} /> — icon + text lockup
 */

import React from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
//  SHARED SVG DEFINITIONS — your exact gradients and filters
// ═══════════════════════════════════════════════════════════════════════════════

const LogoDefs: React.FC = () => (
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="48%" r="45%">
      <stop offset="0%" stopColor="#12e5ff" stopOpacity="0.16"/>
      <stop offset="45%" stopColor="#0fb4df" stopOpacity="0.08"/>
      <stop offset="100%" stopColor="#000000" stopOpacity="0"/>
    </radialGradient>

    <linearGradient id="topGrad" x1="290" y1="300" x2="672" y2="405" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stopColor="#30eeff"/>
      <stop offset="55%" stopColor="#19d5ef"/>
      <stop offset="100%" stopColor="#07afd9"/>
    </linearGradient>

    <linearGradient id="leftGrad" x1="300" y1="730" x2="550" y2="390" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stopColor="#0b1242"/>
      <stop offset="52%" stopColor="#123f74"/>
      <stop offset="100%" stopColor="#14c7ea"/>
    </linearGradient>

    <linearGradient id="rightGrad" x1="660" y1="300" x2="520" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stopColor="#19224f"/>
      <stop offset="55%" stopColor="#0f183f"/>
      <stop offset="100%" stopColor="#060c24"/>
    </linearGradient>

    <linearGradient id="bottomGrad" x1="395" y1="612" x2="742" y2="715" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stopColor="#10bfe4"/>
      <stop offset="100%" stopColor="#0f7ea9"/>
    </linearGradient>

    <linearGradient id="centerGrad" x1="476" y1="484" x2="551" y2="553" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stopColor="#1cf1ff"/>
      <stop offset="100%" stopColor="#0c7ea4"/>
    </linearGradient>

    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="18" floodColor="#000000" floodOpacity="0.45"/>
    </filter>

    <filter id="innerGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="blur"/>
      <feColorMatrix in="blur" type="matrix" values="
        1 0 0 0 0
        0 1 0 0 0
        0 0 1 0 0
        0 0 0 0.9 0" result="glow"/>
      <feComposite in="SourceGraphic" in2="glow" operator="over"/>
    </filter>
  </defs>
);

// ═══════════════════════════════════════════════════════════════════════════════
//  1. STATIC LOGO — navbar, buttons, small usage
// ═══════════════════════════════════════════════════════════════════════════════

interface ZynctraLogoProps {
  size?: number;
  className?: string;
}

export const ZynctraLogo: React.FC<ZynctraLogoProps> = ({
  size = 32,
  className = '',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 1024 1024"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    shapeRendering="geometricPrecision"
    aria-label="Zynctra"
  >
    <LogoDefs />
    <g filter="url(#softShadow)">
      <path d="M 286 307 L 646 307 L 576 400 L 352 400 Z" fill="url(#topGrad)"/>
      <path d="M 286 307 L 646 307" stroke="#89f7ff" strokeOpacity="0.35" strokeWidth="2" />
      <path d="M 652 306 L 744 306 L 549 615 L 505 615 Z" fill="url(#rightGrad)"/>
      <path d="M 272 707 L 355 707 L 510 500 L 557 399 L 503 399 L 452 472 L 428 505 Z" fill="url(#leftGrad)"/>
      <path d="M 391 615 L 675 615 L 744 707 L 391 707 Z" fill="url(#bottomGrad)"/>
      <path d="M 478 499 L 520 499 L 549 515 L 523 544 L 496 523 Z" fill="url(#centerGrad)" filter="url(#innerGlow)"/>
      <path d="M 352 400 L 576 400" stroke="#0a152f" strokeOpacity="0.5" strokeWidth="1.5"/>
      <path d="M 391 615 L 675 615" stroke="#9efcff" strokeOpacity="0.12" strokeWidth="2"/>
    </g>
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════════
//  2. ANIMATED LOGO — hero section: pieces assemble from opposite directions
// ═══════════════════════════════════════════════════════════════════════════════

interface AnimatedLogoProps {
  size?: number;
  className?: string;
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  size = 320,
  className = '',
}) => (
  <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 1024 1024"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="geometricPrecision"
      className="z-10"
    >
      <LogoDefs />

      {/* Background glow ellipse */}
      <ellipse cx="512" cy="516" rx="300" ry="290" fill="url(#bgGlow)" className="logo-glow-bg" />

      <g filter="url(#softShadow)">
        {/* Top bar — slides down from above */}
        <g className="logo-piece logo-piece-top">
          <path d="M 286 307 L 646 307 L 576 400 L 352 400 Z" fill="url(#topGrad)"/>
          <path d="M 286 307 L 646 307" stroke="#89f7ff" strokeOpacity="0.35" strokeWidth="2" />
        </g>

        {/* Right diagonal — slides in from right */}
        <g className="logo-piece logo-piece-right">
          <path d="M 652 306 L 744 306 L 549 615 L 505 615 Z" fill="url(#rightGrad)"/>
        </g>

        {/* Left diagonal — slides in from left */}
        <g className="logo-piece logo-piece-left">
          <path d="M 272 707 L 355 707 L 510 500 L 557 399 L 503 399 L 452 472 L 428 505 Z" fill="url(#leftGrad)"/>
        </g>

        {/* Bottom bar — slides up from below */}
        <g className="logo-piece logo-piece-bottom">
          <path d="M 391 615 L 675 615 L 744 707 L 391 707 Z" fill="url(#bottomGrad)"/>
        </g>

        {/* Center connector — fades in last with glow pulse */}
        <g className="logo-piece logo-piece-center">
          <path d="M 478 499 L 520 499 L 549 515 L 523 544 L 496 523 Z" fill="url(#centerGrad)" filter="url(#innerGlow)"/>
        </g>

        {/* Edge accents */}
        <g className="logo-piece logo-piece-accents">
          <path d="M 352 400 L 576 400" stroke="#0a152f" strokeOpacity="0.5" strokeWidth="1.5"/>
          <path d="M 391 615 L 675 615" stroke="#9efcff" strokeOpacity="0.12" strokeWidth="2"/>
        </g>
      </g>
    </svg>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
//  3. WORDMARK — icon + "Zynctra" text
// ═══════════════════════════════════════════════════════════════════════════════

interface ZynctraLogoWordmarkProps {
  iconSize?: number;
  className?: string;
  showTagline?: boolean;
}

export const ZynctraLogoWordmark: React.FC<ZynctraLogoWordmarkProps> = ({
  iconSize = 32,
  className = '',
  showTagline = false,
}) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <ZynctraLogo size={iconSize} />
    <div className="flex flex-col">
      <span className="text-xl font-bold leading-none tracking-tight text-neutral-900 dark:text-white">
        Zynctra
      </span>
      {showTagline && (
        <span className="text-[10px] font-medium tracking-wider uppercase text-neutral-400 dark:text-neutral-600 mt-0.5">
          Enterprise HR
        </span>
      )}
    </div>
  </div>
);

export default ZynctraLogo;