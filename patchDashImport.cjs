const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

code = code.replace(
  "import { Coins, Wallet, Trophy, User, ArrowUpRight, Activity } from 'lucide-react';",
  "import { Coins, Wallet, Trophy, User, ArrowUpRight, Activity, Car } from 'lucide-react';"
);

fs.writeFileSync('src/pages/Dashboard.tsx', code);
