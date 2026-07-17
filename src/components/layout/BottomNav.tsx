import { Link, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from './Sidebar';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

export const BottomNav = () => {
  const location = useLocation();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/50 px-2 pb-safe z-40">
      <nav className="flex items-center justify-around h-16">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link key={item.href} to={item.href} className="relative flex-1 flex flex-col items-center justify-center h-full">
              {isActive && (
                <motion.div
                  layoutId="bottomnav-active"
                  className="absolute inset-0 bg-blue-600/10 border-t-2 border-blue-500"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div className={cn(
                "relative z-10 flex flex-col items-center gap-1 mt-1",
                isActive ? "text-blue-400" : "text-slate-400"
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
