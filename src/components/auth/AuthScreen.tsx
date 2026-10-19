import React, { useState } from 'react';
import { ArrowRight, HeartPulse, ShieldCheck, Sparkles, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

type AuthMode = 'signin' | 'register';

export const AuthScreen: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => {
  const { loginUser, setUserProfile, showToast } = useApp();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [fullName, setFullName] = useState('');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedIdentifier = phoneOrEmail.trim();
    const trimmedPassword = password.trim();

    if (!trimmedIdentifier || !trimmedPassword) {
      setError('Enter your mobile number or email and password.');
      return;
    }

    if (mode === 'register') {
      const trimmedName = fullName.trim();
      const trimmedEmail = email.trim();
      if (!trimmedName || !trimmedEmail || !trimmedIdentifier) {
        setError('Complete all fields to create your account.');
        return;
      }

    }

    const success = loginUser(trimmedIdentifier, trimmedPassword);
    if (!success) {
      setError('Please enter a password with at least 4 characters.');
      return;
    }

    if (mode === 'register') {
      setUserProfile((profile) => ({
        ...profile,
        id: `usr-${Date.now()}`,
        name: fullName.trim(),
        phone: trimmedIdentifier,
        email: email.trim(),
      }));
    }

    setError(null);
    showToast(mode === 'register' ? 'Your account is ready' : 'Welcome back to SehatSetu');
    onDismiss();
  };

  const handleDemoLogin = () => {
    const success = loginUser('9876543210', 'demo123');
    if (!success) {
      setError('Demo login is unavailable right now.');
      return;
    }

    setError(null);
    showToast('Signed in as the demo patient');
    onDismiss();
  };

  const handleGoogleLogin = () => {
    showToast('Google sign-in is not configured in this demo.');
  };

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6">
      <div className="relative mx-auto grid min-h-full max-w-6xl items-center gap-6 py-8 md:grid-cols-2 md:gap-10">
        <button
          type="button"
          onClick={onDismiss}
          className="absolute right-0 top-0 z-10 rounded-full bg-white/90 p-2 text-slate-600 shadow-sm transition hover:bg-white hover:text-slate-900"
          aria-label="Close sign in"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="hidden rounded-[2rem] bg-gradient-to-br from-emerald-950 via-teal-900 to-emerald-800 p-8 text-white shadow-[0_25px_75px_rgba(13,58,48,0.35)] md:block md:p-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-xl font-black shadow-inner">S</div>
            <div>
              <div className="text-xl font-black tracking-tight">SehatSetu</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-emerald-100/80">Anywhere Healthcare</div>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-2 text-sm text-emerald-100">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            Secure, privacy-first care access
          </div>

          <h1 className="mt-6 text-4xl font-black leading-tight lg:text-5xl">
            Better care starts with a stronger connection.
          </h1>

          <p className="mt-4 max-w-md text-sm leading-7 text-emerald-50/90">
            Book trusted doctors, access digital prescriptions, manage appointments, and stay connected to the care journey that matters most.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
              <HeartPulse className="mb-2 h-5 w-5 text-emerald-300" />
              <div className="text-lg font-black">12k+</div>
              <div className="text-[10px] uppercase tracking-[0.15em] text-emerald-100/70">consultations</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
              <Sparkles className="mb-2 h-5 w-5 text-emerald-300" />
              <div className="text-lg font-black">4.9/5</div>
              <div className="text-[10px] uppercase tracking-[0.15em] text-emerald-100/70">patient rating</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
              <ShieldCheck className="mb-2 h-5 w-5 text-emerald-300" />
              <div className="text-lg font-black">24/7</div>
              <div className="text-[10px] uppercase tracking-[0.15em] text-emerald-100/70">care access</div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.12)] sm:p-8">
          <div className="mb-6">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
              {mode === 'signin' ? 'Welcome to SehatSetu' : 'Start your care journey'}
            </div>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
              {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {mode === 'signin'
                ? 'Access your appointments, prescriptions, and care team.'
                : 'Join SehatSetu to manage your healthcare in one place.'}
            </p>
          </div>

          <div className="mb-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1" role="tablist" aria-label="Account access">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'signin'}
              onClick={() => switchMode('signin')}
              className={`rounded-lg px-3 py-2.5 text-sm font-bold transition ${
                mode === 'signin' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'register'}
              onClick={() => switchMode('register')}
              className={`rounded-lg px-3 py-2.5 text-sm font-bold transition ${
                mode === 'register' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label htmlFor="auth-name" className="mb-2 block text-sm font-semibold text-slate-700">
                    Full name
                  </label>
                  <input
                    id="auth-name"
                    type="text"
                    autoComplete="name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Your full name"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>
                <div>
                  <label htmlFor="auth-register-email" className="mb-2 block text-sm font-semibold text-slate-700">
                    Email address
                  </label>
                  <input
                    id="auth-register-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="auth-identifier" className="mb-2 block text-sm font-semibold text-slate-700">
                {mode === 'register' ? 'Mobile number' : 'Mobile number or email'}
              </label>
              <input
                id="auth-identifier"
                type="text"
                autoComplete={mode === 'signin' ? 'username' : 'tel'}
                value={phoneOrEmail}
                onChange={(event) => setPhoneOrEmail(event.target.value)}
                placeholder={mode === 'register' ? '9876543210' : 'Enter your mobile number or email'}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            <div>
              <label htmlFor="auth-password" className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>
              <input
                id="auth-password"
                type="password"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={mode === 'register' ? 'Create a password' : 'Enter your password'}
                minLength={4}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            {error && (
              <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/30"
            >
              {mode === 'signin' ? 'Sign in' : 'Create account'}
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 py-1 text-xs font-medium uppercase tracking-wider text-slate-400">
              <span className="h-px flex-1 bg-slate-200" />
              or continue with
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-200"
            >
              <span aria-hidden="true" className="font-black text-base text-[#4285F4]">G</span>
              Continue with Google
            </button>
          </form>

          <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50/70 p-4">
            <div className="text-sm font-bold text-slate-900">Trying the demo?</div>
            <div className="mt-1 text-xs leading-5 text-slate-600">
              Phone: 9876543210 <span className="mx-1 text-slate-300">|</span> Password: demo123
            </div>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="mt-3 w-full rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-sm font-bold text-emerald-800 transition hover:bg-emerald-100"
            >
              Use demo patient account
            </button>
          </div>

          <p className="mt-4 text-center text-xs leading-5 text-slate-400">
            By continuing, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
};
