const fs = require('fs');
let code = fs.readFileSync('src/pages/BulkAccounts.tsx', 'utf8');

code = code.replace(
  'const handleBulkAction = async () => {',
  'const handleBulkAction = async (actionType: string) => {'
);

code = code.replace(
  /bulkActionType/g,
  'actionType'
);

// Note: setBulkActionType and bulkActionType state are no longer used but we don't necessarily have to remove the useState line to fix the functionality. Let's just remove the dropdown UI and add buttons.

code = code.replace(
  `              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="w-full sm:w-1/3">
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Action</label>
                  <select 
                    value={actionType}
                    onChange={(e) => setBulkActionType(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all appearance-none"
                  >
                    <option value="money">Set Money</option>
                    <option value="coins">Set Coins</option>
                    <option value="unlock_cars">Unlock All Cars</option>
                    <option value="complete_levels">Complete All Levels</option>
                    <option value="max_account">Max Account (50M, 500K, All Unlocks)</option>
                  </select>
                </div>
                {['money', 'coins'].includes(actionType) && (
                  <div className="w-full sm:w-1/3">
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Amount</label>
                    <Input 
                      type="number"
                      placeholder="Enter amount"
                      value={bulkAmount}
                      onChange={(e) => setBulkAmount(e.target.value)}
                    />
                  </div>
                )}
                <div className="w-full sm:w-auto mt-4 sm:mt-0 flex-1">
                  <Button 
                    className="w-full" 
                    onClick={handleBulkAction}
                    isLoading={isProcessing}
                    disabled={selectedAccountIds.length === 0}
                  >
                    Execute Action
                  </Button>
                </div>
              </div>`,
  `              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-500/20" 
                  onClick={() => handleBulkAction('max_account')}
                  isLoading={isProcessing}
                  disabled={selectedAccountIds.length === 0}
                >
                  Max Account (Unlock All)
                </Button>
                <Button 
                  className="w-full bg-slate-800 hover:bg-slate-700" 
                  onClick={() => handleBulkAction('complete_levels')}
                  isLoading={isProcessing}
                  disabled={selectedAccountIds.length === 0}
                >
                  Complete All Levels
                </Button>
                <Button 
                  className="w-full bg-slate-800 hover:bg-slate-700" 
                  onClick={() => handleBulkAction('unlock_cars')}
                  isLoading={isProcessing}
                  disabled={selectedAccountIds.length === 0}
                >
                  Unlock All Cars
                </Button>
              </div>`
);

fs.writeFileSync('src/pages/BulkAccounts.tsx', code);
