// ===== SENSORS & TELEMETRY: everything your ship can detect, as standard ORB-TLM/1 contacts =====
// The sensor suite improves as you research (tier = techs known / 7). Better tiers see farther, more precisely, more often,
// and learn more about each contact (fidelity level L1..L5). Every radar display, built-in or your own, draws the SAME
// contact list, so anyone can design a radar without touching the physics. Format: docs/PROTOCOL.md § Telemetry.
const SENSOR_TIERS=[
 {n:'Pulse radar',range:5e5,acc:.02,hz:1,lvl:1,d:'Position only, ±2 % of range.'},
 {n:'Doppler radar',range:2e6,acc:.005,hz:2,lvl:2,d:'Adds velocity from the Doppler shift.'},
 {n:'Phased array',range:2e7,acc:.001,hz:4,lvl:3,d:'Adds mass and size from radar cross-section and tracking.'},
 {n:'Lidar + spectrometer',range:2e8,acc:2e-4,hz:8,lvl:4,d:'Adds composition (elements) and hull/ammunition estimates.'},
 {n:'Interferometric array',range:2e9,acc:5e-5,hz:10,lvl:5,d:'Adds full loadout and engine state.'}];
const sensorTier=()=>Math.min(SENSOR_TIERS.length-1,Math.floor(Object.keys(s.tech||{}).length/7));
const ELEM_BY_TYPE={C:{C:.2,H:.02,O:.4,Si:.18,Fe:.15,Ni:.01,Pt:1e-6},S:{Si:.24,O:.42,Fe:.2,Mg:.12,Ni:.02,Pt:2e-6},M:{Fe:.86,Ni:.12,Co:.01,Pt:1.5e-5,Si:.01}};
function tlmNoise(id,slot,k){let h=2166136261;const t=id+':'+slot+':'+k;for(let i=0;i<t.length;i++){h^=t.charCodeAt(i);h=Math.imul(h,16777619)}return((h>>>0)/4294967295-.5)*2}
// raw truth → what this sensor tier reports
function tlmContact(src,tier){const S=SENSOR_TIERS[tier],g=gam(s),dx=src.x-s.x,dy=src.y-s.y,dz=src.z-s.z,d=Math.hypot(dx,dy,dz);if(d>S.range||d<1)return null;
 const slot=Math.floor(T*S.hz),sig=Math.max(1,S.acc*d),c={v:'ORB-TLM/1',id:src.id,kind:src.kind,name:S.lvl>=2||src.kind==='planet'?src.name:'unknown',t:T,lvl:S.lvl,
  pos:[src.x+sig*tlmNoise(src.id,slot,0),src.y+sig*tlmNoise(src.id,slot,1),src.z+sig*tlmNoise(src.id,slot,2)],sigma:sig,range:d,hostile:!!src.hostile};
 if(S.lvl>=2&&src.v){const sv=Math.max(.1,S.acc*300);c.vel=[src.v[0]+sv*tlmNoise(src.id,slot,3),src.v[1]+sv*tlmNoise(src.id,slot,4),src.v[2]+sv*tlmNoise(src.id,slot,5)];c.sigmaV=sv;
  c.closing=-(dx*(src.v[0]-s.vx/g)+dy*(src.v[1]-s.vy/g)+dz*(src.v[2]-s.vz/g))/d}
 if(S.lvl>=3){if(src.mass)c.mass=src.mass;if(src.radius)c.radius=src.radius}
 if(S.lvl>=4){if(src.elements)c.elements=src.elements;if(src.hull!=null)c.hull=src.hull;if(src.ammo)c.ammo=src.ammo}
 if(S.lvl>=5){if(src.loadout)c.loadout=src.loadout;if(src.engine)c.engine=src.engine}
 return c}
// everything that exists near you, in one shape (truth; never shown directly)
function tlmSources(){const L=[],g=gam(s);
 for(const o of OBJS){if(o.alive===false)continue;const k=o.raider?'raider':o.kind==='drone'?'drone':o.hostile?'missile':o.kind==='missile'?'own-missile':o.kind==='slug'?'slug':null;if(!k)continue;if(!o.tid)o.tid=k+'-'+Math.random().toString(36).slice(2,8);
  L.push({id:o.tid,kind:k,name:o.raider?'Raider '+o.name:k,x:o.x,y:o.y,z:o.z,v:[o.vx,o.vy,o.vz],hostile:!!(o.raider||o.hostile),mass:o.kind==='missile'?(o.dry||25)+(o.fuel||0):o.raider?1800:o.kind==='slug'?2:900,radius:o.r||1,
   hull:o.hpMax?o.hp/o.hpMax:null,elements:{Fe:.6,C:.2,Si:.1,Ni:.05,Pt:.001},ammo:o.raider?{missiles:o.mis||0}:null,loadout:o.raider?['pulse laser',o.mis?'missile rack':null].filter(Boolean):null,engine:o.raider?{accel:o.acc,burn:o.burn||0}:null})}
 for(const a of AST){const p=astState(a);if(Math.abs(p.x-s.x)>2e9)continue;const m=4.19*a.r**3*2000;L.push({id:'ast-'+a.n,kind:'asteroid',name:a.n+' ('+a.t+'-type)',x:p.x,y:p.y,z:p.z,v:[p.vx,p.vy,p.vz],mass:m,radius:a.r,elements:ELEM_BY_TYPE[a.t]||null})}
 if(typeof RS!=='undefined'&&RS&&RS.x)L.push({id:'player-'+(MP.peerName||'peer'),kind:'player',name:MP.peerName||'Other player',x:RS.x,y:RS.y,z:RS.z,v:[RS.vx,RS.vy,RS.vz],hostile:false,radius:RS.r||15,hull:RS.hull&&RS.hullMax?RS.hull/RS.hullMax:null,engine:RS.eng?{id:RS.eng,burn:RS.burn}:null,mass:RS.led?RS.led.m:null,elements:RS.led?RS.led.el:null,ammo:RS.led?{missiles:RS.led.mis}:null,loadout:RS.led?RS.led.wep:null});
 return L}
let TLM={t:-1,list:[],tier:0};
function tlmContacts(){const tier=sensorTier();if(TLM.t===T&&TLM.tier===tier)return TLM.list;const list=[];for(const src of tlmSources()){const c=tlmContact(src,tier);if(c)list.push(c)}
 list.sort((a,b)=>a.range-b.range);TLM={t:T,list,tier};return list}
// ----- radar displays: draw(ctx, W, H, contacts, info). Register your own with ORB.radar.register(name, fn) (see docs/MODDING.md)
const RADARS={};const radarReg=(n,f,d)=>{RADARS[n]={f,d:d||''}};
// ship-local frame: x right, y ahead (where the camera looks), z up (ecliptic north)
function rLocal(c){const f=dirAE(),sg=FP?1:-1,fx=sg*f[0],fy=sg*f[1],fl=Math.hypot(fx,fy)||1,rx=fy/fl,ry=-fx/fl,dx=c.pos[0]-s.x,dy=c.pos[1]-s.y,dz=c.pos[2]-s.z;return[dx*rx+dy*ry,(dx*fx+dy*fy)/fl,dz]}
const rMap=(d,R)=>Math.log(1+d/(R/800))/Math.log(801);       // log scale: near things spread out, the edge = max range
const rCol=c=>c.kind==='missile'?'#ff4a4a':c.hostile?'#ff5a5a':c.kind==='drone'?'#ffb347':c.kind==='player'?'#ff7af5':c.kind==='asteroid'?'#9fb6d8':'#7dffb0';
function rMark(x,c,px,py,sz){x.fillStyle=x.strokeStyle=rCol(c);x.beginPath();if(c.kind==='missile'){x.moveTo(px,py-sz);x.lineTo(px+sz,py+sz);x.lineTo(px-sz,py+sz);x.closePath();x.fill()}
 else if(c.hostile||c.kind==='drone'){x.moveTo(px,py-sz);x.lineTo(px+sz,py);x.lineTo(px,py+sz);x.lineTo(px-sz,py);x.closePath();x.stroke()}else{x.arc(px,py,sz*.7,0,7);x.fill()}}
radarReg('sweep',(x,W,H,L,o)=>{const cx=W/2,cy=H/2,R=Math.min(W,H)/2-6,a=(performance.now()/1000*1.6)%(2*Math.PI);x.fillStyle='rgba(0,20,8,.55)';x.beginPath();x.arc(cx,cy,R,0,7);x.fill();
 x.strokeStyle='rgba(80,255,140,.25)';for(let k=1;k<=4;k++){x.beginPath();x.arc(cx,cy,R*k/4,0,7);x.stroke()}x.beginPath();x.moveTo(cx-R,cy);x.lineTo(cx+R,cy);x.moveTo(cx,cy-R);x.lineTo(cx,cy+R);x.stroke();
 const gr=x.createLinearGradient(cx,cy,cx+R*Math.cos(a),cy-R*Math.sin(a));gr.addColorStop(0,'rgba(80,255,140,.0)');gr.addColorStop(1,'rgba(80,255,140,.7)');x.strokeStyle=gr;x.lineWidth=2;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx+R*Math.cos(a),cy-R*Math.sin(a));x.stroke();x.lineWidth=1;
 for(const c of L){const p=rLocal(c),r=rMap(c.range,o.range)*R,an=Math.atan2(p[1],p[0]),age=((a-an)%(2*Math.PI)+2*Math.PI)%(2*Math.PI);x.globalAlpha=Math.max(.25,1-age/(2*Math.PI));rMark(x,c,cx+r*Math.cos(an),cy-r*Math.sin(an),4);x.globalAlpha=1}},'Classic phosphor sweep, top-down, log range');
radarReg('holo',(x,W,H,L,o)=>{const cx=W/2,cy=H*.58,R=Math.min(W*.46,H*.8),k=.38;x.strokeStyle='rgba(95,224,255,.35)';for(let i=1;i<=3;i++){x.beginPath();x.ellipse(cx,cy,R*i/3,R*i/3*k,0,0,7);x.stroke()}
 for(const c of L){const p=rLocal(c),r=rMap(c.range,o.range)*R,an=Math.atan2(p[1],p[0]),px=cx+r*Math.cos(an),py=cy-r*Math.sin(an)*k,h=Math.max(-H*.4,Math.min(H*.4,p[2]/Math.max(1,c.range)*R*.8));
  x.strokeStyle=rCol(c);x.globalAlpha=.6;x.beginPath();x.moveTo(px,py);x.lineTo(px,py-h);x.stroke();x.globalAlpha=1;rMark(x,c,px,py-h,4)}
 x.fillStyle='#5fe0ff';x.beginPath();x.moveTo(cx,cy-6);x.lineTo(cx+4,cy+4);x.lineTo(cx-4,cy+4);x.fill()},'Holographic disc with height stems');
radarReg('grid',(x,W,H,L,o)=>{x.strokeStyle='rgba(120,200,255,.14)';const n=8;for(let i=0;i<=n;i++){x.beginPath();x.moveTo(i*W/n,0);x.lineTo(i*W/n,H);x.moveTo(0,i*H/n);x.lineTo(W,i*H/n);x.stroke()}
 const cx=W/2,cy=H/2,R=Math.min(W,H)/2-8;x.font='9px ui-monospace,monospace';
 for(const c of L.slice(0,40)){const p=rLocal(c),r=rMap(c.range,o.range)*R,an=Math.atan2(p[1],p[0]),px=cx+r*Math.cos(an),py=cy-r*Math.sin(an);rMark(x,c,px,py,4);
  if(c.hostile||c.kind==='player'){x.fillStyle=rCol(c);x.fillText(fmtD(c.range),px+6,py-4)}}
 x.strokeStyle='#5fe0ff';x.strokeRect(cx-3,cy-3,6,6)},'Tactical grid with range tags');
radarReg('list',(x,W,H,L,o)=>{x.font='10px ui-monospace,monospace';let y=12;for(const c of L.slice(0,Math.floor(H/13))){x.fillStyle=rCol(c);
  x.fillText(`${c.kind.slice(0,8).padEnd(8)} ${fmtD(c.range).padStart(9)} ${c.closing!=null?(c.closing>0?'↘':'↗')+Math.abs(c.closing).toFixed(0)+' m/s':''} ±${fmtD(c.sigma)}`,4,y);y+=13}
 if(!L.length){x.fillStyle='#7f98b8';x.fillText('No contacts within '+fmtD(o.range),4,14)}},'Plain list: kind, range, closing speed, error');
radarReg('minimal',(x,W,H,L,o)=>{const cx=W/2,cy=H/2,R=Math.min(W,H)/2-6;x.strokeStyle='rgba(255,255,255,.18)';x.beginPath();x.arc(cx,cy,R,0,7);x.stroke();
 for(const c of L){const p=rLocal(c),r=rMap(c.range,o.range)*R,an=Math.atan2(p[1],p[0]);x.fillStyle=rCol(c);x.beginPath();x.arc(cx+r*Math.cos(an),cy-r*Math.sin(an),2.2,0,7);x.fill()}},'One ring, coloured dots');
let RADAR_DESIGN='holo';try{RADAR_DESIGN=localStorage.getItem('orbital-radar')||'holo'}catch(e){}
function radarDraw(cv){const W=cv.width,H=cv.height,x=cv.getContext&&cv.getContext('2d');if(!x)return;x.clearRect(0,0,W,H);const tier=sensorTier(),S=SENSOR_TIERS[tier],L=tlmContacts();
 const hs=L.filter(c=>c.hostile||c.kind==='player'),ref=hs.length?hs:L.slice(0,6),far=ref.reduce((m,c)=>Math.max(m,c.range),0),view=Math.min(S.range,Math.max(2e4,far*1.4));
 const R=RADARS[RADAR_DESIGN]||RADARS.holo;try{R.f(x,W,H,L.filter(c=>c.range<=view),{range:view,sensorRange:S.range,tier,sensor:S,me:s})}catch(e){x.fillStyle='#ff6a5a';x.fillText('radar design error: '+e.message,4,14)}
 x.font='9px ui-monospace,monospace';x.fillStyle='rgba(160,220,255,.75)';x.fillText(`${S.n} · L${S.lvl} · scale ${fmtD(view)} of ${fmtD(S.range)} · ${L.length} contacts`,4,H-4)}
// dashboard widget (cockpit): add it from the widget menu, or it appears in the Flight layout
WDEF.tlm={t:'📡 Sensors (ORB-TLM)',w:24,h:28,make:(b,it)=>{it.cv=document.createElement('canvas');b.appendChild(it.cv)},
 draw:(b,it)=>{const W=Math.max(140,b.clientWidth-16||240),H=Math.max(90,b.clientHeight-14||180);if(it.cv.width!==W)it.cv.width=W;if(it.cv.height!==H)it.cv.height=H;radarDraw(it.cv)}};
{const rc=$('radar');if(rc)PARK.appendChild(rc)}
try{if(!localStorage.getItem('orbital-tlm-added')&&DASH.L.Flight&&!DASH.L.Flight.some(w=>w.id==='tlm')){const sc=DASH.L.Flight.find(w=>w.id==='scanner');if(sc)sc.id='tlm';else DASH.L.Flight.push({id:'tlm',x:39,y:68,w:22,h:26});localStorage.setItem('orbital-tlm-added','1');saveDash()}}catch(e){}
dashBuild();{const pb=$('wpalb');if(pb){const g2=grp(pb,'SENSORS');btn(g2,'📡 Sensors (ORB-TLM radar)',()=>addW('tlm'))}}
