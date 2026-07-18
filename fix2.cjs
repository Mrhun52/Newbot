const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

code = code.replace(
  /<\/Card>\s*<\/Card>\s*<\/motion.div>/g,
  '</Card>\n      </motion.div>'
);

code = code.replace(
  /<\/div>\s*<\/div>\s*<\/motion.div>\s*<motion.div initial=\{\{ opacity: 0, y: 20 \}\} animate=\{\{ opacity: 1, y: 0 \}\} transition=\{\{ duration: 0.4, delay: 0.4 \}\}>/g,
  '</div>\n      </motion.div>\n      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>'
);

fs.writeFileSync('src/pages/Dashboard.tsx', code);
