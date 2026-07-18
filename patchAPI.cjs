const fs = require('fs');
let code = fs.readFileSync('src/services/api.ts', 'utf8');

code = code.replace(
  'config.data = {\n              ...config.data,\n              email: state.credentials.email,\n              password: state.credentials.password\n            };',
  'config.data = {\n              email: state.credentials.email,\n              password: state.credentials.password,\n              ...config.data\n            };'
);

fs.writeFileSync('src/services/api.ts', code);
