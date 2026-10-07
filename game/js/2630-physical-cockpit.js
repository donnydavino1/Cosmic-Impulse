// ===== PHYSICAL COCKPIT (client, visual only): real instruments instead of pop-up panels =====
// 🎨 Customize → COCKPIT STYLE → "Physical", or the 🎛 button in the cockpit. In the 1st-person view a console fills
// the lower part of the screen: an annunciator panel (warning lamps), analog gauges with needles, a CRT radar scope,
// guarded toggle switches, back-lit push buttons, a time-warp knob and LCD readouts. Every control calls the same
// action as its key, and every reading comes from the same numbers as the panels (nothing extra is revealed).
const PC={el:null,on:false,g:{},lamps:{},sw:{},btn:{},max:{prop:1}};
const pcAct=id=>{const a=ACTS.find(x=>x[0]===id);if(a)a[3]()};
CKS.physical={label:'Physical: real switches, gauges, lamps and a CRT scope (no pop-up panels)',frame:CKS.real.frame};
// --- building blocks (SVG): every part is drawn with gradients for brushed metal, glass and lit plastic
function pcGauge(id,lab,unit,ticks,red){const T=ticks.map((t,i)=>{const a=-135+270*i/(ticks.length-1),r1=34,r2=i%1?37:39,ra=a*Math.PI/180;
  return`<line x1="${50+r1*Math.sin(ra)}" y1="${50-r1*Math.cos(ra)}" x2="${50+r2*Math.sin(ra)}" y2="${50-r2*Math.cos(ra)}" stroke="#d9dde2" stroke-width="1.4"/><text x="${50+27*Math.sin(ra)}" y="${53-27*Math.cos(ra)}" font-size="7" text-anchor="middle" fill="#cfd4da">${t}</text>`}).join('');
 const rz=red?`<path d="${pcArc(red[0],red[1],37)}" stroke="#c0392b" stroke-width="4" fill="none" opacity=".9"/>`:'';
 return`<div class="pcg"><svg viewBox="0 0 100 100"><defs><radialGradient id="bz${id}" cx="35%" cy="30%"><stop offset="0" stop-color="#f4f6f8"/><stop offset=".45" stop-color="#8d939b"/><stop offset="1" stop-color="#3a3f46"/></radialGradient>
  <radialGradient id="fc${id}" cx="50%" cy="40%"><stop offset="0" stop-color="#1c2126"/><stop offset="1" stop-color="#07090b"/></radialGradient><linearGradient id="gl${id}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
  <circle cx="50" cy="50" r="48" fill="url(#bz${id})"/><circle cx="50" cy="50" r="43" fill="#111"/><circle cx="50" cy="50" r="41.5" fill="url(#fc${id})"/>${rz}${T}
  <text x="50" y="68" font-size="7.5" text-anchor="middle" fill="#e8ebee" letter-spacing="1">${tr(lab)}</text><text x="50" y="77" font-size="6" text-anchor="middle" fill="#8f979f">${tr(unit)}</text>
  <text id="pcv_${id}" x="50" y="88" font-size="7" text-anchor="middle" fill="#ffd27a" font-family="ui-monospace,monospace"></text>
  <g id="pcn_${id}"><path d="M48.6 52 L50 14 L51.4 52 Z" fill="#ff7a2a"/><path d="M49.2 52 L50 60 L50.8 52 Z" fill="#d9dde2"/></g><circle cx="50" cy="50" r="4.5" fill="url(#bz${id})"/>
  <ellipse cx="44" cy="30" rx="30" ry="18" fill="url(#gl${id})"/></svg></div>`}
function pcArc(f0,f1,r){const p=f=>{const a=(-135+270*f)*Math.PI/180;return[50+r*Math.sin(a),50-r*Math.cos(a)]},[x0,y0]=p(f0),[x1,y1]=p(f1);return`M${x0} ${y0} A${r} ${r} 0 ${(f1-f0)*270>180?1:0} 1 ${x1} ${y1}`}
const pcSwitch=(id,lab,on,off)=>`<div class="pcs" data-sw="${id}"><div class="pcsl">${lab}</div><div class="pcsg"><div class="pcsled"></div><div class="pcsb"><div class="pcsh"></div></div></div><div class="pcst"><span>${on}</span><span>${off}</span></div></div>`;
const pcButton=(id,lab,col)=>`<button class="pcb ${col||''}" data-pb="${id}"><span>${lab}</span></button>`;
const PC_LAMPS=[['crew','CREW'],['hull','HULL'],['o2','O₂'],['water','WATER'],['food','FOOD'],['co2','CO₂'],['cabin','CABIN'],['dose','RADIATION'],['power','POWER'],['sys','SYSTEMS'],['threat','THREAT'],['storm','STORM']];
function pcBuild(){const el=document.createElement('div');el.id='pcons';el.innerHTML=`
 <div class="pcp pcann"><div class="pch">CAUTION / WARNING</div><div class="pclamps">${PC_LAMPS.map(([k,l])=>`<div class="pcl" data-l="${k}">${l}</div>`).join('')}</div>
  <button class="pcmc" data-pb="ack">MASTER<br>CAUTION</button><div class="pclcd" id="pclcd1">T+ 0d 00:00</div><div class="pclcd" id="pclcd2">ALT —</div></div>
 <div class="pcp pcgauges">${pcGauge('vel','VELOCITY','km/s',[0,5,10,15,20,25,30,35,40])}${pcGauge('bat','BATTERY','%',[0,20,40,60,80,100],[0,.1])}${pcGauge('prop','PROPELLANT','kg (log)',['10','100','1k','10k','100k','1M'])}
  ${pcGauge('o2','OXYGEN','days',[0,5,10,15,20,25,30],[0,.12])}${pcGauge('cab','CABIN','°C',[0,10,20,30,40,50,60],[.75,1])}${pcGauge('dose','DOSE','mSv/day (log)',['.01','.1','1','10','100','1k'],[.6,1])}</div>
 <div class="pcp pcscope"><div class="pch">RADAR</div><div class="pccrt"><canvas id="pcrt" width="260" height="260"></canvas><div class="pcglass"></div></div><div class="pcknobs">${pcButton('rmode','SONAR / 3D')}</div></div>
 <div class="pcp pcsw"><div class="pch">SYSTEMS</div><div class="pcswrow">${pcSwitch('stab','STABILIZER','ON','OFF')}${pcSwitch('shelter','STORM SHELTER','IN','OUT')}${pcSwitch('sense','RADAR','ACTIVE','PASSIVE')}${pcSwitch('mode','THRUST','ORBIT','X/Y/Z')}${pcSwitch('radio','MUSIC','ON','OFF')}</div>
  <div class="pcwarp"><button class="pcknob" data-pb="slower">◀</button><div class="pcdial"><div class="pcdialv" id="pcwarp">×1</div><div class="pch">TIME WARP</div></div><button class="pcknob" data-pb="faster">▶</button></div></div>
 <div class="pcp pcbtns"><div class="pch">WEAPONS</div><div class="pcgrid">${pcButton('w1','1 MINING')}${pcButton('w2','2 PULSE')}${pcButton('w3','3 BEAM')}${pcButton('w4','4 RAIL')}${pcButton('w5','5 MISSILE')}${pcButton('target','TARGET','blue')}</div>
  <button class="pcfire" data-pb="fire"><span>FIRE</span></button>
  <div class="pch">SHIP</div><div class="pcgrid">${pcButton('view','CAMERA')}${pcButton('shop','ENGINEERING')}${pcButton('nav','NAVIGATE')}${pcButton('builder','BUILDER')}${pcButton('ops','OPERATIONS')}${pcButton('contracts','CONTRACTS')}</div></div>`;
 document.body.appendChild(el);PC.el=el;
 el.addEventListener('click',e=>{const b=e.target.closest('[data-pb]'),w=e.target.closest('[data-sw]');if(w){pcAct(w.dataset.sw);return}if(!b||b.dataset.pb==='fire')return;const id=b.dataset.pb;
  if(id==='ack')PC.ack=performance.now();else if(id==='rmode')PC.radar=PC.radar==='3d'?'sonar':'3d';else pcAct(id)});
 const F=el.querySelector('.pcfire');F.addEventListener('pointerdown',e=>{e.preventDefault();F.classList.add('down');fireDown()});addEventListener('pointerup',()=>{if(F.classList.contains('down')){F.classList.remove('down');fireHeld=false}})}
// --- live values
const pcLog=(v,a,b)=>Math.max(0,Math.min(1,(Math.log10(Math.max(v,1e-9))-a)/(b-a)));
function pcNeedle(id,f,txt){const n=document.getElementById('pcn_'+id),t=document.getElementById('pcv_'+id);if(n)n.setAttribute('transform',`rotate(${-135+270*Math.max(0,Math.min(1,f))} 50 50)`);if(t)t.textContent=txt}
function pcTick(){const want=CK_STYLE==='physical'&&FP&&innerWidth>=900;document.body.classList.toggle('pcon',want);if(!want)return;if(PC.el&&PC.lang!==LANG){PC.el.remove();PC.el=null}if(!PC.el){pcBuild();PC.lang=LANG}
 const g=gam(s),D=s.dom,v=Math.hypot(s.vx/g-D.vx,s.vy/g-D.vy,s.vz/g-D.vz)/1e3,L=lifeDays(),R2=doseNow(),bat=s.en/Math.max(1,SH.cap),tc=s.tLo-273,ds=R2.tot*864e5;
 pcNeedle('vel',v/40,f1(v,2));pcNeedle('bat',bat,Math.round(bat*100)+' %');pcNeedle('prop',pcLog(s.prop,1,6),f1(s.prop,0));pcNeedle('o2',Math.min(1,L.o2/30),L.o2>999?'999+':f1(L.o2,1));
 pcNeedle('cab',tc/60,f1(tc,0)+' °C');pcNeedle('dose',pcLog(ds,-2,3),f1(ds,ds<1?3:1));
 // lamps: same thresholds as the vitals strip
 const c=s.crew,hp=Math.max(0,s.hull/hullMax()),fl=s.parts.filter(q=>q.fail).length+DR.filter(x=>isU(x.id)&&x.fail).length,mis=OBJS.filter(o=>o.hostile&&o.alive).length,storm=R2.spe>0||!!flare;
 const st={crew:c.hp<50?2:c.hp<80?1:0,hull:hp<.3||s.leak?2:hp<.6?1:0,o2:c.o2ok===false||L.o2<2?2:L.o2<7?1:0,water:c.waterok===false||L.wat<2?2:L.wat<5?1:0,food:c.foodok===false||L.food<3?2:L.food<7?1:0,
  co2:s.co2>.6?2:s.co2>.2?1:0,cabin:s.tLo>318?2:s.tLo>308?1:0,dose:c.acute>1?2:c.acute>.5?1:0,power:bat<.05&&s.pFree<0?2:bat<.15?1:0,sys:fl?2:0,threat:mis?2:CB.on?1:0,storm:R2.spe>0&&!s.shelter?2:storm?1:0};
 const blink=(performance.now()/400|0)%2,acked=PC.ack&&performance.now()-PC.ack<20000;let any=0;
 for(const el of PC.el.querySelectorAll('.pcl')){const k=st[el.dataset.l];any=Math.max(any,k);el.classList.toggle('amber',k===1);el.classList.toggle('red',k===2);el.classList.toggle('dim',k===2&&!acked&&blink)}
 PC.el.querySelector('.pcmc').classList.toggle('lit',any>0&&!acked&&!!blink);
 // switches show the real state
 const sw={stab:STAB,shelter:!!s.shelter,sense:!s.passive,mode:!XYZ,radio:!!radioOn};for(const el of PC.el.querySelectorAll('.pcs'))el.classList.toggle('on',!!sw[el.dataset.sw]);
 for(const el of PC.el.querySelectorAll('[data-pb^="w"]'))el.classList.toggle('lit',el.dataset.pb==='w'+(WI+1));
 const tg=PC.el.querySelector('[data-pb="target"]');if(tg)tg.classList.toggle('lit',!!WT);
 const o=elements(),alt=(o.r-o.d.R)/1e3;$('pclcd1').textContent='T+ '+fT(T);$('pclcd2').textContent=tr('ALT')+' '+(alt<1e6?f1(alt,0)+' km':fmtD(alt*1e3))+' · '+tr(o.d.n);
 $('pcwarp').textContent='×'+WARP[wi];
 const cv=$('pcrt');if(cv&&typeof radarDraw==='function'){const keep=RADAR_DESIGN;RADAR_DESIGN=PC.radar||'sonar';try{radarDraw(cv)}finally{RADAR_DESIGN=keep}}}
ORB.on('ui',()=>{try{pcTick()}catch(e){console.warn('physical cockpit',e)}});
// an easy switch while flying: the 🎛 button in the cockpit view toggles between physical and the previous style
{const b=document.createElement('button');b.id='physbtn';b.textContent='🎛 Physical controls';b.onclick=()=>{if(CK_STYLE==='physical')ckUse(PC.prev||'real');else{PC.prev=CK_STYLE;ckUse('physical')}};document.body.appendChild(b);
 ORB.on('ui',()=>{b.style.display=FP?'':'none';b.classList.toggle('on',CK_STYLE==='physical')})}
