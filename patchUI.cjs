const fs = require('fs');

// Patch Sidebar
let sidebar = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');
sidebar = sidebar.replace(
  'className="hidden lg:flex flex-col w-64 h-screen bg-slate-950 border-r border-slate-800 p-4 fixed left-0 top-0 z-40"',
  'className="hidden lg:flex flex-col w-64 h-[calc(100vh-2rem)] bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-3xl p-4 fixed left-4 top-4 z-40 shadow-2xl"'
);
sidebar = sidebar.replace(
  'bg-blue-600/10 border border-blue-500/20 rounded-xl"',
  'bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-2xl"'
);
sidebar = sidebar.replace(
  'rounded-xl transition-colors",',
  'rounded-2xl transition-all duration-300",\n                !isActive && "hover:bg-white/5 hover:translate-x-1"'
);
sidebar = sidebar.replace(
  'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"',
  'text-slate-400 hover:text-white"'
);
sidebar = sidebar.replace(
  'text-blue-400"',
  'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"'
);
sidebar = sidebar.replace(
  'bg-blue-600 flex',
  'bg-gradient-to-br from-blue-500 to-indigo-600 flex'
);
fs.writeFileSync('src/components/layout/Sidebar.tsx', sidebar);


// Patch BottomNav
let bottomNav = fs.readFileSync('src/components/layout/BottomNav.tsx', 'utf8');
bottomNav = bottomNav.replace(
  'className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-800 px-2 pb-safe z-40"',
  'className="lg:hidden fixed bottom-6 left-4 right-4 bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-3xl px-2 py-2 z-40 shadow-[0_20px_40px_rgba(0,0,0,0.5)]"'
);
bottomNav = bottomNav.replace(
  'bg-blue-600/10 border-t-2 border-blue-500"',
  'bg-white/10 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"'
);
bottomNav = bottomNav.replace(
  'text-blue-400"',
  'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"'
);
bottomNav = bottomNav.replace(
  'className="flex items-center justify-around h-16"',
  'className="flex items-center justify-around h-14"'
);
fs.writeFileSync('src/components/layout/BottomNav.tsx', bottomNav);

// Patch DashboardLayout
let layout = fs.readFileSync('src/components/layout/DashboardLayout.tsx', 'utf8');
layout = layout.replace(
  'lg:pl-64',
  'lg:pl-[18rem]'
);
layout = layout.replace(
  'className="hidden lg:flex items-center justify-between px-8 py-4 border-b border-slate-800 bg-slate-950 sticky top-0 z-30"',
  'className="hidden lg:flex items-center justify-between px-8 py-4 mx-4 mt-4 bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-3xl sticky top-4 z-30 shadow-2xl"'
);
layout = layout.replace(
  'className="lg:hidden sticky top-0 z-40 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 py-3"',
  'className="lg:hidden sticky top-0 z-40 bg-slate-900/60 backdrop-blur-3xl border-b border-white/5 flex items-center justify-between px-4 py-4"'
);
layout = layout.replace(
  'bg-slate-900/50 border border-slate-800',
  'bg-white/5 border border-white/10 hover:bg-white/10'
);
fs.writeFileSync('src/components/layout/DashboardLayout.tsx', layout);
