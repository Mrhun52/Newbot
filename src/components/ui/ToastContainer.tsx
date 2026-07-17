import { useToast } from '@/store/useToast';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full sm:w-96 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-xl ${
              toast.type === 'success' ? 'bg-emerald-950/80 border-emerald-800/50 text-emerald-100' :
              toast.type === 'error' ? 'bg-red-950/80 border-red-800/50 text-red-100' :
              toast.type === 'warning' ? 'bg-amber-950/80 border-amber-800/50 text-amber-100' :
              'bg-blue-950/80 border-blue-800/50 text-blue-100'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
              {toast.type === 'error' && <XCircle className="w-5 h-5 text-red-400" />}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {(!toast.type || toast.type === 'info') && <Info className="w-5 h-5 text-blue-400" />}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm">{toast.title}</h4>
              {toast.description && <p className="text-sm opacity-80 mt-1">{toast.description}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 opacity-50 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
