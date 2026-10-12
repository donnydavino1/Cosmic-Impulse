// ===== 3D COCKPIT (client, visual only): a modelled window frame, glare shield and overhead panel around the first-person view =====
// It is real geometry lit by the real Sun (direction and brightness from your position, dark in a planet's shadow), by
// sunlight reflected from the planet you orbit (blue Earthshine) and by the instrument lights. Your head sways against
// the thrust you feel and the frame shakes with engine rumble and hits. Turn it off in 🎨 Customize → COCKPIT STYLE.
const CK3={on:true,scene:null,cam:null,root:null,key:'',sun:null,earth:null,amb:null,inst:null,head:{x:0,y:0,z:0},thv:null,leds:[]};
try{CK3.on=localStorage.getItem('orbital-ck3d')!=='0'}catch(e){}
const CK3_PAL={deck:['#30353d','#1b1e23'],real:['#3b4048','#23272d'],physical:['#34383e','#1f2226'],military:['#3d4129','#25281a'],retro:['#6d5c46','#3b3026'],neo:['#1c2533','#0e141d'],classic:['#45484d','#2a2c30']};
function ck3Active(){return CK3.on&&FP&&!SV&&typeof CK_STYLE!=='undefined'&&CK_STYLE!=='classic'}
// a painted-metal texture: base colour, fine noise, panel seams and worn edges (and the matching bump map)
function ck3Tex(col,seed){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext&&c.getContext('2d');if(!x)return null;
 let h=seed||7;const rnd=()=>(h=(h*16807)%2147483647)/2147483647;x.fillStyle=col;x.fillRect(0,0,256,256);
 for(let i=0;i<5000;i++){const v=rnd();x.fillStyle=v>.5?'rgba(255,255,255,'+(v-.5)*.07+')':'rgba(0,0,0,'+(.5-v)*.12+')';x.fillRect(rnd()*256,rnd()*256,1+rnd()*2,1+rnd()*2)}
 x.strokeStyle='rgba(0,0,0,.45)';x.lineWidth=2;x.beginPath();x.moveTo(0,128);x.lineTo(256,128);x.moveTo(128,0);x.lineTo(128,256);x.stroke();
 x.strokeStyle='rgba(255,255,255,.06)';x.lineWidth=1;x.beginPath();x.moveTo(0,130);x.lineTo(256,130);x.moveTo(130,0);x.lineTo(130,256);x.stroke();
 x.fillStyle='rgba(20,20,20,.55)';for(const[a,b]of[[12,12],[244,12],[12,244],[244,244],[116,12],[140,244]]){x.beginPath();x.arc(a,b,3,0,7);x.fill()}
 for(let i=0;i<40;i++){x.strokeStyle='rgba(200,205,210,'+(.04+rnd()*.08)+')';x.lineWidth=.6;x.beginPath();const a=rnd()*256,b=rnd()*256;x.moveTo(a,b);x.lineTo(a+(rnd()-.5)*30,b+(rnd()-.5)*8);x.stroke()}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t}
function ck3Build(){const asp=innerWidth/Math.max(1,innerHeight),pcon=document.body.classList.contains('pcon'),key=CK_STYLE+':'+asp.toFixed(2)+':'+pcon;if(key===CK3.key&&CK3.root)return;CK3.key=key;
 if(!CK3.scene){CK3.scene=new THREE.Scene();CK3.cam=new THREE.PerspectiveCamera(70,asp,.01,20);
  CK3.sun=new THREE.DirectionalLight(0xfff4e6,1.6);CK3.sun.target.position.set(0,0,0);CK3.earth=new THREE.DirectionalLight(0x7fa8ff,.0);CK3.amb=new THREE.AmbientLight(0x404858,.12);
  CK3.inst=new THREE.PointLight(0xffb070,.35,3,2);CK3.inst.position.set(0,-.5,-.55);CK3.scene.add(CK3.sun,CK3.sun.target,CK3.earth,CK3.amb,CK3.inst);
  // real shadows: the window frame, monitors and stick throw sharp-edged sunlight patterns across the console
  try{R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;const sh=CK3.sun.shadow;CK3.sun.castShadow=true;sh.mapSize.set(2048,2048);Object.assign(sh.camera,{left:-1.8,right:1.8,top:1.8,bottom:-1.8,near:.3,far:9});sh.camera.updateProjectionMatrix();sh.bias=-.0004;if('normalBias' in sh)sh.normalBias=.004;CK3.sun.target.position.set(0,-.3,-.6)}catch(e){}}
 if(CK3.root)CK3.scene.remove(CK3.root);const R0=new THREE.Group();CK3.root=R0;CK3.scene.add(R0);CK3.leds=[];CK3.cam.aspect=asp;CK3.cam.updateProjectionMatrix();
 const P=CK3_PAL[CK_STYLE]||CK3_PAL.real,tx=ck3Tex(P[0],11),paint=new THREE.MeshStandardMaterial({color:'#ffffff',map:tx,bumpMap:tx,bumpScale:.002,roughness:.72,metalness:.25}),
  dark=new THREE.MeshStandardMaterial({color:P[1],roughness:.8,metalness:.2}),rub=new THREE.MeshStandardMaterial({color:'#0b0c0d',roughness:.95,metalness:0}),
  steel=new THREE.MeshStandardMaterial({color:'#9aa1aa',roughness:.35,metalness:.9}),glass=new THREE.MeshStandardMaterial({color:'#9fd8c0',transparent:true,opacity:.1,roughness:.04,metalness:.9,depthWrite:false});
 const D=1,th=Math.tan(35*Math.PI/180),hw=th*asp*D,hh=th*D,_w=CK3.win={hw,hh},W=(u,v,d)=>new THREE.Vector3(u*hw*(d||D),v*hh*(d||D),-(d||D));
 // a bar between two points of the window outline, thickness w (across) and depth dp (toward you)
 const X1=new THREE.Vector3(1,0,0),bar=(a,b,w,dp,mat,z0)=>{const L=a.distanceTo(b),m=new THREE.Mesh(new THREE.BoxGeometry(L,w,dp),mat),dir=b.clone().sub(a).normalize();
  m.quaternion.setFromUnitVectors(X1,dir);m.position.copy(a).add(b).multiplyScalar(.5);m.position.z+=dp/2+(z0||0);R0.add(m);return m};
 const deck=CK_STYLE==='deck'&&typeof deckBuild==='function',sill=CK3.win.sill=deck?-.28:pcon?-.3:-.52,top=.8,uA=.6,uB=.9,uO=1.2,vO=.6;
 // window seals first (just behind the frame), then the frame itself
 const outline=[[[-uA,top],[uA,top]],[[-uA,top],[-uB,sill]],[[uA,top],[uB,sill]],[[-uA,top],[-uO,vO]],[[uA,top],[uO,vO]],[[-uO,vO],[-uO-.04,sill]],[[uO,vO],[uO+.04,sill]]];
 for(const[a,b]of outline)bar(W(a[0],a[1],D+.01),W(b[0],b[1],D+.01),.075,.02,rub,-.02);
 bar(W(-1.6,top),W(1.6,top),.085,.1,paint);
 for(const sg of[-1,1]){bar(W(sg*uA,top),W(sg*uB,sill),.06,.09,paint);bar(W(sg*uA,top),W(sg*uO,vO),.05,.08,paint);bar(W(sg*uO,vO),W(sg*(uO+.04),sill),.05,.08,paint);
  // grab handle on each main pillar
  const a=W(sg*(uA+(uB-uA)*.38),top+(sill-top)*.38),b=W(sg*(uA+(uB-uA)*.62),top+(sill-top)*.62);a.z+=.1;b.z+=.1;bar(a,b,.014,.014,steel);
  for(const p of[a,b]){const st=new THREE.Mesh(new THREE.CylinderGeometry(.006,.006,.05,8),steel);st.rotation.x=Math.PI/2;st.position.copy(p);st.position.z-=.025;R0.add(st)}
  // side wall beyond the outer pillar
  const wl=new THREE.Mesh(new THREE.BoxGeometry(hw*.6,hh*2.6,.05),paint);wl.position.set(sg*(uO+.1+.3)*hw,0,-D+.05);wl.rotation.y=-sg*.35;R0.add(wl)}
 // ceiling with an overhead switch panel and status lights
 const ceil=new THREE.Mesh(new THREE.BoxGeometry(hw*3.4,.5,D),paint);ceil.position.set(0,top*hh+.25+.03,-D*.5);R0.add(ceil);
 const hdr=new THREE.Mesh(new THREE.BoxGeometry(hw*3.4,.7,.02),paint);hdr.position.set(0,top*hh+.35,-D-.012);R0.add(hdr);
 const ov=new THREE.Mesh(new THREE.BoxGeometry(hw*.62,.05,.28),dark);ov.position.set(0,top*hh+.005,-D+.2);R0.add(ov);
 for(let i=0;i<8;i++){const sw=new THREE.Mesh(new THREE.BoxGeometry(.012,.03,.012),steel);sw.position.set((i-3.5)*hw*.07,top*hh-.03,-D+.12);sw.rotation.x=.5;R0.add(sw);
  const led=new THREE.Mesh(new THREE.BoxGeometry(.014,.006,.014),new THREE.MeshStandardMaterial({color:'#222',emissive:i%3===0?'#ffb000':'#38ff7a',emissiveIntensity:.9}));led.position.set((i-3.5)*hw*.07,top*hh-.022,-D+.19);R0.add(led);CK3.leds.push(led)}
 if(deck)deckBuild(R0,{hw,hh,sill});else{
 // glare shield along the bottom of the window (its top surface faces you), and the dashboard face below it
 const gs=new THREE.Mesh(new THREE.BoxGeometry(hw*3.2,.05,.2),paint);gs.position.set(0,sill*hh-.025,-D+.1);R0.add(gs);
 const lip=new THREE.Mesh(new THREE.BoxGeometry(hw*3.2,.03,.03),rub);lip.position.set(0,sill*hh+.001,-D+.2);R0.add(lip);
 const dash=new THREE.Mesh(new THREE.BoxGeometry(hw*3.2,hh*1.4,.05),dark);dash.position.set(0,sill*hh-.05-hh*.7,-D+.21);R0.add(dash);
 // head-up display combiner: a tilted pane of tinted glass above the glare shield
 if(!pcon||asp>1.2){const hud=new THREE.Mesh(new THREE.PlaneGeometry(hw*.44,hh*.32),glass);hud.position.set(0,sill*hh+hh*.17,-D+.12);hud.rotation.x=-.32;R0.add(hud);
  for(const sg of[-1,1]){const arm=new THREE.Mesh(new THREE.BoxGeometry(.008,hh*.34,.008),steel);arm.position.set(sg*hw*.22,sill*hh+hh*.17,-D+.12);arm.rotation.x=-.32;R0.add(arm)}}}
 // rivets along the top beam and pillars
 const rv=new THREE.SphereGeometry(.0045,6,4),rm=steel,pts=[];for(let i=-14;i<=14;i++)pts.push(W(i*.1,top-.045,D-.102));
 for(const sg of[-1,1])for(let k=1;k<8;k++){const f=k/8;pts.push(W(sg*(uA+(uB-uA)*f+.025),top+(sill-top)*f,D-.092))}
 const im=new THREE.InstancedMesh(rv,rm,pts.length),o3=new THREE.Object3D();pts.forEach((p,i)=>{o3.position.copy(p);o3.updateMatrix();im.setMatrixAt(i,o3.matrix)});R0.add(im);
 R0.traverse(m=>{if(m.isMesh&&m.material&&m.material.isMeshStandardMaterial&&!m.material.transparent){m.castShadow=true;m.receiveShadow=true}});CK3.envAt=0}
// lighting from the real world: the Sun's direction (in view space), its brightness, shadow, Earthshine, alarms
const ck3V=new THREE.Vector3();
// how much of a light from view-space direction v gets in: only through the window opening (0 outside, soft edges;
// the frame's exact shadow comes from the shadow map). Sunlight from behind or above falls on the hull, not on you.
const ck3SS=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)};
function ck3Win(v){const W=CK3.win;if(!W||v.z>-.04)return 0;const z=-v.z,u=v.x/z/W.hw,w=v.y/z/W.hh;return ck3SS(W.sill-.06,W.sill+.06,w)*(1-ck3SS(.74,.86,w))*(1-ck3SS(1.12,1.3,Math.abs(u)))}
function ck3Light(now){const S=B[0],dx=S.x-s.x,dy=S.y-s.y,dz=S.z-s.z,r=Math.hypot(dx,dy,dz)||1,flux=(AU/r)**2;
 ck3V.set(dx/r,dy/r,dz/r).transformDirection(cam.matrixWorldInverse);const win=ck3Win(ck3V),lit=(typeof visLit==='function'?visLit():s.lit?1:0);
 CK3.sun.position.copy(ck3V).multiplyScalar(4).add(CK3.sun.target.position);CK3.sunDir=ck3V.clone();
 CK3.sun.intensity=lit*win*Math.min(2.6,.4+1.3*Math.pow(flux,.3));CK3.sunIn=lit*win*Math.min(1,flux*2);
 const P=s.dom;CK3.earthDir=null;if(P&&P!==S&&!P.star){const ex=P.x-s.x,ey=P.y-s.y,ez=P.z-s.z,d=Math.hypot(ex,ey,ez)||1,k=Math.min(1,(P.R/d)**2*1.4);ck3V.set(ex/d,ey/d,ez/d).transformDirection(cam.matrixWorldInverse);
  const ew=Math.max(ck3Win(ck3V),.25*Math.min(1,P.R/d*3));CK3.earth.position.copy(ck3V);CK3.earth.intensity=ew*k*(P.n==='Earth'?.9:.5)*Math.min(1,flux);CK3.earth.color.set(P.n==='Earth'?0x7fa8ff:P.n==='Mars'?0xd08060:0xb0b0b0);CK3.earthDir=ck3V.clone()}else CK3.earth.intensity=0;
 const crit=typeof ALERTS!=='undefined'&&ALERTS.some(a=>a.l==='crit'),hurt=typeof CB!=='undefined'&&CB.hurt&&now-CB.hurt<500;
 CK3.inst.color.set(crit||hurt?0xff3a2a:0xffb070);CK3.inst.intensity=(crit?.5+.4*Math.sin(now/180):.32)+(s.lit?0:.15);CK3.amb.intensity=CK_STYLE==='deck'?.05:.12;
 CK3.leds.forEach((l,i)=>{l.material.emissiveIntensity=(i%3===0&&crit)?(Math.sin(now/150)>0?1.4:.1):.9});
 if(now-(CK3.envAt||0)>2000){CK3.envAt=now;try{ck3Env()}catch(e){}}}
// reflections: a small panorama of the cabin as seen from your seat (dim walls, the window with the planet's glow,
// the Sun when it shines in, the three displays), pre-filtered so glossy and rough surfaces both reflect it correctly
function ck3Env(){if(!THREE.PMREMGenerator)return;const W=128,H=64;if(!CK3.envC){CK3.envC=document.createElement('canvas');CK3.envC.width=W;CK3.envC.height=H;CK3.pmrem=new THREE.PMREMGenerator(R)}
 const x=CK3.envC.getContext&&CK3.envC.getContext('2d');if(!x)return;const im=x.createImageData(W,H),D=im.data,v=new THREE.Vector3(),sd=CK3.sunDir,ed=CK3.earthDir,si=CK3.sunIn||0,ei=CK3.earth.intensity,ec=CK3.earth.color,deck=CK_STYLE==='deck';
 for(let j=0;j<H;j++)for(let i=0;i<W;i++){const lon=(i/W-.5)*2*Math.PI,lat=(.5-j/H)*Math.PI;v.set(Math.cos(lat)*Math.cos(lon),Math.sin(lat),Math.cos(lat)*Math.sin(lon));
  let r=.05+.03*Math.max(0,v.y),g=r*1.05,b=r*1.15;const w=ck3Win(v);
  if(w>0){r=r*(1-w)+w*.01;g=g*(1-w)+w*.012;b=b*(1-w)+w*.02;if(ed&&ei>0){const c=Math.max(0,v.dot(ed));r+=w*ei*c*c*ec.r*.8;g+=w*ei*c*c*ec.g*.8;b+=w*ei*c*c*ec.b*.8}}
  if(sd&&si>0){const c=v.dot(sd);if(c>.995){r+=si*3;g+=si*2.9;b+=si*2.7}else if(c>.97){r+=si*.6;g+=si*.58;b+=si*.5}}
  if(deck&&v.z<-.5&&v.y<-.2&&v.y>-.62&&Math.abs(v.x)<.75){r+=.02;g+=.16;b+=.24}
  const k=(j*W+i)*4,enc=q=>Math.max(0,Math.min(255,Math.round(255*q*1.6)));D[k]=enc(r);D[k+1]=enc(g);D[k+2]=enc(b);D[k+3]=255}
 x.putImageData(im,0,0);const t=new THREE.CanvasTexture(CK3.envC);t.mapping=THREE.EquirectangularReflectionMapping;const rt=CK3.pmrem.fromEquirectangular(t);t.dispose();
 if(CK3.envRT)CK3.envRT.dispose();CK3.envRT=rt;CK3.scene.environment=rt.texture}
// the head sways against the felt acceleration (thrust only: in free fall gravity is not felt) and shakes with the engine
function ck3Head(now){const g=typeof THV!=='undefined'?THV:null;let ax=0,ay=0,az=0;
 if(g&&CK3.thv){const dv=[g[0]-CK3.thv[0],g[1]-CK3.thv[1],g[2]-CK3.thv[2]],m=Math.hypot(dv[0],dv[1],dv[2]);if(m>0&&s.burn>0){const a=Math.min(3*9.81,s.burn*thrustAcc());ck3V.set(dv[0]/m,dv[1]/m,dv[2]/m).transformDirection(cam.matrixWorldInverse);ax=ck3V.x*a;ay=ck3V.y*a;az=ck3V.z*a}}
 if(g)CK3.thv=[g[0],g[1],g[2]];const k=.0016,H=CK3.head;H.x+=(-ax*k-H.x)*.08;H.y+=(-ay*k-H.y)*.08;H.z+=(-az*k-H.z)*.08;
 const rum=s.burn>0?.0012*Math.min(1,s.burn):0,hit=typeof CB!=='undefined'&&CB.hurt?Math.max(0,1-(now-CB.hurt)/450)*.012:0,j=rum+hit;
 CK3.cam.position.set(Math.max(-.04,Math.min(.04,H.x))+(Math.random()-.5)*j,Math.max(-.04,Math.min(.04,H.y))+(Math.random()-.5)*j,Math.max(-.04,Math.min(.04,H.z)))}
ORB.on('frame',now=>{const on=ck3Active();document.body.classList.toggle('ck3d',on);if(!on)return;
 try{ck3Build();ck3Light(now);ck3Head(now);R.clearDepth();const tm=R.toneMapping,te=R.toneMappingExposure;if(THREE.ACESFilmicToneMapping!==undefined){R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.15}
  R.render(CK3.scene,CK3.cam);R.toneMapping=tm;R.toneMappingExposure=te}catch(e){CK3.on=false;console.warn('3D cockpit off:',e)}});
function ck3Toggle(v){CK3.on=v===undefined?!CK3.on:!!v;try{localStorage.setItem('orbital-ck3d',CK3.on?'1':'0')}catch(e){}return CK3.on}
ORB.cockpit.frame3d=ck3Toggle;
