const fs = require('fs');
let code = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');

code = code.replace(
  "{ icon: Users, label: 'Bulk Tools', href: '/bulk' },",
  ""
);

fs.writeFileSync('src/components/layout/Sidebar.tsx', code);
