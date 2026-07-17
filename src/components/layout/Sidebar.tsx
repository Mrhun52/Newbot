import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { Home, Wallet, Car, Unlock, Settings, History, LogOut } from 'lucide-react';
import { useAuth } from '@/store/useAuth';

export const NAV_ITEMS = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: Wallet, label: 'Money', href: '/money' },
  { icon: Car, label: 'Cars', href: '/cars' },
  { icon: Unlock, label: 'Unlock', href: '/unlock' },
  { icon: Settings, label: 'Account', href: '/account' },
  { icon: History, label: 'History', href: '/history' },
];

export const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-slate-950/80 backdrop-blur-xl border-r border-slate-800/50 p-4 fixed left-0 top-0 z-40">
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
          <span className="text-white font-bold text-xl font-display">M</span>
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight font-display">
          MR TOOL
        </h1>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link key={item.href} to={item.href} className="relative">
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-blue-600/10 border border-blue-500/20 rounded-xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div className={cn(
                "relative flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                isActive ? "text-blue-400" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              )}>
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};
