import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/store/useToast';
import { useAuth } from '@/store/useAuth';
import { useProgress } from '@/store/useProgress';
import { userApi } from '@/services/api';
import { User, Copy, CheckCircle2, CopyPlus } from 'lucide-react';

export const Account = () => {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  
  // Profile state
  const [name, setName] = useState(user?.name || '');
  const [localId, setLocalId] = useState(user?.id || '');
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [isUpdatingId, setIsUpdatingId] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Copy Account state
  const [copyData, setCopyData] = useState({ fromEmail: '', fromPassword: '', toEmail: '', toPassword: '' });
  const [isCopying, setIsCopying] = useState(false);

  const handleUpdateName = async () => {
    if (!name) return;
    setIsUpdatingName(true);
    try {
      const response = await userApi.updateName(name);
      if (response.data?.status || response.data?.success || response.data?.stasus === true) {
        updateUser({ name });
        addToast({ title: 'Success', description: 'Name updated successfully', type: 'success' });
      } else {
        addToast({ title: 'Failed', description: response.data?.message || 'Failed to update name', type: 'error' });
      }
    } catch (error: any) {
      addToast({ title: 'Error', description: error.response?.data?.message || 'An error occurred', type: 'error' });
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleUpdateId = async () => {
    if (!localId) return;
    setIsUpdatingId(true);
    try {
      const response = await userApi.updateId(localId);
      if (response.data?.status || response.data?.success || response.data?.stasus === true) {
        updateUser({ id: localId });
        addToast({ title: 'Success', description: 'ID updated successfully', type: 'success' });
      } else {
        addToast({ title: 'Failed', description: response.data?.message || 'Failed to update ID', type: 'error' });
      }
    } catch (error: any) {
      addToast({ title: 'Error', description: error.response?.data?.message || 'An error occurred', type: 'error' });
    } finally {
      setIsUpdatingId(false);
    }
  };

  const handleCopyAccount = async () => {
    const { fromEmail, fromPassword, toEmail, toPassword } = copyData;
    if (!fromEmail || !fromPassword || !toEmail || !toPassword) {
      addToast({ title: 'Missing fields', description: 'Please fill out all fields for copy account.', type: 'error' });
      return;
    }
    
    try {
      await useProgress.getState().runWithProgress(
        'Cloning Account',
        'Transferring data from source to destination...',
        async () => {
          const response = await userApi.copyAccount(copyData);
          if (response.data?.status || response.data?.success || response.data?.stasus === true) {
            addToast({ title: 'Success', description: 'Account copied successfully', type: 'success' });
            setCopyData({ fromEmail: '', fromPassword: '', toEmail: '', toPassword: '' });
          } else {
            addToast({ title: 'Failed', description: response.data?.message || 'Failed to copy account', type: 'error' });
          }
        },
        {
          durationMs: 4000,
          steps: [
            { progress: 15, text: 'Authenticating source account...' },
            { progress: 40, text: 'Reading player records...' },
            { progress: 65, text: 'Authenticating destination account...' },
            { progress: 85, text: 'Writing cloned data...' },
            { progress: 95, text: 'Verifying integrity...' }
          ]
        }
      );
    } catch (error: any) {
      addToast({ title: 'Error', description: error.response?.data?.message || 'An error occurred during copy', type: 'error' });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    addToast({ title: 'Copied', description: 'ID copied to clipboard', type: 'info' });
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Account Tools</h1>
        <p className="text-slate-400">Manage your profile name, ID, or clone accounts.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold text-white">Profile Information</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Email Address</label>
                <Input 
                  value={user?.email || ''}
                  disabled
                  className="opacity-50 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Display Name</label>
                <div className="flex gap-2">
                  <Input 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your display name"
                  />
                  <Button 
                    isLoading={isUpdatingName}
                    onClick={handleUpdateName}
                    disabled={!name || name === user?.name}
                    className="shrink-0"
                  >
                    Save
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Local ID</label>
                <div className="flex gap-2">
                  <Input 
                    value={localId}
                    onChange={(e) => setLocalId(e.target.value)}
                    placeholder="Enter new ID"
                  />
                  <Button 
                    variant="secondary" 
                    className="shrink-0"
                    onClick={() => copyToClipboard(localId)}
                  >
                    {copiedId ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button 
                    isLoading={isUpdatingId}
                    onClick={handleUpdateId}
                    disabled={!localId || localId === user?.id}
                    className="shrink-0"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <CopyPlus className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-bold text-white">Copy Account</h2>
            </div>
            <p className="text-sm text-slate-400 mb-6">
              Clone data from one account to another. Both accounts must exist.
            </p>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-4">
                <h3 className="text-sm font-medium text-slate-300">Source Account (From)</h3>
                <Input 
                  placeholder="From Email" 
                  value={copyData.fromEmail}
                  onChange={(e) => setCopyData(prev => ({ ...prev, fromEmail: e.target.value }))}
                />
                <Input 
                  type="password"
                  placeholder="From Password" 
                  value={copyData.fromPassword}
                  onChange={(e) => setCopyData(prev => ({ ...prev, fromPassword: e.target.value }))}
                />
              </div>
              
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-4">
                <h3 className="text-sm font-medium text-slate-300">Destination Account (To)</h3>
                <Input 
                  placeholder="To Email" 
                  value={copyData.toEmail}
                  onChange={(e) => setCopyData(prev => ({ ...prev, toEmail: e.target.value }))}
                />
                <Input 
                  type="password"
                  placeholder="To Password" 
                  value={copyData.toPassword}
                  onChange={(e) => setCopyData(prev => ({ ...prev, toPassword: e.target.value }))}
                />
              </div>

              <Button 
                className="w-full" 
                variant="primary"
                isLoading={isCopying}
                onClick={handleCopyAccount}
              >
                Copy Data
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
