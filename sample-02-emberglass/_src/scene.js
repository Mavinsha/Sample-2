import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {Reflector} from 'three/examples/jsm/objects/Reflector.js';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/examples/jsm/postprocessing/OutputPass.js';
import {mergeVertices} from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/*
  Hero scene for K7 Seventh Sense.
  A glass "sense" core with seven orbit rings sits at the centre of the six
  infrastructure types from the homepage copy (Endpoints, Servers, Operational
  Technology, Network, Mobile Devices, Cloud). Telemetry pulses flow from every
  device into the core — endpoint to SOC. Hover a device to name it; click to
  simulate a threat that the core detects and contains.
*/

const host=document.getElementById('scene');
const hero=document.querySelector('.hero');
const label=document.getElementById('epLabel');
const toast=document.getElementById('sceneToast');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const zoom=parseFloat(getComputedStyle(document.documentElement).zoom)||1;

const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio*zoom,2));
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=0.9;
host.appendChild(renderer.domElement);

const scene=new THREE.Scene();
scene.fog=new THREE.Fog(0x6a2612,34,95);
let seed=11;const rnd=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};

/* ---------- sky ---------- */
const sunDir=new THREE.Vector3(0.12,0.025,-1).normalize();
const skyMat=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,uniforms:{sunDir:{value:sunDir}},
  vertexShader:`varying vec3 vP;void main(){vP=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
  fragmentShader:`varying vec3 vP;uniform vec3 sunDir;
  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
  float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.03;a*=.5;}return v;}
  void main(){
    vec3 d=normalize(vP);float h=d.y;
    vec3 top=vec3(.016,.005,.006),mid=vec3(.18,.036,.016),hor=vec3(.78,.25,.055),low=vec3(.14,.035,.014);
    vec3 c=h>0.?mix(hor,mid,smoothstep(0.,.16,h)):mix(hor,low,smoothstep(0.,-.15,h));
    if(h>0.)c=mix(c,top,smoothstep(.16,.62,h));
    float s=max(dot(d,sunDir),0.);
    c+=vec3(1.,.36,.08)*pow(s,12.)*.4+vec3(1.6,.9,.4)*pow(s,260.)*.7+vec3(2.6,1.9,1.2)*pow(s,3000.);
    vec2 uv=d.xz/(h+.12)*1.6;
    float cl=smoothstep(.52,.85,fbm(uv*1.2+vec2(3.,1.)));
    float band=smoothstep(.02,.1,h)*(1.-smoothstep(.3,.5,h));
    c=mix(c,mix(vec3(.26,.06,.035),vec3(1.05,.42,.15),pow(s,4.)),cl*band*.7);
    gl_FragColor=vec4(c,1.);
  }`});
const sky=new THREE.Mesh(new THREE.SphereGeometry(300,48,24),skyMat);scene.add(sky);
const pmrem=new THREE.PMREMGenerator(renderer);
{const es=new THREE.Scene();es.add(new THREE.Mesh(sky.geometry,skyMat));scene.environment=pmrem.fromScene(es,0.03).texture;}

/* ---------- lights ---------- */
scene.add(new THREE.HemisphereLight(0xffb98a,0x220c06,0.6));
const sun=new THREE.DirectionalLight(0xffa060,2.2);sun.position.set(6,6,-24);scene.add(sun);
const fill=new THREE.DirectionalLight(0xffa070,1.0);fill.position.set(-10,8,12);scene.add(fill);

/* ---------- water, hills, rocks ---------- */
const dpr=renderer.getPixelRatio();
const water=new Reflector(new THREE.PlaneGeometry(400,400),{clipBias:0.003,textureWidth:innerWidth*dpr*.5,textureHeight:innerHeight*dpr*.5,color:0x6e5850});
water.rotation.x=-Math.PI/2;scene.add(water);
function ridge(z,base,amp,color,x0=-120,x1=120,freq=.06){
  const sh=new THREE.Shape();sh.moveTo(x0,-2);
  for(let x=x0;x<=x1;x+=1.5){const y=base+amp*(Math.sin(x*freq+z)*.5+Math.sin(x*freq*2.7+z*1.7)*.3+Math.sin(x*freq*6.1)*.12)+amp*.4;sh.lineTo(x,Math.max(.1,y));}
  sh.lineTo(x1,-2);sh.lineTo(x0,-2);
  const m=new THREE.Mesh(new THREE.ShapeGeometry(sh),new THREE.MeshBasicMaterial({color}));m.position.z=z;scene.add(m);
}
ridge(-62,4,7,0x6e2c1c);ridge(-48,2.2,5,0x4c1d14);ridge(-36,.6,3,0x34140e,-60,60,.09);

const rockGeo=mergeVertices(new THREE.IcosahedronGeometry(1,5));
{const p=rockGeo.attributes.position,v=new THREE.Vector3();for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);v.multiplyScalar(1+.06*Math.sin(v.x*3.1+v.y*2.3)+.04*Math.sin(v.z*5.7));p.setXYZ(i,v.x,v.y,v.z);}rockGeo.computeVertexNormals();}
const stone=new THREE.MeshStandardMaterial({color:0xc99c88,roughness:.42,envMapIntensity:.7});
function rock(x,z,s,sy=.55,ry=0){const m=new THREE.Mesh(rockGeo,stone);m.position.set(x,s*sy*.25,z);m.scale.set(s,s*sy,s*.85);m.rotation.y=ry;scene.add(m);}
[[-11,3,2.2],[-8.6,4.6,1.6],[-13.5,1,2.6],[12.5,3.5,2.4],[10.2,5.6,1.4],[15,.5,2.8],[13.4,-8,1.6],[-3.5,-12,1.8],[6.4,-13.4,1.4],[-1,-7,1.1]].forEach(([x,z,s])=>rock(x,z,s,.45+rnd()*.25,rnd()*6));
const leafMat=new THREE.MeshStandardMaterial({color:0x31401f,roughness:.9});const leafGeo=new THREE.DodecahedronGeometry(.5,1);
function bush(x,z,s){const g=new THREE.Group();for(let i=0;i<7;i++){const m=new THREE.Mesh(leafGeo,leafMat);m.position.set((rnd()-.5)*1.4*s,rnd()*1.1*s+.2,(rnd()-.5)*s);m.scale.setScalar(s*(.5+rnd()*.6));g.add(m);}g.position.set(x,0,z);scene.add(g);}
[[-12,4.5,1.5],[-14.5,2.4,1.8],[13.6,4.8,1.4],[15.5,2,1.6]].forEach(a=>bush(...a));

/* ---------- the sense core ---------- */
const C=new THREE.Vector3(4.8,2.6,-6.8);
const padMat=new THREE.MeshStandardMaterial({color:0xcfa592,roughness:.45});
const padMat2=new THREE.MeshStandardMaterial({color:0xe2c0ae,roughness:.4});
{const a=new THREE.Mesh(new THREE.CylinderGeometry(2.4,2.6,.3,64),padMat);a.position.set(C.x,.05,C.z);scene.add(a);
 const b=new THREE.Mesh(new THREE.CylinderGeometry(1.8,1.95,.22,64),padMat2);b.position.set(C.x,.3,C.z);scene.add(b);
 const col=new THREE.Mesh(new THREE.CylinderGeometry(.24,.42,1.25,32),new THREE.MeshPhysicalMaterial({color:0xf0d6c4,metalness:1,roughness:.18,clearcoat:1}));col.position.set(C.x,.98,C.z);scene.add(col);}
const coreGlass=new THREE.Mesh(new THREE.SphereGeometry(1,64,48),new THREE.MeshPhysicalMaterial({color:0xffeadb,transmission:1,thickness:1.2,roughness:.04,ior:1.3,attenuationColor:0xffb070,attenuationDistance:3,emissive:0xff7a2a,emissiveIntensity:.14,iridescence:.35,clearcoat:1,envMapIntensity:1.5}));
coreGlass.position.copy(C);scene.add(coreGlass);
const heartMat=new THREE.MeshBasicMaterial({color:new THREE.Color(1.7,.7,.22),toneMapped:false});
const heart=new THREE.Mesh(new THREE.SphereGeometry(.28,32,24),heartMat);heart.position.copy(C);scene.add(heart);
const coreLight=new THREE.PointLight(0xff8a3a,5,6,1.8);coreLight.position.copy(C);scene.add(coreLight);
const ringMat=new THREE.MeshPhysicalMaterial({color:0xf5dcc8,metalness:1,roughness:.2,clearcoat:1,envMapIntensity:1.3});
const seventhMat=new THREE.MeshBasicMaterial({color:new THREE.Color(1.5,.62,.2),toneMapped:false});
const rings=[];
for(let i=0;i<7;i++){
  const piv=new THREE.Object3D();piv.position.copy(C);
  piv.rotation.set(rnd()*Math.PI,rnd()*Math.PI,rnd()*Math.PI);
  const r=new THREE.Mesh(new THREE.TorusGeometry(1.26+i*.075,i===6?.02:.013,12,160),i===6?seventhMat:ringMat);
  piv.add(r);scene.add(piv);
  piv.userData={sx:(rnd()-.5)*.5,sy:.15+rnd()*.35};rings.push(piv);
}

/* ---------- radar sweep on the water ---------- */
const radarMat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{uA:{value:0}},
  vertexShader:`varying vec2 vP;void main(){vP=position.xy;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
  fragmentShader:`varying vec2 vP;uniform float uA;
  void main(){float r=length(vP);float a=atan(vP.y,vP.x);float d=mod(uA-a,6.2831853);
    float sweep=exp(-d*2.6);float ring=1.-smoothstep(0.,.035,abs(fract(r*.55)-.5)-.465);
    float fall=smoothstep(7.,2.6,r)*smoothstep(2.4,2.9,r);
    float al=(sweep*.3+ring*.06)*fall;gl_FragColor=vec4(vec3(1.,.48,.18)*al,al);}`});
const radar=new THREE.Mesh(new THREE.CircleGeometry(7.2,120),radarMat);radar.rotation.x=-Math.PI/2;radar.position.set(C.x,.04,C.z);scene.add(radar);

/* ---------- devices ---------- */
const shell=new THREE.MeshPhysicalMaterial({color:0xf4e6da,metalness:.3,roughness:.22,clearcoat:1,clearcoatRoughness:.1,envMapIntensity:1.1});
const dark=new THREE.MeshPhysicalMaterial({color:0x2a160f,metalness:.4,roughness:.28,clearcoat:1});
const NORMAL=new THREE.Color(0xff7a2a),ALERT=new THREE.Color(0xff2a14);
const screenMat=()=>new THREE.MeshStandardMaterial({color:0x1a0b06,emissive:NORMAL.clone(),emissiveIntensity:.5,roughness:.3});
const rb=(w,h,d,r=.06)=>new RoundedBoxGeometry(w,h,d,4,r);

function device(type){
  const g=new THREE.Group(),alert=[];const spin=new THREE.Group();g.add(spin);let h=1;
  if(type==='laptop'){
    const base=new THREE.Mesh(rb(1.25,.07,.85,.03),shell);base.position.y=.04;spin.add(base);
    const piv=new THREE.Group();piv.position.set(0,.08,-.42);piv.rotation.x=-.3;spin.add(piv);
    const lid=new THREE.Mesh(rb(1.25,.8,.05,.03),dark);lid.position.y=.4;piv.add(lid);
    const sm=screenMat();alert.push(sm);const scr=new THREE.Mesh(new THREE.PlaneGeometry(1.12,.68),sm);scr.position.set(0,.4,.03);piv.add(scr);h=1;
  } else if(type==='server'){
    for(let i=0;i<3;i++){const u=new THREE.Mesh(rb(1,.3,.75,.05),shell);u.position.y=.17+i*.34;spin.add(u);
      const sm=screenMat();alert.push(sm);const led=new THREE.Mesh(new THREE.BoxGeometry(.46,.04,.01),sm);led.position.set(-.18,.17+i*.34,.38);spin.add(led);}
    h=1.15;
  } else if(type==='ot'){
    const base=new THREE.Mesh(new THREE.CylinderGeometry(.22,.34,.34,24),shell);base.position.y=.17;g.add(base);
    spin.position.y=.86;
    spin.add(new THREE.Mesh(new THREE.TorusGeometry(.36,.11,16,48),shell));
    for(let i=0;i<8;i++){const t=new THREE.Mesh(rb(.17,.17,.2,.03),shell);const a=i/8*Math.PI*2;t.position.set(Math.cos(a)*.5,Math.sin(a)*.5,0);t.rotation.z=a;spin.add(t);}
    const sm=screenMat();alert.push(sm);const hub=new THREE.Mesh(new THREE.CylinderGeometry(.14,.14,.24,24),sm);hub.rotation.x=Math.PI/2;spin.add(hub);
    h=1.45;
  } else if(type==='network'){
    spin.position.y=.95;
    const sm=screenMat();alert.push(sm);spin.add(new THREE.Mesh(new THREE.SphereGeometry(.18,24,16),sm));
    for(let i=0;i<4;i++){const a=i/4*Math.PI*2,p=new THREE.Vector3(Math.cos(a)*.6,Math.sin(a*2)*.18,Math.sin(a)*.6);
      const s=new THREE.Mesh(new THREE.SphereGeometry(.12,20,14),shell);s.position.copy(p);spin.add(s);
      const len=p.length();const c=new THREE.Mesh(new THREE.CylinderGeometry(.022,.022,len,8),shell);c.position.copy(p).multiplyScalar(.5);c.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),p.clone().normalize());spin.add(c);}
    const stem=new THREE.Mesh(new THREE.CylinderGeometry(.03,.05,.75,8),shell);stem.position.y=.4;g.add(stem);
    h=1.3;
  } else if(type==='mobile'){
    spin.position.y=.65;
    spin.add(new THREE.Mesh(rb(.5,.98,.07,.06),dark));
    const sm=screenMat();alert.push(sm);const scr=new THREE.Mesh(new THREE.PlaneGeometry(.42,.84),sm);scr.position.z=.04;spin.add(scr);
    h=1.3;
  } else if(type==='cloud'){
    const cm=new THREE.MeshPhysicalMaterial({color:0xfbefe6,roughness:.35,clearcoat:.6,emissive:NORMAL.clone(),emissiveIntensity:.06,envMapIntensity:1});alert.push(cm);
    [[0,0,0,.55],[.55,-.08,.05,.42],[-.52,-.1,0,.4],[.2,.3,-.05,.42],[-.2,.22,.1,.36]].forEach(([x,y,z,r])=>{const s=new THREE.Mesh(new THREE.SphereGeometry(r,32,24),cm);s.position.set(x,y,z);spin.add(s);});
    h=.2;
  }
  return {g,spin,alert,h};
}

const EPS=[
  {name:'Endpoints',type:'laptop',pos:[2.0,0,-2.4],rot:.55},
  {name:'Servers',type:'server',pos:[0.6,0,-10.8],rot:.35},
  {name:'Operational Technology',type:'ot',pos:[9.4,0,-11],rot:-.5},
  {name:'Network',type:'network',pos:[10.6,0,-5.4],rot:0},
  {name:'Mobile Devices',type:'mobile',pos:[8.2,0,-1.6],rot:-.45},
  {name:'Cloud',type:'cloud',pos:[7.4,5.6,-13],rot:0,air:true}
];
const linkMatBase={color:0xffb070,transparent:true,depthWrite:false};
const pulseGeo=new THREE.SphereGeometry(.045,10,8);
const pulseMat=new THREE.MeshBasicMaterial({color:new THREE.Color(1.6,.72,.26),toneMapped:false});
const redMat=new THREE.MeshBasicMaterial({color:new THREE.Color(2.2,.25,.12),toneMapped:false});
const hitMat=new THREE.MeshBasicMaterial({visible:false});
const hits=[];
EPS.forEach((e,i)=>{
  const d=device(e.type);e.dev=d;
  d.g.position.set(...e.pos);d.g.rotation.y=e.rot;scene.add(d.g);
  if(!e.air){
    const pad=new THREE.Mesh(new THREE.CylinderGeometry(.95,1.05,.22,48),padMat);pad.position.set(e.pos[0],.05,e.pos[2]);scene.add(pad);
    d.g.position.y=.17;
    const rim=new THREE.Mesh(new THREE.TorusGeometry(.97,.012,8,96),new THREE.MeshBasicMaterial({color:new THREE.Color(1.1,.5,.18),toneMapped:false}));
    rim.rotation.x=Math.PI/2;rim.position.set(e.pos[0],.17,e.pos[2]);scene.add(rim);
  }
  e.anchor=new THREE.Vector3(e.pos[0],d.g.position.y+d.h+.15,e.pos[2]);
  const start=new THREE.Vector3(e.pos[0],d.g.position.y+d.h*.6,e.pos[2]);
  const mid=start.clone().lerp(C,.5);mid.y+=1.2+start.distanceTo(C)*.07;
  e.curve=new THREE.CatmullRomCurve3([start,mid,C.clone()]);
  e.linkMat=new THREE.MeshBasicMaterial({...linkMatBase,opacity:.22});
  scene.add(new THREE.Mesh(new THREE.TubeGeometry(e.curve,64,.01,6),e.linkMat));
  e.pulses=[0,.33,.66].map(o=>{const m=new THREE.Mesh(pulseGeo,pulseMat);m.userData.u=(o+i*.11)%1;scene.add(m);return m;});
  e.red=new THREE.Mesh(new THREE.SphereGeometry(.09,16,12),redMat);e.red.visible=false;scene.add(e.red);
  const hit=new THREE.Mesh(new THREE.SphereGeometry(1.15,12,8),hitMat);hit.position.set(e.pos[0],d.g.position.y+d.h*.5,e.pos[2]);hit.userData.ep=e;scene.add(hit);hits.push(hit);
  e.alert=0;e.threat=-1;e.phase=rnd()*6;
});

/* ---------- containment wave ---------- */
const waves=[];
function wave(at){const m=new THREE.Mesh(new THREE.RingGeometry(.9,1,96),new THREE.MeshBasicMaterial({color:0xff8a3a,transparent:true,opacity:.7,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide}));
  m.rotation.x=-Math.PI/2;m.position.set(at.x,.08,at.z);m.userData.t=0;scene.add(m);waves.push(m);}

/* ---------- camera + post ---------- */
const camera=new THREE.PerspectiveCamera(38,1,.1,600);
const composer=new EffectComposer(renderer);
composer.addPass(new RenderPass(scene,camera));
const bloom=new UnrealBloomPass(new THREE.Vector2(1,1),.32,.4,1.0);composer.addPass(bloom);
composer.addPass(new OutputPass());
const base={pos:new THREE.Vector3(),look:new THREE.Vector3()};
function frameCam(){
  const w=host.clientWidth,h=host.clientHeight,a=w/h;
  renderer.setSize(w,h,false);composer.setSize(w,h);bloom.setSize(w,h);camera.aspect=a;
  if(a<.8){base.pos.set(5.4,3.4,22);base.look.set(5.6,6.2,-6);camera.fov=46;}
  else if(a<1.3){base.pos.set(3.4,3.0,17);base.look.set(4.0,3.2,-6);camera.fov=42;}
  else {base.pos.set(-1.0,3.1,11.2);base.look.set(-.9,2.6,-6);camera.fov=40;}
  camera.updateProjectionMatrix();camera.position.copy(base.pos);camera.lookAt(base.look);
}
frameCam();
let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(frameCam,120)});

/* ---------- interaction ---------- */
const mouse={x:0,y:0},ndc=new THREE.Vector2(),ray=new THREE.Raycaster(),proj=new THREE.Vector3();
let hovered=null,heartBoost=0,lastUser=-99,toastT=0;
function pick(cx,cy){const r=host.getBoundingClientRect();ndc.set((cx-r.left)/r.width*2-1,-((cy-r.top)/r.height)*2+1);ray.setFromCamera(ndc,camera);const h=ray.intersectObjects(hits)[0];return h?h.object.userData.ep:null;}
function showLabel(e){
  if(!e){label.classList.remove('on');return;}
  proj.copy(e.anchor).project(camera);
  label.textContent=e.name;
  label.style.transform=`translate(${(proj.x*.5+.5)*host.clientWidth}px,${(-proj.y*.5+.5)*host.clientHeight}px) translate(-50%,-130%)`;
  label.classList.add('on');
}
function say(text,alert){toast.textContent=text;toast.classList.toggle('alert',!!alert);toast.classList.add('on');toastT=3.2;}
function threat(e){if(e.threat>=0)return;e.threat=0;e.alert=1;e.red.visible=true;say(`${e.name} · Threat detected`,true);}
function contain(e){e.threat=-1;e.red.visible=false;heartBoost=1;wave(C);wave(new THREE.Vector3(e.pos[0],0,e.pos[2]));say(`${e.name} · Threat contained`,false);}
addEventListener('pointermove',ev=>{mouse.x=ev.clientX/innerWidth-.5;mouse.y=ev.clientY/innerHeight-.5;},{passive:true});
hero.addEventListener('pointermove',ev=>{if(ev.pointerType!=='mouse')return;if(ev.target.closest('a,button,input,select,form,.site-header'))return;hovered=pick(ev.clientX,ev.clientY);hero.classList.toggle('ep-hover',!!hovered);});
hero.addEventListener('pointerleave',()=>{hovered=null;hero.classList.remove('ep-hover');});
hero.addEventListener('pointerdown',ev=>{if(ev.target.closest('a,button,input,select,form,.site-header'))return;
  lastUser=clock.getElapsedTime();const e=pick(ev.clientX,ev.clientY)||EPS[Math.floor(Math.random()*EPS.length)];
  if(ev.pointerType!=='mouse'){hovered=e;}threat(e);});

/* ---------- loop ---------- */
const clock=new THREE.Clock();let running=true,frames=0,snapped=false,prev=0,nextAuto=4;
function update(t,dt){
  rings.forEach(p=>{p.rotation.x+=dt*p.userData.sx;p.rotation.y+=dt*p.userData.sy;});
  heartBoost*=Math.exp(-dt*2.5);
  heart.scale.setScalar(1+Math.sin(t*2)*.05+heartBoost*.7);
  coreLight.intensity=5+Math.sin(t*2)*1.2+heartBoost*22;
  radarMat.uniforms.uA.value=t*1.1;
  EPS.forEach(e=>{
    const d=e.dev;
    if(e.type==='ot')d.spin.rotation.z+=dt*.5;
    if(e.type==='network')d.spin.rotation.y+=dt*.4;
    if(e.type==='mobile'||e.type==='cloud')d.spin.position.y=(e.type==='mobile'?.65:0)+Math.sin(t*.9+e.phase)*.08;
    if(e.threat<0)e.alert=Math.max(0,e.alert-dt*.6);
    const fl=e.threat>=0?(.6+.4*Math.sin(t*22)):1;
    d.alert.forEach(m=>{m.emissive.copy(NORMAL).lerp(ALERT,Math.min(1,e.alert*1.4));m.emissiveIntensity=(e.type==='cloud'?.06:.5)+e.alert*1.6*fl;});
    d.g.position.x=e.pos[0]+(e.threat>=0?Math.sin(t*60)*.02:0);
    e.linkMat.opacity=(hovered===e?.6:.22)+e.alert*.4;
    e.linkMat.color.set(e.alert>.05?0xff5a30:0xffb070);
    e.pulses.forEach(p=>{p.userData.u=(p.userData.u+dt*.26)%1;const u=p.userData.u;p.position.copy(e.curve.getPointAt(u));p.scale.setScalar(Math.sin(u*Math.PI)*1.1+.2);});
    if(e.threat>=0){e.threat+=dt*.85;e.red.position.copy(e.curve.getPointAt(Math.min(1,e.threat)));if(e.threat>=1)contain(e);}
  });
  for(let i=waves.length-1;i>=0;i--){const w=waves[i];w.userData.t+=dt;const k=w.userData.t;w.scale.setScalar(1+k*4.5);w.material.opacity=Math.max(0,.7-k*.55);if(k>1.3){scene.remove(w);w.geometry.dispose();w.material.dispose();waves.splice(i,1);}}
  if(toastT>0){toastT-=dt;if(toastT<=0)toast.classList.remove('on');}
  if(t>nextAuto&&t-lastUser>8){threat(EPS[Math.floor(Math.random()*EPS.length)]);nextAuto=t+7+Math.random()*3;}
  camera.position.x+=((base.pos.x+mouse.x*1.0)-camera.position.x)*.04;
  camera.position.y+=((base.pos.y-mouse.y*.5)-camera.position.y)*.04;
  camera.lookAt(base.look);
  showLabel(hovered);
}
function snapshot(){
  const img=renderer.domElement.toDataURL('image/jpeg',.82);
  document.body.style.setProperty('--snap',`url(${img})`);
}
function loop(){
  if(!running)return;
  const t=clock.getElapsedTime(),dt=Math.min(t-prev,.05);prev=t;
  update(t,dt);composer.render();frames++;
  if(frames===2)hero.classList.add('live');
  if(!snapped&&frames>=8){snapped=true;snapshot();}
  requestAnimationFrame(loop);
}
if(reduce){update(0,0);composer.render();snapshot();hero.classList.add('live');}
else{
  loop();
  new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&!running){running=true;prev=clock.getElapsedTime();loop();}else if(!e.isIntersecting){running=false;}})).observe(host);
}
