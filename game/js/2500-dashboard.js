// ===== COCKPIT DASHBOARD: widgets you can move, resize, add and remove; several saved layouts =====
const WL=document.createElement('div');WL.id='wl';document.body.appendChild(WL);const PARK=document.createElement('div');PARK.style.display='none';document.body.appendChild(PARK);
const HULA=`<svg viewBox="0 0 100 150"><ellipse cx="50" cy="143" rx="30" ry="5" fill="#5a3a20"/><rect x="34" y="132" width="32" height="10" rx="3" fill="#8a5d34"/>
<path d="M45 133 L47 104 M55 133 L53 104" stroke="#c98b5e" stroke-width="5" stroke-linecap="round"/>
<g class="hs"><path d="M33 98 L67 98 L74 124 L26 124 Z" fill="#3fa34d"/><path d="M36 100 L31 124 M42 100 L39 124 M48 100 L47 124 M54 100 L55 124 M60 100 L63 124 M65 100 L70 124" stroke="#2b7a36" stroke-width="2"/><rect x="33" y="96" width="34" height="5" rx="2" fill="#f7c948"/></g>
<g class="ht"><rect x="42" y="62" width="16" height="36" rx="7" fill="#c98b5e"/><path d="M41 69 Q50 75 59 69 L59 78 Q50 83 41 78 Z" fill="#e8508f"/>
<g class="al"><path d="M43 66 Q31 60 27 46" stroke="#c98b5e" stroke-width="4.5" fill="none" stroke-linecap="round"/></g><g class="ar"><path d="M57 66 Q69 60 73 46" stroke="#c98b5e" stroke-width="4.5" fill="none" stroke-linecap="round"/></g>
<circle cx="44" cy="62" r="2.6" fill="#ff6fae"/><circle cx="48" cy="64" r="2.6" fill="#ffd84d"/><circle cx="52" cy="64" r="2.6" fill="#ff6fae"/><circle cx="56" cy="62" r="2.6" fill="#7dffb0"/>
<path d="M39 52 Q38 34 50 35 Q62 34 61 52 Q63 66 57 72 L57 54 Q50 47 43 54 L43 72 Q37 66 39 52 Z" fill="#2b1a10"/><circle cx="50" cy="50" r="9.5" fill="#c98b5e"/><circle cx="46.5" cy="49" r="1.2" fill="#2b1a10"/><circle cx="53.5" cy="49" r="1.2" fill="#2b1a10"/><path d="M46 54 Q50 57 54 54" stroke="#7a3b2b" stroke-width="1.3" fill="none"/><circle cx="59" cy="42" r="3.5" fill="#ff6fae"/><circle cx="59" cy="42" r="1.3" fill="#ffd84d"/></g></svg>`;
const DICE=`<svg viewBox="0 0 100 150"><line x1="50" y1="0" x2="50" y2="20" stroke="#ddd" stroke-width="1.5"/><g class="dg"><line x1="50" y1="20" x2="38" y2="70" stroke="#ddd" stroke-width="1.5"/><line x1="50" y1="20" x2="62" y2="80" stroke="#ddd" stroke-width="1.5"/>
<g transform="rotate(-12 38 82)"><rect x="24" y="68" width="28" height="28" rx="7" fill="#ff4fa3" stroke="#ff9ccc" stroke-width="3" stroke-dasharray="2 2"/><circle cx="31" cy="75" r="2.6" fill="#fff"/><circle cx="38" cy="82" r="2.6" fill="#fff"/><circle cx="45" cy="89" r="2.6" fill="#fff"/></g>
<g transform="rotate(10 62 92)"><rect x="48" y="78" width="28" height="28" rx="7" fill="#4fd2ff" stroke="#a8ecff" stroke-width="3" stroke-dasharray="2 2"/><circle cx="55" cy="85" r="2.6" fill="#fff"/><circle cx="69" cy="85" r="2.6" fill="#fff"/><circle cx="55" cy="99" r="2.6" fill="#fff"/><circle cx="69" cy="99" r="2.6" fill="#fff"/></g></g></svg>`;
const PLANT=`<svg viewBox="0 0 100 150"><path d="M30 105 L70 105 L64 140 L36 140 Z" fill="#b5653a"/><rect x="28" y="100" width="44" height="8" rx="2" fill="#c97a4c"/><g class="lv"><path d="M50 102 L50 60" stroke="#3a8a3a" stroke-width="3"/>
<path class="lf" d="M50 85 Q30 78 26 64 Q42 66 50 80" fill="#4caf50"/><path class="lf" d="M50 78 Q70 70 74 56 Q58 58 50 72" fill="#4caf50"/><path class="lf" d="M50 64 Q38 50 42 38 Q52 48 50 60" fill="#5fc35f"/><path class="lf" d="M50 62 Q64 48 62 36 Q52 46 50 58" fill="#5fc35f"/></g><text x="50" y="22" text-anchor="middle" fill="#cfefff" font-size="9" class="pm">happy</text></svg>`;
const WDEF={flight:{t:'✈ Flight',w:19,h:24,draw:b=>{b.innerHTML=$('dl').innerHTML}},scanner:{t:'📡 Scanner',w:22,h:26,make:b=>b.appendChild($('radar')),park:'radar'},
 systems:{t:'⚙ Systems',w:19,h:24,draw:b=>{b.innerHTML=$('dr').innerHTML}},nav:{t:'🧭 Navigation',w:27,h:16,draw:b=>{b.innerHTML=AP?$('navinfo').innerHTML:'Autopilot off. 🧭 NAVIGATE picks a destination.'}},
 weapons:{t:'🔫 Weapons',w:26,h:10,draw:b=>{b.textContent=$('wpn').textContent}},objective:{t:'◆ Objective',w:23,h:9,draw:b=>{b.innerHTML=$('obj').innerHTML}},
 status:{t:'🔧 Ship status',w:24,h:34,draw:b=>{b.innerHTML=statusHtml()}},power:{t:'⚡ Power bus',w:22,h:20,draw:b=>{b.innerHTML=powerHtml()}},thermal:{t:'🌡 Thermal',w:22,h:20,draw:b=>{b.innerHTML=thermalHtml()}},
 life:{t:'🫁 Life support & crew',w:30,h:24,draw:b=>{b.innerHTML=lifeHtml()}},alerts:{t:'⚠ Alerts',w:28,h:22,draw:b=>{b.innerHTML=ALERTS.length?ALERTS.map(a=>(a.l==='crit'?'🔴 ':'🟡 ')+a.t).join('<br>'):'🟢 All systems nominal'}},
 why:{t:'🧠 Design analyzer',w:28,h:32,draw:b=>{b.innerHTML=whyTxt()}},burn:{t:'🔥 Burn preview',w:28,h:22,make:(b,it)=>{it.cv=document.createElement('canvas');b.appendChild(it.cv)},draw:(b,it)=>{const W=Math.max(120,b.clientWidth-16||260),H=Math.max(60,b.clientHeight-14||120);it.cv.width=W;it.cv.height=H;burnCurve(it.cv)}},
 g_speed:{t:'📈 Speed vs nearby body',w:16,h:18,graph:['v','km/s','#5fe0ff']},g_acc:{t:'📈 Thrust acceleration',w:16,h:18,graph:['a','m/s²','#ff9a3d']},g_power:{t:'📈 Power: made / used',w:22,h:18,graph:['gen','kW','#5dff8a','load','#ff6a5a']},
 g_batt:{t:'📈 Battery',w:16,h:18,graph:['bat','%','#ffd84d']},g_heat:{t:'📈 Loop temperatures',w:22,h:18,graph:['tlo','K','#7fd3ff','thi','#ff6a5a']},g_fuel:{t:'📈 Fuel (selected engine)',w:16,h:18,graph:['fuel','kg','#b18cff']},g_dose:{t:'📈 Radiation',w:22,h:18,graph:['dose','mSv/day','#ff5cf0']},
 inv:{t:'⛏ Inventory',w:27,h:22,draw:b=>{b.innerHTML=invHtml(true)}},jobs:{t:'🏭 Fabrication',w:24,h:20,draw:b=>{b.innerHTML=jobsHtml(true)}},research:{t:'🔬 Research',w:20,h:14,draw:b=>{b.innerHTML=researchMini()}},clock:{t:'🕐 Clocks',w:22,h:14,draw:b=>{b.innerHTML=clockHtml()}},
 hula:{t:'🌺 Hula dancer',w:9,h:22,fun:true,make:b=>{b.innerHTML=HULA}},dice:{t:'🎲 Fuzzy dice',w:7,h:20,fun:true,make:b=>{b.innerHTML=DICE}},plant:{t:'🪴 Cabin plant',w:9,h:20,fun:true,make:b=>{b.innerHTML=PLANT}}};
const DEFL={Flight:[['flight',1,60,19,24],['scanner',39,68,22,26],['systems',80,60,19,24],['nav',1,14,27,16],['hula',22,72,9,22],['g_speed',63,74,16,18],['objective',76,14,23,9]],
 Engineering:[['status',1,14,24,36],['power',26,14,22,20],['thermal',49,14,22,20],['why',72,14,27,32],['jobs',1,52,24,22],['g_heat',26,36,22,18],['g_power',49,36,22,18],['inv',72,48,27,24],['plant',26,56,9,20]],
 Navigation:[['nav',1,14,30,18],['scanner',36,58,28,36],['flight',1,64,22,24],['burn',71,14,28,24],['g_speed',71,40,28,18],['clock',71,60,28,12],['dice',31,14,7,20]],
 Emergency:[['alerts',1,14,30,24],['life',32,14,32,30],['thermal',65,14,22,22],['power',65,38,22,22],['status',1,40,30,32],['g_dose',32,46,32,18]],Custom:[['flight',1,60,19,24],['hula',22,72,9,22]]};
let DASH={cur:'Flight',third:false,L:{}};try{const v=JSON.parse(localStorage.getItem('orbital-dash3')||'null');if(v&&v.L)DASH=v}catch(e){}
for(const k in DEFL)if(!DASH.L[k])DASH.L[k]=DEFL[k].map(a=>({id:a[0],x:a[1],y:a[2],w:a[3],h:a[4]}));
const saveDash=()=>{try{localStorage.setItem('orbital-dash3',JSON.stringify({cur:DASH.cur,third:DASH.third,L:Object.fromEntries(Object.entries(DASH.L).map(([k,v])=>[k,v.map(({id,x,y,w,h})=>({id,x,y,w,h}))]))}))}catch(e){}};
let LIVE=[];
function dashBuild(){LIVE.forEach(it=>{const d=WDEF[it.id];if(d&&d.park)PARK.appendChild($(d.park))});WL.innerHTML='';LIVE=[];(DASH.L[DASH.cur]||[]).forEach(mkW);document.body.classList.toggle('dash3',!!DASH.third)}
function mkW(it){const d=WDEF[it.id];if(!d)return;const w=document.createElement('div');w.className='wdg'+(d.fun?' fun':'');const hd=document.createElement('div');hd.className='wh';hd.innerHTML='<span>'+d.t+'</span><b class="wx" title="remove">✕</b>';
 const bd=document.createElement('div');bd.className='wb';const rz=document.createElement('div');rz.className='wr';w.appendChild(hd);w.appendChild(bd);w.appendChild(rz);WL.appendChild(w);it.el=w;it.body=bd;
 if(d.make)d.make(bd,it);if(d.graph){it.cv=document.createElement('canvas');bd.appendChild(it.cv)}place(it);LIVE.push(it);
 hd.onpointerdown=e=>{if(e.target&&e.target.className==='wx'){remW(it);return}dragW(e,it,'move')};rz.onpointerdown=e=>dragW(e,it,'size')}
function place(it){const st=it.el.style;st.left=it.x+'%';st.top=it.y+'%';st.width=it.w+'%';st.height=it.h+'%'}
function dragW(e,it,mode){e.preventDefault();e.stopPropagation();const x0=e.clientX,y0=e.clientY,a={x:it.x,y:it.y,w:it.w,h:it.h};
 const mv=ev=>{const dx=(ev.clientX-x0)/innerWidth*100,dy=(ev.clientY-y0)/innerHeight*100;if(mode==='move'){it.x=Math.max(0,Math.min(100-it.w,a.x+dx));it.y=Math.max(0,Math.min(100-it.h,a.y+dy))}else{it.w=Math.max(5,Math.min(100-it.x,a.w+dx));it.h=Math.max(6,Math.min(100-it.y,a.h+dy))}place(it)};
 const up=()=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up);saveDash()};addEventListener('pointermove',mv);addEventListener('pointerup',up)}
function remW(it){const d=WDEF[it.id];if(d.park)PARK.appendChild($(d.park));it.el.remove();LIVE.splice(LIVE.indexOf(it),1);const L=DASH.L[DASH.cur];L.splice(L.indexOf(it),1);saveDash()}
function addW(id){const d=WDEF[id],it={id,x:30+Math.random()*20,y:25+Math.random()*20,w:d.w||20,h:d.h||18};if(d.park&&LIVE.some(q=>q.id===id)){notify('There is only one '+d.t+'.');return}DASH.L[DASH.cur].push(it);mkW(it);saveDash()}
function nextLayout(){const ks=Object.keys(DASH.L);DASH.cur=ks[(ks.indexOf(DASH.cur)+1)%ks.length];dashBuild();saveDash();notify('🧩 Cockpit layout: '+DASH.cur+(FP?'':' (visible in 1st person, key '+KN(BIND.view)+')'))}
function dashDraw(){if(!(FP||DASH.third))return;for(const it of LIVE){const d=WDEF[it.id];try{if(d.draw)d.draw(it.body,it);if(d.graph)drawGraph(it.cv,it.body,d.graph)}catch(e){}}}
{const pb=$('wpalb');let g2=grp(pb,'LAYOUTS (each one remembers its own widgets)');Object.keys(DASH.L).forEach(k=>btn(g2,()=>(DASH.cur===k?'● ':'○ ')+k,()=>{DASH.cur=k;dashBuild();saveDash()}));
 btn(g2,'↺ Reset this layout to default',()=>{if(DEFL[DASH.cur]){DASH.L[DASH.cur]=DEFL[DASH.cur].map(a=>({id:a[0],x:a[1],y:a[2],w:a[3],h:a[4]}));dashBuild();saveDash()}});
 btn(g2,()=>(DASH.third?'● ':'○ ')+'Also show the dashboard in 3rd person',()=>{DASH.third=!DASH.third;dashBuild();saveDash()});
 const groups=[['FLIGHT & NAVIGATION',['flight','scanner','nav','objective','clock','burn']],['ENGINEERING',['status','power','thermal','why','jobs','research','inv','weapons','systems']],['SURVIVAL',['life','alerts']],['GRAPHS',['g_speed','g_acc','g_power','g_batt','g_heat','g_fuel','g_dose']],['JUST FOR FUN',['hula','dice','plant']]];
 groups.forEach(([t,ids])=>{const g3=grp(pb,'ADD WIDGET: '+t);ids.forEach(id=>btn(g3,'＋ '+WDEF[id].t,()=>addW(id)))});$('wpalc').onclick=()=>$('wpal').classList.add('h')}
dashBuild();
// fun widgets react to the ship: the dancer sways with thrust, the dice swing, the plant shows the cabin's health
let HU={th:0,w:0},DI={th:0,w:0},lastFun=0;
function funTick(now){const dt=Math.min(.05,Math.max(0,(now-lastFun)/1000));lastFun=now;if(!(FP||DASH.third)||!LIVE.length)return;const t=now/1000,D=DR[di],a=s.burn>0&&!D.sail?D.k*PW/D.ve*s.burn/mass():0,side=K.a?-1:K.d?1:0,push=Math.min(3,a/2);
 HU.w+=(-14*HU.th-1.5*HU.w+Math.sin(t*2.4)*1.6+side*push*6+push*Math.sin(t*9)*2)*dt;HU.th+=HU.w*dt;DI.w+=(-6*DI.th-.6*DI.w+(side*2-push)*push*3+Math.sin(t*.9)*.15)*dt;DI.th+=DI.w*dt;
 for(const it of LIVE){const q=it.body.querySelector?(c=>it.body.querySelector(c)):null;if(!q)continue;
  if(it.id==='hula'){const deg=HU.th*30,hs=q('.hs'),ht=q('.ht'),al=q('.al'),ar=q('.ar');if(hs)hs.setAttribute('transform',`rotate(${deg} 50 98)`);if(ht)ht.setAttribute('transform',`rotate(${-deg*.5} 50 98)`);
   if(al)al.setAttribute('transform',`rotate(${Math.sin(t*2.4)*18} 43 66)`);if(ar)ar.setAttribute('transform',`rotate(${-Math.sin(t*2.4+1)*18} 57 66)`)}
  else if(it.id==='dice'){const g=q('.dg');if(g)g.setAttribute('transform',`rotate(${DI.th*40} 50 20)`)}
  else if(it.id==='plant'&&Math.floor(t*4)!==Math.floor((t-dt)*4)){const c=s.crew,hot=s.tLo>310,cold=s.tLo<286,dry=s.res.water<50,rad=c.acute>.3,air=c.o2ok===false||s.co2>.6,mood=!c.alive?'…':air?'gasping':rad?'irradiated':hot?'too hot':cold?'too cold':dry?'thirsty':'happy',
   lv=q('.lv'),pm=q('.pm');if(pm)pm.textContent=mood;if(lv)lv.setAttribute('transform',mood==='happy'?'':`rotate(${hot||dry?8:-5} 50 102)`);
   if(it.body.querySelectorAll)it.body.querySelectorAll('.lf').forEach(l=>l.setAttribute('fill',mood==='happy'?'#4caf50':rad?'#a8b04c':dry||hot?'#9a8a3a':'#3f7f6f'))}}}
