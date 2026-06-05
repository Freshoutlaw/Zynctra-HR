// /**
//  * /frontend/src/pages/RegisterPage.tsx
//  * 
//  * User registration with strict validation
//  * Password requirements, email verification, CAPTCHA ready
//  */

// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { useTheme } from '../context/ThemeContext';

// interface FormData {
//   email: string;
//   fullName: string;
//   password: string;
//   confirmPassword: string;
//   agreeToTerms: boolean;
// }

// interface ValidationErrors {
//   [key: string]: string;
// }

// /**
//  * RegisterPage Component
//  */
// const RegisterPage: React.FC = () => {
//   const navigate = useNavigate();
//   const { theme } = useTheme();
//   const [formData, setFormData] = useState<FormData>({
//     email: '',
//     fullName: '',
//     password: '',
//     confirmPassword: '',
//     agreeToTerms: false,
//   });

//   const [errors, setErrors] = useState<ValidationErrors>({});
//   const [touched, setTouched] = useState<Record<string, boolean>>({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');

//   /**
//    * Validation Rules
//    */
//   const validateField = (name: string, value: string): string => {
//     switch (name) {
//       case 'email': {
//         // Strict email validation
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!value) return 'Email is required';
//         if (!emailRegex.test(value)) return 'Invalid email format';
//         if (value.length > 254) return 'Email is too long';
//         if (value.length < 5) return 'Email is too short';
//         // Check for disposable email domains (future enhancement)
//         const disposableDomains = ['tempmail.com', 'throwaway.email', '10minutemail.com'];
//         const domain = value.split('@')[1];
//         if (disposableDomains.includes(domain)) return 'Disposable email addresses not allowed';
//         return '';
//       }

//       case 'fullName': {
//         if (!value) return 'Full name is required';
//         if (value.length < 2) return 'Name must be at least 2 characters';
//         if (value.length > 100) return 'Name is too long';
//         if (!/^[a-zA-Z\s'-]+$/.test(value)) return 'Name can only contain letters, spaces, and hyphens';
//         // Prevent common abuse patterns
//         if (/(.)\1{2,}/.test(value)) return 'Name contains too many repeated characters';
//         return '';
//       }

//       case 'password': {
//         if (!value) return 'Password is required';

//         const errors = [];

//         if (value.length < 12) errors.push('At least 12 characters');
//         if (!/[A-Z]/.test(value)) errors.push('At least one uppercase letter');
//         if (!/[a-z]/.test(value)) errors.push('At least one lowercase letter');
//         if (!/[0-9]/.test(value)) errors.push('At least one number');
//         if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value))
//           errors.push('At least one special character');

//         // Check against common passwords
//         const commonPasswords = [
//           'password123',
//           'qwerty123',
//           '123456789',
//           'admin123',
//         ];
//         if (commonPasswords.some((p) => value.toLowerCase().includes(p)))
//           errors.push('Password is too common');

//         if (errors.length > 0) {
//           return `Password must have: ${errors.join(', ')}`;
//         }

//         return '';
//       }

//       case 'confirmPassword': {
//         if (!value) return 'Please confirm your password';
//         if (value !== formData.password) return 'Passwords do not match';
//         return '';
//       }

//       case 'agreeToTerms': {
//         if (!formData.agreeToTerms) return 'You must agree to the terms and conditions';
//         return '';
//       }

//       default:
//         return '';
//     }
//   };

//   /**
//    * Handle field change
//    */
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target;
//     const newValue = type === 'checkbox' ? checked : value;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: newValue,
//     }));

//     // Real-time validation
//     if (touched[name]) {
//       const error = validateField(name, type === 'checkbox' ? '' : value);
//       setErrors((prev) => ({
//         ...prev,
//         [name]: error,
//       }));
//     }
//   };

//   /**
//    * Handle field blur
//    */
//   const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
//     const { name } = e.target;
//     setTouched((prev) => ({
//       ...prev,
//       [name]: true,
//     }));

//     const error = validateField(name, formData[name as keyof FormData] as string);
//     setErrors((prev) => ({
//       ...prev,
//       [name]: error,
//     }));
//   };

//   /**
//    * Validate entire form
//    */
//   const validateForm = (): boolean => {
//     const newErrors: ValidationErrors = {};

//     Object.keys(formData).forEach((key) => {
//       const error = validateField(key, formData[key as keyof FormData] as string);
//       if (error) newErrors[key] = error;
//     });

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   /**
//    * Handle form submission
//    */
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const response = await fetch(
//         `${process.env.REACT_APP_API_URL}/auth/register`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'X-CSRF-Token': getCsrfToken(),
//           },
//           body: JSON.stringify({
//             email: formData.email,
//             fullName: formData.fullName,
//             password: formData.password,
//           }),
//         }
//       );

//       if (!response.ok) {
//         const data = await response.json();
//         throw new Error(data.message || 'Registration failed');
//       }

//       setSuccessMessage(
//         '✓ Registration successful! Check your email to verify your account.'
//       );

//       setTimeout(() => {
//         navigate('/login');
//       }, 2000);
//     } catch (error) {
//       setErrors({
//         submit: error instanceof Error ? error.message : 'Registration failed',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getCsrfToken = (): string => {
//     const meta = document.querySelector('meta[name="csrf-token"]');
//     return meta?.getAttribute('content') || '';
//   };

//   const isDark = theme === 'dark';

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
//             Join Zynctra
//           </h1>
//           <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
//             Create your account to get started
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
//         <form onSubmit={handleSubmit} className={`p-8 rounded-lg border ${
//           isDark
//             ? 'bg-slate-900 border-slate-800'
//             : 'bg-white border-slate-200 shadow-lg'
//         }`}>
//           {/* Email */}
//           <div className="mb-6">
//             <label htmlFor="email" className="block text-sm font-semibold mb-2">
//               Email Address
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               placeholder="you@example.com"
//               className={`w-full px-4 py-3 rounded-lg border transition ${
//                 errors.email && touched.email
//                   ? isDark
//                     ? 'border-red-500 bg-red-500/10'
//                     : 'border-red-500 bg-red-50'
//                   : isDark
//                     ? 'border-slate-700 bg-slate-800'
//                     : 'border-slate-300 bg-slate-50'
//               }`}
//             />
//             {errors.email && touched.email && (
//               <p className="text-red-500 text-xs mt-2">{errors.email}</p>
//             )}
//           </div>

//           {/* Full Name */}
//           <div className="mb-6">
//             <label htmlFor="fullName" className="block text-sm font-semibold mb-2">
//               Full Name
//             </label>
//             <input
//               type="text"
//               id="fullName"
//               name="fullName"
//               value={formData.fullName}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               placeholder="John Doe"
//               className={`w-full px-4 py-3 rounded-lg border transition ${
//                 errors.fullName && touched.fullName
//                   ? isDark
//                     ? 'border-red-500 bg-red-500/10'
//                     : 'border-red-500 bg-red-50'
//                   : isDark
//                     ? 'border-slate-700 bg-slate-800'
//                     : 'border-slate-300 bg-slate-50'
//               }`}
//             />
//             {errors.fullName && touched.fullName && (
//               <p className="text-red-500 text-xs mt-2">{errors.fullName}</p>
//             )}
//           </div>

//           {/* Password */}
//           <div className="mb-6">
//             <label htmlFor="password" className="block text-sm font-semibold mb-2">
//               Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 id="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 placeholder="••••••••••••"
//                 className={`w-full px-4 py-3 rounded-lg border transition ${
//                   errors.password && touched.password
//                     ? isDark
//                       ? 'border-red-500 bg-red-500/10'
//                       : 'border-red-500 bg-red-50'
//                     : isDark
//                       ? 'border-slate-700 bg-slate-800'
//                       : 'border-slate-300 bg-slate-50'
//                 }`}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-sm ${
//                   isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-900'
//                 }`}
//               >
//                 {showPassword ? '👁️' : '👁️‍🗨️'}
//               </button>
//             </div>
//             {errors.password && touched.password && (
//               <p className="text-red-500 text-xs mt-2">{errors.password}</p>
//             )}
//           </div>

//           {/* Confirm Password */}
//           <div className="mb-6">
//             <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2">
//               Confirm Password
//             </label>
//             <input
//               type={showPassword ? 'text' : 'password'}
//               id="confirmPassword"
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               placeholder="••••••••••••"
//               className={`w-full px-4 py-3 rounded-lg border transition ${
//                 errors.confirmPassword && touched.confirmPassword
//                   ? isDark
//                     ? 'border-red-500 bg-red-500/10'
//                     : 'border-red-500 bg-red-50'
//                   : isDark
//                     ? 'border-slate-700 bg-slate-800'
//                     : 'border-slate-300 bg-slate-50'
//               }`}
//             />
//             {errors.confirmPassword && touched.confirmPassword && (
//               <p className="text-red-500 text-xs mt-2">{errors.confirmPassword}</p>
//             )}
//           </div>

//           {/* Terms */}
//           <div className="mb-6 flex items-start gap-3">
//             <input
//               type="checkbox"
//               id="agreeToTerms"
//               name="agreeToTerms"
//               checked={formData.agreeToTerms}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               className={`w-5 h-5 rounded border mt-1 cursor-pointer ${
//                 isDark ? 'border-slate-600' : 'border-slate-300'
//               }`}
//             />
//             <label htmlFor="agreeToTerms" className={`text-sm leading-relaxed cursor-pointer ${
//               isDark ? 'text-slate-300' : 'text-slate-700'
//             }`}>
//               I agree to the{' '}
//               <a href="/terms" className="text-cyan-400 hover:text-cyan-300">
//                 Terms of Service
//               </a>{' '}
//               and{' '}
//               <a href="/privacy" className="text-cyan-400 hover:text-cyan-300">
//                 Privacy Policy
//               </a>
//             </label>
//           </div>
//           {errors.agreeToTerms && touched.agreeToTerms && (
//             <p className="text-red-500 text-xs mb-6">{errors.agreeToTerms}</p>
//           )}

//           {/* Submit Error */}
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

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={isLoading}
//             className={`w-full py-3 px-6 rounded-lg font-semibold transition mb-4 ${
//               isLoading
//                 ? 'opacity-50 cursor-not-allowed'
//                 : 'bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-900 hover:shadow-lg hover:shadow-cyan-500/50'
//             }`}
//           >
//             {isLoading ? 'Creating Account...' : 'Create Account'}
//           </button>

//           {/* Sign In Link */}
//           <p className={`text-center text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
//             Already have an account?{' '}
//             <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold">
//               Sign in
//             </Link>
//           </p>
//         </form>

//         {/* Password Requirements Info */}
//         <motion.div
//           className={`mt-8 p-6 rounded-lg border ${
//             isDark
//               ? 'bg-slate-800/50 border-slate-700'
//               : 'bg-slate-100 border-slate-300'
//           }`}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.3 }}
//         >
//           <h3 className="font-semibold mb-3 text-sm">Password Requirements</h3>
//           <ul className={`space-y-2 text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
//             <li>✓ Minimum 12 characters</li>
//             <li>✓ At least one uppercase letter</li>
//             <li>✓ At least one lowercase letter</li>
//             <li>✓ At least one number</li>
//             <li>✓ At least one special character (!@#$%^&*)</li>
//             <li>✓ Not a common password</li>
//           </ul>
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// };

// export default RegisterPage;










/**
 * /frontend/src/pages/RegisterPage.tsx
 *
 * User registration with strict validation.
 * Fixed: removed process.env; uses import.meta.env via apiClient indirectly.
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { getCsrfToken } from '../context/AuthContext';

interface FormData {
  email: string;
  fullName: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

type FieldErrors = Partial<Record<keyof FormData | 'submit', string>>;

const API_BASE =
  (import.meta.env['VITE_API_URL'] as string | undefined) ?? '';

const PASSWORD_RULES = [
  { test: (p: string) => p.length >= 12, label: 'At least 12 characters' },
  { test: (p: string) => /[A-Z]/.test(p), label: 'At least one uppercase letter' },
  { test: (p: string) => /[a-z]/.test(p), label: 'At least one lowercase letter' },
  { test: (p: string) => /[0-9]/.test(p), label: 'At least one number' },
  { test: (p: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p), label: 'At least one special character' },
];

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  const [formData, setFormData] = useState<FormData>({
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const inputClass = (field: keyof FormData) =>
    `w-full px-4 py-3 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
      errors[field] && touched[field]
        ? isDark ? 'border-red-500 bg-red-500/10 text-white' : 'border-red-500 bg-red-50'
        : isDark ? 'border-slate-700 bg-slate-800 text-white placeholder-slate-500' : 'border-slate-300 bg-slate-50 placeholder-slate-400'
    }`;

  const validateField = (name: keyof FormData, value: string | boolean): string => {
    switch (name) {
      case 'email': {
        const v = value as string;
        if (!v) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Invalid email format';
        if (v.length > 254) return 'Email is too long';
        return '';
      }
      case 'fullName': {
        const v = value as string;
        if (!v) return 'Full name is required';
        if (v.trim().length < 2) return 'Name must be at least 2 characters';
        if (v.length > 100) return 'Name is too long';
        if (!/^[a-zA-Z\s'-]+$/.test(v)) return 'Name contains invalid characters';
        return '';
      }
      case 'password': {
        const v = value as string;
        if (!v) return 'Password is required';
        const failing = PASSWORD_RULES.filter((r) => !r.test(v));
        if (failing.length > 0) return `Password must have: ${failing.map((r) => r.label).join(', ')}`;
        return '';
      }
      case 'confirmPassword': {
        const v = value as string;
        if (!v) return 'Please confirm your password';
        if (v !== formData.password) return 'Passwords do not match';
        return '';
      }
      case 'agreeToTerms':
        return !(value as boolean) ? 'You must agree to the terms and conditions' : '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    if (touched[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name as keyof FormData, newValue) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name as keyof FormData, value) }));
  };

  const validateAll = (): boolean => {
    const newErrors: FieldErrors = {};
    (Object.keys(formData) as (keyof FormData)[]).forEach((k) => {
      const err = validateField(k, formData[k] as string | boolean);
      if (err) newErrors[k] = err;
    });
    setErrors(newErrors);
    setTouched({ email: true, fullName: true, password: true, confirmPassword: true, agreeToTerms: true });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': getCsrfToken() },
        body: JSON.stringify({
          email: formData.email,
          fullName: formData.fullName,
          password: formData.password,
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { message?: string };
        throw new Error(data.message ?? 'Registration failed');
      }

      setSuccessMessage('✓ Registration successful! Check your email to verify your account.');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Registration failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = PASSWORD_RULES.filter((r) => r.test(formData.password)).length;
  const strengthColor = ['bg-red-500', 'bg-red-400', 'bg-yellow-400', 'bg-cyan-400', 'bg-green-500'][passwordStrength - 1] ?? 'bg-slate-600';

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-12 ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
      <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 text-white font-bold text-xl mb-4">Z</div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">Join Zynctra</h1>
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Create your account to get started</p>
        </div>

        {/* Success */}
        <AnimatePresence>
          {successMessage && (
            <motion.div className={`mb-5 p-4 rounded-lg border text-sm ${isDark ? 'bg-green-500/20 border-green-500/50 text-green-300' : 'bg-green-50 border-green-300 text-green-800'}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className={`p-8 rounded-xl border space-y-5 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-lg'}`}>
          {/* Submit error */}
          {errors.submit && (
            <motion.div className={`p-4 rounded-lg border text-sm ${isDark ? 'bg-red-500/20 border-red-500/50 text-red-300' : 'bg-red-50 border-red-300 text-red-700'}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} role="alert">
              {errors.submit}
            </motion.div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Email Address</label>
            <input id="email" name="email" type="email" autoComplete="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} placeholder="you@example.com" className={inputClass('email')} disabled={isLoading} />
            {errors.email && touched.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Full name */}
          <div>
            <label htmlFor="fullName" className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Full Name</label>
            <input id="fullName" name="fullName" type="text" autoComplete="name" value={formData.fullName} onChange={handleChange} onBlur={handleBlur} placeholder="John Doe" className={inputClass('fullName')} disabled={isLoading} />
            {errors.fullName && touched.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Password</label>
            <div className="relative">
              <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={formData.password} onChange={handleChange} onBlur={handleBlur} placeholder="••••••••••••" className={`${inputClass('password')} pr-12`} disabled={isLoading} />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} tabIndex={-1}>
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {/* Strength bar */}
            {formData.password && (
              <div className="mt-2 flex gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < passwordStrength ? strengthColor : isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                ))}
              </div>
            )}
            {errors.password && touched.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Confirm password */}
          <div>
            <label htmlFor="confirmPassword" className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Confirm Password</label>
            <input id="confirmPassword" name="confirmPassword" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={formData.confirmPassword} onChange={handleChange} onBlur={handleBlur} placeholder="••••••••••••" className={inputClass('confirmPassword')} disabled={isLoading} />
            {errors.confirmPassword && touched.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3">
            <input id="agreeToTerms" name="agreeToTerms" type="checkbox" checked={formData.agreeToTerms} onChange={handleChange} onBlur={handleBlur} className="mt-1 w-4 h-4 rounded accent-cyan-500" disabled={isLoading} />
            <label htmlFor="agreeToTerms" className={`text-sm cursor-pointer ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              I agree to the{' '}
              <Link to="/terms" className="text-cyan-400 hover:text-cyan-300">Terms of Service</Link>{' '}and{' '}
              <Link to="/privacy" className="text-cyan-400 hover:text-cyan-300">Privacy Policy</Link>
            </label>
          </div>
          {errors.agreeToTerms && touched.agreeToTerms && <p className="text-red-400 text-xs -mt-3">{errors.agreeToTerms}</p>}

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 rounded-lg font-semibold bg-gradient-to-r from-cyan-400 to-cyan-600 text-slate-900 hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            whileHover={!isLoading ? { scale: 1.02 } : undefined}
            whileTap={!isLoading ? { scale: 0.98 } : undefined}
          >
            {isLoading ? 'Creating Account…' : 'Create Account'}
          </motion.button>

          <p className={`text-center text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold">Sign in</Link>
          </p>
        </form>

        {/* Password requirements */}
        <motion.div className={`mt-6 p-5 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-100 border-slate-300'}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <p className="text-sm font-semibold mb-3">Password Requirements</p>
          <ul className="space-y-1">
            {PASSWORD_RULES.map((rule, idx) => {
              const passed = formData.password ? rule.test(formData.password) : false;
              return (
                <li key={idx} className={`text-xs flex items-center gap-2 ${passed ? 'text-green-400' : isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <span>{passed ? '✓' : '○'}</span>
                  {rule.label}
                </li>
              );
            })}
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;