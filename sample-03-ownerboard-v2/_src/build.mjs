// Builds the single-file Sample 03 V2 from _src/page.html.
// Inlines: Lucide icons used, the shared interaction layer (_shared/), the white K7 logo.
// Usage: node _src/build.mjs <node_modules dir containing lucide-static>
import fs from 'node:fs'; import path from 'node:path';
const nm=path.resolve(process.argv[2]||'node_modules');
const here=path.dirname(new URL(import.meta.url).pathname);
const shared=path.join(here,'../../_shared');
let page=fs.readFileSync(path.join(here,'page.html'),'utf8');
const iconDir=path.join(nm,'lucide-static/icons');
const names=new Set([...page.matchAll(/["'`]([a-z0-9]+(?:-[a-z0-9]+)*)["'`]/g)].map(m=>m[1]).filter(n=>fs.existsSync(path.join(iconDir,n+'.svg'))));
const icons={};for(const n of names){icons[n]=fs.readFileSync(path.join(iconDir,n+'.svg'),'utf8').replace(/^[\s\S]*?<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'').replace(/\s*\n\s*/g,'');}
const logo=fs.readFileSync(path.join(shared,'brand/k7-logo-white.svg'),'utf8').replace(/viewBox="[^"]*"/,'viewBox="52 52 528 134"');
page=page.replace('/*ICONS*/','const ICONS='+JSON.stringify(icons)+';')
  .replace('/*SHARED_CSS*/',()=>fs.readFileSync(path.join(shared,'interactions.css'),'utf8'))
  .replace('/*SHARED_JS*/',()=>fs.readFileSync(path.join(shared,'interactions.js'),'utf8'))
  .split('__LOGO_WHITE__').join('data:image/svg+xml;base64,'+Buffer.from(logo).toString('base64'));
const out=path.join(here,'..','Sample 03 · Ownerboard V2 - Index.html');
fs.writeFileSync(out,page);console.log('icons',names.size,'bytes',page.length);
