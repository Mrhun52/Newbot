const fs = require('fs');

let login = fs.readFileSync('src/pages/Login.tsx', 'utf8');

login = login.replace(
  'p-8 bg-slate-900 border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.5)]',
  'p-10 bg-slate-900/60 backdrop-blur-3xl border-white/10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.6)]'
);

login = login.replace(
  'bg-blue-600',
  'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20'
);

login = login.replace(
  'bg-slate-950 border border-slate-800',
  'bg-black/20 border border-white/10 hover:bg-black/40 focus:bg-black/40 focus:border-blue-500/50'
);

login = login.replace(
  'bg-slate-950 border border-slate-800',
  'bg-black/20 border border-white/10 hover:bg-black/40 focus:bg-black/40 focus:border-blue-500/50'
);

fs.writeFileSync('src/pages/Login.tsx', login);
