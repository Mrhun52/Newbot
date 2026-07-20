import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { LogOut, Search, Bell } from 'lucide-react';
import { useAuth } from '@/store/useAuth';
import { ParticleBackground } from '@/components/ui/ParticleBackground';

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-[#020617] text-neutral-50 selection:bg-blue-500/30">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <ParticleBackground />
        <div className="absolute top-0 left-0 w-[50rem] h-[50rem] opacity-20" style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, rgba(2,6,23,0) 70%)', transform: 'translate(-30%, -30%)' }} />
        <div className="absolute bottom-0 right-0 w-[50rem] h-[50rem] opacity-20" style={{ background: 'radial-gradient(circle, rgba(147,51,234,0.15) 0%, rgba(2,6,23,0) 70%)', transform: 'translate(20%, 20%)' }} />
      </div>

      <Sidebar />
      
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-neutral-900/60 backdrop-blur-sm border-b border-white/5 flex items-center justify-between px-4 py-4">
        <div className="w-8" />
        <h1 className="text-lg md:text-xl font-bold text-white tracking-[0.2em] md:tracking-[0.3em] font-display absolute left-1/2 -translate-x-1/2">
          M R &nbsp;T O O L
        </h1>
        <button
          onClick={logout}
          className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <main className="lg:pl-[18rem] min-h-screen relative z-10 pb-20 lg:pb-0 flex flex-col">
        {/* Desktop Header with Search */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 mx-4 mt-4 bg-neutral-900/40 backdrop-blur-sm border border-white/5 rounded-3xl sticky top-0 z-30 shadow-2xl">
           <div className="relative w-96 group">
             <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-blue-400 transition-colors" />
             <input 
               type="text" 
               placeholder="Search accounts, history, settings..." 
               className="w-full bg-white/5 border border-white/10 hover:bg-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all shadow-inner hover:bg-neutral-900/80"
             />
           </div>
           <div className="flex items-center gap-6">
             <button className="relative p-2 text-neutral-400 hover:text-white transition-colors group">
               <Bell className="w-5 h-5" />
               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#020617]"></span>
             </button>
             <div className="flex items-center gap-3 pl-6 border-l border-white/5">
               <div className="text-right">
                 <p className="text-sm font-medium text-white">{user?.name || 'Admin'}</p>
                 <p className="text-xs text-neutral-500">{user?.email || 'admin@mrtool.com'}</p>
               </div>
               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-blue-500/20 border border-white/10">
                 {user?.name?.charAt(0) || 'M'}
               </div>
             </div>
           </div>
        </header>

        <div className="flex-1">
          <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
              {children}
            </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};
