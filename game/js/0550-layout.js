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
 shield:{rho:1800,r:2.25,ic:'🛡',col:'#a7a093'},sensor:{rho:300,r:1.2,min:1,ic:'📡',col:'#c9ccd2'},weapon:{r:.6,ic:'🔫',col:'#6b7280'},tanks:{r:2.2,ic:'⛽',col:'#c8a24a'},truss:{len:5,r:1,m:100,ic:'⌗',col:'#6f7782'}};
const RHO_F={chem:360,xe:1600,h2:71,fus:169,am:86},LAY={rcs:220,gLen:25,dRef:4,trussM:100,trussMat:{iron:100},moveJ:2e4,trussJ:5e8};
if(!s.lay)s.lay={order:[],tid:0};
const isTruss=k=>/^t(new)?\d+$/.test(k),isW=k=>k.startsWith('w:'),WIC={mlaser:'⛏',plaser:'✦',pbeam:'☄',rail:'⇶',missile:'🚀'};
function laySync(L){L=L||s.lay;for(const p of s.parts)if(!p.uid)p.uid=++UID;if(!L.rad)L.rad={};
 const want=new Set(s.parts.filter(p=>PARTS[p.id].cat!=='frame').map(p=>'p'+p.uid).concat(WEP.filter(w=>isU(w.id)).map(w=>'w:'+w.id)));
 delete L.rad['w:rail'];
 // radial mounts: a module beside a spine module (its host). Drop mounts whose part or host is gone.
 for(const k in L.rad)if(!(k==='tanks'||want.has(k))||!L.order.includes(L.rad[k])||L.rad[k]===k)delete L.rad[k];
 L.order=L.order.filter(k=>(k==='tanks'||isTruss(k)||want.has(k))&&!L.rad[k]);if(!L.order.includes('tanks')&&!L.rad.tanks)L.order.splice(1,0,'tanks');
 // new parts go on the tail end (just ahead of the engine)
 for(const k of want)if(!L.order.includes(k)&&!L.rad[k]){if(isW(k)&&k!=='w:rail'){const h=L.order.find(o=>o[0]==='p'&&PARTS[(layPart(o)||{}).id]?.cat!=='life')||L.order[0];if(h){L.rad[k]=h;continue}}L.order.push(k)}
 // a new layout starts with the crew at the nose and the tanks right behind them (a working storm shelter)
 if(!L.init){L.init=1;const c=L.order.find(k=>k[0]==='p'&&PARTS[(layPart(k)||{}).id]?.cat==='life');if(c){L.order.splice(L.order.indexOf(c),1);L.order.splice(L.order.indexOf('tanks'),1);L.order.unshift(c,'tanks')}}
 return L}
const layPart=k=>s.parts.find(p=>'p'+p.uid===k);
function layMod(k){if(k==='tanks'){const V=Object.entries(s.fuel).reduce((a,[f,m])=>a+m/(RHO_F[f]||1000),0)+s.res.water/1000,c=LAYC.tanks,m=fuelMass()+s.res.water;
  return{k,cat:'tanks',n:'Propellant and water tanks',m,r:c.r,len:Math.max(1,Math.min(60,V/(Math.PI*c.r*c.r))),ic:c.ic}}
 if(isW(k)){const id=k.slice(2),w=WEP.find(x=>x.id===id);if(!w||!isU(id))return null;return{k,cat:'weapon',id,n:w.n,m:wepMass(w),r:id==='rail'?.5:.6,len:id==='rail'?6:1.2,ic:WIC[id]||'🔫'}}
 if(isTruss(k)){const c=LAYC.truss;return{k,cat:'truss',n:'Truss segment (5 m)',m:c.m,r:c.r,len:c.len,ic:c.ic}}
 const p=layPart(k);if(!p)return null;const d=PARTS[p.id],c=LAYC[d.cat]||LAYC.fab;
 return{k,cat:d.cat,id:p.id,n:d.n,m:d.m+(p.add||0),r:c.r,len:c.len||Math.max(c.min||.8,Math.min(40,d.m/(c.rho*Math.PI*c.r*c.r))),ic:c.ic,rad:d.eta&&d.rad?d.rad:0,fail:p.fail}}
// all the numbers for one layout (the current one, or a draft in the builder): spine order plus radial mounts.
// A radial module sits beside its host at the host's position along the spine, a little out from the axis; several
// on one host are spread evenly around it (2 = a mirrored pair, 3 = a triangle, 4 = a cross: symmetry).
function layMetrics(order,rad){rad=rad||s.lay.rad||{};const M=order.map(layMod).filter(Boolean);let x=0;for(const q of M){q.x=x+q.len/2;x+=q.len}const L=x;
 const RM=[],byHost={};for(const k in rad){const h=M.find(q=>q.k===rad[k]),q=h&&layMod(k);if(!q)continue;(byHost[h.k]=byHost[h.k]||[]).push(q);q.host=h.k;q.radial=true;q.x=h.x;q.off=h.r+q.r+.3;RM.push(q)}
 for(const h in byHost)byHost[h].forEach((q,i,A)=>{q.ang=Math.PI/2+2*Math.PI*i/A.length});
 const D=DR[di],mEng=isU(D.id)?engMass(D,PW):0,xEng=L+1.5;
 let other=.2*s.area+s.sailA*.02+s.ammo.missile*50+(typeof opsMass==='function'?opsMass():0)+resMass()-s.res.water;
 for(const p of s.parts)if(PARTS[p.id].cat==='frame')other+=PARTS[p.id].m;
 let mTail=0;DR.forEach((E,i)=>{if(i!==di&&isU(E.id))mTail+=engMass(E,E.pw)});
 const ALL=M.concat(RM),mMod=ALL.reduce((a,q)=>a+q.m,0),mt=mMod+mEng+mTail+other,xc=(ALL.reduce((a,q)=>a+q.m*q.x,0)+(mEng+mTail)*xEng+other*L/2)/Math.max(1,mt);
 // moment of inertia about a sideways axis through the centre of mass (radial modules also add their offset)
 const I=ALL.reduce((a,q)=>a+q.m*((q.x-xc)**2+q.len*q.len/12+(q.off?q.off*q.off/2:0)),0)+(mEng+mTail)*(xEng-xc)**2+other*((L/2-xc)**2+L*L/12);
 const arm=Math.max(1,xc,L+2-xc),flip=2*Math.sqrt(Math.PI*I/(2*LAY.rcs*arm));
 const gF=L<=LAY.gLen?1:Math.sqrt(LAY.gLen/L);
 // where a module is: its spine index (radial ones use their host's) and its distance from the axis
 const idx=q=>q.radial?M.findIndex(h=>h.k===q.host):M.indexOf(q),cq=ALL.find(q=>q.cat==='life'),crew=cq?idx(cq):-1,R=ALL.filter(q=>q.rad>0);let reacF=1,reacD=0;
 if(cq&&R.length){let a=0,b=0;for(const q of R){const i=idx(q),lo=Math.min(i,crew),hi=Math.max(i,crew);let ad=0;for(let j=lo+1;j<hi;j++)ad+=M[j].m/(Math.PI*M[j].r*M[j].r)/10;
   const d=Math.max(2,Math.hypot(q.x-cq.x,(q.off||0)-(cq.off||0)));reacD=Math.max(reacD,d);a+=q.rad*(LAY.dRef/d)**2*Math.exp(-ad/25);b+=q.rad}reacF=Math.min(3,a/b)}
 // storm shelter: tanks mounted around the crew cabin surround it best; next to it on the spine also works
 const tq=ALL.find(q=>q.cat==='tanks'),tk=tq?idx(tq):-1,wrap=tq&&cq&&(tq.radial&&tq.host===cq.k||cq.radial&&cq.host===tq.k),gap=crew>=0&&tk>=0?Math.abs(crew-tk):9,
  shelF=wrap?1.15:gap<=1?1:gap===2?.4:.15;
 return{mods:ALL,spine:M,radial:RM,L,mass:mt,xc,I,flip,gF,reacF,reacD,shelF,crew,tk}}
function layoutApply(S){try{laySync();S.mass+=s.lay.order.filter(isTruss).length*LAY.trussM;const m=layMetrics(s.lay.order,s.lay.rad);S.lay=m;S.gmax*=m.gF}catch(e){console.warn('layout',e)}}
// a refit: the builder queues it; materials for new trusses are taken when it is queued
function layRefit(order,rad){laySync();rad=rad||{};const cur=s.lay.order,newT=order.filter(k=>k.startsWith('tnew')).length,gone=cur.filter(k=>isTruss(k)&&!order.includes(k)).length;
 let moved=0;order.forEach((k,i)=>{if(k.startsWith('tnew'))return;if(cur.indexOf(k)!==i){const q=layMod(k);if(q)moved+=q.m}});for(const k in rad)if((s.lay.rad||{})[k]!==rad[k]){const q=layMod(k);if(q)moved+=q.m}for(const k in s.lay.rad||{})if(!rad[k]){const q=layMod(k);if(q)moved+=q.m}
 const j={type:'refit',order:order.slice(),rad:Object.assign({},rad),gone,name:'Refit ship layout'+(newT?' (+'+newT+' truss'+(newT>1?'es':'')+')':''),J:Math.max(1e7,moved*LAY.moveJ+newT*LAY.trussJ),minT:3600};if(newT)j.mat={iron:LAY.trussM*newT};return queueJob(j)}
ORB.on('job:done',j=>{if(j.type!=='part'||!j.place)return;const p=s.parts.slice().reverse().find(q=>q.id===j.id);if(!p)return;if(!p.uid)p.uid=++UID;
 const L=s.lay;if(L.order.includes(j.place)){L.order=L.order.filter(k=>k!=='p'+p.uid);L.rad=L.rad||{};L.rad['p'+p.uid]=j.place}});
ORB.on('job:done',j=>{if(j.type!=='refit')return;const L=s.lay;L.order=j.order.map(k=>k.startsWith('tnew')?'t'+(++L.tid):k);L.rad=Object.assign({},j.rad||{});if(j.gone)s.res.iron+=j.gone*LAY.trussM*.5;laySync()});

// ===== WHERE HITS LAND (RULES): weapon hits strike the outside of the ship, so layout and armour placement matter ====
// Every module is a target in proportion to its outer area (radiators count their panels). Modules mounted beside a
// host shield it: each covers 20 % of the host (down to 35 % exposed). A hit that strikes armour loses 60 % of its
// energy (shielding parts 30 %); a hit on anything else damages that module (condition, then failure), punctures
// tanks (kinetic hits lose propellant) or hurts the crew (cabin).
const ARM={cover:.2,minExp:.35,shield:.3};
function layExposure(m){m=m||SH.lay;if(!m)return[];const cnt={};for(const q of m.radial)cnt[q.host]=(cnt[q.host]||0)+1;
 return m.mods.map(q=>{let w=2*Math.PI*q.r*q.len*(q.cat==='truss'?.25:1)+(q.cat==='therm'?((PARTS[q.id]||{}).A||60):0);if(!q.radial)w*=Math.max(ARM.minExp,1-ARM.cover*(cnt[q.k]||0));return{q,w}})}
function hitModule(E,kind){const m=SH&&SH.lay;if(!m||!m.mods.length)return null;const ex=layExposure(m),tot=ex.reduce((a,e)=>a+e.w,0);let r=Math.random()*tot,e=ex[ex.length-1];
 for(const x of ex){r-=x.w;if(r<=0){e=x;break}}
 const q=e.q,p=q.k&&q.k[0]==='p'?layPart(q.k):null,d=p?PARTS[p.id]:null,ab=d&&d.armor?d.armor:d&&d.cat==='shield'&&d.ad?ARM.shield:0,out={q,ab,cond:null,leak:0,crew:0};
 if(p&&!ab){p.cond=Math.max(0,p.cond-Math.min(.5,E/2e8));out.cond=p.cond;if(p.cond<.25)p.fail=true}
 if(q.cat==='tanks'&&kind==='kinetic'){for(const f in s.fuel){const l=s.fuel[f]*.03;s.fuel[f]-=l;out.leak+=l}}
 if(q.cat==='life'){const dmg=Math.min(8,E/2.5e7);s.crew.hp=Math.max(0,s.crew.hp-dmg);out.crew=dmg}
 return out}
