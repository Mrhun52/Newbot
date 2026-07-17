import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/store/useToast';
import { gameApi } from '@/services/api';
import { Shirt, Volume2, Shield, Settings, Droplet, Car, Activity, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export const Unlock = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [unlockingId, setUnlockingId] = useState<string | null>(null);
  const { addToast } = useToast();

  const unlockActions = [
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
    try {
      const response = await apiCall();
      if (response.data?.status || response.data?.success || response.data?.stasus === true) {
        addToast({ title: 'Unlocked', description: `Successfully unlocked ${name}`, type: 'success' });
      } else {
        addToast({ title: 'Failed', description: response.data?.message || `Failed to unlock ${name}`, type: 'error' });
      }
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

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Unlock Features</h1>
        <p className="text-slate-400">Unlock special items, properties, and abilities for your account.</p>
      </header>

      <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeCategory === cat.id 
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]' 
                : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
        {filteredActions.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Card className="h-full flex flex-col group border-slate-800/80 hover:border-blue-500/30 transition-colors">
              <div className="flex-1">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-4 text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-inner">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/50">
                <Button 
                  className="w-full" 
                  variant="primary"
                  isLoading={unlockingId === item.id}
                  disabled={unlockingId !== null && unlockingId !== item.id}
                  onClick={() => handleUnlock(item.id, item.name, item.api)}
                >
                  Unlock Now
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
