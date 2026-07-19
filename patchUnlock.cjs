const fs = require('fs');

let code = fs.readFileSync('src/pages/Unlock.tsx', 'utf8');

code = code.replace(
  "import { useProgress } from '@/store/useProgress';",
  "import { useProgress } from '@/store/useProgress';\nimport { useAuth } from '@/store/useAuth';"
);

code = code.replace(
  "const { runWithProgress } = useProgress();",
  "const { runWithProgress } = useProgress();\n  const { user, updateUser } = useAuth();"
);

// In handleUnlock success:
code = code.replace(
  "addToast({ title: 'Unlocked', description: `Successfully unlocked ${name}`, type: 'success' });",
  "addToast({ title: 'Unlocked', description: `Successfully unlocked ${name}`, type: 'success' });\n            updateUser({ unlockedFeatures: [...(user?.unlockedFeatures || []), id] });"
);

fs.writeFileSync('src/pages/Unlock.tsx', code);
