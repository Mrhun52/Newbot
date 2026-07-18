const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

code = code.replace(
  '        </div>\n      </motion.div>\n    </div>',
  '        </div>\n      </div>\n      </motion.div>\n    </div>'
);

fs.writeFileSync('src/pages/Dashboard.tsx', code);
