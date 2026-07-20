import { Link, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from './Sidebar';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

export const BottomNav = () => {
  const location = useLocation();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0A0A0A]/90 backdrop-blur-sm border-t border-neutral-800 px-2 py-2 pb-safe z-40">
      <nav className="flex items-center justify-around h-14">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link key={item.href} to={item.href} className="relative flex-1 flex flex-col items-center justify-center h-full">
              {isActive && (
                <div className="absolute inset-0 bg-white/10 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" />
              )}
              <div className={cn(
                "relative z-10 flex flex-col items-center gap-1 mt-1",
                isActive ? "text-white " : "text-neutral-400"
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
