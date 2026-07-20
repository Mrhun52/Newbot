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
              email: state.credentials.email,
              password: state.credentials.password,
              ...config.data
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

// Anti-Ban Rate Limiting Queue
// Processes requests sequentially with human-like delays to avoid anti-cheat detection
class AntiBanQueue {
  private queuePromise = Promise.resolve();

  async enqueue<T>(requestFn: () => Promise<T>): Promise<T> {
    const nextInQueue = this.queuePromise.then(async () => {
      // Random human-like delay between 500ms and 1500ms before sending the request
      const delay = Math.floor(Math.random() * (1500 - 500 + 1)) + 500;
      await new Promise(resolve => setTimeout(resolve, delay));
      return await requestFn();
    });

    // Ensure the queue continues even if a request fails
    this.queuePromise = nextInQueue.catch(() => {});

    return nextInQueue;
  }
}

const requestQueue = new AntiBanQueue();

const safePost = (url: string, data?: any) => {
  return requestQueue.enqueue(() => api.post(url, data));
};

export const userApi = {
  getProfile: (creds?: { email?: string; password?: string }) => safePost('/api/get-player-records', { ...creds }),
  updateName: (value: string, creds?: { email?: string; password?: string }) => safePost('/api/set-name', { value, ...creds }),
  updateId: (value: string, creds?: { email?: string; password?: string }) => safePost('/api/set-id', { value, ...creds }),
  copyAccount: (data: { fromEmail: string; fromPassword: string; toEmail: string; toPassword: string }) => safePost('/api/copy-account', data),
  copyCars: (data: { fromEmail: string; fromPassword: string; toEmail: string; toPassword: string }) => safePost('/api/copy-cars', data),
  copySingleCar: (data: { fromEmail: string; fromPassword: string; toEmail: string; toPassword: string; carId: number }) => safePost('/api/copy-single-car', data),
};

export const gameApi = {
  setMoney: (amount: number, creds?: { email?: string; password?: string }) => safePost('/api/set-money', { amount, ...creds }),
  setCoins: (amount: number, creds?: { email?: string; password?: string }) => safePost('/api/set-coin', { amount, ...creds }),
  setRaceWin: (amount: number, creds?: { email?: string; password?: string }) => safePost('/api/set-race-win', { amount, ...creds }),
  setRaceLose: (amount: number, creds?: { email?: string; password?: string }) => safePost('/api/set-race-lose', { amount, ...creds }),
  completeAllLevels: (creds?: { email?: string; password?: string }) => safePost('/api/complete-all-levels', { ...creds }),
  
  unlockMaleClothes: (creds?: { email?: string; password?: string }) => safePost('/api/unlock-male-clothes', { ...creds }),
  unlockFemaleClothes: (creds?: { email?: string; password?: string }) => safePost('/api/unlock-female-clothes', { ...creds }),
  unlockAllAnimations: (creds?: { email?: string; password?: string }) => safePost('/api/unlock-all-animations', { ...creds }),
  unlockAllHorns: (creds?: { email?: string; password?: string }) => safePost('/api/unlock-all-horns', { ...creds }),
  unlockAllSirens: (creds?: { email?: string; password?: string }) => safePost('/api/unlock-all-sirens', { ...creds }),
  unlockAllWheels: (creds?: { email?: string; password?: string }) => safePost('/api/unlock-all-wheels', { ...creds }),
  unlockPaidWheels: (creds?: { email?: string; password?: string }) => safePost('/api/unlock-paid-wheels', { ...creds }),
  
  unlockDisableVehicleDamage: (creds?: { email?: string; password?: string }) => safePost('/api/unlock-disable-vehicle-damage', { ...creds }),
  unlockW16: (creds?: { email?: string; password?: string }) => safePost('/api/unlock-w16', { ...creds }),
  unlockSmokeEffect: (creds?: { email?: string; password?: string }) => safePost('/api/unlock-smoke-effect', { ...creds }),
  unlockUnlimitedFuel: (creds?: { email?: string; password?: string }) => safePost('/api/unlock-unlimited-fuel', { ...creds }),
  
  unlockAllCars: (creds?: { email?: string; password?: string }) => safePost('/api/unlock-all-cars', { ...creds }),
  buyCar: (carId: number, creds?: { email?: string; password?: string }) => safePost('/api/buy-car', { carId, ...creds }),
  removeBumper: (carID: number[] | "all", front: boolean, rear: boolean, creds?: { email?: string; password?: string }) => safePost('/api/remove-bumper', { carID, front, rear, ...creds }),
  chrome: (carID: number[] | "all", options: {body?: string, window?: string, wheels?: string}, creds?: { email?: string; password?: string }) => safePost('/api/chrome', { carID, ...options, ...creds }),
};

export const authApi = {
  // Login can use direct api.post as it's the first entry point
  login: (credentials: any) => api.post('/api/get-player-records', credentials),
};

export default api;
