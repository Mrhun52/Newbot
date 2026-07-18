const fs = require('fs');
let code = fs.readFileSync('src/pages/Money.tsx', 'utf8');

code = code.replace(
  "import { Wallet, Coins, Trophy, Flag, Star } from 'lucide-react';",
  "import { Wallet, Coins, Trophy, Flag, Star } from 'lucide-react';\nimport { useRisk } from '@/store/useRisk';\nimport { AccountRiskMeter } from '@/components/ui/AccountRiskMeter';"
);

code = code.replace(
  "const { runWithProgress } = useProgress();",
  `const { runWithProgress } = useProgress();
  const { setRisk, resetRisk } = useRisk();

  import('react').then(({ useEffect }) => {
    useEffect(() => {
      let risk = 5;
      let message = 'Account operations are currently within safe limits.';
      let hasInput = false;

      if (moneyAmount) {
        hasInput = true;
        const amt = Number(moneyAmount);
        if (amt >= 500000000) {
          risk = 95;
          message = 'CRITICAL RISK: Adding 500M+ money instantly is highly likely to trigger auto-ban.';
        } else if (amt >= 100000000) {
          risk = 80;
          message = 'HIGH RISK: Amounts over 100M money often trigger manual review.';
        } else if (amt >= 50000000) {
          risk = 50;
          message = 'MODERATE RISK: Adding 50M money is noticeable. Proceed with caution.';
        } else {
          risk = 15;
          message = 'LOW RISK: This money amount is generally safe.';
        }
      } else if (coinsAmount) {
        hasInput = true;
        const amt = Number(coinsAmount);
        if (amt >= 1000000) {
          risk = 90;
          message = 'CRITICAL RISK: 1M+ coins flags account anomaly detectors.';
        } else if (amt >= 100000) {
          risk = 60;
          message = 'MODERATE RISK: Unusually high coin amount. Consider smaller batches.';
        } else {
          risk = 10;
          message = 'LOW RISK: This coin amount is generally safe.';
        }
      }

      if (hasInput) {
        setRisk(risk, message);
      } else {
        resetRisk();
      }
    }, [moneyAmount, coinsAmount, setRisk, resetRisk]);
  });`
);

code = code.replace(
  '<header className="mb-8">',
  '<header className="mb-6">'
);

code = code.replace(
  '<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">',
  '<div className="mb-6"><AccountRiskMeter /></div><div className="grid grid-cols-1 lg:grid-cols-2 gap-6">'
);

fs.writeFileSync('src/pages/Money.tsx', code);
