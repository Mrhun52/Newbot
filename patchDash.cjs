const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

code = code.replace(
  "import { Link } from 'react-router-dom';",
  "import { Link } from 'react-router-dom';\nimport { AccountRiskMeter } from '@/components/ui/AccountRiskMeter';\nimport { useRisk } from '@/store/useRisk';"
);

code = code.replace(
  "const [isLoading, setIsLoading] = useState(true);",
  `const [isLoading, setIsLoading] = useState(true);
  const { setRisk, resetRisk } = useRisk();`
);

code = code.replace(
  "setIsLoading(false);\n      }",
  `setIsLoading(false);
      }
      
      if (user) {
        let risk = 5;
        let message = 'Account is in good standing.';
        
        if (user.money && user.money >= 100000000) {
          risk = 90;
          message = 'CRITICAL: Very high bank balance detected. High risk of auto-ban.';
        } else if (user.money && user.money >= 50000000) {
          risk = 60;
          message = 'MODERATE: Large bank balance. Avoid drawing attention.';
        } else if (user.coins && user.coins >= 1000000) {
          risk = 70;
          message = 'HIGH: Large amount of premium coins detected.';
        }
        
        setRisk(risk, message);
      }`
);

code = code.replace(
  '<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">',
  '<AccountRiskMeter />\n      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">'
);

fs.writeFileSync('src/pages/Dashboard.tsx', code);
