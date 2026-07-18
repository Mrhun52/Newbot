import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { gameApi } from '@/services/api';
import { useToast } from '@/store/useToast';
import { useAuth } from '@/store/useAuth';
import { useProgress } from '@/store/useProgress';
import { Wallet, Coins, Trophy, Flag, Star } from 'lucide-react';
import { useRisk } from '@/store/useRisk';
import { AccountRiskMeter } from '@/components/ui/AccountRiskMeter';

export const Money = () => {
  const [moneyAmount, setMoneyAmount] = useState('');
  const [coinsAmount, setCoinsAmount] = useState('');
  const [raceWin, setRaceWin] = useState('');
  const [raceLose, setRaceLose] = useState('');

  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
  
  const { addToast } = useToast();
  const { user, updateUser } = useAuth();
  const { runWithProgress } = useProgress();
  const { setRisk, resetRisk } = useRisk();

  useEffect(() => {
    let risk = 5;
    let message = 'Account operations are currently within safe limits.';
    let hasInput = false;

    if (moneyAmount) {
      hasInput = true;
      const amt = Number(moneyAmount);
      if (amt >= 50000000) {
        risk = 95;
        message = 'CRITICAL RISK: Adding 50M+ money instantly is highly likely to trigger auto-ban.';
      } else if (amt >= 10000000) {
        risk = 80;
        message = 'HIGH RISK: Amounts over 10M money often trigger manual review.';
      } else if (amt >= 5000000) {
        risk = 50;
        message = 'MODERATE RISK: Adding 5M money is noticeable. Proceed with caution.';
      } else {
        risk = 15;
        message = 'LOW RISK: This money amount is generally safe.';
      }
    } else if (coinsAmount) {
      hasInput = true;
      const amt = Number(coinsAmount);
      if (amt >= 100000) {
        risk = 90;
        message = 'CRITICAL RISK: 100K+ coins flags account anomaly detectors.';
      } else if (amt >= 50000) {
        risk = 60;
        message = 'MODERATE RISK: Unusually high coin amount. Consider smaller batches.';
      } else {
        risk = 10;
        message = 'LOW RISK: This coin amount is generally safe.';
      }
    } else if (raceWin || raceLose) {
      hasInput = true;
      const amt = Number(raceWin) || Number(raceLose);
      if (amt >= 10000) {
        risk = 80;
        message = 'HIGH RISK: 10K+ sudden race stat changes are suspicious.';
      } else {
        risk = 20;
        message = 'LOW RISK: These race stats are within reasonable limits.';
      }
    }

    if (hasInput) {
      setRisk(risk, message);
    } else {
      resetRisk();
    }
  }, [moneyAmount, coinsAmount, raceWin, raceLose, setRisk, resetRisk]);

  const handleAction = async (actionId: string, apiCall: () => Promise<any>, successMsg: string, updateFn?: () => void) => {
    if (actionId === 'complete_levels') {
      try {
        await runWithProgress(
          'Completing All Levels',
          'Setting maximum stars for all story and challenge levels...',
          async () => {
            const response = await apiCall();
            if (response.data?.status || response.data?.success || response.data?.stasus === true) {
              if (updateFn) updateFn();
              addToast({ title: 'Success', description: successMsg, type: 'success' });
            } else {
              addToast({ title: 'Failed', description: response.data?.message || `Failed to perform action`, type: 'error' });
            }
          },
          {
            durationMs: 3000,
            steps: [
              { progress: 15, text: 'Scanning levels database...' },
              { progress: 40, text: 'Setting 3 stars on story levels...' },
              { progress: 75, text: 'Completing challenge events...' },
              { progress: 95, text: 'Syncing profile progress...' }
            ]
          }
        );
      } catch (error: any) {
        addToast({ title: 'Error', description: error.response?.data?.message || 'An error occurred', type: 'error' });
      }
      return;
    }
    
    setIsLoading(prev => ({ ...prev, [actionId]: true }));
    try {
      const response = await apiCall();
      if (response.data?.status || response.data?.success || response.data?.stasus === true) {
        if (updateFn) updateFn();
        addToast({ title: 'Success', description: successMsg, type: 'success' });
      } else {
        addToast({ title: 'Failed', description: response.data?.message || `Failed to perform action`, type: 'error' });
      }
    } catch (error: any) {
      addToast({ title: 'Error', description: error.response?.data?.message || 'An error occurred', type: 'error' });
    } finally {
      setIsLoading(prev => ({ ...prev, [actionId]: false }));
    }
  };

  const moneyPresets = [10000, 500000, 1000000, 50000000];
  const coinsPresets = [1000, 10000, 50000, 100000];

  return (
    <div className="space-y-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Economy & Progress</h1>
        <p className="text-slate-400">Manage your in-game currency, premium coins, and game stats.</p>
      </header>

      <div className="mb-6"><AccountRiskMeter /></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="flex flex-col h-full bg-gradient-to-br from-slate-900 to-emerald-950/30 border-emerald-900/50">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Bank Balance</h2>
              <p className="text-emerald-400 text-lg font-medium">${user?.money?.toLocaleString() || '0'}</p>
            </div>
          </div>

          <div className="space-y-4 mb-6 flex-1">
            <label className="block text-sm font-medium text-slate-400 mb-2">Quick Presets</label>
            <div className="grid grid-cols-2 gap-3">
              {moneyPresets.map((amount) => (
                <Button 
                  key={amount} 
                  variant="secondary" 
                  onClick={() => handleAction('money_'+amount, () => gameApi.setMoney(amount), `Successfully set money to $${amount.toLocaleString()}`, () => updateUser({ money: amount }))}
                  disabled={isLoading['money_'+amount]}
                  className="bg-slate-800/50 hover:bg-emerald-600/20 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
                >
                  Set ${amount.toLocaleString()}
                </Button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/50">
            <label className="block text-sm font-medium text-slate-400 mb-2">Custom Amount</label>
            <div className="flex gap-3">
              <Input 
                type="number" 
                placeholder="Enter amount..." 
                value={moneyAmount}
                onChange={(e) => setMoneyAmount(e.target.value)}
                className="bg-slate-950/50"
              />
              <Button 
                onClick={() => {
                  const amt = Number(moneyAmount);
                  handleAction('custom_money', () => gameApi.setMoney(amt), `Successfully set money to $${amt.toLocaleString()}`, () => updateUser({ money: amt }));
                }}
                isLoading={isLoading['custom_money']}
                disabled={!moneyAmount || Number(moneyAmount) < 0}
                className="bg-emerald-600 hover:bg-emerald-500 text-white shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                Apply
              </Button>
            </div>
          </div>
        </Card>

        <Card className="flex flex-col h-full bg-gradient-to-br from-slate-900 to-amber-950/30 border-amber-900/50">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Coins className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Premium Coins</h2>
              <p className="text-amber-400 text-lg font-medium">{user?.coins?.toLocaleString() || '0'} Coins</p>
            </div>
          </div>

          <div className="space-y-4 mb-6 flex-1">
            <label className="block text-sm font-medium text-slate-400 mb-2">Quick Presets</label>
            <div className="grid grid-cols-2 gap-3">
              {coinsPresets.map((amount) => (
                <Button 
                  key={amount} 
                  variant="secondary" 
                  onClick={() => handleAction('coins_'+amount, () => gameApi.setCoins(amount), `Successfully set coins to ${amount.toLocaleString()}`, () => updateUser({ coins: amount }))}
                  disabled={isLoading['coins_'+amount]}
                  className="bg-slate-800/50 hover:bg-amber-600/20 hover:text-amber-400 hover:border-amber-500/30 transition-all"
                >
                  Set {amount.toLocaleString()}
                </Button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/50">
            <label className="block text-sm font-medium text-slate-400 mb-2">Custom Amount</label>
            <div className="flex gap-3">
              <Input 
                type="number" 
                placeholder="Enter amount..." 
                value={coinsAmount}
                onChange={(e) => setCoinsAmount(e.target.value)}
                className="bg-slate-950/50"
              />
              <Button 
                onClick={() => {
                  const amt = Number(coinsAmount);
                  handleAction('custom_coins', () => gameApi.setCoins(amt), `Successfully set coins to ${amt.toLocaleString()}`, () => updateUser({ coins: amt }));
                }}
                isLoading={isLoading['custom_coins']}
                disabled={!coinsAmount || Number(coinsAmount) < 0}
                className="bg-amber-600 hover:bg-amber-500 text-white shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
              >
                Apply
              </Button>
            </div>
          </div>
        </Card>

        {/* Progress Stats */}
        <Card className="flex flex-col h-full">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Race Stats</h2>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Race Wins</label>
              <div className="flex gap-3">
                <Input 
                  type="number" 
                  placeholder="Set race wins..." 
                  value={raceWin}
                  onChange={(e) => setRaceWin(e.target.value)}
                />
                <Button 
                  onClick={() => handleAction('race_win', () => gameApi.setRaceWin(Number(raceWin)), `Race wins set to ${raceWin}`)}
                  isLoading={isLoading['race_win']}
                  disabled={!raceWin}
                  className="shrink-0"
                >
                  Apply
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Race Loses</label>
              <div className="flex gap-3">
                <Input 
                  type="number" 
                  placeholder="Set race loses..." 
                  value={raceLose}
                  onChange={(e) => setRaceLose(e.target.value)}
                />
                <Button 
                  onClick={() => handleAction('race_lose', () => gameApi.setRaceLose(Number(raceLose)), `Race loses set to ${raceLose}`)}
                  isLoading={isLoading['race_lose']}
                  disabled={!raceLose}
                  className="shrink-0"
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="flex flex-col h-full bg-gradient-to-br from-slate-900 to-indigo-950/30 border-indigo-900/50">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <Star className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Game Progress</h2>
              <p className="text-indigo-400 text-sm font-medium">Complete game milestones instantly</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <Button 
              size="lg"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
              onClick={() => handleAction('complete_levels', () => gameApi.completeAllLevels(), 'Successfully completed all levels')}
              isLoading={isLoading['complete_levels']}
            >
              <Flag className="w-5 h-5 mr-2" />
              Complete All Levels
            </Button>
            <p className="text-xs text-slate-500 text-center mt-4">
              This action will mark all story and challenge levels as 100% completed with maximum stars.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
