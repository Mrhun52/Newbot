import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useMultiAccount, SavedAccount } from '@/store/useMultiAccount';
import { useToast } from '@/store/useToast';
import { useProgress } from '@/store/useProgress';
import { userApi, gameApi } from '@/services/api';
import { motion } from 'motion/react';
import { Users, Plus, Trash2, CheckSquare, Square, RefreshCw, Play } from 'lucide-react';
import { AccountRiskMeter } from '@/components/ui/AccountRiskMeter';

export const BulkAccounts = () => {
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [actionType, setBulkActionType] = useState('money');
  const [bulkAmount, setBulkAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { accounts, selectedAccountIds, addAccount, removeAccount, toggleSelection, selectAll, deselectAll, updateAccount, clearAccounts } = useMultiAccount();
  const { addToast } = useToast();
  const { runWithProgress } = useProgress();

  const handleAddAccount = async () => {
    if (!newEmail || !newPassword) {
      addToast({ title: 'Error', description: 'Please enter email and password.', type: 'error' });
      return;
    }
    
    setIsAdding(true);
    try {
      // Validate by attempting to fetch profile
      const response = await userApi.getProfile({ email: newEmail, password: newPassword });
      if ((response.data?.success || response.data?.status === true || response.data?.stasus === true) && response.data?.record) {
        addAccount({
          id: newEmail,
          email: newEmail,
          password: newPassword,
          name: response.data.record.Name,
          money: response.data.record.money,
          coins: response.data.record.coin,
          lastChecked: Date.now()
        });
        setNewEmail('');
        setNewPassword('');
        addToast({ title: 'Success', description: 'Account added successfully!', type: 'success' });
      } else {
        addToast({ title: 'Failed', description: response.data?.message || 'Invalid credentials or account not found.', type: 'error' });
      }
    } catch (e: any) {
      addToast({ title: 'Error', description: e.message || 'Failed to connect to server.', type: 'error' });
    } finally {
      setIsAdding(false);
    }
  };

  const handleRefresh = async (account: SavedAccount) => {
    try {
      const response = await userApi.getProfile({ email: account.email, password: account.password });
      if ((response.data?.success || response.data?.status === true || response.data?.stasus === true) && response.data?.record) {
        updateAccount(account.id, {
          name: response.data.record.Name,
          money: response.data.record.money,
          coins: response.data.record.coin,
          lastChecked: Date.now()
        });
        addToast({ title: 'Refreshed', description: `${account.email} updated.`, type: 'success' });
      }
    } catch (e) {
      addToast({ title: 'Error', description: `Failed to refresh ${account.email}`, type: 'error' });
    }
  };

  const handleBulkAction = async (actionType: string) => {
    if (selectedAccountIds.length === 0) {
      addToast({ title: 'Error', description: 'No accounts selected for bulk action.', type: 'error' });
      return;
    }

    if (['money', 'coins'].includes(actionType) && !bulkAmount) {
      addToast({ title: 'Error', description: 'Please specify an amount.', type: 'error' });
      return;
    }

    const selectedAccounts = accounts.filter(a => selectedAccountIds.includes(a.id));
    setIsProcessing(true);

    try {
      await runWithProgress(
        'Processing Bulk Operations',
        `Applying action to ${selectedAccounts.length} account(s)...`,
        async () => {
          for (const account of selectedAccounts) {
            const creds = { email: account.email, password: account.password };
            try {
              if (actionType === 'money') {
                await gameApi.setMoney(Number(bulkAmount), creds);
                updateAccount(account.id, { money: Number(bulkAmount) });
              } else if (actionType === 'coins') {
                await gameApi.setCoins(Number(bulkAmount), creds);
                updateAccount(account.id, { coins: Number(bulkAmount) });
              } else if (actionType === 'unlock_cars') {
                await gameApi.unlockAllCars(creds);
                            } else if (actionType === 'complete_levels') {
                await gameApi.completeAllLevels(creds);
              } else if (actionType === 'max_account') {
                await gameApi.setMoney(50000000, creds);
                await gameApi.setCoins(500000, creds);
                await gameApi.unlockMaleClothes(creds);
                await gameApi.unlockFemaleClothes(creds);
                await gameApi.unlockAllAnimations(creds);
                await gameApi.unlockAllHorns(creds);
                await gameApi.unlockAllSirens(creds);
                await gameApi.unlockAllWheels(creds);
                await gameApi.unlockPaidWheels(creds);
                await gameApi.unlockDisableVehicleDamage(creds);
                await gameApi.unlockW16(creds);
                await gameApi.unlockSmokeEffect(creds);
                await gameApi.unlockUnlimitedFuel(creds);
                await gameApi.unlockAllCars(creds);
                updateAccount(account.id, { money: 50000000, coins: 500000 });
              }
            } catch (err) {
              console.error(`Error processing ${account.email}`, err);
            }
          }
          addToast({ title: 'Success', description: 'Bulk operation completed.', type: 'success' });
        },
        {
          durationMs: actionType === 'max_account' ? selectedAccounts.length * 5000 : selectedAccounts.length * 2000,
          steps: [
            { progress: 10, text: 'Initializing bulk queues...' },
            { progress: 30, text: 'Applying money & coins...' },
            { progress: 60, text: 'Unlocking vehicles & features...' },
            { progress: 90, text: 'Finalizing account sync...' }
          ]
        }
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Multi-Account Manager</h1>
          <p className="text-neutral-400">Add multiple accounts and perform actions simultaneously.</p>
        </header>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-400" />
                  <h2 className="text-xl font-bold text-white">Accounts Grid</h2>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={selectAll} disabled={accounts.length === 0}>
                    Select All
                  </Button>
                  <Button variant="secondary" size="sm" onClick={deselectAll} disabled={accounts.length === 0}>
                    Deselect
                  </Button>
                  <Button variant="secondary" size="sm" onClick={clearAccounts} disabled={accounts.length === 0}>
                    Clear All
                  </Button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-neutral-400 text-sm">
                      <th className="p-3 w-10"></th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Money</th>
                      <th className="p-3">Coins</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-neutral-500">
                          No accounts added yet. Use the form to add one.
                        </td>
                      </tr>
                    )}
                    {accounts.map(account => {
                      const isSelected = selectedAccountIds.includes(account.id);
                      return (
                        <tr key={account.id} className={`border-b border-white/5 transition-colors ${isSelected ? 'bg-blue-500/10' : 'hover:bg-white/5'}`}>
                          <td className="p-3">
                            <button onClick={() => toggleSelection(account.id)} className="text-neutral-400 hover:text-blue-400 transition-colors">
                              {isSelected ? <CheckSquare className="w-5 h-5 text-blue-400" /> : <Square className="w-5 h-5" />}
                            </button>
                          </td>
                          <td className="p-3 text-sm text-neutral-200">{account.email}</td>
                          <td className="p-3 text-sm text-neutral-300">{account.name || 'Unknown'}</td>
                          <td className="p-3 text-sm text-emerald-400">${account.money?.toLocaleString() || '0'}</td>
                          <td className="p-3 text-sm text-amber-400">{account.coins?.toLocaleString() || '0'}</td>
                          <td className="p-3 text-right flex justify-end gap-2">
                            <button onClick={() => handleRefresh(account)} className="p-1.5 text-neutral-400 hover:text-blue-400 bg-white/5 rounded-md transition-colors" title="Refresh">
                              <RefreshCw className="w-4 h-4" />
                            </button>
                            <button onClick={() => removeAccount(account.id)} className="p-1.5 text-neutral-400 hover:text-red-400 bg-white/5 rounded-md transition-colors" title="Remove">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3 mb-6">
                <Play className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Bulk Operation Execution</h2>
              </div>
              <p className="text-sm text-neutral-400 mb-6">
                Applies the selected action to all {selectedAccountIds.length} checked accounts sequentially.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-500/20" 
                  onClick={() => handleBulkAction('max_account')}
                  isLoading={isProcessing}
                  disabled={selectedAccountIds.length === 0}
                >
                  Max Account (Unlock All)
                </Button>
                <Button 
                  className="w-full bg-neutral-800 hover:bg-neutral-700" 
                  onClick={() => handleBulkAction('complete_levels')}
                  isLoading={isProcessing}
                  disabled={selectedAccountIds.length === 0}
                >
                  Complete All Levels
                </Button>
                <Button 
                  className="w-full bg-neutral-800 hover:bg-neutral-700" 
                  onClick={() => handleBulkAction('unlock_cars')}
                  isLoading={isProcessing}
                  disabled={selectedAccountIds.length === 0}
                >
                  Unlock All Cars
                </Button>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <AccountRiskMeter />
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <Plus className="w-5 h-5 text-emerald-400" />
                <h2 className="text-xl font-bold text-white">Add Account</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1.5">Email</label>
                  <Input 
                    placeholder="player@example.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1.5">Password</label>
                  <Input 
                    type="password"
                    placeholder="Enter password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleAddAccount}
                  isLoading={isAdding}
                  disabled={!newEmail || !newPassword}
                >
                  Add to Grid
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
