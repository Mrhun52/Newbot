import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/store/useAuth';
import { userApi } from '@/services/api';
import { Coins, Wallet, Trophy, User, ArrowUpRight, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await userApi.getProfile();
        if ((data.success || data.stasus === true || data.status === true) && data.record) {
          updateUser({
            name: data.record.Name,
            money: data.record.money,
            coins: data.record.coin,
          });
        }
      } catch (error) {
        // Silently fail if api not ready
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const stats = [
    { label: 'Total Money', value: `$${user?.money?.toLocaleString() || '0'}`, icon: Wallet, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Game Coins', value: user?.coins?.toLocaleString() || '0', icon: Coins, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { label: 'Account Level', value: '42', icon: Trophy, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Active Status', value: 'Online', icon: Activity, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ];

  const quickLinks = [
    { title: 'Money Management', desc: 'Add or remove funds', href: '/money', color: 'from-emerald-600/20 to-emerald-900/20' },
    { title: 'Cars & Vehicles', desc: 'Unlock new vehicles', href: '/cars', color: 'from-blue-600/20 to-blue-900/20' },
    { title: 'Unlock Features', desc: 'Clothes, items & more', href: '/unlock', color: 'from-purple-600/20 to-purple-900/20' },
    { title: 'Account Tools', desc: 'Settings & preferences', href: '/account', color: 'from-amber-600/20 to-amber-900/20' },
  ];

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name || 'Player'}</h1>
        <p className="text-slate-400">Here's what's happening with your account today.</p>
      </header>

      <Card className="flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-r from-blue-900/20 to-slate-900/50">
        <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-blue-500/50 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
          <User className="w-10 h-10 text-slate-400" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-2xl font-bold text-white">{user?.name || 'Admin User'}</h2>
          <p className="text-slate-400 mb-2">{user?.email || 'admin@gamedash.com'}</p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Account Active
          </div>
        </div>
        <div className="shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
          <Link to="/account" className="flex items-center justify-center w-full px-6 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-medium transition-colors border border-slate-700">
            Edit Profile
          </Link>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="p-5 hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} shadow-inner`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                {isLoading ? (
                  <div className="h-8 w-24 bg-slate-800 rounded animate-pulse mt-1"></div>
                ) : (
                  <h3 className="text-2xl font-bold text-white mt-0.5">{stat.value}</h3>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="pt-4">
        <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickLinks.map((link, i) => (
            <Link key={i} to={link.href}>
              <Card className={`h-full hover:scale-[1.02] transition-transform duration-300 bg-gradient-to-br ${link.color} border-white/5`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">{link.title}</h4>
                    <p className="text-sm text-slate-300">{link.desc}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center backdrop-blur-md">
                    <ArrowUpRight className="w-5 h-5 text-white" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
