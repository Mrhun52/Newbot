import { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/store/useAuth';
import { useToast } from '@/store/useToast';
import { authApi } from '@/services/api';
import { Gamepad2, Lock, Mail } from 'lucide-react';
import { motion } from 'motion/react';

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
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="p-8 backdrop-blur-2xl bg-slate-900/60 border-slate-800">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(37,99,235,0.5)]">
              <span className="text-white font-bold text-3xl font-display">M</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 font-display tracking-tight">MR TOOL</h1>
            <p className="text-slate-400 text-sm">Sign in to manage your game account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-12"
              />
            </div>

            <div className="flex items-center justify-between text-sm py-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500/50" />
                <span className="text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</a>
            </div>

            <Button type="submit" className="w-full h-12 text-lg mt-4" isLoading={isLoading}>
              Sign In
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};
