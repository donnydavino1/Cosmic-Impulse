// ===== SHIP LAYOUT (RULES): your modules in order along the ship's spine, and what that order does =====
// Every installed part except the frame is a module; the propellant and water tanks are one module; trusses are
// 5 m, 100 kg iron spacers you can add. The order (nose → tail; the engine is always at the tail) decides:
//  • centre of mass and moment of inertia → how long a 180° turn takes (two 220 N RCS thrusters at the ends)
//    → how often a spinal railgun can re-aim                                         (Law 2, momentum)
//  • length → bending load on the frame: frames are rated for ships up to 25 m; longer ships get a lower g limit
//  • reactor dose to the crew: falls with distance² and with the mass between them (shadow shielding) (Law 6)
//  • storm shelter: only tanks right next to the crew cabin surround it                (Laws 3 and 8)
// State: s.lay = {order:[keys], tid}. Keys: 'p<uid>' part, 'tanks', 't<n>' truss. Metrics: SH.lay (recalc).
// Refits are manufacturing jobs (type 'refit'): moving modules costs 20 kJ per kg moved, a new truss 100 kg iron.
const LAYC={life:{rho:120,r:2.1,min:4,ic:'👩‍🚀',col:'#d8dce4'},lab:{rho:180,r:1.9,min:1.5,ic:'🔬',col:'#c9d2de'},fab:{rho:450,r:2,min:2,ic:'🏭',col:'#b8bec8'},
 store:{rho:700,r:1.6,ic:'🔋',col:'#8d95a3'},gen:{rho:900,r:1.3,min:1.5,ic:'⚛',col:'#7d8590'},therm:{len:2,r:.8,ic:'♨',col:'#9aa3ad'},
 shield:{rho:1800,r:2.25,ic:'🛡',col:'#a7a093'},tanks:{r:2.2,ic:'⛽',col:'#c8a24a'},truss:{len:5,r:1,m:100,ic:'⌗',col:'#6f7782'}};
const RHO_F={chem:360,xe:1600,h2:71,fus:169,am:86},LAY={rcs:220,gLen:25,dRef:4,trussM:100,trussMat:{iron:100},moveJ:2e4,trussJ:5e8};
if(!s.lay)s.lay={order:[],tid:0};
const isTruss=k=>/^t(new)?\d+$/.test(k);
function laySync(L){L=L||s.lay;for(const p of s.parts)if(!p.uid)p.uid=++UID;
 const want=new Set(s.parts.filter(p=>PARTS[p.id].cat!=='frame').map(p=>'p'+p.uid));
 L.order=L.order.filter(k=>k==='tanks'||isTruss(k)||want.has(k));if(!L.order.includes('tanks'))L.order.splice(1,0,'tanks');
 // new parts go on the tail end (just ahead of the engine)
 for(const k of want)if(!L.order.includes(k))L.order.push(k);
 // a new layout starts with the crew at the nose and the tanks right behind them (a working storm shelter)
 if(!L.init){L.init=1;const c=L.order.find(k=>k[0]==='p'&&PARTS[(layPart(k)||{}).id]?.cat==='life');if(c){L.order.splice(L.order.indexOf(c),1);L.order.splice(L.order.indexOf('tanks'),1);L.order.unshift(c,'tanks')}}
 return L}
const layPart=k=>s.parts.find(p=>'p'+p.uid===k);
function layMod(k){if(k==='tanks'){const V=Object.entries(s.fuel).reduce((a,[f,m])=>a+m/(RHO_F[f]||1000),0)+s.res.water/1000,c=LAYC.tanks,m=fuelMass()+s.res.water;
  return{k,cat:'tanks',n:'Propellant and water tanks',m,r:c.r,len:Math.max(1,Math.min(60,V/(Math.PI*c.r*c.r))),ic:c.ic}}
 if(isTruss(k)){const c=LAYC.truss;return{k,cat:'truss',n:'Truss segment (5 m)',m:c.m,r:c.r,len:c.len,ic:c.ic}}
 const p=layPart(k);if(!p)return null;const d=PARTS[p.id],c=LAYC[d.cat]||LAYC.fab;
 return{k,cat:d.cat,id:p.id,n:d.n,m:d.m,r:c.r,len:c.len||Math.max(c.min||.8,Math.min(40,d.m/(c.rho*Math.PI*c.r*c.r))),ic:c.ic,rad:d.eta&&d.rad?d.rad:0,fail:p.fail}}
// all the numbers for one order of modules (the current one, or a draft in the builder)
function layMetrics(order){const M=order.map(layMod).filter(Boolean);let x=0;for(const q of M){q.x=x+q.len/2;x+=q.len}const L=x;
 const D=DR[di],mEng=isU(D.id)?engMass(D,PW):0,xEng=L+1.5;
 let other=.2*s.area+s.sailA*.02+s.ammo.missile*50+(typeof opsMass==='function'?opsMass():0)+resMass()-s.res.water;
 for(const p of s.parts)if(PARTS[p.id].cat==='frame')other+=PARTS[p.id].m;
 DR.forEach((E,i)=>{if(i!==di&&isU(E.id))other+=engMass(E,E.pw)});WEP.forEach(w=>{if(isU(w.id))other+=wepMass(w)});
 const mMod=M.reduce((a,q)=>a+q.m,0),mt=mMod+mEng+other,xc=(M.reduce((a,q)=>a+q.m*q.x,0)+mEng*xEng+other*L/2)/Math.max(1,mt);
 const I=M.reduce((a,q)=>a+q.m*((q.x-xc)**2+q.len*q.len/12),0)+mEng*(xEng-xc)**2+other*((L/2-xc)**2+L*L/12);
 const arm=Math.max(1,xc,L+2-xc),flip=2*Math.sqrt(Math.PI*I/(2*LAY.rcs*arm));
 const gF=L<=LAY.gLen?1:Math.sqrt(LAY.gLen/L);
 const crew=M.findIndex(q=>q.cat==='life'),tk=M.findIndex(q=>q.cat==='tanks'),R=M.filter(q=>q.rad>0);let reacF=1,reacD=0;
 if(crew>=0&&R.length){let a=0,b=0;for(const q of R){const i=M.indexOf(q),lo=Math.min(i,crew),hi=Math.max(i,crew);let ad=0;for(let j=lo+1;j<hi;j++)ad+=M[j].m/(Math.PI*M[j].r*M[j].r)/10;
   const d=Math.max(2,Math.abs(q.x-M[crew].x));reacD=Math.max(reacD,d);a+=q.rad*(LAY.dRef/d)**2*Math.exp(-ad/25);b+=q.rad}reacF=Math.min(3,a/b)}
 const gap=crew>=0&&tk>=0?Math.abs(crew-tk):9,shelF=gap<=1?1:gap===2?.4:.15;
 return{mods:M,L,mass:mt,xc,I,flip,gF,reacF,reacD,shelF,crew,tk}}
function layoutApply(S){try{laySync();S.mass+=s.lay.order.filter(isTruss).length*LAY.trussM;const m=layMetrics(s.lay.order);S.lay=m;S.gmax*=m.gF}catch(e){console.warn('layout',e)}}
// a refit: the builder queues it; materials for new trusses are taken when it is queued
function layRefit(order){laySync();const cur=s.lay.order,newT=order.filter(k=>k.startsWith('tnew')).length,gone=cur.filter(k=>isTruss(k)&&!order.includes(k)).length;
 let moved=0;order.forEach((k,i)=>{if(k.startsWith('tnew'))return;if(cur.indexOf(k)!==i){const q=layMod(k);if(q)moved+=q.m}});
 const j={type:'refit',order:order.slice(),gone,name:'Refit ship layout'+(newT?' (+'+newT+' truss'+(newT>1?'es':'')+')':''),J:Math.max(1e7,moved*LAY.moveJ+newT*LAY.trussJ),minT:3600};if(newT)j.mat={iron:LAY.trussM*newT};return queueJob(j)}
ORB.on('job:done',j=>{if(j.type!=='refit')return;const L=s.lay;L.order=j.order.map(k=>k.startsWith('tnew')?'t'+(++L.tid):k);if(j.gone)s.res.iron+=j.gone*LAY.trussM*.5;laySync()});
