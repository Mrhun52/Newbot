const fs = require('fs');
let code = fs.readFileSync('src/pages/Login.tsx', 'utf8');

code = code.replace(
  /const errorMessage = error\.response\?\.data\?\.message \|\| error\.message \|\| 'Invalid credentials';/,
  `let errorMessage = error.response?.data?.message || error.message || 'Invalid credentials';
      if (errorMessage === 'Network Error') {
        errorMessage = 'Network Error: The backend server on Railway appears to be down or crashed (502 Bad Gateway). Please check your Railway logs.';
      }`
);

fs.writeFileSync('src/pages/Login.tsx', code);
