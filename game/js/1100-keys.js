// ===== KEY BINDINGS (rebindable, saved) =====
const ACTS=[['fwd','w','Thrust 1: forward / +Y / speed up'],['back','s','Thrust 2: back / −Y / slow down'],['left','a','Thrust 3: left / −X / toward planet'],['right','d','Thrust 4: right / +X / away from planet'],
 ['up','e','Thrust 5: up / +Z / tilt orbit'],['down','q','Thrust 6: down / −Z / tilt orbit'],
 ['pause',' ','Pause / resume time',()=>togglePause()],['slower',',','Slower time',()=>acts['Warp −']()],['faster','.','Faster time',()=>acts['Warp +']()],
 ['view','v','🎥 Next camera: 3rd-person chase → 1st-person cockpit → orbit map',()=>cycleView()],['ship','g','🚀 3rd-person chase camera on / off',()=>toggleSV()],
 ['stab','t','🧭 Stabilizer on/off (keeps your view steady)',()=>{STAB=!STAB;stabCapture()}],['mode','m','Thrust mode: X/Y/Z axes ↔ orbit',()=>XYZ=!XYZ],
 ['focus','f','Camera: look at next object',()=>setFocus(fi+1)],['zin','=','Zoom in',()=>zoom(1/1.5)],['zout','-','Zoom out',()=>zoom(1.5)],
 ['shop','b','⚡ Use energy (shop)',()=>toggleShop()],['nav','n','🧭 Navigation / autopilot',()=>$('nav').classList.toggle('h')],
 ['custom','k','🎨 Customize your ship',()=>$('cust').classList.toggle('h')],['info','h','More / less info',()=>det=!det],['guide','c','📖 This guide & key settings',()=>openGuide()],
 ['sun','x','☀ Autopilot: as close to the Sun as possible',()=>goSun()],['radio','r','📻 Music on / off',()=>radioToggle()],['chan','y','📻 Next music channel',()=>radioCh(1)],
 ['fire','l','🔥 Fire selected weapon (hold for lasers and beams)',()=>fireDown()],['w1','1','⛏ Mining laser: select & fire (hold)',()=>wKey(0)],['w2','2','✦ Pulse laser: select & fire',()=>wKey(1)],['w3','3','☄ Particle beam: select & fire (hold)',()=>wKey(2)],['w4','4','⇶ Railgun: select & fire',()=>wKey(3)],['w5','5','🚀 Missile: select & launch',()=>wKey(4)],['raid','0','⚔ Call in a raider wave',()=>raidStart()],['unlock','f9','🧪 Testing: unlock everything',()=>unlockAll()],['weapon','u','🔫 Next weapon',()=>cycleW()],['target','o','🎯 Next target',()=>cycleT()],
 ['shelter','z','☢ Storm shelter on / off',()=>toggleShelter()],['dash','j','🧩 Next cockpit dashboard layout',()=>nextLayout()],['wpal','i','🧩 Dashboard editor (widgets & layouts)',()=>$('wpal').classList.toggle('h')],['contracts','9','📋 Contracts board (missions and rewards)',()=>ctrToggle()],['ops','8','🛸 Operations: mining drones and science probes',()=>opsToggle()],['builder','7','🧱 Ship builder: module layout and performance',()=>bldToggle()],['design','f7','🧪 Part designer: invent your own radiators, batteries, reactors and armour',()=>desToggle()],['orbitp','f6','🛰 Orbit planner: geostationary, geosynchronous or any circular orbit',()=>orbToggle()],['sense','6','📡 Active / passive radar',()=>{s.passive=!s.passive;recalc();notify(s.passive?'📡 Passive sensing: you only listen. Shorter range and less precise, but you are hard to find while your engine is off.':'📡 Active radar: full range and precision, but anyone listening can hear you.')}],['lang','f8','🌐 Language: English / Español / 中文',()=>cycleLang()],['wiki','f1','📖 Open the player wiki',()=>window.open('https://claude.ai/artifact/PcSnhuD1QhDPnV3zuNw6eX','_blank')],['mp','p','🌐 Multiplayer window',()=>$('mpw').classList.toggle('h')]];
const TK={fwd:'w',back:'s',left:'a',right:'d',up:'e',down:'q'},ARROW={arrowup:'fwd',arrowdown:'back',arrowleft:'left',arrowright:'right'},
 KNM={' ':'Space',arrowup:'↑',arrowdown:'↓',arrowleft:'←',arrowright:'→',escape:'Esc',tab:'Tab',enter:'Enter',shift:'Shift',control:'Ctrl',alt:'Alt'},
 KN=k=>k?(KNM[k]||(k.length==1?k.toUpperCase():k[0].toUpperCase()+k.slice(1))):'—';
let BIND={},CAP=null,gDone=false;ACTS.forEach(a=>BIND[a[0]]=a[1]);try{Object.assign(BIND,JSON.parse(localStorage.getItem('orbital-keys')||'{}'))}catch(e){}
const saveB=()=>{try{localStorage.setItem('orbital-keys',JSON.stringify(BIND))}catch(e){}},findA=k=>ACTS.find(x=>BIND[x[0]]===k)||(ARROW[k]&&ACTS.find(x=>x[0]===ARROW[k]));
addEventListener('keydown',e=>{const k=e.key.toLowerCase();
 if(CAP){e.preventDefault();if(k!=='escape'){for(const a in BIND)if(BIND[a]===k)BIND[a]='';BIND[CAP]=k;saveB()}CAP=null;buildKeys();return}
 if(e.target&&(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'))return;
 if(k==='escape'){['ctrl','shop','nav','help','cust','wpal','mpw','opsw','bldw','orbw','tcw','desw'].forEach(i=>$(i).classList.add('h'));return}
 if(k==='tab'){e.preventDefault();setFocus(fi+1);return}
 const a=findA(k);if(!a)return;if(k===' '||k.startsWith('arrow'))e.preventDefault();
 if(TK[a[0]]){K[TK[a[0]]]=1;AP=null}else if(!e.repeat)a[3]()});
addEventListener('keyup',e=>{const a=findA(e.key.toLowerCase());if(a&&TK[a[0]])K[TK[a[0]]]=0;if(a&&(a[0]==='fire'||/^w[1-5]$/.test(a[0])))fireHeld=false});
function buildKeys(){const t=$('keytab');t.innerHTML='';ACTS.forEach(a=>{const tr=document.createElement('tr'),c1=document.createElement('td'),c2=document.createElement('td'),c3=document.createElement('td'),b=document.createElement('button');
 c1.textContent=CAP===a[0]?'press a key…':KN(BIND[a[0]]);c2.textContent=a[2];b.textContent=CAP===a[0]?'Waiting… (Esc cancels)':'Change';b.onclick=()=>{CAP=a[0];buildKeys()};
 c3.appendChild(b);tr.appendChild(c1);tr.appendChild(c2);tr.appendChild(c3);t.appendChild(tr)})}
function openGuide(){if(!gDone){gDone=true;const ol=$('help').querySelector?$('help').querySelector('ol'):null;if(ol)$('gplay').innerHTML=ol.outerHTML}buildKeys();$('ctrl').classList.toggle('h')}
$('guidebtn').onclick=openGuide;$('keyreset').onclick=()=>{ACTS.forEach(a=>BIND[a[0]]=a[1]);saveB();buildKeys()};
