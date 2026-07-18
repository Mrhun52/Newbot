const fs = require('fs');
let code = fs.readFileSync('src/pages/Money.tsx', 'utf8');

code = code.replace(
  "import { useState } from 'react';",
  "import { useState, useEffect } from 'react';"
);

code = code.replace(
  "import { Wallet, Coins, Trophy, Flag, Star } from 'lucide-react';",
  "import { Wallet, Coins, Trophy, Flag, Star } from 'lucide-react';\nimport { useRisk } from '@/store/useRisk';\nimport { AccountRiskMeter } from '@/components/ui/AccountRiskMeter';"
);

code = code.replace(
  "const { runWithProgress } = useProgress();",
  `const { runWithProgress } = useProgress();
  const { setRisk, resetRisk } = useRisk();

  useEffect(() => {
    let risk = 5;
    let message = 'Account operations are currently within safe limits.';
    let hasInput = false;

    if (moneyAmount) {
      hasInput = true;
      const amt = Number(moneyAmount);
      if (amt >= 50000000) {
        risk = 95;
        message = 'CRITICAL RISK: Adding 50M+ money instantly is highly likely to trigger auto-ban.';
      } else if (amt >= 10000000) {
        risk = 80;
        message = 'HIGH RISK: Amounts over 10M money often trigger manual review.';
      } else if (amt >= 5000000) {
        risk = 50;
        message = 'MODERATE RISK: Adding 5M money is noticeable. Proceed with caution.';
      } else {
        risk = 15;
        message = 'LOW RISK: This money amount is generally safe.';
      }
    } else if (coinsAmount) {
      hasInput = true;
      const amt = Number(coinsAmount);
      if (amt >= 100000) {
        risk = 90;
        message = 'CRITICAL RISK: 100K+ coins flags account anomaly detectors.';
      } else if (amt >= 50000) {
        risk = 60;
        message = 'MODERATE RISK: Unusually high coin amount. Consider smaller batches.';
      } else {
        risk = 10;
        message = 'LOW RISK: This coin amount is generally safe.';
      }
    } else if (raceWin || raceLose) {
      hasInput = true;
      const amt = Number(raceWin) || Number(raceLose);
      if (amt >= 10000) {
        risk = 80;
        message = 'HIGH RISK: 10K+ sudden race stat changes are suspicious.';
      } else {
        risk = 20;
        message = 'LOW RISK: These race stats are within reasonable limits.';
      }
    }

    if (hasInput) {
      setRisk(risk, message);
    } else {
      resetRisk();
    }
  }, [moneyAmount, coinsAmount, raceWin, raceLose, setRisk, resetRisk]);`
);

code = code.replace(
  '<header className="mb-8">',
  '<header className="mb-6">'
);

code = code.replace(
  '<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">',
  '<div className="mb-6"><AccountRiskMeter /></div>\n      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">'
);

fs.writeFileSync('src/pages/Money.tsx', code);
