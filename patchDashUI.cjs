const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

code = code.replace(
  "import { userApi } from '@/services/api';",
  "import { userApi, gameApi } from '@/services/api';\nimport { useProgress } from '@/store/useProgress';\nimport { useToast } from '@/store/useToast';\nimport { Button } from '@/components/ui/Button';"
);

code = code.replace(
  "const { setRisk, resetRisk } = useRisk();",
  `const { setRisk, resetRisk } = useRisk();\n  const { runWithProgress } = useProgress();\n  const { addToast } = useToast();\n  const [isMaxing, setIsMaxing] = useState(false);\n\n  const handleMaxAccount = async () => {\n    setIsMaxing(true);\n    try {\n      await runWithProgress(\n        'Maxing Account',\n        'Applying money, coins and unlocking all features...',\n        async () => {\n          await gameApi.setMoney(50000000);\n          await gameApi.setCoins(500000);\n          await gameApi.unlockMaleClothes();\n          await gameApi.unlockFemaleClothes();\n          await gameApi.unlockAllAnimations();\n          await gameApi.unlockAllHorns();\n          await gameApi.unlockAllSirens();\n          await gameApi.unlockAllWheels();\n          await gameApi.unlockPaidWheels();\n          await gameApi.unlockDisableVehicleDamage();\n          await gameApi.unlockW16();\n          await gameApi.unlockSmokeEffect();\n          await gameApi.unlockUnlimitedFuel();\n          await gameApi.unlockAllCars();\n          updateUser({ money: 50000000, coins: 500000 });\n          addToast({ title: 'Success', description: 'Account maxed out successfully!', type: 'success' });\n        },\n        {\n          durationMs: 6000,\n          steps: [\n            { progress: 20, text: 'Adding 50M Money & 500K Coins...' },\n            { progress: 50, text: 'Unlocking all clothes and animations...' },\n            { progress: 80, text: 'Unlocking all cars, engines, and perks...' },\n            { progress: 95, text: 'Finalizing account sync...' }\n          ]\n        }\n      );\n    } catch (e: any) {\n      addToast({ title: 'Error', description: e.message || 'Failed to max account', type: 'error' });\n    } finally {\n      setIsMaxing(false);\n    }\n  };`
);

code = code.replace(
  "Edit Profile\n          </Link>\n        </div>",
  `Edit Profile\n          </Link>\n          <Button\n            onClick={handleMaxAccount}\n            isLoading={isMaxing}\n            className="w-full sm:w-auto mt-2 sm:mt-0 sm:ml-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0"\n          >\n            Max Account (Unlock All)\n          </Button>\n        </div>`
);

fs.writeFileSync('src/pages/Dashboard.tsx', code);
