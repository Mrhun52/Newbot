const fs = require('fs');

let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// Fix carsCount and stats
code = code.replace(
  'carsCount: carsCount || undefined,',
  'carsCount: carsCount,'
);

code = code.replace(
  /const stats = \[[\s\S]*?\];[\s\S]*?if \(user\?\.carsCount !== undefined\) \{[\s\S]*?\}/,
  `const stats = [
    { label: 'Total Money', value: \`$\${user?.money?.toLocaleString() || '0'}\`, icon: Wallet, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Game Coins', value: user?.coins?.toLocaleString() || '0', icon: Coins, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { label: 'Owned Cars', value: user?.carsCount?.toString() || '0', icon: Car, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Active Status', value: 'Online', icon: Activity, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ];`
);

// Quick actions to grid-cols-2 on mobile
code = code.replace(
  '<div className="grid grid-cols-1 md:grid-cols-2 gap-4">',
  '<div className="grid grid-cols-2 gap-3 md:gap-4">'
);

// Quick actions text size adjustments for mobile grid
code = code.replace(
  '<h4 className="text-lg font-bold text-white mb-1">{link.title}</h4>',
  '<h4 className="text-sm md:text-lg font-bold text-white mb-1 leading-tight">{link.title}</h4>'
);

code = code.replace(
  '<p className="text-sm text-neutral-300">{link.desc}</p>',
  '<p className="text-xs text-neutral-500 line-clamp-2 md:line-clamp-none">{link.desc}</p>'
);

code = code.replace(
  '<div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center group-hover:bg-neutral-700 transition-colors">',
  '<div className="hidden sm:flex w-10 h-10 rounded-full bg-neutral-800 items-center justify-center group-hover:bg-neutral-700 transition-colors">'
);

fs.writeFileSync('src/pages/Dashboard.tsx', code);
