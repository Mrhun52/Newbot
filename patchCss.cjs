const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

code += `
.animate-marquee {
  animation: marquee 20s linear infinite;
}
`;

fs.writeFileSync('src/index.css', code);
