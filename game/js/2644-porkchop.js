// ===== PORKCHOP PLOT (client): 🧭 NAVIGATE → PORKCHOP PLOT =====
// Mission designers pick launch dates from a "porkchop plot": for every departure day (across) and flight time (up), the
// total speed change of the transfer, solved exactly with Lambert's problem (the one orbit around the Sun that joins
// where you are on day D to where the target will be on day D + flight time). Dark is cheap. The cheapest point is
// marked; hover to read any point. Speed change counts the burn out of your planet's low orbit (Oberth included) and
// the capture into a low orbit at the target, like the mission planner.
// Lambert solver: universal variables with Stumpff functions (Curtis, Orbital Mechanics for Engineering Students,
// algorithm 5.2), zero-revolution prograde transfers, solved by bisection on z.
const stC=z=>z>1e-8?(1-Math.cos(Math.sqrt(z)))/z:z<-1e-8?(Math.cosh(Math.sqrt(-z))-1)/-z:.5-z/24,
 stS=z=>z>1e-8?(Math.sqrt(z)-Math.sin(Math.sqrt(z)))/Math.pow(z,1.5):z<-1e-8?(Math.sinh(Math.sqrt(-z))-Math.sqrt(-z))/Math.pow(-z,1.5):1/6-z/120;
function lambert(r1,r2,tof,mu){const R1=Math.hypot(...r1),R2=Math.hypot(...r2),cz=r1[0]*r2[1]-r1[1]*r2[0];let cs=(r1[0]*r2[0]+r1[1]*r2[1]+r1[2]*r2[2])/(R1*R2);cs=Math.max(-1,Math.min(1,cs));
 let dth=Math.acos(cs);if(cz<0)dth=2*Math.PI-dth;const A=Math.sin(dth)*Math.sqrt(R1*R2/(1-Math.cos(dth)));if(!isFinite(A)||Math.abs(A)<1e-9)return null;
 const y=z=>R1+R2+A*(z*stS(z)-1)/Math.sqrt(stC(z)),tf=z=>{const Y=y(z);if(Y<0)return-1;const x=Math.sqrt(Y/stC(z));return(x*x*x*stS(z)+A*Math.sqrt(Y))/Math.sqrt(mu)};
 let lo=-4*Math.PI*Math.PI,hi=4*Math.PI*Math.PI-1e-6;while(y(lo)<0&&lo<hi)lo+=.1;if(tf(lo)>tof||tf(hi)<tof)return null;
 for(let k=0;k<80;k++){const m=(lo+hi)/2;if(tf(m)<tof)lo=m;else hi=m}const z=(lo+hi)/2,Y=y(z),f=1-Y/R1,g=A*Math.sqrt(Y/mu),gd=1-Y/R2;
 return{v1:r1.map((c,i)=>(r2[i]-f*c)/g),v2:r1.map((c,i)=>(gd*r2[i]-c)/g)}}
// position and velocity of a planet (around the Sun) at time t, from its circular rail
const pkState=(b,t)=>{const th=b.ph+b.nn*t,c=Math.cos(th),sn=Math.sin(th);return{r:[b.a*c,b.a*sn,0],v:[-b.a*b.nn*sn,b.a*b.nn*c,0]}};
const PK={to:'Mars',grid:null,cv:null};
const PKW=document.createElement('div');PKW.id='pkw';PKW.className='h';
PKW.innerHTML='<div class="card"><h2>🥩 Porkchop plot</h2><p class="opsn">Total speed change for every departure day (across) and flight time (up), each solved exactly as a Lambert transfer. Dark is cheap; the cross marks the cheapest launch. Hover to read a point.</p><p><span id="pkfrom"></span> → <select id="pkto" aria-label="Target"></select> <span id="pkinfo"></span></p><canvas id="pkcv" width="760" height="420"></canvas><p class="opsn" id="pkhov"></p><button id="pkc">Close</button></div>';
document.body.appendChild(PKW);$('pkc').onclick=()=>PKW.classList.add('h');
const pkHome=()=>{const d=s.dom;return d&&d!==B[0]&&!d.star&&!(d.p>0&&B[d.p].star)?(d.p===0?d:B[d.p]):B[3]};
function pkToggle(){PKW.classList.toggle('h');if(!PKW.classList.contains('h')){const H=pkHome(),L=B.filter(b=>b.p===0&&!b.star&&b!==H);if(!L.find(b=>b.n===PK.to))PK.to=L[0].n;$('pkto').innerHTML=L.map(b=>`<option value="${b.n}" ${b.n===PK.to?'selected':''}>${tr(b.n)}</option>`).join('');$('pkto').onchange=e=>{PK.to=e.target.value;pkRun()};pkRun()}}
function pkRun(){const H=pkHome(),Tg=B.find(b=>b.n===PK.to),mu=B[0].GM;$('pkfrom').textContent=tr(H.n);
 const hoh=Math.PI*Math.sqrt(((H.a+Tg.a)/2)**3/mu),syn=Math.abs(2*Math.PI/(H.nn-Tg.nn)),span=Math.min(Math.max(syn*1.15,200*86400),6*3.15576e7),NX=64,NY=40,t0=T,tl=hoh*.45,th=hoh*1.7;
 const G=[];let best=null;
 for(let i=0;i<NX;i++){const td=t0+span*i/(NX-1),A=pkState(H,td);for(let j=0;j<NY;j++){const tf=tl+(th-tl)*j/(NY-1),Bs=pkState(Tg,td+tf),L=lambert(A.r,Bs.r,tf,mu);let dv=Infinity,d1=0,d2=0;
  if(L){const i1=Math.hypot(...L.v1.map((v,k)=>v-A.v[k])),i2=Math.hypot(...L.v2.map((v,k)=>v-Bs.v[k]));d1=plOb(H,i1);d2=plOb(Tg,i2);dv=d1+d2}
  const c={i,j,td,tf,dv,d1,d2};G.push(c);if(isFinite(dv)&&(!best||dv<best.dv))best=c}}
 PK.grid={G,NX,NY,best,span,tl,th,t0};pkDraw();$('pkinfo').innerHTML=best?`<span>${tr('cheapest')}:</span> <b>${f1(best.dv/1e3,2)} km/s</b> · <span>${tr('leave in')}</span> ${dur(best.td-t0)} · <span>${tr('flight')}</span> ${dur(best.tf)}`:''}
function pkCol(f){f=Math.max(0,Math.min(1,f));const S=[[13,8,135],[84,2,163],[139,10,165],[185,50,137],[219,92,104],[244,136,73],[254,188,43],[240,249,33]],x=f*(S.length-1),k=Math.min(S.length-2,Math.floor(x)),u=x-k;return'rgb('+S[k].map((v,q)=>Math.round(v+(S[k+1][q]-v)*u)).join(',')+')'}
function pkDraw(){const P=PK.grid,cv=$('pkcv'),x=cv.getContext&&cv.getContext('2d');if(!P||!x)return;const W=cv.width,Hh=cv.height,L=54,Bm=34,pw=W-L-70,ph=Hh-Bm-14,cw=pw/P.NX,ch=ph/P.NY;
 const fin=P.G.filter(c=>isFinite(c.dv)).map(c=>c.dv),lo=P.best?P.best.dv:0,hi=Math.min(Math.max(...fin),lo*3.5);x.fillStyle='#04060d';x.fillRect(0,0,W,Hh);
 for(const c of P.G){x.fillStyle=isFinite(c.dv)?pkCol(Math.log(c.dv/lo)/Math.log(hi/lo)):'#222';x.fillRect(L+c.i*cw,14+ph-(c.j+1)*ch,cw+.6,ch+.6)}
 // contour lines every 1 km/s above the minimum (cell edges where the whole-km/s band changes)
 x.fillStyle='rgba(255,255,255,.35)';const band=c=>isFinite(c.dv)?Math.floor((c.dv-lo)/1000):-1;
 for(const c of P.G){if(!isFinite(c.dv)||c.dv>hi)continue;const n=P.G[(c.i+1)*P.NY+c.j],u=c.j+1<P.NY?P.G[c.i*P.NY+c.j+1]:null;
  if(n&&band(n)!==band(c))x.fillRect(L+(c.i+1)*cw-.5,14+ph-(c.j+1)*ch,1,ch);if(u&&band(u)!==band(c))x.fillRect(L+c.i*cw,14+ph-(c.j+1)*ch-.5,cw,1)}
 x.strokeStyle='#8a93ad';x.strokeRect(L,14,pw,ph);x.fillStyle='#cfd6e6';x.font='11px ui-monospace,monospace';
 for(let k=0;k<=4;k++){const d=P.span*k/4;x.fillText(dur(d),L+pw*k/4-14,Hh-14)}x.fillText(tr('departure (from now)'),L+pw/2-60,Hh-2);
 for(let k=0;k<=4;k++){const t=P.tl+(P.th-P.tl)*k/4;x.fillText(dur(t),2,14+ph-ph*k/4+4)}
 x.save();x.translate(12,14+ph/2+40);x.rotate(-Math.PI/2);x.fillText(tr('flight time'),0,0);x.restore();
 // colour bar
 for(let k=0;k<ph;k++){x.fillStyle=pkCol(1-k/ph);x.fillRect(W-58,14+k,12,1)}x.fillStyle='#cfd6e6';x.fillText(f1(hi/1e3,1),W-42,22);x.fillText(f1(lo/1e3,1),W-42,14+ph);x.fillText('km/s',W-42,14+ph/2);
 if(P.best){const bx=L+(P.best.i+.5)*cw,by=14+ph-(P.best.j+.5)*ch;x.strokeStyle='#fff';x.lineWidth=2;x.beginPath();x.moveTo(bx-7,by-7);x.lineTo(bx+7,by+7);x.moveTo(bx+7,by-7);x.lineTo(bx-7,by+7);x.stroke();x.lineWidth=1}
 cv.onmousemove=e=>{const r=cv.getBoundingClientRect(),mx=(e.clientX-r.left)*W/r.width,my=(e.clientY-r.top)*Hh/r.height,i=Math.floor((mx-L)/cw),j=Math.floor((14+ph-my)/ch);const c=P.G[i*P.NY+j];
  if(i<0||j<0||i>=P.NX||j>=P.NY||!c)return;$('pkhov').innerHTML=isFinite(c.dv)?`<span>${tr('leave in')}</span> ${dur(c.td-P.t0)} · <span>${tr('flight')}</span> ${dur(c.tf)} · <b>${f1(c.dv/1e3,2)} km/s</b> (<span>${tr('leave')}</span> ${f1(c.d1/1e3,2)} + <span>${tr('arrive')}</span> ${f1(c.d2/1e3,2)})`:tr('no transfer')};cv.onclick=cv.onmousemove}
{const nb=$('navbody');if(nb){const g=grp(nb,'PORKCHOP PLOT (best launch dates, solved exactly)');btn(g,'🥩 Open the porkchop plot',()=>pkToggle())}}
