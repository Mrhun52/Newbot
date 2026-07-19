import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/store/useToast';
import { useProgress } from '@/store/useProgress';
import { gameApi } from '@/services/api';
import { Car, Unlock, Shield, Droplet, Check } from 'lucide-react';

export const Cars = () => {
  const { addToast } = useToast();
  const [carId, setCarId] = useState('');
  const [carIdBumper, setCarIdBumper] = useState('');
  const [frontBumper, setFrontBumper] = useState(true);
  const [rearBumper, setRearBumper] = useState(true);
  const [carIdChrome, setCarIdChrome] = useState('');
  
  const [chromeBody, setChromeBody] = useState('#FF0000');
  const [chromeWindow, setChromeWindow] = useState('#00FF00');
  const [chromeWheels, setChromeWheels] = useState('#0000FF');

  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});

  const handleBuyCar = async () => {
    if (!carId) return;
    setIsLoading(prev => ({ ...prev, buy: true }));
    try {
      const response = await gameApi.buyCar(Number(carId));
      if (response.data?.status || response.data?.success || response.data?.stasus === true) {
        addToast({ title: 'Success', description: `Successfully bought car ID ${carId}`, type: 'success' });
      } else {
        addToast({ title: 'Failed', description: response.data?.message || 'Failed to buy car', type: 'error' });
      }
    } catch (error: any) {
      addToast({ title: 'Error', description: error.response?.data?.message || 'An error occurred', type: 'error' });
    } finally {
      setIsLoading(prev => ({ ...prev, buy: false }));
    }
  };

  const handleRemoveBumper = async () => {
    if (!carIdBumper) return;
    if (!frontBumper && !rearBumper) {
      addToast({ title: 'Invalid', description: 'Select at least one bumper to remove', type: 'error' });
      return;
    }
    setIsLoading(prev => ({ ...prev, bumper: true }));
    try {
      const idParam = carIdBumper.toLowerCase() === 'all' ? 'all' : [Number(carIdBumper)];
      const response = await gameApi.removeBumper(idParam, frontBumper, rearBumper);
      if (response.data?.status || response.data?.success || response.data?.stasus === true) {
        addToast({ title: 'Success', description: `Successfully removed bumpers for ${carIdBumper}`, type: 'success' });
      } else {
        addToast({ title: 'Failed', description: response.data?.message || 'Failed to remove bumper', type: 'error' });
      }
    } catch (error: any) {
      addToast({ title: 'Error', description: error.response?.data?.message || 'An error occurred', type: 'error' });
    } finally {
      setIsLoading(prev => ({ ...prev, bumper: false }));
    }
  };

  const handleChrome = async () => {
    if (!carIdChrome) return;
    
    try {
      const idParam = carIdChrome.toLowerCase() === 'all' ? 'all' : [Number(carIdChrome)];
      const options = {
        ...(chromeBody ? { body: chromeBody } : {}),
        ...(chromeWindow ? { window: chromeWindow } : {}),
        ...(chromeWheels ? { wheels: chromeWheels } : {})
      };
      
      let steps = undefined;
      let durationMs = 1500;
      if (idParam === 'all') {
        steps = [
          { progress: 10, text: 'Fetching all cars...' },
          { progress: 30, text: 'Applying body color...' },
          { progress: 60, text: 'Applying window & wheels...' },
          { progress: 90, text: 'Saving changes...' }
        ];
        durationMs = 3000;
      }
      
      await useProgress.getState().runWithProgress(
        'Applying Chrome',
        `Applying colors to ${carIdChrome === 'all' ? 'all cars' : `car ID ${carIdChrome}`}`,
        async () => {
          const response = await gameApi.chrome(idParam, options);
          if (response.data?.status || response.data?.success || response.data?.stasus === true) {
            addToast({ title: 'Success', description: `Successfully applied chrome to ${carIdChrome}`, type: 'success' });
          } else {
            addToast({ title: 'Failed', description: response.data?.message || 'Failed to apply chrome', type: 'error' });
          }
        },
        { steps, durationMs }
      );
    } catch (error: any) {
      addToast({ title: 'Error', description: error.response?.data?.message || 'An error occurred', type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Vehicle Management</h1>
        <p className="text-neutral-400">Buy specific vehicles and apply special modifications.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="flex flex-col h-full bg-neutral-900 border-neutral-800">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Unlock className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Buy Specific Car</h2>
              <p className="text-neutral-400 text-sm">Unlock a single car by its ID (e.g. 1-226)</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Car ID</label>
              <div className="flex gap-3">
                <Input 
                  type="number" 
                  placeholder="Enter Car ID..." 
                  value={carId}
                  onChange={(e) => setCarId(e.target.value)}
                />
                <Button 
                  onClick={handleBuyCar}
                  isLoading={isLoading['buy']}
                  disabled={!carId}
                  className="shrink-0"
                >
                  Buy Car
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="flex flex-col h-full bg-neutral-900 border-neutral-800">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Remove Bumpers</h2>
              <p className="text-neutral-400 text-sm">Remove front or rear bumpers</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Car ID (or "all")</label>
              <Input 
                placeholder='Enter Car ID or "all"' 
                value={carIdBumper}
                onChange={(e) => setCarIdBumper(e.target.value)}
              />
            </div>
            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                <div className={`w-5 h-5 rounded flex items-center justify-center border ${frontBumper ? 'bg-blue-600 border-blue-600' : 'border-slate-600'}`} onClick={() => setFrontBumper(!frontBumper)}>
                  {frontBumper && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
                Front Bumper
              </label>
              <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                <div className={`w-5 h-5 rounded flex items-center justify-center border ${rearBumper ? 'bg-blue-600 border-blue-600' : 'border-slate-600'}`} onClick={() => setRearBumper(!rearBumper)}>
                  {rearBumper && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
                Rear Bumper
              </label>
            </div>
            <Button 
              className="w-full"
              onClick={handleRemoveBumper}
              isLoading={isLoading['bumper']}
              disabled={!carIdBumper || (!frontBumper && !rearBumper)}
            >
              Remove Bumpers
            </Button>
          </div>
        </Card>

        <Card className="flex flex-col h-full bg-neutral-900 border-neutral-800 lg:col-span-2">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Droplet className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Apply Chrome Colors</h2>
              <p className="text-neutral-400 text-sm">Customize body, windows, and wheels with HEX colors</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-400 mb-2">Car ID (or "all")</label>
              <Input 
                className="max-w-xs"
                placeholder='Enter Car ID or "all"' 
                value={carIdChrome}
                onChange={(e) => setCarIdChrome(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Body Color (HEX)</label>
                <div className="flex gap-3">
                  <Input 
                    placeholder="#FF0000" 
                    value={chromeBody}
                    onChange={(e) => setChromeBody(e.target.value)}
                  />
                  <div className="w-10 h-10 rounded border border-neutral-700 shrink-0" style={{ backgroundColor: chromeBody || 'transparent' }} />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Window Color (HEX)</label>
                <div className="flex gap-3">
                  <Input 
                    placeholder="#00FF00" 
                    value={chromeWindow}
                    onChange={(e) => setChromeWindow(e.target.value)}
                  />
                  <div className="w-10 h-10 rounded border border-neutral-700 shrink-0" style={{ backgroundColor: chromeWindow || 'transparent' }} />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Wheels Color (HEX)</label>
                <div className="flex gap-3">
                  <Input 
                    placeholder="#0000FF" 
                    value={chromeWheels}
                    onChange={(e) => setChromeWheels(e.target.value)}
                  />
                  <div className="w-10 h-10 rounded border border-neutral-700 shrink-0" style={{ backgroundColor: chromeWheels || 'transparent' }} />
                </div>
              </div>
            </div>

            <Button 
              className="w-full md:w-auto"
              onClick={handleChrome}
              isLoading={isLoading['chrome']}
              disabled={!carIdChrome || (!chromeBody && !chromeWindow && !chromeWheels)}
            >
              Apply Chrome Colors
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
