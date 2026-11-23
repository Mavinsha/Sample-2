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
page=page.replace('/*ICONS*/','const ICONS='+JSON.stringify(icons)+';').replace('<script>/*SCENE*/</script>',()=>'<script>'+scene.replace(/<\/script/gi,'<\\/script')+'</script>');
const out=path.join(here,'..','Sample 02 · Emberglass - Index.html');
fs.writeFileSync(out,page);console.log('icons',names.size,'bytes',page.length);
