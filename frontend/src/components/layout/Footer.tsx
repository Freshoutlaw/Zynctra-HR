/**
 * /frontend/src/components/layout/Footer.tsx
 *
 * Application footer with links and information
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const Footer: React.FC = () => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';
  const currentYear = new Date().getFullYear();

  const links = {
    product: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Security', href: '#security' },
      { label: 'Roadmap', href: '#roadmap' },
    ],
    company: [
      { label: 'About', href: '#about' },
      { label: 'Blog', href: '#blog' },
      { label: 'Careers', href: '#careers' },
      { label: 'Contact', href: '#contact' },
    ],
    legal: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Cookies', href: '/cookies' },
      { label: 'Compliance', href: '/compliance' },
    ],
    social: [
      { label: 'Twitter', href: '#twitter', icon: '𝕏' },
      { label: 'LinkedIn', href: '#linkedin', icon: '💼' },
      { label: 'GitHub', href: '#github', icon: '🐙' },
      { label: 'Discord', href: '#discord', icon: '💬' },
    ],
  };

  return (
    <footer
      className={`border-t transition ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center font-bold text-slate-900">
                Z
              </div>
              <span className="font-bold text-lg">Zynctra</span>
            </div>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              All-in-One HR Platform
            </p>
            <p className={`text-xs mt-2 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              Streamline your HR operations with AI-powered insights.
            </p>
          </motion.div>

          {/* Product */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-semibold mb-4 text-sm">Product</h4>
            <ul className="space-y-2">
              {links.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={`text-sm transition hover:text-cyan-400 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-2">
              {links.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={`text-sm transition hover:text-cyan-400 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="font-semibold mb-4 text-sm">Legal</h4>
            <ul className="space-y-2">
              {links.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={`text-sm transition hover:text-cyan-400 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <h4 className="font-semibold mb-4 text-sm">Connect</h4>
            <div className="flex gap-2">
              {links.social.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  title={link.label}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${
                    isDark
                      ? 'bg-slate-800 hover:bg-cyan-500/30 text-slate-400 hover:text-cyan-300'
                      : 'bg-slate-200 hover:bg-cyan-100 text-slate-600 hover:text-cyan-600'
                  }`}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        <div className={`h-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'} my-8`} />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
            © {currentYear} Zynctra. All rights reserved.
          </p>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              All systems operational
            </span>
          </div>
          <p className={`text-xs mt-4 md:mt-0 ${isDark ? 'text-slate-600' : 'text-slate-500'}`}>
            v1.0.0
          </p>
        </div>
      </div>

      <div
        className={`border-t ${
          isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-100/50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className={`text-xs text-center ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
            Built with ❤️ for modern HR teams.{' '}
            <a href="#feedback" className="text-cyan-400 hover:text-cyan-300">
              Send feedback
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;