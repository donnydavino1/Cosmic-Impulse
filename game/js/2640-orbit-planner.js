// ===== ORBIT PLANNER (client): geostationary, geosynchronous or any circular orbit around the body you orbit =====
// Key F6, or 🛰 Orbit planner in 🧭 NAVIGATE. Works out the synchronous radius (one orbit per rotation of the body),
// shows altitude, period and an estimate of the Δv, and hands the target to the autopilot (apOrb in 0100-physics.js).
// Geostationary: synchronous AND in the equator, so you hang over one spot. Geosynchronous: synchronous, keeping your
// current tilt (you trace a figure-eight over the ground). Custom: any radius you type.
const ORW=document.createElement('div');ORW.id='orbw';ORW.className='h';
ORW.innerHTML='<div class="card"><h2>🛰 Orbit planner</h2><div id="orbb"></div><button id="orbc">Close (F6)</button></div>';document.body.appendChild(ORW);
$('orbc').onclick=()=>ORW.classList.add('h');
const ORB_P={type:'geo',r:null,b:null};
const syncR=P=>Math.cbrt(P.GM*(Math.abs(P.rot)/(2*Math.PI))**2);
function orbToggle(){ORW.classList.toggle('h');ORB_P.r=null;orbDraw()}
function orbDraw(){if(ORW.classList.contains('h'))return;const P=s.dom,b=$('orbb');
 if(!P||P===B[0]){b.innerHTML='<p class="opsn">You are orbiting the Sun. Fly to a planet or moon first (🧭 NAVIGATE); this planner works around the body you orbit.</p>';return}
 const bi=B.indexOf(P),rs=syncR(P);if(ORB_P.b!==bi||ORB_P.r==null){ORB_P.b=bi;ORB_P.r=ORB_P.type==='custom'?P.R+4e5:rs}
 const r=ORB_P.type==='custom'?ORB_P.r:rs,per=2*Math.PI*Math.sqrt(r**3/P.GM),o=elements(),r0=o.r,mu=P.GM,
  hoh=Math.abs(Math.sqrt(mu/r0)*(Math.sqrt(2*r/(r0+r))-1))+Math.abs(Math.sqrt(mu/r)*(1-Math.sqrt(2*r0/(r0+r)))),
  g=gam(s),hx=(s.y-P.y)*(s.vz/g-P.vz)-(s.z-P.z)*(s.vy/g-P.vy),hy=(s.z-P.z)*(s.vx/g-P.vx)-(s.x-P.x)*(s.vz/g-P.vz),hz=(s.x-P.x)*(s.vy/g-P.vy)-(s.y-P.y)*(s.vx/g-P.vx),inc=Math.acos(Math.max(-1,Math.min(1,hz/(Math.hypot(hx,hy,hz)||1)))),
  plane=ORB_P.type==='geo'?2*Math.sqrt(mu/Math.max(r,r0))*Math.sin(inc/2):0,dv=hoh+plane,low=r<P.R*1.02,far=r>P.soi*.6;
 const opt=(k,t,d)=>`<label class="orbo"><input type="radio" name="orbt" value="${k}" ${ORB_P.type===k?'checked':''}> <b>${t}</b> <span class="opsn">${d}</span></label>`;
 b.innerHTML=`<p><span>Around</span> <b>${P.n}</b> · <span>it turns once every</span> ${dur(Math.abs(P.rot))} · <span>radius</span> ${f1(P.R/1e3,0)} km</p>
 ${opt('geo','Geostationary','synchronous, in the equator: you hang over one spot')}
 ${opt('sync','Geosynchronous','synchronous, keeping your current tilt: a figure-eight over the ground')}
 ${opt('custom','Custom circular orbit','any distance you choose')}
 <p><span>Distance from the centre of</span> ${P.n}: <input id="orbr" type="number" min="1" step="100" value="${Math.round(r/1e3)}" ${ORB_P.type==='custom'?'':'disabled'}> km
  <small>(<span>altitude</span> ${f1((r-P.R)/1e3,0)} km)</small></p>
 <table class="bldt"><tr><td>One orbit takes</td><td>${dur(per)}</td></tr><tr><td>Speed in that orbit</td><td>${f1(Math.sqrt(mu/r)/1e3,3)} km/s</td></tr>
  <tr><td>Your orbit now</td><td>${f1(r0/1e3,0)} km · <span>tilt</span> ${f1(inc*180/Math.PI,1)}°</td></tr><tr><td>Δv needed (estimate)</td><td>${f1(dv/1e3,2)} km/s</td></tr></table>
 ${low?'<p class="opsw-no">⚠ That is below the surface.</p>':''}${far?`<p class="opsw-no">⚠ That is too far: ${P.n}'s gravity cannot hold you there against the Sun's.</p>`:''}
 <p><button id="orbgo" ${low||far?'disabled':''}>🛰 Fly to this orbit</button> <small class="opsn">The autopilot uses your engine and fuel. Speed up time (⏩) while it works.</small></p>`;
 b.querySelectorAll('input[name=orbt]').forEach(x=>x.onchange=()=>{ORB_P.type=x.value;ORB_P.r=null;orbDraw()});
 const ri=$('orbr');if(ri)ri.onchange=()=>{const v=+ri.value*1e3;if(v>0){ORB_P.r=v;orbDraw()}};
 $('orbgo').onclick=()=>{const nm=(ORB_P.type==='geo'?'Geostationary orbit':ORB_P.type==='sync'?'Geosynchronous orbit':'Circular orbit')+' around '+P.n;ORW.classList.add('h');
  apAsk({name:nm,days:Math.max(.1,(per+2*Math.PI*Math.sqrt(r0**3/mu))/86400),extra:0,dvNeed:dv*1.2,dvHave:dvHave()},()=>{AP={name:nm,orb:{b:bi,r,eq:ORB_P.type==='geo'},stage:''};PRED=null;notify('🛰 Autopilot: '+nm+' ('+Math.round(r/1e3).toLocaleString()+' km from the centre). Speed up time while it flies.')})}}
{const nb=document.getElementById('navhead');if(nb){const bt=document.createElement('button');bt.textContent='🛰 Orbit planner (F6)';bt.style.marginLeft='10px';bt.onclick=e=>{e.stopPropagation();orbToggle()};nb.appendChild(bt)}}
