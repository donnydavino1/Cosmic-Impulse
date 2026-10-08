// ===== OPERATIONS WINDOW (client): mining drones and science probes, key 8 (phone: ☰ → Ship) =====
// Reads and calls the rules in 1760-ops.js (droneBuild/Deploy/Recall/Status, probeBuild/Plan/Launch, s.ops).
// Static labels are separate text nodes so the language system can translate them; run-time sentences use the
// {} patterns in game/i18n/*.json.
const OPSW=document.createElement('div');OPSW.id='opsw';OPSW.className='h';
OPSW.innerHTML='<div class="card"><h2>🛸 Operations</h2><div id="opsb"></div><button id="opsc">Close (8)</button></div>';document.body.appendChild(OPSW);
$('opsc').onclick=()=>OPSW.classList.add('h');
let opsLast=0;function opsToggle(){OPSW.classList.toggle('h');opsDraw(true)}
const OPS_PH={out:'flying out',mine:'digging',back:'flying back',charge:'recharging from your battery'};
const opsCost=(m,J)=>Object.entries(m).map(([k,v])=>`${f1(v,v<1?1:0)} kg ${k}`).join(', ')+' · '+sci(J)+' J';
function opsDraw(force){if(OPSW.classList.contains('h'))return;const now=performance.now();if(!force&&now-opsLast<700)return;opsLast=now;const o=s.ops,b=$('opsb'),st=droneStatus(),a=droneTarget(),ad=a?astDist(a):Infinity;
 let h='<h4>⛏ MINING DRONES</h4>';
 if(!s.tech.t_robo)h+='<p class="opsn"><span>Needs research:</span> <b>Autonomous robotics</b> <span>(🛠 → 🔬 Research).</span></p>';
 else{h+=`<p><span>Docked:</span> <b>${o.drones}</b> · <span>Ore brought back:</span> <b>${f1(o.haul,0)} kg</b></p>`;
  if(st)h+=`<div class="ctr"><b>${st.n} × ⛏ → ${st.ast}</b><div class="cbar"><i style="width:${Math.round(100*Math.min(1,st.cargo/(st.n*OPS.droneCargo)))}%"></i></div><small><span>${OPS_PH[st.ph]}</span> · ${st.ph==='charge'?sci(st.n*OPS.droneCargo*OPS.droneJkg)+' J':dur(st.left)} · ${f1(st.cargo,0)} kg · ${fmtD(st.d)}${st.recall?' · <span>returning to dock</span>':''}</small> <button data-op="recall" ${st.recall?'disabled':''}>Recall</button></div>`;
  h+=`<p><button data-op="d1">Build 1 drone</button> <button data-op="d3">Build 3 drones</button> <small>${opsCost(OPS.droneMat,OPS.droneJ)} <span>each</span></small></p>`;
  h+=`<p><button data-op="deploy" ${!o.drones||st||ad>OPS.droneRange?'disabled':''}>Deploy drones</button> <small>${a?`→ ${a.n} (${a.t}) · ${fmtD(ad)}`:''}${ad>OPS.droneRange?' · <span>get within 50 km of an asteroid first</span>':''}</small></p>`;
  h+='<p class="opsn">Each drone carries 50 kg per trip and digs 18 kg per hour; ore arrives in proportion to what the asteroid is made of. Stay within 30 km while they work: beyond 100 km they cannot catch up.</p>'}
 if(s.tech.t_robo){const dmg=s.parts.filter(q=>q.cond<1||q.fail).sort((a,b)=>a.cond-b.cond)[0];
  h+=`<h4>🔧 REPAIR DRONES</h4><p><span>Docked:</span> <b>${o.rep||0}</b> · <span>Spare-parts kits:</span> <b>${f1(s.res.spares,1)}</b> · ${dmg?`<span>working on</span> ${PARTS[dmg.id].n} (${Math.round(dmg.cond*100)} %)`:'<span>everything is in good condition</span>'}</p>
  <p><button data-op="r1">Build 1 repair drone</button> <small>${opsCost(REP.mat,REP.J)}</small></p><p class="opsn">Each repair drone fixes the most damaged part by 10 % of its condition per hour, using spare-parts kits. Parts above 60 % work again.</p>`}
 h+='<h4>🛰 SCIENCE PROBES</h4>';
 if(!s.tech.t_probe)h+='<p class="opsn"><span>Needs research:</span> <b>Deep-space probes</b> <span>(🛠 → 🔬 Research).</span></p>';
 else{h+=`<p><span>In storage:</span> <b>${o.probes}</b> · <span>Xenon in your tank:</span> <b>${f1(s.fuel.xe,1)} kg</b> · <button data-op="p1">Build 1 probe</button> <small>${opsCost(OPS.probeMat,OPS.probeJ)}</small></p>`;
  h+='<div class="opst"><table><tr><th>Destination</th><th>Δv</th><th>Xenon</th><th>Trip</th><th>Science</th><th></th></tr>'+OPS.TGT.map(n=>{const p=probePlan(n),busy=o.flights.some(f=>f.to===n&&f.rx==null);
   return`<tr><td>${n}${o.sci[n]?' ✓':''}</td><td>${f1(p.dv/1e3,1)} km/s</td><td class="${p.reach?(s.fuel.xe>=p.xe?'':'opsw-no'):'opsw-no'}">${p.reach?f1(p.xe,1)+' kg':'> 40 kg'}</td><td>${dur(p.t)}</td><td>${Math.round(p.rp)} RP</td><td><button data-pr="${n}" ${p.ok&&!busy?'':'disabled'}>Launch</button></td></tr>`}).join('')+'</table></div>';
  h+='<p class="opsn">A probe has 90 kg of instruments and takes up to 40 kg of xenon from your tank for its own Δv. Far worlds and the Sun need a launch from closer in. First data from a world is worth the most.</p>';
  if(o.flights.length)h+='<h4>IN FLIGHT</h4>'+o.flights.map(f=>`<div class="ctr"><b>🛰 → ${f.to}</b><div class="cbar"><i style="width:${Math.round(100*Math.min(1,(T-f.t0)/Math.max(1,(f.rx||f.arr)-f.t0)))}%"></i></div><small>${f.rx==null?`<span>arrives in</span> ${dur(f.arr-T)}`:`<span>data arrives in</span> ${dur(f.rx-T)}`}</small></div>`).join('');
  const got=Object.entries(o.sci);if(got.length)h+=`<p><span>Worlds studied:</span> ${got.map(([k,v])=>k+(v>1?' ×'+v:'')).join(', ')}</p>`}
 if(b._h!==h){b._h=h;b.innerHTML=h}}
// one click handler on the container survives the periodic redraws
$('opsb').addEventListener('click',e=>{const x=e.target.closest('button');if(!x||x.disabled)return;
 if(x.dataset.op){const op=x.dataset.op;
   if(op==='d1'||op==='d3'){if(!droneBuild(op==='d1'?1:3))notify('⚠ Missing materials: '+opsCost(OPS.droneMat,OPS.droneJ))}
   else if(op==='r1'){if(!rdroneBuild(1))notify('⚠ Missing materials: '+opsCost(REP.mat,REP.J))}
   else if(op==='p1'){if(!probeBuild(1))notify('⚠ Missing materials: '+opsCost(OPS.probeMat,OPS.probeJ))}
   else if(op==='deploy'){const r=droneDeploy();if(r==='ok'){const f=s.ops.fleet;notify(`⛏ ${f.n} mining drones are on their way to ${AST[f.ast].n}.`)}else if(r==='far')notify('⚠ Get within 50 km of an asteroid first (🧭 NAVIGATE → Asteroids).')}
   else if(op==='recall'){droneRecall();notify('⛏ Mining drones recalled: they bring back what they have dug.')}}
 else if(x.dataset.pr){const n=x.dataset.pr,r=probeLaunch(n);
   if(r==='ok'){const f=s.ops.flights[s.ops.flights.length-1];notify(`🛰 Probe launched to ${n}. Arrival in ${dur(f.arr-T)}.`)}
   else if(r==='xe')notify('⚠ Not enough xenon in your tank for this trip (buy or make it in 🛠 → Fuel).');else if(r==='dv')notify('⚠ Too far for one probe from here: launch from closer to the target.')}
 opsDraw(true)});
ORB.on('ui',()=>{try{opsDraw()}catch(e){console.warn('ops ui',e)}});
