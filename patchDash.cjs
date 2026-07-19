const fs = require('fs');

let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

code = code.replace(
  'bg-gradient-to-r from-blue-900/20 to-slate-900/50',
  ''
);

code = code.replace(
  'w-20 h-20 rounded-full bg-slate-800 border-2 border-blue-500/50 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(37,99,235,0.2)]',
  'w-20 h-20 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0'
);

code = code.replace(
  'bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-medium transition-colors border border-slate-700',
  'bg-neutral-800 hover:bg-neutral-700 rounded-xl text-sm font-medium transition-colors border border-neutral-700 text-white'
);

code = code.replace(
  'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0',
  'bg-white text-black hover:bg-neutral-200 border border-neutral-200 font-semibold shadow-sm'
);

code = code.replace(
  "color: 'from-emerald-600/20 to-emerald-900/20'",
  "color: 'hover:border-emerald-500/50 transition-colors'"
);
code = code.replace(
  "color: 'from-blue-600/20 to-blue-900/20'",
  "color: 'hover:border-blue-500/50 transition-colors'"
);
code = code.replace(
  "color: 'from-purple-600/20 to-purple-900/20'",
  "color: 'hover:border-purple-500/50 transition-colors'"
);
code = code.replace(
  "color: 'from-amber-600/20 to-amber-900/20'",
  "color: 'hover:border-amber-500/50 transition-colors'"
);

code = code.replace(
  'bg-gradient-to-br ${link.color} border-slate-800',
  '${link.color} group'
);

code = code.replace(
  'bg-black/20 flex items-center justify-center backdrop-blur-md',
  'bg-neutral-800 flex items-center justify-center group-hover:bg-neutral-700 transition-colors'
);

fs.writeFileSync('src/pages/Dashboard.tsx', code);
