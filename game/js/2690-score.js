// ===== SCORE AND SECOND CHANCES (client): a score when the crew is lost, and "restart 24 hours earlier" =====
// The score adds up how far you got: how long the crew lived, how far from Earth and how fast you went, how close to
// the Sun, what you learned, discovered, mined and won. Your best score is kept in this browser.
// Single player keeps snapshots of the game in memory (about one per game hour); when the crew is lost you can go back
// to the snapshot from 24 game hours before, at the slowest time speed, and try again.
const SNAP={list:[],lastT:-1e18,lastAt:0};
function scoreNow(){const R=s.codex.rec,d=T/86400,maxE=R.maxE||0,lg=x=>Math.log10(Math.max(1,x));
 const rows=[['Time survived',f1(d,1)+' '+tr('days'),Math.round(10*d)],
  ['Farthest from Earth',fmtD(maxE),Math.round(100*Math.max(0,lg(maxE/4e5)))],
  ['Fastest speed (Sun frame)',R.maxV>=1e6?(R.maxV/C).toFixed(4)+' c':f1(R.maxV/1e3,1)+' km/s',Math.round(150*Math.max(0,lg(R.maxV/1e3)))],
  ['Closest to the Sun',fmtD(R.minR),Math.round(200*Math.max(0,lg(AU/Math.max(1,R.minR))))],
  ['Technologies',String(Object.keys(s.tech).length),40*Object.keys(s.tech).length],
  ['Discoveries',String(Object.keys(s.codex.seen||{}).length),15*Object.keys(s.codex.seen||{}).length],
  ['Mined',f1(s.mined,0)+' kg',Math.round(50*lg(1+s.mined))],
  ['Contracts completed',String(s.ctr&&s.ctr.done||0),100*(s.ctr&&s.ctr.done||0)],
  ['Raiders destroyed',String(s.raid&&s.raid.kills||0),25*(s.raid&&s.raid.kills||0)+50*(s.raid&&s.raid.best||0)],
  ['Crew training',String((s.crew.list||[]).reduce((a,m)=>a+Object.values(m.sk).reduce((b,k)=>b+k.lv-1,0),0))+' '+tr('levels'),20*(s.crew.list||[]).reduce((a,m)=>a+Object.values(m.sk).reduce((b,k)=>b+k.lv-1,0),0)]];
 return{rows,total:rows.reduce((a,r)=>a+r[2],0)}}
// farthest distance from Earth (kept with the codex records, so it is saved)
ORB.on('frame',()=>{const R=s.codex.rec,E=B[3],d=Math.hypot(s.x-E.x,s.y-E.y,s.z-E.z);if(!(R.maxE>=d))R.maxE=d;
 // snapshots: about one per game hour, at most one every 0.4 s of real time, never in multiplayer
 const now=performance.now();if(!s.crew.alive||MP.conn||(typeof UNI!=='undefined'&&UNI.on))return;
 if(T-SNAP.lastT>=3600&&now-SNAP.lastAt>400){SNAP.lastT=T;SNAP.lastAt=now;try{SNAP.list.push({T,j:JSON.stringify(saveState())})}catch(e){}
  // keep three days of history (plus the oldest one), at most 160 snapshots
  while(SNAP.list.length>2&&SNAP.list[1].T<T-3*86400)SNAP.list.splice(1,1);while(SNAP.list.length>160)SNAP.list.splice(1+((Math.random()*(SNAP.list.length-2))|0),1)}});
function snapBefore(t){let best=null;for(const x of SNAP.list)if(x.T<=t&&(!best||x.T>best.T))best=x;return best||SNAP.list[0]||null}
function restartEarlier(){const x=snapBefore(T-86400);if(!x){notify('⚠ '+tr('No earlier snapshot to go back to.'));return}const back=T-x.T;
 loadState(JSON.parse(x.j));SNAP.list=SNAP.list.filter(q=>q.T<=x.T);SNAP.lastT=x.T;wi=0;paused=false;
 notify('⏪ '+tr('Back {} earlier, at the slowest time speed. Good luck!').replace('{}',dur(back)))}
ORB.on('gameover',why=>{const sc=scoreNow();let best=0;try{best=+localStorage.getItem('orbital-best-score')||0}catch(e){}const nb=sc.total>best&&!s.sandbox;if(nb)try{localStorage.setItem('orbital-best-score',String(sc.total))}catch(e){}
 const el=$('gotxt');el.innerHTML+=`<h3 class="goh">🏆 ${tr('SCORE')}: ${sc.total.toLocaleString()}${nb?' · '+tr('new personal best!'):' · '+tr('best')+' '+best.toLocaleString()}</h3><table class="bldt gosc">${sc.rows.map(r=>`<tr><td>${tr(r[0])}</td><td>${r[1]}</td><td>+${r[2].toLocaleString()}</td></tr>`).join('')}</table>`;
 const gb=$('gob');let b=$('gorew');if(!b){b=document.createElement('button');b.id='gorew';b.onclick=restartEarlier;gb.insertBefore(b,gb.firstChild)}
 const x=snapBefore(T-86400);b.disabled=!x||MP.conn;b.textContent='⏪ '+(x?tr('Restart {} earlier (slowest time speed)').replace('{}',dur(Math.max(0,T-x.T))):tr('Restart 24 hours earlier (no snapshot yet)'))});
