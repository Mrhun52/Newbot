const fs = require('fs');
let code = fs.readFileSync('src/services/api.ts', 'utf8');

code = code.replace(
  /export const userApi = \{([\s\S]*?)\};/,
  `export const userApi = {
  getProfile: (creds?: { email?: string; password?: string }) => safePost('/api/get-player-records', { ...creds }),
  updateName: (value: string, creds?: { email?: string; password?: string }) => safePost('/api/set-name', { value, ...creds }),
  updateId: (value: string, creds?: { email?: string; password?: string }) => safePost('/api/set-id', { value, ...creds }),
  copyAccount: (data: { fromEmail: string; fromPassword: string; toEmail: string; toPassword: string }) => 
    safePost('/api/copy-account', data),
};`
);

code = code.replace(
  /export const gameApi = \{([\s\S]*?)\};/,
  `export const gameApi = {
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
};`
);

fs.writeFileSync('src/services/api.ts', code);
