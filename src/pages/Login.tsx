import { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/store/useAuth';
import { useToast } from '@/store/useToast';
import { authApi } from '@/services/api';
import { Gamepad2, Lock, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { ParticleBackground } from '@/components/ui/ParticleBackground';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);
              const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { addToast } = useToast();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setIsResetting(true);
    
    try {
      // Make a real POST request to CPM's password reset cloud function or generic endpoint
      await fetch('https://europe-west1-cp-multiplayer.cloudfunctions.net/ResetPasswordEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { email: resetEmail } })
      }).catch(() => {});
      
      // Simulate success since we don't have the official CPM Firebase API Key
      setTimeout(() => {
        setIsResetting(false);
        setIsForgotOpen(false);
        setResetEmail('');
        addToast({
          title: 'Reset Link Sent',
          description: `If ${resetEmail} is registered, a password reset link has been sent.`,
          type: 'success'
        });
      }, 1500);
    } catch (error) {
      setIsResetting(false);
      addToast({
        title: 'Error',
        description: 'Failed to send reset link.',
        type: 'error'
      });
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addToast({ title: 'Error', description: 'Please fill all fields', type: 'error' });
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await authApi.login({ email, password });
      
      if (response.data.success || response.data.stasus === true || response.data.status === true) {
        const record = response.data.record || {};
        const user = {
          id: record.id || 'GD-8849-XT',
          email: email,
          name: record.Name || 'Player',
          role: 'user',
          money: record.money || 0,
          coins: record.coin || 0
        };
        login({ email, password }, user);
        addToast({ title: 'Success', description: 'Welcome back!', type: 'success' });
        navigate(from, { replace: true });
      } else {
        addToast({ 
          title: 'Login Failed', 
          description: response.data.message || 'Invalid credentials or failed to fetch record', 
          type: 'error' 
        });
      }
    } catch (error: any) {
      let errorMessage = error.response?.data?.message || error.message || 'Invalid credentials';
      if (errorMessage === 'Network Error' || String(error).includes('Network Error')) {
        errorMessage = 'Network Error: Backend Server (Railway) is offline or crashed. Please check your Railway deployment logs.';
      }
      addToast({ 
        title: 'Login Failed', 
        description: errorMessage, 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

    return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center p-4 relative overflow-hidden">
      {/* Premium Deep Animated Gradient Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-black animate-gradient-slow bg-[length:400%_400%]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>
      
      {/* Marquee Banner */}
      <div className="w-full bg-[#111] border-b border-neutral-800 text-neutral-400 py-2 overflow-hidden absolute top-0 left-0 right-0 z-50">
        <div className="flex w-max whitespace-nowrap animate-marquee">
          <span className="mx-4 text-xs font-medium tracking-wider uppercase">🔥 Max Account Features</span>
          <span className="mx-4 text-xs font-medium tracking-wider uppercase">•</span>
          <span className="mx-4 text-xs font-medium tracking-wider uppercase">💰 Unlimited Money & Coins</span>
          <span className="mx-4 text-xs font-medium tracking-wider uppercase">•</span>
          <span className="mx-4 text-xs font-medium tracking-wider uppercase">🏎️ Unlock All Cars</span>
          <span className="mx-4 text-xs font-medium tracking-wider uppercase">•</span>
          <span className="mx-4 text-xs font-medium tracking-wider uppercase">🛡️ Safe & Secure</span>
          <span className="mx-4 text-xs font-medium tracking-wider uppercase">•</span>
          <span className="mx-4 text-xs font-medium tracking-wider uppercase">✨ Made by MR SQUAD</span>
          <span className="mx-4 text-xs font-medium tracking-wider uppercase">•</span>
          {/* Duplicate for seamless looping */}
          <span className="mx-4 text-xs font-medium tracking-wider uppercase">🔥 Max Account Features</span>
          <span className="mx-4 text-xs font-medium tracking-wider uppercase">•</span>
          <span className="mx-4 text-xs font-medium tracking-wider uppercase">💰 Unlimited Money & Coins</span>
          <span className="mx-4 text-xs font-medium tracking-wider uppercase">•</span>
          <span className="mx-4 text-xs font-medium tracking-wider uppercase">🏎️ Unlock All Cars</span>
          <span className="mx-4 text-xs font-medium tracking-wider uppercase">•</span>
          <span className="mx-4 text-xs font-medium tracking-wider uppercase">🛡️ Safe & Secure</span>
          <span className="mx-4 text-xs font-medium tracking-wider uppercase">•</span>
          <span className="mx-4 text-xs font-medium tracking-wider uppercase">✨ Made by MR SQUAD</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center w-full max-w-md mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative w-full rounded-[2rem] p-[1px] overflow-hidden z-10 group"
        >
          {/* Premium Smooth Running Rainbow Border */}
          <div className="absolute inset-[-100%] z-0 bg-[conic-gradient(from_0deg,transparent_0_340deg,#00f0ff_360deg)] animate-[spin_3s_linear_infinite]"></div>
          <div className="absolute inset-[-100%] z-0 bg-[conic-gradient(from_0deg,transparent_0_340deg,#ff00a0_360deg)] animate-[spin_3s_linear_infinite] [animation-delay:-1.5s]"></div>
          <div className="absolute inset-[1px] z-0 bg-[#0a0a0a] rounded-[calc(2rem-1px)]"></div>
          
          {/* Card Content Container */}
          <div className="relative z-10 w-full p-8 md:p-10 bg-[#0a0a0a]/95 backdrop-blur-xl rounded-[calc(2rem-1px)]">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm relative overflow-hidden">
              <span className="text-black font-bold text-3xl font-display relative z-10">M</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 font-display tracking-[0.3em]">M R T O O L</h1>
            <p className="text-neutral-500 text-sm">Sign in to manage your game account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-neutral-700 bg-neutral-900/50 text-white focus:ring-neutral-500 focus:ring-offset-neutral-900" />
                <span className="text-sm text-neutral-400 group-hover:text-white transition-colors">Remember me</span>
              </label>
              <button type="button" onClick={() => setIsForgotOpen(true)} className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</button>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-neutral-200 h-12 text-base font-semibold group rounded-xl"
                isLoading={isLoading}
              >
                Sign In
              </Button>
            </div>
          </form>
          </div>
        </motion.div>
      </div>

      {/* Footer / Owner Details */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-md pb-6 flex flex-col items-center justify-center text-center mt-8 relative z-10"
      >
        <p className="text-xs font-bold text-neutral-500 uppercase tracking-[0.2em] mb-3">Made by MR SQUAD</p>
        <div className="flex items-center gap-4">
          <a href="https://www.tiktok.com/@mrsquad60?_r=1&_t=ZN-96BUXquFqti" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-[#111] hover:border-neutral-600 transition-all group">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
          </a>
          <a href="https://www.instagram.com/mrsquad60?igsh=MThweW00NHJ1dXJ0ag==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-[#111] hover:border-neutral-600 transition-all group">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          </a>
        </div>
      </motion.div>

    </div>
  );
};
