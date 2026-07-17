import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/store/useAuth';

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 selection:bg-blue-500/30">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <Sidebar />
      
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            <span className="text-white font-bold text-xl font-display">M</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight font-display">
            MR TOOL
          </h1>
        </div>
        <button
          onClick={logout}
          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <main className="lg:pl-64 min-h-screen relative z-10 pb-20 lg:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
};
