// ===== CONTRACTS: missions from Earth's mission control, generated from where you are and what you can do =====
// Rewards obey the Laws (wiki: The Laws of Orbital): research points are knowledge; energy arrives by power beam from
// Earth (only what your battery can hold); matter (materials, missiles) is launched from Earth as a supply capsule and
// reaches you only while you are inside Earth's gravity zone (it waits for you otherwise). State: s.ctr. UI: key 9.
if(!s.ctr)s.ctr={offers:[],active:[],done:0,drop:{},next:0,uid:0};
const CTR_VISIT=[['Moon',60,2e11],['Venus',220,6e11],['Mars',250,8e11],['Mercury',380,1.2e12],['Jupiter',700,3e12],['Saturn',1000,5e12]];
function ctrAlt(){const o=elements();return{o,peri:o.ec<1?o.a*(1-o.ec)-o.d.R:Infinity,alt:o.r-o.d.R}}
function ctrMake(){const C=s.ctr,id=++C.uid,earth=s.dom&&s.dom.n==='Earth',r=Math.random(),L=[];
 const {peri}=ctrAlt();
 if(earth&&peri<3e7)L.push(()=>{const km=[2000,8000,20000,35786][Math.random()*4|0];return{type:'orbit',km,t:`Raise your lowest point to ${km.toLocaleString()} km above Earth${km===35786?' (geostationary height)':''}`,rw:{rp:10+km/1000,J:2e10+km*1e6}}});
 if(earth)L.push(()=>({type:'escape',t:'Escape Earth’s gravity',rw:{rp:60,J:2e11,drop:{water:200,food:50}}}));
 for(const [n,rp,J] of CTR_VISIT)if(!s.dom||s.dom.n!==n)L.push(()=>({type:'visit',body:n,t:`Reach orbit around ${n}`,rw:{rp,J,drop:{spares:4,platinum:rp/200}}}));
 L.push(()=>{const a=AST[Math.random()*AST.length|0];return{type:'survey',ast:a.n,t:`Survey asteroid ${a.n} (${a.t}-type): fly within 10 km`,rw:{rp:40,J:1e11,drop:{platinum:.5}}}});
 L.push(()=>{const kg=[200,1000,5000][Math.random()*3|0];return{type:'mine',kg,base:s.mined,t:`Mine ${kg.toLocaleString()} kg of asteroid rock`,rw:{rp:kg/50,J:kg*5e7}}});
 L.push(()=>{const n=2+(Math.random()*4|0);return{type:'bounty',n,base:s.raid?s.raid.kills:0,t:`Destroy ${n} raider drones (press 0 to find them)`,rw:{rp:8*n,drop:{missile:n}}}});
 L.push(()=>{const b=['Moon','Mars','Venus'][Math.random()*3|0],kg=[100,300,800][Math.random()*3|0];return{type:'deliver',body:b,kg,res:'water',t:`Deliver ${kg} kg of water to an orbit around ${b} (it is used up on arrival)`,rw:{rp:kg/4,J:kg*1e9}}});
 if(Object.keys(s.tech).length>15)L.push(()=>({type:'speed',f:.01,t:'Reach 1 % of the speed of light (3,000 km/s)',rw:{rp:600,J:1e13}}));
 if(s.tech.t_probe)L.push(()=>{const L2=['Moon','Venus','Mars','Mercury','Jupiter','Saturn'].filter(n=>!s.dom||s.dom.n!==n),b=L2[Math.random()*L2.length|0];return{type:'probe',body:b,base:0,t:`Send a science probe to ${b} and receive its data`,rw:{rp:OPS.SCI[b]*.8,J:OPS.SCI[b]*2e9,drop:{platinum:.3}}}});
 if(s.tech.t_robo)L.push(()=>{const kg=[100,300,1000][Math.random()*3|0];return{type:'haul',kg,base:0,t:`Haul ${kg} kg of ore with mining drones`,rw:{rp:kg/25,J:kg*8e7}}});
 L.push(()=>{const au=[.5,.3,.2][Math.random()*3|0];return{type:'sun',au,t:`Fly within ${au} AU of the Sun`,rw:{rp:300*(1-au),J:5e11}}});
 const k=L[Math.random()*L.length|0]();k.id=id;k.t0=T;return k}
function ctrFill(){const C=s.ctr;C.offers=C.offers.filter(o=>!C.active.some(a=>a.type===o.type&&a.body===o.body));while(C.offers.length<3){const o=ctrMake();if(!C.offers.some(x=>x.t===o.t)&&!C.active.some(x=>x.t===o.t))C.offers.push(o);else if(Math.random()<.3)break}}
// progress 0..1 and a short status, per type
function ctrProg(c){const g=gam(s),{o,peri,alt}=ctrAlt();
 switch(c.type){
  case'orbit':return s.dom.n==='Earth'?[Math.max(0,Math.min(1,peri/(c.km*1e3))),'lowest point '+km(Math.max(0,peri))]:[0,'go back to Earth'];
  case'escape':return[s.dom.n==='Earth'?(o.ec>=1?1:Math.min(.99,o.ec)):1,s.dom.n==='Earth'?'eccentricity '+o.ec.toFixed(2)+' (1 = escape)':'free of Earth'];
  case'visit':return[s.dom.n===c.body&&o.ec<1?1:0,s.dom.n===c.body?(o.ec<1?'in orbit':'passing by: slow down to stay'):'dominant body: '+s.dom.n];
  case'survey':{const a=AST.find(x=>x.n===c.ast);if(!a)return[0,'?'];const d=astDist(a);return[d<1e4?1:Math.max(0,Math.min(.95,1-Math.log10(d/1e4)/6)),fmtD(d)+' away']}
  case'mine':{const m=s.mined-c.base;return[Math.min(1,m/c.kg),f1(m,0)+' / '+c.kg+' kg']}
  case'bounty':{const n=(s.raid?s.raid.kills:0)-c.base;return[Math.min(1,n/c.n),n+' / '+c.n+' raiders']}
  case'deliver':{const here=s.dom.n===c.body&&o.ec<1,have=s.res[c.res]||0;return[here&&have>=c.kg?1:here?.5:Math.min(.4,have/c.kg*.4),here?(have>=c.kg?'delivering':'need '+c.kg+' kg, carrying '+f1(have,0)):'carrying '+f1(have,0)+' kg; go to '+c.body]}
  case'speed':{const v=Math.hypot(s.vx/g,s.vy/g,s.vz/g)/C;return[Math.min(1,v/c.f),(v*100).toFixed(3)+' % of c']}
  case'probe':{const got=(s.ops.sci[c.body]||0)>c.base,fl=s.ops.flights.find(f=>f.to===c.body);return[got?1:fl?(fl.rx!=null?.9:.5):0,got?'data received':fl?(fl.rx!=null?'data on its way':'probe in flight'):'launch a probe (key 8)']}
  case'haul':{const m=s.ops.haul-c.base;return[Math.min(1,m/c.kg),f1(m,0)+' / '+c.kg+' kg']}
  case'sun':{const r=sunDist()/AU;return[r<=c.au?1:Math.max(0,Math.min(.95,(1.1-r)/(1.1-c.au))),r.toFixed(2)+' AU from the Sun']}}
 return[0,'']}
function ctrPay(c){const w=c.rw,bits=[];
 if(w.rp){s.rp+=w.rp;bits.push(Math.round(w.rp)+' research points')}
 if(w.J){const got=Math.min(w.J,Math.max(0,SH.cap-s.en));s.en+=got;bits.push(sci(got)+' J by power beam'+(got<w.J?' (battery full: the rest was lost)':''))}
 if(w.drop){for(const k in w.drop)s.ctr.drop[k]=(s.ctr.drop[k]||0)+w.drop[k];bits.push('a supply capsule ('+Object.entries(w.drop).map(([k,v])=>f1(v,1)+(k==='missile'?' missiles':' kg '+k)).join(', ')+')')}
 return bits.join(', ')}
function ctrTick(){const C=s.ctr;if(!C||!s.crew.alive)return;
 if(!C.offers.length||T>C.next){C.next=T+86400;ctrFill()}
 for(const c of C.active.slice()){const [p]=ctrProg(c);if(p<1)continue;
  if(c.type==='deliver')s.res[c.res]=Math.max(0,s.res[c.res]-c.kg);
  C.active.splice(C.active.indexOf(c),1);C.done++;const got=ctrPay(c);sfx&&sfx('win');notify('📋✅ Contract complete: '+c.t+'. Reward: '+got+'.');
  if(C.done===1)disc('ctr1','Completed your first contract',10,'Mission control pays in knowledge, power beams and supply capsules: never in matter from nowhere');ctrFill()}
 if(Object.keys(C.drop).length&&s.dom&&s.dom.n==='Earth'){const L=[];for(const k in C.drop){if(k==='missile')s.ammo.missile+=Math.round(C.drop[k]);else s.res[k]=(s.res[k]||0)+C.drop[k];L.push(f1(C.drop[k],1)+(k==='missile'?' missiles':' kg '+k))}C.drop={};notify('📦 A supply capsule from Earth docked: '+L.join(', ')+'.')}}
// ----- the board (key 9; phone: ☰ → Ship)
const CTRW=document.createElement('div');CTRW.id='ctrw';CTRW.className='h';CTRW.innerHTML='<div class="card"><h2>📋 Contracts</h2><div id="ctrb"></div><button id="ctrc">Close (9)</button></div>';document.body.appendChild(CTRW);
$('ctrc').onclick=()=>CTRW.classList.add('h');
function ctrToggle(){CTRW.classList.toggle('h');ctrDraw()}
function ctrDraw(){if(CTRW.classList.contains('h'))return;const C=s.ctr,b=$('ctrb'),rw=w=>[w.rp?Math.round(w.rp)+' RP':'',w.J?sci(w.J)+' J':'',w.drop?'📦 '+Object.entries(w.drop).map(([k,v])=>f1(v,1)+(k==='missile'?' missiles':' kg '+k)).join(', '):''].filter(Boolean).join(' · ');
 const h=`<p style="color:var(--mut)">Rewards: research points, energy by power beam (up to your battery's room), and supply capsules that reach you inside Earth's gravity zone${Object.keys(C.drop).length?' — <b>one is waiting for you now</b>':''}. Up to 3 active. Completed: ${C.done}.</p>
 <h4>ACTIVE</h4>${C.active.length?C.active.map(c=>{const [p,st]=ctrProg(c);return`<div class="ctr"><b>${c.t}</b><div class="cbar"><i style="width:${Math.round(p*100)}%"></i></div><small>${st} · reward ${rw(c.rw)}</small> <button data-ab="${c.id}">Abandon</button></div>`}).join(''):'<p>None yet: accept one below.</p>'}
 <h4>OFFERED</h4>${C.offers.map(c=>`<div class="ctr"><b>${c.t}</b><br><small>reward ${rw(c.rw)}</small> <button data-ac="${c.id}" ${C.active.length>=3?'disabled':''}>Accept</button></div>`).join('')}`;
 if(b._h!==h){b._h=h;b.innerHTML=h;b.querySelectorAll('[data-ac]').forEach(x=>x.onclick=()=>{const i=C.offers.findIndex(o=>o.id==x.dataset.ac);if(i<0||C.active.length>=3)return;const c=C.offers.splice(i,1)[0];if(c.type==='mine')c.base=s.mined;if(c.type==='bounty')c.base=s.raid?s.raid.kills:0;if(c.type==='probe')c.base=s.ops.sci[c.body]||0;if(c.type==='haul')c.base=s.ops.haul;C.active.push(c);ctrFill();notify('📋 Accepted: '+c.t);ctrDraw()});
  b.querySelectorAll('[data-ab]').forEach(x=>x.onclick=()=>{C.active=C.active.filter(c=>c.id!=x.dataset.ab);ctrDraw()})}}
ORB.on('ui',()=>{try{ctrTick();ctrDraw()}catch(e){console.warn('contracts',e)}});
