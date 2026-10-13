// ===== TRIP CHECK and NAVIGATOR SEARCH (client) =====
// Before the autopilot starts a trip, it estimates the propellant and the days it needs and compares them with what
// you carry (propellant, oxygen, water, food). If anything falls short you are asked: fly anyway, or cancel.
// The navigator gets a search box that finds planets, moons, stars, asteroids and ships by name in any language.
const TCW=document.createElement('div');TCW.id='tcw';TCW.className='h';
TCW.innerHTML='<div class="card"><h2>⚠ This trip may not be possible</h2><div id="tcb"></div><p><button id="tcgo">🧭 Fly anyway</button> <button id="tcno">Cancel</button></p></div>';
document.body.appendChild(TCW);
function tripIssues(p){const out=[],L=lifeDays(),days=p.days||0;
 if(p.extra>0)out.push(`<b>Propellant:</b> <span>about</span> ${f1(p.extra,0)} kg <span>more is needed than you carry</span> (${f1(s.prop,0)} kg <span>on board</span>).`);
 if(p.dvNeed&&p.dvHave<p.dvNeed)out.push(`<b>Δv:</b> <span>needs about</span> ${f1(p.dvNeed/1e3,2)} km/s, <span>your engine and fuel give</span> ${f1(p.dvHave/1e3,2)} km/s.`);
 if(p.burn>20){const E=effPush();out.push(`<b>${tr('Engine')}:</b> <span>${tr('it pushes only')}</span> ${E.a>=.01?f1(E.a,2)+' m/s²':sci(E.a)+' m/s²'}${E.why?` (<span>${tr('held to')}</span> ${f1(E.f*100,E.f<.01?2:0)} % <span>${tr(E.why==='heat'?'by heat: add high-temperature radiators (🌡 F2)':'by electric power: add solar panels or a reactor')}</span>)`:''}<span>; ${tr('the burns alone take about')}</span> ${dur(p.burn*86400)}.`)}
 const lim=[['Oxygen',L.o2],['Water',L.wat],['Food',L.food]].filter(([n,d])=>d<days*1.1);
 for(const[n,d]of lim)out.push(`<b>${n}:</b> <span>enough for</span> ${dur(d*86400)}<span>; the trip takes about</span> ${dur(days*86400)}.`);
 return out}
function apAsk(p,go){const iss=tripIssues(p);if(!iss.length){go();return}
 $('tcb').innerHTML=`<p><b>${p.name}</b> · <span>about</span> ${dur(p.days*86400)}</p><ul>${iss.map(x=>'<li>'+x+'</li>').join('')}</ul><p class="opsn">You can stock up first (🧭 NAVIGATE → Prepare: buy fuel, stock up supplies), or go anyway and resupply on the way.</p>`;
 TCW.classList.remove('h');$('tcgo').onclick=()=>{TCW.classList.add('h');go()};$('tcno').onclick=()=>{TCW.classList.add('h');notify('🧭 Trip cancelled.')}}
const dvHave=()=>{const D=DR[di],M=mass();return D.f&&s.prop>0?D.ve*Math.log(M/Math.max(1,M-s.prop)):Infinity};
// how hard the engine can really push right now: heat (radiators) and electric power can hold the throttle down, and the
// estimates below use this so a gentle or throttled engine is not promised a 77-day trip it would need years for
function effPush(){const D=DR[di],a=thrustAcc();if(D.sail)return{a,f:1,why:''};let fH=1,fP=1;
 if(s.burn>0&&s.lim&&s.lim.f>0){fH=s.lim.H;fP=s.lim.P}else{if(D.hf>0&&D.loop!=='none'&&PW>0)fH=Math.max(0,Math.min(1,((D.loop==='lo'?s.roomLo:s.roomHi)||0)/(PW*D.hf)));if(D.el&&PW>0)fP=Math.max(0,Math.min(1,Math.max(0,s.pFree||0)/PW))}
 const f=Math.max(1e-9,Math.min(fH,fP));return{a:a*f,f,why:f>=.999?'':fH<=fP?'heat':'power'}}
// days of engine burning for a speed change dv (m/s), at today's push (the ship gets lighter as it burns: a little faster)
const burnDays=dv=>dv/Math.max(1e-12,effPush().a)/86400*.85;
// what the autopilot stage line adds when the engine is held back
function apStageTxt(){if(!AP)return'';let t=tr(String(AP.stage||''));const L=s.lim;if(THR>0&&L&&L.f<.5&&!DR[di].sail){const w=L.H<=Math.min(L.P,L.G)?tr('by heat: add high-temperature radiators (🌡 F2)'):L.P<=L.G?tr('by electric power: add solar panels or a reactor'):tr('by the crew’s g-limit');
  t+=' · ⚠ '+tr('engine held to')+' '+f1(L.f*100,L.f<.01?2:0)+' % '+w}return t}
// estimates for the three kinds of autopilot trip
function planDist(a,name){const t=trip(a*AU),S=B[0],r0=Math.hypot(s.x-S.x,s.y-S.y,s.z-S.z),coast=Math.PI*Math.sqrt(((r0+a*AU)/2)**3/S.GM)/86400,burn=burnDays(t.dv/1.4);return{name,days:coast+burn,burn,extra:t.extra}}
function planAst(a){const D=DR[di],M=mass(),dv=dvHave(),esc=s.dom!==B[0]?escDv(elements(),di,PW,M):0,vcap=Math.max(150,Math.min(3e4,.3*((isFinite(dv)?dv:2e4)-esc))),req=1.35*(esc+2*Math.max(vcap,1500)),dry=M-s.prop,
  need=D.f?dry*(Math.exp(req/D.ve)-1):0;burn=burnDays(req/1.35);return{name:a.n,days:astDist(a)/vcap/86400*1.3+.5+burn,burn,extra:Math.max(0,need-s.prop)}}
function flyAstAsk(a){apAsk(planAst(a),()=>flyAst(a))}
// ---------- navigator search
{const nav=document.getElementById('navhead');if(nav){const box=document.createElement('div');box.id='navsearch';
 box.innerHTML='<input id="navq" type="search" placeholder="Search: planets, moons, asteroids, ships…" autocomplete="off"><div id="navres"></div>';nav.after(box);
 const fold=x=>(x||'').toString().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const items=()=>{const L=[];B.forEach((b,i)=>L.push({n:b.n,k:b.star||b.p<0?'star':b.p>0?'moon':'planet',b,i}));AST.forEach(a=>L.push({n:a.n,k:'asteroid',a}));
  if(typeof RS!=='undefined'&&RS&&RS.x)L.push({n:(MP.peerName||'friend'),k:'ship'});return L};
 const KIC={star:'☀',planet:'🪐',moon:'🌙',asteroid:'☄',ship:'👤'};
 const draw=()=>{const q=fold($('navq').value.trim()),R=$('navres');if(!q){R.innerHTML='';return}
  const hits=items().filter(it=>fold(it.n).includes(q)||fold(tr(it.n)).includes(q)).slice(0,14);
  R.innerHTML=hits.length?hits.map((it,j)=>{const d=it.a?astDist(it.a):it.b?Math.hypot(it.b.x-s.x,it.b.y-s.y,it.b.z-s.z):0;
   return`<div class="navr">${KIC[it.k]} <b>${tr(it.n)}</b> <small>${it.a?it.a.t+'-type · ':''}${d?fmtD(d):''}</small> ${it.a?`<button data-j="${j}" data-a="fly">🧭 Fly here</button>`:''}${it.b?`<button data-j="${j}" data-a="look">🎥 Look</button>`:''}${it.b&&it.b.star?`<button data-j="${j}" data-a="ist">🚀 Interstellar cruise</button>`:''}${it.b&&it.b.p===0&&!it.b.star?`<button data-j="${j}" data-a="dist">🧭 Fly to its distance from the Sun</button>`:''}${it.k==='ship'?`<button data-j="${j}" data-a="pl">🧭 Rendezvous</button>`:''}</div>`}).join(''):'<div class="opsn">Nothing found.</div>';
  R._hits=hits};
 $('navq').addEventListener('input',draw);
 $('navres').addEventListener('click',e=>{const x=e.target.closest('button');if(!x)return;const it=$('navres')._hits[+x.dataset.j];if(!it)return;
  if(x.dataset.a==='fly'){$('nav').classList.add('h');flyAstAsk(it.a)}
  else if(x.dataset.a==='look'){setFocus(it.i+1);$('nav').classList.add('h')}
  else if(x.dataset.a==='dist'){const S=B[0],a=Math.hypot(it.b.x-S.x,it.b.y-S.y,it.b.z-S.z)/AU,nm=tr(it.b.n)+' ('+a.toFixed(3)+' AU)';$('nav').classList.add('h');apAsk(planDist(a,nm),()=>{AP={r:a*AU,name:nm,stage:''};apNote=''})}
  else if(x.dataset.a==='ist'){$('nav').classList.add('h');istGo(it.i)}
  else if(x.dataset.a==='pl'){$('nav').classList.add('h');flyPl()}})}}

// interstellar cruise: an estimate first (game time, ship time, real time at the fastest deep-space speed), then go
function istGo(i){const b=B[i],d=Math.hypot(b.x-s.x,b.y-s.y,b.z-s.z),D=DR[di],M=mass(),phi=D.f?(D.ve/C)*Math.log(M/Math.max(1e-9,M-s.prop)):Infinity,
  ucap=MAXB*C/Math.sqrt(1-MAXB*MAXB),u=Math.min(ucap,Phi2u(phi/2)),g=Math.sqrt(1+u*u/(C*C)),v=u/g,tg=d/Math.max(1,v),ts=tg/g,fh=D.hf>0&&D.loop!=='none'&&PW>0?Math.max(1e-6,Math.min(1,((D.loop==='lo'?s.roomLo:s.roomHi)||0)/(PW*D.hf))):1,ta=Math.min(1e13,u/Math.max(1e-12,thrustAcc()*fh)),real=tg/WARP[WARP.length-1]+2*ta/WARP[WARP_DEEP];
 const nm=tr(b.n),warn=[];if(fh<.5)warn.push(tr('Heat holds your engine to')+' '+f1(fh*100,fh<.01?2:0)+' % '+tr('thrust: add high-temperature radiators (🌡 Thermal, F2) or the burns take far longer.'));if(v<.01*C)warn.push(tr('Your engine can only reach')+' '+spd(v/C)+': '+tr('the trip would take')+' '+dur(tg)+'.');if(!s.crew.sleep&&ts>365*86400)warn.push(tr('The crew would need supplies for')+' '+dur(ts)+': '+tr('hibernate them first (👩‍🚀 Crew).'));if(!SH.whip)warn.push(tr('Without a Whipple shield, dust in the Oort cloud will wreck the hull at these speeds.'));
 if(!confirm('🚀 '+nm+' · '+fmtD(d)+'\n'+tr('Top speed')+' '+spd(v/C)+'\n'+tr('Game time')+' ≈ '+dur(tg+2*ta)+' · '+tr('ship clock')+' ≈ '+dur(ts)+'\n'+tr('Real time at the fastest time speeds')+' ≈ '+dur(real)+(warn.length?'\n\n⚠ '+warn.join('\n⚠ '):'')+'\n\n'+tr('Start the cruise?')))return;
 AP={ist:{i,r:2*AU},name:nm,stage:''};apNote='';PRED=null;notify('🚀 '+tr('Interstellar cruise to')+' '+nm+'. '+tr('Speed up time (up to 1 s = 950 years once you are 2,000 AU from every star).'))}
const Phi2u=f=>f===Infinity?1e30:C*Math.sinh(f);
