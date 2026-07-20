import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/store/useToast';
import { useProgress } from '@/store/useProgress';
import { useAuth } from '@/store/useAuth';
import { gameApi } from '@/services/api';
import { setKingRank } from '@/lib/firebaseUtils';
import { Shirt, Volume2, Shield, Settings, Droplet, Car, Activity, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export const Unlock = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [unlockingId, setUnlockingId] = useState<string | null>(null);
  const { addToast } = useToast();
  const { runWithProgress } = useProgress();
  const { user, credentials, updateUser } = useAuth();

  const unlockActions = [

    { 
      id: 'king_rank', 
      name: 'King Rank', 
      desc: 'Apply King Rank to your account with max stats', 
      icon: Activity, 
      api: () => setKingRank(credentials?.email || '', credentials?.password || ''), 
      category: 'perks' 
    },
    { id: 'male_clothes', name: 'Male Clothes', desc: 'Unlock all male clothing items', icon: Shirt, api: gameApi.unlockMaleClothes, category: 'character' },
    { id: 'female_clothes', name: 'Female Clothes', desc: 'Unlock all female clothing items', icon: Shirt, api: gameApi.unlockFemaleClothes, category: 'character' },
    { id: 'animations', name: 'All Animations', desc: 'Unlock all character animations', icon: Zap, api: gameApi.unlockAllAnimations, category: 'character' },
    
    { id: 'horns', name: 'All Horns', desc: 'Unlock all vehicle horns', icon: Volume2, api: gameApi.unlockAllHorns, category: 'vehicle' },
    { id: 'sirens', name: 'All Sirens', desc: 'Unlock all emergency sirens', icon: Volume2, api: gameApi.unlockAllSirens, category: 'vehicle' },
    { id: 'wheels', name: 'All Wheels', desc: 'Unlock all standard wheels', icon: Settings, api: gameApi.unlockAllWheels, category: 'vehicle' },
    { id: 'paid_wheels', name: 'Paid Wheels', desc: 'Unlock exclusive premium wheels', icon: Settings, api: gameApi.unlockPaidWheels, category: 'vehicle' },
    { id: 'w16', name: 'W16 Engine', desc: 'Unlock the powerful W16 engine', icon: Activity, api: gameApi.unlockW16, category: 'performance' },
    { id: 'smoke', name: 'Smoke Effect', desc: 'Unlock custom tire smoke colors', icon: Droplet, api: gameApi.unlockSmokeEffect, category: 'vehicle' },
    
    { id: 'damage', name: 'Disable Damage', desc: 'Make your vehicles indestructible', icon: Shield, api: gameApi.unlockDisableVehicleDamage, category: 'perks' },
    { id: 'fuel', name: 'Unlimited Fuel', desc: 'Never run out of gas again', icon: Droplet, api: gameApi.unlockUnlimitedFuel, category: 'perks' },
    { id: 'cars', name: 'All Cars', desc: 'Unlock every car in the game', icon: Car, api: gameApi.unlockAllCars, category: 'vehicle' },
  ];

  const handleUnlock = async (id: string, name: string, apiCall: () => Promise<any>) => {
    setUnlockingId(id);
    
    // Custom steps based on the item
    let steps = undefined;
    let durationMs = 2000;
    
    if (id === 'cars') {
      steps = [
        { progress: 10, text: 'Fetching car database...' },
        { progress: 30, text: 'Unlocking Tier 1 cars...' },
        { progress: 50, text: 'Unlocking Tier 2 cars...' },
        { progress: 75, text: 'Unlocking Premium & Boss cars...' },
        { progress: 95, text: 'Saving 226 cars to profile...' }
      ];
      durationMs = 3500;
    } else {
      steps = [
        { progress: 20, text: `Authorizing ${name} unlock...` },
        { progress: 60, text: 'Applying modifications...' },
        { progress: 90, text: 'Syncing with server...' }
      ];
    }
    
    try {
      await runWithProgress(
        `Unlocking ${name}`,
        'Please wait while the modifications are applied to your account.',
        async () => {
          const response = await apiCall();
          if (response === true || response.data?.status || response.data?.success || response.data?.stasus === true) {
            addToast({ title: 'Unlocked', description: `Successfully unlocked ${name}`, type: 'success' });
            updateUser({ unlockedFeatures: [...(user?.unlockedFeatures || []), id] });
          } else {
            addToast({ title: 'Failed', description: response?.data?.message || `Failed to unlock ${name}`, type: 'error' });
          }
        },
        { steps, durationMs }
      );
    } catch (error: any) {
      addToast({ title: 'Error', description: error.response?.data?.message || `An error occurred unlocking ${name}`, type: 'error' });
    } finally {
      setUnlockingId(null);
    }
  };

  const filteredActions = activeCategory === 'all' 
     ? unlockActions 
     : unlockActions.filter(a => a.category === activeCategory);

  const categories = [
    { id: 'all', label: 'All Unlocks' },
    { id: 'character', label: 'Character' },
    { id: 'vehicle', label: 'Vehicle Parts' },
    { id: 'performance', label: 'Performance' },
    { id: 'perks', label: 'Special Perks' },
  ];

  const unlockedIds = user?.unlockedFeatures || [];
  const lockedActions = filteredActions.filter(a => !unlockedIds.includes(a.id));
  const unlockedActions = filteredActions.filter(a => unlockedIds.includes(a.id));

  return (
    <div className="space-y-6">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-white mb-2 font-display">Unlock Features</h1>
        <p className="text-neutral-400 text-sm">Unlock special items, properties, and abilities for your account.</p>
      </header>

      <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap text-sm ${
              activeCategory === cat.id 
                ? 'bg-white text-black shadow-md' 
                : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white border border-neutral-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="space-y-8 pt-2">
        {lockedActions.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 font-display">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Available to Unlock
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {lockedActions.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                >
                  <Card className="h-full flex flex-col group border-neutral-800/80 hover:border-neutral-600 transition-colors p-4 cursor-pointer" onClick={() => handleUnlock(item.id, item.name, item.api)}>
                    <div className="flex flex-col items-center text-center flex-1">
                      <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center mb-3 text-neutral-300 group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all duration-300 shadow-sm border border-neutral-800 group-hover:border-white">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm md:text-base font-bold text-white mb-1 leading-tight">{item.name}</h3>
                      <p className="text-xs text-neutral-500 line-clamp-2">{item.desc}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-neutral-800/50">
                      <Button 
                        className="w-full text-xs py-1.5 h-8 bg-neutral-800 text-white hover:bg-white hover:text-black border-none" 
                        isLoading={unlockingId === item.id}
                        disabled={unlockingId !== null && unlockingId !== item.id}
                      >
                        Unlock
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {unlockedActions.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 font-display">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Already Unlocked
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {unlockedActions.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                >
                  <Card className="h-full flex flex-col group border-emerald-500/20 bg-emerald-500/5 p-4">
                    <div className="flex flex-col items-center text-center flex-1">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3 text-emerald-400 border border-emerald-500/20">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm md:text-base font-bold text-emerald-100 mb-1 leading-tight">{item.name}</h3>
                      <p className="text-xs text-emerald-500/70 line-clamp-2">{item.desc}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-emerald-500/10 flex justify-center">
                      <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Unlocked</span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
