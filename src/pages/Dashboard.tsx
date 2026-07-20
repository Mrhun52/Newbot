import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/store/useAuth';
import { userApi, gameApi } from '@/services/api';
import { useProgress } from '@/store/useProgress';
import { useToast } from '@/store/useToast';
import { Button } from '@/components/ui/Button';
import { Coins, Wallet, Trophy, User, ArrowUpRight, Activity, Car } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useRisk } from '@/store/useRisk';

export const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const { setRisk, resetRisk } = useRisk();
  const { runWithProgress } = useProgress();
  const { addToast } = useToast();
  const [isMaxing, setIsMaxing] = useState(false);

  const handleMaxAccount = async () => {
    setIsMaxing(true);
    try {
      await runWithProgress(
        'Maxing Account',
        'Applying money, coins and unlocking all features...',
        async () => {
          await gameApi.setMoney(50000000);
          await gameApi.setCoins(500000);
          await gameApi.unlockMaleClothes();
          await gameApi.unlockFemaleClothes();
          await gameApi.unlockAllAnimations();
          await gameApi.unlockAllHorns();
          await gameApi.unlockAllSirens();
          await gameApi.unlockAllWheels();
          await gameApi.unlockPaidWheels();
          await gameApi.unlockDisableVehicleDamage();
          await gameApi.unlockW16();
          await gameApi.unlockSmokeEffect();
          await gameApi.unlockUnlimitedFuel();
          await gameApi.unlockAllCars();
          updateUser({ money: 50000000, coins: 500000 });
          addToast({ title: 'Success', description: 'Account maxed out successfully!', type: 'success' });
        },
        {
          durationMs: 6000,
          steps: [
            { progress: 20, text: 'Adding 50M Money & 500K Coins...' },
            { progress: 50, text: 'Unlocking all clothes and animations...' },
            { progress: 80, text: 'Unlocking all cars, engines, and perks...' },
            { progress: 95, text: 'Finalizing account sync...' }
          ]
        }
      );
    } catch (e: any) {
      addToast({ title: 'Error', description: e.message || 'Failed to max account', type: 'error' });
    } finally {
      setIsMaxing(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await userApi.getProfile();
        console.log('DEBUG [getProfile]:', data);
        if ((data.success || data.stasus === true || data.status === true) && data.record) {
          console.log('DEBUG [record keys]:', Object.keys(data.record));
          let carsCount = 0;
          
          if (data.record.carIDnStatus && Array.isArray(data.record.carIDnStatus.carStatus)) {
            // Count only cars that are actually owned (status > 0)
            carsCount = data.record.carIDnStatus.carStatus.filter((status: number) => status > 0).length;
          } else if (data.record.carIDnStatus && Array.isArray(data.record.carIDnStatus.carGeneratedIDs)) {
            // Fallback if status is missing but IDs exist
            carsCount = data.record.carIDnStatus.carGeneratedIDs.length;
          } else {
            // Fallback for other potential structures
            let carsData = data.record.cars || data.record.Cars || data.record.car || data.record.Car;
            if (!carsData) {
              const possibleKey = Object.keys(data.record).find(k => k.toLowerCase() === 'cars' || k.toLowerCase() === 'vehicles');
              if (possibleKey) carsData = data.record[possibleKey];
            }
            if (carsData) {
              try {
                if (typeof carsData === 'string') {
                  if (carsData.trim().startsWith('[')) {
                    const parsed = JSON.parse(carsData);
                    carsCount = Array.isArray(parsed) ? parsed.length : Object.keys(parsed).length;
                  } else if (carsData.trim().startsWith('{')) {
                    const parsed = JSON.parse(carsData);
                    carsCount = Object.keys(parsed).length;
                  } else if (carsData.includes(',')) {
                    carsCount = carsData.split(',').filter(Boolean).length;
                  } else if (!isNaN(Number(carsData))) {
                    carsCount = Number(carsData);
                  } else {
                    carsCount = 1;
                  }
                } else if (typeof carsData === 'object') {
                  carsCount = Array.isArray(carsData) ? carsData.length : Object.keys(carsData).length;
                } else if (typeof carsData === 'number') {
                  carsCount = carsData;
                }
              } catch (e) { console.error('Failed to parse cars fallback', e); }
            }
          }
          
          updateUser({
            name: data.record.Name,
            money: data.record.money,
            coins: data.record.coin,
            carsCount: carsCount,
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

  useEffect(() => {
    if (user) {
      let risk = 5;
      let message = 'Account is in good standing.';
      
      if (user.money && user.money >= 100000000) {
        risk = 90;
        message = 'CRITICAL: Very high bank balance detected. High risk of auto-ban.';
      } else if (user.money && user.money >= 50000000) {
        risk = 60;
        message = 'MODERATE: Large bank balance. Avoid drawing attention.';
      } else if (user.coins && user.coins >= 1000000) {
        risk = 70;
        message = 'HIGH: Large amount of premium coins detected.';
      }
      
      setRisk(risk, message);
    }
  }, [user?.money, user?.coins, setRisk]);

  const stats = [
    { label: 'Total Money', value: `${user?.money?.toLocaleString() || '0'}`, icon: Wallet, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Game Coins', value: user?.coins?.toLocaleString() || '0', icon: Coins, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { label: 'Owned Cars', value: user?.carsCount?.toString() || '0', icon: Car, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Active Status', value: 'Online', icon: Activity, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ];

  const quickLinks = [
    { title: 'Money Management', desc: 'Add or remove funds', href: '/money', color: 'hover:border-emerald-500/50 transition-colors' },
    { title: 'Cars & Vehicles', desc: 'Unlock new vehicles', href: '/cars', color: 'hover:border-blue-500/50 transition-colors' },
    { title: 'Unlock Features', desc: 'Clothes, items & more', href: '/unlock', color: 'hover:border-purple-500/50 transition-colors' },
    { title: 'Account Tools', desc: 'Settings & preferences', href: '/account', color: 'hover:border-amber-500/50 transition-colors' },
  ];

  return (
    <div className="space-y-6">
      <div>
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0F0F0F]/60 backdrop-blur-sm mb-8 group shadow-2xl">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(0,0,0,0) 70%)" }}></div>
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] rounded-full pointer-events-none translate-y-1/3 -translate-x-1/3" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(0,0,0,0) 70%)" }}></div>
        
        <div className="relative p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 z-10">
          <div className="relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-900 border-2 border-neutral-700/50 flex items-center justify-center shrink-0 shadow-xl z-10 relative">
              <span className="text-3xl sm:text-4xl font-bold text-white font-display">
                {user?.name?.charAt(0)?.toUpperCase() || 'P'}
              </span>
            </div>
            {/* Status indicator ring */}
            <div className="absolute -inset-1 border border-emerald-500/30 rounded-full animate-[spin_4s_linear_infinite]" style={{ willChange: "transform" }}></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 border-4 border-[#0a0a0a] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
          </div>
          
          <div className="flex-1 text-center md:text-left flex flex-col justify-center pt-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 w-fit mx-auto md:mx-0 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Account Active</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 font-display tracking-tight">
              Welcome back, {user?.name || 'Player'}
            </h1>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-1 mb-4">
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-sm font-medium w-fit">
                {user?.email || 'admin@mrtool.com'}
              </span>
            </div>
            <p className="text-neutral-400 text-sm max-w-lg mb-6">
              Manage your game account, unlock exclusive items, and track your progress.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <Button
                onClick={handleMaxAccount}
                isLoading={isMaxing}
                className="w-full sm:w-auto bg-white text-black hover:bg-neutral-200 border-none font-semibold shadow-[0_0_20px_rgba(255,255,255,0.1)] px-6"
              >
                🔥 Max Account
              </Button>
              <Link to="/account" className="flex items-center justify-center w-full sm:w-auto px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 rounded-xl text-sm font-medium transition-colors border border-neutral-800 text-white">
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
      </div>

      
      <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${stat.bg} shadow-inner shrink-0`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-neutral-400 truncate">{stat.label}</p>
                {isLoading ? (
                  <div className="h-8 w-24 bg-neutral-800 rounded animate-pulse mt-1"></div>
                ) : (
                  <h3 className="text-lg md:text-2xl font-bold text-white mt-0.5 truncate">{stat.value}</h3>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
      </div>
      <div>
      <div className="pt-4">
        <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {quickLinks.map((link, i) => (
            <Link key={i} to={link.href}>
              <Card className={`h-full ${link.color} group`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm md:text-lg font-bold text-white mb-1 leading-tight">{link.title}</h4>
                    <p className="text-xs text-neutral-500 line-clamp-2 md:line-clamp-none">{link.desc}</p>
                  </div>
                  <div className="hidden sm:flex w-10 h-10 rounded-full bg-neutral-800 items-center justify-center group-hover:bg-neutral-700 transition-colors">
                    <ArrowUpRight className="w-5 h-5 text-white" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};
