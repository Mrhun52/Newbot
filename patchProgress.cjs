const fs = require('fs');
let code = fs.readFileSync('src/store/useProgress.ts', 'utf8');

code = code.replace(
  "await new Promise(r => setTimeout(r, 500)); // Briefly show 100%",
  "await new Promise(r => setTimeout(r, 2000)); // Show 100% and let confetti play"
);

fs.writeFileSync('src/store/useProgress.ts', code);
