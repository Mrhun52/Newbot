const fs = require('fs');

let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(
  'money?: number;\n  coins?: number;',
  'money?: number;\n  coins?: number;\n  carsCount?: number;\n  unlockedFeatures?: string[];'
);

fs.writeFileSync('src/types.ts', code);
