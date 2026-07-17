import axios from 'axios';
import { useAuth } from '@/store/useAuth';

const rawUrl = import.meta.env.VITE_API_URL || 'new-tool-production.up.railway.app';
let baseURL = rawUrl ? (rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`) : '';
if (baseURL.endsWith('/api')) {
  baseURL = baseURL.replace(/\/api$/, '');
}
if (baseURL.endsWith('/')) {
  baseURL = baseURL.slice(0, -1);
}

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: (status) => {
    return status >= 200 && status < 500; // Resolve all responses < 500 to handle the 400 success case
  }
});

api.interceptors.request.use((config) => {
  const authStorage = localStorage.getItem('auth-storage');
  if (authStorage) {
    try {
      const { state } = JSON.parse(authStorage);
      if (state?.credentials && config.method?.toLowerCase() === 'post') {
        if (!config.data) {
          config.data = {};
        }
        if (typeof config.data === 'object' && !(config.data instanceof FormData)) {
          // Special case: /api/copy-account takes fromEmail and fromPassword instead
          if (config.url && config.url.includes('/copy-account')) {
            // Do not override email and password here
          } else {
            config.data = {
              ...config.data,
              email: state.credentials.email,
              password: state.credentials.password
            };
          }
        }
      }
    } catch (e) {
      // ignore
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuth.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const userApi = {
  getProfile: () => api.post('/api/get-player-records'),
  updateName: (value: string) => api.post('/api/set-name', { value }),
  updateId: (value: string) => api.post('/api/set-id', { value }),
  copyAccount: (data: { fromEmail: string; fromPassword: string; toEmail: string; toPassword: string }) => 
    api.post('/api/copy-account', data),
};

export const gameApi = {
  setMoney: (amount: number) => api.post('/api/set-money', { amount }),
  setCoins: (amount: number) => api.post('/api/set-coin', { amount }),
  setRaceWin: (amount: number) => api.post('/api/set-race-win', { amount }),
  setRaceLose: (amount: number) => api.post('/api/set-race-lose', { amount }),
  completeAllLevels: () => api.post('/api/complete-all-levels'),
  
  unlockMaleClothes: () => api.post('/api/unlock-male-clothes'),
  unlockFemaleClothes: () => api.post('/api/unlock-female-clothes'),
  unlockAllAnimations: () => api.post('/api/unlock-all-animations'),
  unlockAllHorns: () => api.post('/api/unlock-all-horns'),
  unlockAllSirens: () => api.post('/api/unlock-all-sirens'),
  unlockAllWheels: () => api.post('/api/unlock-all-wheels'),
  unlockPaidWheels: () => api.post('/api/unlock-paid-wheels'),
  
  unlockDisableVehicleDamage: () => api.post('/api/unlock-disable-vehicle-damage'),
  unlockW16: () => api.post('/api/unlock-w16'),
  unlockSmokeEffect: () => api.post('/api/unlock-smoke-effect'),
  unlockUnlimitedFuel: () => api.post('/api/unlock-unlimited-fuel'),
  
  unlockAllCars: () => api.post('/api/unlock-all-cars'),
  buyCar: (carId: number) => api.post('/api/buy-car', { carId }),
  removeBumper: (carID: number[] | "all", front: boolean, rear: boolean) => api.post('/api/remove-bumper', { carID, front, rear }),
  chrome: (carID: number[] | "all", options: {body?: string, window?: string, wheels?: string}) => api.post('/api/chrome', { carID, ...options }),
};

export const authApi = {
  login: (credentials: any) => api.post('/api/get-player-records', credentials),
};

export default api;
