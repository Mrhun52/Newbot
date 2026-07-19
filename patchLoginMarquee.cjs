const fs = require('fs');
let code = fs.readFileSync('src/pages/Login.tsx', 'utf8');

code = code.replace(
  'animate-[marquee_20s_linear_infinite]',
  'animate-marquee'
);

fs.writeFileSync('src/pages/Login.tsx', code);
