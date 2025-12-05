'use client';

import { useState, useEffect, useCallback } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { auth } from '../lib/firebase';
import { ShieldCheck, Lock, Mail, AlertCircle, Loader2, Eye, EyeOff, Bot } from 'lucide-react';
import Image from 'next/image';

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 menit
const RECAPTCHA_THRESHOLD = 0.5; // Minimum score untuk dianggap valid

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [lockedUntil, setLockedUntil] = useState(null);
    const [remainingTime, setRemainingTime] = useState(0);
    const [captchaVerified, setCaptchaVerified] = useState(false);

    const { executeRecaptcha } = useGoogleReCaptcha();

    // Check lockout dari localStorage saat mount
    useEffect(() => {
        const storedLockout = localStorage.getItem('adminLockout');
        const storedAttempts = localStorage.getItem('adminAttempts');
        
        if (storedLockout) {
            const lockTime = parseInt(storedLockout);
            if (Date.now() < lockTime) {
                setLockedUntil(lockTime);
            } else {
                localStorage.removeItem('adminLockout');
                localStorage.removeItem('adminAttempts');
            }
        }
        
        if (storedAttempts) {
            setAttempts(parseInt(storedAttempts));
        }
    }, []);

    // Countdown timer untuk lockout
    useEffect(() => {
        if (!lockedUntil) return;
        
        const interval = setInterval(() => {
            const remaining = Math.max(0, lockedUntil - Date.now());
            setRemainingTime(remaining);
            
            if (remaining === 0) {
                setLockedUntil(null);
                setAttempts(0);
                localStorage.removeItem('adminLockout');
                localStorage.removeItem('adminAttempts');
            }
        }, 1000);
        
        return () => clearInterval(interval);
    }, [lockedUntil]);

    const formatTime = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Verify reCAPTCHA
    const verifyCaptcha = useCallback(async () => {
        if (!executeRecaptcha) {
            return null;
        }

        try {
            const token = await executeRecaptcha('login');
            
            // Verify token dengan API route
            const response = await fetch('/api/verify-captcha', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });

            const data = await response.json();
            
            if (data.success && data.score >= RECAPTCHA_THRESHOLD) {
                setCaptchaVerified(true);
                return true;
            } else {
                setCaptchaVerified(false);
                return false;
            }
        } catch (err) {
            console.error('reCAPTCHA verification failed:', err);
            return false;
        }
    }, [executeRecaptcha]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Cek apakah sedang terkunci
        if (lockedUntil && Date.now() < lockedUntil) {
            setError(`Terlalu banyak percobaan. Coba lagi dalam ${formatTime(remainingTime)}`);
            return;
        }

        // Validasi input
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Format email tidak valid.');
            return;
        }

        if (password.length < 6) {
            setError('Password minimal 6 karakter.');
            return;
        }

        setError('');
        setIsSubmitting(true);

        try {
            // Verify reCAPTCHA first
            const captchaValid = await verifyCaptcha();
            if (captchaValid === false) {
                setError('Verifikasi CAPTCHA gagal. Silakan coba lagi.');
                setIsSubmitting(false);
                return;
            }

            await signInWithEmailAndPassword(auth, email, password);
            // Reset attempts on success
            setAttempts(0);
            localStorage.removeItem('adminAttempts');
            localStorage.removeItem('adminLockout');
        } catch (err) {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            localStorage.setItem('adminAttempts', newAttempts.toString());

            if (newAttempts >= MAX_ATTEMPTS) {
                const lockTime = Date.now() + LOCKOUT_DURATION;
                setLockedUntil(lockTime);
                localStorage.setItem('adminLockout', lockTime.toString());
                setError(`Akun terkunci selama 5 menit karena terlalu banyak percobaan gagal.`);
            } else {
                const remaining = MAX_ATTEMPTS - newAttempts;
                setError(`Login gagal. ${remaining} percobaan tersisa.`);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const isLocked = lockedUntil && Date.now() < lockedUntil;

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 pointer-events-none bg-slate-50">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e40af05_1px,transparent_1px),linear-gradient(to_bottom,#1e40af05_1px,transparent_1px)] bg-[size:32px_32px]"></div>
                <div className="absolute top-[-20%] right-[-20%] w-[800px] h-[800px] bg-white rounded-full blur-[150px] opacity-70"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center mb-4">
                        <Image
                            src="/logometa.svg"
                            alt="Valpro Intertech Logo"
                            width={48}
                            height={48}
                            priority
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Valpro<span className="bg-gradient-to-r from-[#1e40af] to-[#3b82f6] bg-clip-text text-transparent">Intertech</span>
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Admin Panel</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
                    {/* Security Badge */}
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <div className="px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-full flex items-center gap-2">
                            <ShieldCheck size={14} className="text-[#1e40af]" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                Akses Terbatas
                            </span>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-slate-800 text-center mb-6">
                        Masuk ke Dashboard
                    </h2>

                    {/* Error Alert */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                            <AlertCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Lockout Warning */}
                    {isLocked && (
                        <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-xl text-center">
                            <Lock size={24} className="text-amber-500 mx-auto mb-2" />
                            <p className="text-sm font-semibold text-amber-700">Akun Terkunci</p>
                            <p className="text-2xl font-bold text-amber-600 mt-1">{formatTime(remainingTime)}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Input */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email"
                                    placeholder="admin@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLocked}
                                    autoComplete="email"
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLocked}
                                    autoComplete="current-password"
                                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting || isLocked}
                            className="w-full py-4 bg-gradient-to-r from-[#1e40af] to-[#3b82f6] text-white font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    <Lock size={18} />
                                    Masuk
                                </>
                            )}
                        </button>
                    </form>

                    {/* Security Info */}
                    <div className="mt-6 pt-6 border-t border-slate-100">
                        <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 uppercase tracking-wider flex-wrap">
                            <span className="flex items-center gap-1">
                                <Lock size={10} /> SSL Encrypted
                            </span>
                            <span className="flex items-center gap-1">
                                <ShieldCheck size={10} /> Rate Limited
                            </span>
                            <span className="flex items-center gap-1">
                                <Bot size={10} /> reCAPTCHA Protected
                            </span>
                        </div>
                        <p className="text-center text-[9px] text-slate-300 mt-3">
                            Protected by Google reCAPTCHA v3
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-slate-400 mt-6">
                    &copy; {new Date().getFullYear()} Valpro Intertech. Internal Use Only.
                </p>
            </div>
        </div>
    );
};

export default LoginForm;
