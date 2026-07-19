const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

code = code.replace(
  '  ];\n\n  stats.pop(); // keep it to 4 items\n  }',
  '  ];'
);
// Also it seems my previous replacement left over `stats.pop(); // keep it to 4 items` and `}` because of how the regex matched.
// Let me just rewrite `src/pages/Dashboard.tsx` from line 115 to 130 manually if needed.
fs.writeFileSync('src/pages/Dashboard.tsx', code);
