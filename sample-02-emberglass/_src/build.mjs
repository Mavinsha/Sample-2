// Builds the single-file sample from _src/page.html + _src/scene.js.
// Usage: node _src/build.mjs <node_modules dir containing three, lucide-static, esbuild>
import fs from 'node:fs'; import path from 'node:path'; import {createRequire} from 'node:module';
const nm=path.resolve(process.argv[2]||'node_modules');
const require=createRequire(path.join(nm,'x.js'));
const esbuild=require('esbuild');
const here=path.dirname(new URL(import.meta.url).pathname);
let page=fs.readFileSync(path.join(here,'page.html'),'utf8');
const iconDir=path.join(nm,'lucide-static/icons');
const names=new Set([...page.matchAll(/["'`]([a-z0-9]+(?:-[a-z0-9]+)*)["'`]/g)].map(m=>m[1]).filter(n=>fs.existsSync(path.join(iconDir,n+'.svg'))));
const icons={};for(const n of names){icons[n]=fs.readFileSync(path.join(iconDir,n+'.svg'),'utf8').replace(/^[\s\S]*?<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'').replace(/\s*\n\s*/g,'');}
const scene=esbuild.buildSync({entryPoints:[path.join(here,'scene.js')],bundle:true,minify:true,format:'iife',write:false,nodePaths:[nm],legalComments:'none'}).outputFiles[0].text;
// inline images from _src/img as data URIs: __IMG_<file-stem>__
const imgDir=path.join(here,'img');
if(fs.existsSync(imgDir))for(const f of fs.readdirSync(imgDir)){const stem=f.replace(/\.[^.]+$/,'');const ext=f.split('.').pop();
  const mime={webp:'image/webp',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg'}[ext];
  page=page.split(`__IMG_${stem}__`).join(`data:${mime};base64,`+fs.readFileSync(path.join(imgDir,f)).toString('base64'));}
// brand logo (white), cropped to the artwork bounds
const logo=fs.readFileSync(path.join(here,'../../_shared/brand/k7-logo-white.svg'),'utf8').replace(/viewBox="[^"]*"/,'viewBox="52 52 528 134"');
page=page.split('__LOGO_WHITE__').join('data:image/svg+xml;base64,'+Buffer.from(logo).toString('base64'));
page=page.replace('/*ICONS*/','const ICONS='+JSON.stringify(icons)+';').replace('<script>/*SCENE*/</script>',()=>'<script>'+scene.replace(/<\/script/gi,'<\\/script')+'</script>');
const out=path.join(here,'..','Sample 02 · Emberglass - Index.html');
fs.writeFileSync(out,page);console.log('icons',names.size,'bytes',page.length);
