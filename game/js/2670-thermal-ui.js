// ===== THERMAL VIEW (client): key F2, or 🌡 in 🛠 Engineering → Ship =====
// A heat map of your ship, where each cooling loop's heat comes from and goes, and a calculator that tells you how many
// radiators of each kind you need to run an engine at a given throttle without cooking the crew.
// Two loops (rules in 0500-budgets.js): the LOW loop (crew cabin, electronics, batteries, electric thrusters) must stay
// under 45 °C (318 K); the HIGH loop (reactors, hot engines) runs as hot as its radiators allow (up to 1,200 K).
// Radiated power per m² grows as T⁴, which is why one hot radiator does the work of ~100 cold ones.
const THW=document.createElement('div');THW.id='thw';THW.className='h';
THW.innerHTML='<div class="card"><h2>🌡 Thermal</h2><p class="opsn">Every watt your ship uses ends up as heat, and in space the only way to get rid of it is to radiate it away. Two cooling loops: the crew loop must stay below 45 °C; the high-temperature loop takes reactor and hot-engine heat.</p><canvas id="thmap" width="900" height="300"></canvas><div id="thb"></div><button id="thc">Close (F2)</button></div>';
document.body.appendChild(THW);$('thc').onclick=()=>THW.classList.add('h');
const TH={eng:null,thr:100,cab:30,at:0};
function thermToggle(){THW.classList.toggle('h');TH.eng=null;TH.at=0;thermDraw()}
const thK=k=>Math.round(k-273.15)+' °C',thW=w=>Math.abs(w)>=1e6?f1(w/1e6,w>=1e8?0:1)+' MW':Math.abs(w)>=1e3?f1(w/1e3,w>=1e5?0:1)+' kW':f1(w,0)+' W';
// colour scale: cold blue → comfortable green → limit yellow → hot red → white-hot
const TH_STOPS=[[200,[43,75,255]],[273,[63,169,255]],[295,[63,220,122]],[318,[255,210,63]],[360,[255,122,47]],[600,[255,47,47]],[1200,[255,224,192]]];
function thCol(T){const S=TH_STOPS;if(T<=S[0][0])return'rgb('+S[0][1]+')';for(let i=1;i<S.length;i++)if(T<=S[i][0]){const a=S[i-1],b=S[i],f=(T-a[0])/(b[0]-a[0]);return'rgb('+a[1].map((v,k)=>Math.round(v+(b[1][k]-v)*f)).join(',')+')'}return'rgb('+S[S.length-1][1]+')'}
const thRej=(A,T)=>EPSR*SIG*A*(T**4-256),thArea=(Q,T)=>Q/Math.max(1e-9,EPSR*SIG*(T**4-256));
// equilibrium temperature of a loop with heat Q and radiator area A
const thTeq=(Q,A)=>Math.pow(Math.max(0,Q)/(EPSR*SIG*Math.max(1e-9,A))+256,.25);
function thMap(){const cv=$('thmap');if(!cv||!cv.getContext)return;const x=cv.getContext('2d'),W=cv.width,H=cv.height,LM=SH&&SH.lay;x.clearRect(0,0,W,H);x.fillStyle='#04060d';x.fillRect(0,0,W,H);
 if(!LM||!LM.mods){x.fillStyle='#7f8bb3';x.fillText(tr('No layout yet.'),12,20);return}
 const hasHi=SH.radHiA>0,tLo=s.tLo,tHi=hasHi?s.tHi:s.tLo,D=DR[di],L=Math.max(4,LM.L),k=Math.min((W-170)/(L+6),(H*.36)/Math.max(3,...LM.mods.map(q=>(q.off||0)+q.r))),cy=H*.5,x0=24,
  tOf=q=>q.cat==='therm'?((PARTS[q.id]||{}).loop==='lo'?tLo:tHi):q.cat==='gen'?((PARTS[q.id]||{}).eta?tHi:tLo+8):tLo;
 // modules (spine first, then side mounts), radiator panels as wings
 for(const q of LM.mods){const X=x0+(q.x-q.len/2)*k,w=Math.max(3,q.len*k),yc=cy-(q.radial?Math.sin(q.ang||0)*(q.off||0)*k:0),h=Math.max(6,q.r*k),T=tOf(q);
  if(q.radial){x.strokeStyle='#4a5059';x.lineWidth=2;x.beginPath();x.moveTo(x0+q.x*k,cy);x.lineTo(x0+q.x*k,yc);x.stroke()}
  if(q.cat==='therm'){const A=(PARTS[q.id]||{}).A||60,ph=Math.min(H*.42,Math.sqrt(A)*k*.9);x.fillStyle=thCol(T);x.globalAlpha=.85;x.fillRect(X,yc-h-ph,w,ph);x.fillRect(X,yc+h,w,ph);x.globalAlpha=1}
  x.fillStyle=thCol(T);x.fillRect(X,yc-h,w,2*h);x.strokeStyle='rgba(0,0,0,.6)';x.strokeRect(X,yc-h,w,2*h);
  if(q.cat==='life'){x.fillStyle='#000';x.font='bold 11px ui-monospace,monospace';x.fillText('👩‍🚀 '+thK(tLo),X+3,yc+4)}}
 // engine bell at the tail, hot while it burns
 const ex=x0+L*k,eT=s.burn>0&&D.hf>0?(D.loop==='hi'&&hasHi?tHi:D.loop==='none'?900:tLo+40):tLo;
 x.fillStyle=thCol(eT);x.beginPath();x.moveTo(ex,cy-10);x.lineTo(ex+26,cy-22);x.lineTo(ex+26,cy+22);x.lineTo(ex,cy+10);x.closePath();x.fill();
 if(s.burn>0){const g=x.createLinearGradient(ex+26,0,ex+120,0);g.addColorStop(0,'rgba(255,200,120,.8)');g.addColorStop(1,'rgba(255,120,40,0)');x.fillStyle=g;x.fillRect(ex+26,cy-16,94,32)}
 // legend
 const lx=W-150,ly=16;x.font='11px ui-monospace,monospace';[[250,'−23 °C'],[295,'22 °C'],[318,'45 °C '+tr('crew limit')],[400,'127 °C'],[900,'627 °C'],[1200,'927 °C']].forEach(([T,l],i)=>{x.fillStyle=thCol(T);x.fillRect(lx,ly+i*16,14,12);x.fillStyle='#cfd6ea';x.fillText(l,lx+20,ly+10+i*16)});
 x.fillStyle='#cfd6ea';x.fillText(tr('Crew loop')+' '+thK(tLo)+(hasHi?' · '+tr('high loop')+' '+thK(tHi):''),12,H-10)}
// heat requirements for an engine at a throttle (for the calculator)
function thNeed(i,thr){const E=DR[i],P=(i===di?PW:E.pw)*thr,hb=s.hb||{sys:SH.load*.9+100,sun:0,weap:0,fab:0},eta=SH.reactors.length?SH.reactors[0].d.eta:.3;
 let lo=hb.sys+hb.sun+hb.weap+hb.fab,hi=0;const eh=P*(E.hf||0);if(E.loop==='lo')lo+=eh;else if(E.loop==='hi')hi+=eh;
 if(E.el){const sun=s.lit?perM2()*s.area:0,need=Math.max(0,P-sun-SH.rtg);hi+=need*(1/eta-1)}
 // reactors already running for the ship's own systems
 if(!E.el)hi+=SH.reactors.length?Math.max(0,(s.hb&&s.hb.reac)||0):0;return{lo,hi,eh,P}}
function thermDraw(){if(THW.classList.contains('h'))return;const now=performance.now();if(now-TH.at<500)return;TH.at=now;thMap();
 const b=$('thb');if(b.contains(document.activeElement)&&document.activeElement.tagName!=='BUTTON')return;
 const hb=s.hb||{},hasHi=SH.radHiA>0,capLo=thRej(SH.radLoA,318),D=DR[di],loQ=s.hLo||0,hiQ=s.hHi||0,teqLo=thTeq(loQ,SH.radLoA),teqHi=hasHi?thTeq(hiQ,SH.radHiA):0,
  ttl=loQ>capLo&&s.tLo<318?(318-s.tLo)*2e6/(loQ-capLo):null;
 const row=(l,w,tot)=>`<tr><td>${l}</td><td>${thW(w)}</td><td><div class="thbar"><i style="width:${Math.min(100,tot>0?w/tot*100:0)}%"></i></div></td></tr>`;
 let h=`<div class="thsum"><div class="thl ${s.tLo>318?'crit':s.tLo>308?'warn':''}"><b>${tr('Crew loop')}</b> ${thK(s.tLo)} <small>(${tr('limit')} 45 °C)</small><br>${tr('heat in')} ${thW(loQ)} · ${tr('radiators can shed')} ${thW(capLo)} ${tr('at 45 °C')}<br>${tr('settles at')} ${thK(Math.max(291,teqLo))}${teqLo<291?' ('+tr('heaters keep it warm')+')':''}${ttl?' · ⚠ '+tr('over the limit in')+' '+dur(ttl):''}</div>
  <div class="thl ${hasHi&&s.tHi>SH.radHiT?'crit':''}"><b>${tr('High-temperature loop')}</b> ${hasHi?thK(s.tHi)+' <small>('+tr('limit')+' '+thK(SH.radHiT)+')</small><br>'+tr('heat in')+' '+thW(hiQ)+' · '+tr('can shed')+' '+thW(s.capHi||0)+'<br>'+tr('settles at')+' '+thK(teqHi):'<span class="thno">'+tr('No high-temperature radiators: reactor and hot-engine heat goes into the crew loop, so hot engines are throttled almost to zero.')+'</span>'}</div></div>`;
 const tot=loQ+hiQ||1;h+=`<h4>${tr('WHERE THE HEAT COMES FROM (now)')}</h4><table class="bldt">${row(tr('Systems, electronics and crew'),hb.sys||0,tot)}${row(tr('Sunlight absorbed by the hull'),hb.sun||0,tot)}${hb.weap?row(tr('Weapons'),hb.weap,tot):''}${hb.fab?row(tr('Fabrication'),hb.fab,tot):''}${hb.reac?row(tr('Reactor waste heat'),hb.reac,tot):''}${hb.eng?row(tr('Engine')+' ('+(hb.engLo?tr('into the crew loop'):tr('into the high loop'))+')',hb.eng,tot):''}</table>
  ${hpfCount()?`<p class="opsn"><span>${tr('Heat-pipe fluid:')}</span> <b>${tr(hpfT().n)}</b> · <span>${tr('limit')}</span> ${hpfT().T} K · <span>${tr('change it in 🏭 Fabricate → HEAT-PIPE FLUID')}</span></p>`:''}
  <p class="opsn">${tr('Radiator area (both faces):')} ${tr('crew loop')} ${f1(SH.radLoA,0)} m² · ${tr('high loop')} ${f1(SH.radHiA,0)} m²${hasHi?' '+tr('up to')+' '+SH.radHiT+' K':''}. ${s.lim&&s.lim.H<.999&&D.hf>0?'⚠ '+tr('Your engine is held to')+' '+f1(s.lim.H*100,s.lim.H<.01?3:1)+' % '+tr('by heat.'):''}</p>`;
 // calculator
 const ei=TH.eng==null?di:TH.eng,E=DR[ei],need=thNeed(ei,TH.thr/100),Tc=273.15+TH.cab,eng=DR.map((x,i)=>isU(x.id)?`<option value="${i}" ${i===ei?'selected':''}>${x.ic||''} ${tr(x.n)}</option>`:'').join('');
 const aLo=thArea(need.lo,Tc),dLo=Math.max(0,aLo-SH.radLoA);
 h+=`<h4>🧮 ${tr('RADIATOR CALCULATOR')}</h4><p><label>${tr('Engine')} <select id="theng">${eng}</select></label> <label class="desf"><span>${tr('Throttle')}</span> <input id="ththr" type="range" min="0" max="100" step="1" value="${TH.thr}"> <b>${TH.thr} %</b></label>
  <label class="desf"><span>${tr('Keep the crew loop at or below')}</span> <input id="thcab" type="range" min="15" max="45" step="1" value="${TH.cab}"> <b>${TH.cab} °C</b></label></p>
  <p>${tr('At')} ${TH.thr} % ${tr('the')} ${tr(E.n)} ${tr('makes')} ${thW(need.eh)} ${tr('of heat')}${E.loop==='none'?' ('+tr('none: its exhaust carries the heat away')+')':E.loop==='hi'?' '+tr('for the high-temperature loop'):' '+tr('for the crew loop')}${E.el?'; '+tr('its electricity comes from reactors whose waste heat also goes to the high loop'):''}.</p>
  <table class="bldt"><tr><th>${tr('Loop')}</th><th>${tr('Heat')}</th><th>${tr('Area needed')}</th><th>${tr('You have')}</th><th>${tr('Add')}</th></tr>
  <tr><td>${tr('Crew loop')} (≤ ${TH.cab} °C)</td><td>${thW(need.lo)}</td><td>${f1(aLo,0)} m²</td><td>${f1(SH.radLoA,0)} m²</td><td>${dLo>0?f1(dLo,0)+' m²':'✓'}</td></tr>`;
 const hiTypes=Object.entries(PARTS).filter(([k,d])=>d.cat==='therm'&&d.loop!=='lo'),loTypes=Object.entries(PARTS).filter(([k,d])=>d.cat==='therm'&&d.loop==='lo');
 if(need.hi>0){
  h+=`<tr><td>${tr('High loop')}</td><td>${thW(need.hi)}</td><td>${tr('depends on the radiator type below')}</td><td>${f1(SH.radHiA,0)} m²</td><td></td></tr>`}
 h+='</table>';
 const opt=(k,d,count,why)=>{const ok=hasT(d.req),mat=Object.entries(d.mat||{}).map(([m,v])=>f1(v*count,0)+' kg '+tr(m)).join(', ');
  return`<div class="navr"><b>${count.toLocaleString()} × ${d.n}</b> <small>${why} · ${f1(d.m*count,0)} kg · ${mat}${ok?'':' · 🔒 '+tr('research')+' '+(TK2[d.req]||{n:d.req}).n}</small> ${ok&&count>0?`<button data-thb="${k}" data-n="${count}">🏭 ${tr('Build')} ${count.toLocaleString()}</button>`:''}</div>`};
 let any=false;
 if(dLo>0){h+=`<p><b>${tr('For the crew loop:')}</b></p>`;for(const[k,d]of loTypes){const per=2*d.A,n=Math.ceil(dLo/per);any=true;h+=opt(k,d,n,f1(per,0)+' m² '+tr('each'))}}
 if(need.hi>0){h+=`<p><b>${tr('For the high-temperature loop:')}</b></p>`;
  for(let[k,d]of hiTypes){if(d.hp)d=hpfApply(d);const T=Math.min(d.Tmax,hasHi?SH.radHiT:d.Tmax)*.97,a=thArea(need.hi,T),add=Math.max(0,a-SH.radHiA),per=2*d.A,n=Math.ceil(add/per);any=true;
   h+=opt(k,d,n,(n?f1(per,0)+' m² '+tr('each, working at')+' '+Math.round(T)+' K':'✓ '+tr('enough already')))}}
 if(!any)h+=`<p>✓ ${tr('Your radiators are enough for this.')}</p>`;
 h+=`<p class="opsn">${tr('Why: a surface radiates εσT⁴ watts per m². At 45 °C that is about 490 W/m²; at 1,200 K it is about 100 kW/m². Hot engines and reactors need high-temperature radiators; the crew loop can only use low-temperature ones. Radiators that are worn out shed less (repair them).')}</p>`;
 b.innerHTML=h;
 const se=$('theng');if(se)se.onchange=()=>{TH.eng=+se.value;TH.at=0;thermDraw()};
 const st=$('ththr');if(st)st.oninput=()=>{TH.thr=+st.value;TH.at=0;thermDraw()};
 const sc=$('thcab');if(sc)sc.oninput=()=>{TH.cab=+sc.value;TH.at=0;thermDraw()};
 b.querySelectorAll('[data-thb]').forEach(x=>x.onclick=()=>{const k=x.dataset.thb,d=PARTS[k],n=+x.dataset.n;let ok=0;for(let i=0;i<n;i++){if(!queueJob({type:'part',id:k,mat:{...d.mat},name:d.n,J:d.J}))break;ok++}
  notify(ok===n?'🏭 '+tr('Queued')+' '+ok+' × '+d.n+'.':ok?'🏭 '+tr('Queued')+' '+ok+' / '+n+' × '+d.n+' ('+tr('materials ran out')+').':'⚠ '+tr('Missing materials for')+' '+d.n+'.');TH.at=0})}
ORB.on('ui',thermDraw);
// a clear warning when you try to fire an engine that heat holds back
setInterval(()=>{try{const D=DR[di],L=s.lim||{};if(!(D.hf>0)||!(L.H<.5)||!(K.w||K.s||K.a||K.d||K.e||K.q||AP))return;const now=performance.now();if(TH.warn&&now-TH.warn<120000)return;TH.warn=now;
 notify('🌡 '+tr('The {} is held to {} % thrust by heat. Open 🌡 Thermal (F2) to see how many radiators it needs.').replace('{}',tr(D.n)).replace('{}',f1(L.H*100,L.H<.01?3:1)))}catch(e){}},1000);
