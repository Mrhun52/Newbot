const fs = require('fs');
let code = fs.readFileSync('src/pages/Login.tsx', 'utf8');

code = code.replace(
  'className="flex whitespace-nowrap animate-marquee"',
  'className="flex w-max whitespace-nowrap animate-marquee"'
);

fs.writeFileSync('src/pages/Login.tsx', code);
