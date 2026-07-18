const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

code = code.replace(
  `      if (user) {
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
      }`,
  ""
);

code = code.replace(
  "fetchProfile();\n  }, []);",
  `fetchProfile();\n  }, []);\n\n  useEffect(() => {\n    if (user) {\n      let risk = 5;\n      let message = 'Account is in good standing.';\n      \n      if (user.money && user.money >= 100000000) {\n        risk = 90;\n        message = 'CRITICAL: Very high bank balance detected. High risk of auto-ban.';\n      } else if (user.money && user.money >= 50000000) {\n        risk = 60;\n        message = 'MODERATE: Large bank balance. Avoid drawing attention.';\n      } else if (user.coins && user.coins >= 1000000) {\n        risk = 70;\n        message = 'HIGH: Large amount of premium coins detected.';\n      }\n      \n      setRisk(risk, message);\n    }\n  }, [user?.money, user?.coins, setRisk]);`
);

fs.writeFileSync('src/pages/Dashboard.tsx', code);
