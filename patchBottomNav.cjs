const fs = require('fs');
let code = fs.readFileSync('src/components/layout/BottomNav.tsx', 'utf8');

code = code.replace(
  "{ icon: Users, label: 'Bulk', href: '/bulk' },",
  ""
);

code = code.replace(
  "{ icon: Users, label: 'Bulk Tools', href: '/bulk' },",
  ""
);

fs.writeFileSync('src/components/layout/BottomNav.tsx', code);
