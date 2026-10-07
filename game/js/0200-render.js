// ===== RENDER =====
const R=new THREE.WebGLRenderer({antialias:true,logarithmicDepthBuffer:true});R.setSize(innerWidth,innerHeight);R.setPixelRatio(Math.min(devicePixelRatio,2));document.body.appendChild(R.domElement);
const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(55,innerWidth/innerHeight,1e-7,1e6);cam.up.set(0,0,1);
const light=new THREE.PointLight(0xffffff,1.8,0,0);sc.add(light,new THREE.AmbientLight(0x1a1a28));
{const p=[];for(let i=0;i<900;i++){const u=Math.random()*2-1,t=Math.random()*6.283,q=Math.sqrt(1-u*u);p.push(4e5*q*Math.cos(t),4e5*q*Math.sin(t),4e5*u)}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));sc.add(new THREE.Points(g,new THREE.PointsMaterial({size:1.5,sizeAttenuation:false,color:0x8890b0})))}
const meshes=B.map(b=>{const m=new THREE.Mesh(new THREE.SphereGeometry(b.R/U,32,16),b.p<0?new THREE.MeshBasicMaterial({color:b.c}):new THREE.MeshLambertMaterial({color:b.c}));sc.add(m);return m});
const rings=B.map((b,i)=>{if(!i)return null;const p=[];for(let k=0;k<=256;k++){const t=k/256*6.2832;p.push(b.a/U*Math.cos(t),b.a/U*Math.sin(t),0)}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));const l=new THREE.Line(g,new THREE.LineBasicMaterial({color:0x2c3558}));sc.add(l);return l});
const mp=new Float32Array((N+1)*3),mc=new Float32Array((N+1)*3),mg=new THREE.BufferGeometry();
ALL.forEach((b,i)=>{const c=new THREE.Color(i==N?0xff8a00:b.c);mc.set([c.r,c.g,c.b],i*3)});
mg.setAttribute('position',new THREE.BufferAttribute(mp,3));mg.setAttribute('color',new THREE.BufferAttribute(mc,3));
sc.add(new THREE.Points(mg,new THREE.PointsMaterial({size:5,sizeAttenuation:false,vertexColors:true})));
const eg=new THREE.BufferGeometry(),ep=new Float32Array(181*3);eg.setAttribute('position',new THREE.BufferAttribute(ep,3));
const eline=new THREE.Line(eg,new THREE.LineBasicMaterial({color:0xff8a00}));eline.frustumCulled=false;sc.add(eline);
const mkA=c=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(6),3));const l=new THREE.Line(g,new THREE.LineBasicMaterial({color:c}));l.frustumCulled=false;sc.add(l);return l};
const arV=mkA(0x44ff88),arT=mkA(0xff5533);let VD=[1,0,0];
const AXC=['#ff6ec7','#ffe14d','#4dd2ff'],AXV=[[1,0,0],[0,1,0],[0,0,1]],axL=AXC.map(c=>mkA(new THREE.Color(c))),axTip=[[0,0,0],[0,0,0],[0,0,0]],
 axN=['+X  (D)','+Y  (W)','+Z  (E)'].map((t,i)=>{const d=document.createElement('div');d.className='l';d.style.color=AXC[i];d.style.fontWeight='700';d.textContent=t;$('lb').appendChild(d);return d});
function setA(l,ox,oy,oz,d,len){const a=l.geometry.attributes.position.array;a[0]=ox;a[1]=oy;a[2]=oz;a[3]=ox+d[0]*len;a[4]=oy+d[1]*len;a[5]=oz+d[2]*len;l.geometry.attributes.position.needsUpdate=true}
const labs=ALL.map(b=>{const d=document.createElement('div');d.className='l';d.textContent=b.n;$('lb').appendChild(d);return d});function $(i){return document.getElementById(i)}
// camera / focus
const FOC=[s,...B];let fi=0,dist=.02,az=.6,el=.4,WARP=[1,10,60,300,3e3,3e4,3e5,3e6,3e7],wi=3,paused=false,T=0;
const setFocus=i=>{fi=i%FOC.length;const f=FOC[fi];dist=fi?Math.max(f.R*5/U,1e-3):.02};
R.domElement.addEventListener('pointermove',e=>{if(e.buttons){const k=FP?.003:.006;az-=e.movementX*k;el=Math.max(-1.5,Math.min(1.5,el+(FP?-1:1)*e.movementY*k));stabCapture()}});
R.domElement.addEventListener('wheel',e=>{e.preventDefault();zoom(Math.exp(e.deltaY*.001))},{passive:false});
const zoom=f=>{if(SV){svd=Math.max(6,Math.min(800,svd*f));return}if(FP){cam.fov=Math.max(3,Math.min(100,cam.fov*f));cam.updateProjectionMatrix()}else dist=Math.max(fi==0?3e-8:1e-6,Math.min(6e3,dist*f))};
// UI
const acts={'Warp −':()=>{if(!mpReq('slower'))wi=Math.max(0,wi-1)},'Warp +':()=>{if(!mpReq('faster')&&!(MP.lock&&MP.conn))wi=Math.min(WARP.length-1,wi+1)}};
const regs=[],P1=5e6,PR=2e6;let det=false;
function grp(p,t){const d=document.createElement('div');d.className='sec';d.innerHTML='<h4>'+t+'</h4>';p.appendChild(d);return d}
function btn(p,label,fn,en){const b=document.createElement('button');if(fn)b.onclick=fn;p.appendChild(b);regs.push({b,label:typeof label=='function'?label:()=>label,en});return b}
function hold(p,label,k){const b=btn(p,label);const on=()=>{K[k]=1;AP=null},off=()=>K[k]=0;b.onpointerdown=on;b.onpointerup=off;b.onpointerleave=off;b.onpointercancel=off}
const buyP=n=>{n=Math.floor(n);if(n<1||maxP()<n)return;s.en-=P1*n;s.res.silicates-=PSI*n;s.area+=n},buyF=n=>buyFu(DR[di].f,n);
const perM2=()=>{const S=B[0];return S0*AU*AU/((s.x-S.x)**2+(s.y-S.y)**2+(s.z-S.z)**2)*EFF},toggleShop=()=>$('shop').classList.toggle('h');
$('shopbtn').onclick=toggleShop;$('shopclose').onclick=toggleShop;
// time bar
btn($('tc'),()=>'⏪ Slower  ('+KN(BIND.slower)+')',acts['Warp −']);btn($('tc'),()=>'⏯ Pause  ('+KN(BIND.pause)+')',()=>togglePause());btn($('tc'),()=>'⏩ Faster  ('+KN(BIND.faster)+')',acts['Warp +']);btn($('tc'),'Reset ×300',()=>{if(!mpReq('reset')&&!(MP.lock&&MP.conn)){wi=3;paused=false}});
{const r=document.createElement('span');r.id='rate';$('tc').appendChild(r)}
const RES=['water','carbon','silicates','iron','nickel','platinum'],RN={water:'water ice',carbon:'carbon',silicates:'silicates',iron:'iron',nickel:'nickel',platinum:'platinum metals'};
const COMP={C:{water:.15,carbon:.05,silicates:.7,iron:.08,nickel:.015,platinum:2e-5},S:{water:.01,carbon:.005,silicates:.75,iron:.18,nickel:.04,platinum:2e-5},M:{water:0,carbon:.002,silicates:.1,iron:.8,nickel:.09,platinum:1e-4}};
const TYN={C:'carbon-rich: water, carbon',S:'stony: silicates, iron',M:'metallic: iron, nickel, platinum'};
const AST=[];{let sd=12345;const rnd=()=>(sd=sd*16807%2147483647)/2147483647,TY=['C','S','M'];
 ['Kestrel','Halcyon','Tamsin','Ophir','Velka','Corvo','Nimbus','Petra'].forEach((n,k)=>AST.push({n,t:TY[k%3],neo:true,a:AU*(1+(rnd()-.5)*.006),e:.005+rnd()*.02,i:rnd()*.01,W:0,w:0,M0:(k%2?1:-1)*(.6+k*.35)*Math.PI/180,r:30+rnd()*250}));
 ['Aldra','Brisa','Cendre','Dorrit','Esk','Fenwick','Galt','Hesper','Ilsa','Jory','Kael','Lumen','Marrow','Nyx','Orrin','Pell','Quill','Rook','Sable','Tarn','Ulla','Voss','Wren','Xan','Yarrow','Zell','Ashby','Brann','Cove','Dusk'].forEach(n=>AST.push({n,t:TY[(rnd()*3)|0],neo:false,a:AU*(2.2+rnd()),e:.02+rnd()*.12,i:rnd()*.12,W:rnd()*6.283,w:rnd()*6.283,M0:rnd()*6.283,r:200+rnd()*2300}));
 AST.forEach((a,k)=>{a.id=k;a.mined=0})}
// asteroids follow exact Kepler orbits around the Sun (their own gravity is negligible)
function astState(a,t=T){const S=B[0],n=Math.sqrt(S.GM/(a.a*a.a*a.a)),M=a.M0+n*t;let E2=M;for(let k=0;k<6;k++)E2-=(E2-a.e*Math.sin(E2)-M)/(1-a.e*Math.cos(E2));
 const cE=Math.cos(E2),sE=Math.sin(E2),q=Math.sqrt(1-a.e*a.e),xp=a.a*(cE-a.e),yp=a.a*q*sE,den=1-a.e*cE,vxp=-a.a*n*sE/den,vyp=a.a*n*q*cE/den,
  cw=Math.cos(a.w),sw=Math.sin(a.w),cW=Math.cos(a.W),sW=Math.sin(a.W),ci=Math.cos(a.i),si=Math.sin(a.i),
  R3=(x,y)=>[(cW*cw-sW*sw*ci)*x+(-cW*sw-sW*cw*ci)*y,(sW*cw+cW*sw*ci)*x+(-sW*sw+cW*cw*ci)*y,sw*si*x+cw*si*y],p=R3(xp,yp),v=R3(vxp,vyp);
 return{x:S.x+p[0],y:S.y+p[1],z:S.z+p[2],vx:S.vx+v[0],vy:S.vy+v[1],vz:S.vz+v[2],r:a.r}}
const astDist=a=>{const A=astState(a);return Math.hypot(A.x-s.x,A.y-s.y,A.z-s.z)},fmtD=d=>d>1e9?(d/AU).toFixed(3)+' AU':d>1e4?Math.round(d/1e3).toLocaleString()+' km':Math.round(d)+' m';
const nearBelt=()=>AST.filter(a=>!a.neo).reduce((b,a)=>astDist(a)<astDist(b)?a:b);

