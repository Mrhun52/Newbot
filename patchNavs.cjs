const fs = require('fs');

let sidebarCode = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');
sidebarCode = sidebarCode.replace(
  'w-64 h-[calc(100vh-2rem)] bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-3xl p-4 fixed left-4 top-4 z-40 shadow-2xl',
  'w-64 h-screen bg-[#0A0A0A] border-r border-neutral-800 p-4 fixed left-0 top-0 z-40'
);
sidebarCode = sidebarCode.replace(
  'bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]',
  'bg-white flex items-center justify-center'
);
sidebarCode = sidebarCode.replace(
  'text-white font-bold text-xl font-display',
  'text-black font-bold text-xl font-display'
);
sidebarCode = sidebarCode.replace(
  'text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight font-display',
  'text-xl font-bold text-white tracking-tight font-display'
);
sidebarCode = sidebarCode.replace(
  'shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-2xl',
  'rounded-xl bg-neutral-800/50'
);
sidebarCode = sidebarCode.replace(
  'hover:bg-white/5 hover:translate-x-1',
  'hover:bg-neutral-800/30'
);
sidebarCode = sidebarCode.replace(
  'drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]',
  ''
);
sidebarCode = sidebarCode.replace(
  'rounded-2xl',
  'rounded-xl'
);
fs.writeFileSync('src/components/layout/Sidebar.tsx', sidebarCode);

let bottomNavCode = fs.readFileSync('src/components/layout/BottomNav.tsx', 'utf8');
bottomNavCode = bottomNavCode.replace(
  'bottom-6 left-4 right-4 bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-3xl px-2 py-2 z-40 shadow-[0_20px_40px_rgba(0,0,0,0.5)]',
  'bottom-0 left-0 right-0 bg-[#0A0A0A]/90 backdrop-blur-xl border-t border-neutral-800 px-2 py-2 pb-safe z-40'
);
bottomNavCode = bottomNavCode.replace(
  'shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-2xl',
  'rounded-xl bg-neutral-800/50'
);
bottomNavCode = bottomNavCode.replace(
  'drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]',
  ''
);
fs.writeFileSync('src/components/layout/BottomNav.tsx', bottomNavCode);

let layoutCode = fs.readFileSync('src/components/layout/DashboardLayout.tsx', 'utf8');
layoutCode = layoutCode.replace(
  'lg:pl-72 p-4 lg:p-8',
  'lg:pl-64 p-4 lg:p-8'
);
layoutCode = layoutCode.replace(
  'max-w-5xl mx-auto space-y-8 pb-24 lg:pb-8 pt-16 lg:pt-0',
  'max-w-5xl mx-auto space-y-8 pb-24 lg:pb-8 pt-16 lg:pt-8'
);
// Also patch top bar for mobile to remove glowing header
layoutCode = layoutCode.replace(
  'bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-2xl p-4 shadow-2xl',
  'bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-neutral-800 p-4'
);
layoutCode = layoutCode.replace(
  'left-4 right-4',
  'left-0 right-0'
);
layoutCode = layoutCode.replace(
  'top-4',
  'top-0'
);
layoutCode = layoutCode.replace(
  'rounded-2xl',
  ''
);
fs.writeFileSync('src/components/layout/DashboardLayout.tsx', layoutCode);
