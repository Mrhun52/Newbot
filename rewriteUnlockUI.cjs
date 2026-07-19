const fs = require('fs');

let code = fs.readFileSync('src/pages/Unlock.tsx', 'utf8');

// Replace the return statement
const replaceStr = `const unlockedIds = user?.unlockedFeatures || [];
  const lockedActions = filteredActions.filter(a => !unlockedIds.includes(a.id));
  const unlockedActions = filteredActions.filter(a => unlockedIds.includes(a.id));

  return (
    <div className="space-y-6">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-white mb-2 font-display">Unlock Features</h1>
        <p className="text-neutral-400 text-sm">Unlock special items, properties, and abilities for your account.</p>
      </header>

      <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={\`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap text-sm \${
              activeCategory === cat.id 
                ? 'bg-white text-black shadow-md' 
                : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white border border-neutral-800'
            }\`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="space-y-8 pt-2">
        {lockedActions.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 font-display">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Available to Unlock
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {lockedActions.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                >
                  <Card className="h-full flex flex-col group border-neutral-800/80 hover:border-neutral-600 transition-colors p-4 cursor-pointer" onClick={() => handleUnlock(item.id, item.name, item.api)}>
                    <div className="flex flex-col items-center text-center flex-1">
                      <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center mb-3 text-neutral-300 group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all duration-300 shadow-sm border border-neutral-800 group-hover:border-white">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm md:text-base font-bold text-white mb-1 leading-tight">{item.name}</h3>
                      <p className="text-xs text-neutral-500 line-clamp-2">{item.desc}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-neutral-800/50">
                      <Button 
                        className="w-full text-xs py-1.5 h-8 bg-neutral-800 text-white hover:bg-white hover:text-black border-none" 
                        isLoading={unlockingId === item.id}
                        disabled={unlockingId !== null && unlockingId !== item.id}
                      >
                        Unlock
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {unlockedActions.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 font-display">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Already Unlocked
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {unlockedActions.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                >
                  <Card className="h-full flex flex-col group border-emerald-500/20 bg-emerald-500/5 p-4">
                    <div className="flex flex-col items-center text-center flex-1">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3 text-emerald-400 border border-emerald-500/20">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm md:text-base font-bold text-emerald-100 mb-1 leading-tight">{item.name}</h3>
                      <p className="text-xs text-emerald-500/70 line-clamp-2">{item.desc}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-emerald-500/10 flex justify-center">
                      <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Unlocked</span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};`;

code = code.replace(/const filteredActions = activeCategory === 'all'[\s\S]*?\n  return \([\s\S]*?\);\n};/, 
`const filteredActions = activeCategory === 'all' 
     ? unlockActions 
     : unlockActions.filter(a => a.category === activeCategory);

  const categories = [
    { id: 'all', label: 'All Unlocks' },
    { id: 'character', label: 'Character' },
    { id: 'vehicle', label: 'Vehicle Parts' },
    { id: 'performance', label: 'Performance' },
    { id: 'perks', label: 'Special Perks' },
  ];

  ${replaceStr}`);

fs.writeFileSync('src/pages/Unlock.tsx', code);
