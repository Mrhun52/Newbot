const fs = require('fs');

let card = fs.readFileSync('src/components/ui/Card.tsx', 'utf8');
card = card.replace(
  "'bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden transition-colors hover:border-slate-700 group',",
  "'bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.12)] relative overflow-hidden transition-all duration-300 hover:bg-slate-900/60 hover:border-white/10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] group',"
);
card = card.replace(
  'whileHover={{ scale: 1.01, y: -2 }}',
  'whileHover={{ scale: 1.02, y: -5 }}'
);
fs.writeFileSync('src/components/ui/Card.tsx', card);
