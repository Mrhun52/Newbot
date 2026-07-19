const fs = require('fs');
let code = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');

const oldHeader = `<div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
          <span className="text-black font-bold text-xl font-display">M</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight font-display">
          MR TOOL
        </h1>
      </div>`;

const newHeader = `<div className="flex flex-col items-center justify-center gap-3 mb-10 mt-4">
        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
          <span className="text-black font-bold text-2xl font-display">M</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-[0.3em] font-display">
          M R &nbsp;T O O L
        </h1>
      </div>`;

code = code.replace(oldHeader, newHeader);
fs.writeFileSync('src/components/layout/Sidebar.tsx', code);
