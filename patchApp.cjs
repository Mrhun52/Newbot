const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "import { Account } from './pages/Account';",
  "import { Account } from './pages/Account';\nimport { BulkAccounts } from './pages/BulkAccounts';"
);

code = code.replace(
  '<Route path="/account" element={<ProtectedRoute><DashboardLayout><Account /></DashboardLayout></ProtectedRoute>} />',
  '<Route path="/account" element={<ProtectedRoute><DashboardLayout><Account /></DashboardLayout></ProtectedRoute>} />\n        <Route path="/bulk" element={<ProtectedRoute><DashboardLayout><BulkAccounts /></DashboardLayout></ProtectedRoute>} />'
);

fs.writeFileSync('src/App.tsx', code);
