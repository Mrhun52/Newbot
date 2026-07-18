import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/store/useAuth';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, LogOut } from 'lucide-react';
import { Button } from './Button';

export const SessionMonitor = () => {
  const { user, logout } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes
  const WARNING_DURATION = 60 * 1000; // 60 seconds

  let activityTimeout: NodeJS.Timeout;
  let countdownInterval: NodeJS.Timeout;

  const resetTimer = useCallback(() => {
    if (showWarning) return;
    
    clearTimeout(activityTimeout);
    
    activityTimeout = setTimeout(() => {
      setShowWarning(true);
      setTimeLeft(WARNING_DURATION / 1000);
    }, INACTIVITY_TIMEOUT - WARNING_DURATION);
  }, [showWarning]);

  useEffect(() => {
    if (!user) return;

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => document.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      events.forEach(event => document.removeEventListener(event, resetTimer));
      clearTimeout(activityTimeout);
      clearInterval(countdownInterval);
    };
  }, [user, resetTimer]);

  useEffect(() => {
    if (showWarning && timeLeft > 0) {
      countdownInterval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            logout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(countdownInterval);
  }, [showWarning, timeLeft, logout]);

  const stayLoggedIn = () => {
    setShowWarning(false);
    resetTimer();
  };

  if (!user) return null;

  return (
    <AnimatePresence>
      {showWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-amber-500/50" />
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-amber-500 animate-pulse" />
              </div>
              
              <h2 className="text-xl font-bold text-white font-display mb-2">Session Expiring Soon</h2>
              <p className="text-slate-400 mb-6">
                You've been inactive for a while. For your security, you will be automatically logged out in <strong className="text-white">{timeLeft} seconds</strong>.
              </p>
              
              <div className="flex w-full gap-3">
                <Button variant="secondary" className="flex-1" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" /> Logout Now
                </Button>
                <Button variant="primary" className="flex-1 bg-blue-600 hover:bg-blue-500" onClick={stayLoggedIn}>
                  Stay Logged In
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
