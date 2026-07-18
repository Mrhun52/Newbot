const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

code = code.replace(
  '</Card>\n      </Card>\n      </motion.div>',
  '</Card>\n      </motion.div>'
);

code = code.replace(
  '</div>\n      </div>\n      </motion.div>',
  '</div>\n      </motion.div>'
);

fs.writeFileSync('src/pages/Dashboard.tsx', code);
