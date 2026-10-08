// ===== HARDPOINTS: move, turn and resize parts on the outside of your ship =====
// Any 3D part a module tags with userData.mount = 'name' becomes a hardpoint (today: the sensor antenna and every
// weapon turret). Offsets are stored in CUST.mounts = {name: {p:[dx,dy,dz] metres, r: degrees about the ship axis, s: scale}},
// saved with your style and shared with it (ORB-SHIP/1 in docs/PROTOCOL.md). Edit them in 🎨 Customize → HARDPOINTS.
if(!CUST.mounts||typeof CUST.mounts!=='object')CUST.mounts={};
let HP_LIST=[],HP_SEL=null;
ORB.keyParts.push(()=>JSON.stringify(CUST.mounts));
ORB.keyParts.push(()=>s.parts.map(p=>(p.mk||1)+''+(p.cond<.6?Math.round(p.cond*4):'')).join('')+JSON.stringify(s.lay&&s.lay.rad||{}));
ORB.on('ship:build',({g})=>{HP_LIST=[];for(const o of g.children){const n=o.userData&&o.userData.mount;if(!n)continue;HP_LIST.push(n);const m=CUST.mounts[n];if(!m)continue;
 const p=m.p||[0,0,0];o.position.x+=p[0]||0;o.position.y+=p[1]||0;o.position.z+=p[2]||0;if(m.r)o.rotation.x+=m.r*Math.PI/180;if(m.s>0){o.scale.multiplyScalar?o.scale.multiplyScalar(m.s):o.scale.set(m.s,m.s,m.s)}}
 if(HP_SEL&&!HP_LIST.includes(HP_SEL))HP_SEL=null});
function hpNudge(k,v){if(!HP_SEL){notify('Pick a hardpoint first.');return}const m=CUST.mounts[HP_SEL]=CUST.mounts[HP_SEL]||{p:[0,0,0],r:0,s:1};m.p=m.p||[0,0,0];
 if(k<3)m.p[k]=Math.round((m.p[k]+v)*10)/10;else if(k===3)m.r=((m.r||0)+v)%360;else m.s=Math.max(.3,Math.min(3,Math.round(((m.s||1)*v)*100)/100));saveC();if(!SV&&!FP)toggleSV()}
{const c=$('custbody'),d=document.createElement('div');d.className='sec';d.innerHTML='<h4>HARDPOINTS (move parts on your hull; opens the ship view)</h4>';c.appendChild(d);
 const pick=document.createElement('div');d.appendChild(pick);let last='';
 ORB.on('ui',()=>{const k=HP_LIST.join(',')+'|'+HP_SEL;if(k===last||!$('cust')||$('cust').classList.contains('h'))return;last=k;pick.innerHTML='';
  if(!HP_LIST.length){pick.textContent='Open the ship view (G) once to list your hardpoints.';return}
  HP_LIST.forEach(n=>btn(pick,(HP_SEL===n?'● ':'○ ')+n.replace('weapon:','🔫 ').replace('antenna','📡 antenna'),()=>{HP_SEL=n;last='';if(!SV&&!FP)toggleSV()}))});
 const row=document.createElement('div');d.appendChild(row);
 [['◀ x',0,-.5],['x ▶',0,.5],['▼ y',1,-.5],['y ▲',1,.5],['⤓ z',2,-.5],['z ⤒',2,.5],['⟲ 15°',3,-15],['⟳ 15°',3,15],['− size',4,1/1.15],['+ size',4,1.15]].forEach(([l,k,v])=>btn(row,l,()=>hpNudge(k,v)));
 btn(row,'↺ Reset this part',()=>{if(HP_SEL){delete CUST.mounts[HP_SEL];saveC()}});btn(row,'↺ Reset all',()=>{CUST.mounts={};saveC()})}
