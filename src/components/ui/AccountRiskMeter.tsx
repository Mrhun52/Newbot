import { useRisk } from '@/store/useRisk';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './Card';

export const AccountRiskMeter = () => {
  const { level, score, message } = useRisk();

  const getStyles = () => {
    switch (level) {
      case 'high':
        return {
          color: 'text-rose-500',
          bg: 'bg-rose-500',
          border: 'border-rose-500/50',
          glow: 'shadow-none',
          icon: <ShieldAlert className="w-6 h-6 text-rose-500" />
        };
      case 'medium':
        return {
          color: 'text-amber-500',
          bg: 'bg-amber-500',
          border: 'border-amber-500/50',
          glow: 'shadow-none',
          icon: <Shield className="w-6 h-6 text-amber-500" />
        };
      default:
        return {
          color: 'text-emerald-500',
          bg: 'bg-emerald-500',
          border: 'border-emerald-500/30',
          glow: 'shadow-none',
          icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />
        };
    }
  };

  const styles = getStyles();

  return (
    <Card className={`p-4 border ${styles.border} transition-colors duration-500 relative overflow-hidden`}>
      {level === 'high' && (
        <div className="absolute inset-0 bg-rose-500/5 animate-pulse pointer-events-none" />
      )}
      <div className="flex items-center gap-4 relative z-10">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-[#000000] border border-neutral-800 ${styles.glow} transition-all duration-500`}>
          {styles.icon}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-end mb-1.5">
            <div>
              <h3 className="text-sm font-bold text-white font-display">Account Ban Risk</h3>
              <p className="text-xs text-neutral-400 mt-0.5">{message}</p>
            </div>
            <div className={`text-xl font-bold font-mono ${styles.color} transition-colors duration-500`}>
              {score}%
            </div>
          </div>
          <div className="h-2 w-full bg-neutral-900 rounded-full overflow-hidden shadow-inner border border-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className={`h-full rounded-full ${styles.bg} transition-colors duration-500`}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
