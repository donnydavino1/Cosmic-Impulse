// ===== SPECTROMETER (client): key \ , or 🔬 in 🛠 → ⛏ Inventory =====
// Point the ship's spectrometer at an asteroid: its reflectance spectrum from 0.4 to 2.5 µm (how much sunlight it
// reflects at each wavelength) reveals what it is made of before you fly there. C-types are dark with a hydrated-mineral
// dip at 0.7 µm; S-types are brighter, red-sloped, with olivine and pyroxene bands at 1 and 2 µm; M-types are metal:
// smooth and featureless; icy bodies are bright with water-ice bands at 1.5 and 2 µm. Farther targets give noisier
// spectra. Below it: the whole body's mass and what is in it (from its type), minus what has been mined.
const SPW=document.createElement('div');SPW.id='spw';SPW.className='h';
SPW.innerHTML='<div class="card"><h2>🔬 Spectrometer</h2><p class="opsn">Reflected sunlight, split by wavelength: the dips are minerals and ice absorbing light. The farther the target, the noisier the spectrum.</p><p><select id="spsel" aria-label="Asteroid"></select></p><div class="spgrid"><canvas id="spcv" width="560" height="260"></canvas><div id="spinf"></div></div><button id="spc">Close (\\)</button></div>';
document.body.appendChild(SPW);$('spc').onclick=()=>SPW.classList.add('h');
const SPD={C:1.4,S:2.7,M:5.3,I:.9},SPA={C:.05,S:.25,M:.15,I:.6};
// reflectance model per type (relative to 0.55 µm): continuum slope plus Gaussian absorption bands
function spModel(t,l){const g=(c,w,d)=>d*Math.exp(-(((l-c)/w)**2));let r=1;
 if(t==='C')r=1+.05*(l-.55)-g(.7,.08,.06)-(l<.5?.12*(.5-l)/.1:0);
 else if(t==='S')r=1+.35*(l-.55)-g(1,.13,.28)-g(2,.3,.12)-(l<.5?.25*(.5-l)/.1:0);
 else if(t==='M')r=1+.22*(l-.55)-g(.9,.1,.03);
 else r=1-.05*(l-.55)-g(1.5,.09,.35)-g(2.02,.12,.45)-g(1.04,.04,.06)-g(1.25,.05,.08);return Math.max(.02,r)}
function spOpen(a){SPW.classList.remove('h');const L=AST.slice().sort((x,y)=>astDist(x)-astDist(y)),sel=$('spsel');sel.innerHTML=L.map(q=>`<option value="${q.n}">${q.n} · ${q.t}-type · ${fmtD(astDist(q))}</option>`).join('');
 const pick=a||(WT&&WT.kind==='ast'?WT.a:L[0]);sel.value=pick.n;sel.onchange=()=>spDraw(AST.find(q=>q.n===sel.value));spDraw(pick)}
// rotation period: most small asteroids spin in 2–30 h; rubble piles bigger than ~200 m cannot spin faster than ~2.2 h
// without flying apart (the spin barrier), smaller monoliths can spin in minutes
function spRot(a){let sd=7;for(const ch of a.n)sd=(sd*131+ch.charCodeAt(0))>>>0;const u=(sd%10000)/10000,lo=a.r>100?2.2:.1;return lo*Math.pow(30/lo,u)}
function spToggle(){if(SPW.classList.contains('h'))spOpen();else SPW.classList.add('h')}
function spDraw(a){if(!a)return;const cv=$('spcv'),x=cv.getContext&&cv.getContext('2d'),d=astDist(a),noise=.004+.08*Math.min(1,d/(2*AU)),W=cv.width,H=cv.height;
 if(x){x.fillStyle='#050916';x.fillRect(0,0,W,H);let rlo=9,rhi=0;for(let l=.4;l<=2.5;l+=.02){const r=spModel(a.t,l);rlo=Math.min(rlo,r);rhi=Math.max(rhi,r)}rlo=Math.max(0,Math.floor((rlo-.1)*5)/5);rhi=Math.ceil((rhi+.1)*5)/5;const X=l=>44+(W-56)*(l-.4)/2.1,Y=r=>H-30-(H-50)*(r-rlo)/(rhi-rlo);
  x.strokeStyle='rgba(140,170,255,.12)';x.lineWidth=1;x.font='10px ui-monospace,monospace';x.fillStyle='#8a93ad';
  for(let l=.5;l<=2.5;l+=.5){x.beginPath();x.moveTo(X(l),12);x.lineTo(X(l),H-30);x.stroke();x.fillText(l.toFixed(1)+' µm',X(l)-14,H-16)}
  for(let r=rlo;r<=rhi+1e-9;r+=.2){x.beginPath();x.moveTo(44,Y(r));x.lineTo(W-12,Y(r));x.stroke();x.fillText(r.toFixed(1),14,Y(r)+3)}
  // the visible band in its own colours, so the 0.4–0.7 µm part reads as light
  const vg=x.createLinearGradient(X(.4),0,X(.7),0);['#7a3cff','#3c6bff','#2bd0ff','#3cff7a','#e8ff3c','#ffb03c','#ff3c3c'].forEach((c,i)=>vg.addColorStop(i/6,c));x.globalAlpha=.18;x.fillStyle=vg;x.fillRect(X(.4),12,X(.7)-X(.4),H-42);x.globalAlpha=1;
  let sd=0;for(const ch of a.n)sd=(sd*31+ch.charCodeAt(0))>>>0;const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647,gs=()=>{let u=0;for(let i=0;i<6;i++)u+=rnd();return u-3};
  x.fillStyle='#ffd36a';for(let l=.42;l<=2.48;l+=.01){const r=spModel(a.t,l)+noise*gs()*.7;x.fillRect(X(l)-1,Y(r)-1,2,2)}
  x.strokeStyle='#6fd0ff';x.lineWidth=1.5;x.beginPath();for(let l=.4;l<=2.5;l+=.01){const r=spModel(a.t,l);l===.4?x.moveTo(X(l),Y(r)):x.lineTo(X(l),Y(r))}x.stroke();
  x.fillStyle='#cfd6e6';x.fillText(tr('reflectance (relative to 0.55 µm)'),48,22);
  const bands={C:[[.7,'hydrated minerals']],S:[[1,'olivine + pyroxene'],[2,'pyroxene']],M:[[1.6,'metal: no bands']],I:[[1.5,'water ice'],[2.02,'water ice']]}[a.t]||[];
  x.fillStyle='#ff9ad5';for(const[l,n]of bands){x.fillText('▼ '+tr(n),X(l)-10,Y(spModel(a.t,l))+16)}}
 // first clean spectrum of a body (signal noise under 3 %) is new science: research points
 if(noise<.03){s.scanned=s.scanned||{};if(!s.scanned[a.n]){s.scanned[a.n]=1;const rp=a.t==='M'?12:a.t==='I'?10:6;s.rp+=rp;notify('🔬 '+tr('New spectrum')+': '+a.n+' · +'+rp+' '+tr('research points'))}}
 const vol=4/3*Math.PI*a.r**3,M=vol*SPD[a.t]*1000,left=Math.max(0,M-(a.mined||0)),c=COMP[a.t];
 const gS=6.674e-11*M/(a.r*a.r),vE=Math.sqrt(2*6.674e-11*M/a.r),prot=spRot(a),vEq=2*Math.PI*a.r/(prot*3600);
 $('spinf').innerHTML=`<p><b>${a.n}</b> · ${a.t}-type (<span>${tr(TYN[a.t])}</span>) · ${f1(a.r*2,0)} m <span>${tr('wide')}</span> · ${fmtD(d)} <span>${tr('away')}</span></p><p class="opsn"><span>${tr('Albedo')}</span> ${SPA[a.t]} · <span>${tr('density')}</span> ${SPD[a.t]} g/cm³ · <span>${tr('mass')}</span> ${sci(M)} kg${a.mined?' · <span>'+tr('mined so far')+'</span> '+sci(a.mined)+' kg':''} · <span>${tr('signal noise')}</span> ${f1(noise*100,1)} %</p>
  <p class="opsn"><span>${tr('Surface gravity')}</span> ${sci(gS)} m/s² (${sci(gS/9.81)} g) · <span>${tr('escape speed')}</span> <b>${vE<1?f1(vE*100,1)+' cm/s':f1(vE,2)+' m/s'}</b> · <span>${tr('spins once every')}</span> ${f1(prot,1)} h · <span>${tr('equator moves at')}</span> ${f1(vEq*100,1)} cm/s${vE<4?' · 🦘 <span>'+tr('a hard jump would launch you into space')+'</span>':''}</p><table class="bldt"><tr><th>${tr('Material')}</th><th>${tr('Share')}</th><th>${tr('In the whole body')}</th></tr>${Object.keys(c).filter(k=>c[k]>0).map(k=>`<tr><td>${tr(RN[k]||k)}</td><td>${c[k]>=.01?f1(c[k]*100,1)+' %':f1(c[k]*1e6,0)+' ppm'}</td><td>${sci(left*c[k])} kg</td></tr>`).join('')}</table>`}
