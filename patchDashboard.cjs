const fs = require('fs');

let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

code = code.replace(
  "import { Link } from 'react-router-dom';",
  "import { Link } from 'react-router-dom';\nimport { motion } from 'motion/react';"
);

code = code.replace(
  '<div className="space-y-6">',
  '<div className="space-y-6">\n      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>'
);

code = code.replace(
  '<Card className="flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-r from-blue-900/20 to-slate-900/50">',
  '</motion.div>\n\n      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>\n      <Card className="flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-r from-blue-900/20 to-slate-900/50">'
);

code = code.replace(
  '<AccountRiskMeter />',
  '</Card>\n      </motion.div>\n\n      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>\n      <AccountRiskMeter />\n      </motion.div>'
);

code = code.replace(
  '<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">',
  '<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>\n      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">'
);

code = code.replace(
  '<div className="pt-4">',
  '</div>\n      </motion.div>\n\n      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>\n      <div className="pt-4">'
);

code = code.replace(
  '</div>\n    </div>',
  '</div>\n      </motion.div>\n    </div>'
);

fs.writeFileSync('src/pages/Dashboard.tsx', code);
