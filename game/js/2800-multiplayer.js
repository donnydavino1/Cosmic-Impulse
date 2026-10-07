// ===== MULTIPLAYER: two players, peer to peer. The host owns the shared clock; each player owns their own ship. =====
DR.forEach(D=>D.hf0=D.hf);
// Rules fingerprint: a hash of every physics constant and game rule. Both players must match, so everyone plays by the same rules.
const RULES=(()=>{const src=JSON.stringify({v:'orbital-mp1',DR:DR.map(d=>[d.id,d.ve0,d.k,d.al,d.base,d.pw0,d.hf0,d.f,d.el]),PARTS,TECH:TECH.map(t=>[t.id,t.c,t.pre]),FUEL:Object.fromEntries(Object.entries(FUEL).map(([k,f])=>[k,[f.J,f.earthJ,f.make]])),WEPR,ENGR,k:[G,C,AU,S0,MAXB,BASE]});
 let h=2166136261;for(let i=0;i<src.length;i++){h^=src.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(16).padStart(8,'0')})();
const MP={conn:null,role:null,name:'Pilot-'+(100+Math.floor(Math.random()*900)),peerName:'',hT:0,hRate:0,hAt:0,rtt:0,lock:false,peer:null,code:'',chat:[],dealt:0,taken:0,lastShip:0,lastClock:0,lastCust:0,lastPing:0,rtc:null,synced:false};
try{const n=localStorage.getItem('orbital-name');if(n)MP.name=n}catch(e){}
let RS=null,WRECKS=[];const START_SNAP=JSON.stringify({fuel:s.fuel,res:s.res,parts:s.parts.map(p=>p.id),area:s.area});
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=(...a)=>a.every(v=>typeof v==='number'&&isFinite(v));
function mpSend(o){if(MP.conn)try{MP.conn.send(JSON.stringify(o))}catch(e){}}
function mpReq(what){if(MP.role==='guest'&&MP.conn){mpSend({t:'req',what});return true}return false}
function togglePause(){if(!mpReq('pause'))paused=!paused}
function guestRem(now){if(!MP.synced)return 0;const tgt=MP.hT+MP.hRate*((now-MP.hAt)+MP.rtt/2)/1000;
 if(T-tgt>2)shiftT(tgt);   // ran ahead (the host slowed down): step the clock back, keeping our orbit around the nearest body
 return Math.max(0,Math.min(tgt-T,3e6))}
function shiftT(nt){ctl();const d=s.dom,r=[s.x-d.x,s.y-d.y,s.z-d.z],v=[s.vx-d.vx,s.vy-d.vy,s.vz-d.vz];T=nt;setRails(T);s.x=d.x+r[0];s.y=d.y+r[1];s.z=d.z+r[2];s.vx=d.vx+v[0];s.vy=d.vy+v[1];s.vz=d.vz+v[2];acc()}
function mpChat(t,sys){MP.chat.push((sys?'<i style="color:#b9a3d6">':'<b>')+esc(t)+(sys?'</i>':'</b>'));if(MP.chat.length>60)MP.chat.shift();const c=$('mpchat');c.innerHTML=MP.chat.join('<br>');c.scrollTop=1e9}
function mpAttach(tx,role){MP.conn=tx;MP.role=role;MP.synced=role==='host';RS=null;mpSend({t:'hello',name:MP.name,rules:RULES,code:typeof ORB_FP!=='undefined'?ORB_FP:'?',phys:typeof ORB_RULES_FP!=='undefined'?ORB_RULES_FP:'?',role,v:1});mpChat('🌐 Connected as '+role+'.',1);
 notify('🌐 Connected! '+(role==='host'?'You host the shared clock: time speed changes apply to both of you.':'Synchronising with the host’s clock…'))}
function rebase(nt){ctl();const d=s.dom,r=[s.x-d.x,s.y-d.y,s.z-d.z],v=[s.vx-d.vx,s.vy-d.vy,s.vz-d.vz];T=nt;setRails(T);s.x=d.x+r[0];s.y=d.y+r[1];s.z=d.z+r[2];s.vx=d.vx+v[0];s.vy=d.vy+v[1];s.vz=d.vz+v[2];
 OBJS.slice().forEach(rmObj);AP=null;PRED=null;PJ=null;acc();ctl()}
function mpSendClock(){mpSend({t:'clock',T,rate:paused?0:WARP[wi],wi,paused,lock:MP.lock})}
function mpRecv(str){let o;try{o=JSON.parse(str)}catch(e){return}if(!o||typeof o!=='object')return;const now=performance.now();
 switch(o.t){
 case'hello':MP.peerName=String(o.name||'friend').slice(0,24);MP.fair=o.rules===RULES&&o.phys===(typeof ORB_RULES_FP!=='undefined'?ORB_RULES_FP:'?');
  if(o.rules===RULES&&!MP.fair)mpChat('⚠ '+MP.peerName+' runs DIFFERENT physics code (physics fingerprint '+o.phys+', yours '+ORB_RULES_FP+'). You can fly and chat together, but weapon hits are switched off: battles need identical rules.',1);
  else if(MP.fair)mpChat('⚔ Fair play: same rules and physics ('+ORB_RULES_FP+(ORB_OFFICIAL.includes(ORB_RULES_FP)?', official ✓':'')+'). Battles are on.',1);if(o.rules!==RULES)mpChat('⚠ '+MP.peerName+' runs DIFFERENT rules (fingerprint '+o.rules+', yours '+RULES+'). Use the same game file, or the physics will disagree.',1);
  else mpChat('✓ '+MP.peerName+' is here, playing by the same rules ('+RULES+').',1);
  if(o.code&&typeof ORB_FP!=='undefined'&&o.code!==ORB_FP)mpChat('ℹ '+MP.peerName+' runs a different build of the game code ('+o.code+', yours '+ORB_FP+'). Same rules, so you can play; visuals or controls may differ.',1);if(MP.role==='host')mpSendClock();break;
 case'clock':if(MP.role!=='guest'||!num(o.T,o.rate))break;if(!MP.synced){MP.synced=true;rebase(o.T);mpChat('⏱ Clock synchronised with the host: '+fT(o.T)+'. Your ship kept its orbit.',1)}
  MP.hT=o.T;MP.hRate=o.rate;MP.hAt=now;wi=o.wi|0;paused=!!o.paused;MP.lock=!!o.lock;break;
 case'req':if(MP.role!=='host')break;if(o.what==='pause')paused=!paused;else if(o.what==='reset'&&!MP.lock){wi=3;paused=false}else if(o.what==='slower')wi=Math.max(0,wi-1);else if(o.what==='faster'&&!MP.lock)wi=Math.min(WARP.length-1,wi+1);
  mpSendClock();mpChat(MP.peerName+' changed time: 1 s = '+dur(WARP[wi])+(paused?' (paused)':''),1);break;
 case'ship':if(num(o.T,o.x,o.y,o.z,o.vx,o.vy,o.vz))onShip(o);break;
 case'hit':if(num(o.E))onHit(o);break;
 case'wreck':if(o.w&&num(o.w.x,o.w.y,o.w.z,o.w.vx,o.w.vy,o.w.vz,o.w.T))addWreck(o.w);break;
 case'wgone':rmWreck(o.id);break;case'loot':onLootReq(o);break;case'lootOK':if(o.cargo)onLootOK(o);break;
 case'flare':if(MP.role==='guest')flare=o.flare;break;
 case'chat':mpChat((o.sys?'':(String(o.from||'?').slice(0,24)+': '))+String(o.text||'').slice(0,300),o.sys);if(!o.sys)notify('💬 '+String(o.from).slice(0,24)+': '+String(o.text).slice(0,200));break;
 case'ping':mpSend({t:'pong',a:o.a});break;case'pong':if(num(o.a))MP.rtt=now-o.a;break}}
function mpTick(){if(!MP.conn)return;const now=performance.now();
 {const sig=wi+'|'+paused+'|'+MP.lock;if(MP.role==='host'&&(now-MP.lastClock>200||sig!==MP.sig)){MP.sig=sig;MP.lastClock=now;mpSendClock()}}   // rate changes are announced immediately
 if(now-MP.lastShip>100){MP.lastShip=now;const g=gam(s),o={t:'ship',T,x:s.x,y:s.y,z:s.z,vx:s.vx/g,vy:s.vy/g,vz:s.vz/g,burn:s.burn,eng:DR[di].id,area:s.area,hull:s.hull,hullMax:hullMax(),alive:s.crew.alive,name:MP.name,act:!s.passive};
  if(now-MP.lastCust>2000){MP.lastCust=now;o.cust={hull:CUST.hull,acc:CUST.acc,shape:CUST.shape,wings:CUST.wings,trim:CUST.trim,glow:CUST.glow,panel:CUST.panel};
   try{const L=ledger(),el={};for(const k in L.elements)el[k]=+(L.elements[k]/L.mass).toFixed(4);o.led={m:Math.round(L.mass),el,tier:sensorTier(),wep:WEP.filter(w=>isU(w.id)).map(w=>w.id),mis:s.ammo.missile}}catch(e){}}mpSend(o)}
 if(now-MP.lastPing>2000){MP.lastPing=now;mpSend({t:'ping',a:now})}
 if(RS&&!RS.stale&&now-RS.seen>10000){RS.stale=true;mpChat('⚠ No data from '+RS.name+' for 10 s.',1)}
 if(MP.role==='host'&&RS&&!RS.stale){const d=Math.hypot(RS.x-s.x,RS.y-s.y,RS.z-s.z);   // fair encounters: close ships fight in real time
  if(d<2e6&&!MP.lock){MP.lock=true;MP.prevWi=wi;wi=0;mpSendClock();const m='⚔ Ships within 2,000 km: time locked to real time for a fair encounter.';mpChat(m,1);mpSend({t:'chat',sys:1,text:m});notify(m)}
  else if(d>3e6&&MP.lock){MP.lock=false;wi=Math.max(wi,MP.prevWi||3);mpSendClock();const m='⏩ Encounter over: time unlocked.';mpChat(m,1);mpSend({t:'chat',sys:1,text:m})}}}
// the other ship is a ballistic "ghost" between updates: the physics carries it along its orbit
function propagate(o,dt){let x=o.x,y=o.y,z=o.z,vx=o.vx,vy=o.vy,vz=o.vz;if(Math.abs(dt)<1e-3)return[x,y,z,vx,vy,vz];const n=Math.min(200,Math.max(1,Math.ceil(Math.abs(dt)/60))),h=dt/n;
 let a=gravAt(x,y,z);for(let k=0;k<n;k++){vx+=a[0]*h/2;vy+=a[1]*h/2;vz+=a[2]*h/2;x+=vx*h;y+=vy*h;z+=vz*h;a=gravAt(x,y,z);vx+=a[0]*h/2;vy+=a[1]*h/2;vz+=a[2]*h/2}return[x,y,z,vx,vy,vz]}
function onShip(o){if(!RS){RS={kind:'player',GM:0,ax:0,ay:0,az:0,r:15,age:0,x:0,y:0,z:0,vx:0,vy:0,vz:0};ALL.push(RS)}const st=propagate(o,T-o.T);
 Object.assign(RS,{x:st[0],y:st[1],z:st[2],vx:st[3],vy:st[4],vz:st[5],burn:+o.burn||0,eng:String(o.eng||''),area:+o.area||10,hull:+o.hull||0,hullMax:+o.hullMax||1,alive:o.alive!==false,act:o.act!==false,name:String(o.name||'friend').slice(0,24),seen:performance.now(),stale:false});if(o.cust)RS.cust=o.cust;if(o.led&&typeof o.led==='object'&&num(o.led.m))RS.led=o.led}
const plState=t=>({x:RS.x+RS.vx*(t-T),y:RS.y+RS.vy*(t-T),z:RS.z+RS.vz*(t-T),vx:RS.vx,vy:RS.vy,vz:RS.vz,r:15});
function flyPl(){if(!RS)return;const D=DR[di],M=mass(),dv=D.f&&s.prop>0?D.ve*Math.log(M/(M-s.prop)):2000;AP={ast:{n:RS.name+'’s ship',r:15,id:-1},pl:true,name:'👤 '+RS.name,stage:'',vcap:Math.max(150,Math.min(3e4,.3*dv))};
 WT={kind:'pl',o:RS};PRED=null;PJ=null;notify('🧭 Autopilot → '+RS.name+', '+fmtD(Math.hypot(RS.x-s.x,RS.y-s.y,RS.z-s.z))+' away. It parks 1.5 km from their ship.')}
// ----- hull, damage, destruction, wrecks, salvage, respawn
function hullMax(){let h=1e8;for(const p of s.parts){const d=PARTS[p.id];if(p.id==='frame_cf')h+=5e7;if(p.id==='frame_ti')h+=3e8;if(d.ad)h+=1.5e8;if(d.whip)h+=5e7}return h}
s.hull=hullMax();
function onHit(o){if(!s.crew.alive)return;if(!MP.fair){if(!MP.unfairNote){MP.unfairNote=1;mpChat('🛡 A hit from '+MP.peerName+' was ignored: your physics fingerprints differ.',1)}return}if(!RS||RS.stale||Math.hypot(RS.x-s.x,RS.y-s.y,RS.z-s.z)>2.1e6)return;   // only accept hits from a ship actually in range
 const E=Math.min(o.E,5e9);s.hull-=E;MP.taken+=E;boom(s.x+(Math.random()-.5)*30,s.y+(Math.random()-.5)*30,s.z+(Math.random()-.5)*30,25);
 if(o.kind==='laser'||o.kind==='beam')beamFx={tx:RS.x,ty:RS.y,tz:RS.z,col:0xff3355,until:performance.now()+140};
 if(Math.random()<E/2e8){const q=s.parts[Math.random()*s.parts.length|0];if(q)q.cond=Math.max(0,q.cond-.1)}if(o.kind==='kinetic'&&Math.random()<.3&&!s.leak)s.leak=1.4e-4;
 if(!MP.hitNote||performance.now()-MP.hitNote>3000){MP.hitNote=performance.now();notify('💥 Hit by '+String(o.from).slice(0,24)+' ('+o.kind+', '+sci(E)+' J): hull '+Math.max(0,Math.round(100*s.hull/hullMax()))+'%')}
 if(s.hull<=0)destroyed(String(o.from).slice(0,24))}
function destroyed(by){const g=gam(s),cargo={res:{},fuel:{}};for(const k in s.res)cargo.res[k]=+(s.res[k]*.5).toFixed(3);for(const k in s.fuel)cargo.fuel[k]=+(s.fuel[k]*.5).toFixed(3);
 const w={id:MP.name+'-'+Math.round(T),owner:MP.name,x:s.x,y:s.y,z:s.z,vx:s.vx/g,vy:s.vy/g,vz:s.vz/g,T,cargo};addWreck(w);mpSend({t:'wreck',w});
 const m='💀 '+MP.name+'’s ship was destroyed by '+by+'. The wreck holds half its cargo.';mpSend({t:'chat',sys:1,text:m});mpChat(m,1);respawn('Your ship was destroyed by '+by+'.')}
function respawn(why){const st=JSON.parse(START_SNAP);s.fuel={...st.fuel};s.res={...st.res};s.parts=st.parts.map(id=>({id,cond:1,fail:false,uid:++UID}));s.area=st.area;s.sailA=0;s.ammo={missile:4};s.jobs=[];s.leak=0;s.co2=0;s.pcond=1;s.burn=0;
 s.crew={hp:100,dose:s.crew.dose,acute:0,alive:true};for(const q in UNL)delete UNL[q];Object.assign(UNL,{chem:1,ion:1,mlaser:1,plaser:1,missile:1});DR.forEach(D=>{D.pw=D.pw0;D.mk=1;D.ve=D.ve0;D.hf=D.hf0;D.cond=1;D.fail=false});di=0;PW=DR[0].pw;PML=5e4;WI=0;
 recalc();s.en=SH.cap;s.hull=hullMax();s.tLo=293;s.tHi=300;const E2=B[3],r=E2.R+4e5,an=Math.random()*6.283,v=Math.sqrt(E2.GM/r);
 s.x=E2.x+r*Math.cos(an);s.y=E2.y+r*Math.sin(an);s.z=0;s.vx=E2.vx-v*Math.sin(an);s.vy=E2.vy+v*Math.cos(an);s.vz=0;AP=null;PRED=null;PJ=null;WT=null;fireHeld=false;shipKey='';acc();ctl();$('go').classList.add('h');
 notify('🚀 '+why+' You start again in low Earth orbit with a starter ship. Your research, research points and codex are kept.')}
function addWreck(w){if(WRECKS.some(q=>q.id===w.id))return;const st=propagate(w,T-w.T),o={kind:'wreck',id:String(w.id),owner:String(w.owner).slice(0,24),cargo:w.cargo,GM:0,ax:0,ay:0,az:0,r:20,x:st[0],y:st[1],z:st[2],vx:st[3],vy:st[4],vz:st[5]};WRECKS.push(o);ALL.push(o)}
function rmWreck(id){const w=WRECKS.find(q=>q.id===id);if(!w)return;WRECKS.splice(WRECKS.indexOf(w),1);const k=ALL.indexOf(w);if(k>=0)ALL.splice(k,1)}
const nearWreck=()=>WRECKS.find(w=>Math.hypot(w.x-s.x,w.y-s.y,w.z-s.z)<5e3);
function salvage(){const w=nearWreck();if(!w){notify('⚙ No wreck within 5 km.');return}if(w.owner===MP.name){takeCargo(w.cargo,w.owner);rmWreck(w.id);mpSend({t:'wgone',id:w.id});return}
 if(!MP.conn){notify('⚠ The wreck’s owner must be online to settle the salvage.');return}mpSend({t:'loot',id:w.id,by:MP.name});notify('⚙ Salvage request sent…')}
function onLootReq(o){const w=WRECKS.find(q=>q.id===o.id);if(!w||w.owner!==MP.name)return;mpSend({t:'lootOK',id:w.id,cargo:w.cargo,owner:w.owner});rmWreck(w.id);mpSend({t:'wgone',id:w.id});mpChat('⚙ '+String(o.by).slice(0,24)+' salvaged your wreck.',1)}
function onLootOK(o){if(!WRECKS.some(w=>w.id===o.id))return;takeCargo(o.cargo,String(o.owner).slice(0,24));rmWreck(o.id)}
function takeCargo(c,owner){let tot=0;for(const k in c.res||{})if(num(c.res[k])){s.res[k]=(s.res[k]||0)+c.res[k];tot+=c.res[k]}for(const k in c.fuel||{})if(num(c.fuel[k])&&k in s.fuel){s.fuel[k]+=c.fuel[k];tot+=c.fuel[k]}
 notify('⚙ Salvaged '+f1(tot,0)+' kg of cargo and fuel from '+owner+'’s wreck.');disc('salvage','First salvage',15,'')}
// ----- rendering the other ship and wrecks
const mpP=new Float32Array(3*24),mpC=new Float32Array(3*24),mpG=new THREE.BufferGeometry();mpG.setAttribute('position',new THREE.BufferAttribute(mpP,3));mpG.setAttribute('color',new THREE.BufferAttribute(mpC,3));
const mpPts=new THREE.Points(mpG,new THREE.PointsMaterial({size:7,sizeAttenuation:false,vertexColors:true}));mpPts.frustumCulled=false;sc.add(mpPts);
const mpLab=[...Array(24)].map(()=>{const d=document.createElement('div');d.className='l';d.style.color='#e9b6ff';d.style.fontWeight='700';$('lb').appendChild(d);return d});
let RSG=null,RSkey='';const WMESH=new Map();
const mpList=()=>[...(RS&&!RS.stale&&RS.alive?[RS]:[]),...WRECKS].slice(0,24);
function mpDraw(fp){const L=mpList();L.forEach((o,k)=>{mpP[k*3]=(o.x-fp.x)/U;mpP[k*3+1]=(o.y-fp.y)/U;mpP[k*3+2]=(o.z-fp.z)/U;const c=o.kind==='player'?[.9,.4,1]:[1,.35,.2];mpC.set(c,k*3)});mpG.setDrawRange(0,L.length);mpG.attributes.position.needsUpdate=true;mpG.attributes.color.needsUpdate=true;
 if(RS&&!RS.stale&&RS.alive){const c=RS.cust||{hull:'#9a6bff',acc:'#ff6ae0'},key=c.hull+c.acc+Math.round(Math.log10(RS.area||10)*10);if(key!==RSkey||!RSG){if(RSG)SS.remove(RSG);RSkey=key;RSG=new THREE.Group();
  RSG.add(part(new THREE.IcosahedronGeometry(4.2,1),new THREE.MeshStandardMaterial({color:c.hull,roughness:.45,metalness:.3,flatShading:true}),c.acc));const W=Math.min(400,Math.sqrt((RS.area||10)/6)),Lw=3*W;
  [1,-1].forEach(sg=>{const pn=new THREE.Mesh(new THREE.BoxGeometry(W,.1,Lw),new THREE.MeshStandardMaterial({color:'#2a55c8',emissive:'#0a2a66'}));pn.position.z=sg*(6.6+Lw/2);RSG.add(pn)});RSG.add(glow(c.acc,16));
  const pl=new THREE.Mesh(new THREE.ConeGeometry(2,10,12,1,true),new THREE.MeshBasicMaterial({color:'#ff9a3d',transparent:true,opacity:.7,blending:THREE.AdditiveBlending,depthWrite:false}));pl.rotation.z=Math.PI/2;pl.position.x=-10;RSG.add(pl);RSG.userData.pl=pl;SS.add(RSG)}
  RSG.visible=true;RSG.position.set(RS.x-s.x,RS.y-s.y,RS.z-s.z);if(RSG.userData.pl)RSG.userData.pl.visible=RS.burn>0}else if(RSG)RSG.visible=false;
 const seen=new Set();WRECKS.forEach(w=>{let m=WMESH.get(w.id);if(!m){m=new THREE.Group();for(let k=0;k<6;k++){const b=new THREE.Mesh(new THREE.BoxGeometry(2+Math.random()*4,1+Math.random()*3,1+Math.random()*5),new THREE.MeshStandardMaterial({color:'#3a3540',emissive:'#331008',flatShading:true}));b.position.set((Math.random()-.5)*16,(Math.random()-.5)*16,(Math.random()-.5)*16);b.rotation.set(Math.random()*3,Math.random()*3,0);m.add(b)}m.add(glow('#ff5a3d',20));WMESH.set(w.id,m);SS.add(m)}
  m.position.set(w.x-s.x,w.y-s.y,w.z-s.z);seen.add(w.id)});for(const[id,m]of WMESH)if(!seen.has(id)){SS.remove(m);WMESH.delete(id)}}
function mpLabels(){const L=mpList();mpLab.forEach((l,k)=>{const o=L[k];if(!o){l.style.display='none';return}v3.set(mpP[k*3],mpP[k*3+1],mpP[k*3+2]).project(cam);let x=v3.x,y=v3.y;const beh=v3.z>1,d=Math.hypot(o.x-s.x,o.y-s.y,o.z-s.z);
 if(!FP&&(beh||v3.z<-1)){l.style.display='none';return}if(FP){if(beh){x=-x;y=-y}const kk=Math.max(Math.abs(x)/.9,y>0?y/.78:-y/.42);if(beh||kk>1){x/=kk;y/=kk}l.className='l mk'}else l.className='l';
 l.style.display='';l.textContent=o.kind==='player'?'👤 '+o.name+' · '+fmtD(d)+' · hull '+Math.round(100*o.hull/o.hullMax)+'%':'☠ wreck of '+o.owner+' · '+fmtD(d);l.style.left=(x+1)/2*innerWidth+'px';l.style.top=(1-y)/2*innerHeight+'px'})}
// ----- connecting: room code via PeerJS (free public matchmaking server), or manual codes with no server at all
function wireConn(c,role){c.on('data',d=>mpRecv(typeof d==='string'?d:JSON.stringify(d)));c.on('close',()=>mpLost());c.on('error',()=>mpLost());mpAttach({send:x=>c.send(x),close:()=>c.close()},role)}
// Matchmaking server: PeerJS's free public broker by default. Run your own (npm i -g peer; peerjs --port 9000) and open
// the game with ?peerhost=your.host&peerport=9000&peerpath=/&peersecure=0 (see docs/MULTIPLAYER.md).
function peerOpts(){const q=new URLSearchParams(location.search),h=q.get('peerhost');if(!h)return{debug:0};
 return{host:h,port:+(q.get('peerport')||443),path:q.get('peerpath')||'/',secure:q.get('peersecure')!=='0',debug:0}}
function hostPeer(){if(typeof Peer==='undefined'){notify('⚠ The PeerJS library did not load (offline or blocked). Use the manual connection instead.');return}const code=Array.from({length:6},()=>'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.random()*32|0]).join('');
 try{MP.peer=new Peer('orbital-'+code,peerOpts());MP.peer.on('open',()=>{MP.code=code;mpChat('🏠 Hosting. Room code: '+code+' (keep this window open).',1)});MP.peer.on('connection',c=>c.on('open',()=>{if(MP.conn){c.close();return}wireConn(c,'host')}));
  MP.peer.on('error',e=>notify('⚠ Connection error: '+(e.type||e)))}catch(e){notify('⚠ '+e.message)}}
function joinPeer(code){code=String(code||'').trim().toUpperCase();if(!code){notify('Type the host’s room code first.');return}if(typeof Peer==='undefined'){notify('⚠ The PeerJS library did not load. Use the manual connection instead.');return}
 try{MP.peer=new Peer(peerOpts());MP.peer.on('open',()=>{const c=MP.peer.connect('orbital-'+code,{reliable:true});c.on('open',()=>wireConn(c,'guest'))});
  MP.peer.on('error',e=>notify('⚠ Could not connect: '+(e.type||e)+(e.type==='peer-unavailable'?' (check the code; the host must keep the game open)':'')))}catch(e){notify('⚠ '+e.message)}}
const ICE={iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun1.l.google.com:19302'}]};
const waitIce=pc=>new Promise(r=>{if(pc.iceGatheringState==='complete')return r();pc.addEventListener('icegatheringstatechange',()=>{if(pc.iceGatheringState==='complete')r()});setTimeout(r,5000)});
const encC=d=>btoa(unescape(encodeURIComponent(JSON.stringify(d)))),decC=t=>JSON.parse(decodeURIComponent(escape(atob(t.trim()))));
function wireDC(dc,role){dc.onopen=()=>mpAttach({send:x=>dc.send(x),close:()=>dc.close()},role);dc.onmessage=e=>mpRecv(e.data);dc.onclose=()=>mpLost()}
async function manHost(){try{const pc=new RTCPeerConnection(ICE);MP.rtc=pc;wireDC(pc.createDataChannel('orbital'),'host');await pc.setLocalDescription(await pc.createOffer());await waitIce(pc);
 $('mpcode').value='ORBITAL-INVITE:'+encC(pc.localDescription);mpChat('📨 Invite created: copy the box and send it to your friend. Then paste their reply into the box and press “3. Finish”.',1)}catch(e){notify('⚠ '+e.message)}}
async function manJoin(){try{const t=$('mpcode').value.replace('ORBITAL-INVITE:','');const pc=new RTCPeerConnection(ICE);MP.rtc=pc;pc.ondatachannel=e=>wireDC(e.channel,'guest');await pc.setRemoteDescription(decC(t));
 await pc.setLocalDescription(await pc.createAnswer());await waitIce(pc);$('mpcode').value='ORBITAL-REPLY:'+encC(pc.localDescription);mpChat('📨 Reply created: copy the box and send it back to the host.',1)}catch(e){notify('⚠ That invite code did not work: '+e.message)}}
async function manFinish(){try{await MP.rtc.setRemoteDescription(decC($('mpcode').value.replace('ORBITAL-REPLY:','')))}catch(e){notify('⚠ That reply code did not work: '+e.message)}}
function mpLost(){if(!MP.conn)return;MP.conn=null;MP.synced=false;MP.lock=false;if(RS)RS.stale=true;mpChat('🌐 Disconnected.',1);notify('🌐 Disconnected from '+(MP.peerName||'your friend')+'. You keep playing solo from here.')}
function mpClose(){const c=MP.conn;try{c&&c.close()}catch(e){}try{MP.peer&&MP.peer.destroy()}catch(e){}try{MP.rtc&&MP.rtc.close()}catch(e){}MP.peer=null;MP.rtc=null;MP.code='';mpLost();MP.role=null}
// ----- multiplayer window
{dyn($('mpst'),()=>(MP.conn?`<b style="color:#5dff8a">● Connected</b> as the <b>${MP.role}</b> with <b>${esc(MP.peerName||'…')}</b> · ping ${Math.round(MP.rtt)} ms${RS?` · their ship ${fmtD(Math.hypot(RS.x-s.x,RS.y-s.y,RS.z-s.z))} away, hull ${Math.round(100*RS.hull/RS.hullMax)}%${RS.stale?' (no signal)':''}`:''}${MP.lock?'<br>⚔ Close encounter: time locked to real time.':''}<br>Damage dealt ${sci(MP.dealt)} J · taken ${sci(MP.taken)} J · your hull ${Math.round(100*s.hull/hullMax())}%`
  :MP.code?`<b style="color:#ffd84d">● Hosting.</b> Give your friend this room code: <b style="font-size:20px;letter-spacing:.15em">${MP.code}</b>`:'<b>● Not connected.</b> One player hosts, the other joins with the room code.')+`<br>Rules fingerprint <b>${RULES}</b> · physics fingerprint <b>${typeof ORB_RULES_FP!=='undefined'?ORB_RULES_FP:'?'}</b>${typeof ORB_OFFICIAL!=='undefined'&&ORB_OFFICIAL.includes(ORB_RULES_FP)?' <b style="color:#5dff8a">✓ official</b>':' (custom physics: battles only with identical builds)'}${MP.conn?(MP.fair?' · <b style="color:#5dff8a">⚔ fair play</b>':' · <b style="color:#ff6a5a">battles off: physics differ</b>'):''}.`);
 const mb=$('mpb');let g=grp(mb,'YOUR PILOT NAME');const ni=document.createElement('input');ni.value=MP.name;ni.style.cssText='background:#060a18;color:#fff;border:1px solid #3a4468;border-radius:6px;padding:6px;font:inherit;width:100%';
 ni.oninput=()=>{MP.name=ni.value.slice(0,20)||'Pilot';try{localStorage.setItem('orbital-name',MP.name)}catch(e){}};g.appendChild(ni);
 g=grp(mb,'CONNECT WITH A ROOM CODE (a free public matchmaking server introduces you; game data then flows directly between your computers)');
 btn(g,()=>MP.code?'Hosting… room code '+MP.code:'🏠 Host a game',()=>hostPeer(),()=>!MP.conn&&!MP.code);const ci=document.createElement('input');ci.placeholder='Friend’s room code';ci.style.cssText=ni.style.cssText+';width:160px;text-transform:uppercase';g.appendChild(ci);
 btn(g,'🔗 Join',()=>joinPeer(ci.value),()=>!MP.conn&&!MP.code);
 g=grp(mb,'OR CONNECT MANUALLY (no server at all): host 1 → friend 2 → host 3');btn(g,'1. Host: create invite code',()=>manHost(),()=>!MP.conn);btn(g,'2. Friend: paste invite, make reply',()=>manJoin(),()=>!MP.conn);btn(g,'3. Host: paste reply, finish',()=>manFinish(),()=>!MP.conn&&!!MP.rtc);
 const mm=$('mpm');g=grp(mm,'TOGETHER');btn(g,()=>RS?'👤 Rendezvous with '+RS.name+' (autopilot)':'👤 Rendezvous (connect first)',()=>flyPl(),()=>!!RS&&!RS.stale);
 btn(g,'🎯 Target their ship',()=>{if(RS)WT={kind:'pl',o:RS}},()=>!!RS&&!RS.stale&&Math.hypot(RS.x-s.x,RS.y-s.y,RS.z-s.z)<2e6);
 btn(g,()=>{const w=nearWreck();return w?'⚙ Salvage '+w.owner+'’s wreck':'⚙ Salvage (fly within 5 km of a wreck)'},()=>salvage(),()=>!!nearWreck());
 btn(g,()=>{const kg=Math.ceil((hullMax()-s.hull)/2e6);return `🛠 Repair hull: ${Math.round(100*s.hull/hullMax())}%${kg>0?' (needs '+kg+' kg iron)':''}`},()=>{const kg=Math.ceil((hullMax()-s.hull)/2e6);if(kg>0)queueJob({type:'hull',mat:{iron:kg},name:'Repair hull',J:kg*2e6,minT:1800})},()=>s.hull<hullMax()-1&&s.res.iron>=Math.ceil((hullMax()-s.hull)/2e6));
 btn(g,'✖ Disconnect',()=>mpClose(),()=>!!MP.conn||!!MP.code);
 $('mpin').onkeydown=e=>{if(e.key==='Enter'&&e.target.value.trim()){const t=e.target.value.trim().slice(0,300);mpSend({t:'chat',from:MP.name,text:t});mpChat(MP.name+': '+t);e.target.value=''}};
 $('mpc').onclick=()=>$('mpw').classList.add('h');$('mpbtn').onclick=()=>$('mpw').classList.toggle('h')}
requestAnimationFrame(frame);
