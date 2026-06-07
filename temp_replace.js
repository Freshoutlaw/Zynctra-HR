const fs = require('fs');
const path = require('path');
const root = path.join(process.cwd(), 'frontend', 'src');
const files = [];
function walk(dir) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name);
    if (name.isDirectory()) walk(full);
    else if (/\.(ts|tsx)$/.test(name.name)) files.push(full);
  }
}
walk(root);
let changed = 0;
for (const file of files) {
  let text = fs.readFileSync(file, 'utf8');
  const original = text;
  text = text.replace(/^(import\s+\{[^}]+\}\s+from\s+['\"]\.\.?\/types\/[^'\"]+['\"];?)$/mg, line => {
    if (line.startsWith('import type')) return line;
    return line.replace(/^import\s+/, 'import type ');
  });
  text = text.replace(/whileHover=\{([^?]+)\?\s*(\{[^}]+\})\s*:\s*undefined\}/g, 'whileHover={$1 ? $2 : {}}');
  text = text.replace(/whileTap=\{([^?]+)\?\s*(\{[^}]+\})\s*:\s*undefined\}/g, 'whileTap={$1 ? $2 : {}}');
  if (text !== original) {
    fs.writeFileSync(file, text, 'utf8');
    changed++;
  }
}
console.log('files changed:', changed);
