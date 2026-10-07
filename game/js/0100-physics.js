// ===== PHYSICS (SI units, doubles). Full N-body: every body attracts every other; ship is a test particle. =====
const G=6.6743e-11,AU=1.496e11,S0=1361,U=1e9;
const D=[['Sun',-1,0,1.989e30,6.957e8,2.19e6,0xffcc66],['Mercury',0,5.791e10,3.301e23,2.4397e6,5.067e6,0xaaaaaa],['Venus',0,1.0821e11,4.8675e24,6.0518e6,2.0997e7,0xe6c27a],
['Earth',0,1.496e11,5.972e24,6.371e6,86164,0x3b7be0],['Moon',3,3.844e8,7.342e22,1.7374e6,2.3606e6,0xbbbbbb],['Mars',0,2.2794e11,6.417e23,3.3895e6,88642,0xc1440e],
['Jupiter',0,7.7857e11,1.8982e27,6.9911e7,35730,0xd8b48a],['Saturn',0,1.4335e12,5.683e26,5.8232e7,38362,0xe3d3a0]];
const B=D.map(d=>({n:d[0],p:d[1],a:d[2],m:d[3],GM:G*d[3],R:d[4],rot:d[5],c:d[6],x:0,y:0,z:0,vx:0,vy:0,vz:0,ax:0,ay:0,az:0}));
const N=B.length;
B.forEach((b,i)=>{if(!i){b.soi=1e30;return}const P=B[b.p],ph=(i==3||i==4)?0:i*1.7,v=Math.sqrt(P.GM/b.a);
 b.x=P.x+b.a*Math.cos(ph);b.y=P.y+b.a*Math.sin(ph);b.vx=P.vx-v*Math.sin(ph);b.vy=P.vy+v*Math.cos(ph);b.soi=b.a*Math.pow(b.m/P.m,.4)});
// Planets and the Moon follow exact circular orbits computed from the clock: the same time gives the same solar system on every computer (needed for multiplayer).
B.forEach((b,i)=>{b.rail=true;if(i){const P=B[b.p];b.ph=Math.atan2(b.y-P.y,b.x-P.x);b.nn=Math.sqrt((P.GM+b.GM)/(b.a*b.a*b.a))}});
function setRails(t){const S0b=B[0];S0b.x=S0b.y=S0b.z=S0b.vx=S0b.vy=S0b.vz=0;for(let i=1;i<N;i++){const b=B[i],P=B[b.p],th=b.ph+b.nn*t,c=Math.cos(th),sn=Math.sin(th);
 b.x=P.x+b.a*c;b.y=P.y+b.a*sn;b.z=0;b.vx=P.vx-b.a*b.nn*sn;b.vy=P.vy+b.a*b.nn*c;b.vz=0}}
setRails(0);
const E=B[3],r0=E.R+4e5;
const C=299792458,MAXB=.99,BASE=300;
const s={n:'Ship',x:E.x-r0,y:E.y,z:0,vx:E.vx,vy:E.vy-Math.sqrt(E.GM/r0),vz:0,ax:0,ay:0,az:0,GM:0,dry:300,prop:100,area:10,en:4.5e8,lit:1,burn:0,tau:0,dom:E,msg:''};
// ship vx,vy,vz hold PROPER velocity u=gamma*v (cannot reach c). Planets use the same code (gamma~1).
let EFF=.3,PREDICTING=false;var SH=null;const ALL=[...B,s],K={},// Four real drive types. k: thrust F = k*P/ve (k=2 for jet power, 2*efficiency for electric, 1 for photons). el: powered by the battery?
// Engines. k: thrust F = k·P/ve (2 for jet power, 2·efficiency for electric, 1 for photons). al: engine mass per watt of rated power. hf: waste heat per watt. loop: which cooling loop takes that heat.
DR=[
 {id:'chem',ic:'🔥',n:'Chemical rocket',f:'chem',ve:4413,k:2,el:false,pw:1.2e8,al:2e-6,base:60,hf:.005,loop:'none',how:'Burns hydrogen with oxygen; the fuel holds the energy and carries its own heat away. Strong thrust but slow exhaust (4.4 km/s), so fuel runs out fast.'},
 {id:'ion',ic:'⚛',n:'Ion thruster',f:'xe',ve:29420,k:1.2,el:true,pw:5e4,al:2e-3,base:20,hf:.3,loop:'lo',how:'Electric: fires xenon ions at 29 km/s. Very fuel-efficient but gentle; 30% of its power becomes heat in the power electronics, so it needs radiators.'},
 {id:'vas',ic:'🌀',n:'VASIMR plasma engine',f:'h2',ve:5e4,k:1.2,el:true,pw:2e5,al:2.5e-3,base:100,hf:.35,loop:'lo',how:'Electric: radio waves heat hydrogen into plasma, a magnetic nozzle shapes it: 50 km/s exhaust from hydrogen you can make from water.'},
 {id:'ntr',ic:'☢',n:'Nuclear thermal rocket',f:'h2',ve:8800,k:2,el:false,pw:3e8,al:5e-6,base:500,hf:.01,loop:'hi',how:'A uranium reactor heats hydrogen to ~2,500 °C: 8.8 km/s with strong thrust. The propellant carries most of the heat away.'},
 {id:'sail',ic:'⛵',n:'Solar sail',f:null,ve:C,k:0,el:false,pw:0,al:0,base:0,hf:0,loop:'none',sail:true,how:'A 10,000 m² mirror pushed by sunlight. No fuel, no power, tiny thrust that can only point away from the Sun. Useless in shadow.'},
 {id:'fus',ic:'☀',n:'Magnetic-confinement fusion drive',f:'fus',ve:.05*C,k:2,el:false,pw:1e9,al:2e-5,base:2000,hf:.15,loop:'hi',how:'Steady D–D fusion plasma held by magnets and bled out of a magnetic nozzle at 5% of light speed. Reliable but heavy; 15% of its power ends up as heat (radiation from the plasma).'},
 {id:'am',ic:'✴',n:'Antimatter photon rocket',f:'am',ve:C,k:1,el:false,pw:1e12,al:1e-8,base:5000,hf:.05,loop:'hi',how:'Matter and antimatter annihilate into light, reflected out the back. Exhaust = light speed, the only way to 0.99c. Absorbed gamma rays heat the mirror.'},
 {id:'mpd',ic:'🧲',n:'MPD thruster',f:'h2',ve:4e4,k:1,el:true,pw:1e6,al:1e-3,base:200,hf:.5,loop:'hi',how:'Magnetoplasmadynamic: a huge current through hydrogen plasma pushes it out with its own magnetic field. Megawatt-class electric thrust, but only ~50% efficient: very hot electrodes.'},
 {id:'icf',ic:'💥',n:'Inertial-fusion pulse drive',f:'fus',ve:.03*C,k:2,el:false,pw:5e9,al:6e-6,base:3000,hf:.2,loop:'hi',how:'Lasers implode deuterium pellets hundreds of times a second inside a magnetic thrust chamber (like Project Daedalus). Lighter and more powerful than steady fusion, lower exhaust speed (3% of c), harder on the hardware.'},
 {id:'beam',ic:'🌟',n:'Beamed-core antimatter drive',f:'am',ve:.33*C,k:1.2,el:false,pw:1e11,al:5e-8,base:3000,hf:.4,loop:'hi',how:'Antiprotons annihilate on protons; the charged pions they make are steered out by a magnetic nozzle at a third of light speed. Much more thrust per watt than a photon rocket, lower top speed.'}];
DR.forEach(D=>{D.pw0=D.pw;D.ve0=D.ve;D.mk=1;D.cond=1;D.fail=false});
// fuels: inside Earth's gravity zone you can order them from Earth (energy only); in deep space you make them yourself (mostly from asteroid water)
const FUEL={chem:{n:'Rocket fuel',full:'liquid hydrogen + liquid oxygen',J:3e7,earthJ:1e8,make:{water:1},how:'made from water by electrolysis, then liquefied: 1 kg water → 1 kg fuel'},
 xe:{n:'Xenon',full:'xenon gas',J:2e6,earthJ:2e6,earthOnly:true,make:{},how:'a rare gas from Earth’s air; asteroids have none, so only available inside Earth’s gravity zone'},
 h2:{n:'Liquid hydrogen',full:'liquid hydrogen',J:1.8e8,earthJ:4e8,make:{water:9},how:'made from water: 9 kg water → 1 kg hydrogen (oxygen vented)'},
 fus:{n:'Deuterium',full:'deuterium (heavy hydrogen)',J:1e10,earthJ:3e10,make:{water:30000},how:'about 1 in 3,200 water molecules holds a deuterium atom: ~30 tonnes of water → 1 kg'},
 am:{n:'Antimatter fuel',full:'matter + antimatter, equal parts',J:C*C,make:{},how:'made in your antimatter factory at exactly its mc² in energy (the theoretical limit)'}};
for(const k in FUEL)Object.defineProperty(FUEL[k],'cost',{get(){return inEarth()&&this.earthJ?this.earthJ:this.J}});
s.fuel={chem:4200,xe:100,h2:0,fus:0,am:0};s.res={water:300,carbon:20,silicates:200,iron:100,nickel:20,platinum:0,oxygen:60,food:120,spares:6};s.mined=0;s.sailA=0;s.ammo={missile:4};
// ship systems state
s.parts=['frame_al','bat_li','ls_open','lab1','fab1'].map(id=>({id,cond:1,fail:false}));s.tLo=293;s.tHi=300;s.rp=20;s.tech={};s.research=null;s.rprog={};s.jobs=[];
s.crew={hp:100,dose:0,acute:0,alive:true};s.co2=0;s.leak=0;s.pcond=1;s.lim={};s.burnAcc=0;s.wHeat=0;s.pFree=0;s.roomLo=1e9;s.roomHi=1e9;s.engHeat=0;s.genNow=0;s.loadNow=0;
s.codex={seen:{},log:[],built:{},rec:{maxV:0,minR:AU,maxR:AU,mined:0,age:0}};
Object.defineProperty(s,'prop',{get(){const f=DR[di].f;return f?s.fuel[f]:Infinity},set(v){const f=DR[di].f;if(f)s.fuel[f]=v},configurable:true});
let di=0,PW=DR[0].pw,Q=1,UNL={chem:1,ion:1,mlaser:1,plaser:1,missile:1};const isU=id=>!!UNL[id],inEarth=()=>s.dom===B[3];
const fuelMass=()=>Object.values(s.fuel).reduce((a,b)=>a+b,0),resMass=()=>Object.values(s.res).reduce((a,b)=>a+b,0);
const mass=()=>dryMass()+.2*s.area+fuelMass()+resMass()+s.sailA*.02+s.ammo.missile*50+(typeof opsMass==='function'?opsMass():0)+s.en/(C*C); // stored energy has mass E/c^2
const gam=b=>Math.sqrt(1+(b.vx*b.vx+b.vy*b.vy+b.vz*b.vz)/(C*C));
function acc(){for(const b of ALL){if(b.rail)continue;let X=0,Y=0,Z=0;for(const o of B){if(o===b)continue;const dx=o.x-b.x,dy=o.y-b.y,dz=o.z-b.z,r2=dx*dx+dy*dy+dz*dz,f=o.GM/(r2*Math.sqrt(r2));X+=dx*f;Y+=dy*f;Z+=dz*f}b.ax=X;b.ay=Y;b.az=Z}}
function ctl(){let best=0,bs=1e30,tm=1e30;for(let i=0;i<N;i++){const b=B[i],d=Math.hypot(s.x-b.x,s.y-b.y,s.z-b.z);if(i&&d<b.soi&&b.soi<bs){bs=b.soi;best=i}const t=Math.min(Math.sqrt(d*d*d/b.GM),10*d/(Math.hypot(s.vx,s.vy,s.vz)+1));if(t<tm)tm=t}s.dom=B[best];return tm}
function dirVec(){const d=s.dom,rx=s.x-d.x,ry=s.y-d.y,rz=s.z-d.z,vx=s.vx-d.vx,vy=s.vy-d.vy,vz=s.vz-d.vz,r=Math.hypot(rx,ry,rz),v=Math.hypot(vx,vy,vz);
 const nx=ry*vz-rz*vy,ny=rz*vx-rx*vz,nz=rx*vy-ry*vx,n=Math.hypot(nx,ny,nz)||1;
 const c={w:[vx/v,vy/v,vz/v],s:[-vx/v,-vy/v,-vz/v],d:[rx/r,ry/r,rz/r],a:[-rx/r,-ry/r,-rz/r],e:[nx/n,ny/n,nz/n],q:[-nx/n,-ny/n,-nz/n]};
 const KK=apKeys()||K;if(KK.dir)return KK.dir;const cc=AP?c:FP?FPV():XYZ?AX:c;let X=0,Y=0,Z=0;for(const k in cc)if(KK[k]){X+=cc[k][0];Y+=cc[k][1];Z+=cc[k][2]}const l=Math.hypot(X,Y,Z);return l?[X/l,Y/l,Z/l]:null}
function step(dt){TDT=dt;const h=dt/2; // inside a step, positions are already at time T+dt
 for(const b of ALL){if(b.rail)continue;b.vx+=b.ax*h;b.vy+=b.ay*h;b.vz+=b.az*h;const k=dt/gam(b);b.x+=b.vx*k;b.y+=b.vy*k;b.z+=b.vz*k}setRails(T+dt);
 acc();
 const dv=dirVec(),g=gam(s);s.burn=0;s.engHeat=0;
 if(dv&&(s.en>0||!DR[di].el)&&s.prop>0){const De=DR[di],u=Math.hypot(s.vx,s.vy,s.vz),m=mass(),ux=u>0?s.vx/u:0,uy=u>0?s.vy/u:0,uz=u>0?s.vz/u:0,par=dv[0]*ux+dv[1]*uy+dv[2]*uz;
  if(!(par>0&&u/g>=MAXB*C*.999999)){ // forward thrust blocked at the speed cap
   const F=De.sail?sailF(dv):De.k*PW/De.ve,md=De.sail?0:F/De.ve,lim=engLimits(De,F,m,dt/g),f=Math.min(THR,lim,s.prop/(md*dt/g)),a=f*F/m; // costs are per SHIP (proper) time
   const qx=dv[0]-par*ux,qy=dv[1]-par*uy,qz=dv[2]-par*uz; // SR: parallel force unchanged, perpendicular force /gamma
   s.ax+=a*(par*ux+qx/g);s.ay+=a*(par*uy+qy/g);s.az+=a*(par*uz+qz/g);if(!PREDICTING){THV[0]+=a*(par*ux+qx/g)*dt;THV[1]+=a*(par*uy+qy/g)*dt;THV[2]+=a*(par*uz+qz/g)*dt}
   s.prop=Math.max(0,s.prop-f*md*dt/g);if(De.el)s.en-=f*PW*dt/g;s.burn=F>0?f:0;s.engHeat=F>0?f*PW*De.hf:0;if(!PREDICTING&&F>0)s.burnAcc+=f*dt}}
 for(const b of ALL){if(b.rail)continue;b.vx+=b.ax*h;b.vy+=b.ay*h;b.vz+=b.az*h}
 {const um=MAXB*C/Math.sqrt(1-MAXB*MAXB),u=Math.hypot(s.vx,s.vy,s.vz);if(u>um){const k=um/u;s.vx*=k;s.vy*=k;s.vz*=k}}
 s.tau+=dt/gam(s);
 const wx=B[0].x-s.x,wy=B[0].y-s.y,wz=B[0].z-s.z,w2=wx*wx+wy*wy+wz*wz;s.lit=1;
 for(let i=1;i<N;i++){const b=B[i];let t=((b.x-s.x)*wx+(b.y-s.y)*wy+(b.z-s.z)*wz)/w2;t=Math.max(0,Math.min(1,t));
  if(Math.hypot(s.x+t*wx-b.x,s.y+t*wy-b.y,s.z+t*wz-b.z)<b.R){s.lit=0;break}}
 powerStep(dt,S0*(AU*AU/w2));
TDT=0}
function elements(){const gs=gam(s),d=s.dom,mu=d.GM,rx=s.x-d.x,ry=s.y-d.y,rz=s.z-d.z,vx=s.vx/gs-d.vx,vy=s.vy/gs-d.vy,vz=s.vz/gs-d.vz,r=Math.hypot(rx,ry,rz),v2=vx*vx+vy*vy+vz*vz,rv=rx*vx+ry*vy+rz*vz,k=(v2-mu/r)/mu;
 const e=[k*rx-rv*vx/mu,k*ry-rv*vy/mu,k*rz-rv*vz/mu],h=[ry*vz-rz*vy,rz*vx-rx*vz,rx*vy-ry*vx],ec=Math.hypot(...e),eps=v2/2-mu/r;
 return{d,r,v:Math.sqrt(v2),e:e,h:h,ec,a:-mu/(2*eps),eps,hh:Math.hypot(...h)}}
let TDT=0,AP=null,apNote='',THR=1,XYZ=false,FP=false,STAB=true;
function FPV(){const ce=Math.cos(el),f=[ce*Math.cos(az),ce*Math.sin(az),Math.sin(el)],r=[Math.sin(az),-Math.cos(az),0],u=[r[1]*f[2]-r[2]*f[1],r[2]*f[0]-r[0]*f[2],r[0]*f[1]-r[1]*f[0]];return{w:f,s:f.map(x=>-x),d:r,a:r.map(x=>-x),e:u,q:u.map(x=>-x)}}
const AX={d:[1,0,0],a:[-1,0,0],w:[0,1,0],s:[0,-1,0],e:[0,0,1],q:[0,0,-1]}; // WASD/QE in fixed Sun-frame axes
function thrustAcc(){const D=DR[di];if(D.sail){const S=B[0],r=Math.hypot(s.x-S.x,s.y-S.y,s.z-S.z);return s.lit?2*S0*(AU/r)**2*s.sailA/C/mass():0}
 let a=D.k*PW/D.ve/mass();if(D.el&&s.en<PW*600){const inc=.7*S0*(AU*AU/((s.x-B[0].x)**2+(s.y-B[0].y)**2+(s.z-B[0].z)**2))*s.area*EFF;a*=Math.min(1,inc/PW)}return a}
function gravAt(x,y,z){let X=0,Y=0,Z=0;for(const o of B){const dx=o.x-x,dy=o.y-y,dz=o.z-z,r2=dx*dx+dy*dy+dz*dz,f=o.GM/(r2*Math.sqrt(r2));X+=dx*f;Y+=dy*f;Z+=dz*f}return[X,Y,Z]}
function sailF(dv){if(!s.sailA||!s.lit)return 0;const S=B[0],rx=s.x-S.x,ry=s.y-S.y,rz=s.z-S.z,r=Math.hypot(rx,ry,rz),c=(dv[0]*rx+dv[1]*ry+dv[2]*rz)/r;return c<=0?0:2*S0*(AU/r)**2*s.sailA/C*c*c}
// track a near-circular velocity around the Sun while drifting toward radius rT
function radCtl(rT,end){const S=B[0],g=gam(s),rx=s.x-S.x,ry=s.y-S.y,rz=s.z-S.z,r=Math.hypot(rx,ry,rz),vx=s.vx/g-S.vx,vy=s.vy/g-S.vy,vz=s.vz/g-S.vz,
  ux=rx/r,uy=ry/r,uz=rz/r,hx=ry*vz-rz*vy,hy=rz*vx-rx*vz,hz=rx*vy-ry*vx,h=Math.hypot(hx,hy,hz),nx=hx/h,ny=hy/h,nz=hz/h,
  tx=ny*uz-nz*uy,ty=nz*ux-nx*uz,tz=nx*uy-ny*ux,vc=Math.sqrt(S.GM/r),a=Math.max(1e-9,thrustAcc()),err=rT-r,
  rate=Math.min(2*a*Math.sqrt(r*r*r/S.GM),.05*vc)*Math.max(-1,Math.min(1,err/(.03*rT))),
  dx=tx*vc+ux*rate-vx,dy=ty*vc+uy*rate-vy,dz=tz*vc+uz*rate-vz,dl=Math.hypot(dx,dy,dz);
 if(end&&Math.abs(err)<.005*rT&&dl<.02*vc){apNote='✅ Autopilot arrived: circular orbit '+(r/AU).toFixed(3)+' AU from the Sun ('+AP.name+')';AP=null;return null}
 THR=Math.min(1,dl/(a*3000));AP.dtcap=600;if(end)AP.stage=err<0?'stage 3: braking so the orbit shrinks toward the Sun':'stage 3: speeding up so the orbit grows';
 return{dir:[dx/dl,dy/dl,dz/dl]}}
// rendezvous: steer the velocity relative to the asteroid, cancelling the difference in gravity between ship and asteroid
function apAst(){const S=B[0],g=gam(s),A=AP.pl?plState(T+TDT):astState(AP.ast,T+TDT),rx=s.x-A.x,ry=s.y-A.y,rz=s.z-A.z,d=Math.hypot(rx,ry,rz)||1,vx=s.vx/g-A.vx,vy=s.vy/g-A.vy,vz=s.vz/g-A.vz,vr=Math.hypot(vx,vy,vz),
  rs=Math.hypot(s.x-S.x,s.y-S.y,s.z-S.z),ra=Math.hypot(A.x-S.x,A.y-S.y,A.z-S.z);
 if(!AP.close&&d>.05*AU&&Math.abs(rs-ra)>.02*AU){AP.stage="stage 3: matching "+AP.ast.n+"'s distance from the Sun";return radCtl(ra,false)}
 AP.close=true;const amax=Math.max(1e-9,thrustAcc()),dock=1500,cl=Math.max(0,d-dock),vc=Math.min(Math.sqrt(.7*amax*cl),AP.vcap||3e4),
  gS=S.GM/ra**3,gSh=gravAt(s.x,s.y,s.z),gA=AP.pl?gravAt(A.x,A.y,A.z):[-(A.x-S.x)*gS,-(A.y-S.y)*gS,-(A.z-S.z)*gS],tau=Math.max(20,Math.min(4000,cl/(vc+1)*.3+20)),
  ax=(-rx/d*vc-vx)/tau+gA[0]-gSh[0],ay=(-ry/d*vc-vy)/tau+gA[1]-gSh[1],az=(-rz/d*vc-vz)/tau+gA[2]-gSh[2],al=Math.hypot(ax,ay,az)||1e-30;
 THR=Math.min(1,al/amax);AP.dtcap=Math.max(2,Math.min(600,tau/4,.05*d/(vr+.1)));
 if(d<2*dock&&vr<.5&&!AP.hold){AP.hold=true;apNote='✅ Arrived at '+AP.ast.n+': holding position '+(d/1e3).toFixed(1)+' km away, in mining range'}
 AP.stage=AP.hold?'holding position near '+AP.ast.n+' (mining range)':'stage 4: closing in on '+AP.ast.n+' · '+(d>1e9?(d/AU).toFixed(3)+' AU':Math.round(d/1e3).toLocaleString()+' km')+' · closing at '+(vr<1e3?vr.toFixed(0)+' m/s':(vr/1e3).toFixed(1)+' km/s');
 return{dir:[ax/al,ay/al,az/al]}}
function apKeys(){THR=1;if(!AP)return null;const S=B[0];
 if(AP.wait){if(s.jobs.includes(AP.wait)){AP.stage='waiting for fuel production: '+Math.round(100*(AP.wait.fr||0))+'% (ETA '+dur(jobETA(AP.wait,s.jobs.indexOf(AP.wait)))+')';THR=0;AP.dtcap=600;return{}}AP.wait=null;PRED=null}
 if(s.dom!==S){const oo=elements();if(oo.eps<1.25e5){AP.stage='stage 1: spiraling out to escape '+s.dom.n;AP.dtcap=600;return{w:1}}
  AP.stage='stage 2: coasting out of '+s.dom.n+"'s gravity (engine off, saving fuel)";THR=0;AP.dtcap=600;return{}}
 return AP.ast?apAst():radCtl(AP.r,true)}
const apDt=()=>AP&&AP.dtcap||600;
acc(); // initialise accelerations before the first leapfrog step
