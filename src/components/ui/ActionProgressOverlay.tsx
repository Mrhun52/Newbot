import { useProgress } from '@/store/useProgress';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';

export const ActionProgressOverlay = () => {
  const { isOpen, title, subtitle, progress, statusText } = useProgress();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden relative"
          >
            {/* Background glowing orb */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-display tracking-tight">{title}</h3>
                  <p className="text-sm text-slate-400">{subtitle}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-medium text-blue-400 animate-pulse">{statusText}</span>
                  <span className="text-xl font-bold text-white font-mono">{progress}%</span>
                </div>
                
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full relative"
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white/20 to-transparent animate-pulse" />
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
