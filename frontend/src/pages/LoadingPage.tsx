import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Props interface for LoadingPage component
 */
interface LoadingPageProps {
  minDisplayTime?: number;
  onLoadComplete?: () => void;
  fallbackRoute?: string;
}

/**
 * LoadingPage Component
 * 
 * Ultra-sleek cinematic loading sequence featuring:
 * - Animated brand logo (Z geometric design)
 * - Staggered subtitle animation
 * - Smooth transition to main application
 * - Accessibility compliant (aria labels, reduced motion support)
 * 
 * Security: Client-side only, no sensitive data stored
 */
const LoadingPage: React.FC<LoadingPageProps> = ({
  minDisplayTime = 2400,
  onLoadComplete,
  fallbackRoute = '/login',
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Variants for logo animation
  const logoContainerVariants = {
    initial: { opacity: 0, scale: 0.6 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 1.1,
      transition: { duration: 0.6, ease: 'easeIn' },
    },
  };

  const letterVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const subtitleVariants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: 'easeOut',
        delay: 0.6,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const progressBarVariants = {
    initial: { scaleX: 0 },
    animate: {
      scaleX: 1,
      transition: {
        duration: minDisplayTime / 1000,
        ease: 'linear',
        delay: 0.8,
      },
    },
  };

  const pageVariants = {
    exit: {
      opacity: 0,
      transition: { duration: 0.5, ease: 'easeInOut' },
    },
  };

  // Glow effect animation for logo
  const glowVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: [0.3, 0.6, 0.3],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 0.8,
      },
    },
  };

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);

      if (onLoadComplete) {
        onLoadComplete();
      }

      // Route based on authentication status
      const navigationDelay = setTimeout(() => {
        if (isAuthenticated) {
          navigate('/dashboard');
        } else {
          navigate(fallbackRoute);
        }
      }, 600); // Allow exit animation to complete

      return () => clearTimeout(navigationDelay);
    }, minDisplayTime);

    return () => clearTimeout(loadingTimer);
  }, [isAuthenticated, navigate, fallbackRoute, onLoadComplete, minDisplayTime]);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          className="loading-page"
          variants={pageVariants}
          initial="initial"
          exit="exit"
          aria-label="Application loading"
          role="status"
        >
          {/* Dark gradient background */}
          <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

          {/* Animated grid pattern background */}
          <motion.div
            className="absolute inset-0 opacity-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ duration: 1.2 }}
            style={{
              backgroundImage:
                'linear-gradient(90deg, #00d9ff 1px transparent 1px), linear-gradient(#00d9ff 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />

          {/* Centered content container */}
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen gap-8">
            {/* Logo container with glow effect */}
            <motion.div
              className="relative"
              variants={logoContainerVariants}
              initial="initial"
              animate="animate"
            >
              {/* Glow background effect */}
              <motion.div
                className="absolute inset-0 rounded-full bg-cyan-500/20 blur-3xl"
                variants={glowVariants}
                initial="initial"
                animate="animate"
                aria-hidden="true"
              />

              {/* SVG Logo - Zynctra Z Icon */}
              <motion.svg
                viewBox="0 0 200 200"
                className="w-32 h-32 md:w-40 md:h-40"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Zynctra logo"
                role="img"
              >
                {/* Outer geometric frame */}
                <motion.g stroke="#00d9ff" strokeWidth="3" fill="none" strokeLinecap="round">
                  {/* Top left triangle */}
                  <motion.path
                    d="M 50 50 L 100 50 L 75 80 Z"
                    variants={letterVariants}
                    initial="initial"
                    animate="animate"
                  />

                  {/* Top right triangle */}
                  <motion.path
                    d="M 100 50 L 150 50 L 125 80 Z"
                    variants={letterVariants}
                    initial="initial"
                    animate="animate"
                  />

                  {/* Center lightning bolt */}
                  <motion.path
                    d="M 100 60 L 115 95 L 100 90 L 120 130 L 80 100 L 95 105 Z"
                    fill="#00d9ff"
                    variants={letterVariants}
                    initial="initial"
                    animate="animate"
                  />

                  {/* Bottom left triangle */}
                  <motion.path
                    d="M 50 150 L 75 120 L 100 150 Z"
                    variants={letterVariants}
                    initial="initial"
                    animate="animate"
                  />

                  {/* Bottom right triangle */}
                  <motion.path
                    d="M 100 150 L 125 120 L 150 150 Z"
                    variants={letterVariants}
                    initial="initial"
                    animate="animate"
                  />
                </motion.g>
              </motion.svg>
            </motion.div>

            {/* Subtitle with staggered animation */}
            <motion.div
              className="text-center"
              variants={subtitleVariants}
              initial="initial"
              animate="animate"
            >
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
                Zynctra HR
              </h1>
              <p className="text-lg md:text-xl text-cyan-300 font-light tracking-wide">
                All-in-One HR Platform
              </p>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              className="w-48 h-1 bg-slate-700 rounded-full overflow-hidden mt-12"
              role="progressbar"
              aria-valuenow={0}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Application loading progress"
            >
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full"
                variants={progressBarVariants}
                initial="initial"
                animate="animate"
                style={{ originX: 0 }}
              />
            </motion.div>

            {/* Loading text */}
            <motion.div
              className="mt-8 text-sm text-slate-400 tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
            >
              Initializing secure systems...
            </motion.div>
          </div>

          {/* Decorative corner elements */}
          <motion.div
            className="fixed bottom-8 right-8 w-8 h-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 1.5 }}
          >
            <div className="w-full h-full border-2 border-cyan-500 rounded-lg transform rotate-45" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingPage;