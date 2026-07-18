import { Link, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from './Sidebar';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

export const BottomNav = () => {
  const location = useLocation();

  return (
    <div className="lg:hidden fixed bottom-6 left-4 right-4 bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-3xl px-2 py-2 z-40 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
      <nav className="flex items-center justify-around h-14">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link key={item.href} to={item.href} className="relative flex-1 flex flex-col items-center justify-center h-full">
              {isActive && (
                <motion.div
                  layoutId="bottomnav-active"
                  className="absolute inset-0 bg-white/10 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div className={cn(
                "relative z-10 flex flex-col items-center gap-1 mt-1",
                isActive ? "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" : "text-slate-400"
              )}>
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
