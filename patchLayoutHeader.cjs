const fs = require('fs');

let code = fs.readFileSync('src/components/layout/DashboardLayout.tsx', 'utf8');

const oldMobileHeader = `<div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            <span className="text-white font-bold text-xl font-display">M</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent tracking-tight font-display">
            MR TOOL
          </h1>
        </div>`;

const newMobileHeader = `<div className="w-8" />
        <h1 className="text-lg md:text-xl font-bold text-white tracking-[0.2em] md:tracking-[0.3em] font-display absolute left-1/2 -translate-x-1/2">
          M R &nbsp;T O O L
        </h1>`;

code = code.replace(oldMobileHeader, newMobileHeader);

fs.writeFileSync('src/components/layout/DashboardLayout.tsx', code);
