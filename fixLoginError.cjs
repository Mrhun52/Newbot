const fs = require('fs');
let code = fs.readFileSync('src/pages/Login.tsx', 'utf8');

code = code.replace(
  /let errorMessage = error\.response\?\.data\?\.message \|\| error\.message \|\| 'Invalid credentials';[\s\S]*?if \(errorMessage === 'Network Error'\) \{[\s\S]*?errorMessage = 'Network Error: The backend server on Railway appears to be down or crashed \(502 Bad Gateway\)\. Please check your Railway logs\.';[\s\S]*?\}/,
  `let errorMessage = error.response?.data?.message || error.message || 'Invalid credentials';
      if (errorMessage === 'Network Error' || String(error).includes('Network Error')) {
        errorMessage = 'Network Error: Backend Server (Railway) is offline or crashed. Please check your Railway deployment logs.';
      }`
);

fs.writeFileSync('src/pages/Login.tsx', code);
