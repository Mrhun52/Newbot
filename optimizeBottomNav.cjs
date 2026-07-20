const fs = require('fs');
let code = fs.readFileSync('src/components/layout/BottomNav.tsx', 'utf8');

// Replace layoutId and motion.div with a simple div for active state to reduce heavy layout recalculation lag
code = code.replace(/<motion\.div[\s\S]*?layoutId="bottomnav-active"[\s\S]*?transition=\{[^}]*\}[\s\S]*?\/>/, '<div className="absolute inset-0 bg-white/10 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" />');

fs.writeFileSync('src/components/layout/BottomNav.tsx', code);
