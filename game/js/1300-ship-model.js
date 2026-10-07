// ===== SHIP VIEW: stylized close-up model built from the ship's real parts (metres) =====
let SV=false,svd=45,shipKey='',plume=null,plTex=null;R.autoClear=false;
const SS=new THREE.Scene(),SC=new THREE.PerspectiveCamera(55,innerWidth/innerHeight,.1,1e7);SC.up.set(0,0,1);
const sLight=new THREE.DirectionalLight(0xffffff,1.8);SS.add(sLight,new THREE.AmbientLight(0x3a3550,1),new THREE.HemisphereLight(0x8fd8ff,0x2a0f3a,.6));
const shipG=new THREE.Group();SS.add(shipG);const X1=new THREE.Vector3(1,0,0),tV=new THREE.Vector3(),tQ=new THREE.Quaternion(),DRC=['#ffae42','#5fb8ff','#b18cff','#7dffb0','#fff6c2','#ff5cf0','#ffffff','#7fd3ff','#ff8a3d','#ffe68a'];
let CUST={name:'Pathfinder',hull:'#d9dcdf',acc:'#b8892e',shape:'modular',wings:2,art:false,panel:'classic',scenery:'realistic',vis:'real'};try{Object.assign(CUST,JSON.parse(localStorage.getItem('orbital-ship')||'{}'))}catch(e){}
// realistic look (default): physically based materials, no outlines or glows, dark space; 'stylized' keeps the old look
const REAL=()=>CUST.vis!=='stylized';
const saveC=()=>{try{localStorage.setItem('orbital-ship',JSON.stringify(CUST))}catch(e){}};
function cnv(n,f){const c=document.createElement('canvas');c.width=c.height=n;const x=c.getContext&&c.getContext('2d');if(!x)return null;f(x);return new THREE.CanvasTexture(c)}
function glow(col,sz){const t=cnv(64,x=>{const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,64,64)});
 const m=new THREE.Sprite(new THREE.SpriteMaterial({map:t,color:0xffffff,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true}));m.scale.set(sz,sz,1);return m}
function part(geo,mat,edge){const m=new THREE.Mesh(geo,mat);if(edge&&!REAL())m.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo,25),new THREE.LineBasicMaterial({color:edge})));return m}
const RHO={chem:360,xe:1600,h2:71,fus:169,am:86},TCOL={chem:'#eef2f7',xe:'#8fa7c9',h2:'#bfe9ff',fus:'#ffd84d',am:'#c77dff'};let shipR=10,fitR=0;
// MODULAR HULL: the modules of your 🧱 Builder layout (0550-layout.js), nose (+x) to tail, at their real sizes in metres
function buildSpine(H,dark,A){const M=(SH&&SH.lay?SH.lay:layMetrics((laySync(),s.lay.order))).mods,L=M.reduce((a,q)=>a+q.len,0)||4,top=L/2;
 const std=(c,r,m)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m}),foil=std('#b8892e',.38,.85),white=std('#e6e8ea',.6,.08),glass=std('#0d1520',.06,.9),rad=std('#eef1f3',.55,.05),
  cyl=(r,len,mat,seg)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,len,seg||28),mat);m.rotation.z=Math.PI/2;return m},box=(x,y,z,mat)=>new THREE.Mesh(new THREE.BoxGeometry(x,y,z),mat);
 let maxR=1;for(const q of M){const g=new THREE.Group(),len=q.len,r=q.r;g.position.x=top-q.x;maxR=Math.max(maxR,r);
  if(q.cat==='life'){g.add(cyl(r,len,H));for(let k=0;k<8;k++){const w=box(Math.min(.9,len*.4),.35,.5,glass);const a=k*Math.PI/4;w.position.set(len*.15,Math.cos(a)*(r+.01),Math.sin(a)*(r+.01));w.rotation.x=a;g.add(w)}
   const ring=new THREE.Mesh(new THREE.TorusGeometry(r+.02,.07,6,40),std(A,.5,.2));ring.rotation.y=Math.PI/2;ring.position.x=-len*.3;g.add(ring)}
  else if(q.cat==='lab'){g.add(cyl(r,len,H));const st=cyl(r+.03,Math.min(.4,len*.2),std(A,.5,.2));g.add(st)}
  else if(q.cat==='fab'){g.add(box(len,2*r*.9,2*r*.9,H));const b2=box(len*.9,.3,2*r,dark);b2.position.y=r*.9;g.add(b2)}
  else if(q.cat==='store'){g.add(cyl(.5,len,dark,10));for(let k=0;k<4;k++){const b=box(len*.92,r*.8,r*.8,dark);const a=k*Math.PI/2+Math.PI/4;b.position.set(0,Math.cos(a)*r*.62,Math.sin(a)*r*.62);g.add(b)}}
  else if(q.cat==='gen'){if(q.rad>0){g.add(cyl(r,len*.7,dark));const sh=new THREE.Mesh(new THREE.CylinderGeometry(r*1.7,r*.9,len*.3,28),std('#3f444b',.5,.7));sh.rotation.z=Math.PI/2;sh.position.x=(M.indexOf(q)>SH?.lay?.crew?1:-1)*len*.35;g.add(sh)}
   else{g.add(cyl(.35,len,dark,12));for(let k=0;k<8;k++){const fn=box(len*.9,.04,.7,dark);const a=k*Math.PI/4;fn.position.set(0,Math.cos(a)*.6,Math.sin(a)*.6);fn.rotation.x=a;g.add(fn)}}}
  else if(q.cat==='therm'){g.add(cyl(.5,len,dark,12));const A1=(PARTS[q.id]||{}).A||60,w=Math.min(4,len*1.6),hgt=A1/2/w;[1,-1].forEach(sg=>{const p=box(w,hgt,.06,rad);p.position.y=sg*(hgt/2+.6);g.add(p);const pipe=box(.12,hgt,.12,dark);pipe.position.y=sg*(hgt/2+.6);g.add(pipe)})}
  else if(q.cat==='shield'){const d=PARTS[q.id]||{};if(d.mag){g.add(cyl(.6,len,dark,12));[-.3,.3].forEach(o=>{const t=new THREE.Mesh(new THREE.TorusGeometry(r*1.3,.18,10,40),std('#b87333',.35,.9));t.rotation.y=Math.PI/2;t.position.x=o*len;g.add(t)})}
   else if(d.whip){const dk=cyl(r*1.25,.08,std('#cfd3d6',.7,.2));g.add(dk);g.add(cyl(.5,len,dark,10))}
   else g.add(cyl(r,len,d.ww?std('#7f97b0',.4,.3):std('#8f8a80',.7,.25)))}
  else if(q.cat==='tanks'){const F=Object.entries(s.fuel).filter(([f,m])=>m>.01).map(([f,m])=>[f,m/(RHO_F[f]||1000)]).concat(s.res.water>1?[['water',s.res.water/1000]]:[]),V=F.reduce((a,x)=>a+x[1],0)||1;let x0=len/2;
   for(const [f,v] of F){const l=Math.max(.3,len*v/V),t=cyl(r,l,f==='chem'||f==='water'?white:f==='am'?std('#3a3550',.3,.8):foil);t.position.x=x0-l/2;g.add(t);const cap=new THREE.Mesh(new THREE.SphereGeometry(r,24,12),t.material);cap.scale.set(.25/r,1,1);cap.position.x=x0-l;g.add(cap);x0-=l}}
  else if(q.cat==='truss'){const s2=.7,m2=dark;[[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([a,b])=>{const lg=box(len,.14,.14,m2);lg.position.set(0,a*s2,b*s2);g.add(lg)});
   const diag=Math.hypot(len,2*s2),ang=Math.atan2(2*s2,len);[[0,1],[0,-1],[1,0],[-1,0]].forEach(([a,b])=>{const d2=box(diag,.07,.07,m2);if(a){d2.position.z=a*s2;d2.rotation.z=ang}else{d2.position.y=b*s2;d2.rotation.y=ang}g.add(d2)})}
  else g.add(cyl(r,len,H));
  shipG.add(g)}
 // the frame's central spine ties the modules together
 const sp=cyl(.25,L,dark,8);shipG.add(sp);
 return{rad:maxR,nose:top,tail:top}}
function buildShip(){while(shipG.children.length)shipG.remove(shipG.children[0]);
 const A=CUST.acc,H=new THREE.MeshStandardMaterial(REAL()?{color:CUST.hull,roughness:.55,metalness:.15}:{color:CUST.hull,roughness:.45,metalness:.3,flatShading:true}),dark=new THREE.MeshStandardMaterial(REAL()?{color:'#5d636d',roughness:.45,metalness:.75}:{color:'#2a2f45',roughness:.6,metalness:.6,flatShading:true});
 let sh=CUST.shape,rad=sh==='ring'?6.8:sh==='capsule'?3:4.2,nose=sh==='capsule'?6.6:sh==='ring'?2:3.7,tail=sh==='capsule'?6.8:sh==='ring'?2.6:4;
 if(sh==='modular'){const sp=buildSpine(H,dark,A);rad=sp.rad;nose=sp.nose;tail=sp.tail}
 else if(sh==='capsule'){const b=part(new THREE.CylinderGeometry(3,3,8,10),H,A);b.rotation.z=Math.PI/2;shipG.add(b);[4,-4].forEach(x=>{const c=part(new THREE.SphereGeometry(3,10,6),H,A);c.position.x=x;shipG.add(c)})}
 else if(sh==='ring'){const t=part(new THREE.TorusGeometry(5.5,1.3,8,18),H,A);t.rotation.y=Math.PI/2;shipG.add(t);shipG.add(part(new THREE.IcosahedronGeometry(2.4,1),H,A));
  for(let k=0;k<4;k++){const sp=part(new THREE.BoxGeometry(.4,.4,8.4),dark);sp.rotation.x=k*Math.PI/4;shipG.add(sp)}}
 else shipG.add(part(new THREE.IcosahedronGeometry(4.2,1),H,A));
 if(sh!=="modular"){const band=new THREE.Mesh(new THREE.TorusGeometry(sh==='ring'?2.5:sh==='capsule'?3.08:4.05,.2,6,36),new THREE.MeshBasicMaterial({color:A}));band.rotation.y=Math.PI/2;if(REAL())band.material=new THREE.MeshStandardMaterial({color:A,roughness:.5,metalness:.2});shipG.add(band);
 const ck=new THREE.Mesh(new THREE.SphereGeometry(1.7,16,10,0,Math.PI*2,0,Math.PI/2),REAL()?new THREE.MeshStandardMaterial({color:'#0d1520',metalness:.9,roughness:.06}):new THREE.MeshStandardMaterial({color:A,emissive:A,emissiveIntensity:.55,transparent:true,opacity:.85,roughness:.1}));
 ck.rotation.z=-Math.PI/2;ck.position.x=nose;if(!REAL())ck.add(glow(A,7));shipG.add(ck)}
 // ENGINE: design follows the selected drive; size grows with engine power
 const eid=DR[di].id,es=Math.max(.6,Math.min(25,Math.cbrt(Math.max(1,PW)/Math.max(1,DR[di].pw0)))),ex=-tail-.4;let nz=ex-3*es;
 if(eid==='chem'||eid==='ntr'){const e=part(new THREE.CylinderGeometry(.9*es,2.2*es,3*es,16,1,true),dark,A);e.rotation.z=Math.PI/2;e.position.x=ex-1.5*es;shipG.add(e);
  if(eid==='ntr'){const rc=part(new THREE.CylinderGeometry(1.3*es,1.3*es,2.2*es,12),new THREE.MeshStandardMaterial({color:'#2c3b33',emissive:'#3dff8a',emissiveIntensity:.35,metalness:.6,roughness:.4}),'#7dffb0');rc.rotation.z=Math.PI/2;rc.position.x=ex+.7*es;shipG.add(rc)}}
 else if(eid==='ion'||eid==='vas'||eid==='mpd'){const e=part(new THREE.CylinderGeometry(2*es,2*es,.8*es,24),dark,A);e.rotation.z=Math.PI/2;e.position.x=ex-.4*es;shipG.add(e);
  const gr=new THREE.Mesh(new THREE.CircleGeometry(1.8*es,24),new THREE.MeshBasicMaterial({color:DRC[di],side:THREE.DoubleSide}));gr.rotation.y=Math.PI/2;gr.position.x=ex-.82*es;shipG.add(gr);nz=ex-.9*es;
  if(eid==='vas'){const t=new THREE.Mesh(new THREE.TorusGeometry(1.4*es,.3*es,8,24),new THREE.MeshStandardMaterial({color:'#3a3f5c',emissive:'#b18cff',emissiveIntensity:.7,metalness:.7,roughness:.3}));t.rotation.y=Math.PI/2;t.position.x=ex-1.6*es;shipG.add(t);nz=ex-1.8*es}}
 else if(eid==='fus'||eid==='icf'){for(let k=0;k<3;k++){const t=new THREE.Mesh(new THREE.TorusGeometry((1.2+k*.5)*es,.22*es,8,24),new THREE.MeshStandardMaterial({color:'#3a3f5c',emissive:'#ff5cf0',emissiveIntensity:.6,metalness:.7,roughness:.3}));t.rotation.y=Math.PI/2;t.position.x=ex-k*1.1*es;shipG.add(t)}
  const sp=part(new THREE.CylinderGeometry(.5*es,.5*es,2.4*es,8),dark);sp.rotation.z=Math.PI/2;sp.position.x=ex-1.1*es;shipG.add(sp);nz=ex-2.4*es}
 else if(eid==='am'||eid==='beam'){const m=new THREE.Mesh(new THREE.SphereGeometry(4*es,28,12,0,Math.PI*2,0,.85),new THREE.MeshStandardMaterial({color:'#e8ecf5',metalness:1,roughness:.08,side:THREE.DoubleSide,emissive:'#ffffff',emissiveIntensity:.06}));
  m.rotation.z=-Math.PI/2;m.position.x=ex-4*es;shipG.add(m);nz=ex-4*es*.34}
 else nz=ex;
 const pg=new THREE.ConeGeometry(2*es,10*es,16,1,true);pg.translate(0,5*es,0);plume=new THREE.Mesh(pg,new THREE.MeshBasicMaterial({color:DRC[di],transparent:true,opacity:REAL()?(/^(ion|vas|mpd)$/.test(eid)?.16:eid==='chem'?.5:.35):.7,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));
 plume.rotation.z=Math.PI/2;plume.position.x=nz;shipG.add(plume);if(!DR[di].sail){const ng=glow(DRC[di],(REAL()?3:8)*es);ng.position.x=nz;shipG.add(ng)}
 // FUEL TANKS: one pair per fuel type, real volume from real density
 let xo=1.5,ext=0;if(sh!=='modular')['chem','xe','h2','fus','am'].forEach(f=>{const mf=s.fuel[f];if(mf<.01)return;const r=Math.max(.15,Math.cbrt(3*(mf/RHO[f])/(8*Math.PI))),
  M=new THREE.MeshStandardMaterial({color:TCOL[f],roughness:.3,metalness:.6,flatShading:true,emissive:f==='am'?'#7a2cff':'#000000',emissiveIntensity:f==='am'?.7:0});
  [1,-1].forEach(g=>{const t=part(new THREE.SphereGeometry(r,14,10),M,A);t.position.set(xo-r,g*(rad+r+.3),0);shipG.add(t)});ext=Math.max(ext,rad+2*r+.3,Math.abs(xo-2*r));xo-=2*r+.5});
 // SOLAR ARRAY at true total area; the layout changes as it grows: fold-out wings → petal fans → stacked hex rings → stacked hex discs
 if(!plTex){plTex=cnv(128,x=>{x.fillStyle='#0b1f4a';x.fillRect(0,0,128,128);x.strokeStyle='#3fa9ff';x.lineWidth=2;for(let k=0;k<=128;k+=16){x.beginPath();x.moveTo(k,0);x.lineTo(k,128);x.moveTo(0,k);x.lineTo(128,k);x.stroke()}});if(plTex)plTex.wrapS=plTex.wrapT=THREE.RepeatWrapping}
 const PE=CUST.panel==='holo'&&!REAL()&&holoTex()?'#ff8af2':'#7fd3ff',PM=PE==='#ff8af2'?new THREE.MeshBasicMaterial({map:hTex,color:0xffffff,transparent:true,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false}):new THREE.MeshStandardMaterial(REAL()?{map:plTex,color:0x9fb4d8,roughness:.28,metalness:.45,side:THREE.DoubleSide}:{map:plTex,color:0xffffff,emissive:'#0a2a66',emissiveIntensity:.7,roughness:.4,metalness:.2,side:THREE.DoubleSide}),Ar=s.area;let arrR=0;
 if(Ar<=200){const W=Math.sqrt(Ar/CUST.wings/3),L=3*W,th=Math.max(.05,W/80);for(const tx of[plTex,hTex])if(tx)tx.repeat.set(Math.max(1,W/4),Math.max(1,L/4));
  for(let k=0;k<CUST.wings;k++){const arm=new THREE.Group();arm.rotation.x=k*2*Math.PI/CUST.wings+(CUST.wings==2?Math.PI/2:Math.PI/4);
   const st=part(new THREE.BoxGeometry(.5,2.6,.5),dark);st.position.y=rad+1.2;arm.add(st);const pn=part(new THREE.BoxGeometry(W,L,th),PM,PE);pn.position.y=rad+2.4+L/2;arm.add(pn);shipG.add(arm)}arrR=rad+2.4+L}
 else if(Ar<=5000){const W=Math.sqrt(Ar/32),L=2*W,th=Math.max(.05,W/80);for(const tx of[plTex,hTex])if(tx)tx.repeat.set(Math.max(1,W/4),Math.max(1,L/4));
  for(let k=0;k<8;k++)for(let j=0;j<2;j++){const arm=new THREE.Group();arm.rotation.x=k*Math.PI/4+j*Math.PI/8;arm.position.x=j?-W*.6:W*.6;
   const st=part(new THREE.BoxGeometry(.5,3,.5),dark);st.position.y=rad+1.4;arm.add(st);const pn=part(new THREE.BoxGeometry(W,L,th),PM,PE);pn.position.y=rad+2.8+L/2;pn.rotation.y=j?.35:-.35;arm.add(pn);shipG.add(arm)}arrR=rad+2.8+L}
 else{const disc=Ar>2e5,layers=disc?3:2,n=disc?900:480,Rh=Math.sqrt(2*(Ar/n)/(3*Math.sqrt(3))),th=Math.max(.1,Rh/40),rin=disc?rad+2+Rh:rad+6+2*Rh,cs=[],S3=Math.sqrt(3),nl=Math.ceil(n/layers);
  for(let q2=-45;q2<=45;q2++)for(let r2=-45;r2<=45;r2++){const y=Rh*S3*(q2+r2/2),z=Rh*1.5*r2,d=Math.hypot(y,z);if(d>=rin)cs.push([d,y,z])}cs.sort((a,b)=>a[0]-b[0]);
  const geo=new THREE.CylinderGeometry(Rh*.96,Rh*.96,th,6);geo.rotateZ(Math.PI/2);const HM=new THREE.MeshStandardMaterial(REAL()?{color:0x9fb4d8,roughness:.28,metalness:.45}:{color:0xffffff,emissive:'#0a2a66',emissiveIntensity:.8,roughness:.35,metalness:.3,flatShading:true});
  const im=new THREE.InstancedMesh(geo,HM,nl*layers),dm=new THREE.Object3D(),col=new THREE.Color(),gap=Math.max(6,Rh*4),rOut=cs[Math.min(nl,cs.length)-1][0];let c=0;
  for(let Ly=0;Ly<layers;Ly++){const x=(Ly-(layers-1)/2)*gap;for(let k=0;k<nl&&k<cs.length;k++){const[,y,z]=cs[k];dm.position.set(x,y,z);dm.rotation.set(Ly*Math.PI/6,0,0);dm.updateMatrix();im.setMatrixAt(c,dm.matrix);col.set(k%9===0?'#4f86ff':k%5===0?'#1e3f8a':'#2a55c8');if(im.setColorAt)im.setColorAt(c,col);c++}
   for(let k=0;k<3;k++){const sp=part(new THREE.BoxGeometry(.6,2*rOut,.6),dark);sp.rotation.x=k*Math.PI/3;sp.position.x=x;shipG.add(sp)}}
  im.count=c;shipG.add(im);arrR=rOut+Rh}
 if(s.sailA>0){const Ls=Math.sqrt(s.sailA),sm=new THREE.Mesh(new THREE.BoxGeometry(.05,Ls,Ls),new THREE.MeshStandardMaterial({color:'#dfe6f2',metalness:1,roughness:.15,emissive:'#223',side:THREE.DoubleSide}));sm.position.x=nose+Ls*.35;shipG.add(sm);
  for(let k=0;k<2;k++){const bm=part(new THREE.BoxGeometry(.3,Ls*1.414,.3),dark);bm.rotation.x=Math.PI/4+k*Math.PI/2;bm.position.x=nose+Ls*.35;shipG.add(bm)}arrR=Math.max(arrR,Ls*.75)}
 buildTurrets(rad);ORB.emit('ship:build',{g:shipG,rad,part,H,dark,A});
 shipR=Math.max(10,arrR,ext,Math.abs(nz)+12*es);if(shipR>fitR*1.05||shipR<fitR*.6){svd=Math.max(svd,shipR*2.4);fitR=shipR}}
function shipUpdate(){const key=[ORB.shipKey(),CUST.panel,WEP.map(w=>isU(w.id)?1:0).join(''),CUST.shape,CUST.vis,CUST.hull,CUST.acc,CUST.wings,di,Math.round(Math.log10(s.area)*20),Math.round(Math.log10(PW)*4),s.sailA,...['chem','xe','h2','fus','am'].map(f=>Math.round(Math.log10(s.fuel[f]+.01)*10))].join();if(key!==shipKey){shipKey=key;buildShip()}
 const g=gam(s),d=s.dom,dv=s.burn>0?dirVec():null,f=dv||[s.vx/g-d.vx,s.vy/g-d.vy,s.vz/g-d.vz],fl=Math.hypot(...f)||1;tV.set(f[0]/fl,f[1]/fl,f[2]/fl);tQ.setFromUnitVectors(X1,tV);shipG.quaternion.slerp(tQ,.08);turretTick();
 plume.visible=s.burn>0&&!DR[di].sail;if(plume.visible){const k=(.6+.4*s.burn)*(.9+.2*Math.random());plume.scale.set(k,k*(1+s.burn),k)}
 const S=B[0],sx=S.x-s.x,sy=S.y-s.y,sz=S.z-s.z,sl=Math.hypot(sx,sy,sz);sLight.position.set(sx/sl*100,sy/sl*100,sz/sl*100);sLight.intensity=s.lit?1.8:.12;
 const q=dirAE();SC.position.set(q[0]*svd,q[1]*svd,q[2]*svd);SC.lookAt(0,0,0);SC.aspect=innerWidth/innerHeight;SC.updateProjectionMatrix()}
function drawArt(){const c=$('art');c.style.display=SV&&CUST.art?'block':'none';if(!(SV&&CUST.art)||!c.getContext)return;c.width=innerWidth;c.height=innerHeight;const x=c.getContext('2d'),W=c.width,H=c.height,Z=130,P=[];
 for(let j=-1;j<=H/Z+1;j++){P[j+1]=[];for(let i=-1;i<=W/Z+1;i++)P[j+1].push([i*Z+(Math.random()-.5)*Z*.8,j*Z+(Math.random()-.5)*Z*.8])}
 for(let j=0;j<P.length-1;j++)for(let i=0;i<P[j].length-1;i++)for(const t of[[P[j][i],P[j][i+1],P[j+1][i]],[P[j][i+1],P[j+1][i+1],P[j+1][i]]]){x.fillStyle=`hsla(${150+Math.random()*130},70%,${18+Math.random()*16}%,${.1+Math.random()*.18})`;x.beginPath();x.moveTo(...t[0]);x.lineTo(...t[1]);x.lineTo(...t[2]);x.fill()}
 const g=x.createRadialGradient(W/2,H/2,0,W/2,H/2,Math.max(W,H)*.6);g.addColorStop(0,'rgba(60,220,190,.25)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,W,H)}
function toggleSV(){if(FP)toggleFP();SV=!SV;document.body.classList.toggle('sv',SV);if(SV)fi=0;drawArt();stabCapture()}
addEventListener('resize',drawArt);
{const c=$('custbody'),row=t=>{const d=document.createElement('div');d.className='sec';d.innerHTML='<h4>'+t+'</h4>';c.appendChild(d);return d},
 sw=(p,key,cols)=>cols.forEach(col=>{const b=document.createElement('button');b.className='sw';b.style.background=col;b.title=col;b.onclick=()=>{CUST[key]=col;saveC()};p.appendChild(b)});
 let r=row('SHIP NAME');const inp=document.createElement('input');inp.value=CUST.name;inp.oninput=()=>{CUST.name=inp.value||'Unnamed';saveC()};r.appendChild(inp);
 r=row('HULL COLOR');sw(r,'hull',['#e8409f','#8a3dff','#2fd27a','#ff7a1a','#2f8cff','#d9dde6','#ffd23f','#1b1f2e']);
 r=row('NEON TRIM');sw(r,'acc',['#38f2ff','#ff3df2','#b6ff3d','#ffe14d','#ff5a3d','#ffffff']);
 r=row('HULL SHAPE');[['modular','Modular (your 🧱 Builder layout)'],['sphere','Round pod'],['capsule','Long capsule'],['ring','Ring station']].forEach(([v,t])=>btn(r,()=>(CUST.shape===v?'● ':'○ ')+t,()=>{CUST.shape=v;saveC()}));
 r=row('SOLAR WINGS');[2,4].forEach(v=>btn(r,()=>(CUST.wings===v?'● ':'○ ')+v+' wings',()=>{CUST.wings=v;saveC()}));
 r=row('STYLE');btn(r,()=>(REAL()?'● ':'○ ')+'Realistic look (real lighting, no glows or outlines)',()=>{CUST.vis=REAL()?'stylized':'real';saveC();if(typeof applyVis==='function')applyVis()});btn(r,()=>(CUST.panel==='holo'?'● ':'○ ')+'Holographic solar panels',()=>{CUST.panel=CUST.panel==='holo'?'classic':'holo';saveC()});btn(r,()=>(CUST.scenery!=='realistic'?'● ':'○ ')+'Cinematic space debris (off = realistic, nearly empty space)',()=>{CUST.scenery=CUST.scenery==='realistic'?'cinematic':'realistic';saveC()});btn(r,()=>(CUST.art?'● ':'○ ')+'Neon art background in ship view',()=>{CUST.art=!CUST.art;saveC();drawArt()});
 r=row('VIEW');btn(r,()=>SV?'Close ship view':'🚀 Open ship view to see your ship',()=>toggleSV());
 $('custclose').onclick=()=>$('cust').classList.add('h')}

