/**
 * Zynctra HR Landing Page — v4
 * Horizontal scrolling testimonials marquee.
 * Hero image instead of dry 3D SVG.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { AnimatedLogo } from '../components/logo';

// ═══════════════════════════════════════════════════════════════════════════════
//  ICONS
// ═══════════════════════════════════════════════════════════════════════════════

const IconSun = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const IconMoon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

const IconMenu = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="8" x2="20" y2="8" />
    <line x1="4" y1="16" x2="20" y2="16" />
  </svg>
);

const IconX = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const IconCheck = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconStar = ({ className, fill }: { className?: string; fill?: boolean }) => (
  <svg className={className} viewBox="0 0 24 24" fill={fill ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconStarHalf = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <linearGradient id="half">
        <stop offset="50%" stopColor="currentColor" />
        <stop offset="50%" stopColor="transparent" />
      </linearGradient>
    </defs>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="url(#half)" />
  </svg>
);

const IconLinkedIn = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const IconFiverr = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.004 15.588a.995.995 0 1 0 .002-1.99.995.995 0 0 0-.002 1.99zm-.996-3.705h-2.929V5.187h2.929v6.696zm-4.587 0H5.996V5.187h4.416c.824 0 1.583.286 2.187.763.604.477.999 1.142 1.113 1.89h2.296c-.114-1.358-.668-2.587-1.537-3.54-.87-.953-2.04-1.59-3.36-1.79V.003h-2.93v1.507H.003v3.705h4.416v8.293h11.998v-1.507zm-4.587-3.705H5.996V8.882h7.428v-.704z" />
  </svg>
);

const IconIndeed = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M14.822 10.138V6.723h3.402v10.554h-3.402v-7.14zm-4.564 7.14H6.856V6.723h3.402v10.555zm0-12.417H6.856V.723h3.402v2.138zm9.01 12.417h-3.402V6.723h3.402v10.555zm-13.417 0H2.449V6.723h3.402v10.555z" />
  </svg>
);

const IconGlassdoor = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.144 20.572H3.43V3.428h13.714v17.144zm3.428-17.144v17.144c0 .946-.768 1.714-1.714 1.714H1.714A1.714 1.714 0 0 1 0 20.572V3.428C0 2.482.768 1.714 1.714 1.714h17.144c.946 0 1.714.768 1.714 1.714zm-6.857-1.714H6.857v6.857h6.858V1.714zm-6.858 8.572v8.572h6.858v-8.572H6.857z" />
  </svg>
);

const IconExternal = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const IconQuote = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════════
//  LOGO — Replace with your actual logo when ready
// ═══════════════════════════════════════════════════════════════════════════════

const ZynctraLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="currentColor" className="text-neutral-900 dark:text-white" />
    <path
      d="M10 10h12l-8 12h8"
      stroke="currentColor"
      className="text-white dark:text-neutral-900"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <circle cx="22" cy="22" r="2.5" fill="currentColor" className="text-cyan-500" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════════
//  DATA
// ═══════════════════════════════════════════════════════════════════════════════

const navLinks = [
  { label: 'Product', href: '#product' },
  { label: 'Integrations', href: '#integrations' },
  { label: 'Security', href: '#security' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Docs', href: '/docs' },
];

const features = [
  {
    title: 'Built-in payroll, everywhere',
    body: 'Run payroll across 150+ countries with automatic tax compliance, local regulations, and multi-currency support. No third-party integrations required.',
    tag: 'Payroll',
  },
  {
    title: 'AI that actually helps',
    body: 'Draft policies, answer employee questions, and analyze compensation equity with Groq-powered LLM. It learns your company handbook, not the internet.',
    tag: 'AI Assistant',
  },
  {
    title: 'Security by design',
    body: 'AES-256 encryption, MFA, per-tenant isolation, and immutable audit logs. Built with security architects from day one, not bolted on later.',
    tag: 'Security',
  },
  {
    title: 'One platform, zero fragmentation',
    body: 'Core HR, ATS, time tracking, benefits, and performance management — all sharing one database, one API, one source of truth.',
    tag: 'Platform',
  },
];

const securityItems = [
  'AES-256 encryption at rest, TLS 1.3 in transit',
  'SOC 2 Type II, GDPR, HIPAA, CCPA compliant',
  'Per-tenant database isolation with HSM key segregation',
  'Immutable audit logs with 7-year retention',
  'Real-time threat monitoring and automated response',
];

const pricingTiers = [
  {
    name: 'Startup',
    price: '$199',
    period: 'per month',
    description: 'For teams up to 100 employees getting their HR stack in order.',
    features: [
      'Core HR & employee self-service',
      'Basic time & attendance',
      'Standard reports',
      'Email support',
      '99.5% uptime SLA',
    ],
    cta: 'Start free trial',
    highlighted: false,
  },
  {
    name: 'Business',
    price: '$599',
    period: 'per month',
    description: 'The complete suite for scaling organizations. Most teams start here.',
    features: [
      'Everything in Startup, plus:',
      'Built-in payroll engine',
      'Applicant tracking (ATS)',
      'Benefits administration',
      'Performance management',
      'Advanced workflows',
      '24/7 phone & chat support',
      '99.9% uptime SLA',
    ],
    cta: 'Start free trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: '$1,299',
    period: 'per month',
    description: 'Global scale with dedicated support and custom deployment options.',
    features: [
      'Everything in Business, plus:',
      'Global multi-country payroll',
      'Advanced AI assistant',
      'Custom integrations & API',
      'Learning management (LMS)',
      'Dedicated account manager',
      'Custom SLA & deployment',
      'Priority 24/7 support',
    ],
    cta: 'Contact sales',
    highlighted: false,
  },
];

const jobPlatforms = [
  { name: 'LinkedIn', icon: IconLinkedIn },
  { name: 'Indeed', icon: IconIndeed },
  { name: 'Glassdoor', icon: IconGlassdoor },
  { name: 'Fiverr', icon: IconFiverr },
  { name: 'ZipRecruiter', icon: null },
  { name: 'Monster', icon: null },
];

const testimonials = [
  {
    quote: 'We replaced Workday, BambooHR, and a custom payroll tool with Zynctra. Three systems became one. Onboarding time dropped 60%.',
    author: 'Sarah Chen',
    title: 'VP People Operations',
    company: 'TechFlow',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
  },
  {
    quote: 'The security architecture is the real differentiator. Our SOC 2 audit passed with zero findings. The monitoring caught a compromised account before we did.',
    author: 'Marcus Webb',
    title: 'Chief Information Security Officer',
    company: 'FinSecure Global',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  },
  {
    quote: 'Multi-country payroll used to be a nightmare of spreadsheets and third-party tools. Zynctra handles 12 jurisdictions without us touching a tax table.',
    author: 'Elena Rodriguez',
    title: 'Global HR Director',
    company: 'NovaScale',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
  },
  {
    quote: 'The ATS integration with LinkedIn and Indeed saved our recruiting team 15 hours a week. Candidates flow directly into our pipeline.',
    author: 'James Nakamura',
    title: 'Head of Talent Acquisition',
    company: 'Meridian Health',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
  },
  {
    quote: 'We evaluated every major HR platform. Zynctra was the only one that didn\'t require us to compromise on security, features, or price.',
    author: 'Priya Sharma',
    title: 'Chief Operating Officer',
    company: 'Apex Labs',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
  },
  {
    quote: 'The AI assistant drafted our entire employee handbook in under an hour. HR reviewed and approved it the same day.',
    author: 'David Okafor',
    title: 'HR Director',
    company: 'Vector Dynamics',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
  },
  {
    quote: 'Moving from a fragmented stack to Zynctra cut our HR software spend by 40% while giving us more functionality.',
    author: 'Lisa Park',
    title: 'CFO',
    company: 'Northwind Capital',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
  },
  {
    quote: 'The multi-tenant architecture means each of our subsidiaries gets isolated data with centralized admin. Exactly what we needed.',
    author: 'Ahmed Hassan',
    title: 'IT Director',
    company: 'Summit Group',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face',
  },
  {
    quote: 'Customer support actually understands HR. They helped us configure compliance rules for three new countries in one afternoon.',
    author: 'Rachel Kim',
    title: 'Global Compensation Manager',
    company: 'Pulse Networks',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face',
  },
  {
    quote: 'We went live in 48 hours. The migration tools imported everything from our old system without a single data issue.',
    author: 'Tom Bradley',
    title: 'VP Engineering',
    company: 'Forge Digital',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop&crop=face',
  },
];

const trustLogos = [
  { name: 'TechFlow', abbr: 'TF' },
  { name: 'FinSecure', abbr: 'FS' },
  { name: 'NovaScale', abbr: 'NS' },
  { name: 'Meridian', abbr: 'MR' },
  { name: 'Apex Labs', abbr: 'AL' },
  { name: 'Vector', abbr: 'VC' },
  { name: 'Northwind', abbr: 'NW' },
  { name: 'Summit', abbr: 'SM' },
];

// ═══════════════════════════════════════════════════════════════════════════════
//  COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

const FadeIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}> = ({ children, delay = 0, className = '', direction = 'up' }) => {
  const directions = {
    up: { y: 24 },
    down: { y: -24 },
    left: { x: 24 },
    right: { x: -24 },
  };
  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<IconStar key={i} className="w-3.5 h-3.5 text-amber-400" fill />);
    } else if (i - 0.5 === rating) {
      stars.push(<IconStarHalf key={i} className="w-3.5 h-3.5 text-amber-400" />);
    } else {
      stars.push(<IconStar key={i} className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-700" />);
    }
  }
  return <div className="flex gap-0.5">{stars}</div>;
};

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="flex items-center justify-between h-16 max-w-6xl px-6 mx-auto">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 group"
        >
          <img src="/assets/logos/logo.png" alt="Zynctra" className="object-contain w-8 h-8" />
          <span className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
            Zynctra
          </span>
        </button>

        <nav className="items-center hidden gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium transition-colors text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="items-center hidden gap-3 md:flex">
          <button
            onClick={toggle}
            className="p-2 transition-colors rounded-lg text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <IconSun className="w-5 h-5" /> : <IconMoon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-3 py-2 text-sm font-medium transition-colors text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          >
            Sign in
          </button>
          <button
            onClick={() => navigate('/login?action=signup')}
            className="px-4 py-2 text-sm font-semibold text-white transition-opacity rounded-lg bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:opacity-90"
          >
            Get started
          </button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggle}
            className="p-2 rounded-lg text-neutral-500 dark:text-neutral-400"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <IconSun className="w-5 h-5" /> : <IconMoon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300"
          >
            {mobileOpen ? <IconX className="w-5 h-5" /> : <IconMenu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden bg-white dark:bg-[#0a0a0a] border-b border-neutral-200 dark:border-neutral-800"
          >
            <div className="px-6 py-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2.5 text-base font-medium text-neutral-700 dark:text-neutral-300"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 mt-4 space-y-2 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  onClick={() => { setMobileOpen(false); navigate('/login'); }}
                  className="block w-full text-left py-2.5 text-base font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Sign in
                </button>
                <button
                  onClick={() => { setMobileOpen(false); navigate('/login?action=signup'); }}
                  className="block w-full py-2.5 text-center text-base font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg"
                >
                  Get started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  HERO — With real image instead of dry 3D
// ═══════════════════════════════════════════════════════════════════════════════

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-32 pb-20 overflow-hidden md:pt-44 md:pb-32">
      <div className="max-w-6xl px-6 mx-auto">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Copy */}
          <div>
            <FadeIn>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-neutral-900 dark:text-white leading-[1.08] mb-6">
                HR infrastructure for companies that{' '}
                <span className="text-neutral-400 dark:text-neutral-500">take themselves seriously.</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.1}>
              <p className="max-w-lg mb-10 text-lg leading-relaxed md:text-xl text-neutral-600 dark:text-neutral-400">
                Core HR, global payroll, talent acquisition, and AI assistance — unified in one multi-tenant platform with enterprise security and transparent pricing.
              </p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="flex flex-col items-start gap-4 mb-8 sm:flex-row sm:items-center">
                <button
                  onClick={() => navigate('/login?action=signup')}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-opacity rounded-lg bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:opacity-90"
                >
                  Start free trial
                  <IconArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => document.getElementById('product')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border rounded-lg border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                >
                  See how it works
                </button>
              </div>
              <div className="flex items-center gap-6 text-xs text-neutral-500 dark:text-neutral-600">
                <span className="flex items-center gap-1.5">
                  <IconCheck className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  No credit card
                </span>
                <span className="flex items-center gap-1.5">
                  <IconCheck className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  14-day trial
                </span>
                <span className="flex items-center gap-1.5">
                  <IconCheck className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  Cancel anytime
                </span>
              </div>
            </FadeIn>
          </div>

          {/* Right: Real image */}
          <FadeIn delay={0.25} direction="left">
            <div className="relative">
              {/* Subtle glow behind image */}
              <div className="absolute -inset-4 bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-500/10 rounded-3xl blur-2xl" />
              
              <div className="relative flex items-center justify-center min-h-[500px]">
                <div className="absolute rounded-full -inset-12 bg-gradient-to-br from-cyan-500/5 via-transparent to-violet-500/5 blur-3xl" />
                <AnimatedLogo size={480} />
                <div className="absolute -translate-x-1/2 -bottom-4 left-1/2">
                  <div className="inline-flex items-center gap-2 px-4 py-2 border shadow-lg rounded-xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 whitespace-nowrap">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      2,847 teams onboarded this month
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  SOCIAL PROOF — Marquee + stats
// ═══════════════════════════════════════════════════════════════════════════════

const SocialProof: React.FC = () => (
  <section className="py-16 overflow-hidden text-white md:py-20 bg-neutral-950">
    <div className="max-w-6xl px-6 mx-auto mb-10">
      <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
        Trusted by teams that ship
      </p>
    </div>
    
    <div className="relative">
      <div className="absolute top-0 bottom-0 left-0 z-10 w-24 bg-gradient-to-r from-neutral-950 to-transparent" />
      <div className="absolute top-0 bottom-0 right-0 z-10 w-24 bg-gradient-to-l from-neutral-950 to-transparent" />
      
      <motion.div
        animate={{ x: [0, -1200] }}
        transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
        className="flex items-center gap-16 whitespace-nowrap"
      >
        {[...trustLogos, ...trustLogos, ...trustLogos].map((logo, i) => (
          <div key={i} className="flex items-center flex-shrink-0 gap-3">
            <div className="flex items-center justify-center w-10 h-10 text-sm font-bold rounded-lg bg-neutral-800 text-neutral-400">
              {logo.abbr}
            </div>
            <span className="text-lg font-semibold tracking-tight text-neutral-300">{logo.name}</span>
          </div>
        ))}
      </motion.div>
    </div>

    <div className="max-w-6xl px-6 mx-auto mt-12">
      <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
        {[
          { value: '10M+', label: 'Payroll transactions' },
          { value: '99.99%', label: 'Uptime SLA' },
          { value: '150+', label: 'Countries' },
          { value: '4.9/5', label: 'Customer rating' },
        ].map((stat) => (
          <div key={stat.label}>
            <div className="mb-1 text-2xl font-bold text-white md:text-3xl">{stat.value}</div>
            <div className="text-xs tracking-wider uppercase text-neutral-500">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════════
//  PRODUCT SECTION
// ═══════════════════════════════════════════════════════════════════════════════

const ProductSection: React.FC = () => (
  <section id="product" className="py-24 md:py-32">
    <div className="max-w-6xl px-6 mx-auto">
      <FadeIn>
        <div className="max-w-2xl mb-16">
          <h2 className="mb-4 text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl text-neutral-900 dark:text-white">
            One platform. Every HR function.
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            No more stitching together five tools with five contracts and five security postures.
          </p>
        </div>
      </FadeIn>

      <div className="grid gap-px overflow-hidden md:grid-cols-2 bg-neutral-200 dark:bg-neutral-800 rounded-2xl">
        {features.map((feature, i) => (
          <FadeIn key={feature.title} delay={i * 0.08} className="bg-white dark:bg-[#0a0a0a] p-8 md:p-10">
            <span className="inline-block mb-4 text-xs font-semibold tracking-wider uppercase text-cyan-600 dark:text-cyan-400">
              {feature.tag}
            </span>
            <h3 className="mb-3 text-xl font-semibold tracking-tight md:text-2xl text-neutral-900 dark:text-white">
              {feature.title}
            </h3>
            <p className="leading-relaxed text-neutral-600 dark:text-neutral-400">
              {feature.body}
            </p>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════════
//  INTEGRATIONS
// ═══════════════════════════════════════════════════════════════════════════════

const IntegrationsSection: React.FC = () => (
  <section id="integrations" className="py-24 md:py-32 bg-neutral-50 dark:bg-neutral-900/30">
    <div className="max-w-6xl px-6 mx-auto">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <FadeIn>
          <div>
            <span className="inline-block mb-4 text-xs font-semibold tracking-wider uppercase text-cyan-600 dark:text-cyan-400">
              Integrations
            </span>
            <h2 className="mb-6 text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl text-neutral-900 dark:text-white">
              Post once. Reach everywhere.
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
              Your ATS connects directly to LinkedIn, Indeed, Glassdoor, Fiverr, ZipRecruiter, Monster, and more. One job description, distributed to every major platform. Candidates flow back into a single pipeline.
            </p>
            <div className="flex flex-wrap gap-3">
              {jobPlatforms.map((platform) => (
                <div
                  key={platform.name}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  {platform.icon && <platform.icon className="w-4 h-4" />}
                  {!platform.icon && (
                    <span className="w-4 h-4 rounded bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-[8px] font-bold text-neutral-500">
                      {platform.name[0]}
                    </span>
                  )}
                  {platform.name}
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.15} direction="left">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-3xl" />
            <div className="relative bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-sm font-semibold text-neutral-900 dark:text-white">Job Distribution</span>
                <span className="text-xs font-medium text-cyan-600 dark:text-cyan-400">Live</span>
              </div>
              <div className="space-y-3">
                {[
                  { platform: 'LinkedIn', status: 'Published', applicants: 47, color: 'bg-blue-500' },
                  { platform: 'Indeed', status: 'Published', applicants: 32, color: 'bg-amber-500' },
                  { platform: 'Glassdoor', status: 'Published', applicants: 18, color: 'bg-emerald-500' },
                  { platform: 'Fiverr', status: 'Published', applicants: 12, color: 'bg-green-500' },
                  { platform: 'ZipRecruiter', status: 'Syncing...', applicants: 0, color: 'bg-neutral-400' },
                ].map((job) => (
                  <div key={job.platform} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${job.color}`} />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">{job.platform}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-neutral-500">{job.status}</span>
                      {job.applicants > 0 && (
                        <span className="text-xs font-medium text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                          {job.applicants}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════════
//  SECURITY
// ═══════════════════════════════════════════════════════════════════════════════

const SecuritySection: React.FC = () => (
  <section id="security" className="py-24 md:py-32">
    <div className="max-w-6xl px-6 mx-auto">
      <div className="grid items-start gap-16 lg:grid-cols-2 lg:gap-24">
        <FadeIn>
          <div>
            <span className="inline-block mb-4 text-xs font-semibold tracking-wider uppercase text-cyan-600 dark:text-cyan-400">
              Security
            </span>
            <h2 className="mb-6 text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl text-neutral-900 dark:text-white">
              Built to pass audits before you ask.
            </h2>
            <p className="mb-10 text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
              Most HR platforms bolt on security as an afterthought. Zynctra was designed with security architects from day one.
            </p>
            <ul className="space-y-4">
              {securityItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <IconCheck className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-neutral-700 dark:text-neutral-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>

        <FadeIn delay={0.15} direction="left">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-3xl" />
            <div className="relative bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Security monitor active</span>
                </div>
                <span className="font-mono text-xs text-neutral-400">LIVE</span>
              </div>
              <div className="space-y-2 font-mono text-xs">
                {[
                  { time: '14:32:01', msg: 'Login anomaly — IP 185.220.101.XX', status: 'blocked' },
                  { time: '14:31:58', msg: 'Payroll export threshold exceeded', status: 'alert' },
                  { time: '14:31:45', msg: 'MFA verified — admin session', status: 'ok' },
                  { time: '14:31:12', msg: 'Database backup completed', status: 'ok' },
                  { time: '14:30:55', msg: 'RBAC policy updated — tenant A', status: 'ok' },
                ].map((log, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-900/50"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="flex-shrink-0 text-neutral-400">{log.time}</span>
                      <span className="truncate text-neutral-700 dark:text-neutral-300">{log.msg}</span>
                    </div>
                    <span
                      className={`flex-shrink-0 ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        log.status === 'blocked'
                          ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                          : log.status === 'alert'
                          ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                          : 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════════
//  PRICING
// ═══════════════════════════════════════════════════════════════════════════════

const PricingSection: React.FC = () => (
  <section id="pricing" className="py-24 md:py-32 bg-neutral-50 dark:bg-neutral-900/30">
    <div className="max-w-6xl px-6 mx-auto">
      <FadeIn>
        <div className="max-w-2xl mx-auto mb-16 text-center">
          <span className="inline-block mb-4 text-xs font-semibold tracking-wider uppercase text-cyan-600 dark:text-cyan-400">
            Pricing
          </span>
          <h2 className="mb-4 text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl text-neutral-900 dark:text-white">
            Transparent, predictable, fair.
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            One flat monthly price per tier. No per-seat fees. No surprise invoices.
          </p>
        </div>
      </FadeIn>

      <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
        {pricingTiers.map((tier, i) => (
          <FadeIn key={tier.name} delay={i * 0.1}>
            <div
              className={`relative rounded-2xl p-8 h-full flex flex-col ${
                tier.highlighted
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                  : 'bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white'
              }`}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-cyan-500 text-white text-[10px] font-bold uppercase tracking-wider">
                  Most popular
                </span>
              )}
              <div className="mb-6">
                <h3 className="mb-1 text-lg font-semibold">{tier.name}</h3>
                <p className={`text-sm ${tier.highlighted ? 'text-neutral-400 dark:text-neutral-500' : 'text-neutral-500 dark:text-neutral-500'}`}>
                  {tier.description}
                </p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-bold tracking-tight">{tier.price}</span>
                <span className={`text-sm ml-1 ${tier.highlighted ? 'text-neutral-400 dark:text-neutral-500' : 'text-neutral-500'}`}>
                  {tier.period}
                </span>
              </div>
              <ul className="flex-1 mb-8 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <IconCheck className={`w-4 h-4 mt-0.5 flex-shrink-0 ${tier.highlighted ? 'text-cyan-400 dark:text-cyan-600' : 'text-cyan-600 dark:text-cyan-400'}`} />
                    <span className={`text-sm ${tier.highlighted ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-600 dark:text-neutral-400'}`}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 rounded-lg font-semibold text-sm transition-colors ${
                  tier.highlighted
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white hover:opacity-90'
                    : 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90'
                }`}
              >
                {tier.cta}
              </button>
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.3}>
        <p className="mt-10 text-sm text-center text-neutral-500 dark:text-neutral-600">
          All plans include: GDPR/SOC2 compliance • Encryption at rest & in transit • MFA enforcement • Mobile apps • API access • Audit logging
        </p>
      </FadeIn>
    </div>
  </section>
);

// ═══════════════════════════════════════════════════════════════════════════════
//  TESTIMONIALS — Horizontal scrolling marquee (film strip style)
// ═══════════════════════════════════════════════════════════════════════════════

const TestimonialsMarquee: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationId: number;
    let scrollPos = 0;
    const speed = 0.5; // pixels per frame

    const animate = () => {
      if (!isPaused && container) {
        scrollPos += speed;
        // Reset when we've scrolled half (since we duplicate the content)
        const maxScroll = container.scrollWidth / 2;
        if (scrollPos >= maxScroll) {
          scrollPos = 0;
        }
        container.scrollLeft = scrollPos;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  // Duplicate testimonials for seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="py-24 overflow-hidden md:py-32">
      <div className="max-w-6xl px-6 mx-auto mb-12">
        <FadeIn>
          <div className="max-w-2xl">
            <span className="inline-block mb-4 text-xs font-semibold tracking-wider uppercase text-cyan-600 dark:text-cyan-400">
              Testimonials
            </span>
            <h2 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl text-neutral-900 dark:text-white">
              What our customers say.
            </h2>
          </div>
        </FadeIn>
      </div>

      {/* Marquee container */}
      <div
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="flex gap-6 overflow-x-hidden select-none cursor-grab active:cursor-grabbing"
        style={{ scrollBehavior: 'auto' }}
      >
        {duplicatedTestimonials.map((t, i) => (
          <div
            key={`${t.author}-${i}`}
            className="flex-shrink-0 w-[380px] md:w-[420px] bg-white dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex flex-col"
          >
            {/* Quote mark */}
            <div className="mb-4">
              <IconQuote className="w-8 h-8 text-cyan-500/20" />
            </div>
            
            {/* Stars */}
            <div className="mb-4">
              <StarRating rating={t.rating} />
            </div>
            
            {/* Quote */}
            <blockquote className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6 flex-1 text-[15px]">
              "{t.quote}"
            </blockquote>
            
            {/* Author */}
            <div className="flex items-center gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <img
                src={t.image}
                alt={t.author}
                className="object-cover w-10 h-10 rounded-full"
                loading="lazy"
                draggable={false}
              />
              <div>
                <div className="text-sm font-semibold text-neutral-900 dark:text-white">{t.author}</div>
                <div className="text-xs text-neutral-500 dark:text-neutral-500">
                  {t.title}, {t.company}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll hint */}
      <div className="max-w-6xl px-6 mx-auto mt-8">
        <p className="text-xs text-center text-neutral-400 dark:text-neutral-600">
          Hover to pause • Drag to explore
        </p>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  CTA
// ═══════════════════════════════════════════════════════════════════════════════

const CTASection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setEmail('');
    }
  };

  return (
    <section className="py-24 md:py-32 bg-neutral-50 dark:bg-neutral-900/30">
      <div className="max-w-3xl px-6 mx-auto text-center">
        <FadeIn>
          <h2 className="mb-6 text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl text-neutral-900 dark:text-white">
            Ready to simplify your HR stack?
          </h2>
          <p className="mb-10 text-lg text-neutral-600 dark:text-neutral-400">
            Start your 14-day free trial today. No credit card required. Full platform access.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col max-w-md gap-3 mx-auto mb-4 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              className="flex-1 px-4 py-3 rounded-lg bg-white dark:bg-[#111] border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-500 transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-3 text-sm font-semibold text-white transition-opacity rounded-lg bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:opacity-90 whitespace-nowrap"
            >
              {submitted ? 'Check your email' : 'Start free trial'}
            </button>
          </form>
          <p className="text-xs text-neutral-500 dark:text-neutral-600">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </FadeIn>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  FOOTER — With NoirSageEdge attribution
// ═══════════════════════════════════════════════════════════════════════════════

const Footer: React.FC = () => (
  <footer className="py-16 border-t border-neutral-200 dark:border-neutral-800">
    <div className="max-w-6xl px-6 mx-auto">
      <div className="grid grid-cols-2 gap-8 mb-12 md:grid-cols-5">
        <div className="col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <img src="/assets/logos/logo.png" alt="Zynctra" className="object-contain w-7 h-7" />
            <span className="text-lg font-semibold text-neutral-900 dark:text-white">Zynctra</span>
          </div>
          <p className="max-w-xs mb-4 text-sm leading-relaxed text-neutral-500 dark:text-neutral-500">
            The unified HR platform for companies that take security, compliance, and employee experience seriously.
          </p>
          <a
            href="https://noirsageedge.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
          >
            <span>Powered by NoirSageEdge</span>
            <IconExternal className="w-3 h-3" />
          </a>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-white">Product</h4>
          <ul className="space-y-2.5">
            {['Features', 'Pricing', 'Security', 'Integrations', 'API Docs', 'Changelog'].map((item) => (
              <li key={item}>
                <a href="#" className="text-sm transition-colors text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-white">Company</h4>
          <ul className="space-y-2.5">
            {['About', 'Blog', 'Careers', 'Press', 'Contact'].map((item) => (
              <li key={item}>
                <a href="#" className="text-sm transition-colors text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-white">Legal</h4>
          <ul className="space-y-2.5">
            {['Privacy', 'Terms', 'Cookies', 'GDPR', 'Security'].map((item) => (
              <li key={item}>
                <a href="#" className="text-sm transition-colors text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex flex-col items-center justify-between gap-4 pt-8 border-t border-neutral-200 dark:border-neutral-800 md:flex-row">
        <p className="text-sm text-neutral-400 dark:text-neutral-600">
          © 2026 Zynctra. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          {['Twitter', 'LinkedIn', 'GitHub'].map((s) => (
            <a key={s} href="#" className="text-sm transition-colors text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
              {s}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN
// ═══════════════════════════════════════════════════════════════════════════════

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-white transition-colors duration-300">
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <ProductSection />
        <IntegrationsSection />
        <SecuritySection />
        <PricingSection />
        <TestimonialsMarquee />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;