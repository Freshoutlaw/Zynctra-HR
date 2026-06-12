/**
 * /frontend/src/pages/LoadingPage.tsx
 *
 * Zynctra loading screen — full brand experience while auth/session restores.
 * Features the animated logo assembly, progress indicator, and status messages.
 * Pure CSS animations, zero JS overhead, no framer-motion dependencies.
 */

import React, { useEffect, useState } from 'react';

// ─── SVG DEFINITIONS (shared with main logo) ─────────────────────────────────

const LogoDefs: React.FC = () => (
  <defs>
    <radialGradient id="load-bgGlow" cx="50%" cy="48%" r="45%">
      <stop offset="0%" stopColor="#12e5ff" stopOpacity="0.16"/>
      <stop offset="45%" stopColor="#0fb4df" stopOpacity="0.08"/>
      <stop offset="100%" stopColor="#000000" stopOpacity="0"/>
    </radialGradient>

    <linearGradient id="load-topGrad" x1="290" y1="300" x2="672" y2="405" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stopColor="#30eeff"/>
      <stop offset="55%" stopColor="#19d5ef"/>
      <stop offset="100%" stopColor="#07afd9"/>
    </linearGradient>

    <linearGradient id="load-leftGrad" x1="300" y1="730" x2="550" y2="390" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stopColor="#0b1242"/>
      <stop offset="52%" stopColor="#123f74"/>
      <stop offset="100%" stopColor="#14c7ea"/>
    </linearGradient>

    <linearGradient id="load-rightGrad" x1="660" y1="300" x2="520" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stopColor="#19224f"/>
      <stop offset="55%" stopColor="#0f183f"/>
      <stop offset="100%" stopColor="#060c24"/>
    </linearGradient>

    <linearGradient id="load-bottomGrad" x1="395" y1="612" x2="742" y2="715" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stopColor="#10bfe4"/>
      <stop offset="100%" stopColor="#0f7ea9"/>
    </linearGradient>

    <linearGradient id="load-centerGrad" x1="476" y1="484" x2="551" y2="553" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stopColor="#1cf1ff"/>
      <stop offset="100%" stopColor="#0c7ea4"/>
    </linearGradient>

    <filter id="load-softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="18" floodColor="#000000" floodOpacity="0.45"/>
    </filter>

    <filter id="load-innerGlow" x="-20%" y="-20%" width="140%" height="140%">
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

// ─── LOADING LOGO — loops infinitely, pieces assemble then disperse ──────────

const LoadingLogo: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 1024 1024"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="geometricPrecision"
    className="loading-logo-svg"
  >
    <LogoDefs />

    <ellipse cx="512" cy="516" rx="300" ry="290" fill="url(#load-bgGlow)" className="load-glow" />

    <g filter="url(#load-softShadow)">
      <path d="M 286 307 L 646 307 L 576 400 L 352 400 Z" fill="url(#load-topGrad)" className="load-piece load-top" />
      <path d="M 286 307 L 646 307" stroke="#89f7ff" strokeOpacity="0.35" strokeWidth="2" className="load-piece load-top" />

      <path d="M 652 306 L 744 306 L 549 615 L 505 615 Z" fill="url(#load-rightGrad)" className="load-piece load-right" />

      <path d="M 272 707 L 355 707 L 510 500 L 557 399 L 503 399 L 452 472 L 428 505 Z" fill="url(#load-leftGrad)" className="load-piece load-left" />

      <path d="M 391 615 L 675 615 L 744 707 L 391 707 Z" fill="url(#load-bottomGrad)" className="load-piece load-bottom" />

      <path d="M 478 499 L 520 499 L 549 515 L 523 544 L 496 523 Z" fill="url(#load-centerGrad)" filter="url(#load-innerGlow)" className="load-piece load-center" />

      <path d="M 352 400 L 576 400" stroke="#0a152f" strokeOpacity="0.5" strokeWidth="1.5" className="load-piece load-accents" />
      <path d="M 391 615 L 675 615" stroke="#9efcff" strokeOpacity="0.12" strokeWidth="2" className="load-piece load-accents" />
    </g>
  </svg>
);

// ─── PROGRESS BAR ────────────────────────────────────────────────────────────

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="w-48 h-0.5 bg-neutral-800 rounded-full overflow-hidden mt-8">
    <div
      className="h-full transition-all duration-300 ease-out rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400"
      style={{ width: `${progress}%` }}
    />
  </div>
);

// ─── STATUS MESSAGES ─────────────────────────────────────────────────────────

const messages = [
  'Initializing secure session...',
  'Verifying tenant configuration...',
  'Loading encryption keys...',
  'Establishing connection...',
  'Ready',
];

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

const LoadingPage: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [dots, setDots] = useState('');

  // Progress bar animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + Math.random() * 15 + 5;
      });
    }, 400);
    return () => clearInterval(interval);
  }, []);

  // Cycle status messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  // Animated dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white relative overflow-hidden">
      {/* Ambient background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-cyan-500/20 animate-particle"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${4 + i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Logo */}
      <div className="relative z-10">
        <LoadingLogo size={200} />
      </div>

      {/* Brand name */}
      <div className="z-10 mt-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Zynctra
        </h1>
        <p className="mt-1 text-xs tracking-wider uppercase text-neutral-500">
          Enterprise HR Platform
        </p>
      </div>

      {/* Progress */}
      <div className="z-10 flex flex-col items-center">
        <ProgressBar progress={Math.min(progress, 100)} />
        <p className="h-4 mt-3 font-mono text-xs text-neutral-400">
          {messages[messageIndex]}{dots}
        </p>
      </div>

      {/* Security badge */}
      <div className="absolute z-10 flex items-center gap-2 -translate-x-1/2 bottom-8 left-1/2">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] text-neutral-600 uppercase tracking-wider">
          AES-256 • TLS 1.3 • SOC2
        </span>
      </div>
    </div>
  );
};

export default LoadingPage;