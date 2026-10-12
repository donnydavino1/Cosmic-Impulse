// ===== OUTPOSTS (client): persistent stations in the shared universe =====
// Any pilot can turn 4 tonnes of materials into an outpost on their current orbit. It stays in the universe for
// everyone, even when its builder is offline: dock within 5 km (slower than 50 m/s) to leave supplies there or collect
// them. The server keeps what each outpost holds, so supplies are never duplicated; the materials you leave or take
// leave or join your ship exactly (Law 3). Protocol: docs/UNIVERSE.md (build, deposit, take, open, scrap, station).
const OUT={list:new Map(),rq:1,pend:{},amt:100,drawAt:0,building:null};
const OUT_CORE={iron:2000,silicates:1500,nickel:300,carbon:200,platinum:.5};
const OUT_KEYS=['iron','nickel','silicates','carbon','water','platinum','oxygen','food','spares','patch','chem','xe','h2','fus','am'];
const OUT_DOCK={d:5000,v:50};
const outFuel=k=>k in FUEL&&k in s.fuel;
const outHave=k=>outFuel(k)?s.fuel[k]||0:s.res[k]||0;
const outAdd=(k,v)=>{if(outFuel(k))s.fuel[k]=Math.max(0,(s.fuel[k]||0)+v);else s.res[k]=Math.max(0,(s.res[k]||0)+v)};
const outName=k=>outFuel(k)?FUEL[k].n:k==='spares'?'spare-parts kits':k==='patch'?'hull patch kits':k==='oxygen'||k==='food'?k:RN[k]||k;
function outBody(st){return B.find(b=>b.n===st.body)||B[0]}
// bodies sit at time T+TDT (inside a physics step they have already moved on; outside one TDT is 0)
function outState(st,t){const b=outBody(st),k=t-T-TDT,P=kepProp(b.GM,st.rel.slice(0,3),st.rel.slice(3),t-st.T0);
 return{x:b.x+b.vx*k+P[0],y:b.y+b.vy*k+P[1],z:b.z+b.vz*k+P[2],vx:b.vx+P[3],vy:b.vy+P[4],vz:b.vz+P[5],r:30}}
function outAddSt(st){let e=OUT.list.get(st.id);if(!e){const o={kind:'station',station:true,rail:true,alive:true,r:30,GM:0,ax:0,ay:0,az:0,age:0,x:0,y:0,z:0,vx:0,vy:0,vz:0};
  e={st,o};OUT.list.set(st.id,e);OBJS.push(o);ALL.push(o)}e.st=st;Object.assign(e.o,{name:st.name,owner:st.owner,sid:st.id});outPlace(e)}
function outPlace(e){const p=outState(e.st,T);Object.assign(e.o,{x:p.x,y:p.y,z:p.z,vx:p.vx,vy:p.vy,vz:p.vz})}
function outOff(){for(const e of OUT.list.values())rmObj(e.o);OUT.list.clear();OUT.pend={}}
function outWelcome(list){outOff();for(const st of list)outAddSt(st)}
function outMine(st){return st.owner===(MP.name||CUST.name||'pilot')}
function outRel(e){const g=gam(s),o=outState(e.st,T);return{d:Math.hypot(o.x-s.x,o.y-s.y,o.z-s.z),v:Math.hypot(o.vx-s.vx/g,o.vy-s.vy/g,o.vz-s.vz/g)}}
const outDocked=e=>{const r=outRel(e);return r.d<OUT_DOCK.d&&r.v<OUT_DOCK.v};
function outSend(o){if(UNI.on&&UNI.ws&&UNI.ws.readyState===1){UNI.ws.send(JSON.stringify(o));return true}notify('⚠ Connect to a shared universe first (🌐 Multiplayer).');return false}
function outMsg(m){
 if(m.t==='station'){if(m.gone){const e=OUT.list.get(m.id);if(e){rmObj(e.o);OUT.list.delete(m.id);if(WT&&WT.o===e.o)WT=null}}else if(m.st)outAddSt(m.st);OUT.drawAt=0}
 else if(m.t==='built'){OUT.building=null;notify('🛰 Outpost built: it now orbits '+(s.dom.n)+' for every pilot in the universe.')}
 else if(m.t==='stored'){const p=OUT.pend[m.rq];if(p){const got=(m.res||{})[p.k]||0;if(p.kg-got>1e-9)outAdd(p.k,p.kg-got);delete OUT.pend[m.rq];recalc()}}
 else if(m.t==='took'){for(const k in m.res||{})if(OUT_KEYS.includes(k)&&isFinite(m.res[k]))outAdd(k,+m.res[k]);recalc();if(m.scrap)notify('♻ Outpost dismantled: its materials and everything stored in it are back aboard.')}
 else if(m.t==='denied'){if(m.why==='limit'&&OUT.building){for(const k in OUT_CORE)outAdd(k,OUT_CORE[k]);OUT.building=null;notify('⚠ You already have the most outposts this universe allows ({}).'.replace('{}',m.max))}
  else if(m.why==='private')notify('🔒 That outpost is private: only its owner can take supplies (anyone can leave them).');
  else if(OUT.building){for(const k in OUT_CORE)outAdd(k,OUT_CORE[k]);OUT.building=null;notify('⚠ The server refused the outpost.')}}}
// build: the outpost starts on exactly your orbit; it must be a closed orbit clear of the surface
function outBuild(name){if(!UNI.on){notify('⚠ Connect to a shared universe first (🌐 Multiplayer).');return}
 const miss=Object.keys(OUT_CORE).filter(k=>(s.res[k]||0)<OUT_CORE[k]);if(miss.length){notify('⚠ An outpost needs '+Object.entries(OUT_CORE).map(([k,v])=>f1(v,1)+' kg '+RN[k]).join(', ')+'. Short of: '+miss.map(k=>RN[k]).join(', ')+'.');return}
 const d=s.dom,g=gam(s),rel=[s.x-d.x,s.y-d.y,s.z-d.z,s.vx/g-d.vx,s.vy/g-d.vy,s.vz/g-d.vz],r=Math.hypot(rel[0],rel[1],rel[2]),v2=rel[3]**2+rel[4]**2+rel[5]**2,a=1/(2/r-v2/d.GM);
 const hx=rel[1]*rel[5]-rel[2]*rel[4],hy=rel[2]*rel[3]-rel[0]*rel[5],hz=rel[0]*rel[4]-rel[1]*rel[3],h2=hx*hx+hy*hy+hz*hz,e=Math.sqrt(Math.max(0,1-h2/(d.GM*a))),peri=a*(1-e);
 if(!(a>0)||peri<d.R*1.01){notify('⚠ An outpost needs a closed orbit that stays clear of '+d.n+'\'s surface.');return}
 for(const k in OUT_CORE)outAdd(k,-OUT_CORE[k]);OUT.building=true;recalc();
 outSend({t:'build',name:(name||'').trim()||(MP.name||CUST.name||'pilot')+'’s outpost',body:d.n,rel,T})}
function outMove(e,k,dir){if(!outDocked(e)){notify('⚠ Dock first: get within 5 km of the outpost and match its speed (under 50 m/s).');return}
 const kg=Math.max(0,+OUT.amt||0);if(!kg)return;const rq=OUT.rq++;
 if(dir>0){const put=Math.min(kg,outHave(k));if(put<=0){notify('⚠ You have no '+outName(k)+' to leave.');return}outAdd(k,-put);OUT.pend[rq]={k,kg:put};recalc();outSend({t:'deposit',id:e.st.id,res:{[k]:put},rq})}
 else outSend({t:'take',id:e.st.id,res:{[k]:kg},rq})}
function outFly(e){const D=DR[di],M=mass(),dv=D.f&&s.prop>0?D.ve*Math.log(M/(M-s.prop)):2000;
 AP={ast:{n:e.st.name,r:30,id:-2},pl:true,fn:t=>outState(e.st,t),rel:(t,body)=>body===outBody(e.st)?kepProp(body.GM,e.st.rel.slice(0,3),e.st.rel.slice(3),t-e.st.T0):null,name:'🛰 '+e.st.name,stage:'',vcap:40};WT=null;PRED=null;
 notify('🧭 Autopilot → '+e.st.name+', '+fmtD(outRel(e).d)+' away. It parks 1.5 km from the outpost.')}
ORB.on('frame',()=>{for(const e of OUT.list.values())outPlace(e)});
// ---------- the 3D outpost: a hub, a slowly turning habitat ring on spokes, two solar wings, radiators and a docking port
function mkStation(o){const g=new THREE.Group(),M=(c,me,ro)=>new THREE.MeshStandardMaterial({color:c,metalness:me,roughness:ro}),hull=M('#cfd3d8',.35,.45),dark=M('#3b4048',.6,.4);
 const cell=cnv(128,x=>{x.fillStyle='#0d1a3c';x.fillRect(0,0,128,128);x.strokeStyle='#5a6a8c';x.lineWidth=2;for(let i=0;i<=128;i+=16){x.beginPath();x.moveTo(i,0);x.lineTo(i,128);x.stroke();x.beginPath();x.moveTo(0,i);x.lineTo(128,i);x.stroke()}
  x.fillStyle='rgba(120,150,220,.18)';for(let i=0;i<128;i+=16)for(let j=0;j<128;j+=16)if((i+j)%32===0)x.fillRect(i+2,j+2,12,12)});
 const ct=new THREE.CanvasTexture(cell);ct.wrapS=ct.wrapT=THREE.RepeatWrapping;if(ct.repeat&&ct.repeat.set)ct.repeat.set(2,6);
 const solar=new THREE.MeshStandardMaterial({map:ct,color:'#ffffff',metalness:.5,roughness:.3});
 const hub=new THREE.Mesh(new THREE.CylinderGeometry(2.6,2.6,16,24),hull);hub.rotation.z=Math.PI/2;g.add(hub);
 const ring=new THREE.Group(),tor=new THREE.Mesh(new THREE.TorusGeometry(11,1.7,14,48),hull);tor.rotation.y=Math.PI/2;ring.add(tor);
 for(let k=0;k<4;k++){const sp=new THREE.Mesh(new THREE.CylinderGeometry(.45,.45,11,8),dark),a=k*Math.PI/2;sp.position.set(0,Math.cos(a)*5.5,Math.sin(a)*5.5);sp.rotation.x=a;ring.add(sp)}
 g.add(ring);g.userData.ring=ring;
 [1,-1].forEach(sg=>{const mast=new THREE.Mesh(new THREE.BoxGeometry(.5,.5,8),dark);mast.position.set(-5,0,sg*16);g.add(mast);
  for(const off of[-2.4,2.4]){const w=new THREE.Mesh(new THREE.BoxGeometry(4.2,.08,13),solar);w.position.set(-5+off,0,sg*26);g.add(w)}
  const rad=new THREE.Mesh(new THREE.BoxGeometry(6,.06,3.4),M('#eef0f2',.1,.7));rad.position.set(4.5,sg*4.2,0);rad.rotation.x=Math.PI/2;g.add(rad)});
 const port=new THREE.Mesh(new THREE.CylinderGeometry(1.3,1.6,2.4,16),dark);port.rotation.z=Math.PI/2;port.position.x=9.2;g.add(port);
 const red=glow('#ff3344',4),grn=glow('#44ff88',4);red.position.set(10.5,0,1.4);grn.position.set(10.5,0,-1.4);g.add(red);g.add(grn);g.userData.lights=[red,grn];return g}
ORB.on('frame',now=>{if(typeof objMesh==='undefined')return;for(const e of OUT.list.values()){const m=objMesh.get(e.o);if(!m||!m.userData)continue;if(m.userData.ring&&m.userData.ring.rotation)m.userData.ring.rotation.x=now/9000;
 if(m.userData.lights)m.userData.lights.forEach((l,i)=>{l.visible=Math.floor(now/700+i)%2===0})}});
// ---------- the outposts panel, inside 🌐 Multiplayer → SHARED UNIVERSE
{const box=$('unibox');if(box){const d=document.createElement('div');d.id='outbox';box.appendChild(d);
 d.addEventListener('pointerdown',ev=>{const b=ev.target.closest('button');if(!b)return;const e=OUT.list.get(b.dataset.id),a=b.dataset.o;
  if(a==='build')outBuild(($('outname')||{}).value);else if(!e)return;else if(a==='fly'){$('mpw').classList.add('h');outFly(e)}
  else if(a==='tgt'){WT={kind:'st',o:e.o}}else if(a==='open')outSend({t:'open',id:e.st.id,open:!e.st.open})
  else if(a==='scrap'){if(!outDocked(e)){notify('⚠ Dock first: get within 5 km of the outpost and match its speed (under 50 m/s).');return}outSend({t:'scrap',id:e.st.id})}
  else if(a==='put')outMove(e,b.dataset.k,1);else if(a==='take')outMove(e,b.dataset.k,-1);OUT.drawAt=0},true);
 d.addEventListener('keydown',ev=>ev.stopPropagation());
 d.addEventListener('input',ev=>{if(ev.target.id==='outamt')OUT.amt=+ev.target.value});}}
function outDraw(){const d=$('outbox');if(!d||$('mpw').classList.contains('h'))return;const now=performance.now();if(now-OUT.drawAt<700)return;
 if(d.contains(document.activeElement)&&document.activeElement.tagName==='INPUT')return;OUT.drawAt=now;
 if(!UNI.on){d.innerHTML='';return}
 let h=`<h4>🛰 OUTPOSTS</h4><p class="opsn">Build an outpost on your current orbit from ${Object.entries(OUT_CORE).map(([k,v])=>f1(v,1)+' kg '+tr(RN[k])).join(', ')}. It stays in the universe for every pilot: dock within 5 km, slower than 50 m/s, to leave or collect supplies.</p>
 <p><input id="outname" placeholder="Outpost name" maxlength="32"> <button data-o="build">🏗 Build an outpost here</button></p>`;
 const L=[...OUT.list.values()].map(e=>({e,r:outRel(e)})).sort((a,b)=>a.r.d-b.r.d);
 if(!L.length)h+='<p class="opsn">No outposts in this universe yet.</p>';
 for(const{e,r}of L){const st=e.st,mine=outMine(st),dk=r.d<OUT_DOCK.d&&r.v<OUT_DOCK.v,held=Object.values(st.store).reduce((a,b)=>a+b,0);
  h+=`<div class="navr outr"><b>🛰 ${st.name.replace(/</g,'&lt;')}</b> <small>${tr('owner')}: ${st.owner.replace(/</g,'&lt;')} · ${tr(st.body)} · ${fmtD(r.d)} · ${st.open?'🔓 '+tr('public'):'🔒 '+tr('private')} · ${f1(held,0)} kg ${tr('stored')}</small>
   ${dk?'<b class="outdk">⚓ '+tr('Docked')+'</b>':`<button data-o="fly" data-id="${st.id}">🧭 Fly here</button>`} <button data-o="tgt" data-id="${st.id}">🎯 Target</button>
   ${mine?`<button data-o="open" data-id="${st.id}">${st.open?'🔒 Make private':'🔓 Make public'}</button>`:''}${mine&&dk?` <button data-o="scrap" data-id="${st.id}">♻ Dismantle</button>`:''}</div>`;
  if(dk){h+=`<p><span>Amount</span> <input id="outamt" type="number" min="1" step="10" value="${OUT.amt}" style="width:90px"> kg</p><table class="bldt outt"><tr><th></th><th>${tr('Aboard')}</th><th>${tr('In the outpost')}</th><th></th></tr>`;
   for(const k of OUT_KEYS){const have=outHave(k),inn=st.store[k]||0;if(have<.001&&inn<.001)continue;
    h+=`<tr><td>${tr(outName(k))}</td><td>${f1(have,have<10?2:0)} kg</td><td>${f1(inn,inn<10?2:0)} kg</td><td><button data-o="put" data-k="${k}" data-id="${st.id}">⬇ Leave</button> <button data-o="take" data-k="${k}" data-id="${st.id}">⬆ Take</button></td></tr>`}
   h+='</table>'}}
 d.innerHTML=h}
ORB.on('ui',outDraw);
