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
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { addToast } = useToast();

  const from = location.state?.from?.pathname || '/dashboard';

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
      const errorMessage = error.response?.data?.message || error.message || 'Invalid credentials';
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
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Static Premium Background - High Performance */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <ParticleBackground />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60rem] h-[60rem] opacity-30" style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, rgba(2,6,23,0) 70%)' }} />
        <div className="absolute bottom-0 right-0 w-[50rem] h-[50rem] opacity-20" style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.15) 0%, rgba(2,6,23,0) 70%)' }} />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md z-10"
      >
        <Card className="p-10 bg-slate-900/60 backdrop-blur-3xl border-white/10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
          <div className="flex flex-col items-center mb-10">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
              className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(37,99,235,0.4)] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 blur-md"></div>
              <span className="text-white font-bold text-3xl font-display relative z-10">M</span>
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2 font-display tracking-tight">MR TOOL</h1>
            <p className="text-slate-400 text-sm">Sign in to manage your game account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <Input
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 bg-slate-900/50 border-slate-800 focus:border-blue-500/50 focus:ring-blue-500/20 py-2.5 text-base hover:bg-slate-900/80 transition-colors"
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-1.5 ml-1 mr-1">
                <label className="block text-sm font-medium text-slate-300">Password</label>
                <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 bg-slate-900/50 border-slate-800 focus:border-blue-500/50 focus:ring-blue-500/20 py-2.5 text-base hover:bg-slate-900/80 transition-colors"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-between text-sm py-2"
            >
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500/50" />
                <span className="text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
              </label>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="pt-2"
            >
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border-none shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] h-12 text-base group" isLoading={isLoading}>
                Sign In <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};
