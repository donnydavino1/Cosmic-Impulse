// ===== SHARED UNIVERSE (client): one persistent solar system with every pilot in it =====
// Connects to server/universe.mjs (protocol ORB-UNI/1, see docs/UNIVERSE.md). While connected the game clock follows
// the server (everyone shares one time, at the server's rate), other pilots appear as ships and sensor contacts,
// asteroid mining is shared (what anyone digs out is gone for everyone), and chat goes to everyone.
const UNI={on:false,ws:null,id:null,objs:new Map(),url:'',sT:0,sAt:0,rate:300,seen:{}};
try{UNI.url=localStorage.getItem('orbital-uni-url')||''}catch(e){}
function uniConnect(url){if(MP.conn){notify('⚠ Leave the two-player game first.');return}if(UNI.ws)UNI.ws.close();url=(url||'').trim();if(!/^wss?:\/\//.test(url))url='ws://'+url;
 UNI.url=url;try{localStorage.setItem('orbital-uni-url',url)}catch(e){}
 try{const ws=new WebSocket(url);UNI.ws=ws;
  ws.onopen=()=>ws.send(JSON.stringify({t:'join',name:MP.name||CUST.name||'pilot',fp:typeof ORB_RULES_FP!=='undefined'?ORB_RULES_FP:'?'}));
  ws.onmessage=e=>{let m;try{m=JSON.parse(e.data)}catch(x){return}uniMsg(m)};
  ws.onclose=()=>{if(UNI.on)notify('🌌 Disconnected from the shared universe.');uniOff()};
  ws.onerror=()=>{if(!UNI.on)notify('⚠ Could not reach a universe server at '+url+'.')}}catch(e){notify('⚠ Could not reach a universe server at '+url+'.')}}
function uniOff(){UNI.on=false;for(const o of UNI.objs.values())rmObj(o);UNI.objs.clear();UNI.ws=null;if(typeof outOff==='function')outOff()}
function uniLeave(){if(UNI.ws)UNI.ws.close();uniOff()}
function uniMsg(m){
 if(m.t==='welcome'){UNI.on=true;UNI.id=m.id;UNI.rate=m.rate;UNI.sT=m.T;UNI.sAt=performance.now();shiftT(m.T);
  for(const k in m.mined){const a=AST[+k];if(a)a.mined=Math.max(a.mined,m.mined[k])}for(const a of AST)UNI.seen[a.id]=a.mined;
  if(typeof outWelcome==='function')outWelcome(m.stations||[]);
  notify('🌌 Joined the shared universe. Time runs at ×'+m.rate+' for everyone.');(m.chat||[]).slice(-5).forEach(c=>notify('💬 '+c.name+': '+c.text))}
 else if(m.t==='ships'){UNI.sT=m.T;UNI.sAt=performance.now();const keep=new Set();
  for(const sh of m.list){keep.add(sh.id);let o=UNI.objs.get(sh.id);const st=sh.s||{};
   if(!o){o={kind:'pilot',pilot:true,alive:true,r:15,x:0,y:0,z:0,vx:0,vy:0,vz:0,ax:0,ay:0,az:0,GM:0,age:0};UNI.objs.set(sh.id,o);OBJS.push(o);ALL.push(o)}
   // their ship is carried along its orbit from the moment they reported it, so it doesn't jump between updates
   const P=isFinite(st.T)&&typeof propagate==='function'?propagate(st,T-st.T):[st.x,st.y,st.z,st.vx,st.vy,st.vz];
   if(st.lay&&typeof laySafe==='function'){const L=laySafe(st.lay),k=L?JSON.stringify(L):'';if(L&&k!==o.layJ){o.lay=L;o.layJ=k;if(typeof objMesh!=='undefined'&&objMesh.has(o)){SS.remove(objMesh.get(o));objMesh.delete(o)}}}
   Object.assign(o,{uid:sh.id,x:P[0],y:P[1],z:P[2],vx:P[3],vy:P[4],vz:P[5],name:sh.name,fp:sh.fp,hull:st.hull,cust:st.cust||{}})}
  for(const[id,o]of UNI.objs)if(!keep.has(id)){rmObj(o);UNI.objs.delete(id)}}
 else if(m.t==='joined')notify('🌌 '+m.name+' joined the universe'+(typeof ORB_RULES_FP!=='undefined'&&m.fp!==ORB_RULES_FP?' (different rules)':'')+'.');
 else if(m.t==='left')notify('🌌 '+m.name+' left the universe.');
 else if(m.t==='mined'){const a=AST[m.ast];if(a){a.mined=Math.max(a.mined,m.total);UNI.seen[a.id]=a.mined}}
 else if(m.t==='say')notify('💬 '+m.name+': '+m.text);
 else if(m.t==='hit')uniHit(m);
 else if(typeof outMsg==='function')outMsg(m)}
// pilot versus pilot: your hit goes to the server, which checks both ships are within 2,100 km and passes it on;
// a hit you receive only counts if the shooter runs the same rules (fingerprint) and is really that close to you
function uniFire(o,E,kind){if(!UNI.on||!o.uid)return;UNI.ws.send(JSON.stringify({t:'hit',to:o.uid,E,kind}));UNI.dealt=(UNI.dealt||0)+E}
function uniHit(m){if(!s.crew.alive)return;const o=UNI.objs.get(m.from),fair=typeof ORB_RULES_FP==='undefined'||m.fp===ORB_RULES_FP;
 if(!fair){if(!UNI.unfair){UNI.unfair=1;notify('🛡 A hit from '+m.name+' was ignored: your physics fingerprints differ.')}return}
 if(!o||Math.hypot(o.x-s.x,o.y-s.y,o.z-s.z)>2.1e6)return;
 const now=performance.now();if(!UNI.warnAt||now-UNI.warnAt>8000){UNI.warnAt=now;notify('⚔ '+m.name+' is firing at you!')}
 if(m.kind==='laser'||m.kind==='beam')beamFx={tx:o.x,ty:o.y,tz:o.z,col:0xff3355,until:now+140};takeHit(Math.min(+m.E||0,5e9),m.kind,null)}
function uniRem(now){const tgt=UNI.sT+UNI.rate*(now-UNI.sAt)/1000;if(T-tgt>2)shiftT(tgt);return Math.max(0,Math.min(tgt-T,3e6))}
function uniSay(text){if(UNI.on&&text.trim())UNI.ws.send(JSON.stringify({t:'say',text:text.trim()}))}
setInterval(()=>{if(!UNI.on||!UNI.ws||UNI.ws.readyState!==1)return;const g=gam(s);
 UNI.ws.send(JSON.stringify({t:'st',s:{T,x:s.x,y:s.y,z:s.z,vx:s.vx/g,vy:s.vy/g,vz:s.vz/g,hull:s.hull/hullMax(),cust:{hull:CUST.hull,acc:CUST.acc},...(performance.now()-(UNI.layAt||0)>1e4&&typeof shipLay==='function'?(UNI.layAt=performance.now(),{lay:shipLay()}):{})}}));
 for(const a of AST){const prev=UNI.seen[a.id]??a.mined;if(a.mined>prev+.01)UNI.ws.send(JSON.stringify({t:'mine',ast:a.id,kg:a.mined-prev}));UNI.seen[a.id]=a.mined}},500);
// in the 🌐 Multiplayer window
{const card=document.querySelector('#mpw .card'),box=document.createElement('div');box.id='unibox';
 box.innerHTML='<h4>🌌 SHARED UNIVERSE</h4><p class="opsn">One persistent solar system for everyone, on a server anyone can run (docs/UNIVERSE.md). Time runs at the server\'s rate for all pilots.</p><p><input id="uniurl" placeholder="ws://localhost:8080"> <button id="unigo">🌌 Connect</button> <button id="unioff">Leave</button></p><p><input id="unisay" placeholder="Say something to everyone…"> <button id="unisend">💬 Send</button></p><div id="unist" class="opsn"></div>';
 if(card){const cl=[...card.children].filter(e=>e.tagName==='BUTTON').pop();if(cl)card.insertBefore(box,cl);else card.appendChild(box)}
 $('uniurl').value=UNI.url;$('unigo').onclick=()=>uniConnect($('uniurl').value);$('unioff').onclick=uniLeave;
 const say=()=>{uniSay($('unisay').value);$('unisay').value=''};$('unisend').onclick=say;$('unisay').addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter')say()});$('uniurl').addEventListener('keydown',e=>e.stopPropagation());
 ORB.on('ui',()=>{const st=$('unist');if(st)st.textContent=UNI.on?tr('Connected')+' · '+UNI.objs.size+' '+tr('other pilots')+' · ×'+UNI.rate:''})}
