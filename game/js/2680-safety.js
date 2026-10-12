// ===== SAFETY SLOW-DOWN (client): 🛟 next to the time controls, and a toggle on the physical console =====
// Alerts never pause the game. Instead, when something will kill the crew in less than one game day, this slows time
// so that you have about 5 real minutes to deal with it (it only ever slows time down; turn it off any time). When the
// danger is over it puts the time rate back to what it was. Estimates come from the same rules the game runs.
const SAFE={on:true,prev:null,ttd:Infinity,why:'',at:0,real:300};
try{SAFE.on=localStorage.getItem('orbital-safety')!=='0'}catch(e){}
// how long until the crew dies if nothing changes (game seconds), and why
function safeTTD(){const c=s.crew;if(!c.alive)return{t:Infinity,why:''};let best={t:Infinity,why:''};const take=(t,why)=>{if(t>=0&&t<best.t)best={t,why}};
 const L=lifeDays();take(L.o2*86400+2*3600,'oxygen runs out');take(L.wat*86400+71*3600,'water runs out');take(L.food*86400+660*3600,'food runs out');
 // crew health falling right now (the same terms survivalTick uses, per hour)
 let dh=0;if(c.o2ok===false)dh-=50;if(s.co2>.6)dh-=(s.co2-.6)*20;if(c.waterok===false)dh-=1.4;if(c.foodok===false)dh-=.15;if(s.tLo>318)dh-=(s.tLo-318)*.4;if(c.acute>1)dh-=(c.acute-1)*.8;
 if(dh<0)take(c.hp/-dh*3600,s.tLo>318?'the cabin is overheating':c.acute>1?'radiation sickness':c.o2ok===false?'no oxygen':s.co2>.6?'carbon dioxide':'crew health is falling');
 // the cabin heating up toward 45 °C
 if(s.hLo>s.capLo&&s.tLo<318){const teq=Math.pow(s.hLo/(EPSR*SIG*SH.radLoA)+256,.25);take((318-s.tLo)*2e6/(s.hLo-s.capLo)+100/(.4*Math.max(1,teq-318))*3600,'the cabin is overheating')}
 // a lethal radiation dose building up during a solar storm
 try{const R2=doseNow();if(R2.spe>0&&R2.tot>0)take(Math.max(0,6-c.acute)/R2.tot,'solar storm radiation')}catch(e){}
 // the hull being destroyed (measured from how fast it is falling)
 if(SAFE.hRate>0)take(s.hull/SAFE.hRate,'the hull is being destroyed');
 // falling into a planet or moon
 try{const d=s.dom,g=gam(s),rx=s.x-d.x,ry=s.y-d.y,rz=s.z-d.z,r=Math.hypot(rx,ry,rz),vx=s.vx/g-d.vx,vy=s.vy/g-d.vy,vz=s.vz/g-d.vz,vr=(rx*vx+ry*vy+rz*vz)/r;
  if(d!==B[0]&&vr<0){const o=elements(),rp=o.ec<1?o.a*(1-o.ec):o.hh*o.hh/(d.GM*(1+o.ec));if(rp<d.R)take((r-d.R)/-vr,'a crash into '+d.n)}}catch(e){}
 // incoming missiles
 for(const o of OBJS)if(o.alive&&o.hostile&&o.kind==='missile'){const d=Math.hypot(o.x-s.x,o.y-s.y,o.z-s.z),g=gam(s),cv=-((o.x-s.x)*(o.vx-s.vx/g)+(o.y-s.y)*(o.vy-s.vy/g)+(o.z-s.z)*(o.vz-s.vz/g))/(d||1);if(cv>1)take(d/cv,'an incoming missile')}
 return best}
let safeLast={T:0,hull:0};
function safeTick(){if(wi>WARP_DEEP&&!deepSpace()&&!(MP.conn||(typeof UNI!=='undefined'&&UNI.on))){wi=WARP_DEEP;notify('⏩ Back to 1 s = '+dur(WARP[wi])+': within 2,000 AU of a star, deep-space time speeds are off.')}
 
 // hull loss rate, smoothed over game time
 if(safeLast.T&&T>safeLast.T){const r=(safeLast.hull-s.hull)/(T-safeLast.T);SAFE.hRate=Math.max(0,(SAFE.hRate||0)*.7+.3*r)}safeLast={T,hull:s.hull};
 const b=safeTTD();SAFE.ttd=b.t;SAFE.why=b.why;const el=$('safety');
 const danger=b.t<86400,shared=!!(MP.conn||(typeof UNI!=='undefined'&&UNI.on));
 if(danger&&SAFE.on&&!paused&&!shared){let k=0;for(let i=0;i<WARP.length;i++)if(WARP[i]<=b.t/SAFE.real)k=i;if(wi>k){if(SAFE.prev==null)SAFE.prev=wi;wi=k;notify('🛟 '+tr('Safety slow-down: {} in about {}. Time slowed to 1 s = {} so you have about 5 minutes.').replace('{}',tr(b.why)).replace('{}',dur(b.t)).replace('{}',dur(WARP[wi])))}}
 if(!danger&&SAFE.prev!=null&&b.t>2*86400){if(!shared&&wi<SAFE.prev){wi=SAFE.prev;notify('🛟 '+tr('Danger over: time back to 1 s = {}.').replace('{}',dur(WARP[wi])))}SAFE.prev=null}
 if(el){el.classList.toggle('h',!danger);if(danger)el.innerHTML='⚠ '+tr(b.why)+' · '+tr('in')+' '+dur(b.t)+' '+tr('game time')+(WARP[wi]?' ≈ '+dur(b.t/WARP[wi])+' '+tr('real time'):'')+(SAFE.on?'':' · 🛟 '+tr('safety slow-down is OFF'))}
 const sb=$('safebtn');if(sb){sb.textContent='🛟 '+tr(SAFE.on?'Safety slow-down: ON':'Safety slow-down: OFF');sb.classList.toggle('on',SAFE.on)}}
function safeToggle(v){SAFE.on=v===undefined?!SAFE.on:!!v;try{localStorage.setItem('orbital-safety',SAFE.on?'1':'0')}catch(e){}notify('🛟 '+tr(SAFE.on?'Safety slow-down ON: if something will kill your crew within a day, time slows so you have about 5 minutes to react.':'Safety slow-down OFF.'))}
{const tc=$('tc');if(tc){const b=document.createElement('button');b.id='safebtn';b.title='Slows time when something will kill the crew within a day';b.onclick=()=>safeToggle();tc.appendChild(b)}
 const w=document.createElement('div');w.id='safety';w.className='h';document.body.appendChild(w);w.onclick=()=>safeToggle()}
ORB.on('frame',safeTick);
