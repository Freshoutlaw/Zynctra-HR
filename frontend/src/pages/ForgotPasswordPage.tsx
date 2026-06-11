// /**
//  * /frontend/src/pages/ForgotPasswordPage.tsx
//  * 
//  * Password reset flow with email verification
//  * Strict validation and security measures
//  */

// import React, { useState, useEffect } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { useTheme } from '../context/ThemeContext';

// type Step = 'email' | 'verify' | 'reset' | 'success';

// interface FormData {
//   email: string;
//   code: string;
//   password: string;
//   confirmPassword: string;
// }

// interface ValidationErrors {
//   [key: string]: string;
// }

// /**
//  * ForgotPasswordPage Component
//  */
// const ForgotPasswordPage: React.FC = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const { theme } = useTheme();
//   const [step, setStep] = useState<Step>('email');
//   const [formData, setFormData] = useState<FormData>({
//     email: '',
//     code: '',
//     password: '',
//     confirmPassword: '',
//   });
//   const [errors, setErrors] = useState<ValidationErrors>({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [cooldownTime, setCooldownTime] = useState(0);
//   const [successMessage, setSuccessMessage] = useState('');

//   // Handle token from URL
//   useEffect(() => {
//     const token = searchParams.get('token');
//     if (token) {
//       setFormData((prev) => ({ ...prev, code: token }));
//       setStep('reset');
//     }
//   }, [searchParams]);

//   // Cooldown timer
//   useEffect(() => {
//     if (cooldownTime <= 0) return;
//     const timer = setTimeout(() => setCooldownTime(cooldownTime - 1), 1000);
//     return () => clearTimeout(timer);
//   }, [cooldownTime]);

//   const isDark = theme === 'dark';

//   /**
//    * Validate email
//    */
//   const validateEmail = (email: string): string => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!email) return 'Email is required';
//     if (!emailRegex.test(email)) return 'Invalid email format';
//     if (email.length > 254) return 'Email is too long';
//     return '';
//   };

//   /**
//    * Validate password
//    */
//   const validatePassword = (password: string): string => {
//     if (!password) return 'Password is required';

//     const errors = [];
//     if (password.length < 12) errors.push('At least 12 characters');
//     if (!/[A-Z]/.test(password)) errors.push('At least one uppercase letter');
//     if (!/[a-z]/.test(password)) errors.push('At least one lowercase letter');
//     if (!/[0-9]/.test(password)) errors.push('At least one number');
//     if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
//       errors.push('At least one special character');

//     if (errors.length > 0) {
//       return `Password must have: ${errors.join(', ')}`;
//     }

//     return '';
//   };

//   /**
//    * Step 1: Request password reset
//    */
//   const handleSendCode = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrors({});

//     const emailError = validateEmail(formData.email);
//     if (emailError) {
//       setErrors({ email: emailError });
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const response = await fetch(
//         `${process.env.REACT_APP_API_URL}/auth/forgot-password`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'X-CSRF-Token': getCsrfToken(),
//           },
//           body: JSON.stringify({ email: formData.email }),
//         }
//       );

//       if (!response.ok) {
//         const data = await response.json();
//         throw new Error(data.message || 'Failed to send reset code');
//       }

//       setSuccessMessage(`✓ Reset code sent to ${formData.email}`);
//       setCooldownTime(60); // 60 second cooldown
//       setStep('verify');
//     } catch (error) {
//       setErrors({
//         email: error instanceof Error ? error.message : 'Failed to send reset code',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   /**
//    * Step 2: Verify code and reset password
//    */
//   const handleResetPassword = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrors({});

//     // Validate code
//     if (!formData.code) {
//       setErrors({ code: 'Reset code is required' });
//       return;
//     }

//     if (formData.code.length < 6) {
//       setErrors({ code: 'Invalid reset code' });
//       return;
//     }

//     // Validate password
//     const passwordError = validatePassword(formData.password);
//     if (passwordError) {
//       setErrors({ password: passwordError });
//       return;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       setErrors({ confirmPassword: 'Passwords do not match' });
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const response = await fetch(
//         `${process.env.REACT_APP_API_URL}/auth/reset-password`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'X-CSRF-Token': getCsrfToken(),
//           },
//           body: JSON.stringify({
//             email: formData.email,
//             code: formData.code,
//             password: formData.password,
//           }),
//         }
//       );

//       if (!response.ok) {
//         const data = await response.json();
//         throw new Error(data.message || 'Failed to reset password');
//       }

//       setSuccessMessage('✓ Password reset successful! Redirecting to login...');
//       setStep('success');

//       setTimeout(() => {
//         navigate('/login');
//       }, 2000);
//     } catch (error) {
//       setErrors({
//         submit: error instanceof Error ? error.message : 'Failed to reset password',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   /**
//    * Resend code
//    */
//   const handleResendCode = async () => {
//     if (cooldownTime > 0) return;

//     setIsLoading(true);
//     try {
//       const response = await fetch(
//         `${process.env.REACT_APP_API_URL}/auth/forgot-password`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'X-CSRF-Token': getCsrfToken(),
//           },
//           body: JSON.stringify({ email: formData.email }),
//         }
//       );

//       if (!response.ok) throw new Error('Failed to resend code');

//       setSuccessMessage('✓ Reset code resent');
//       setCooldownTime(60);
//     } catch (error) {
//       setErrors({
//         code: error instanceof Error ? error.message : 'Failed to resend code',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getCsrfToken = (): string => {
//     const meta = document.querySelector('meta[name="csrf-token"]');
//     return meta?.getAttribute('content') || '';
//   };

//   return (
//     <div className={`min-h-screen flex items-center justify-center px-4 py-12 ${
//       isDark
//         ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
//         : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'
//     }`}>
//       <motion.div
//         className="w-full max-w-md"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//       >
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
//             Reset Password
//           </h1>
//           <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
//             {step === 'email' && 'Enter your email to get a reset code'}
//             {step === 'verify' && 'Enter the code we sent to your email'}
//             {step === 'reset' && 'Create a new password'}
//             {step === 'success' && 'Password reset successful'}
//           </p>
//         </div>

//         {/* Success Message */}
//         {successMessage && (
//           <motion.div
//             className={`mb-6 p-4 rounded-lg border ${
//               isDark
//                 ? 'bg-green-500/20 border-green-500/50 text-green-300'
//                 : 'bg-green-100 border-green-300 text-green-900'
//             }`}
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//           >
//             {successMessage}
//           </motion.div>
//         )}

//         {/* Form */}
//         <form
//           onSubmit={step === 'email' || step === 'verify' ? handleSendCode : handleResetPassword}
//           className={`p-8 rounded-lg border ${
//             isDark
//               ? 'bg-slate-900 border-slate-800'
//               : 'bg-white border-slate-200 shadow-lg'
//           }`}
//         >
//           {/* Email Step */}
//           {(step === 'email' || step === 'verify') && (
//             <div className="mb-6">
//               <label htmlFor="email" className="block text-sm font-semibold mb-2">
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                 placeholder="you@example.com"
//                 disabled={step === 'verify'}
//                 className={`w-full px-4 py-3 rounded-lg border transition disabled:opacity-50 ${
//                   errors.email && step === 'email'
//                     ? isDark
//                       ? 'border-red-500 bg-red-500/10'
//                       : 'border-red-500 bg-red-50'
//                     : isDark
//                       ? 'border-slate-700 bg-slate-800'
//                       : 'border-slate-300 bg-slate-50'
//                 }`}
//               />
//               {errors.email && step === 'email' && (
//                 <p className="text-red-500 text-xs mt-2">{errors.email}</p>
//               )}
//             </div>
//           )}

//           {/* Verify Code Step */}
//           {(step === 'verify' || step === 'reset') && (
//             <div className="mb-6">
//               <label htmlFor="code" className="block text-sm font-semibold mb-2">
//                 Reset Code
//               </label>
//               <input
//                 type="text"
//                 id="code"
//                 value={formData.code}
//                 onChange={(e) =>
//                   setFormData({ ...formData, code: e.target.value.toUpperCase() })
//                 }
//                 placeholder="XXXXXX"
//                 maxLength={12}
//                 className={`w-full px-4 py-3 rounded-lg border transition text-center text-2xl tracking-widest font-mono ${
//                   errors.code
//                     ? isDark
//                       ? 'border-red-500 bg-red-500/10'
//                       : 'border-red-500 bg-red-50'
//                     : isDark
//                       ? 'border-slate-700 bg-slate-800'
//                       : 'border-slate-300 bg-slate-50'
//                 }`}
//               />
//               {errors.code && (
//                 <p className="text-red-500 text-xs mt-2">{errors.code}</p>
//               )}
//               {step === 'verify' && (
//                 <button
//                   type="button"
//                   onClick={handleResendCode}
//                   disabled={cooldownTime > 0 || isLoading}
//                   className={`mt-3 text-sm font-medium transition ${
//                     cooldownTime > 0
//                       ? isDark
//                         ? 'text-slate-500'
//                         : 'text-slate-400'
//                       : 'text-cyan-400 hover:text-cyan-300'
//                   }`}
//                 >
//                   {cooldownTime > 0 ? `Resend code in ${cooldownTime}s` : 'Resend code'}
//                 </button>
//               )}
//             </div>
//           )}

//           {/* New Password */}
//           {(step === 'reset' || step === 'verify') && (
//             <>
//               <div className="mb-6">
//                 <label htmlFor="password" className="block text-sm font-semibold mb-2">
//                   New Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     id="password"
//                     value={formData.password}
//                     onChange={(e) =>
//                       setFormData({ ...formData, password: e.target.value })
//                     }
//                     placeholder="••••••••••••"
//                     className={`w-full px-4 py-3 rounded-lg border transition ${
//                       errors.password
//                         ? isDark
//                           ? 'border-red-500 bg-red-500/10'
//                           : 'border-red-500 bg-red-50'
//                         : isDark
//                           ? 'border-slate-700 bg-slate-800'
//                           : 'border-slate-300 bg-slate-50'
//                     }`}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
//                       isDark ? 'text-slate-400' : 'text-slate-600'
//                     }`}
//                   >
//                     {showPassword ? '👁️' : '👁️‍🗨️'}
//                   </button>
//                 </div>
//                 {errors.password && (
//                   <p className="text-red-500 text-xs mt-2">{errors.password}</p>
//                 )}
//               </div>

//               <div className="mb-6">
//                 <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2">
//                   Confirm Password
//                 </label>
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   id="confirmPassword"
//                   value={formData.confirmPassword}
//                   onChange={(e) =>
//                     setFormData({ ...formData, confirmPassword: e.target.value })
//                   }
//                   placeholder="••••••••••••"
//                   className={`w-full px-4 py-3 rounded-lg border transition ${
//                     errors.confirmPassword
//                       ? isDark
//                         ? 'border-red-500 bg-red-500/10'
//                         : 'border-red-500 bg-red-50'
//                       : isDark
//                         ? 'border-slate-700 bg-slate-800'
//                         : 'border-slate-300 bg-slate-50'
//                   }`}
//                 />
//                 {errors.confirmPassword && (
//                   <p className="text-red-500 text-xs mt-2">{errors.confirmPassword}</p>
//                 )}
//               </div>
//             </>
//           )}

//           {/* Error */}
//           {errors.submit && (
//             <motion.div
//               className={`mb-6 p-4 rounded-lg border ${
//                 isDark
//                   ? 'bg-red-500/20 border-red-500/50 text-red-300'
//                   : 'bg-red-100 border-red-300 text-red-900'
//               }`}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//             >
//               {errors.submit}
//             </motion.div>
//           )}

//           {/* Buttons */}
//           {step === 'email' && (
//             <button
//               type="submit"
//               disabled={isLoading}
//               className={`w-full py-3 px-6 rounded-lg font-semibold transition ${
//                 isLoading
//                   ? 'opacity-50 cursor-not-allowed'
//                   : 'bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-900 hover:shadow-lg hover:shadow-cyan-500/50'
//               }`}
//             >
//               {isLoading ? 'Sending...' : 'Send Reset Code'}
//             </button>
//           )}

//           {step === 'verify' && (
//             <div className="flex gap-4">
//               <button
//                 type="button"
//                 onClick={() => setStep('email')}
//                 className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
//                   isDark
//                     ? 'bg-slate-800 text-white hover:bg-slate-700'
//                     : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
//                 }`}
//               >
//                 Back
//               </button>
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
//                   isLoading
//                     ? 'opacity-50 cursor-not-allowed'
//                     : 'bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-900 hover:shadow-lg hover:shadow-cyan-500/50'
//                 }`}
//               >
//                 {isLoading ? 'Verifying...' : 'Verify & Continue'}
//               </button>
//             </div>
//           )}

//           {step === 'reset' && (
//             <button
//               type="submit"
//               disabled={isLoading}
//               className={`w-full py-3 px-6 rounded-lg font-semibold transition ${
//                 isLoading
//                   ? 'opacity-50 cursor-not-allowed'
//                   : 'bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-900 hover:shadow-lg hover:shadow-cyan-500/50'
//               }`}
//             >
//               {isLoading ? 'Resetting...' : 'Reset Password'}
//             </button>
//           )}
//         </form>

//         {/* Back to Login */}
//         <p className={`text-center text-sm mt-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
//           <a href="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold">
//             Back to Login
//           </a>
//         </p>
//       </motion.div>
//     </div>
//   );
// };

// export default ForgotPasswordPage;



/**
 * /frontend/src/pages/ForgotPasswordPage.tsx
 *
 * Password reset flow.
 * Fixed: uses import.meta.env; getCsrfToken from AuthContext.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { getCsrfToken } from '../context/AuthContext';

type Step = 'email' | 'verify' | 'reset' | 'success';

const API_BASE =
  (import.meta.env['VITE_API_URL'] as string | undefined) ?? '';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Handle token from URL (email link flow)
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) { setCode(token); setStep('reset'); }
  }, [searchParams]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const inputClass = `w-full px-4 py-3 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
    isDark ? 'border-slate-700 bg-slate-800 text-white placeholder-slate-500' : 'border-slate-300 bg-slate-50 placeholder-slate-400'
  }`;

  const sendCode = async () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': getCsrfToken() },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const d = (await res.json()) as { message?: string };
        throw new Error(d.message ?? 'Failed to send reset code');
      }
      setSuccess(`✓ Reset code sent to ${email}`);
      setCooldown(60);
      setStep('verify');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send code');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async () => {
    setError(null);
    if (!code.trim() || code.length < 6) { setError('Invalid reset code.'); return; }
    if (password.length < 12) { setError('Password must be at least 12 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': getCsrfToken() },
        body: JSON.stringify({ email, code, password }),
      });
      if (!res.ok) {
        const d = (await res.json()) as { message?: string };
        throw new Error(d.message ?? 'Failed to reset password');
      }
      setStep('success');
      setSuccess('✓ Password reset successful!');
      setTimeout(() => navigate('/login', { replace: true }), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'email') void sendCode();
    else if (step === 'verify') setStep('reset');
    else if (step === 'reset') void resetPassword();
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-12 ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
      <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 items-center justify-center text-white font-bold text-xl mb-4">Z</div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">Reset Password</h1>
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            {step === 'email' && 'Enter your email to receive a reset code'}
            {step === 'verify' && 'Enter the code we sent to your email'}
            {step === 'reset' && 'Create your new password'}
            {step === 'success' && 'Password reset successfully'}
          </p>
        </div>

        <div className={`p-8 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-lg'}`}>
          <AnimatePresence>
            {success && (
              <motion.div className={`mb-5 p-4 rounded-lg border text-sm ${isDark ? 'bg-green-500/20 border-green-500/50 text-green-300' : 'bg-green-50 border-green-300 text-green-800'}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {success}
              </motion.div>
            )}
            {error && (
              <motion.div className={`mb-5 p-4 rounded-lg border text-sm ${isDark ? 'bg-red-500/20 border-red-500/50 text-red-300' : 'bg-red-50 border-red-300 text-red-700'}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="alert">
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {step !== 'success' && (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Email field — shown on email + verify steps */}
              {(step === 'email' || step === 'verify') && (
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} disabled={step === 'verify' || isLoading} />
                </div>
              )}

              {/* Code field — shown on verify + reset steps */}
              {(step === 'verify' || step === 'reset') && (
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Reset Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="XXXXXXXX"
                    maxLength={12}
                    className={`${inputClass} text-center text-xl tracking-widest font-mono`}
                    disabled={isLoading}
                  />
                  {step === 'verify' && (
                    <button type="button" onClick={() => void sendCode()} disabled={cooldown > 0 || isLoading} className={`mt-2 text-sm font-medium ${cooldown > 0 ? isDark ? 'text-slate-500' : 'text-slate-400' : 'text-cyan-400 hover:text-cyan-300'}`}>
                      {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
                    </button>
                  )}
                </div>
              )}

              {/* Password fields — shown on reset step */}
              {step === 'reset' && (
                <>
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>New Password</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••••" className={`${inputClass} pr-12`} disabled={isLoading} />
                      <button type="button" onClick={() => setShowPassword((v) => !v)} className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} tabIndex={-1}>
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Confirm New Password</label>
                    <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••••••" className={inputClass} disabled={isLoading} />
                  </div>
                </>
              )}

              {/* Buttons */}
              <div className={`flex gap-3 ${step !== 'email' ? 'flex-row' : ''}`}>
                {step !== 'email' && (
                  <button type="button" onClick={() => { setStep(step === 'verify' ? 'email' : 'verify'); setError(null); }} className={`flex-1 py-3 rounded-lg font-semibold transition ${isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-200 text-slate-900 hover:bg-slate-300'}`}>
                    ← Back
                  </button>
                )}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 rounded-lg font-semibold bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-900 hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  whileHover={!isLoading ? { scale: 1.02 } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
                >
                  {isLoading
                    ? step === 'email' ? 'Sending…' : step === 'reset' ? 'Resetting…' : 'Continuing…'
                    : step === 'email' ? 'Send Reset Code'
                    : step === 'verify' ? 'Continue'
                    : 'Reset Password'}
                </motion.button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">✓</div>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Redirecting you to login…</p>
            </div>
          )}
        </div>

        <p className={`text-center text-sm mt-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          <button onClick={() => navigate('/login')} className="text-cyan-400 hover:text-cyan-300 font-semibold">
            ← Back to Login
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;