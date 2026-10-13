// ===== MISSION PLANNER (client): 🧭 NAVIGATE → MISSION PLANNER =====
// Chain stops (planets, moons, Pluto) and see the speed-change budget for the whole trip against what your engine and
// propellant can give. Each leg is a Hohmann transfer between low orbits (10 % above the surface): leaving a low orbit
// you burn √(v∞² + v_esc²) − v_circ (the Oberth effect: burning deep in the gravity well), arriving you burn the same to
// be captured. Moon ↔ planet legs are transfers around the planet; trips between moons of different planets step
// through the planet's gravity well: the arriving ship circularises at the moon's distance, then is captured by the moon. Real missions add margins for steering and timing, and
// gravity assists or aerobraking can cut the cost. Propellant left after each leg follows the rocket equation
// (mass ÷ e^(Δv/ve) per leg) with the engine selected now.
const PL={from:null,stops:[]};
const plOK=b=>b&&b!==B[0]&&!b.star&&!(b.p>0&&B[b.p].star);
const plDepth=b=>b===B[0]?0:b.p===0?1:2,plPar=b=>B[b.p];
function plXfer(P,r1,r2){const mu=P.GM,at=(r1+r2)/2,v1=Math.sqrt(mu/r1),v2=Math.sqrt(mu/r2),p1=Math.sqrt(mu*(2/r1-1/at)),p2=Math.sqrt(mu*(2/r2-1/at));return{i1:Math.abs(p1-v1),i2:Math.abs(p2-v2),t:Math.PI*Math.sqrt(at**3/mu)}}
const plOb=(b,vinf)=>{const r=b.R*1.1,vc=Math.sqrt(b.GM/r);return Math.sqrt(vinf*vinf+2*b.GM/r)-vc};
// top-level (around the Sun) body of a moon, and the burn to leave or join a moon's orbit with excess speed v∞ at its
// planet: circularise at the moon's distance (deep in the planet's well), then the moon's own capture
const plTop=b=>plDepth(b)===2?plPar(b):b;
const plEnd=(b,vinf)=>{if(plDepth(b)===1)return plOb(b,vinf);const P=plPar(b),r=b.a;return Math.sqrt(vinf*vinf+2*P.GM/r)-Math.sqrt(P.GM/r)+plOb(b,0)};
function plLeg(A,Bq){
 if(A.p===Bq.p){const P=plPar(A),x=plXfer(P,A.a,Bq.a);return[{a:A,b:Bq,dep:plOb(A,x.i1),arr:plOb(Bq,x.i2),t:x.t}]}
 if(B[Bq.p]===A){const x=plXfer(A,A.R*1.1,Bq.a);return[{a:A,b:Bq,dep:x.i1,arr:plOb(Bq,x.i2),t:x.t}]}
 if(B[A.p]===Bq){const x=plXfer(Bq,A.a,Bq.R*1.1);return[{a:A,b:Bq,dep:plOb(A,x.i1),arr:x.i2,t:x.t}]}
 const X=plTop(A),Y=plTop(Bq),x=plXfer(B[0],X.a,Y.a);return[{a:A,b:Bq,dep:plEnd(A,x.i1),arr:plEnd(Bq,x.i2),t:x.t}]}
function plShipDv(){const D=DR[di];if(!D.f)return Infinity;const M=mass(),f=s.fuel[D.f]||0;return f>0&&M>f?C*Math.tanh(D.ve/C*Math.log(M/(M-f))):0}
const PLW=document.createElement('div');PLW.id='plw';PLW.className='h';
PLW.innerHTML='<div class="card"><h2>🗺 Mission planner</h2><p class="opsn">Chain stops and see the speed-change budget for the whole trip against what your engine and propellant can give. Each leg is a Hohmann transfer from low orbit to low orbit.</p><div id="plb"></div><button id="plc">Close</button></div>';
document.body.appendChild(PLW);$('plc').onclick=()=>PLW.classList.add('h');
function plToggle(){PLW.classList.toggle('h');if(!PL.from)PL.from=plOK(s.dom)?s.dom.n:'Earth';plDraw()}
function plDraw(){if(PLW.classList.contains('h'))return;const bodies=B.filter(plOK),opt=sel=>bodies.map(b=>`<option value="${b.n}" ${b.n===sel?'selected':''}>${tr(b.n)}</option>`).join('');
 const pts=[PL.from,...PL.stops].map(n=>B.find(b=>b.n===n)).filter(Boolean);let legs=[];for(let i=1;i<pts.length;i++)if(pts[i]!==pts[i-1])legs.push({i,L:plLeg(pts[i-1],pts[i])});
 const have=plShipDv(),Dn=DR[di],M0=mass(),f0=Dn.f?(s.fuel[Dn.f]||0):0;let cum=0,tt=0,Mx=M0;
 let h=`<p><span>${tr('Start in low orbit around')}</span> <select id="plfrom">${opt(PL.from)}</select></p><table class="bldt"><tr><th>#</th><th>${tr('Stop')}</th><th>${tr('Burns (leave · arrive)')}</th><th>${tr('Speed change')}</th><th>${tr('Flight time')}</th><th>${tr('Running total')}</th><th>${tr('Propellant left')}</th><th></th></tr>`;
 PL.stops.forEach((n,k)=>{const lg=legs.find(q=>q.i===k+1),L=lg?lg.L:[];const dv=L.reduce((a,q)=>a+q.dep+q.arr,0),t=L.reduce((a,q)=>a+q.t,0);cum+=dv;tt+=t;const over=cum>have;if(Dn.f&&Dn.ve>0)Mx=Mx/Math.exp(dv/Dn.ve);const left=Dn.f?Math.max(0,f0-(M0-Mx)):Infinity;
  h+=`<tr${over?' class="plover"':''}><td>${k+1}</td><td><select data-pls="${k}">${opt(n)}</select></td><td>${L.map(q=>`<small>${tr(q.a.n)} → ${tr(q.b.n)}: ${f1(q.dep/1e3,2)} · ${f1(q.arr/1e3,2)} km/s</small>`).join('<br>')||'—'}</td><td><b>${f1(dv/1e3,2)} km/s</b></td><td>${t?dur(t):'—'}</td><td>${f1(cum/1e3,2)} km/s${over?' ⚠':''}</td><td>${isFinite(left)?(over?'0':f1(left,0)+' kg'):'—'}</td><td><button data-plx="${k}">✕</button></td></tr>`});
 h+=`</table><p><button id="pladd">➕ ${tr('Add a stop')}</button> <button id="plret">↩ ${tr('Return to the start')}</button> <button id="plclr">🗑 ${tr('Clear')}</button> <button id="pllog">📜 ${tr('Write it in the captain’s log')}</button></p>`;
 const fr=isFinite(have)?Math.min(1,have/Math.max(1,cum)):1;
 h+=`<div class="plsum"><span>${tr('Whole trip')}: <b>${f1(cum/1e3,2)} km/s</b> · ${dur(tt)} <span>${tr('of coasting')}</span></span><span>${tr('Your ship can give')}: <b>${isFinite(have)?f1(have/1e3,2)+' km/s':tr('unlimited (no propellant)')}</b> <small>(${tr(DR[di].n)})</small></span><div class="thbar"><i style="width:${Math.round(fr*100)}%;background:${cum<=have?'#5dff8a':'#ff6a6a'}"></i></div><span>${cum<=have?'✓ '+tr('Enough, with')+' '+f1((have-cum)/1e3,2)+' km/s '+tr('to spare (keep 10 % for steering)'):'⚠ '+tr('Short by')+' '+f1((cum-have)/1e3,2)+' km/s: '+tr('carry more propellant, use a faster exhaust, or refuel on the way')}</span></div>`;
 h+=`<p class="opsn">${tr('Leaving a low orbit you burn √(v∞² + v_esc²) − v_circ: burning deep in a gravity well multiplies the effect of each burn (the Oberth effect). Gravity assists and aerobraking can cut the real cost; transfer windows in 🧭 Navigate tell you when to leave.')}</p>`;
 const b=$('plb');b.innerHTML=h;
 $('plfrom').onchange=e=>{PL.from=e.target.value;plDraw()};b.querySelectorAll('[data-pls]').forEach(x=>x.onchange=()=>{PL.stops[+x.dataset.pls]=x.value;plDraw()});
 b.querySelectorAll('[data-plx]').forEach(x=>x.onclick=()=>{PL.stops.splice(+x.dataset.plx,1);plDraw()});
 $('pladd').onclick=()=>{const last=PL.stops.length?PL.stops[PL.stops.length-1]:PL.from;PL.stops.push(last==='Mars'?'Earth':'Mars');plDraw()};$('plret').onclick=()=>{PL.stops.push(PL.from);plDraw()};$('plclr').onclick=()=>{PL.stops=[];plDraw()};$('pllog').onclick=()=>{if(typeof logAdd!=='function'||!PL.stops.length)return;logAdd(tr('Mission plan')+': '+[PL.from,...PL.stops].map(n=>tr(n)).join(' → ')+' · '+f1(cum/1e3,2)+' km/s · '+dur(tt),1);notify('📜 '+tr('Plan written in the captain’s log.'))}}
{const nb=$('navbody');if(nb){const g=grp(nb,'MISSION PLANNER (speed-change budget for a whole trip)');btn(g,'🗺 Open the mission planner',()=>plToggle())}}
