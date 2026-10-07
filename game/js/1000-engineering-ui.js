// ===== ENGINEERING WINDOW (tabs) =====
const sb=$('shopbody'),tbar=document.createElement('div');tbar.className='tabs';sb.appendChild(tbar);const TABS={};let curTab='ship';
function showTab(){for(const k in TABS)TABS[k].style.display=k===curTab?'':'none'}
const mkTab=(id,l)=>{const d=document.createElement('div');sb.appendChild(d);TABS[id]=d;btn(tbar,()=>(curTab===id?'▸ ':'')+l,()=>{curTab=id;showTab()});return d};
// --- Ship tab
const tS=mkTab('ship','🔧 Ship');
dyn(grp(tS,'DESIGN ANALYZER: what your ship can do, and what limits it'),()=>whyTxt());
{const g0=grp(tS,'BURN PREVIEW');const cv=document.createElement('canvas');cv.width=560;cv.height=140;cv.style.cssText='width:100%;height:140px;position:static;display:block;pointer-events:none';g0.appendChild(cv);regs.push({b:{set textContent(v){burnCurve(cv)},get textContent(){return''}},label:()=>'x'})}
dyn(grp(tS,'SYSTEM BUDGETS'),()=>budgetTxt());
dyn(grp(tS,'INSTALLED COMPONENTS (service with spare-parts kits; removing returns 50% of materials)'),()=>partsHtml());
// --- Fabricate tab
const tF=mkTab('fab','🏭 Fabricate');
dyn(grp(tF,'JOB QUEUE: manufacturing draws power over time (spare power first, then the battery down to 25%)'),()=>jobsHtml());
let g=grp(tF,'SOLAR PANELS');info(g,()=>`${f1(s.area,0)} m² at ${Math.round(EFF*100)}% efficiency → ${f1(perM2(),0)} W per m² here. Each m² needs ${PSI} kg silicates + ${sci(P1)} J of fabrication. Layout: ${arrLayout()}.`);
[10,100,1e3,1e4].forEach(n=>btn(g,()=>`Build ${n.toLocaleString()} m² · ${f1(PSI*n,0)} kg silicates · ${sci(P1*n)} J`,()=>{if(canP(n)){s.res.silicates-=PSI*n;queueJob({type:'panel',n,name:'Build '+n+' m² of solar panels',J:P1*n})}},()=>canP(n)));
btn(g,()=>inEarth()?`Order 100 m² ready-made from Earth · ${sci(PE*100)} J`:'Ready-made panels: only inside Earth’s gravity zone',()=>{if(inEarth())queueJob({type:'panel',n:100,name:'Order 100 m² of panels from Earth',J:PE*100})},()=>inEarth());
g=grp(tF,'SUPPLIES');info(g,()=>`Oxygen ${f1(s.res.oxygen,1)} kg · food ${f1(s.res.food,1)} kg · water ${f1(s.res.water,0)} kg · spare kits ${s.res.spares}. ${inEarth()?'Inside Earth’s gravity zone: you can order supplies from Earth.':'Deep space: oxygen from water, water from C-type asteroids; food only from Earth or a greenhouse.'}`);
[['oxygen',50],['food',50],['water',500]].forEach(([k,n])=>btn(g,()=>`${SUPR[k].n} +${n} kg · ${inEarth()&&SUPR[k].earthJ?sci(SUPR[k].earthJ*n)+' J from Earth':SUPR[k].make?f1(SUPR[k].make.water*n,0)+' kg water + '+sci(SUPR[k].J*n)+' J':SUPR[k].how}`,()=>supJob(k,n),()=>(inEarth()&&SUPR[k].earthJ)||(SUPR[k].make&&matOK(Object.fromEntries(Object.entries(SUPR[k].make).map(([q,v])=>[q,v*n]))))));
btn(g,()=>`Make 2 spare-parts kits · 20 kg iron, 4 nickel, 4 silicates, 0.02 platinum · 1e8 J`,()=>supJob('spares',2),()=>matOK({iron:20,nickel:4,silicates:4,platinum:.02}));
btn(g,()=>s.leak>0?'🩹 Patch the hull breach (5 kg iron, 1 hour)':'Hull intact ✓',()=>{if(s.leak>0)queueJob({type:'patch',mat:{iron:5},name:'Patch hull breach',J:5e6,minT:3600})},()=>s.leak>0&&s.res.iron>=5);
Object.keys(CATN).forEach(cat=>{const g2=grp(tF,CATN[cat].toUpperCase());Object.keys(PARTS).filter(k=>PARTS[k].cat===cat&&PARTS[k].J>0).forEach(k=>{const d=PARTS[k];
 info(g2,()=>`<b>${d.n}</b> · ${f1(d.m,0)} kg — ${d.d}`);info(g2,()=>!hasT(d.req)?'🔒 Research first: '+TK2[d.req].n:`Needs ${matTxt(d.mat)} · ${sci(d.J)} J${d.earth?(inEarth()?' · ✓ in Earth’s gravity zone':' · ✗ build inside Earth’s gravity zone'):''}${d.one&&s.parts.some(p=>PARTS[p.id].cat===cat)?' · replaces your current one':''}`);
 info(g2,()=>hasT(d.req)?previewTxt(k):'');btn(g2,()=>'Build: '+d.n,()=>{if(!queueJob({type:'part',id:k,mat:{...d.mat},name:d.n,J:d.J}))notify('⚠ Missing materials: '+matTxt(d.mat))},()=>hasT(d.req)&&matOK(d.mat)&&(!d.earth||inEarth())&&!(d.one&&s.parts.some(p=>p.id===k)))})});
{const g2=grp(tF,'🚀 ENGINES');Object.keys(ENGR).forEach(id=>{const E2=ENGR[id],D=DR.find(x=>x.id===id);info(g2,()=>`<b>${D.ic} ${D.n}</b>${isU(id)?' · ✅ installed':''} — ${!hasT(E2.req)?'🔒 research '+TK2[E2.req].n:'needs '+matTxt(E2.mat)+' · '+sci(E2.J)+' J'+(E2.earth?' · inside Earth’s gravity zone':'')}`);
 btn(g2,()=>isU(id)?'✅ Installed':'Build: '+D.n,()=>{if(!queueJob({type:'eng',id,mat:{...E2.mat},name:D.n,J:E2.J}))notify('⚠ Missing: '+matTxt(E2.mat))},()=>!isU(id)&&hasT(E2.req)&&matOK(E2.mat)&&(!E2.earth||inEarth())&&!s.jobs.some(j=>j.id===id))})}
{const g2=grp(tF,'🔫 WEAPONS');Object.keys(WEPR).forEach(id=>{const W2=WEPR[id],w=WEP.find(x=>x.id===id);info(g2,()=>`<b>${w.n}</b> (${W2.m} kg)${isU(id)?' · ✅ installed':''} — ${!hasT(W2.req)?'🔒 research '+TK2[W2.req].n:'needs '+matTxt(W2.mat)+' · '+sci(W2.J)+' J'}`);
 btn(g2,()=>isU(id)?'✅ Installed':'Build: '+w.n,()=>{if(!queueJob({type:'weap',id,mat:{...W2.mat},name:w.n,J:W2.J}))notify('⚠ Missing: '+matTxt(W2.mat))},()=>!isU(id)&&hasT(W2.req)&&matOK(W2.mat)&&!s.jobs.some(j=>j.id===id))});
 btn(g2,'Build 1 missile (20 iron, 5 carbon, 25 kg rocket fuel, 1e8 J)',()=>{if(s.fuel.chem>=25&&queueJob({type:'missile',n:1,mat:{iron:20,carbon:5},name:'Missile',J:1e8}))s.fuel.chem-=25},()=>isU('missile')&&matOK({iron:20,carbon:5})&&s.fuel.chem>=25)}
// --- Research tab
const tR=mkTab('res','🔬 Research');
dyn(grp(tR,'RESEARCH'),()=>{const t=s.research&&TK2[s.research];return `Research points available: <b>${f1(s.rp,1)}</b> · lab produces <b>${SH.rp*(s.crew.acute>1?.6:1)} RP/hour</b>${s.shelter?' (paused: crew in the storm shelter)':''} · discoveries give bonus points (see 📚 Codex).<br>${t?`▶ Researching <b>${t.n}</b>: ${f1(s.rprog[t.id]||0,0)} / ${t.c} RP ${bar((s.rprog[t.id]||0)/t.c,'#5fb8ff')}`:'Pick something to research below.'}<br>Known technologies: ${Object.keys(s.tech).length} / ${TECH.length}`});
[...new Set(TECH.map(t=>t.b))].forEach(br=>{const g2=grp(tR,br.toUpperCase());TECH.filter(t=>t.b===br).forEach(t=>{
 const un=[...Object.keys(PARTS).filter(k=>PARTS[k].req===t.id).map(k=>PARTS[k].n),...Object.keys(ENGR).filter(k=>ENGR[k].req===t.id).map(k=>DR.find(D=>D.id===k).n),...Object.keys(WEPR).filter(k=>WEPR[k].req===t.id).map(k=>WEP.find(w=>w.id===k).n)];
 info(g2,()=>`${s.tech[t.id]?'✅':s.research===t.id?'▶':techOK(t)?'○':'🔒'} <b>${t.n}</b> · ${t.c} RP — ${t.d}${un.length?' <i>Unlocks: '+un.join(', ')+'.</i>':''}${t.pre.length?' Needs: '+t.pre.map(q=>(s.tech[q]?'✓ ':'✗ ')+TK2[q].n).join(', ')+'.':''}`);
 btn(g2,()=>s.tech[t.id]?'✅ Known':s.research===t.id?'▶ Researching…':'Research: '+t.n,()=>setResearch(t.id),()=>!s.tech[t.id]&&s.research!==t.id&&techOK(t))})});
// --- Engines & fuel tab
const tD=mkTab('drive','🚀 Engines & fuel');
DR.forEach((D,i)=>{const g2=grp(tD,D.ic+' '+D.n.toUpperCase()+(D.f?'  ·  fuel: '+FUEL[D.f].n+' ('+FUEL[D.f].full+')':'  ·  no fuel'));
 info(g2,()=>isU(D.id)?D.how:'🔒 Not built. '+(ENGR[D.id]?(hasT(ENGR[D.id].req)?'Build it in 🏭 Fabricate.':'Research '+TK2[ENGR[D.id].req].n+' first.'):''));
 info(g2,()=>isU(D.id)?statsTxt(i):'');if(D.f)info(g2,()=>isU(D.id)?reachTxt(i):'');
 btn(g2,()=>!isU(D.id)?'🔒 Not built':i===di?'✓ Selected':'Use this engine',()=>setDrive(i),()=>isU(D.id)&&i!==di);
 if(D.f){[10,100,1000].forEach(n=>btn(g2,()=>`Get ${n.toLocaleString()} kg ${FUEL[D.f].n.toLowerCase()} · ${costTxt(D.f,n)}`,()=>buyFu(D.f,n),()=>isU(D.id)&&canMake(D.f,n)));
  [[1e6/C,'1,000 km/s'],[.1,'0.1c'],[.99,'0.99c']].forEach(([b,t])=>btn(g2,()=>`Get enough to reach ${t}`,()=>buyFu(D.f,fuelFor(i,b)*1.001),()=>{const k=fuelFor(i,b);return isU(D.id)&&k>0&&isFinite(k)&&canMake(D.f,k)}))}
 if(!D.sail){btn(g2,()=>`Enlarge engine ×10 (→ ${sci((i===di?PW:D.pw)*10)} W, +${f1(D.al*(i===di?PW:D.pw)*9,0)} kg)`,()=>engResizeJob(D.id,10),()=>isU(D.id));btn(g2,'Shrink engine ÷10',()=>engResizeJob(D.id,.1),()=>isU(D.id)&&(i===di?PW:D.pw)>1e3);
  btn(g2,()=>D.mk>=3?'Mk III (maximum)':`Upgrade to Mk ${D.mk+1} (needs ${D.mk===1?'Engine refinement Mk II':'Engine refinement Mk III'})`,()=>engUpJob(D.id),()=>isU(D.id)&&D.mk<3&&hasT(D.mk===1?'t_eng2':'t_eng3'))}});
// --- Weapons tab
const tW=mkTab('weap','🔫 Weapons');let gw=grp(tW,'TARGET & FIRE');info(gw,()=>wTxt());
btn(gw,()=>'🎯 Next target ('+KN(BIND.target)+')',()=>cycleT());{const b=btn(gw,()=>'🔥 Hold to fire: '+WEP[WI].n+' ('+KN(BIND.fire)+')');b.onpointerdown=()=>fireDown();const up=()=>fireHeld=false;b.onpointerup=up;b.onpointerleave=up;b.onpointercancel=up}
btn(gw,'Launch 3 practice drones (20–80 km away)',()=>spawnDrones());
WEP.forEach((w,i)=>{const g2=grp(tW,w.n.toUpperCase());info(g2,()=>w.d+(isU(w.id)?' · mass '+f1(wepMass(w),0)+' kg':''));btn(g2,()=>!isU(w.id)?'🔒 Build it in 🏭 Fabricate':i===WI?'✓ Selected':'Select',()=>{WI=i},()=>isU(w.id)&&i!==WI)});
gw=grp(tW,'MINING LASER SIZE');btn(gw,()=>`Bigger laser ×10 (now ${sci(PML)} W, ${f1(wepMass(WEP[0]),0)} kg → about ${f1(.5*PML*10/2e6*3600,0)} kg/hour of rock)`,()=>{if(s.res.iron>=Math.ceil(PML*9*6e-4)){s.res.iron-=Math.ceil(PML*9*6e-4);PML=Math.min(5e9,PML*10)}else notify('⚠ Needs '+Math.ceil(PML*9*6e-4)+' kg iron')});btn(gw,'Smaller laser ÷10',()=>PML=Math.max(5e3,PML/10));
// --- Inventory, Codex, Save, Testing
const tI=mkTab('inv','⛏ Inventory');dyn(grp(tI,'EVERYTHING ON BOARD'),()=>invHtml());
info(grp(tI,'ASTEROID TYPES'),()=>'C-type (carbon-rich): ~15% water, plus carbon and silicates. S-type (stony): silicates and iron. M-type (metallic): ~80% iron, nickel, and the most platinum (~100 ppm).');
const tC2=mkTab('codex','📚 Codex');dyn(grp(tC2,'COLLECTION & DISCOVERIES'),()=>codexHtml());
const tSv=mkTab('save','💾 Save');{const g2=grp(tSv,'SAVE / LOAD (stored in this browser; autosaves every minute)');['1','2','3'].forEach(k=>{btn(g2,()=>'💾 Save to slot '+k+' '+slotInfo(k),()=>{saveGame(k)&&notify('💾 Saved to slot '+k)});btn(g2,()=>'📂 Load slot '+k,()=>loadGame(k),()=>!!slotInfo(k))});btn(g2,()=>'📂 Load autosave '+slotInfo('auto'),()=>loadGame('auto'),()=>!!slotInfo('auto'));btn(g2,'🆕 Start a new game',()=>{if(confirm('Start over? Unsaved progress is lost.'))location.reload()})}
const gT=grp(mkTab('test','🧪 Testing'),'TESTING CHEATS');btn(gT,'🔓 UNLOCK EVERYTHING (tech, engines, weapons, materials)  ·  key F9',()=>unlockAll());btn(gT,()=>(INSTANT?'● ':'○ ')+'Instant orders & building (no waiting, no energy cost)',()=>toggleInstant());btn(gT,'+1e12 J (fills storage only)',()=>{s.en=SH.cap});btn(gT,'+10 tonnes of every material',()=>{for(const k of RES)s.res[k]+=1e4});
btn(gT,'+1,000 research points',()=>s.rp+=1000);btn(gT,'Know every technology',()=>TECH.forEach(t=>s.tech[t.id]=1));btn(gT,'Finish all jobs now',()=>{while(s.jobs.length){const j=s.jobs.shift();if(j.type==='panel')s.area+=Math.max(0,j.J-j.done)/P1;finishJob(j)}});
btn(gT,'Refill supplies',()=>{s.res.oxygen+=200;s.res.food+=300;s.res.water+=1000;s.res.spares+=20});showTab();
// flight bar (bottom)
const fl=$('ui');
[['w','fwd','▲ Speed up','+Y','▲ Forward'],['s','back','▼ Slow down','−Y','▼ Back'],['a','left','◀ Inward','−X','◀ Left'],['d','right','▶ Outward','+X','▶ Right'],['e','up','⤒ Tilt','+Z up','⤒ Up'],['q','down','⤓ Tilt','−Z down','⤓ Down']].forEach(([k,id,o,x,f])=>hold(fl,()=>(FP?f:XYZ?x:o)+'  '+KN(BIND[id]),k));
let TPV={az:.6,el:.4};
function toggleFP(){if(SV){SV=false;document.body.classList.remove('sv');drawArt()}FP=!FP;document.body.classList.toggle('fp',FP);if(FP){TPV={az,el};fi=0;ctl();const d=s.dom,g=gam(s),vx=s.vx/g-d.vx,vy=s.vy/g-d.vy,vz=s.vz/g-d.vz,v=Math.hypot(vx,vy,vz)||1;az=Math.atan2(vy,vx);el=Math.asin(vz/v)}else{az=TPV.az;el=TPV.el;cam.fov=55;cam.updateProjectionMatrix()}stabCapture()}
btn(fl,()=>camName()+'  '+KN(BIND.view),()=>cycleView());
btn(fl,()=>(SV?'🚀 Ship view ON':'🚀 Ship view')+'  '+KN(BIND.ship),()=>toggleSV());
btn(fl,()=>(STAB?'🧭 Stabilizer ON':'🧭 Stabilizer OFF')+'  '+KN(BIND.stab),()=>{STAB=!STAB;stabCapture()});
btn(fl,()=>FP?'Mode: where you look':(XYZ?'Mode: X/Y/Z':'Mode: orbit')+'  '+KN(BIND.mode),()=>XYZ=!XYZ);
btn(fl,()=>`🎥 ${FOC[fi].n}  ${KN(BIND.focus)}`,()=>setFocus(fi+1));btn(fl,'＋ Zoom',()=>zoom(1/1.5));btn(fl,'－ Zoom',()=>zoom(1.5));
btn(fl,()=>(det?'Less info':'More info')+'  '+KN(BIND.info),()=>det=!det);btn(fl,()=>'🎨 Customize  '+KN(BIND.custom),()=>$('cust').classList.toggle('h'));
btn(fl,()=>'📖 Guide & keys  '+KN(BIND.guide),()=>openGuide());
btn(fl,()=>'🔫 '+WEP[WI].n+'  '+KN(BIND.weapon),()=>cycleW());{const b=btn(fl,()=>'🔥 FIRE  '+KN(BIND.fire));b.onpointerdown=()=>fireDown();const up=()=>fireHeld=false;b.onpointerup=up;b.onpointerleave=up;b.onpointercancel=up}
btn(fl,()=>'🎯 Target  '+KN(BIND.target),()=>cycleT());btn(fl,()=>(s.shelter?'☢ IN SHELTER':'☢ Shelter')+'  '+KN(BIND.shelter),()=>toggleShelter());btn(fl,()=>'🧩 Dashboard  '+KN(BIND.wpal),()=>$('wpal').classList.toggle('h'));
$('ctrlclose').onclick=()=>$('ctrl').classList.add('h');
$('navbtn').onclick=()=>$('nav').classList.toggle('h');$('navclose').onclick=()=>$('nav').classList.add('h');
const sunDist=()=>{const S=B[0];return Math.hypot(s.x-S.x,s.y-S.y,s.z-S.z)};
function trip(rT){const S=B[0],vc=r=>Math.sqrt(S.GM/r);let dv=Math.abs(vc(rT)-vc(sunDist()));if(s.dom!==S){const o=elements();if(o.eps<0)dv+=escDv(o,di,PW,mass())}dv*=1.4; // real guided flights use ~26-30% more than the ideal; 40% safety margin
 const De=DR[di],m=mass(),dry=m-s.prop,need=dry*(Math.exp(dv/De.ve)-1),extra=Math.max(0,need-s.prop),F=De.k*PW/De.ve,t=dv/(F/(dry+need/2));return{dv,need,extra,t}}
const TGT=[['Venus distance',.723],['Mercury distance',.387],['Close to the Sun',.2],['Very close to the Sun',.1],['Back to Earth distance',1],['Mars distance',1.524]];
{const nb=$('navbody');let g=grp(nb,'CHOOSE A DESTINATION (distance from the Sun)');
 btn(g,()=>'☀ AS CLOSE TO THE SUN AS MY RESOURCES ALLOW  ('+KN(BIND.sun)+'): picks the best engine, buys fuel, flies',()=>{$('nav').classList.add('h');goSun()});
 TGT.forEach(([n,a])=>btn(g,()=>{const t=trip(a*AU);return `${n} · ${a} AU  ·  needs ~${f1(t.dv/1e3,1)} km/s, ${f1(t.need,0)} kg propellant (incl. 40% margin)`},()=>{AP={r:a*AU,name:n+' ('+a+' AU)',stage:''};apNote='';$('nav').classList.add('h')}));
 g=grp(nb,'ASTEROIDS: the autopilot matches their orbit and parks 1.5 km away, in mining range');
 AST.filter(a=>a.neo).forEach(a=>btn(g,()=>`${a.n} · ${a.t}-type (${TYN[a.t]}) · ${f1(a.r*2,0)} m wide · ${fmtD(astDist(a))} away`,()=>{$('nav').classList.add('h');flyAst(a)}));
 btn(g,()=>{const a=nearBelt();return `Nearest main-belt asteroid: ${a.n} · ${a.t}-type · ${f1(a.r*2,0)} m wide · ${fmtD(astDist(a))} away`},()=>{$('nav').classList.add('h');flyAst(nearBelt())});
 g=grp(nb,'PREPARE AND CONTROL');
 btn(g,()=>{if(!AP)return'⛽ Buy fuel for the trip (choose a destination first)';const x=tripExtra();return x>0?`⛽ Buy the fuel this trip needs: ~${f1(x,0)} kg ${DR[di].f?FUEL[DR[di].f].n.toLowerCase():''} · ${costTxt(DR[di].f,x)}`:'⛽ Fuel looks sufficient for this trip ✓ (check the projection)'},()=>{if(AP){const jb=buyFu(DR[di].f,Math.ceil(tripExtra()));if(jb)AP.wait=jb;PRED=null;PJ=null}},()=>AP&&tripExtra()>0&&canMake(DR[di].f,tripExtra()));
 btn(g,()=>{const d=stockDays();return inEarth()?`🫁 Stock up supplies for ${f1(d,0)} days (trip + 30%): ${stockTxt(d)}`:'🫁 Stock up: Earth orders only inside Earth’s gravity zone (make oxygen from water in 🏭 Fabricate)'},()=>stockUp(),()=>inEarth()&&!!stockTxt(stockDays()));
 btn(g,'⏹ Stop autopilot',()=>{AP=null;apNote='Autopilot stopped'},()=>!!AP);
 btn(g,'🎥 Point the camera at the Sun',()=>{setFocus(1);dist=400;$('nav').classList.add('h')});}
const TF={w:'Thrusting FORWARD, where you are looking (W)',s:'Thrusting BACK (S)',a:'Thrusting LEFT (A)',d:'Thrusting RIGHT (D)',e:'Thrusting UP (E)',q:'Thrusting DOWN (Q)'};
const TX={w:'Pushing along +Y (W)',s:'Pushing along −Y (S)',a:'Pushing along −X (A)',d:'Pushing along +X (D)',e:'Pushing along +Z, up (E)',q:'Pushing along −Z, down (Q)'};
const TIPS={w:'▲ SPEEDING UP: your orbit is growing (opposite side rises)',s:'▼ SLOWING DOWN: your orbit is shrinking (opposite side drops)',a:'◀ PUSHING INWARD toward the planet',d:'▶ PUSHING OUTWARD away from the planet',e:'⤒ TILTING your orbit',q:'⤓ TILTING your orbit'};
const DC=$('dust'),dctx=DC.getContext?DC.getContext('2d'):null,PART=Array.from({length:80},()=>({a:Math.random()*6.283,r:Math.random()*900,s:.5+Math.random()}));let dT=0;
function dust(now){if(!dctx)return;const dt=Math.min(.05,(now-dT)/1000);dT=now;if(DC.width!==innerWidth)DC.width=innerWidth;if(DC.height!==innerHeight)DC.height=innerHeight;const W=DC.width,H=DC.height;dctx.clearRect(0,0,W,H);
 const d=s.dom,g=gam(s),vx=s.vx/g-d.vx,vy=s.vy/g-d.vy,vz=s.vz/g-d.vz,v=Math.hypot(vx,vy,vz)||1;let dir=1;
 v3.set(vx/v,vy/v,vz/v).project(cam);if(v3.z>1){dir=-1;v3.set(-vx/v,-vy/v,-vz/v).project(cam)}const fx=(v3.x+1)/2*W,fy=(1-v3.y)/2*H,R=Math.hypot(W,H);
 const sp=paused?0:60*Math.max(0,Math.log10(v+1)-1)*(1+Math.log10(WARP[wi]/300+1))+(s.burn>0?220:0);dctx.lineWidth=1.3;
 for(const p of PART){p.r+=dir*sp*p.s*dt*(.25+p.r/R*2.5);if(p.r>R||p.r<3){p.r=dir>0?3+Math.random()*60:R*(.3+.7*Math.random());p.a=Math.random()*6.283}
  const c=Math.cos(p.a),sn=Math.sin(p.a),L=Math.min(80,3+sp*p.s*.05*(p.r/R*3)),x=fx+c*p.r,y=fy+sn*p.r;
  dctx.strokeStyle='rgba(190,235,255,'+Math.min(.75,.12+p.r/R)+')';dctx.beginPath();dctx.moveTo(x,y);dctx.lineTo(x-dir*c*L,y-dir*sn*L);dctx.stroke()}}
function radar(){const cv=$('radar');if(!cv.getContext)return;const c=cv.getContext('2d'),W=cv.width,H=cv.height,cx=W/2,cy=H*.6,RX=W*.46,RY=H*.62;c.clearRect(0,0,W,H);
 c.strokeStyle='rgba(127,211,255,.35)';c.lineWidth=1;for(const k of[.33,.66,1]){c.beginPath();c.ellipse(cx,cy,RX*k,RY*k*.62,0,0,6.283);c.stroke()}
 c.beginPath();c.moveTo(cx,cy);c.lineTo(cx-RX*.62,cy-RY*.55);c.moveTo(cx,cy);c.lineTo(cx+RX*.62,cy-RY*.55);c.stroke();
 const F=FPV(),f=F.w,r=F.d,u=F.e,plot=(dx,dy,dz,col,lab)=>{const D=Math.hypot(dx,dy,dz)||1,fx=dx*f[0]+dy*f[1]+dz*f[2],rx=dx*r[0]+dy*r[1]+dz*r[2],ux=dx*u[0]+dy*u[1]+dz*u[2],h=Math.hypot(fx,rx)||1,
  rr=Math.max(.1,Math.min(1,(Math.log10(D)-6)/7)),x=cx+rx/h*rr*RX,y=cy-fx/h*rr*RY*.62,st=Math.max(-16,Math.min(16,-ux/D*16));
  c.strokeStyle=col;c.beginPath();c.moveTo(x,y);c.lineTo(x,y+st);c.stroke();c.fillStyle=col;c.beginPath();c.arc(x,y+st,3,0,6.283);c.fill();if(lab){c.font='9px monospace';c.fillText(lab,x+5,y+st-3)}};
 B.forEach(b=>plot(b.x-s.x,b.y-s.y,b.z-s.z,'#'+b.c.toString(16).padStart(6,'0'),b.n));
 const d=s.dom,g=gam(s);plot((s.vx/g-d.vx)*1e9,(s.vy/g-d.vy)*1e9,(s.vz/g-d.vz)*1e9,'#44ff88','▲');
 c.fillStyle='#ffb84d';c.beginPath();c.moveTo(cx,cy-6);c.lineTo(cx-5,cy+5);c.lineTo(cx+5,cy+5);c.fill()}
const GOALS=[['Combat drill: press 0 to call in raiders, then fire with keys 1–5 (2 = pulse laser, 5 = missiles)',()=>s.raid.best>=1],
 ['Build solar panels until you have 100 m² (🛠 → 🏭 Fabricate)',()=>s.area>=100],
 ['Install a low-temperature radiator, so the ion engine can run at full power without overheating',()=>s.parts.some(p=>p.id==='rad_lo')],
 ['Research your first technology (🛠 → 🔬 Research)',()=>Object.keys(s.tech).length>0],
 ['Raise your orbit: get its highest point above 2,000 km',()=>{if(s.dom!==B[3])return true;const o=elements();return o.eps>=0||o.a*(1+o.ec)-B[3].R>2e6}],
 ["Stock up (xenon, oxygen, food) and escape Earth's gravity",()=>s.dom===B[0]],
 ['Reach a near-Earth asteroid (🧭 NAVIGATE → Asteroids)',()=>AST.some(a=>a.neo&&astDist(a)<1e4)],
 ['Mine 1 tonne of material (mining laser + 🔥 FIRE)',()=>s.mined>=1000],
 ['Make rocket fuel or oxygen from asteroid water',()=>!!s.madeW],
 ['Build a component you researched (🛠 → 🏭 Fabricate)',()=>Object.keys(s.codex.built).some(k=>PARTS[k]&&PARTS[k].req)],
 ['Survive a solar proton storm',()=>!!s.codex.seen.flare1],['Reach Venus distance from the Sun (0.72 AU)',()=>sunDist()<.73*AU],
 ['Build a fusion reactor or fusion drive',()=>isU('fus')||isU('icf')||s.parts.some(p=>p.id.startsWith('fus_'))],['Reach Mercury distance (0.39 AU)',()=>sunDist()<.395*AU],
 ['Build an antimatter drive',()=>isU('am')||isU('beam')],['Go relativistic: reach 0.1c',()=>gam(s)>1.005],['Reach the speed limit: 0.99c',()=>gam(s)>7]];let gi=0;
function cockpitUI(){while(gi<GOALS.length&&GOALS[gi][1]())gi++;
 $('obj').innerHTML=gi<GOALS.length?'<b>◆ OBJECTIVE '+(gi+1)+'/'+GOALS.length+'</b><br>'+GOALS[gi][0]:'<b>◆ ALL OBJECTIVES COMPLETE</b><br>Free flight';
 if(SV){const W=Math.sqrt(s.area/CUST.wings/3);$('svname').textContent=CUST.name.toUpperCase()+'  ·  '+DR[di].n+' at '+sci(PW)+' W\n'+f1(s.area,0)+' m² of solar panels as '+arrLayout()+'  ·  tanks: '+(['chem','xe','h2','fus','am'].filter(f=>s.fuel[f]>=.01).map(f=>f1(s.fuel[f],s.fuel[f]<10?2:0)+' kg '+FUEL[f].n.toLowerCase()).join(', ')||'empty')+'\nshown at true scale · buy panels or fuel, or change engine power, and watch the ship change · '+KN(BIND.custom)+' to customize'}
 if(!FP&&!DASH.third)return;const d=s.dom,g=gam(s),S=B[0],vr=Math.hypot(s.vx/g-d.vx,s.vy/g-d.vy,s.vz/g-d.vz),sf=Math.hypot(s.vx/g-S.vx,s.vy/g-S.vy,s.vz/g-S.vz),m=mass(),De=DR[di],inc=s.lit?perM2()*s.area:0,o=elements();
 $('dl').innerHTML=`<h5>FLIGHT</h5><div class="big">${f1(vr/1e3,2)}<span style="font-size:13px"> km/s</span></div>relative to ${d.n} · alt ${km(o.r-d.R)}<br>Sun frame ${f1(sf/1e3,2)} km/s<br>β ${Math.sqrt(1-1/(g*g)).toFixed(6)} · γ ${g.toFixed(4)}<br>ship clock ${fT(s.tau)}`;
 $('dr').innerHTML=`<h5>SYSTEMS</h5>ENERGY ${sci(s.en)} J<div class="bar"><i style="width:${Math.min(100,Math.log10(1+s.en)/18*100)}%"></i></div>SOLAR ${s.lit?'+'+sci(inc)+' W':'IN SHADOW'} (engine uses ${sci(PW)} W)<div class="bar"><i style="width:${Math.min(100,inc/PW*100)}%"></i></div>PROPELLANT ${f1(s.prop,0)} kg<div class="bar"><i style="width:${s.prop/m*100}%"></i></div>${De.n.toUpperCase()} · ${s.burn>0?'<b style="color:#ffb84d">● BURN '+(s.burn*100).toFixed(0)+'%</b>':'○ idle'} · ${f1(m,0)} kg<br>${STAB?'🧭 STABILIZER ON · 50 W':'stabilizer off'}`;
 $('status').textContent=$('fb').textContent;radar()}
function refreshUI(){for(const r of regs){const t=r.label();if(r.html){if(r.b._h!==t){r.b._h=t;r.b.innerHTML=t}}else if(r.b._t!==t){r.b._t=t;r.b.textContent=t}r.b.disabled=r.en?!r.en():false}
 const o=elements(),d=o.d,g=gam(s),S=B[0],spd=Math.hypot(s.vx/g-S.vx,s.vy/g-S.vy,s.vz/g-S.vz),rs=Math.hypot(s.x-S.x,s.y-S.y,s.z-S.z),inc=s.lit?perM2()*s.area:0;
 $('stats').innerHTML=`<div><small>BATTERY</small><b>${pct(s.en/SH.cap)} of ${sci(SH.cap)} J</b><small>${s.lit?'+'+sci(inc)+' W from the Sun':'in shadow: no sunlight'}</small></div><div><small>SOLAR PANELS</small><b>${f1(s.area,0)} m²</b><small>${s.jobs.length?s.jobs.length+' fabrication job'+(s.jobs.length>1?'s':''):'fabricator idle'}</small></div><div><small>CREW</small><b>${s.crew.alive?'❤ '+Math.round(s.crew.hp)+'%':'☠'}</b><small>${ALERTS.length?(ALERTS.some(a=>a.l==='crit')?'🔴 ':'🟡 ')+ALERTS.length+' alert'+(ALERTS.length>1?'s':''):'🟢 all nominal'}</small></div><div><small>VELOCITY</small><b>${f1(spd/1e3,2)} km/s</b><small>${f1(o.v/1e3,2)} km/s around ${d.n}</small></div><div><small>MASS</small><b>${f1(mass(),1)} kg</b><small>propellant ${f1(s.prop,1)} kg</small></div>`;
 $('shophead').innerHTML=`Battery <b>${pct(s.en/SH.cap)}</b> (${sci(s.en)} of ${sci(SH.cap)} J) · generating <b>${sci(s.genNow)} W</b>, systems use ${sci(s.loadNow)} W · ${s.jobs.length} fabrication jobs · ${f1(s.rp,0)} research points · ship ${f1(mass(),0)} kg`;
 const k=['w','s','a','d','e','q'].find(x=>K[x]),orbit=o.eps<0&&g<1.05?`Orbit around ${d.n}: lowest point ${km(o.a*(1-o.ec)-d.R)} · highest point ${km(o.a*(1+o.ec)-d.R)}`:o.eps>=0?`Escaping ${d.n}!`:`Moving at ${(Math.sqrt(1-1/(g*g))).toFixed(4)} c`;
 let m;if(k){m=s.prop<=0?'⚠ Out of propellant: buy more with 🛠 ENGINEERING':s.en<=0?'⚠ Battery empty: wait in sunlight (try ⏩ Faster) or buy panels':(FP?TF:XYZ?TX:TIPS)[k]+(s.burn>0&&s.burn<1?'  (limited by energy)':'')}
 else m=FP?'1st person: W forward (where you look) · S back · A/D left/right · E/Q up/down · drag to look · V back to 3rd person':XYZ?'X/Y/Z mode: W/S push ±Y, A/D push ∓X/±X, E/Q push ±Z (see colored axes on your ship) · M switches to orbit mode':'Orbit mode: hold W to speed up · S to slow down · M switches to X/Y/Z mode';
 if(!k&&AP)m='🧭 AUTOPILOT → '+AP.name+': '+AP.stage+'\n'+(s.prop<=0?'⚠ Out of propellant, autopilot waiting. Buy more with 🛠 ENGINEERING':s.burn<=0?'⚠ Engine idle: battery empty, waiting for sunlight (buy more panels to go faster)':s.burn<1?'Engine limited by energy: more panels = faster trip':'Engine at full power')+' · now '+(sunDist()/AU).toFixed(3)+' AU from the Sun';
 else if(!k&&apNote)m=apNote+'\n'+m;
 $('fb').textContent=m+'\n'+orbit;
 const inc2=s.lit?perM2()*s.area:0;
 $('navhead').innerHTML=`Now: <b>${(sunDist()/AU).toFixed(3)} AU</b> from the Sun, ${s.dom===B[0]?'orbiting the Sun':'inside '+s.dom.n+'\'s gravity'}. Engine: ${DR[di].n} at ${sci(PW)} W; panels supply ${sci(inc2)} W${DR[di].el&&inc2<PW?' <b style="color:#ff8a00">(less than the engine uses, so burns will be slower; buy panels)</b>':''}.<br>Autopilot: <b>${AP?'ON → '+AP.name:'off'}</b>${AP?'<br>Estimated burn time: '+fT(trip(AP.r||sunDist()).t)+' of game time':''}`;
 if(typeof $('top').offsetHeight=='number'){$('hud').style.top=($('top').offsetHeight+16)+'px';$('fb').style.bottom=($('ui').offsetHeight+16)+'px';$('obj').style.top=($('top').offsetHeight+16)+'px'}
 cockpitUI();apWatch();navTick();$('wpn').textContent='🔫 '+wTxt()+(wMsg?'  '+wMsg:'');wMsg='';uiExtra()}
addEventListener('blur',()=>{for(const k in K)K[k]=0});addEventListener('pointerdown',()=>window.focus());
addEventListener('resize',()=>{R.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()});
// HUD
const f1=(x,n=1)=>x.toLocaleString(undefined,{maximumFractionDigits:n}),km=m=>f1(m/1e3,0)+' km';
const sci=x=>x.toExponential(2),fT=t=>{const y=Math.floor(t/31557600),d=Math.floor(t%31557600/86400),h=Math.floor(t%86400/3600);return(y?y+'y ':'')+d+'d '+h+'h'};
const dur=t=>t<60?f1(t,1)+' s':t<3600?f1(t/60,1)+' min':t<86400?f1(t/3600,1)+' h':t<31557600?f1(t/86400,1)+' d':f1(t/31557600,2)+' y';
function hud(el_){const o=elements(),d=o.d,sun=B[0],rx=s.x-sun.x,ry=s.y-sun.y,rz=s.z-sun.z,rs=Math.hypot(rx,ry,rz),fl=S0*(AU/rs)**2,m=mass(),g=gam(s),beta=Math.sqrt(1-1/(g*g)),De=DR[di],F=De.k*PW/De.ve,
 vx=s.vx/g-sun.vx,vy=s.vy/g-sun.vy,vz=s.vz/g-sun.vz,spd=Math.hypot(vx,vy,vz),
 ke=m*(g-1)*C*C,need=m*(1/Math.sqrt(1-MAXB*MAXB)-1)*C*C,bmax=Math.tanh(Math.atanh(beta)+De.ve/C*Math.log(m/(m-s.prop))),sync=Math.cbrt(d.GM*(d.rot/6.2832)**2),au=x=>(x/AU).toFixed(4),kms=x=>f1(x/1e3,2);
 let orb;if(beta>.05)orb='(elements hidden: relativistic)';else if(o.eps<0)orb=`a ${km(o.a)}  e ${o.ec.toFixed(4)}  T ${f1(6.2832*Math.sqrt(o.a**3/d.GM)/3600,2)} h\nPe ${km(o.a*(1-o.ec)-d.R)}  Ap ${km(o.a*(1+o.ec)-d.R)} alt`;else orb=`ESCAPE e ${o.ec.toFixed(3)}`;
 $('rate').textContent=(paused?'⏸ PAUSED · ':'')+'1 s = '+dur(WARP[wi]);
 el_.textContent=det?`── TIME ──
Game ${fT(T)}
Ship ${fT(s.tau)} (lag ${fT(T-s.tau)})
Rate 1 real s = ${dur(WARP[wi])} game${paused?'  [PAUSED]':''}
── POSITION (Sun frame) ──
x ${au(rx)}  y ${au(ry)}  z ${au(rz)} AU
Sun dist ${au(rs)} AU  flux ${f1(fl,0)} W/m²
${d.n}: alt ${km(o.r-d.R)}
── VELOCITY ──
Speed ${kms(spd)} km/s (${(spd/C).toExponential(2)} c)
vx ${kms(vx)} vy ${kms(vy)} vz ${kms(vz)} km/s
vs ${d.n}: ${kms(o.v)} km/s
β ${beta.toFixed(6)}  γ ${g.toFixed(4)}
── MASS ──
Total ${f1(m,1)} kg
 dry ${s.dry} + panels ${f1(.2*s.area,1)} + prop ${f1(s.prop,1)}
── ENERGY ──
Stored ${sci(s.en)} J${s.burn?' [BURN '+(s.burn*100).toFixed(0)+'%]':''}
Panels ${f1(s.area,0)} m² ${s.lit?'→ '+sci(fl*s.area*EFF)+' W':'ECLIPSE'}
KE ${sci(ke)} J  to 0.99c ${sci(need)} J
── DRIVE ──
${De.n} ve ${sci(De.ve)} m/s  ${sci(PW)} W → ${sci(F)} N
accel ${sci(F/m)} m/s²  max β ${bmax.toFixed(5)}
── ORBIT ──
${orb}
Sync radius ${km(sync)}
keys held: ${Object.keys(K).filter(k=>K[k]).join(' ')||'none'}
${s.msg}`:`${ALERTS.length?ALERTS.slice(0,5).map(a=>(a.l==='crit'?'🔴 ':'🟡 ')+a.t).join('\n')+'\n────\n':''}Velocity ${kms(spd)} km/s\nMass ${f1(m,1)} kg\nGame time ${fT(T)}\nShip clock ${fT(s.tau)}\n── ${d.n.toUpperCase()} ORBIT ──\nAltitude ${km(o.r-d.R)}\n${orb}\n\nPress H for full readout`}
// ellipse of osculating orbit
function drawOrbit(o,fp){if(!(o.eps<0)||!(o.ec<.9999)){eline.visible=false;return}eline.visible=true;const d=o.d,a=o.a,e=o.ec,b=a*Math.sqrt(1-e*e);
 let P=e>1e-7?o.e.map(v=>v/e):[(s.x-d.x)/o.r,(s.y-d.y)/o.r,(s.z-d.z)/o.r];const hn=o.h.map(v=>v/o.hh),Q=[hn[1]*P[2]-hn[2]*P[1],hn[2]*P[0]-hn[0]*P[2],hn[0]*P[1]-hn[1]*P[0]];
 for(let k=0;k<=180;k++){const t=k/180*6.2832,X=a*(Math.cos(t)-e),Y=b*Math.sin(t);
  ep[k*3]=(d.x-fp.x+P[0]*X+Q[0]*Y)/U;ep[k*3+1]=(d.y-fp.y+P[1]*X+Q[1]*Y)/U;ep[k*3+2]=(d.z-fp.z+P[2]*X+Q[2]*Y)/U}eg.attributes.position.needsUpdate=true}
// loop
let last=performance.now(),fc=0;const v3=new THREE.Vector3();
function frame(now){requestAnimationFrame(frame);let rem=MP.role==='guest'&&MP.conn?guestRem(now):Math.min((now-last)/1000,.1)*(paused?0:WARP[wi]),n=0;last=now;const T0f=T;
 while(rem>1e-9&&n++<5000){const dt=Math.min(rem,.02*ctl(),600,apDt());step(dt);rem-=dt;T+=dt}
 worldTick(T-T0f,now);survivalTick(T-T0f);ctl();{const d=s.dom,r=Math.hypot(s.x-d.x,s.y-d.y,s.z-d.z);if(r<d.R){const k=d.R/r;s.x=d.x+(s.x-d.x)*k;s.y=d.y+(s.y-d.y)*k;s.z=d.z+(s.z-d.z)*k;s.vx=d.vx;s.vy=d.vy;s.vz=d.vz;s.msg='Landed / crashed on '+d.n}else s.msg=''}
 if(FP||SV)fi=0;if(STAB&&(FP||SV||fi==0))stabApply();else stabCapture();const fp=FOC[fi];
 ALL.forEach((b,i)=>{if(i>N)return;const x=(b.x-fp.x)/U,y=(b.y-fp.y)/U,z=(b.z-fp.z)/U;mp.set([x,y,z],i*3);if(i<N)meshes[i].position.set(x,y,z);if(i==0)light.position.set(x,y,z);
  if(i&&i<N){const P=B[b.p];rings[i].position.set((P.x-fp.x)/U,(P.y-fp.y)/U,(P.z-fp.z)/U)}});
 mg.attributes.position.needsUpdate=true;drawOrbit(elements(),fp);astDraw(fp);pathDraw(fp);mpDraw(fp);
 {const ox=mp[N*3],oy=mp[N*3+1],oz=mp[N*3+2],d=s.dom,g=gam(s),vx=s.vx/g-d.vx,vy=s.vy/g-d.vy,vz=s.vz/g-d.vz,v=Math.hypot(vx,vy,vz)||1,L=dist*.3,dv=dirVec();
  arV.visible=fi==0&&!FP&&!SV;VD=[vx/v,vy/v,vz/v];setA(arV,ox,oy,oz,[vx/v,vy/v,vz/v],L);arT.visible=fi==0&&!FP&&!SV&&!!dv&&s.burn>0;if(dv)setA(arT,ox,oy,oz,dv,L*.7);
  axL.forEach((l,i)=>{l.visible=fi==0&&XYZ&&!FP&&!SV;setA(l,ox,oy,oz,AXV[i],L*.6);axTip[i]=[ox+AXV[i][0]*L*.6,oy+AXV[i][1]*L*.6,oz+AXV[i][2]*L*.6]})}
 if(SV){const q_=dirAE();cam.position.set(0,0,0);cam.lookAt(-q_[0],-q_[1],-q_[2])}else if(FP){cam.position.set(0,0,0);cam.lookAt(Math.cos(el)*Math.cos(az),Math.cos(el)*Math.sin(az),Math.sin(el))}else{cam.position.set(dist*Math.cos(el)*Math.cos(az),dist*Math.cos(el)*Math.sin(az),dist*Math.sin(el));cam.lookAt(0,0,0)}cam.updateMatrixWorld();
 {const xh=$('xh'),pl=$('prol');xh.classList.toggle('h',!FP);pl.classList.toggle('h',!FP);
  if(FP){mp[N*3+2]=1e8;v3.set(VD[0],VD[1],VD[2]).project(cam);pl.style.display=v3.z>1?'none':'';pl.style.left=(v3.x+1)/2*innerWidth+'px';pl.style.top=(1-v3.y)/2*innerHeight+'px'}}
 axN.forEach((n,i)=>{if(!axL[i].visible){n.style.display='none';return}v3.set(...axTip[i]).project(cam);n.style.display=v3.z>1?'none':'';n.style.left=(v3.x+1)/2*innerWidth+'px';n.style.top=(1-v3.y)/2*innerHeight+'px'});
 ALL.forEach((b,i)=>{if(i>N)return;const l=labs[i];if((FP||SV)&&i==N){l.style.display='none';return}v3.set(mp[i*3],mp[i*3+1],mp[i*3+2]).project(cam);
  if(!FP){if(l.className!=='l'){l.className='l';l.textContent=b.n}if(v3.z>1||v3.z<-1){l.style.display='none';return}l.style.display='';l.style.left=(v3.x+1)/2*innerWidth+'px';l.style.top=(1-v3.y)/2*innerHeight+'px';return}
  const D=Math.hypot(b.x-s.x,b.y-s.y,b.z-s.z)-b.R;let x=v3.x,y=v3.y;const beh=v3.z>1;if(beh){x=-x;y=-y}
  const k=Math.max(Math.abs(x)/.9,y>0?y/.78:-y/.42),off=beh||k>1;if(off){x/=k;y/=k}
  l.className='l mk';l.style.display='';l.textContent=(off?'➤ ':'◇ ')+b.n+' · '+(D>1e9?(D/AU).toFixed(3)+' AU':km(D));
  l.style.left=(x+1)/2*innerWidth+'px';l.style.top=(1-y)/2*innerHeight+'px'});
 if(FP)dust(now);if(SV)mp[N*3+2]=1e8;astLabels();mpLabels();
 funTick(now);if(fc++%4==0){hud($('hud'));refreshUI();cbUI();ORB.emit('ui')};vividPlanetTick();R.clear();R.render(sc,cam);{const CL=ssPrep();vividDebrisTick(now);if(CL){R.clearDepth();R.render(SS,SC)}cfxDraw(CL,now);ORB.emit('frame',now,CL)}}

