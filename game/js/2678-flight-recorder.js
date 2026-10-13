// ===== FLIGHT RECORDER (client): key ;  or 📈 in 🛠 → ⛏ Inventory =====
// A black box for the whole mission: distance from the Sun, speed, altitude, battery, cabin temperature, radiation
// dose rate, propellant and hull, sampled against game time. When the record gets long, every other point is dropped,
// so the whole flight always fits (older parts at lower resolution). Hover a chart to read the values at that moment.
const REC={pts:[],lastT:-1e99,step:30};
function recSample(){if(T<REC.lastT-1){REC.pts=[];REC.lastT=-1e99;REC.step=30}if(!s.crew||T-REC.lastT<REC.step)return;REC.lastT=T;const d=s.dom,g=gam(s),S=B[0],L=lifeDays();
 REC.pts.push({T,r:Math.hypot(s.x-S.x,s.y-S.y,s.z-S.z)/AU,v:Math.hypot(s.vx/g-d.vx,s.vy/g-d.vy,s.vz/g-d.vz)/1e3,alt:Math.max(0,Math.hypot(s.x-d.x,s.y-d.y,s.z-d.z)-d.R)/1e3,dom:d.n,
  bat:100*s.en/Math.max(1,SH.cap),tlo:s.tLo-273.15,dose:doseNow().tot*86400e3,prop:DR[di].f?s.prop:0,hull:100*s.hull/hullMax(),sup:Math.min(L.o2,L.wat,L.food)});
 if(REC.pts.length>900){REC.pts=REC.pts.filter((p,i)=>i%2===0);REC.step*=2}}
ORB.on('frame',()=>{try{recSample()}catch(e){}});
const FRW=document.createElement('div');FRW.id='frw';FRW.className='h';
FRW.innerHTML='<div class="card"><h2>📈 Flight recorder</h2><p class="opsn">Your whole mission against game time. Older parts are kept at lower resolution so everything fits. Hover a chart to read it.</p><div id="frb" class="frgrid"></div><button id="frc">Close (;)</button></div>';
document.body.appendChild(FRW);$('frc').onclick=()=>FRW.classList.add('h');
const FRC=[['r','Distance from the Sun','AU',3,'#ffd36a'],['v','Speed (relative to the body you orbit)','km/s',2,'#6fd0ff'],['alt','Altitude','km',0,'#9dffb0'],['bat','Battery','%',0,'#5dff8a'],
 ['tlo','Cabin temperature','°C',1,'#ff9a6a'],['dose','Radiation dose rate','mSv/day',2,'#ff6ad5'],['prop','Propellant (current engine)','kg',0,'#c8a6ff'],['hull','Hull','%',0,'#cfd6e6'],['sup','Supplies left (shortest)','days',0,'#ffe08a']];
function frToggle(){FRW.classList.toggle('h');if(!FRW.classList.contains('h'))frDraw()}
function frDraw(){if(FRW.classList.contains('h'))return;const P=REC.pts,box=$('frb');if(P.length<2){box.innerHTML='<p>'+tr('Recording… speed up time for a moment and come back.')+'</p>';return}
 if(!box.children.length||box.children.length!==FRC.length)box.innerHTML=FRC.map(([k,n,u])=>`<div class="frc"><div class="frh"><b>${tr(n)}</b> <span data-frv="${k}"></span></div><canvas data-fr="${k}" width="460" height="130"></canvas></div>`).join('');
 const t0=P[0].T,t1=P[P.length-1].T;
 for(const[k,n,u,dg,col]of FRC){const cv=box.querySelector(`[data-fr="${k}"]`),x=cv.getContext&&cv.getContext('2d');if(!x)continue;const W=cv.width,H=cv.height,vals=P.map(p=>p[k]).filter(v=>isFinite(v));
  let lo=Math.min(...vals),hi=Math.max(...vals);if(!(hi>lo)){hi=lo+1;lo-=1}const pad=(hi-lo)*.08;lo-=pad;hi+=pad;const X=t=>36+(W-44)*(t-t0)/Math.max(1,t1-t0),Y=v=>H-18-(H-28)*(v-lo)/(hi-lo);
  x.clearRect(0,0,W,H);x.fillStyle='#060a18';x.fillRect(0,0,W,H);x.strokeStyle='rgba(140,170,255,.12)';x.lineWidth=1;for(let i=0;i<=4;i++){const y=10+(H-28)*i/4;x.beginPath();x.moveTo(36,y);x.lineTo(W-8,y);x.stroke()}
  x.fillStyle='#8a93ad';x.font='10px ui-monospace,monospace';x.fillText(f1(hi,dg),2,14);x.fillText(f1(lo,dg),2,H-18);x.fillText(tr('mission time')+' '+dur(t1-t0),36,H-4);
  const g=x.createLinearGradient(0,10,0,H-18);g.addColorStop(0,col+'55');g.addColorStop(1,col+'00');x.beginPath();let first=true;for(const p of P){if(!isFinite(p[k]))continue;const px=X(p.T),py=Y(p[k]);first?x.moveTo(px,py):x.lineTo(px,py);first=false}
  x.strokeStyle=col;x.lineWidth=1.6;x.stroke();x.lineTo(X(t1),H-18);x.lineTo(X(t0),H-18);x.closePath();x.fillStyle=g;x.fill();
  const last=P[P.length-1][k];x.fillStyle=col;x.beginPath();x.arc(X(t1),Y(last),3,0,7);x.fill();box.querySelector(`[data-frv="${k}"]`).textContent=f1(last,dg)+' '+tr(u);
  cv.onmousemove=e=>{const r=cv.getBoundingClientRect(),tx=t0+(e.clientX-r.left)/r.width*W/(W-44)*(t1-t0)-36/(W-44)*(t1-t0);let best=P[0];for(const p of P)if(Math.abs(p.T-tx)<Math.abs(best.T-tx))best=p;
   box.querySelector(`[data-frv="${k}"]`).textContent=f1(best[k],dg)+' '+tr(u)+' · '+tr('at')+' '+dur(Math.max(0,best.T-t0))+(k==='alt'||k==='v'?' · '+tr(best.dom):'')}}}
let frAt=0;ORB.on('ui',()=>{const n=performance.now();if(n-frAt>1500){frAt=n;frDraw()}});
