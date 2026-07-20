import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/store/useToast';
import { useAuth } from '@/store/useAuth';
import { useProgress } from '@/store/useProgress';
import { userApi } from '@/services/api';
import { changeEmailFirebase, changePasswordFirebase, getAccountInfoFirebase } from '@/lib/firebaseUtils';
import { User, Copy, CheckCircle2, CopyPlus } from 'lucide-react';

export const Account = () => {
  const { user, credentials, updateUser } = useAuth();
  const { addToast } = useToast();
  
  // Profile state
  const [name, setName] = useState(user?.name || '');
  const [localId, setLocalId] = useState(user?.id || '');
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [isUpdatingId, setIsUpdatingId] = useState(false);

  // New states
  const [newEmail, setNewEmail] = useState('');
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  
  const [newPassword, setNewPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const [copiedId, setCopiedId] = useState(false);

  // Copy Account state
  const [copyData, setCopyData] = useState({ fromEmail: '', fromPassword: '', toEmail: '', toPassword: '', carId: '' });
  const [isCopying, setIsCopying] = useState<string | false>(false);

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

  const handleUpdateEmail = async () => {
    if (!newEmail || !credentials?.email || !credentials?.password) return;
    setIsUpdatingEmail(true);
    try {
      await changeEmailFirebase(credentials.email, credentials.password, newEmail);
      addToast({ title: 'Success', description: 'Email updated successfully. Please login again with your new email.', type: 'success' });
      // Clear inputs
      setNewEmail('');
    } catch (error: any) {
      addToast({ title: 'Error', description: error.message || 'Failed to update email', type: 'error' });
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || !credentials?.email || !credentials?.password) return;
    setIsUpdatingPassword(true);
    try {
      await changePasswordFirebase(credentials.email, credentials.password, newPassword);
      addToast({ title: 'Success', description: 'Password updated successfully. Please login again with your new password.', type: 'success' });
      setNewPassword('');
    } catch (error: any) {
      addToast({ title: 'Error', description: error.message || 'Failed to update password', type: 'error' });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleGetInfo = async () => {
    if (!credentials?.email || !credentials?.password) return;
    setIsLoadingInfo(true);
    try {
      const info = await getAccountInfoFirebase(credentials.email, credentials.password);
      setAccountInfo(info);
      setShowInfoModal(true);
    } catch (error: any) {
      addToast({ title: 'Error', description: error.message || 'Failed to fetch account info', type: 'error' });
    } finally {
      setIsLoadingInfo(false);
    }
  };


  const handleCopyAccount = async (type: 'all' | 'cars' | 'single-car') => {
    const { fromEmail, fromPassword, toEmail, toPassword, carId } = copyData;
    if (!fromEmail || !fromPassword || !toEmail || !toPassword) {
      addToast({ title: 'Missing fields', description: 'Please fill out all email/password fields.', type: 'error' });
      return;
    }

    if (type === 'single-car' && !carId) {
       addToast({ title: 'Missing fields', description: 'Please enter a Car ID to copy.', type: 'error' });
       return;
    }
    
    setIsCopying(type);
    
    try {
      await useProgress.getState().runWithProgress(
        `Cloning ${type === 'all' ? 'Account' : type === 'cars' ? 'Cars' : 'Car ' + carId}`,
        'Transferring data from source to destination...',
        async () => {
          let response;
          if (type === 'all') {
             response = await userApi.copyAccount({ fromEmail, fromPassword, toEmail, toPassword });
          } else if (type === 'cars') {
             // Use the copy-cars endpoint (we will add this to api.ts)
             response = await userApi.copyCars({ fromEmail, fromPassword, toEmail, toPassword });
          } else if (type === 'single-car') {
             response = await userApi.copySingleCar({ fromEmail, fromPassword, toEmail, toPassword, carId: Number(carId) });
          }
          
          if (response?.data?.status || response?.data?.success || response?.data?.stasus === true) {
            addToast({ title: 'Success', description: 'Copied successfully', type: 'success' });
            // Don't clear passwords, just in case they want to do more operations
            setCopyData(prev => ({ ...prev, carId: '' })); 
          } else {
            addToast({ title: 'Failed', description: response?.data?.message || 'Failed to copy', type: 'error' });
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
    } finally {
      setIsCopying(false);
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
        <p className="text-neutral-400">Manage your profile name, ID, or clone accounts.</p>
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
                <label className="block text-sm font-medium text-neutral-400 mb-1.5">Current Email Address</label>
                <div className="flex gap-2 mb-4">
                  <Input 
                    value={user?.email || ''}
                    disabled
                    className="opacity-50 cursor-not-allowed"
                  />
                  <Button 
                    variant="secondary"
                    isLoading={isLoadingInfo}
                    onClick={handleGetInfo}
                    className="shrink-0"
                  >
                    Account Info
                  </Button>
                </div>
                
                <label className="block text-sm font-medium text-neutral-400 mb-1.5">Change Email</label>
                <div className="flex gap-2 mb-4">
                  <Input 
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Enter new email address"
                    type="email"
                  />
                  <Button 
                    isLoading={isUpdatingEmail}
                    onClick={handleUpdateEmail}
                    disabled={!newEmail}
                    className="shrink-0"
                  >
                    Change
                  </Button>
                </div>

                <label className="block text-sm font-medium text-neutral-400 mb-1.5">Change Password</label>
                <div className="flex gap-2">
                  <Input 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    type="password"
                  />
                  <Button 
                    isLoading={isUpdatingPassword}
                    onClick={handleUpdatePassword}
                    disabled={!newPassword}
                    className="shrink-0"
                  >
                    Change
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1.5">Display Name</label>
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
                <label className="block text-sm font-medium text-neutral-400 mb-1.5">Local ID</label>
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
            <p className="text-sm text-neutral-400 mb-6">
              Clone data from one account to another. Both accounts must exist.
            </p>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 space-y-4">
                <h3 className="text-sm font-medium text-neutral-300">Source Account (From)</h3>
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
              
              <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 space-y-4">
                <h3 className="text-sm font-medium text-neutral-300">Destination Account (To)</h3>
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

              {/* Added individual copy options */}
              <div className="flex flex-col gap-3">
                <Button 
                  className="w-full" 
                  variant="primary"
                  isLoading={isCopying === 'all'}
                  onClick={() => handleCopyAccount('all')}
                >
                  Copy All Data
                </Button>
                <Button 
                  className="w-full" 
                  variant="secondary"
                  isLoading={isCopying === 'cars'}
                  onClick={() => handleCopyAccount('cars')}
                >
                  Copy All Cars Only
                </Button>
              </div>
              
              <div className="flex gap-2 items-end pt-2">
                 <div className="flex-1">
                   <Input 
                      placeholder="Car ID (e.g. 1)" 
                      value={copyData.carId || ''}
                      onChange={(e) => setCopyData(prev => ({ ...prev, carId: e.target.value }))}
                   />
                 </div>
                 <Button 
                    variant="secondary"
                    isLoading={isCopying === 'single-car'}
                    onClick={() => handleCopyAccount('single-car')}
                    disabled={!copyData.carId}
                    className="shrink-0"
                 >
                   Copy Single Car
                 </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Account Info Modal */}
      {showInfoModal && accountInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0F0F0F] border border-neutral-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <h2 className="text-xl font-bold text-white mb-4">Account Information</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">Status</span>
                <span className={accountInfo.disabled ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
                  {accountInfo.disabled ? "DISABLED 🚫" : "ACTIVE ✅"}
                </span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">Created At</span>
                <span className="text-white">{new Date(parseInt(accountInfo.createdAt)).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">Last Login</span>
                <span className="text-white">{new Date(parseInt(accountInfo.lastLoginAt)).toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">Verified</span>
                <span className={accountInfo.emailVerified ? "text-emerald-400" : "text-yellow-400"}>
                  {accountInfo.emailVerified ? "YES" : "NO"}
                </span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">Firebase UID</span>
                <span className="text-white text-xs mt-1">{accountInfo.localId}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">Providers</span>
                <span className="text-white text-sm">
                  {accountInfo.providerUserInfo?.map((p: any) => p.providerId).join(', ') || 'Password'}
                </span>
              </div>
            </div>
            
            <Button 
              className="w-full bg-neutral-800 text-white hover:bg-neutral-700 h-11"
              onClick={() => setShowInfoModal(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
