// cat > /mnt/user-data/outputs/MFASettings.tsx << 'EOF'
/**
 * /frontend/src/components/security/MFASettings.tsx
 * 
 * Multi-factor authentication settings and configuration
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface MFAConfig {
  enabled: boolean;
  method: 'sms' | 'authenticator' | 'email';
  phoneNumber?: string;
  backupCodes: string[];
  lastConfigured?: Date;
}

interface MFASettingsProps {
  config?: MFAConfig;
  onUpdate?: (config: MFAConfig) => void;
  isLoading?: boolean;
}

export const MFASettings: React.FC<MFASettingsProps> = ({
  config,
  onUpdate,
}) => {
  const [step, setStep] = useState<'select' | 'setup' | 'verify' | 'complete'>('select');
  const [selectedMethod, setSelectedMethod] = useState<'sms' | 'authenticator' | 'email' | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const handleMethodSelect = (method: 'sms' | 'authenticator' | 'email') => {
    setSelectedMethod(method);
    setStep('setup');
  };

  const generateBackupCodes = () => {
    const codes = Array.from({ length: 10 }, () =>
      Math.random().toString(36).substr(2, 8).toUpperCase()
    );
    setBackupCodes(codes);
    setStep('verify');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {config?.enabled && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-sm font-medium text-green-700 dark:text-green-300">
            ✓ Multi-factor authentication is enabled
          </p>
        </div>
      )}

      {step === 'select' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <h2 className="text-2xl font-bold">Enable Multi-Factor Authentication</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: 'sms', name: 'SMS', icon: '📱', desc: 'Receive code via text' },
              { id: 'authenticator', name: 'Authenticator', icon: '🔐', desc: 'Use an app' },
              { id: 'email', name: 'Email', icon: '📧', desc: 'Code via email' },
            ].map((method: any) => (
              <motion.button
                key={method.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleMethodSelect(method.id)}
                className="p-6 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-cyan-500 transition-colors text-center"
              >
                <div className="text-4xl mb-2">{method.icon}</div>
                <h3 className="font-semibold">{method.name}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">{method.desc}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {step === 'setup' && selectedMethod === 'sms' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <h2 className="text-2xl font-bold">Set up SMS Authentication</h2>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                placeholder="+234..."
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>
            <button
              onClick={generateBackupCodes}
              className="w-full px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium"
            >
              Continue
            </button>
          </div>
        </motion.div>
      )}

      {step === 'verify' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <h2 className="text-2xl font-bold">Verify & Save Backup Codes</h2>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Save these backup codes in a safe place. You can use them to access your account if you lose access to your authentication method.
            </p>
            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 space-y-2">
              {backupCodes.map((code, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-600"
                >
                  <code className="font-mono text-sm">{code}</code>
                  <button className="text-cyan-600 hover:text-cyan-700 text-sm">Copy</button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep('complete')}
              className="w-full px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium"
            >
              I've Saved These Codes
            </button>
          </div>
        </motion.div>
      )}

      {step === 'complete' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-6">
          <div className="text-6xl">✓</div>
          <h2 className="text-2xl font-bold">Setup Complete!</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Multi-factor authentication is now enabled on your account.
          </p>
          <button
            className="px-8 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium"
            onClick={() => onUpdate?.({ enabled: true, method: selectedMethod!, backupCodes })}
          >
            Done
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MFASettings;
// EOF