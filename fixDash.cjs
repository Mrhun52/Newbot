const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

code = code.replace(
  '];);',
  '];'
);

fs.writeFileSync('src/pages/Dashboard.tsx', code);
