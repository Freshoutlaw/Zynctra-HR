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
      const re = /(^\s*)import type \{([^}]+)\} from (['"][^'"]+['"];?)/mg;
      txt = txt.replace(re, (m, p1, names, src) => {
        const items = names.split(',').map(s=>s.trim().split(' as ')[0].trim()).filter(Boolean);
        const needRuntime = items.some(name => {
          const usageRegex = new RegExp('\\b'+name+'\\s*\\.', 'm');
          return usageRegex.test(txt);
        });
        if (needRuntime) {
          return p1 + 'import {' + names + '} from ' + src;
        }
        return m;
      });
      if(txt!==orig){ fs.writeFileSync(full,txt,'utf8'); console.log('patched', full); }
    }
  }
}
walk(root);
console.log('done');
