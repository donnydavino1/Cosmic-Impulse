// ===== ENGINE WORKSHOP (client): key [, 🛠 → 🚀 Engines → 🔧 Workshop, or the 🔧 ENGINES button in the top bar =====
// Redesign any engine (rules: 0580-engine-design.js): pick the reaction or propellant, tune exhaust speed against thrust,
// set the core's diameter and length, add a neutron shield. A live cutaway shows the engine to scale with its plasma or
// flame glowing in the true colour of the ions in it: steady for magnetic and electric engines, flashing for the pulsed
// inertial-fusion drive. Every number is previewed against the engine you have now before you build.
const EWW=document.createElement('div');EWW.id='eww';EWW.className='h';
EWW.innerHTML='<div class="card"><h2>🔧 Engine workshop</h2><p class="opsn">Redesign an engine: what it burns or fuses, how it is tuned and how big it is. The cutaway is to scale; the glow is the true colour of the ions in the exhaust.</p><div id="ewsel" class="crr"></div><div class="ewgrid"><div class="ewvis"><canvas id="ewcv" width="640" height="300"></canvas><div id="ewcap" class="opsn"></div></div><div id="ewctl"></div></div><div id="ewst"></div><p><button id="ewgo">🔧 Build this design</button> <button id="ewrs">↺ Back to the current design</button> <button id="ewc">Close ([)</button></p></div>';
document.body.appendChild(EWW);
const EW={id:null,c:null,t0:performance.now(),raf:0};
function ewToggle(id){EWW.classList.toggle('h');if(!EWW.classList.contains('h')){const L=DR.filter(D=>isU(D.id)&&ENGFAM[D.id]);EW.id=id||(ENGFAM[DR[di].id]?DR[di].id:L[0]&&L[0].id);ewLoad();ewDraw();ewAnim()}}
function ewLoad(){const D=DR.find(x=>x.id===EW.id);if(!D)return;const c=engCfg(D);EW.c={opt:c.opt,tune:c.tune,D:c.D,L:c.L,shield:c.shield,eps:c.eps,bim:c.bim,n:c.n}}
const ewFmtV=v=>v<1e6?f1(v/1e3,v<1e4?2:1)+' km/s':(v/C).toFixed(4)+' c';
const ewLogS=(id,v,a,b)=>`<input id="${id}" type="range" min="0" max="1000" value="${Math.round(1000*Math.log(v/a)/Math.log(b/a))}">`,ewLogV=(el,a,b)=>a*Math.pow(b/a,+el.value/1000);
function ewDraw(){if(EWW.classList.contains('h'))return;const D=DR.find(x=>x.id===EW.id);if(!D){$('ewctl').innerHTML='<p>'+tr('No engine you can redesign is built yet.')+'</p>';return}
 const fam=ENGFAM[D.id],F=ENGOPT[fam],c=EW.c;
 $('ewsel').innerHTML=DR.filter(x=>isU(x.id)&&ENGFAM[x.id]).map(x=>`<button data-ew="${x.id}" class="${x.id===D.id?'bldsel':''}">${x.ic} ${tr(x.n)}</button>`).join(' ');
 const tn=fam==='grid'?['More thrust (lower voltage)','Faster exhaust (higher voltage)']:fam==='thermal'||fam==='chem'?['Cooler, gentler','Hotter: faster exhaust, more wear']:['More thrust (wide nozzle)','Faster exhaust (tight nozzle)'];
 let h=`<div class="ewrow"><b>${tr(F.label)}</b><div class="crr">${Object.entries(F.o).map(([k,o])=>`<button data-ewo="${k}" class="${k===c.opt?'bldsel':''}" style="border-color:${o.col}"><i class="ewdot" style="background:${o.col}"></i>${tr(o.n)}</button>`).join(' ')}</div><small class="opsn">${tr(F.o[c.opt].txt)}</small></div>`;
 h+=`<div class="ewrow"><label><b>${tr('Tuning')}</b> <span>${c.tune>0?'+':''}${c.tune.toFixed(2)}</span></label><input id="ewtune" type="range" min="-100" max="100" value="${Math.round(c.tune*100)}"><div class="ewlr"><small>◀ <span>${tr(tn[0])}</span></small><small><span>${tr(tn[1])}</span> ▶</small></div></div>`;
 if(ENGLIVE[D.id]){const has=s.eng&&s.eng[D.id];h+=`<div class="ewrow ewlivet">⚡ <span>${tr('Variable exhaust: this engine re-tunes in flight at constant power, no rebuild.')}</span> ${has?`<button id="ewlive">${tr('Apply this tuning now')}</button>`:`<small>${tr('Build a design once to fit the controller.')}</small>`}</div>`}
 h+=`<div class="ewrow"><label><b>${tr('Core diameter')}</b> <span>${c.D.toFixed(2)} m</span></label>${ewLogS('ewD',c.D,.1,20)}</div>`;
 h+=`<div class="ewrow"><label><b>${tr('Core length')}</b> <span>${c.L.toFixed(2)} m</span></label>${ewLogS('ewL',c.L,.1,60)}</div>`;
 if(fam==='chem'||fam==='thermal')h+=`<div class="ewrow"><label><b>${tr('Nozzle expansion ratio (exit area ÷ throat area)')}</b> <span>ε ${Math.round(c.eps||100)}</span></label>${ewLogS('ewN',c.eps||100,10,400)}<div class="ewlr"><small>◀ <span>${tr('Short, light bell')}</span></small><small><span>${tr('Big bell: faster exhaust, heavier')}</span> ▶</small></div></div>`;
 h+=`<div class="ewrow"><b>${tr('Engines in the cluster')}</b> ${[1,2,3,4].map(v=>`<button data-ewn="${v}" class="${(c.n||1)===v?'bldsel':''}">${v}</button>`).join(' ')} <small>${tr('Same total power; a failure stops only one engine. +8 % base mass per extra engine.')}</small></div>`;
 if(ENGBIM[D.id])h+=`<div class="ewrow"><label><input type="checkbox" id="ewbim" ${c.bim?'checked':''}> <b>${tr('Bimodal')}</b>: <span>${tr('run the core gently as a power reactor while coasting')}</span> (<span>${sci(ENGBIM[D.id])} W, +15 %</span> <span>${tr('mass')}</span>)</label></div>`;
 if(fam==='fusion')h+=`<div class="ewrow"><label><b>${tr('Neutron shadow shield')}</b> <span>${f1(c.shield,0)} kg</span></label><input id="ewsh" type="range" min="0" max="20000" step="100" value="${c.shield}"></div>`;
 $('ewctl').innerHTML=h;
 const cur=engSpec(D,engCfg(D)),nw=engSpec(D,{...c,dims:true}),M=mass(),dry=M-s.prop,fu=FUEL[nw.fuel],onb=s.fuel[nw.fuel]||0,engD=nw.mass-engMass(D,D===DR[di]?PW:D.pw);
 dvOf=(ve,f,ex)=>{const q=s.fuel[f]||0,dr=M-q+(ex||0);return q>0?C*Math.tanh(ve/C*Math.log((dr+q)/dr)):0},dvN=dvOf(nw.ve,nw.fuel,engD),dvC=dvOf(cur.ve,cur.fuel,0),row=(n,a,b,u)=>`<tr><td>${tr(n)}</td><td>${a}</td><td><b>${b}</b></td><td>${u||''}</td></tr>`,ch=(a,b)=>b>a*1.0005?'▲':b<a*.9995?'▼':'';
 const doseH=x=>x>0?sci(1e-13*x*nw.pw*1000)+' mSv/h':'—';
 let st=`<table class="bldt ewt"><tr><th></th><th>${tr('Now')}</th><th>${tr('This design')}</th><th></th></tr>`;
 st+=row('Exhaust speed',ewFmtV(cur.ve),ewFmtV(nw.ve),ch(cur.ve,nw.ve));
 st+=row('Power',sci(cur.pw)+' W',sci(nw.pw)+' W',ch(cur.pw,nw.pw));
 st+=row('Thrust',sci(cur.F)+' N',sci(nw.F)+' N',ch(cur.F,nw.F));
 st+=row('Engine mass',f1(cur.mass,0)+' kg',f1(nw.mass,0)+' kg',ch(cur.mass,nw.mass));
 st+=row('Waste heat to radiate',sci(cur.heat)+' W',sci(nw.heat)+' W',ch(cur.heat,nw.heat));
 st+=row('Push on this ship',f1(cur.F/M,4)+' m/s²',f1(nw.F/(M+engD),4)+' m/s²','');
 st+=row('Fuel',tr(FUEL[cur.fuel].n),tr(fu.n),'');
 st+=row('Δv with the fuel on board',dvC>0?ewFmtV(dvC):'0',onb>0?ewFmtV(dvN):`0 · <span>${tr('none on board')}</span>`,'');
 if(fam==='fusion')st+=row('Crew dose while burning',doseH(cur.dose),doseH(nw.dose),'');
 if(fam==='thermal')st+=row('Core wear',`×${f1(cur.wear,2)}`,`×${f1(nw.wear,2)}`,'');
 st+='</table>';
 const q=engDesignCost(D,{...c,dims:true});st+=`<p class="opsn"><span>${tr('Rebuilding costs')}</span> <span>${matTxt(q.mat)}</span> <span>${sci(q.J)} J</span>${s.sandbox?` <span>(${tr('free in sandbox')})</span>`:''}<br><span>${tr('Fuel')}:</span> <span>${tr(fu.how)}</span>${nw.heat>cur.heat*1.05?`<br><span>⚠ ${tr('More waste heat: check your radiators in 🌡 Thermal (F2).')}</span>`:''}${fam==='fusion'&&nw.dose>.5?`<br><span>☢ ${tr('Neutrons: add a shadow shield or keep burns short.')}</span>`:''}</p>`;
 if(D===DR[di]){const L=s.lim||{},flow=D.f&&D.ve>0?D.k*PW/(D.ve*D.ve):0,F=D.k*PW/D.ve;const sp2=(k,v)=>`<span>${tr(k)}</span> ${v}`;st+=`<p class="ewlive"><b>${tr('LIVE')}</b> · ${sp2('throttle',Math.round(100*(s.burn||0))+' %')} · ${sp2('allowed',Math.round(100*(L.f==null?1:L.f))+' %')} ${L.f<.999?'<span>('+(L.H<=Math.min(L.P,L.G)?tr('heat'):L.P<=L.G?tr('power'):tr('g-limit'))+')</span>':''} · ${sp2('thrust now',sci(F*(s.burn||0))+' N')} · ${sp2('fuel flow at full thrust',flow>=1?f1(flow,1)+' kg/s':f1(flow*3600,2)+' kg/h')} · ${sp2('full-thrust burn time left',flow>0?dur(s.prop/flow):'∞')} · ${sp2('condition',Math.round(100*D.cond)+' %')}</p>`}
 $('ewst').innerHTML=st;
 const set=()=>{ewDraw()};
 $('ewsel').querySelectorAll('[data-ew]').forEach(b=>b.onclick=()=>{EW.id=b.dataset.ew;ewLoad();ewDraw()});
 $('ewctl').querySelectorAll('[data-ewo]').forEach(b=>b.onclick=()=>{EW.c.opt=b.dataset.ewo;set()});
 const live=(id,f)=>{const el=$(id);if(el){el.oninput=()=>{f(el);const lab=el.previousElementSibling&&el.previousElementSibling.querySelector('span');if(lab)lab.textContent=id==='ewtune'?(EW.c.tune>0?'+':'')+EW.c.tune.toFixed(2):id==='ewsh'?f1(EW.c.shield,0)+' kg':id==='ewN'?'ε '+Math.round(EW.c.eps):(id==='ewD'?EW.c.D:EW.c.L).toFixed(2)+' m'};el.onchange=set}};
 live('ewtune',el=>EW.c.tune=+el.value/100);live('ewD',el=>EW.c.D=ewLogV(el,.1,20));live('ewL',el=>EW.c.L=ewLogV(el,.1,60));live('ewsh',el=>EW.c.shield=+el.value);live('ewN',el=>EW.c.eps=ewLogV(el,10,400));
 $('ewctl').querySelectorAll('[data-ewn]').forEach(b=>b.onclick=()=>{EW.c.n=+b.dataset.ewn;ewDraw()});
 {const bm=$('ewbim');if(bm)bm.onchange=()=>{EW.c.bim=bm.checked?1:0;ewDraw()}}
 {const lb=$('ewlive');if(lb)lb.onclick=()=>{if(engLiveTune(D.id,EW.c.tune)){if(D===DR[di])PW=D.pw;notify('⚡ '+tr(D.n)+': '+tr('exhaust')+' '+ewFmtV(D.ve)+' · '+tr('thrust')+' '+sci(D.k*(D===DR[di]?PW:D.pw)/D.ve)+' N');ewDraw()}}}
 $('ewcap').innerHTML=ewCaption(D,nw)}
function ewCaption(D,p){const fam=p.fam,o=p.o;
 const ions={fusion:{dd:'He-3, tritium and protons; deuterium plasma glows pink (H-α 656 nm, H-β 486 nm)',dt:'helium-4 (alpha particles) and hot D–T plasma: hydrogen pink, plus a hidden flux of 14 MeV neutrons',dhe3:'helium-4 and protons: helium yellow (587.6 nm) blended with hydrogen pink',pb11:'three helium-4 nuclei per reaction: pale pink-white (the boron lines are ultraviolet)'},
  grid:{xe:'xenon ions: blue (Xe II 484 & 529 nm)',kr:'krypton ions: pale violet-white',ar:'argon ions: violet (Ar II blue + Ar I red)'},plasma:{h2:'hydrogen plasma: pink-magenta (Balmer lines)',ar:'argon plasma: violet',li:'lithium plasma: crimson (670.8 nm)'},
  thermal:{h2:'hot hydrogen gas: nearly invisible, faint blue',ch4:'hot carbon and hydrogen: faint blue',nh3:'hot nitrogen and hydrogen: faint orange afterglow',wat:'superheated steam: faint orange-white'},chem:{chem:'water vapour: almost invisible, faint blue (OH emission is ultraviolet)',ml:'CO₂ and steam: blue flame with shock diamonds'}};
 const pulse=D.id==='icf'?' · '+tr('pulsed')+': '+f1(Math.max(1,p.pw/5e8),0)+' '+tr('pellets per second'):'';
 return `<span style="color:${o.col}">●</span> <span>${tr('Exhaust')}:</span> <span>${tr((ions[fam]||{})[EW.c.opt]||'')}</span>${pulse?`<span>${pulse}</span>`:''}`}
// the animated cutaway: core to scale (scale bar in metres), coils or nozzle, and the glowing plasma or flame
function ewAnim(){cancelAnimationFrame(EW.raf);const cv=$('ewcv');if(!cv||EWW.classList.contains('h'))return;const x=cv.getContext&&cv.getContext('2d');if(!x){return}
 const D=DR.find(q=>q.id===EW.id);if(!D){return}const fam=ENGFAM[D.id],c=EW.c,o=ENGOPT[fam].o[c.opt],W=cv.width,H=cv.height,t=(performance.now()-EW.t0)/1000;
 x.fillStyle='#03060f';x.fillRect(0,0,W,H);
 // scale: fit the core (plus nozzle) into the left 62 % of the canvas
 const bell=fam==='chem'||fam==='thermal',eR=bell?Math.min(1.6,.22*Math.sqrt(c.eps||100)*.36):.55,nozL=bell?c.L*.9*Math.sqrt((c.eps||100)/100):fam==='grid'?c.L*.15:c.L*.6,totL=c.L+nozL,sc=Math.min(W*.6/totL,H*.62/(c.D*Math.max(1,2*eR))),cx=24,cy=H/2,Lp=c.L*sc,Dp=c.D*sc,Np=nozL*sc;
 // grid
 x.strokeStyle='rgba(120,160,255,.08)';x.lineWidth=1;for(let i=0;i<W;i+=20){x.beginPath();x.moveTo(i,0);x.lineTo(i,H);x.stroke()}for(let j=0;j<H;j+=20){x.beginPath();x.moveTo(0,j);x.lineTo(W,j);x.stroke()}
 // plasma brightness: pulsed engines flash, magnetic ones breathe, electric ones hum
 const icf=D.id==='icf',fr=icf?Math.min(6,Math.max(1,D.pw/5e8)):0,ph=icf?(t*fr)%1:0,glow=icf?Math.exp(-ph*9):.82+.12*Math.sin(t*5.3)+.06*Math.sin(t*17.1);
 const col=o.col;
 // exhaust plume (behind the nozzle), drawn first so the engine sits on top
 const ex0=cx+Lp+Np,plumeL=W-ex0-8,pr=fam==='chem'||fam==='thermal'?Dp*.75:fam==='grid'?Dp*.55:Dp*.35;
 x.save();x.globalCompositeOperation='lighter';for(let k=0;k<3;k++){const g=x.createLinearGradient(ex0,0,ex0+plumeL,0);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');x.globalAlpha=(.22+.12*k)*glow;x.fillStyle=g;
  const w=pr*(1+.25*k);x.beginPath();x.moveTo(ex0,cy-w*.6);x.quadraticCurveTo(ex0+plumeL*.5,cy-w*(1.05+.04*Math.sin(t*3+k)),ex0+plumeL,cy-w*.2);x.lineTo(ex0+plumeL,cy+w*.2);x.quadraticCurveTo(ex0+plumeL*.5,cy+w*(1.05+.04*Math.cos(t*3+k)),ex0,cy+w*.6);x.closePath();x.fill()}
 // shock diamonds for chemical flames, drifting ion sparks for plasma and electric engines
 if(fam==='chem'&&c.opt==='ml'){for(let k=1;k<6;k++){const px=ex0+plumeL*k/6.5;x.globalAlpha=.35*glow;x.fillStyle='#ffffff';x.beginPath();x.ellipse(px,cy,pr*.35,pr*.18,0,0,7);x.fill()}}
 else if(fam!=='thermal'){for(let k=0;k<40;k++){const u=((t*(fam==='fusion'?1.6:.9)+k*.137)%1),px=ex0+u*plumeL,py=cy+Math.sin(k*12.9898)*pr*.55*(1-u*.5);x.globalAlpha=(1-u)*.8*glow;x.fillStyle=col;x.fillRect(px,py,2,2)}}
 x.restore();
 // core body
 x.fillStyle='#1a2030';x.strokeStyle='#6b7690';x.lineWidth=1.5;x.beginPath();x.rect(cx,cy-Dp/2,Lp,Dp);x.fill();x.stroke();
 // inner chamber with the glowing plasma / flame
 const ip=Math.max(2,Dp*.12);x.save();x.beginPath();x.rect(cx+ip,cy-Dp/2+ip,Lp-2*ip,Dp-2*ip);x.clip();x.globalCompositeOperation='lighter';
 const rg=x.createRadialGradient(cx+Lp/2,cy,0,cx+Lp/2,cy,Math.max(Lp,Dp)*.6);rg.addColorStop(0,'rgba(255,255,255,'+(.85*glow)+')');rg.addColorStop(.25,col);rg.addColorStop(1,'rgba(0,0,0,0)');x.globalAlpha=Math.max(.15,glow);x.fillStyle=rg;x.fillRect(cx,cy-Dp/2,Lp,Dp);
 if(fam==='fusion'&&!icf){x.globalAlpha=.6*glow;x.strokeStyle=col;x.lineWidth=Math.max(1,Dp*.05);x.beginPath();for(let i=0;i<=60;i++){const u=i/60,px=cx+ip+u*(Lp-2*ip),py=cy+Math.sin(u*Math.PI*6+t*4)*Dp*.08;i?x.lineTo(px,py):x.moveTo(px,py)}x.stroke()}
 if(icf){x.globalAlpha=Math.exp(-ph*4);x.fillStyle='#ffffff';x.beginPath();x.arc(cx+Lp*.55,cy,Math.max(2,Dp*.05)*(1+ph*6),0,7);x.fill()}
 x.restore();
 // magnet coils (fusion, plasma), grids (ion, Hall), or a bell nozzle (chemical, thermal)
 x.strokeStyle='#c98a3a';x.lineWidth=Math.max(1.5,Dp*.05);
 if(fam==='fusion'||fam==='plasma'){const n=Math.max(3,Math.min(14,Math.round(c.L/c.D*3)));for(let i=0;i<n;i++){const px=cx+Lp*(i+.5)/n;x.beginPath();x.moveTo(px,cy-Dp/2-2);x.lineTo(px,cy+Dp/2+2);x.stroke()}}
 if(fam==='grid'){x.strokeStyle='#aab4c8';x.lineWidth=1;for(let k=0;k<2;k++){const px=cx+Lp-2-k*3;x.beginPath();x.moveTo(px,cy-Dp/2);x.lineTo(px,cy+Dp/2);x.setLineDash([2,2]);x.stroke();x.setLineDash([])}}
 if(fam==='chem'||fam==='thermal'||fam==='fusion'||fam==='plasma'){x.fillStyle='#262d40';x.strokeStyle='#8590aa';x.lineWidth=1.5;const th=fam==='chem'||fam==='thermal'?Dp*.22:Dp*.3,ex=fam==='chem'||fam==='thermal'?Math.min(Dp*1.6,th*Math.sqrt(c.eps||100)*.36):Dp*.55;
  x.beginPath();x.moveTo(cx+Lp,cy-Dp/2);x.lineTo(cx+Lp,cy-th);x.quadraticCurveTo(cx+Lp+Np*.35,cy-th,cx+Lp+Np,cy-ex);x.lineTo(cx+Lp+Np,cy-ex+3);x.quadraticCurveTo(cx+Lp+Np*.3,cy-th+3,cx+Lp+3,cy-th+3);x.lineTo(cx+Lp+3,cy+th-3);x.quadraticCurveTo(cx+Lp+Np*.3,cy+th-3,cx+Lp+Np,cy+ex-3);x.lineTo(cx+Lp+Np,cy+ex);x.quadraticCurveTo(cx+Lp+Np*.35,cy+th,cx+Lp,cy+th);x.lineTo(cx+Lp,cy+Dp/2);x.stroke();
  x.save();x.globalCompositeOperation='lighter';x.globalAlpha=.45*glow;x.fillStyle=col;x.beginPath();x.moveTo(cx+Lp+3,cy-th+3);x.quadraticCurveTo(cx+Lp+Np*.3,cy-th+3,cx+Lp+Np,cy-ex+3);x.lineTo(cx+Lp+Np,cy+ex-3);x.quadraticCurveTo(cx+Lp+Np*.3,cy+th-3,cx+Lp+3,cy+th-3);x.closePath();x.fill();x.restore()}
 if(fam==='fusion'&&c.shield>0){const sw=Math.max(3,Math.min(30,c.shield/1000*3));x.fillStyle='#3d4456';x.fillRect(cx-sw-3,cy-Dp*.55,sw,Dp*1.1)}
 // scale bar and dimensions
 const m1=Math.pow(10,Math.floor(Math.log10(totL/3))),bar=m1*sc;x.strokeStyle='#cfd6e6';x.lineWidth=1;x.beginPath();x.moveTo(cx,H-16);x.lineTo(cx+bar,H-16);x.moveTo(cx,H-20);x.lineTo(cx,H-12);x.moveTo(cx+bar,H-20);x.lineTo(cx+bar,H-12);x.stroke();
 x.fillStyle='#cfd6e6';x.font='12px ui-monospace,monospace';x.fillText((m1>=1?m1:m1.toFixed(1))+' m',cx+bar+6,H-12);x.fillText('Ø '+c.D.toFixed(2)+' m × '+c.L.toFixed(2)+' m'+((c.n||1)>1?'  ·  '+tr('cluster of')+' '+c.n:''),cx,16);
 x.fillStyle=col;x.fillText(tr(o.n),W-120,16);
 EW.raf=requestAnimationFrame(ewAnim)}
$('ewc').onclick=()=>EWW.classList.add('h');
$('ewrs').onclick=()=>{ewLoad();ewDraw()};
$('ewgo').onclick=()=>{const D=DR.find(x=>x.id===EW.id);if(!D)return;const j=engDesignJob(D.id,EW.c);if(!j){notify('⚠ '+tr('Not enough materials for this design:')+' '+matTxt(engDesignCost(D,{...EW.c,dims:true}).mat));return}
 notify('🔧 '+tr('Rebuilding the engine (see 🏭 Fabricate jobs).'));setTimeout(()=>{ewLoad();ewDraw()},100)};
ORB.on('job:done',j=>{if(j.type==='design'&&!EWW.classList.contains('h')){ewLoad();ewDraw()}});
{const b=$('ewbtn');if(b)b.onclick=()=>ewToggle()}
// the ship's exhaust plume takes the design's true colour, and the inertial-fusion drive flashes with each pellet
ORB.on('frame',now=>{if(typeof plume==='undefined'||!plume||!plume.visible)return;const D=DR[di],c=ENGFAM[D.id]?engCfg(D):null;if(c&&c.dims){const w=Math.max(.3,Math.min(4,c.D/ENGDIM[D.id][0]));plume.scale.x*=w;plume.scale.z*=w}if(D.col&&plume.material.color.getHexString()!==D.col.slice(1).toLowerCase())plume.material.color.set(D.col);
 if(D.id==='icf'){const fr=Math.min(6,Math.max(1,PW/5e8)),ph=(now/1000*fr)%1;plume.material.opacity=(REAL()?.35:.7)*(.25+.75*Math.exp(-ph*7))}});
