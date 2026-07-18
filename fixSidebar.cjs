const fs = require('fs');
let code = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');

code = code.replace(
  '!isActive && "hover:bg-white/5 hover:translate-x-1"\n                isActive ?',
  '!isActive && "hover:bg-white/5 hover:translate-x-1",\n                isActive ?'
);

fs.writeFileSync('src/components/layout/Sidebar.tsx', code);
