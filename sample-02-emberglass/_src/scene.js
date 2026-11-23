import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {Reflector} from 'three/examples/jsm/objects/Reflector.js';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/examples/jsm/postprocessing/OutputPass.js';
import {mergeVertices} from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const host=document.getElementById('scene');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let renderer;
try{ renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'}); }catch(e){ throw e; }
renderer.setPixelRatio(Math.min(devicePixelRatio*(parseFloat(getComputedStyle(document.documentElement).zoom)||1),2));
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=0.95;
host.appendChild(renderer.domElement);

const scene=new THREE.Scene();
scene.fog=new THREE.Fog(0x7a2c14,34,95);

/* rng */
let seed=11;const rnd=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};

/* sky dome */
const sunDir=new THREE.Vector3(0.12,0.025,-1).normalize();
const skyMat=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,
  uniforms:{sunDir:{value:sunDir}},
  vertexShader:`varying vec3 vP;void main(){vP=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
  fragmentShader:`varying vec3 vP;uniform vec3 sunDir;
  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
  float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.03;a*=.5;}return v;}
  void main(){
    vec3 d=normalize(vP);float h=d.y;
    vec3 top=vec3(.018,.005,.006), mid=vec3(.2,.04,.018), hor=vec3(.95,.3,.06), low=vec3(.16,.04,.015);
    vec3 c=h>0.?mix(hor,mid,smoothstep(0.,.16,h)):mix(hor,low,smoothstep(0.,-.15,h));
    if(h>0.)c=mix(c,top,smoothstep(.16,.62,h));
    float s=max(dot(d,sunDir),0.);
    c+=vec3(1.2,.42,.1)*pow(s,12.)*.55+vec3(2.,1.1,.45)*pow(s,260.)*1.1+vec3(5.,3.6,2.2)*pow(s,3000.);
    // clouds
    vec2 uv=d.xz/(h+.12)*1.6;
    float cl=smoothstep(.52,.85,fbm(uv*1.2+vec2(3.,1.)));
    float band=smoothstep(.02,.1,h)*(1.-smoothstep(.3,.5,h));
    vec3 cc=mix(vec3(.3,.07,.04),vec3(1.3,.5,.18),pow(s,4.));
    c=mix(c,cc,cl*band*.7);
    gl_FragColor=vec4(c,1.);
  }`});
const sky=new THREE.Mesh(new THREE.SphereGeometry(300,48,24),skyMat);
scene.add(sky);

/* environment for reflections */
const pmrem=new THREE.PMREMGenerator(renderer);
const envScene=new THREE.Scene();envScene.add(new THREE.Mesh(sky.geometry,skyMat));
scene.environment=pmrem.fromScene(envScene,0.03).texture;

/* lights */
scene.add(new THREE.HemisphereLight(0xffb98a,0x220c06,0.55));
const sun=new THREE.DirectionalLight(0xffa060,2.6);sun.position.set(6,6,-24);scene.add(sun);
const fill=new THREE.DirectionalLight(0xff8a5a,0.9);fill.position.set(-10,7,12);scene.add(fill);

/* water */
const dpr=renderer.getPixelRatio();
const water=new Reflector(new THREE.PlaneGeometry(400,400),{clipBias:0.003,textureWidth:innerWidth*dpr*.5,textureHeight:innerHeight*dpr*.5,color:0x7a6258});
water.rotation.x=-Math.PI/2;scene.add(water);

/* mountains */
function ridge(z,base,amp,color,x0=-120,x1=120,freq=.06){
  const sh=new THREE.Shape();sh.moveTo(x0,-2);
  for(let x=x0;x<=x1;x+=1.5){const y=base+amp*(Math.sin(x*freq+z)*.5+Math.sin(x*freq*2.7+z*1.7)*.3+Math.sin(x*freq*6.1)*.12)+amp*.4;sh.lineTo(x,Math.max(.1,y));}
  sh.lineTo(x1,-2);sh.lineTo(x0,-2);
  const m=new THREE.Mesh(new THREE.ShapeGeometry(sh),new THREE.MeshBasicMaterial({color}));m.position.z=z;scene.add(m);
}
ridge(-62,4,7,0x6e2c1c);
ridge(-48,2.2,5,0x4c1d14);
ridge(-36,.6,3,0x34140e,-60,60,.09);

/* rocks */
let rockGeo=mergeVertices(new THREE.IcosahedronGeometry(1,5));
{const p=rockGeo.attributes.position,v=new THREE.Vector3();for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);const n=1+.06*Math.sin(v.x*3.1+v.y*2.3)+.04*Math.sin(v.z*5.7);v.multiplyScalar(n);p.setXYZ(i,v.x,v.y,v.z);}rockGeo.computeVertexNormals();}
const rockMat=new THREE.MeshStandardMaterial({color:0xc99c88,roughness:.42,metalness:0,envMapIntensity:.7});
function rock(x,z,s,sy=.55,ry=0){const m=new THREE.Mesh(rockGeo,rockMat);m.position.set(x,s*sy*.25,z);m.scale.set(s,s*sy,s*.85);m.rotation.y=ry;scene.add(m);return m;}
[[-11,3,2.2],[-8.6,4.6,1.6],[-13.5,1,2.6],[11.5,3.5,2.4],[9.2,5.2,1.4],[14,.5,2.8],[8.6,1.6,1.1],[10.4,-4.6,2.0],[11.4,-7.5,1.5],[1.2,-9.5,2.2],[-3.5,-12,1.8],[6.4,-10.4,1.4]].forEach(([x,z,s],i)=>rock(x,z,s,.45+rnd()*.25,rnd()*6));

/* foliage + glowing flowers */
const leafMat=new THREE.MeshStandardMaterial({color:0x31401f,roughness:.9});
const leafGeo=new THREE.DodecahedronGeometry(.5,1);
function bush(x,z,s){const g=new THREE.Group();for(let i=0;i<7;i++){const m=new THREE.Mesh(leafGeo,leafMat);m.position.set((rnd()-.5)*1.4*s,rnd()*1.1*s+.2,(rnd()-.5)*1.0*s);m.scale.setScalar(s*(.5+rnd()*.6));g.add(m);}g.position.set(x,0,z);scene.add(g);}
[[-12,4.5,1.5],[-14.5,2.4,1.8],[12.8,4.8,1.4],[15,2,1.6],[7.4,-10.6,1],[-2.2,-12.4,1.1]].forEach(a=>bush(...a));
{const N=160,pos=new Float32Array(N*3),col=new Float32Array(N*3);const spots=[[-12,4.5],[-14.5,2.4],[12.8,4.8],[15,2],[-9,4.6],[10,5.2]];
 for(let i=0;i<N;i++){const s=spots[i%spots.length];pos[i*3]=s[0]+(rnd()-.5)*3;pos[i*3+1]=.3+rnd()*1.6;pos[i*3+2]=s[1]+(rnd()-.5)*2.4;const c=rnd()>.5?[3.,1.2,.4]:[2.6,.6,1.1];col.set(c,i*3);}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('color',new THREE.BufferAttribute(col,3));
 scene.add(new THREE.Points(g,new THREE.PointsMaterial({size:.12,vertexColors:true,toneMapped:false})));}

/* arch */
const AX=4.6,AZ=-6;
const arch=new THREE.Group();arch.position.set(AX,0,AZ);arch.rotation.y=-.38;arch.scale.setScalar(1.15);scene.add(arch);
const archMat=new THREE.MeshPhysicalMaterial({color:0xf3d2bc,metalness:1,roughness:.1,clearcoat:1,clearcoatRoughness:.08,iridescence:.85,iridescenceIOR:1.7,iridescenceThicknessRange:[200,800],envMapIntensity:1.6});
const archMesh=new THREE.Mesh(new THREE.TorusGeometry(2.9,.36,48,240,Math.PI),archMat);arch.add(archMesh);
const neon=new THREE.MeshBasicMaterial({color:new THREE.Color(4.5,1.6,.45),toneMapped:false});
arch.add(new THREE.Mesh(new THREE.TorusGeometry(2.53,.035,12,240,Math.PI),neon));
const neon2=new THREE.Mesh(new THREE.TorusGeometry(3.27,.02,8,240,Math.PI),new THREE.MeshBasicMaterial({color:new THREE.Color(2.6,1.0,.35),toneMapped:false}));arch.add(neon2);
const pad=new THREE.Mesh(new THREE.CylinderGeometry(4.2,4.5,.35,64),new THREE.MeshStandardMaterial({color:0xcfa592,roughness:.45}));pad.position.y=.05;arch.add(pad);
const pad2=new THREE.Mesh(new THREE.CylinderGeometry(3.4,3.6,.25,64),new THREE.MeshStandardMaterial({color:0xe2c0ae,roughness:.4}));pad2.position.y=.3;arch.add(pad2);

/* glass cubes */
const glass=(color,att)=>new THREE.MeshPhysicalMaterial({color,transmission:1,thickness:1.1,roughness:.04,ior:1.55,attenuationColor:att,attenuationDistance:.7,emissive:att,emissiveIntensity:.42,clearcoat:1,iridescence:.45,iridescenceIOR:1.5,envMapIntensity:2.4});
const mats=[glass(0xffd2a0,0xff7a22),glass(0xffb57a,0xff5a10),glass(0xffe8c8,0xffa040)];
const goldMat=new THREE.MeshPhysicalMaterial({color:0xffb45a,metalness:1,roughness:.18,clearcoat:1,envMapIntensity:1.5});
const cubeGeo=new RoundedBoxGeometry(1,1,1,5,.12);
const cluster=new THREE.Group();cluster.position.set(AX,2.95,AZ+.2);cluster.scale.setScalar(1.25);scene.add(cluster);
const offs=[[-.55,-.55,-.55],[.55,-.55,-.55],[-.55,.55,-.55],[.55,.55,-.55],[-.55,-.55,.55],[.55,-.55,.55],[-.55,.55,.55],[.55,.55,.55]];
offs.forEach((o,i)=>{const m=new THREE.Mesh(cubeGeo,i===3||i===4?goldMat:mats[i%3]);m.position.set(o[0]*1.04+(rnd()-.5)*.12,o[1]*1.04+(rnd()-.5)*.12,o[2]*1.04);m.scale.setScalar(.92);m.rotation.set((rnd()-.5)*.2,(rnd()-.5)*.2,0);cluster.add(m);});
const core=new THREE.Mesh(new THREE.SphereGeometry(.28,24,16),new THREE.MeshBasicMaterial({color:new THREE.Color(6,2.6,.9),toneMapped:false}));cluster.add(core);
const coreLight=new THREE.PointLight(0xff7a2a,28,7,1.6);cluster.add(coreLight);
cluster.rotation.set(.5,.7,.15);
const floaters=[];
[[1.6,6.0,-5.6,.55],[2.6,4.7,-2.4,.4],[7.4,5.9,-5.2,.62],[8.6,3.9,-3.6,.4],[4.2,7.2,-8.5,.5],[9.6,6.6,-7,.36]].forEach(([x,y,z,s],i)=>{
  const m=new THREE.Mesh(cubeGeo,i%3===1?goldMat:mats[i%3]);m.position.set(x,y,z);m.scale.setScalar(s);m.rotation.set(rnd()*3,rnd()*3,rnd()*3);
  m.userData={x,y,z,sp:.4+rnd()*.5,ph:rnd()*6,rx:(rnd()-.5)*.6,ry:(rnd()-.5)*.6,dir:new THREE.Vector3(x-AX,y-2.95,z-AZ).normalize()};scene.add(m);floaters.push(m);});

/* orb */
const orb=new THREE.Mesh(new THREE.SphereGeometry(.62,48,32),new THREE.MeshPhysicalMaterial({color:0xffe6d0,transmission:1,thickness:1.2,roughness:0,ior:1.4,iridescence:.7,clearcoat:1,envMapIntensity:1.6}));
orb.position.set(9,1.25,-3.4);scene.add(orb);
rock(9,-3.4,1.5,.45);
const spark=new THREE.Mesh(new THREE.SphereGeometry(.16,16,12),new THREE.MeshBasicMaterial({color:new THREE.Color(5,3.2,1.6),toneMapped:false}));spark.position.copy(orb.position);scene.add(spark);
const orbLight=new THREE.PointLight(0xffa050,10,5,1.8);orbLight.position.copy(orb.position);scene.add(orbLight);

/* camera + post */
const camera=new THREE.PerspectiveCamera(38,1,.1,600);
const composer=new EffectComposer(renderer);
composer.addPass(new RenderPass(scene,camera));
const bloom=new UnrealBloomPass(new THREE.Vector2(1,1),.75,.5,.95);composer.addPass(bloom);
composer.addPass(new OutputPass());

const base={pos:new THREE.Vector3(),look:new THREE.Vector3()};
function frameCam(){
  const w=host.clientWidth,h=host.clientHeight,a=w/h;
  renderer.setSize(w,h,false);composer.setSize(w,h);bloom.setSize(w,h);
  camera.aspect=a;
  if(a<.8){base.pos.set(4.6,3.2,21);base.look.set(5.0,5.6,-5);camera.fov=46;}
  else if(a<1.3){base.pos.set(2.4,2.6,16);base.look.set(3.6,2.8,-5);camera.fov=40;}
  else {base.pos.set(-1.6,2.4,13.5);base.look.set(-.2,2.9,-5);camera.fov=38;}
  camera.updateProjectionMatrix();camera.position.copy(base.pos);camera.lookAt(base.look);
}
frameCam();
let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(frameCam,120)});

const mouse={x:0,y:0};addEventListener('pointermove',e=>{mouse.x=e.clientX/innerWidth-.5;mouse.y=e.clientY/innerHeight-.5;},{passive:true});
const clock=new THREE.Clock();let running=true,frames=0,snapped=false,burst=0,spin=0;
document.querySelector('.hero').addEventListener('pointerdown',e=>{if(e.target.closest('a,button,input,select,form,.nav-item'))return;burst=1;});
function update(t){
  burst*=.965;spin+=.003+burst*.11;
  cluster.rotation.y=.7+spin+mouse.x*.5;cluster.rotation.x=.5+Math.sin(t*.4)*.12+mouse.y*.35;cluster.position.y=2.95+Math.sin(t*.8)*.08;
  cluster.scale.setScalar(1.25*(1+burst*.12));bloom.strength=.75+burst*.35;
  floaters.forEach(m=>{const u=m.userData,k=burst*2.4;m.position.set(u.x+u.dir.x*k,u.y+Math.sin(t*u.sp+u.ph)*.22+u.dir.y*k,u.z+u.dir.z*k);m.rotation.x+=u.rx*.01*(1+burst*12);m.rotation.y+=u.ry*.01*(1+burst*12);});
  const p=1+Math.sin(t*2)*.18;spark.scale.setScalar(p);orbLight.intensity=9+Math.sin(t*2)*3;coreLight.intensity=26+Math.sin(t*1.6)*6+burst*70;
  camera.position.x+=((base.pos.x+mouse.x*1.2)-camera.position.x)*.04;
  camera.position.y+=((base.pos.y-mouse.y*.6)-camera.position.y)*.04;
  camera.lookAt(base.look);
}
function snapshot(){
  const hero=renderer.domElement.toDataURL('image/jpeg',.82);
  document.body.style.setProperty('--snap',`url(${hero})`);
  document.querySelector('.mssp-bg').style.backgroundImage=`url(${hero})`;
}
function loop(){
  if(!running)return;
  const t=clock.getElapsedTime();
  update(t);composer.render();frames++;
  if(!snapped&&frames>=8){snapped=true;snapshot();}
  requestAnimationFrame(loop);
}
if(reduce){update(0);composer.render();snapshot();}
else{
  loop();
  new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&!running){running=true;clock.start();loop();}else if(!e.isIntersecting){running=false;}})).observe(host);
}
