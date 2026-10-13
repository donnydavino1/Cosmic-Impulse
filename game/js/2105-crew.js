// ===== CREW (RULES): the people aboard, their duties and their skills =====
// Two astronauts to start. Each has one duty at a time; duties do real work automatically, and skill (Level 1–5) grows
// with hours on that duty, or faster by training with research points. Everyone eats, drinks and breathes:
// per person per day 0.84 kg oxygen, 2.5 kg water and 1.6 kg food (less with regenerative life support).
//   🧭 pilot    no automatic work; a pilot on watch makes the crew recover health a little faster
//   🔧 repair   repairs failed and worn parts and engines with spare-parts kits (1 kit per 100 % of condition)
//   🩹 patch    seals micrometeoroid breaches with hull patch kits (3 h at Level 1, 36 min at Level 5)
//   🔬 science  adds research points (0.5 per hour per Level, needs power)
//   🏭 fab      +15 % manufacturing power per Level
//   ⛏ miner    +15 % of the rock you break off is collected, per Level (never more than all of it)
//   🎯 gunner   +10 % weapon damage per Level (better aim at weak spots)
//   ⛑ medic    heals 1 % per hour per Level and clears radiation sickness faster
//   🛏 rest     the crew recovers health twice as fast
// More crew: recruit at Earth (launched up from the ground: 2×10⁹ J), up to what your life support can hold.
const CREW={roles:{pilot:{ic:'🧭',n:'Pilot'},repair:{ic:'🔧',n:'Repairs'},patch:{ic:'🩹',n:'Hull patching'},science:{ic:'🔬',n:'Science'},fab:{ic:'🏭',n:'Fabrication'},miner:{ic:'⛏',n:'Mining'},gunner:{ic:'🎯',n:'Gunnery'},medic:{ic:'⛑',n:'Medicine'},rest:{ic:'🛏',n:'Rest'}},
 names:['Amara Okafor','Lucas Moreau','Mei Lin','Sofia Alvarez','Ravi Patel','Yuki Tanaka','Omar Haddad','Ingrid Larsen','Diego Santos','Aisha Khan','Tomás Novak','Leila Farahani','Kwame Mensah','Hannah Weber','Arjun Rao','Elena Petrova','Noah Kim','Zara Ahmed','Mateo Rossi','Freya Nilsen'],
 recruitJ:2e9,kg:80,fab:.15,mine:.15,gun:.1,heal:1,
 xpLv:[0,120,360,840,1800],trainRP:[0,30,60,120,240],patchH:3,repRate:.06,sciRP:.5,
 // every astronaut has one trait: +1 Level at some duties, faster learning, eating less, or keeping everyone's spirits up
 traits:{hands:{n:'Steady hands',d:'+1 Level at repairs and hull patching',lv:{repair:1,patch:1}},quick:{n:'Quick learner',d:'Skills grow 50 % faster',xp:1.5},
  frugal:{n:'Light eater',d:'Eats, drinks and breathes 20 % less',eat:.8},sharp:{n:'Sharp eye',d:'+1 Level at gunnery and mining',lv:{gunner:1,miner:1}},
  tinker:{n:'Tinkerer',d:'+1 Level at fabrication and science',lv:{fab:1,science:1}},calm:{n:'Calm under pressure',d:'Raises the whole crew’s morale',mor:12},
  medic:{n:'Field medic',d:'+1 Level at medicine and rest',lv:{medic:1,rest:1}},ace:{n:'Ace pilot',d:'+1 Level as pilot; the crew trusts the flying',lv:{pilot:1},mor:4}}};
const crewTr=m=>CREW.traits[m.trait]||null;
// morale (0–100) sets how well everyone works: 50 % output at 0, full output at 100
function crewSk(){const o={};for(const r in CREW.roles)o[r]={lv:1,xp:0};return o}
function crewFix(m){for(const r in CREW.roles)if(!m.sk[r])m.sk[r]={lv:1,xp:0};if(!CREW.traits[m.trait]){const K=Object.keys(CREW.traits);let h=0;for(const ch of m.n)h=(h*31+ch.charCodeAt(0))>>>0;m.trait=m.n==='Ada Reyes'?'hands':m.n==='Kenji Sato'?'quick':K[h%K.length]}if(m.age0==null){let h=7;for(const ch of m.n)h=(h*131+ch.charCodeAt(0))>>>0;m.age0=m.n==='Ada Reyes'?34:m.n==='Kenji Sato'?41:27+h%18;m.bio=0;m.T0=T}}
function crewNew(){const sk=crewSk;
 return[{n:'Ada Reyes',role:'patch',sk:sk()},{n:'Kenji Sato',role:'repair',sk:sk()}]}
if(!s.crew.list)s.crew.list=crewNew();s.crew.list.forEach(crewFix);
const crewN=()=>s.crew.alive?Math.max(1,(s.crew.list||[]).length):0;
const crewOn=role=>(s.crew.list||[]).filter(m=>m.role===role&&!m.ill);
const crewLv=(m,role)=>(m.sk[role]||{lv:1}).lv+((((crewTr(m)||{}).lv)||{})[role]||0);
const crewEat=()=>s.crew.alive?Math.max(.8,(s.crew.list||[]).reduce((a,m)=>a+((crewTr(m)||{}).eat||1),0)):0;
const crewWork=()=>(.5+.5*Math.max(0,Math.min(100,s.crew.morale==null?75:s.crew.morale))/100)*(typeof chFitK==='function'?chFitK():1);
// train: spend research points to raise a skill one level right away
function crewTrain(i,role){const m=s.crew.list[i];if(!m)return'none';const k=m.sk[role],L=k.lv;if(L>=5)return'max';const c=typeof SBX==='function'&&SBX()?0:CREW.trainRP[L];if(s.rp<c)return'rp';s.rp-=c;k.lv=L+1;k.xp=Math.max(k.xp,CREW.xpLv[L]);return'ok'}
function crewAssign(i,role){const m=s.crew.list[i];if(m&&CREW.roles[role]){m.role=role;recalc();return true}return false}
// cabin space comes from life support; every astronaut weighs 80 kg and eats, drinks and breathes
const crewCap=()=>SH&&SH.ls&&SH.ls.cap||2;
const crewSum=role=>crewOn(role).reduce((a,m)=>a+crewLv(m,role),0);
const crewFab=()=>s.crew.sleep?1:1+CREW.fab*crewSum('fab')*crewWork(),crewMine=()=>s.crew.sleep?1:1+CREW.mine*crewSum('miner')*crewWork(),crewGun=()=>s.crew.sleep?1:1+CREW.gun*crewSum('gunner')*crewWork();
function crewRecruit(){const L=s.crew.list;if(!inEarth()&&!(typeof SBX==='function'&&SBX()))return'earth';if(L.length+s.jobs.filter(j=>j.type==='recruit').length>=crewCap())return'full';if(s.crew.sleep)return'asleep';
 const used=new Set(L.map(m=>m.n).concat(s.jobs.filter(j=>j.type==='recruit').map(j=>j.who.n))),free=CREW.names.filter(n=>!used.has(n)),n=free[(Math.random()*free.length)|0]||'Astronaut '+(L.length+1);
 const spec=['repair','patch','science','fab','miner','gunner','medic','pilot'][(Math.random()*8)|0],who={n,role:spec,sk:crewSk(),trait:Object.keys(CREW.traits)[(Math.random()*Object.keys(CREW.traits).length)|0]};who.sk[spec]={lv:2,xp:CREW.xpLv[1]};
 queueJob({type:'recruit',who,name:'Launch '+n+' from Earth ('+CREW.roles[spec].n.toLowerCase()+')',J:CREW.recruitJ});return'ok'}
function crewDismiss(i){const L=s.crew.list;if(!inEarth())return'earth';if(L.length<=1)return'last';L.splice(i,1);recalc();return'ok'}
// one tick of crew work (called from survivalTick with game hours h)
// what the crew's mood is heading toward, and why (shown in the Crew window)
function crewMoraleWhy(){const c=s.crew,n=Math.max(1,c.list.length),L=lifeDays(),lo=Math.min(L.o2,L.wat,L.food),A=typeof ALERTS!=='undefined'?ALERTS:[],out=[['Baseline',70]];
 const room=Math.min(15,Math.max(-20,(crewCap()/n-1)*10));if(room)out.push([room>0?'Room to move':'Crowded cabin',room]);
 if(A.some(a=>a.l==='crit'))out.push(['Danger alarms',-25]);else if(A.length)out.push(['Warnings',-8]);if(lo<14)out.push(['Supplies running low',-15]);if(s.leak>0)out.push(['Hull breach',-10]);
 const rest=crewOn('rest').length;if(rest)out.push(['Someone on rest duty',5*rest]);for(const m of c.list){const t=crewTr(m);if(t&&t.mor)out.push([t.n+' ('+m.n.split(' ')[0]+')',t.mor])}
 if(c.hp<60)out.push(['Poor health',-10]);if(SH&&SH.ls===PARTS.ls_bio){const cp=typeof cropT==='function'?cropT():{n:'',mor:8};out.push([cp.mor>=0?'Greenhouse: fresh food and plants':'Greenhouse: algae paste again',cp.mor])}if(typeof chMorale==='function')chMorale(out);return out}
function crewTick(h){const c=s.crew,dtau=Math.max(0,(s.tau||0)-(c.tau0==null?(s.tau||0):c.tau0));c.tau0=s.tau||0;if(!c.alive||!(h>0)||c.sleep)return;for(const m of c.list){crewFix(m);m.bio=(m.bio||0)+dtau/3.15576e7}if(typeof chTick==='function')chTick(h);if(c.morale==null)c.morale=75;
 {const tg=Math.max(0,Math.min(100,crewMoraleWhy().reduce((a,q)=>a+q[1],0)));c.morale+=(tg-c.morale)*(1-Math.exp(-h/48));if(c.morale<25&&!c.lowMor){c.lowMor=1;notify('😟 Crew morale is low: everyone works at '+Math.round(crewWork()*100)+' %. See 👩‍🚀 Crew for why.')}if(c.morale>40)c.lowMor=0}
 const wf=crewWork();
 for(const m of c.list){crewFix(m);const k=m.sk[m.role];if(!k)continue;k.xp+=h*((crewTr(m)||{}).xp||1);while(k.lv<5&&k.xp>=CREW.xpLv[k.lv]){k.lv++;notify('🎓 '+m.n+' reached Level '+k.lv+' in '+CREW.roles[m.role].n.toLowerCase()+'.')}}
 // hull patching: the best patcher works on the breach until it is sealed
 const P=crewOn('patch').sort((a,b)=>crewLv(b,'patch')-crewLv(a,'patch'))[0];
 if(s.leak>0){if(P&&(s.res.patch||0)>=1){c.patchT=(c.patchT||0)+h*crewLv(P,'patch')/CREW.patchH*wf;if(c.patchT>=1){c.patchT=0;s.leak=0;s.res.patch-=1;notify('🩹 '+P.n+' sealed the hull breach (1 patch kit used, '+Math.floor(s.res.patch)+' left).')}}}else c.patchT=0;
 // repairs: worst part first, then failed engines
 let work=crewOn('repair').reduce((a,m)=>a+CREW.repRate*crewLv(m,'repair'),0)*h*wf;
 for(let guard=0;guard<20&&work>1e-9&&s.res.spares>1e-6;guard++){const p=s.parts.filter(q=>q.fail||q.cond<.98).sort((a,b)=>(b.fail-a.fail)||(a.cond-b.cond))[0],E=DR.filter(D=>isU(D.id)&&(D.fail||D.cond<.98)).sort((a,b)=>a.cond-b.cond)[0];
  const t=p&&(!E||p.fail||p.cond<=E.cond)?p:E;if(!t)break;const fix=Math.min(work,1-t.cond,s.res.spares);t.cond+=fix;s.res.spares-=fix;work-=fix;
  if(t.fail&&t.cond>=.6){t.fail=false;const nm=t.id&&PARTS[t.id]?PARTS[t.id].n:t.n;notify('🔧 '+crewOn('repair')[0].n+' repaired the '+nm+'.');recalc()}}
 if(s.en>0)for(const m of crewOn('science'))s.rp+=CREW.sciRP*crewLv(m,'science')*h*wf;
 for(const m of crewOn('medic')){const L=crewLv(m,'medic');c.hp=Math.min(100,c.hp+CREW.heal*L*h);c.acute*=Math.exp(-.01*L*h)}}
// health recovery bonus from rest and a pilot on watch (added to the normal +0.5 %/h when nothing is wrong)
const crewHeal=()=>s.crew.sleep?0:crewOn('rest').reduce((a,m)=>a+.5*crewLv(m,'rest'),0)+crewOn('pilot').reduce((a,m)=>a+.1*crewLv(m,'pilot'),0);
// hibernation (needs the Crew hibernation technology): the crew sleeps in suspended animation; nothing is eaten or
// breathed, nobody ages or takes radiation, duties stop and the ship's systems power down (no wear, no breakdowns)
function crewSleep(on){const c=s.crew;if(on&&!hasT('t_cryo'))return'tech';if(on&&typeof CB!=='undefined'&&CB.on)return'combat';c.sleep=!!on;return'ok'}
