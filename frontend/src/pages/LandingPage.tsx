import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

/**
 * Type definitions for landing page components
 */
interface Feature {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface PricingTier {
  id: string;
  name: string;
  price: number;
  billingPeriod: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
}

/**
 * Feature card component with hover effects
 */
const FeatureCard: React.FC<{
  feature: Feature;
  index: number;
}> = ({ feature, index }) => {
  return (
    <motion.div
      className="group relative p-8 rounded-lg border border-slate-700 bg-slate-800/40 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 bg-cyan-500/10 transition-opacity duration-300" />

      {/* Content */}
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          {feature.icon}
        </div>
        <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
        <p className="text-slate-400 leading-relaxed">{feature.description}</p>
      </div>
    </motion.div>
  );
};

/**
 * Pricing tier card component
 */
const PricingCard: React.FC<{
  tier: PricingTier;
  onSelect: (tierId: string) => void;
}> = ({ tier, onSelect }) => {
  return (
    <motion.div
      className={`relative rounded-xl p-8 transition-all duration-300 ${
        tier.highlighted
          ? 'border-2 border-cyan-400 bg-gradient-to-br from-slate-800 to-slate-900 scale-105 shadow-2xl shadow-cyan-500/20'
          : 'border border-slate-700 bg-slate-800/40 backdrop-blur-sm'
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: tier.highlighted ? 0 : -8 }}
    >
      {/* Popular badge */}
      {tier.highlighted && (
        <motion.div
          className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-900 font-semibold text-sm rounded-full"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Most Popular
        </motion.div>
      )}

      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
        <p className="text-slate-400 text-sm mb-6">{tier.description}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold text-white">${tier.price}</span>
          <span className="text-slate-400">/ {tier.billingPeriod}</span>
        </div>
      </div>

      {/* Features list */}
      <ul className="space-y-4 mb-8">
        {tier.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-slate-300 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <button
        onClick={() => onSelect(tier.id)}
        className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
          tier.highlighted
            ? 'bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-900 hover:shadow-lg hover:shadow-cyan-500/50'
            : 'bg-slate-700 text-white hover:bg-slate-600'
        }`}
        aria-label={`Select ${tier.name} pricing plan`}
      >
        {tier.cta}
      </button>
    </motion.div>
  );
};

/**
 * Testimonial card component
 */
const TestimonialCard: React.FC<{ testimonial: Testimonial; index: number }> = ({
  testimonial,
  index,
}) => {
  return (
    <motion.div
      className="p-8 rounded-lg border border-slate-700 bg-slate-800/40 backdrop-blur-sm"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
    >
      {/* Star rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Quote */}
      <p className="text-slate-300 mb-6 leading-relaxed italic">&quot;{testimonial.quote}&quot;</p>

      {/* Author info */}
      <div className="flex items-center gap-4">
        <img
          src={testimonial.avatar}
          alt={testimonial.author}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="%2300d9ff" viewBox="0 0 24 24"%3E%3Cpath d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" /%3E%3C/svg%3E';
          }}
        />
        <div>
          <p className="text-white font-semibold">{testimonial.author}</p>
          <p className="text-slate-400 text-sm">
            {testimonial.role} at {testimonial.company}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * LandingPage Component
 *
 * Premium corporate landing page featuring:
 * - Hero section with call-to-action
 * - Feature showcase grid
 * - Transparent pricing tiers
 * - Customer testimonials
 * - Security-hardened forms
 * - Responsive mobile-first design
 * - Accessibility compliance (WCAG 2.1)
 */
const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  /**
   * Validate email address
   */
  const validateEmail = useCallback((value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) && value.length <= 254;
  }, []);

  /**
   * Sanitize email input using DOMPurify
   */
  const sanitizeInput = useCallback((input: string): string => {
    return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] }).trim();
  }, []);

  /**
   * Handle email subscription with validation and sanitization
   */
  const handleEmailSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setEmailError('');

      // Sanitize input
      const sanitizedEmail = sanitizeInput(email);

      // Validate
      if (!sanitizedEmail) {
        setEmailError('Please enter an email address');
        return;
      }

      if (!validateEmail(sanitizedEmail)) {
        setEmailError('Please enter a valid email address');
        return;
      }

      // Update state with sanitized value
      setEmail(sanitizedEmail);
      setSubmitted(true);

      // Reset form after success
      setTimeout(() => {
        setEmail('');
        setSubmitted(false);
      }, 3000);
    },
    [email, sanitizeInput, validateEmail]
  );

  /**
   * Handle input change with real-time validation
   */
  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (value && !validateEmail(value)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  }, [validateEmail]);

  /**
   * Handle pricing tier selection
   */
  const handleSelectPlan = useCallback(
    (tierId: string) => {
      // Navigate to signup with plan context
      navigate(`/login?plan=${tierId}`);
    },
    [navigate]
  );

  // Features data
  const features: Feature[] = useMemo(
    () => [
      {
        id: 'integration',
        icon: <span className="text-white text-xl">🔗</span>,
        title: 'Unified Platform',
        description: 'Consolidate all HR functions in one intuitive system, eliminating data silos and manual workarounds.',
      },
      {
        id: 'security',
        icon: <span className="text-white text-xl">🔐</span>,
        title: 'Enterprise Security',
        description: 'Industry-leading security with MFA, encryption, audit logging, and autonomous anomaly detection.',
      },
      {
        id: 'ai',
        icon: <span className="text-white text-xl">✨</span>,
        title: 'AI-Powered Insights',
        description: 'Intelligent assistance for policy drafting, compensation analysis, and predictive attrition modeling.',
      },
      {
        id: 'payroll',
        icon: <span className="text-white text-xl">💰</span>,
        title: 'Global Payroll',
        description: 'Multi-country payroll automation with tax compliance, direct deposit, and comprehensive audit trails.',
      },
      {
        id: 'mobile',
        icon: <span className="text-white text-xl">📱</span>,
        title: 'Mobile-First',
        description: 'Fully responsive design enabling employees to access time tracking, requests, and payslips anywhere.',
      },
      {
        id: 'connectors',
        icon: <span className="text-white text-xl">⚡</span>,
        title: 'Native Integrations',
        description: 'Pre-built connectors to Workday, Slack, QuickBooks, Greenhouse, and 100+ enterprise platforms.',
      },
    ],
    []
  );

  // Pricing tiers
  const pricingTiers: PricingTier[] = useMemo(
    () => [
      {
        id: 'startup',
        name: 'Startup',
        price: 199,
        billingPeriod: 'month',
        description: 'Perfect for growing businesses (10-100 employees)',
        features: [
          'Core HR module',
          'Basic time tracking',
          'Employee self-service',
          'Standard reporting',
          'Email support',
          'Up to 100 employees',
        ],
        cta: 'Start Free Trial',
        highlighted: false,
      },
      {
        id: 'business',
        name: 'Business',
        price: 599,
        billingPeriod: 'month',
        description: 'Comprehensive solution for mid-market companies (100-500 employees)',
        features: [
          'All Startup features',
          'Built-in payroll engine',
          'Applicant tracking (ATS)',
          'Benefits administration',
          'Performance management',
          'Advanced workflows',
          'Phone + chat support',
          '24/7 uptime SLA',
        ],
        cta: 'Start Free Trial',
        highlighted: true,
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 1299,
        billingPeriod: 'month',
        description: 'Full-featured platform for large organizations (500+ employees)',
        features: [
          'All Business features',
          'Global payroll (multi-country)',
          'Advanced AI assistant',
          'Custom integrations',
          'Learning management (LMS)',
          'Dedicated account manager',
          'Priority 24/7 support',
          'Custom SLA & deployment',
          'Admin security console',
        ],
        cta: 'Schedule Demo',
        highlighted: false,
      },
    ],
    []
  );

  // Testimonials
  const testimonials: Testimonial[] = useMemo(
    () => [
      {
        id: '1',
        quote:
          'Zynctra consolidated our HR, payroll, and recruitment into one platform. We reduced manual data entry by 80% and saved our team weeks every quarter.',
        author: 'Sarah Chen',
        role: 'Chief People Officer',
        company: 'TechCorp',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      },
      {
        id: '2',
        quote:
          'The security and compliance features gave us peace of mind. Transparent pricing meant no surprise fees, and the AI assistant helped us draft policies in minutes.',
        author: 'Marcus Johnson',
        role: 'HR Director',
        company: 'FinanceFlow',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
      },
      {
        id: '3',
        quote:
          'Multi-country payroll was a nightmare before. Now we handle employees across 8 countries with confidence. The audit logs are exceptional.',
        author: 'Elena Rodriguez',
        role: 'Global HR Manager',
        company: 'GlobalVentures',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
      },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-slate-800/50 backdrop-blur-sm bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <svg viewBox="0 0 200 200" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
              <g stroke="#00d9ff" strokeWidth="2" fill="none">
                <path d="M 50 50 L 100 50 L 75 80 Z" />
                <path d="M 100 50 L 150 50 L 125 80 Z" />
                <path d="M 100 60 L 115 95 L 100 90 L 120 130 L 80 100 L 95 105 Z" fill="#00d9ff" />
                <path d="M 50 150 L 75 120 L 100 150 Z" />
                <path d="M 100 150 L 125 120 L 150 150 Z" />
              </g>
            </svg>
            <span className="font-bold text-lg">Zynctra</span>
          </motion.div>

          <motion.button
            onClick={() => navigate('/login')}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-900 font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign In
          </motion.button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-500 bg-clip-text text-transparent">
              The Enterprise HR Platform Built for Today
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Unified Core HR, Payroll, Talent Acquisition, and AI-powered insights. Transparent pricing.
              Industry-leading security. No hidden fees.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => navigate('/login?action=signup')}
                className="px-8 py-4 rounded-lg bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-900 font-bold text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Free Trial
              </motion.button>
              <motion.button
                onClick={() => {
                  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 rounded-lg border-2 border-cyan-400 text-cyan-300 font-bold text-lg hover:bg-cyan-400/10 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Pricing
              </motion.button>
            </div>
          </motion.div>

          {/* Hero image placeholder */}
          <motion.div
            className="relative h-96 rounded-lg border border-cyan-500/20 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-32 h-32 opacity-30" xmlns="http://www.w3.org/2000/svg">
                <g stroke="#00d9ff" strokeWidth="2" fill="none">
                  <path d="M 50 50 L 100 50 L 75 80 Z" />
                  <path d="M 100 50 L 150 50 L 125 80 Z" />
                  <path d="M 100 60 L 115 95 L 100 90 L 120 130 L 80 100 L 95 105 Z" fill="#00d9ff" />
                  <path d="M 50 150 L 75 120 L 100 150 Z" />
                  <path d="M 100 150 L 125 120 L 150 150 Z" />
                </g>
              </svg>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose Zynctra?</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Designed to solve the real pain points competitors left unsolved
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={feature.id} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Transparent Pricing</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Simple, honest pricing. No hidden fees. Scale as you grow.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 items-center">
            {pricingTiers.map((tier) => (
              <PricingCard
                key={tier.id}
                tier={tier}
                onSelect={handleSelectPlan}
              />
            ))}
          </div>

          <motion.div
            className="mt-16 p-8 rounded-lg border border-slate-700 bg-slate-800/40 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-2">All plans include:</h3>
            <p className="text-slate-300 mb-4">
              Core HR • Employee Self-Service • Time & Attendance • Mobile Apps • Email Support • 99.9% Uptime SLA • GDPR/SOC2 Compliance
            </p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Trusted by Leading Companies</h2>
            <p className="text-xl text-slate-400">See how teams are transforming HR with Zynctra</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to Transform Your HR?</h2>

            {/* Email signup form */}
            <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 mb-8 max-w-lg mx-auto">
              <div className="flex-1 relative">
                <input
                  type="email"
                  placeholder="your@company.com"
                  value={email}
                  onChange={handleEmailChange}
                  className={`w-full px-6 py-4 rounded-lg bg-slate-800 border-2 text-white placeholder-slate-500 transition-colors duration-300 ${
                    emailError ? 'border-red-500' : 'border-slate-700 focus:border-cyan-400'
                  } focus:outline-none`}
                  aria-label="Email address"
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? 'email-error' : undefined}
                  maxLength={254}
                />
                {emailError && (
                  <p id="email-error" className="text-red-400 text-sm mt-2 text-left">
                    {emailError}
                  </p>
                )}
              </div>
              <motion.button
                type="submit"
                disabled={submitted}
                className="px-8 py-4 rounded-lg bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-900 font-bold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {submitted ? '✓ Check your email' : 'Get Started'}
              </motion.button>
            </form>

            <p className="text-slate-400">
              14-day free trial. No credit card required. Full access to all features.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-cyan-400 transition">Features</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">Pricing</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">Security</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-cyan-400 transition">About</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">Blog</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-cyan-400 transition">Privacy</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">Terms</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">Compliance</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Connect</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-cyan-400 transition">Twitter</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">LinkedIn</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">GitHub</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-slate-400 text-sm">
          <p>&copy; 2026 Zynctra. All rights reserved.</p>
          <p>Built with security and enterprise standards in mind.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;