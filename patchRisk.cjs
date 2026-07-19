const fs = require('fs');

let code = fs.readFileSync('src/components/ui/AccountRiskMeter.tsx', 'utf8');

code = code.replace(
  "glow: 'shadow-[0_0_20px_rgba(244,63,94,0.4)]',",
  "glow: 'shadow-none',"
);
code = code.replace(
  "glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]',",
  "glow: 'shadow-none',"
);
code = code.replace(
  "glow: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]',",
  "glow: 'shadow-none',"
);

code = code.replace(
  '<div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-neutral-900 shadow-inner ${styles.glow} transition-all duration-500`}>',
  '<div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-[#000000] border border-neutral-800 ${styles.glow} transition-all duration-500`}>'
);

fs.writeFileSync('src/components/ui/AccountRiskMeter.tsx', code);
