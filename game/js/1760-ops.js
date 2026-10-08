// ===== OPERATIONS: mining drones and science probes (RULES) =====
// What your ship can send out and get back. Laws used:
//  2 momentum   drones have little Δv, so they can only work an asteroid you stay near; a probe's Δv comes from the
//               xenon you load from your own tank (rocket equation), and its trip is a Hohmann transfer (Law 1)
//  3 matter     drones and probes are built from materials; ore comes out of the asteroid by its composition
//  4 energy     building costs joules; drones recharge from your battery (1.5 MJ per kg dug)
//  7+10 light   probe data reaches you at the speed of light: far worlds report late
// State: s.ops = {drones (docked), fleet (out working), probes (stored), flights, sci (data received per world),
// haul (kg brought back by drones), lt (last tick time)}. Jobs 'drone'/'probe' finish through ORB 'job:done'.
// UI: 2590-ops-ui.js (key 8). Contracts 'probe' and 'haul' read s.ops.sci and s.ops.haul.
const OPS={droneM:40,droneCargo:50,droneRate:.005,droneV:20,droneRange:5e4,droneWarn:3e4,droneLost:1e5,droneJkg:1.5e6,
 droneMat:{iron:25,nickel:5,silicates:8,carbon:2},droneJ:4e9,
 probeDry:90,probeXeMax:40,probeVe:3e4,probeMat:{iron:40,silicates:30,carbon:12,nickel:7.7,platinum:.3},probeJ:2e10,
 SCI:{Earth:20,Moon:40,Venus:80,Mars:90,Mercury:120,Jupiter:250,Saturn:350,Sun:300,Europa:320,Titan:380,Uranus:420,Neptune:480,Pluto:600},
 TGT:['Moon','Mercury','Venus','Earth','Mars','Jupiter','Europa','Saturn','Titan','Uranus','Neptune','Pluto','Sun']};
const OPS_FACT={Earth:'Seen from orbit, Earth’s blue atmosphere is a layer only about 100 km thick.',
 Moon:'The Moon’s far side is almost all craters; water ice hides in its permanently shadowed polar craters.',
 Mercury:'Mercury’s days reach 430 °C and its nights fall to −180 °C, yet ice survives in craters at its poles.',
 Venus:'Under clouds of sulphuric acid, the surface of Venus is 465 °C at 92 times Earth’s air pressure.',
 Mars:'Olympus Mons on Mars is the tallest volcano in the Solar System, about 22 km high.',
 Jupiter:'Jupiter’s Great Red Spot is a storm wider than Earth that has raged for at least 190 years.',
 Saturn:'Saturn’s rings are mostly water ice: hundreds of thousands of km wide, often only about 10 m thick.',
 Sun:'Near the Sun the solar wind streams out at 400–800 km/s and the corona is over a million degrees.',
 Europa:'Under Europa’s ice shell lies a salty ocean with about twice as much water as all of Earth’s oceans.',
 Titan:'Titan has a thick nitrogen atmosphere and rains liquid methane into lakes and seas near its poles.',
 Uranus:'Uranus rolls around the Sun on its side: its axis is tilted 98°, so each pole gets 42 years of daylight.',
 Neptune:'Neptune has the fastest winds in the Solar System, over 2,000 km/h, and its moon Triton orbits backwards.',
 Pluto:'Pluto’s bright “heart”, Sputnik Planitia, is a basin of frozen nitrogen that slowly churns like a lava lamp.'};
const opsNew=()=>({drones:0,fleet:null,probes:0,flights:[],sci:{},haul:0,lt:null,rep:0});
if(!s.ops)s.ops=opsNew();
const opsMul=(m,n)=>Object.fromEntries(Object.entries(m).map(([k,v])=>[k,v*n]));
function opsMass(){const o=s.ops;return o?o.drones*OPS.droneM+o.probes*OPS.probeDry+(o.rep||0)*REP.m:0}
ORB.on('job:done',j=>{if(j.type==='drone')s.ops.drones+=j.n;if(j.type==='probe')s.ops.probes+=j.n;if(j.type==='rdrone')s.ops.rep=(s.ops.rep||0)+j.n});
// ---------- repair drones: crawl over the hull and fix the most damaged part, 10 % of its condition per hour each,
// using spare-parts kits (one kit restores a whole part); a part above 60 % works again
const REP={m:30,mat:{iron:20,nickel:5,silicates:5},J:3e9,rate:.1/3600};
function rdroneBuild(n){if(!s.tech.t_robo)return null;return queueJob({type:'rdrone',n,mat:opsMul(REP.mat,n),name:'Build '+n+' repair drone'+(n>1?'s':''),J:REP.J*n})}
function repTick(dt){const o=s.ops,n=o.rep||0;if(!n||dt<=0)return;let work=n*REP.rate*dt;
 for(let guard=0;guard<20&&work>1e-6&&s.res.spares>1e-6;guard++){const p=s.parts.filter(q=>q.cond<1||q.fail).sort((a,b)=>a.cond-b.cond)[0];if(!p)return;
  const fix=Math.min(work,1-p.cond,s.res.spares);p.cond+=fix;s.res.spares-=fix;work-=fix;if(p.fail&&p.cond>=.6){p.fail=false;notify('🔧 Repair drones fixed the '+PARTS[p.id].n+'.');recalc()}}}
// ---------- drones
function droneBuild(n){if(!s.tech.t_robo)return null;return queueJob({type:'drone',n,mat:opsMul(OPS.droneMat,n),name:'Build '+n+' mining drone'+(n>1?'s':''),J:OPS.droneJ*n})}
function droneTarget(){if(WT&&WT.kind==='ast')return WT.a;let b=null,bd=Infinity;for(const a of AST){const d=astDist(a);if(d<bd){bd=d;b=a}}return b}
const droneTrip=a=>Math.max(30,astDist(a)/OPS.droneV);
function droneDeploy(){const o=s.ops,a=droneTarget();if(o.fleet)return'busy';if(!o.drones)return'none';if(!a||astDist(a)>OPS.droneRange)return'far';
 o.fleet={n:o.drones,ast:a.id,ph:'out',t:T+droneTrip(a),cargo:0,recall:false,warn:false};o.drones=0;recalc();return'ok'}
function droneRecall(){const f=s.ops.fleet;if(!f)return;f.recall=true;if(f.ph==='mine')f.cargo=Math.max(0,f.n*OPS.droneCargo-(f.t-T)*f.n*OPS.droneRate);if(f.ph==='mine'||f.ph==='out'){f.ph='back';f.t=T+droneTrip(AST[f.ast])}}
function droneDock(f){s.ops.drones+=f.n;s.ops.fleet=null;recalc()}
function droneUnload(f){const a=AST[f.ast],c=COMP[a.t],kg=f.cargo;for(const k of RES)s.res[k]+=kg*c[k];a.mined+=kg;s.mined+=kg;s.ops.haul+=kg;f.cargo=0;
 disc('dr_haul','First ore brought back by mining drones',15,'Drones dig while you do something else: but they need you nearby, and they recharge from your battery.')}
function droneTick(){const o=s.ops,f=o.fleet;if(!f)return;const a=AST[f.ast],d=astDist(a);
 if(f.ph!=='charge'&&d>OPS.droneLost){o.fleet=null;recalc();notify(`📡 Lost contact with ${f.n} mining drones: the ship went too far for them to catch up.`);return}
 if(f.ph!=='charge'&&d>OPS.droneWarn&&!f.warn){f.warn=true;notify(`⚠ Your mining drones are ${fmtD(d)} behind and can’t catch up beyond 100 km. Stay near ${a.n} or recall them.`)}
 if(d<OPS.droneWarn)f.warn=false;
 for(let guard=0;guard<500&&o.fleet;guard++){
  if(f.ph==='charge'){const need=f.n*OPS.droneCargo*OPS.droneJkg;if(f.recall){droneDock(f);return}if(s.en<need)return;s.en-=need;f.ph='out';f.t=T+droneTrip(a);continue}
  if(T<f.t)return;
  if(f.ph==='out'){f.ph='mine';f.t+=(f.n*OPS.droneCargo-f.cargo)/(f.n*OPS.droneRate);continue}
  if(f.ph==='mine'){f.cargo=f.n*OPS.droneCargo;f.ph='back';f.t+=droneTrip(a);continue}
  if(f.ph==='back'){if(f.cargo>0)droneUnload(f);if(f.recall){droneDock(f);return}f.ph='charge';continue}}}
// status for panels: phase name, seconds left, cargo
function droneStatus(){const f=s.ops.fleet;if(!f)return null;const a=AST[f.ast];let cargo=f.cargo;
 if(f.ph==='mine'){const left=Math.max(0,f.t-T);cargo=f.n*OPS.droneCargo-left*f.n*OPS.droneRate}
 return{n:f.n,ast:a.n,ph:f.ph,left:Math.max(0,f.t-T),cargo,d:astDist(a),recall:f.recall}}
// ---------- probes
function probeBuild(n){if(!s.tech.t_probe)return null;return queueJob({type:'probe',n,mat:opsMul(OPS.probeMat,n),name:'Build '+n+' science probe'+(n>1?'s':''),J:OPS.probeJ*n})}
const hohDv=(mu,r1,r2)=>Math.abs(Math.sqrt(mu/r1)*(Math.sqrt(2*r2/(r1+r2))-1)),hohT=(mu,r1,r2)=>Math.PI*Math.sqrt(((r1+r2)/2)**3/mu);
const opsDist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);
// the trip to a world: Δv the probe must supply, travel time, xenon to load (10 % margin), science value
function probePlan(name){const b=B.find(x=>x.n===name),D=s.dom,sun=B[0],par=x=>x.p>0?B[x.p]:x;let dv,t,how;
 if(b===D&&name!=='Sun'){dv=150;t=3*3600;how='local'}
 else if(b.p>0&&B[b.p]===D){const r1=opsDist(s,D);dv=hohDv(D.GM,r1,b.a);t=hohT(D.GM,r1,b.a);how='moon'}
 else if(D.p>0&&B[D.p]===b){const r1=D.a,r2=b.R*1.3;dv=hohDv(b.GM,r1,r2);t=hohT(b.GM,r1,r2);how='parent'}
 else{const r1=opsDist(s,sun),r2=name==='Sun'?.1*AU:opsDist(par(b),sun),vinf=hohDv(sun.GM,r1,r2);t=hohT(sun.GM,r1,r2);how=name==='Sun'?'sun':'helio';
  if(D!==sun){const r=opsDist(s,D);dv=Math.sqrt(vinf*vinf+2*D.GM/r)-Math.sqrt(D.GM/r)}else dv=vinf;
  const dn=opsDist(s,par(b));if(name!=='Sun'&&dn<5e9){const g=gam(s),P=par(b),vr=Math.hypot(s.vx/g-P.vx,s.vy/g-P.vy,s.vz/g-P.vz);dv=Math.min(dv,3000)+Math.min(vr,3000)*.5;t=dn/3000;how='near'}}
 const xe=OPS.probeDry*(Math.exp(1.1*dv/OPS.probeVe)-1),first=!s.ops.sci[name],rp=OPS.SCI[name]*(first?1:.3);
 return{name,dv,t,xe,how,rp,first,reach:xe<=OPS.probeXeMax,ok:xe<=OPS.probeXeMax&&s.fuel.xe>=xe&&s.ops.probes>0}}
function probeLaunch(name){const o=s.ops,p=probePlan(name);if(!o.probes)return'none';if(!p.reach)return'dv';if(s.fuel.xe<p.xe)return'xe';
 if(o.flights.some(f=>f.to===name&&!f.rx))return'busy';
 o.probes--;s.fuel.xe-=p.xe;o.flights.push({to:name,t0:T,arr:T+p.t,rx:null});
 // the launch spring pushes the ship back a little (Law 2): 120 kg at 1 m/s
 const g=gam(s),M=mass(),dv=(OPS.probeDry+p.xe)*1/M,D=s.dom,v=[s.vx/g-D.vx,s.vy/g-D.vy,s.vz/g-D.vz],vl=Math.hypot(...v)||1;s.vx-=v[0]/vl*dv*g;s.vy-=v[1]/vl*dv*g;s.vz-=v[2]/vl*dv*g;
 recalc();return'ok'}
function probeTick(){const o=s.ops;for(const f of o.flights.slice()){
  if(f.rx==null&&T>=f.arr){const b=B.find(x=>x.n===f.to),d=f.to==='Sun'?Math.max(1,opsDist(s,B[0])-.1*AU):opsDist(s,b);f.rx=f.arr+Math.abs(d)/C;f.dl=Math.abs(d)/C;
   notify(`🛰 Probe reached ${f.to}. Its data is coming back at the speed of light: ${dur(f.dl)}.`)}
  if(f.rx!=null&&T>=f.rx){o.flights.splice(o.flights.indexOf(f),1);const first=!o.sci[f.to],rp=OPS.SCI[f.to]*(first?1:.3);s.rp+=rp;o.sci[f.to]=(o.sci[f.to]||0)+1;
   notify(`📡 Data from the ${f.to} probe received: +${Math.round(rp)} research points.`);disc('pr_'+f.to,'Probe data from '+f.to,0,OPS_FACT[f.to]||'')}}}
function opsTick(){const o=s.ops;if(!o||!s.crew.alive)return;if(o.lt==null||T<o.lt){o.lt=T;return}const dt=T-o.lt;o.lt=T;droneTick();probeTick();repTick(dt)}
ORB.on('ui',()=>{try{opsTick()}catch(e){console.warn('ops',e)}});
