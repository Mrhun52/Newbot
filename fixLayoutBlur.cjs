const fs = require('fs');
let code = fs.readFileSync('src/components/layout/DashboardLayout.tsx', 'utf8');
code = code.replace(/backdrop-blur-3xl/g, 'backdrop-blur-md');
fs.writeFileSync('src/components/layout/DashboardLayout.tsx', code);
