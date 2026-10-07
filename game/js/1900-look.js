// ===== LOOK & FEEL: painted planets with glowing atmospheres, a nebula sky, and a debris field around your ship =====
// Everything here is visual only. The debris never collides with anything and has no effect on the physics; turn it off
// in 🎨 Customize → "Cinematic space debris" for realistic, nearly empty space.
const VIV={ok:true};
// --- seamless 3D value noise (sampled on the sphere, so textures have no seam and no pinched poles)
function vHash(x,y,z,sd){let h=(Math.imul(x,374761393)+Math.imul(y,668265263)+Math.imul(z,1274126177)+Math.imul(sd,974711))|0;h=Math.imul(h^(h>>>13),1274126177);h^=h>>>16;return(h>>>0)/4294967295}
function vNoise(x,y,z,sd){const X=Math.floor(x),Y=Math.floor(y),Z=Math.floor(z),fx=x-X,fy=y-Y,fz=z-Z,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy),w=fz*fz*(3-2*fz),L=(a,b,t)=>a+(b-a)*t;
 return L(L(L(vHash(X,Y,Z,sd),vHash(X+1,Y,Z,sd),u),L(vHash(X,Y+1,Z,sd),vHash(X+1,Y+1,Z,sd),u),v),L(L(vHash(X,Y,Z+1,sd),vHash(X+1,Y,Z+1,sd),u),L(vHash(X,Y+1,Z+1,sd),vHash(X+1,Y+1,Z+1,sd),u),v),w)}
function fbm(x,y,z,o,sd){let a=.5,f=1,t=0,n=0;for(let i=0;i<o;i++){t+=a*vNoise(x*f,y*f,z*f,sd+i*17);n+=a;a*=.5;f*=2.03}return t/n}
const mixC=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t],cl01=t=>Math.max(0,Math.min(1,t)),sstep=(a,b,t)=>{t=cl01((t-a)/(b-a));return t*t*(3-2*t)};
// paint an equirectangular texture: fn(x,y,z,lat) -> [r,g,b] or [r,g,b,a]
function eqTex(W,H,fn,alpha){const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext&&c.getContext('2d');if(!x)return null;const im=x.createImageData(W,H),d=im.data;
 for(let j=0;j<H;j++){const lat=Math.PI/2-(j+.5)/H*Math.PI,cl=Math.cos(lat),sl=Math.sin(lat);for(let i=0;i<W;i++){const lo=(i+.5)/W*2*Math.PI,p=fn(cl*Math.cos(lo),cl*Math.sin(lo),sl,lat),k=(j*W+i)*4;
  d[k]=p[0];d[k+1]=p[1];d[k+2]=p[2];d[k+3]=alpha?p[3]:255}}x.putImageData(im,0,0);return c}
function craters(c,n,dark,light,sd){const x=c.getContext('2d'),W=c.width,H=c.height;let r=sd*9301+49297;const rnd=()=>(r=(r*9301+49297)%233280)/233280;
 for(let k=0;k<n;k++){const lat=(rnd()-.5)*Math.PI*.92,rad=(2+Math.pow(rnd(),3)*22)*W/1024,cx=rnd()*W,cy=(.5-lat/Math.PI)*H,sx=rad/Math.max(.2,Math.cos(lat));
  x.fillStyle=dark;x.beginPath();x.ellipse(cx,cy,sx,rad,0,0,6.283);x.fill();x.strokeStyle=light;x.lineWidth=Math.max(1,rad*.25);x.beginPath();x.ellipse(cx+sx*.08,cy-rad*.08,sx,rad,0,3.6,6.1);x.stroke()}}
const PAINT={
 Sun:(x,y,z)=>{const n=fbm(x*8,y*8,z*8,4,1),g=fbm(x*40,y*40,z*40,2,2);return mixC([255,140,30],[255,244,200],cl01(n*1.3-.1+g*.3)).map(v=>Math.min(255,v))},
 Mercury:(x,y,z)=>{const n=fbm(x*4,y*4,z*4,5,3);return mixC([92,84,80],[170,160,150],n)},
 Venus:(x,y,z)=>{const w=fbm(x*2,y*2,z*2,3,4),n=fbm(x*3+w*3,y*3,z*6+w*2,5,5);return mixC([196,150,80],[250,228,170],n)},
 Earth:(x,y,z,lat)=>{const e=fbm(x*2.2,y*2.2,z*2.2,6,6)+.12*fbm(x*9,y*9,z*9,3,7)-.06,ice=Math.abs(lat)>1.15+.15*fbm(x*6,y*6,z*6,3,8);
  if(ice)return[236,244,250];if(e<.5){const sh=sstep(.4,.5,e);return mixC([10,40,110],[30,120,170],sh)}
  const m=fbm(x*6,y*6,z*6,4,9),dry=sstep(.2,.55,1-Math.abs(lat)/1.1)*sstep(.45,.65,m),hi=sstep(.62,.75,e);
  return mixC(mixC(mixC([46,110,48],[150,128,70],dry),[110,100,90],hi),[230,230,235],sstep(.74,.8,e))},
 Moon:(x,y,z)=>{const n=fbm(x*3,y*3,z*3,5,10),m=sstep(.45,.6,fbm(x*1.5,y*1.5,z*1.5,3,11));return mixC(mixC([150,150,152],[196,196,198],n),[92,92,98],m*.8)},
 Mars:(x,y,z,lat)=>{if(Math.abs(lat)>1.3+.1*fbm(x*8,y*8,z*8,2,12))return[240,236,232];const n=fbm(x*3,y*3,z*3,6,13),d=sstep(.5,.65,fbm(x*1.7,y*1.7,z*1.7,4,14));
  return mixC(mixC([170,74,34],[222,132,78],n),[94,46,32],d*.7)},
 Jupiter:(x,y,z,lat)=>{const w=fbm(x*3,y*3,z*3,4,15),b=Math.sin(lat*14+w*2.4),t=.5+.5*b;let c=mixC([176,120,80],[240,226,196],t);
  const lo=Math.atan2(y,x),dl=(lat+.38)/.09,dg=Math.atan2(Math.sin(lo-1),Math.cos(lo-1))/.22,sp=dl*dl+dg*dg;if(sp<1)c=mixC([200,90,60],c,sstep(.3,1,sp));return c},
 Saturn:(x,y,z,lat)=>{const w=fbm(x*3,y*3,z*3,3,16),t=.5+.5*Math.sin(lat*11+w*1.5);return mixC([196,166,110],[240,224,176],t)}};
const HALO={Sun:'255,190,90',Venus:'255,226,160',Earth:'110,180,255',Mars:'255,150,120',Jupiter:'255,214,170',Saturn:'250,224,170'};
function haloTex(rgb){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext&&c.getContext('2d');if(!x)return null;const g=x.createRadialGradient(128,128,0,128,128,128);
 g.addColorStop(0,`rgba(${rgb},0)`);g.addColorStop(.74,`rgba(${rgb},0)`);g.addColorStop(.795,`rgba(${rgb},.95)`);g.addColorStop(.82,`rgba(${rgb},.55)`);g.addColorStop(.9,`rgba(${rgb},.16)`);g.addColorStop(1,`rgba(${rgb},0)`);
 x.fillStyle=g;x.fillRect(0,0,256,256);return new THREE.CanvasTexture(c)}
const PLX=[];// per-body extras: {b,m,halo,clouds,tilt}
function vividPlanets(){const aniso=R.capabilities&&R.capabilities.getMaxAnisotropy?R.capabilities.getMaxAnisotropy():1;
 B.forEach((b,i)=>{const m=meshes[i],tilt={Earth:.409,Mars:.44,Saturn:.466,Jupiter:.055}[b.n]||0,geo=new THREE.SphereGeometry(b.R/U,96,48);geo.rotateX(Math.PI/2);m.geometry=geo;m.rotation.x=tilt;
  const X={b,m,tilt,halo:null,clouds:null};PLX.push(X);
  if(HALO[b.n]){const t=haloTex(HALO[b.n]);if(t){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:t,color:0xffffff,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true}));m.add(sp);X.halo=sp}}
  // paint textures a little later, one body at a time, so the game starts instantly
  setTimeout(()=>{try{const big=b.n==='Earth',cv=eqTex(big?1024:512,big?512:256,PAINT[b.n]);if(!cv)return;
   if(b.n==='Moon'||b.n==='Mercury')craters(cv,b.n==='Moon'?260:340,'rgba(60,60,64,.35)','rgba(235,235,240,.35)',i);
   const tx=new THREE.CanvasTexture(cv);tx.anisotropy=aniso;m.material=b.p<0?new THREE.MeshBasicMaterial({map:tx}):new THREE.MeshLambertMaterial({map:tx});
   if(b.n==='Earth'){const cc=eqTex(1024,512,(x,y,z)=>{const n=fbm(x*3+fbm(x*2,y*2,z*2,3,21),y*3,z*5,6,22),a=sstep(.5,.72,n);return[255,255,255,a*235]},true);
    if(cc){const ct=new THREE.CanvasTexture(cc);ct.anisotropy=aniso;const cg=new THREE.SphereGeometry(b.R/U*1.004,96,48);cg.rotateX(Math.PI/2);
     X.clouds=new THREE.Mesh(cg,new THREE.MeshLambertMaterial({map:ct,transparent:true,depthWrite:false}));m.add(X.clouds)}}
   if(b.n==='Saturn'){const rc=document.createElement('canvas');rc.width=rc.height=1024;const rx=rc.getContext('2d');
    for(let r=0;r<512;r+=1){const f=r/512;if(f<.546)continue;const n=vNoise(f*90,0,0,23),gap=f>.86&&f<.875,a=gap?.05:(.35+.55*n)*sstep(.546,.58,f)*(1-sstep(.97,1,f));
     rx.strokeStyle=`rgba(${220+30*n|0},${200+30*n|0},${160+20*n|0},${a.toFixed(3)})`;rx.lineWidth=1.5;rx.beginPath();rx.arc(512,512,r,0,6.283);rx.stroke()}
    const rg=new THREE.Mesh(new THREE.RingGeometry(b.R/U*1.24,b.R/U*2.27,128),new THREE.MeshLambertMaterial({map:new THREE.CanvasTexture(rc),transparent:true,side:THREE.DoubleSide,depthWrite:false}));m.add(rg)}
  }catch(e){console.warn('planet paint',e)}},600+i*120)})}
// keep the atmosphere rim exactly on the planet's visible edge, from orbit or from far away
let BW=null,BWnote=false;function burnWarpTick(){const man=['w','s','a','d','e','q'].some(k=>K[k])&&['chem','ntr'].includes(DR[di].id);
 if(man&&!MP.conn&&!CB.on&&wi>1){if(BW==null)BW=wi;wi=1;if(!BWnote){BWnote=true;notify('⏱ Time slows to ×10 while you fire a rocket engine by hand, so you can steer the burn. It speeds back up when you let go.')}}
 else if(!man&&BW!=null){if(!CB.on&&!MP.conn)wi=Math.max(wi,BW);BW=null}}
function vividPlanetTick(){burnWarpTick();for(const X of PLX){const m=X.m,b=X.b;m.rotation.z=(T/(b.rot||86400))*2*Math.PI;if(X.clouds)X.clouds.rotation.z=T*2e-6;
 if(X.halo){const dx=cam.position.x-m.position.x,dy=cam.position.y-m.position.y,dz=cam.position.z-m.position.z,d=Math.hypot(dx,dy,dz),r=b.R/U,k=d>r*1.0005?r*d/Math.sqrt(d*d-r*r):r*30;
  X.halo.scale.set(2*k/.8,2*k/.8,1);X.halo.visible=d>r*1.0005}}}
// --- nebula sky and richer stars (map-scale scene)
function vividSky(){try{const cv=eqTex(1024,512,(x,y,z)=>{const n=fbm(x*2,y*2,z*2,5,31),m=fbm(x*3+5,y*3,z*3,4,32),band=Math.exp(-z*z*9);
  let c=[3,6,18];c=mixC(c,[28,52,120],sstep(.45,.85,n)*.55*(.4+.6*band));c=mixC(c,[80,30,110],sstep(.55,.9,m)*.45);c=mixC(c,[20,90,100],sstep(.6,.95,n*m*1.6)*.35);return c.map(v=>Math.min(255,v))});
 if(cv){const sky=new THREE.Mesh(new THREE.SphereGeometry(6e5,64,32),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv),side:THREE.BackSide,depthWrite:false}));sky.renderOrder=-10;sc.add(sky);VIV.sky=sky}
 [[3500,1.4],[420,2.6]].forEach(([n,sz])=>{const p=[],c=[];for(let i=0;i<n;i++){const u=Math.random()*2-1,t=Math.random()*6.283,q=Math.sqrt(1-u*u),r=4.5e5;p.push(r*q*Math.cos(t),r*q*Math.sin(t),r*u);
   const k=Math.random(),col=k<.15?[1,.75,.55]:k<.35?[.7,.82,1]:[1,1,1],b=.45+Math.random()*.55;c.push(col[0]*b,col[1]*b,col[2]*b)}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('color',new THREE.Float32BufferAttribute(c,3));
  sc.add(new THREE.Points(g,new THREE.PointsMaterial({size:sz,sizeAttenuation:false,vertexColors:true,transparent:true,depthWrite:false})))})}catch(e){console.warn('sky',e)}}
// --- debris field around the ship (close-range scene, metres). It wraps around you, so it never runs out.
// It is anchored to a local frame that falls with you: rocks only stream past when your engine changes your velocity.
var THV=[0,0,0];const DEB={L:2400,Ld:320,W:[0,0,0],F:[0,0,0],lastT:0,lastNow:0,rocks:[],sets:[],dust:null,dp:null};
function rockGeo(sd){const g=new THREE.IcosahedronGeometry(1,1),P=g.attributes.position;for(let k=0;k<P.count;k++){const x=P.getX(k),y=P.getY(k),z=P.getZ(k),f=.75+.5*vNoise(x*1.7+sd,y*1.7,z*1.7,sd);P.setXYZ(k,x*f,y*f*.8,z*f)}g.computeVertexNormals();return g}
function vividDebris(){try{const mats=[new THREE.MeshStandardMaterial({color:0xffffff,roughness:.95,metalness:.05,flatShading:true}),
  new THREE.MeshStandardMaterial({color:0xffffff,roughness:.45,metalness:.15,flatShading:true,emissive:'#0d2c48',emissiveIntensity:.6}),
  new THREE.MeshStandardMaterial({color:0xffffff,roughness:.8,metalness:.3,flatShading:true})],pal=[['#3d3a44','#55505c','#2a2830'],['#6fb8e8','#8fd0f0','#4f9ccc'],['#7a5a40','#9a7650','#5c4434']],per=260,col=new THREE.Color();
 mats.forEach((mt,j)=>{const im=new THREE.InstancedMesh(rockGeo(j*7+3),mt,per);im.frustumCulled=false;for(let k=0;k<per;k++){col.set(pal[j][k%3]);if(im.setColorAt)im.setColorAt(k,col)}
  SS.add(im);DEB.sets.push(im);for(let k=0;k<per;k++){const sz=Math.exp(Math.log(.25)+Math.random()*Math.log(14/.25))*(Math.random()<.04?3:1);
   DEB.rocks.push({set:j,k,p:[(Math.random()-.5)*DEB.L,(Math.random()-.5)*DEB.L,(Math.random()-.5)*DEB.L],v:[(Math.random()-.5)*1.2,(Math.random()-.5)*1.2,(Math.random()-.5)*1.2],
    s:[sz*(.7+.6*Math.random()),sz*(.7+.6*Math.random()),sz*(.7+.6*Math.random())],r:[Math.random()*6,Math.random()*6,Math.random()*6],w:[(Math.random()-.5)*.6,(Math.random()-.5)*.6,(Math.random()-.5)*.6],o:Math.random()})}});
 const n=1800,dp=new Float32Array(n*3),base=new Float32Array(n*3);for(let k=0;k<n*3;k++)base[k]=(Math.random()-.5)*DEB.Ld;const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(dp,3));g.setAttribute('color',new THREE.BufferAttribute(new Float32Array(n*3),3));
 DEB.dust=new THREE.Points(g,new THREE.PointsMaterial({size:1.7,sizeAttenuation:false,vertexColors:true,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));DEB.dust.frustumCulled=false;DEB.dp=base;SS.add(DEB.dust)}catch(e){console.warn('debris',e);DEB.sets=[]}}
const DUM=new THREE.Object3D();
// how much debris to show here: dense in the asteroid belt and near asteroids, a light scattering elsewhere
function debrisLevel(){if(CUST.scenery==='realistic'||REAL())return 0;const rs=sunDist();let lv=.35;if(rs>2.1*AU&&rs<3.3*AU)lv=1;for(const a of AST)if(astDist(a)<2e5){lv=1;break}
 if(s.dom&&s.dom.n==='Saturn')lv=Math.max(lv,.8);return lv}
function vividDebrisTick(now){if(!DEB.sets.length)return;const on=SV||FP,dtg=Math.max(0,T-DEB.lastT),dr=DEB.lastNow?Math.min(.1,(now-DEB.lastNow)/1000):0;DEB.lastT=T;DEB.lastNow=now;
 // velocity change from your own engine since last frame = how fast the debris now drifts past you
 for(let i=0;i<3;i++){DEB.W[i]+=THV[i];THV[i]=0}const wl=Math.hypot(...DEB.W);if(wl>3000)for(let i=0;i<3;i++)DEB.W[i]*=3000/wl;
 if(wi>4||!on){DEB.sets.forEach(m=>m.visible=false);DEB.dust.visible=false;if(wi>4){DEB.W=[0,0,0]}return}
 for(let i=0;i<3;i++)DEB.F[i]=(DEB.F[i]+DEB.W[i]*dtg)%1e7;
 const lv=debrisLevel(),L=DEB.L,h=L/2,wrap=(v,Lw)=>{v=((v+Lw/2)%Lw+Lw)%Lw;return v-Lw/2};let anyR=false;const cp=FP?[0,0,0]:[SC.position.x,SC.position.y,SC.position.z];
 DEB.sets.forEach(m=>m.visible=lv>0);DEB.dust.visible=true;
 if(lv>0){for(const r of DEB.rocks){if(r.o>lv){DUM.position.set(0,0,-1e9);DUM.scale.set(1e-6,1e-6,1e-6)}else{for(let i=0;i<3;i++){r.p[i]+=r.v[i]*dr;r.r[i]+=r.w[i]*dr}
   const ox=wrap(r.p[0]-DEB.F[0]-cp[0],L),oy=wrap(r.p[1]-DEB.F[1]-cp[1],L),oz=wrap(r.p[2]-DEB.F[2]-cp[2],L);DUM.position.set(cp[0]+ox,cp[1]+oy,cp[2]+oz);
   const dd=Math.hypot(ox,oy,oz),fade=dd>h*.75?Math.max(0,1-(dd-h*.75)/(h*.25)):1;     // shrink near the edge so wrapping is invisible
   const ds=Math.hypot(DUM.position.x,DUM.position.y,DUM.position.z),near=ds<shipR*1.3?ds/(shipR*1.3):1;DUM.scale.set(r.s[0]*fade*near,r.s[1]*fade*near,r.s[2]*fade*near);DUM.rotation.set(r.r[0],r.r[1],r.r[2])}
  DUM.updateMatrix();DEB.sets[r.set].setMatrixAt(r.k,DUM.matrix);anyR=true}if(anyR)DEB.sets.forEach(m=>{m.instanceMatrix.needsUpdate=true})}
 const a=DEB.dust.geometry.attributes.position.array,cc=DEB.dust.geometry.attributes.color.array,b=DEB.dp,Ld=DEB.Ld,R0=Ld/2;
 for(let k=0;k<a.length;k+=3){const x=wrap(b[k]-DEB.F[0]-cp[0]+now*2e-3*((k%7)-3),Ld),y=wrap(b[k+1]-DEB.F[1]-cp[1],Ld),z=wrap(b[k+2]-DEB.F[2]-cp[2],Ld),d=Math.hypot(x,y,z),br=d>=R0?0:.75*(1-d/R0)*(1-d/R0);
  a[k]=cp[0]+x;a[k+1]=cp[1]+y;a[k+2]=cp[2]+z;cc[k]=br*.8;cc[k+1]=br*.9;cc[k+2]=br}
 DEB.dust.geometry.attributes.position.needsUpdate=true;DEB.dust.geometry.attributes.color.needsUpdate=true}
// --- holographic solar panels (🎨 Customize → STYLE)
let hTex=null;function holoTex(){if(!hTex){hTex=cnv(128,x=>{x.clearRect(0,0,128,128);x.fillStyle='rgba(190,40,200,.22)';x.fillRect(0,0,128,128);x.strokeStyle='rgba(255,120,250,.95)';x.lineWidth=2;
  for(let k=0;k<=128;k+=32){x.beginPath();x.moveTo(k,0);x.lineTo(k,128);x.moveTo(0,k);x.lineTo(128,k);x.stroke()}x.strokeStyle='rgba(255,170,255,.45)';x.lineWidth=1;
  for(let k=0;k<128;k+=8){x.beginPath();x.moveTo(0,k);x.lineTo(128,k);x.stroke()}});if(hTex)hTex.wrapS=hTex.wrapT=THREE.RepeatWrapping}return hTex}
// --- cameras: V cycles 3rd-person chase → 1st-person cockpit → orbit map
function cycleView(){if(SV)toggleFP();else if(FP)toggleFP();else toggleSV()}
const camName=()=>SV?'🎥 3rd person chase':FP?'👁 1st person cockpit':'🗺 Orbit map';
try{vividSky();vividPlanets();vividDebris()}catch(e){console.warn('vivid',e);VIV.ok=false}

function unlockAll(){TECH.forEach(t=>s.tech[t.id]=1);s.research=null;DR.forEach(D=>UNL[D.id]=1);WEP.forEach(w=>UNL[w.id]=1);for(const k of RES)s.res[k]+=1e4;s.rp+=1e4;s.ammo.missile+=40;s.res.spares+=20;recalc();s.en=SH.cap;
 notify('🔓 Testing: every technology, engine and weapon is unlocked, plus 10 t of every material, 10,000 research points and 40 missiles. Build parts in 🛠 → 🏭 Fabricate, then use “Finish all jobs now” in 🧪 Testing.')}
// --- testing: orders and building finish instantly (🛠 → 🧪 Testing to turn off). Materials are still used; the energy cost is skipped.
var INSTANT=true;try{const v=localStorage.getItem('orbital-instant');if(v!==null)INSTANT=v==='1'}catch(e){}
function instantJobs(){let n=0;while(s.jobs.length&&n++<500){const j=s.jobs.shift();if(j.type==='panel')s.area+=Math.max(0,j.J-j.done)/P1;finishJob(j)}recalc()}
function toggleInstant(){INSTANT=!INSTANT;try{localStorage.setItem('orbital-instant',INSTANT?'1':'0')}catch(e){}if(INSTANT)instantJobs()}

setTimeout(()=>{if(!SV&&!FP)toggleSV()},50);
