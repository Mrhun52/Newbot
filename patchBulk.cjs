const fs = require('fs');
let code = fs.readFileSync('src/pages/BulkAccounts.tsx', 'utf8');

code = code.replace(
  '<option value="complete_levels">Complete All Levels</option>',
  '<option value="complete_levels">Complete All Levels</option>\n                    <option value="max_account">Max Account (50M, 500K, All Unlocks)</option>'
);

const actionCode = `              } else if (bulkActionType === 'complete_levels') {
                await gameApi.completeAllLevels(creds);
              } else if (bulkActionType === 'max_account') {
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
              }`;

code = code.replace(
  `} else if (bulkActionType === 'complete_levels') {
                await gameApi.completeAllLevels(creds);
              }`,
  actionCode
);

const progressSteps = `          durationMs: bulkActionType === 'max_account' ? selectedAccounts.length * 5000 : selectedAccounts.length * 2000,
          steps: [
            { progress: 10, text: 'Initializing bulk queues...' },
            { progress: 30, text: 'Applying money & coins...' },
            { progress: 60, text: 'Unlocking vehicles & features...' },
            { progress: 90, text: 'Finalizing account sync...' }
          ]`;

code = code.replace(
  `          durationMs: selectedAccounts.length * 2000,
          steps: [
            { progress: 10, text: 'Initializing bulk queues...' },
            { progress: 50, text: 'Executing actions per account...' },
            { progress: 90, text: 'Finalizing...' }
          ]`,
  progressSteps
);

fs.writeFileSync('src/pages/BulkAccounts.tsx', code);
