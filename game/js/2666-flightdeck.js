// ===== 3D FLIGHT DECK (client, visual only): cockpit style "deck" (default) =====
// A modelled flight deck under the window, built to look like real hardware: a sloping main console in painted,
// worn metal with panel seams and fasteners; three multifunction displays in bevelled housings with bezel keys and
// reflective cover glass; two touch panels; rows of backlit keys, guarded toggle switches and knurled knobs on the side
// consoles; a control stick in a rubber boot and a throttle; stencilled panel codes. Light is physical: the real Sun
// only shines in through the window and the frame casts real shadows across the console, the displays spill cyan light
// onto the surfaces around them, the metal reflects the cabin, the windscreen faintly reflects the lit displays, and
// dust motes drift in sunbeams. The displays are canvas textures redrawn four times a second from the game state, and
// they are buttons: click one to open its window (systems → 🌡 Thermal, crew → 👩‍🚀 Crew, flight → 🧭 Navigate,
// tactical → next target, sensors → radar style). deckBuild is called from ck3Build (2665-cockpit3d.js).
const DECK={screens:[],click:[],at:0,ray:null,down:null,tex:null,dust:null,refl:null,spill:[]};
CKS.deck={label:'3D flight deck: live glowing screens, consoles, control stick (default)',frame:null};
function deckCanvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;const t=new THREE.CanvasTexture(c);return{c,t}}
// ---------- procedural surface textures (made once): painted panels, soft-touch tops, brushed metal, labels ----------
function dkRnd(seed){let h=seed;return()=>(h=(h*16807)%2147483647)/2147483647}
function deckTexMake(){const T={},N=512,mk=()=>{const c=document.createElement('canvas');c.width=c.height=N;return[c,c.getContext&&c.getContext('2d')]};
 const tex=(c,rep)=>{const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep,rep);t.anisotropy=8;return t};
 // painted metal panel (one tile = 0.5 m): colour map, roughness map (worn spots are shinier) and bump map (seams, screws)
 {const[c,x]=mk(),[r,y]=mk(),[b,z]=mk();if(x){const R=dkRnd(11);x.fillStyle='#3a3f47';x.fillRect(0,0,N,N);y.fillStyle='#a6a6a6';y.fillRect(0,0,N,N);z.fillStyle='#808080';z.fillRect(0,0,N,N);
  for(let i=0;i<14000;i++){const v=R(),px=R()*N,py=R()*N,s=1+R()*2;x.fillStyle=v>.5?'rgba(255,255,255,'+(v-.5)*.05+')':'rgba(0,0,0,'+(.5-v)*.09+')';x.fillRect(px,py,s,s);y.fillStyle='rgba('+(v>.5?'255,255,255':'0,0,0')+','+Math.abs(v-.5)*.12+')';y.fillRect(px,py,s,s)}
  for(let i=0;i<70;i++){const px=R()*N,py=R()*N,rr=6+R()*26,g=x.createRadialGradient(px,py,0,px,py,rr);g.addColorStop(0,'rgba(150,155,160,.10)');g.addColorStop(1,'rgba(150,155,160,0)');x.fillStyle=g;x.fillRect(px-rr,py-rr,2*rr,2*rr);
   const g2=y.createRadialGradient(px,py,0,px,py,rr);g2.addColorStop(0,'rgba(0,0,0,.35)');g2.addColorStop(1,'rgba(0,0,0,0)');y.fillStyle=g2;y.fillRect(px-rr,py-rr,2*rr,2*rr)}
  for(let i=0;i<90;i++){const px=R()*N,py=R()*N,L=4+R()*30,a=(R()-.5)*.6;x.strokeStyle='rgba(205,210,215,'+(.05+R()*.1)+')';x.lineWidth=.7;x.beginPath();x.moveTo(px,py);x.lineTo(px+Math.cos(a)*L,py+Math.sin(a)*L);x.stroke()}
  const seam=(x0,y0,x1,y1)=>{x.strokeStyle='rgba(0,0,0,.6)';x.lineWidth=3;x.beginPath();x.moveTo(x0,y0);x.lineTo(x1,y1);x.stroke();x.strokeStyle='rgba(255,255,255,.08)';x.lineWidth=1;x.beginPath();x.moveTo(x0+2,y0+2);x.lineTo(x1+2,y1+2);x.stroke();
   z.strokeStyle='#202020';z.lineWidth=4;z.beginPath();z.moveTo(x0,y0);z.lineTo(x1,y1);z.stroke()};
  seam(0,2,N,2);seam(2,0,2,N);seam(0,N*.62,N,N*.62);seam(N*.45,0,N*.45,N*.62);
  for(const[a,bq]of[[18,18],[N*.45-16,18],[N*.45+16,18],[N-18,18],[18,N*.62-16],[N-18,N*.62-16],[18,N*.62+16],[N-18,N*.62+16],[18,N-18],[N-18,N-18],[N*.45-16,N*.62-16],[N*.45+16,N*.62-16]]){
   x.fillStyle='#22252a';x.beginPath();x.arc(a,bq,5.5,0,7);x.fill();x.fillStyle='rgba(190,195,200,.55)';x.beginPath();x.arc(a-1,bq-1,3.6,0,7);x.fill();x.strokeStyle='#1a1c20';x.lineWidth=1.4;x.beginPath();x.moveTo(a-3.5,bq-1);x.lineTo(a+2,bq-1);x.stroke();
   z.fillStyle='#d0d0d0';z.beginPath();z.arc(a,bq,5,0,7);z.fill();y.fillStyle='#606060';y.beginPath();y.arc(a,bq,5,0,7);y.fill()}
  x.font='600 15px ui-monospace,monospace';x.fillStyle='rgba(220,225,230,.38)';x.fillText('P-12',N*.47+30,N*.62+34);x.fillText('L-04',30,N*.62+34);x.fillText('A7',N*.47+30,40)}
  T.paint=tex(c,2);T.paintR=tex(r,2);T.paintB=tex(b,2)}
 // soft-touch dark coating for console tops (fine grain, matte) and brushed metal for trim
 {const[c,x]=mk();if(x){const R=dkRnd(5);x.fillStyle='#1b1e23';x.fillRect(0,0,N,N);for(let i=0;i<30000;i++){const v=R();x.fillStyle=v>.5?'rgba(255,255,255,.035)':'rgba(0,0,0,.06)';x.fillRect(R()*N,R()*N,1,1)}}T.soft=tex(c,3)}
 {const[c,x]=mk();if(x){const R=dkRnd(3);x.fillStyle='#8f969e';x.fillRect(0,0,N,N);for(let i=0;i<2600;i++){const py=R()*N,v=R();x.strokeStyle=v>.5?'rgba(255,255,255,'+(v-.5)*.22+')':'rgba(0,0,0,'+(.5-v)*.22+')';x.lineWidth=.5+R();x.beginPath();x.moveTo(0,py);x.lineTo(N,py+(R()-.5)*3);x.stroke()}}T.brush=tex(c,1)}
 // a soft dark blob (contact shadow under a housing) and a cyan glow (display light spilling onto the console)
 {const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext&&c.getContext('2d');if(x){const g=x.createRadialGradient(64,64,10,64,64,64);g.addColorStop(0,'rgba(0,0,0,.75)');g.addColorStop(.6,'rgba(0,0,0,.35)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,128,128)}T.blob=new THREE.CanvasTexture(c)}
 {const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext&&c.getContext('2d');if(x){const g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(90,220,255,.55)');g.addColorStop(.5,'rgba(60,180,255,.16)');g.addColorStop(1,'rgba(40,140,255,0)');x.fillStyle=g;x.fillRect(0,0,128,128)}T.glow=new THREE.CanvasTexture(c)}
 // fine scratches and dust on the windscreen (only seen when sunlight hits the glass)
 {const c=document.createElement('canvas');c.width=c.height=1024;const x=c.getContext&&c.getContext('2d');if(x){const R=dkRnd(17);x.fillStyle='#000';x.fillRect(0,0,1024,1024);
  for(let i=0;i<1600;i++){x.fillStyle='rgba(255,255,255,'+(.15+R()*.5)+')';x.fillRect(R()*1024,R()*1024,1+R()*1.5,1+R()*1.5)}
  for(let i=0;i<120;i++){const px=R()*1024,py=R()*1024,L=20+R()*140,a=R()*6.28;x.strokeStyle='rgba(255,255,255,'+(.08+R()*.18)+')';x.lineWidth=.6;x.beginPath();x.moveTo(px,py);x.quadraticCurveTo(px+Math.cos(a)*L*.5+(R()-.5)*20,py+Math.sin(a)*L*.5,px+Math.cos(a)*L,py+Math.sin(a)*L);x.stroke()}}T.scratch=new THREE.CanvasTexture(c)}
 return T}
// a small stencilled label (panel codes, not words, so nothing to translate)
function deckLabel(t,w,h,col){const c=document.createElement('canvas');c.width=256;c.height=Math.round(256*h/w);const x=c.getContext&&c.getContext('2d');if(x){x.fillStyle=col||'rgba(225,230,235,.85)';x.font='600 '+Math.round(c.height*.7)+'px ui-monospace,monospace';x.textBaseline='middle';x.textAlign='center';x.fillText(t,128,c.height/2)}
 return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2}))}
// a rounded, bevelled block (housings, consoles) centred on the origin
function deckRBox(w,h,d,r,b){const s=new THREE.Shape(),x=-w/2+b,y=-h/2+b,W=w-2*b,H=h-2*b,q=Math.max(.001,Math.min(r,W/2,H/2)),D=Math.max(.001,d-2*b);
 s.moveTo(x+q,y);s.lineTo(x+W-q,y);s.quadraticCurveTo(x+W,y,x+W,y+q);s.lineTo(x+W,y+H-q);s.quadraticCurveTo(x+W,y+H,x+W-q,y+H);s.lineTo(x+q,y+H);s.quadraticCurveTo(x,y+H,x,y+H-q);s.lineTo(x,y+q);s.quadraticCurveTo(x,y,x+q,y);
 const g=new THREE.ExtrudeGeometry(s,{depth:D,bevelEnabled:b>0,bevelThickness:b,bevelSize:b,bevelSegments:2,curveSegments:5});g.translate(0,0,-D/2);return g}
// geometry, in the cockpit camera's space (you sit at the origin looking down −z; the window plane is at z = −1)
function deckBuild(R0,o){DECK.screens=[];DECK.click=[];DECK.spill=[];if(!DECK.tex)DECK.tex=deckTexMake();const X=DECK.tex,{hw,sill,hh}=o;
 const S=(p)=>new THREE.MeshStandardMaterial(Object.assign({roughness:.6,metalness:.3},p)),
  paint=S({color:'#ffffff',map:X.paint,roughnessMap:X.paintR,bumpMap:X.paintB,bumpScale:.0015,roughness:1,metalness:.35,envMapIntensity:.5}),
  soft=S({color:'#ffffff',map:X.soft,roughness:.88,metalness:.05,envMapIntensity:.25}),
  housing=S({color:'#202329',roughness:.42,metalness:.25,envMapIntensity:.7}),bezel=S({color:'#0d0e10',roughness:.3,metalness:.1,envMapIntensity:.9}),
  brush=S({color:'#ffffff',map:X.brush,roughness:.32,metalness:.92,envMapIntensity:1.1}),rubber=S({color:'#111214',roughness:.95,metalness:0,envMapIntensity:.15}),
  key=S({color:'#2a2d33',roughness:.55,metalness:.1}),gripM=S({color:'#17181b',roughness:.7,metalness:.05}),red=S({color:'#9c1a17',roughness:.45,metalness:.1}),
  yel=S({color:'#c9a020',roughness:.5,metalness:.1}),
  E=(c,i)=>new THREE.MeshStandardMaterial({color:'#101214',emissive:c,emissiveIntensity:i||1.4,roughness:.4,metalness:0}),
  glowC=E('#37d4ff',1.6),glowA=E('#ffa630',1.5),glowG=E('#48ff8a',1.4),glowW=E('#d8f4ff',.9);
 const box=(w,h,d)=>new THREE.BoxGeometry(w,h,d),put=(par,geo,mat,x,y,z,rx,ry,rz)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(rx||ry||rz)m.rotation.set(rx||0,ry||0,rz||0,'YXZ');par.add(m);return m},
  grp=(par,x,y,z,rx,ry)=>{const g=new THREE.Group();g.position.set(x,y,z);g.rotation.set(rx||0,ry||0,0,'YXZ');par.add(g);return g};
 // many small identical parts (keys, buttons, fasteners) drawn as one instanced mesh per kind
 const bins=new Map(),many=(geo,mat,par,x,y,z,rx,ry)=>{const k=geo.uuid+mat.uuid;if(!bins.has(k))bins.set(k,{geo,mat,list:[]});const o3=new THREE.Object3D();o3.position.set(x,y,z);o3.rotation.set(rx||0,ry||0,0,'YXZ');par.add(o3);bins.get(k).list.push(o3)};
 // main console: a slab sloping from the bottom of the window toward you; on(f,x,off) is a point on its top surface
 const y1=sill*hh-.015,z1=-.99,y2=-.62,z2=-.45,L=Math.hypot(y2-y1,z2-z1),sa=Math.atan2(z1-z2,y1-y2),ny=(z2-z1)/L,nz=-(y2-y1)/L,
  on=(f,x,off)=>[x||0,y1+(y2-y1)*f+ny*(off||0),z1+(z2-z1)*f+nz*(off||0)];
 const slab=grp(R0,0,(y1+y2)/2-ny*.03,(z1+z2)/2-nz*.03,sa);put(slab,deckRBox(hw*2.6,L,.06,.02,.012),paint,0,0,0);
 put(R0,box(hw*2.6,.6,.05),paint,0,y2-.3,z2-.02);put(R0,new THREE.CylinderGeometry(.018,.018,hw*2.6,16,1),soft,0,y2+.005,z2+.01,0,0,Math.PI/2);  // padded front edge
 // a multifunction display: bevelled housing, bezel keys, glowing face (a canvas redrawn from the game state), cover glass
 const keyG=box(.022,.013,.008),keyLit=box(.016,.0025,.002),glassM=new THREE.MeshPhysicalMaterial({color:'#000000',roughness:.06,metalness:0,clearcoat:1,clearcoatRoughness:.04,transparent:true,opacity:.18,depthWrite:false,envMapIntensity:1.4});
 const screen=(par,w,h,x,y,z,rx,ry,cw,ch,draw,act,flush)=>{const g=new THREE.Group();g.position.set(x,y,z);g.rotation.set(rx,ry,0,'YXZ');par.add(g);
  const mw=flush?.012:.045,mh=flush?.012:.04;
  if(!flush){g.position.add(new THREE.Vector3(0,1,0).applyEuler(g.rotation).multiplyScalar(h/2+.006));put(g,deckRBox(w+2*mw,h+2*mh,.04,.012,.006),housing,0,0,-.022);
   for(let k=0;k<5;k++){const kx=(k-2)*w/5.4;many(keyG,key,g,kx,-h/2-mh*.55,0)}
   for(let k=0;k<4;k++)for(const sg of[-1,1])many(keyG,key,g,sg*(w/2+mw*.5),(k-1.5)*h/4.6,0,0,0);
   for(let k=0;k<5;k++)many(keyLit,glowW,g,(k-2)*w/5.4,-h/2-mh*.2,.004);
   const lab=deckLabel('MFD '+(DECK.screens.length+1),.05,.012,'rgba(200,210,220,.55)');lab.position.set(w/2-.02,h/2+mh*.5,.001);g.add(lab)}
  else put(g,deckRBox(w+2*mw,h+2*mh,.008,.004,.002),bezel,0,0,-.003);
  put(g,new THREE.PlaneGeometry(w+.006,h+.006),bezel,0,0,.0005);
  const C=deckCanvas(cw,ch),face=put(g,new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:C.t,toneMapped:false}),0,0,.0015);
  put(g,new THREE.PlaneGeometry(w,h),glassM,0,0,.003);
  if(!flush){const sp=new THREE.PointLight(0x5ad2ff,.22,.75,2);sp.position.set(0,0,.09);g.add(sp);DECK.spill.push(sp)}
  const S={c:C.c,t:C.t,draw,act,face,g,w,h};DECK.screens.push(S);if(act){face.userData.act=act;DECK.click.push(face)}return S};
 // three displays standing on the console, the side ones turned toward you
 screen(R0,.42,.22,...on(.3),-.6,0,768,402,deckRadar,'sensors');
 screen(R0,.34,.2,...on(.3,-.47),-.6,.5,640,376,deckFlight,'nav');
 screen(R0,.34,.2,...on(.3,.47),-.6,-.5,640,376,deckSystems,'thermal');
 // soft contact shadows where the housings meet the console, and the cyan glow they cast on it
 const blobM=new THREE.MeshBasicMaterial({map:X.blob,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1}),glowM=new THREE.MeshBasicMaterial({map:X.glow,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,polygonOffset:true,polygonOffsetFactor:-1,toneMapped:false});
 for(const[x,w]of[[0,.55],[-.47,.46],[.47,.46]]){put(R0,new THREE.PlaneGeometry(w,.14),blobM,...on(.3,x,.002),sa-Math.PI/2*0);put(R0,new THREE.PlaneGeometry(w*1.2,.2),glowM,...on(.36,x,.003),sa)}
 // a row of backlit keys with an amber pair, two flush touch panels, knobs and the padded front edge
 const kG=box(.03,.018,.01),kCap=box(.026,.004,.002);
 for(let k=0;k<14;k++){const p=on(.4,-.33+k*.05,.006);many(kG,key,R0,...p,sa);const q=on(.4,-.33+k*.05,.0115);many(kCap,k%5===0?glowA:glowC,R0,q[0],q[1]+.002,q[2],sa)}
 screen(R0,.27,.09,...on(.49,-.2,.004),sa,0,600,200,deckCrew,'crew',1);screen(R0,.27,.09,...on(.49,.2,.004),sa,0,600,200,deckTactical,'target',1);
 const knobG=new THREE.CylinderGeometry(.011,.012,.014,24),knobRing=new THREE.TorusGeometry(.0115,.0016,6,24);
 for(const x of[-.4,-.37,.37,.4]){const p=on(.49,x,.007),g=grp(R0,...p,sa);put(g,knobG,gripM,0,0,0,Math.PI/2);put(g,knobRing,brush,0,0,.004);put(g,box(.0025,.009,.002),glowW,0,.004,.0075)}
 put(R0,box(hw*2.4,.004,.003),glowC,...on(.585,0,.004),sa);
 // side consoles in the lower corners: guarded switches, backlit buttons, knobs, panel codes
 const swBase=box(.022,.03,.006),swLever=new THREE.CylinderGeometry(.0025,.0032,.022,8),guardSide=box(.002,.03,.016),guardTop=box(.026,.002,.016);
 for(const sg of[-1,1]){const g=grp(R0,sg*.8,-.42,-.72,-1,-sg*.75);put(g,deckRBox(.44,.36,.06,.02,.01),paint,0,0,0);put(g,box(.4,.18,.004),soft,0,.06,.031);
  put(g,box(.44,.004,.004),glowC,0,-.178,.032);
  for(let k=0;k<4;k++){const x=-.15+k*.075,y=.09;many(swBase,brush,g,x,y,.034);const lv=put(g,swLever,brush,x,y+.004,.044,.5*(k%2?1:-1));many(guardSide,red,g,x-.012,y,.04);many(guardSide,red,g,x+.012,y,.04);many(guardTop,red,g,x,y+.015,.04)}
  for(let r=0;r<2;r++)for(let k=0;k<5;k++){many(box(.034,.022,.012),key,g,-.13+k*.06,-.06+r*.04,.035);many(box(.026,.006,.002),(r*5+k)%4===1?glowG:(r+k)%5===2?glowA:glowC,g,-.13+k*.06,-.054+r*.04,.042)}
  for(const x of[.14,.18])put(g,knobG,gripM,x,-.04,.041,Math.PI/2);
  const lb=deckLabel(sg<0?'RCS · L-02':'PWR · R-07',.1,.016);lb.position.set(0,.14,.033);g.add(lb);const lb2=deckLabel(sg<0?'AUX 1  2  3  4':'BUS A  B  C  D',.16,.014,'rgba(230,200,90,.8)');lb2.position.set(-.04,.062,.0345);g.add(lb2)}
 // control stick in a rubber boot (black grip, red pinkie switch, hat) and a throttle lever
 {const g=grp(R0,.34,-.45,-.5,-.25,0);put(g,new THREE.ConeGeometry(.04,.06,20,1,true),rubber,0,.0,0);put(g,new THREE.CylinderGeometry(.007,.009,.09,12),brush,0,.06,0);
  put(g,new THREE.CylinderGeometry(.019,.016,.07,16),gripM,0,.12,0);put(g,new THREE.SphereGeometry(.019,16,10,0,6.3,0,1.6),gripM,0,.155,0);put(g,box(.012,.016,.012),red,0,.135,.017);put(g,new THREE.CylinderGeometry(.004,.004,.006,10),yel,0,.17,.004);put(g,box(.006,.016,.01),gripM,0,.11,-.02)}
 {const g=grp(R0,-.34,-.44,-.52,.3,0);put(g,box(.05,.012,.09),brush,0,-.01,0);put(g,box(.012,.1,.012),brush,0,.04,0);put(g,deckRBox(.06,.028,.034,.008,.004),gripM,0,.095,0);put(g,box(.008,.006,.01),glowA,.02,.105,.012)}
 // fasteners along the slab's far edge
 const scr=new THREE.CylinderGeometry(.0035,.0035,.002,10);for(let k=-12;k<=12;k++)many(scr,brush,R0,...on(.04,k*hw*.1,.0015),sa+Math.PI/2);
 for(const{geo,mat,list}of bins.values()){R0.updateMatrixWorld(true);const im=new THREE.InstancedMesh(geo,mat,list.length);list.forEach((o3,i)=>{im.setMatrixAt(i,o3.matrixWorld);o3.parent.remove(o3)});im.castShadow=im.receiveShadow=true;R0.add(im)}
 // the windscreen: faint glass, dust and scratches that light up in sunlight, and reflections of the lit displays
 // (mirrored across a windscreen raked back over the console, so they float just above the sill as in a real cockpit)
 const glass=new THREE.Mesh(new THREE.PlaneGeometry(hw*2.6,hh*2.2),new THREE.MeshPhysicalMaterial({color:'#9fb8c8',roughness:.03,metalness:0,clearcoat:1,transparent:true,opacity:.035,depthWrite:false,envMapIntensity:1}));glass.position.set(0,hh*.25,-1.005);R0.add(glass);
 const dust=new THREE.Mesh(new THREE.PlaneGeometry(hw*2.6,hh*2.2),new THREE.MeshBasicMaterial({map:X.scratch,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));dust.position.set(0,hh*.25,-1.004);R0.add(dust);DECK.glassDust=dust;
 {const b=.6,n=new THREE.Vector3(0,-Math.sin(b),Math.cos(b)),P0=new THREE.Vector3(0,sill*hh,-1),d=P0.dot(n),M=new THREE.Matrix4().set(1,0,0,0, 0,1-2*n.y*n.y,-2*n.y*n.z,2*d*n.y, 0,-2*n.z*n.y,1-2*n.z*n.z,2*d*n.z, 0,0,0,1);
  const rg=new THREE.Group();rg.matrixAutoUpdate=false;rg.matrix.copy(M);R0.add(rg);DECK.refl=[];
  for(const S of DECK.screens){if(!S.act||S.w<.3)continue;S.g.updateMatrix();const m=new THREE.Mesh(new THREE.PlaneGeometry(S.w,S.h),new THREE.MeshBasicMaterial({map:S.t,transparent:true,opacity:.07,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,toneMapped:false}));
   m.matrixAutoUpdate=false;m.matrix.copy(S.g.matrix).multiply(new THREE.Matrix4().makeTranslation(0,0,.0015));rg.add(m);DECK.refl.push(m)}}
 // dust motes floating in the cabin air (seen only in a sunbeam)
 {const p=[],R=dkRnd(23);for(let i=0;i<160;i++)p.push((R()-.5)*1.4,-.45+R()*.9,-.15-R()*.8);const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));
  const pts=new THREE.Points(g,new THREE.PointsMaterial({color:0xfff4e0,size:.0022,sizeAttenuation:true,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));R0.add(pts);DECK.dust=pts}
 // every solid part casts and receives the Sun's shadows
 R0.traverse(m=>{if(m.isMesh&&m.material&&m.material.isMeshStandardMaterial&&!m.material.transparent){m.castShadow=true;m.receiveShadow=true}})}
// ---------- screen painters (cyan on near-black, like real glass cockpits) ----------
const DK={bg:'#02101a',ln:'rgba(80,220,255,.18)',fg:'#9feaff',hi:'#ffffff',am:'#ffb347',rd:'#ff5a4a',gr:'#5dff8a'};
function dkBase(x,W,H,title){x.fillStyle=DK.bg;x.fillRect(0,0,W,H);x.strokeStyle=DK.ln;x.lineWidth=1;for(let i=0;i<W;i+=32){x.beginPath();x.moveTo(i,0);x.lineTo(i,H);x.stroke()}for(let j=0;j<H;j+=32){x.beginPath();x.moveTo(0,j);x.lineTo(W,j);x.stroke()}
 x.strokeStyle='rgba(120,230,255,.6)';x.lineWidth=3;x.strokeRect(4,4,W-8,H-8);if(title){x.fillStyle='rgba(60,190,255,.25)';x.fillRect(4,4,W-8,30);x.fillStyle=DK.fg;x.font='600 18px ui-sans-serif,system-ui,sans-serif';x.textBaseline='middle';x.fillText(title,14,20)}}
function dkRow(x,W,y,l,v,col){x.shadowColor='rgba(70,210,255,.55)';x.shadowBlur=5;x.font='17px ui-monospace,Menlo,monospace';x.textBaseline='middle';x.fillStyle='rgba(159,234,255,.75)';x.fillText(l,14,y);x.fillStyle=col||DK.hi;x.textAlign='right';x.fillText(v,W-14,y);x.textAlign='left';x.shadowBlur=0}
function dkBar(x,W,y,f,col){x.fillStyle='rgba(80,220,255,.15)';x.fillRect(14,y,W-28,10);x.fillStyle=col||DK.fg;x.fillRect(14,y,(W-28)*Math.max(0,Math.min(1,f)),10)}
const dkSpd=v=>v<1e4?f1(v,0)+' m/s':v<1e8?f1(v/1e3,2)+' km/s':f1(v/C,4)+' c';
function deckFlight(x,W,H){dkBase(x,W,H,'FLIGHT · click for navigation');const o=elements(),d=o.d,D=DR[di];let y=54;
 dkRow(x,W,y,'Speed',dkSpd(o.v)+' · '+tr(d.n));y+=28;dkRow(x,W,y,'Altitude',fmtD(Math.max(0,o.r-d.R)));y+=28;
 dkRow(x,W,y,'Orbit',o.ec<1?fmtD(Math.max(0,o.a*(1-o.ec)-d.R))+' × '+fmtD(Math.max(0,o.a*(1+o.ec)-d.R)):tr('escape'),o.ec<1?DK.hi:DK.am);y+=28;
 dkRow(x,W,y,'Engine',tr(D.n));y+=28;dkRow(x,W,y,'Thrust',s.burn>0?Math.round(s.burn*100)+' %':tr('off'),s.burn>0?DK.am:DK.fg);y+=28;
 dkRow(x,W,y,'Time speed',paused?tr('paused'):'1 s = '+dur(WARP[wi]),paused?DK.am:DK.fg);y+=28;
 dkRow(x,W,y,'Ship clock',new Date(Date.UTC(2026,9,4)+T*1e3).toISOString().slice(0,10));y+=30;
 x.font='15px ui-monospace,monospace';x.fillStyle=AP?DK.gr:'rgba(159,234,255,.55)';x.fillText(AP?'AP · '+tr(String(AP.stage||'on')).slice(0,52):tr('Autopilot off'),14,Math.min(H-16,y))}
function deckSystems(x,W,H){dkBase(x,W,H,'SYSTEMS · click for heat');const hasHi=SH.radHiA>0,hm=hullMax(),cl=s.tLo>318?DK.rd:s.tLo>308?DK.am:DK.gr;let y=54;
 dkRow(x,W,y,'Battery',Math.round(100*s.en/Math.max(1,SH.cap))+' %');dkBar(x,W,y+12,s.en/Math.max(1,SH.cap));y+=40;
 dkRow(x,W,y,'Power',sci(s.genNow||0)+' / '+sci(s.loadNow||0)+' W');y+=30;
 dkRow(x,W,y,'Crew loop',Math.round(s.tLo-273.15)+' °C',cl);dkBar(x,W,y+12,(s.tLo-250)/80,cl);y+=40;
 dkRow(x,W,y,'High loop',hasHi?Math.round(s.tHi-273.15)+' °C':tr('none'),hasHi?(s.tHi>SH.radHiT?DK.rd:DK.fg):DK.am);y+=30;
 dkRow(x,W,y,'Hull',Math.round(100*s.hull/hm)+' %',s.hull<.3*hm?DK.rd:DK.fg);y+=28;dkRow(x,W,y,'Propellant',DR[di].f?f1(s.prop,0)+' kg':'—')}
function deckRadar(x,W,H){try{radarDraw(x.canvas)}catch(e){x.clearRect(0,0,W,H)}x.save();x.globalCompositeOperation='destination-over';x.fillStyle=DK.bg;x.fillRect(0,0,W,H);x.restore();
 x.strokeStyle='rgba(120,230,255,.6)';x.lineWidth=3;x.strokeRect(4,4,W-8,H-8);x.fillStyle=DK.fg;x.font='600 16px ui-sans-serif,system-ui,sans-serif';x.textBaseline='top';x.textAlign='right';
 x.fillText(tr('SENSORS · click to change the display'),W-12,10);x.textAlign='left'}
function dkCaution(x,W,y){const A=ALERTS||[],n=A.filter(a=>a.l==='crit').length,w=A.length-n,bl=n&&Math.floor(performance.now()/500)%2;
 x.fillStyle=n?(bl?'#6a0e09':'#2a0604'):w?'#2a1a04':'#03200f';x.fillRect(8,y,W-16,34);x.fillStyle=n?DK.rd:w?DK.am:DK.gr;x.textBaseline='middle';
 dkFit(x,W-32,20,n?tr('MASTER CAUTION')+' · '+tr(String(A.find(a=>a.l==='crit').t)).slice(0,64):w?tr('CAUTION')+' · '+tr(String(A[0].t)).slice(0,64):tr('ALL SYSTEMS NOMINAL'),16,y+17)}
function dkFit(x,max,px,t,X,Y){t=tr(t);let f=px;x.font='600 '+f+'px ui-monospace,monospace';while(f>11&&x.measureText(t).width>max){f--;x.font='600 '+f+'px ui-monospace,monospace'}x.fillText(t,X,Y)}
function deckCrew(x,W,H){dkBase(x,W,H,'CREW · click to manage');const c=s.crew,L=lifeDays(),dd=v=>v===Infinity?'∞':f1(v,0)+' d',n=(c.list||[]).length,lo=Math.min(L.o2,L.wat,L.food);
 dkRow(x,W,56,'Health',Math.round(c.hp)+' %'+(c.sleep?' · 🧊':''),c.hp<60?DK.rd:DK.gr);
 dkRow(x,W,84,'Astronauts',n+' / '+crewCap()+' · '+(c.list||[]).map(m=>CREW.roles[m.role].ic).join(''));
 dkRow(x,W,112,'Supplies',dd(lo),lo<7?DK.am:DK.fg);dkRow(x,W,140,'Patch kits',String(Math.floor(s.res.patch||0)),(s.res.patch||0)<1?DK.am:DK.fg);
 dkRow(x,W,168,'Spare-parts kits',f1(s.res.spares,1),s.res.spares<1?DK.am:DK.fg)}
function deckTactical(x,W,H){dkBase(x,W,H,'TACTICAL · click: next target');dkCaution(x,W,40);const w=WEP[WI];
 dkRow(x,W,98,'Weapon',isU(w.id)?tr(w.n):'—');
 if(WT){let d=0;try{const T2=tState(WT);d=Math.hypot(T2.x-s.x,T2.y-s.y,T2.z-s.z)}catch(e){}dkRow(x,W,126,'Target',String(tr(tName(WT))).slice(0,26),DK.am);dkRow(x,W,154,'Range',fmtD(d))}
 else dkRow(x,W,126,'Target',tr('none'))}
// the look of real display glass: a faint pixel grid and darker corners, drawn over each frame
function dkFinish(x,W,H){x.save();x.shadowBlur=0;x.fillStyle='rgba(0,0,0,.16)';for(let j=0;j<H;j+=3)x.fillRect(0,j,W,1);
 const g=x.createRadialGradient(W/2,H/2,Math.min(W,H)*.35,W/2,H/2,Math.hypot(W,H)*.62);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.45)');x.fillStyle=g;x.fillRect(0,0,W,H);x.restore()}
// redraw the screens four times a second while the deck is visible; sunbeams light the dust in the air and on the glass
ORB.on('frame',now=>{if(!DECK.screens.length||!(typeof ck3Active==='function'&&ck3Active()&&CK_STYLE==='deck'))return;
 const sunIn=CK3.sunIn||0;if(DECK.dust){DECK.dust.material.opacity=.55*sunIn;DECK.dust.rotation.y=Math.sin(now/9000)*.05;DECK.dust.position.y=Math.sin(now/7000)*.01}
 if(DECK.glassDust)DECK.glassDust.material.opacity=.3*sunIn;
 if(now-DECK.at<250)return;DECK.at=now;
 for(const S of DECK.screens){const x=S.c.getContext&&S.c.getContext('2d');if(!x)continue;const W=S.c.width,H=S.c.height,k=S.draw===deckRadar?1:W/(W>600?560:600);try{x.setTransform(k,0,0,k,0,0);S.draw(x,W/k,H/k);x.setTransform(1,0,0,1,0,0);dkFinish(x,W,H)}catch(e){x.setTransform(1,0,0,1,0,0)}S.t.needsUpdate=true}});
// click a screen to open what it shows (a click is a press and release without dragging the view)
{const el=R.domElement;el.addEventListener('pointerdown',e=>{DECK.down={x:e.clientX,y:e.clientY}});
 el.addEventListener('pointerup',e=>{const d=DECK.down;DECK.down=null;if(!d||Math.hypot(e.clientX-d.x,e.clientY-d.y)>5||!DECK.click.length||CK_STYLE!=='deck'||!ck3Active()||!CK3.cam)return;
  const h=deckHit(e);if(!h)return;const a=h.userData.act;if(a==='sensors'){const L=Object.keys(RADARS),i=L.indexOf(RADAR_DESIGN);ORB.radar.use(L[(i+1)%L.length]);notify('📡 '+tr('Radar display')+': '+RADAR_DESIGN);return}
  const A=ACTS.find(q=>q[0]===a);if(A)A[3]()});
 el.addEventListener('pointermove',e=>{if(e.buttons||CK_STYLE!=='deck'||!FP||!DECK.click.length)return;const h=deckHit(e);el.style.cursor=h?'pointer':''})}
function deckHit(e){if(!DECK.ray)DECK.ray=new THREE.Raycaster();const r=R.domElement.getBoundingClientRect(),v=new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);
 DECK.ray.setFromCamera(v,CK3.cam);const hit=DECK.ray.intersectObjects(DECK.click,false)[0];return hit?hit.object:null}
// the first time, show players the new deck (switch back any time in 🎨 Customize → COCKPIT STYLE)
setTimeout(()=>{try{if(!localStorage.getItem('orbital-deck-intro')){localStorage.setItem('orbital-deck-intro','1');if(CK_STYLE==='physical'){ckUse('deck');CK3.on=true;notify('🛸 '+tr('New 3D flight deck: click its screens to open navigation, heat, crew and targets. Switch back in 🎨 Customize → COCKPIT STYLE.'))}}}catch(e){}},50);
// a button in the cockpit view: switch to the flight deck, or (when on it) show or hide the floating dashboard widgets
{const b=document.createElement('button');b.id='deckbtn';b.onclick=()=>{if(CK_STYLE!=='deck'){ckUse('deck');CK3.on=true;document.body.classList.remove('deckw')}else document.body.classList.toggle('deckw')};document.body.appendChild(b);
 ORB.on('ui',()=>{b.style.display=FP?'':'none';const t=CK_STYLE!=='deck'?'🛸 '+tr('3D flight deck'):document.body.classList.contains('deckw')?'🧩 '+tr('Hide widgets'):'🧩 '+tr('Show widgets');if(b._t!==t){b._t=t;b.textContent=t}b.classList.toggle('on',CK_STYLE==='deck')})}
