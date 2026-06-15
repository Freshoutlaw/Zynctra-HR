const fs = require('fs');
const path = require('path');
const root = path.join(process.cwd(),'frontend','src');
function walk(dir){
  for(const ent of fs.readdirSync(dir,{withFileTypes:true})){
    const full=path.join(dir,ent.name);
    if(ent.isDirectory()) walk(full);
    else if(/\.(ts|tsx)$/.test(ent.name)){
      let txt=fs.readFileSync(full,'utf8');
      const orig=txt;
      // fix whileHover/whileTap ternaries that return undefined -> return {}
      txt = txt.replace(/(whileHover=\{[^\}]*?:[^\}]*?):\s*undefined\}/g, '$1: {}}');
      txt = txt.replace(/(whileTap=\{[^\}]*?:[^\}]*?):\s*undefined\}/g, '$1: {}}');
      // also handle patterns like ? { ... } : undefined
      txt = txt.replace(/\?\s*(\{[^}]+\})\s*:\s*undefined/g, '? $1 : {}');
      if(txt!==orig){ fs.writeFileSync(full,txt,'utf8'); console.log('patched', full); }
    }
  }
}
walk(root);
console.log('done');
