const fs = require('fs');
const file = 'src/components/Dashboard/ProjectGrid.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/const \{ getAuth \} = await import\('firebase\/auth'\);/g, "const { auth } = await import('../../lib/firebase');");
content = content.replace(/const user = getAuth\(\)\.currentUser;/g, "const user = auth.currentUser;");
fs.writeFileSync(file, content);
