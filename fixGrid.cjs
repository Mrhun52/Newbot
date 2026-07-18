const fs = require('fs');
let code = fs.readFileSync('src/pages/BulkAccounts.tsx', 'utf8');
code = code.replace(
  'const { accounts, selectedAccountIds, addAccount, removeAccount, toggleSelection, selectAll, deselectAll, updateAccount } = useMultiAccount();',
  'const { accounts, selectedAccountIds, addAccount, removeAccount, toggleSelection, selectAll, deselectAll, updateAccount, clearAccounts } = useMultiAccount();'
);

code = code.replace(
  '<Button variant="secondary" size="sm" onClick={deselectAll} disabled={accounts.length === 0}>\n                    Deselect\n                  </Button>',
  '<Button variant="secondary" size="sm" onClick={deselectAll} disabled={accounts.length === 0}>\n                    Deselect\n                  </Button>\n                  <Button variant="secondary" size="sm" onClick={clearAccounts} disabled={accounts.length === 0}>\n                    Clear All\n                  </Button>'
);
fs.writeFileSync('src/pages/BulkAccounts.tsx', code);
