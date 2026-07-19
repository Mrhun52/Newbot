import { useEffect } from 'react';
import { useProgress } from '@/store/useProgress';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ActionProgressOverlay = () => {
  const { isOpen, title, subtitle, progress, statusText } = useProgress();

  const isSuccess = progress === 100 && statusText === 'Success!';

  useEffect(() => {
    if (isSuccess) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#8b5cf6', '#10b981']
      });
    }
  }, [isSuccess]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md bg-[#0F0F0F] border border-neutral-800/50 rounded-2xl shadow-2xl p-6 overflow-hidden relative"
          >
            {/* Background glowing orb */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 blur-[50px] rounded-full pointer-events-none transition-colors duration-500 ${isSuccess ? 'bg-emerald-500/10' : 'bg-blue-500/10'}`} />

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-500 ${isSuccess ? 'bg-emerald-600/20 border border-emerald-500/30' : 'bg-blue-600/20 border border-blue-500/30'}`}>
                  {isSuccess ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 10 }}>
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    </motion.div>
                  ) : (
                    <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-display tracking-tight">{title}</h3>
                  <p className="text-sm text-neutral-400">{subtitle}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className={`text-sm font-medium animate-pulse ${isSuccess ? 'text-emerald-400' : 'text-blue-400'}`}>{statusText}</span>
                  <span className="text-xl font-bold text-white font-mono">{progress}%</span>
                </div>
                
                <div className="w-full h-3 bg-neutral-800 rounded-full overflow-hidden p-0.5">
                  <motion.div
                    className={`h-full rounded-full relative ${isSuccess ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-blue-600 to-indigo-500'}`}
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    {!isSuccess && (
                      <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white/20 to-transparent animate-pulse" />
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
