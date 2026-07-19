const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// Remove AccountRiskMeter component
code = code.replace(
  /<motion\.div initial=\{\{ opacity: 0, y: 20 \}\} animate=\{\{ opacity: 1, y: 0 \}\} transition=\{\{ duration: 0\.4, delay: 0\.2 \}\}>\s*<AccountRiskMeter \/>\s*<\/motion\.div>/,
  ''
);

// Update stats grid to be grid-cols-2 on mobile
code = code.replace(
  '<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">',
  '<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">'
);

// Adjust stats text sizes for mobile
code = code.replace(
  '<p className="text-sm font-medium text-neutral-400">{stat.label}</p>',
  '<p className="text-xs md:text-sm font-medium text-neutral-400 truncate">{stat.label}</p>'
);

code = code.replace(
  '<h3 className="text-2xl font-bold text-white mt-0.5">{stat.value}</h3>',
  '<h3 className="text-lg md:text-2xl font-bold text-white mt-0.5 truncate">{stat.value}</h3>'
);

code = code.replace(
  '<div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} shadow-inner`}>',
  '<div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${stat.bg} shadow-inner shrink-0`}>'
);

code = code.replace(
  '<div className="flex items-center gap-4">',
  '<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">'
);

fs.writeFileSync('src/pages/Dashboard.tsx', code);
