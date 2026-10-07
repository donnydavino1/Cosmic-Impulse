// ===== SHIP STYLE: looks that grow with your upgrades, plus styles you can save, share and load =====
// Upgrades show on the hull automatically: the sensor tier picks the antenna (whip → dish → phased panel → lidar dome →
// interferometer booms), and every 7 technologies adds a glowing rank ring. Players layer their own style on top:
// colours, shape, wings, panels, trim pattern, glow strength. A whole style is one small JSON object (see docs/MODDING.md).
Object.assign(CUST,Object.assign({trim:'rings',glow:.6,dish:'auto'},CUST));
const STYLE_KEYS=['name','hull','acc','shape','wings','panel','trim','glow','dish','art','scenery','mounts','vis'];
const STYLE_PRESETS={
 'Pathfinder (realistic)':{hull:'#d9dcdf',acc:'#b8892e',shape:'modular',wings:2,panel:'classic',trim:'none',glow:.2},
 'Sunchaser (stock)':{hull:'#e8409f',acc:'#38f2ff',shape:'sphere',wings:2,panel:'holo',trim:'rings',glow:.6},
 'Blue Lancer':{hull:'#2f6fe0',acc:'#ffb347',shape:'capsule',wings:4,panel:'holo',trim:'stripes',glow:.7},
 'Corsair':{hull:'#26222e',acc:'#ff3344',shape:'capsule',wings:2,panel:'classic',trim:'chevrons',glow:.9},
 'Solar Monk':{hull:'#f2c14e',acc:'#fff2c8',shape:'ring',wings:4,panel:'classic',trim:'rings',glow:.4},
 'Ice Hauler':{hull:'#cfe7ff',acc:'#5fb8ff',shape:'sphere',wings:4,panel:'classic',trim:'stripes',glow:.3},
 'Nebula Runner':{hull:'#4a1f6e',acc:'#ff7af5',shape:'ring',wings:2,panel:'holo',trim:'chevrons',glow:1}};
function styleApply(o){if(!o||typeof o!=='object')return false;let n=0;for(const k of STYLE_KEYS)if(k in o){const v=o[k];
  if((k==='hull'||k==='acc')&&!/^#[0-9a-f]{6}$/i.test(v))continue;if(k==='glow'&&!(v>=0&&v<=2))continue;if(k==='wings'&&![0,2,4].includes(+v))continue;if(k==='mounts'&&(typeof v!=='object'||Array.isArray(v)))continue;CUST[k]=k==='wings'?+v:v;n++}
 saveC();shipKey='';return n>0}
ORB.keyParts.push(()=>[sensorTier(),Math.floor(Object.keys(s.tech||{}).length/7),CUST.trim,CUST.glow,CUST.dish].join(','));
ORB.on('ship:build',({g,rad,part,dark,A})=>{const glowM=new THREE.MeshBasicMaterial({color:A,transparent:true,opacity:Math.min(1,.25+CUST.glow*.5)});
 // rank rings: one per 7 technologies, wrapped around the hull
 const rank=Math.min(5,Math.floor(Object.keys(s.tech||{}).length/7));
 if(CUST.trim==='rings')for(let k=0;k<rank;k++){const t=new THREE.Mesh(new THREE.TorusGeometry(rad*1.02,.09+.03*CUST.glow,6,40),glowM);t.rotation.y=Math.PI/2;t.position.x=(k-(rank-1)/2)*.9;g.add(t)}
 if(CUST.trim==='stripes')for(let k=0;k<Math.max(1,rank);k++){const b=new THREE.Mesh(new THREE.BoxGeometry(rad*1.8,.12,.05),glowM);b.position.set(-.3,(k-(rank-1)/2)*.35,rad*1.01);g.add(b);const b2=b.clone();b2.position.z=-rad*1.01;g.add(b2)}
 if(CUST.trim==='chevrons')for(let k=0;k<Math.max(1,rank);k++)for(const sd of[1,-1]){const c=new THREE.Mesh(new THREE.BoxGeometry(1.4,.14,.05),glowM);c.position.set(rad*.2-k*.7,sd*.45,rad*1.01);c.rotation.z=sd*.6;g.add(c)}
 if(CUST.dish==='hidden')return;
 // sensor hardware, by tier
 const tier=sensorTier(),mount=new THREE.Group();mount.position.set(-rad*.3,0,rad+.2);mount.userData.mount='antenna';g.add(mount);
 const mast=part(new THREE.CylinderGeometry(.08,.12,1.6,6),dark);mast.rotation.x=Math.PI/2;mast.position.z=.8;mount.add(mast);
 if(tier===0){const w=part(new THREE.CylinderGeometry(.03,.03,4,4),dark,A);w.rotation.x=Math.PI/2;w.position.z=3;mount.add(w)}
 else if(tier===1){const d=part(new THREE.SphereGeometry(1.3,14,6,0,Math.PI*2,0,Math.PI/2.6),dark,A);d.position.z=1.6;mount.add(d)}
 else if(tier===2){const p=part(new THREE.BoxGeometry(2.6,.15,1.8),dark,A);p.position.z=2.2;p.rotation.x=-.5;mount.add(p);for(let k=-2;k<=2;k++){const e=new THREE.Mesh(new THREE.BoxGeometry(.3,.05,.3),glowM);e.position.set(k*.5,.1,2.2);mount.add(e)}}
 else if(tier===3){const dm=new THREE.Mesh(new THREE.SphereGeometry(.9,16,10,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:'#9fdcff',metalness:.2,roughness:.1,transparent:true,opacity:.6}));dm.position.z=1.6;mount.add(dm);const l=new THREE.Mesh(new THREE.SphereGeometry(.25,8,6),glowM);l.position.z=1.9;mount.add(l)}
 else{for(const sd of[1,-1]){const b=part(new THREE.BoxGeometry(.12,7,.12),dark,A);b.position.set(0,sd*3.5,1.8);mount.add(b);const d=part(new THREE.SphereGeometry(.8,12,6,0,Math.PI*2,0,Math.PI/2.4),dark,A);d.position.set(0,sd*7,2);mount.add(d)}}});
// ----- 🎨 Customize: style presets, trim, glow, antenna, share/load, radar display
{const c=$('custbody'),sec=t=>{const d=document.createElement('div');d.className='sec';d.innerHTML='<h4>'+t+'</h4>';c.appendChild(d);return d};
 let r=sec('STYLE PRESETS (one tap restyles the whole ship)');for(const n in STYLE_PRESETS)btn(r,n,()=>{styleApply(STYLE_PRESETS[n]);notify('🎨 Style: '+n)});
 r=sec('TRIM (grows with your research: +1 per 7 technologies)');['rings','stripes','chevrons','none'].forEach(t=>btn(r,()=>(CUST.trim===t?'● ':'○ ')+t,()=>styleApply({trim:t})));
 r=sec('GLOW');[['dim',.2],['normal',.6],['bright',1],['neon',1.6]].forEach(([n,v])=>btn(r,()=>(Math.abs(CUST.glow-v)<.05?'● ':'○ ')+n,()=>styleApply({glow:v})));
 r=sec('SENSOR ANTENNA');btn(r,()=>(CUST.dish!=='hidden'?'● ':'○ ')+'Show (its shape follows your sensor tier)',()=>styleApply({dish:CUST.dish==='hidden'?'auto':'hidden'}));
 r=sec('SHARE YOUR STYLE');btn(r,'📋 Copy style as JSON',()=>{const j=JSON.stringify(Object.fromEntries(STYLE_KEYS.map(k=>[k,CUST[k]])));try{navigator.clipboard.writeText(j);notify('📋 Style copied. Paste it anywhere to share it.')}catch(e){prompt('Copy this style:',j)}});
 btn(r,'📥 Load a style from JSON',()=>{const j=prompt('Paste a style (JSON):');if(!j)return;try{notify(styleApply(JSON.parse(j))?'🎨 Style loaded.':'⚠ Nothing usable in that style.')}catch(e){notify('⚠ That is not valid JSON.')}});
 r=sec('LANGUAGE');langButtons(r);
 r=sec('COCKPIT');btn(r,()=>(document.body.classList.contains('retro')?'○ ':'● ')+'Neo glass cockpit (off = classic panels)',()=>{const on=document.body.classList.toggle('retro');try{localStorage.setItem('orbital-retro',on?'1':'0')}catch(e){}});
 try{if(localStorage.getItem('orbital-retro')==='1')document.body.classList.add('retro')}catch(e){}
 r=sec('RADAR DISPLAY (cockpit 📡 Sensors widget)');for(const n in RADARS)btn(r,()=>(RADAR_DESIGN===n?'● ':'○ ')+n+' · '+RADARS[n].d,()=>ORB.radar.use(n));
 const inf=document.createElement('div');inf.className='inf';r.appendChild(inf);regs.push({b:inf,label:()=>{const t=sensorTier(),S=SENSOR_TIERS[t],N=SENSOR_TIERS[t+1];return `Your sensors: <b>${S.n}</b> (tier ${t+1}/5) · range ${fmtD(S.range)} · error ±${(S.acc*100).toFixed(3)} % of range · ${S.hz} updates/s · sees: ${['','position','+ velocity','+ mass & size','+ composition, hull, ammo','+ full loadout'].slice(1,S.lvl+1).join(' ')}.${N?' Next: '+N.n+' after '+((t+1)*7-Object.keys(s.tech).length)+' more technologies.':''}`},html:true})}
