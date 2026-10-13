// ===== COMMS (client): 🧭 NAVIGATE → COMMS =====
// Talking to Earth is limited by light speed and by how much signal survives the trip. A radio link's received power is
//   Pr = Pt · Gt · Gr · (λ / 4πd)²,  dish gain G = η · (πD/λ)²
// and the data rate is what that power can carry above thermal noise: R = Pr / (k · Tsys · Eb/N0) (Eb/N0 ≈ 2 with good
// coding). Shorter wavelengths give narrower beams, so the same dishes carry far more: Ka band beats X band, and a laser
// (photon counting, about 2 photons per bit) beats both. Rates fall as 1/distance². Ground station: a 34 m dish for
// radio, a 5 m telescope for the laser. Each link also has a hardware ceiling (100 Mbit/s, 1 Gbit/s, 10 Gbit/s). Speeds of the ship relative to Earth do not change these numbers much.
const CMS=[{n:'X-band radio (3 m dish, 100 W)',lam:.0356,D:3,Pt:100,Dr:34,T:25,max:1e8},{n:'Ka-band radio (3 m dish, 100 W)',lam:.0094,D:3,Pt:100,Dr:34,T:40,loss:.5,max:1e9},
 {n:'Laser (22 cm telescope, 4 W)',lam:1.55e-6,D:.22,Pt:4,Dr:5,opt:true,loss:.2,max:1e10}];
function cmRate(c,d){const G=D=>.55*(Math.PI*D/c.lam)**2,Pr=c.Pt*G(c.D)*G(c.Dr)*(c.lam/(4*Math.PI*d))**2*(c.loss||1);
 return Math.min(c.max,c.opt?Pr/(6.626e-34*C/c.lam*2):Pr/(1.380649e-23*c.T*2))}
const cmBps=r=>r>=1e9?f1(r/1e9,1)+' Gbit/s':r>=1e6?f1(r/1e6,1)+' Mbit/s':r>=1e3?f1(r/1e3,1)+' kbit/s':f1(r,r<10?2:0)+' bit/s';
// solar conjunction: when the Sun comes within ~2° of the line between ship and Earth, its radio noise drowns the link
// (Mars missions lose contact for about two weeks every 26 months)
function cmConj(){const E=B.find(b=>b.n==='Earth'),S=B[0];if(!E||s.dom===E)return -1;const ax=E.x-s.x,ay=E.y-s.y,az=E.z-s.z,bx=S.x-s.x,by=S.y-s.y,bz=S.z-s.z,da=Math.hypot(ax,ay,az),db=Math.hypot(bx,by,bz);
 if(db>da)return -1;return Math.acos(Math.max(-1,Math.min(1,(ax*bx+ay*by+az*bz)/(da*db))))*180/Math.PI}
function cmHtml(){const E=B.find(b=>b.n==='Earth');if(!E)return'';const d=Math.max(1e3,Math.hypot(s.x-E.x,s.y-E.y,s.z-E.z)),lt=d/C,cj=cmConj(),black=cj>=0&&cj<2;
 return `<p><span>${tr('Distance to Earth')}</span> <b>${fmtD(d)}</b> · <span>${tr('light time one way')}</span> <b>${lt<1?f1(lt*1e3,1)+' ms':dur(lt)}</b> · <span>${tr('a question and its answer')}</span> <b>${lt<.5?f1(lt*2e3,1)+' ms':dur(2*lt)}</b></p>
 ${black?`<p class="crwarn">☀ <span>${tr('Solar conjunction: the Sun is only')}</span> ${f1(cj,2)}° <span>${tr('from Earth as seen from here. Its radio noise drowns every link until the angle opens past 2°.')}</span></p>`:cj>=0&&cj<10?`<p class="opsn">☀ <span>${tr('The Sun is')}</span> ${f1(cj,1)}° <span>${tr('from Earth in your sky: below 2° the link is lost (solar conjunction).')}</span></p>`:''}<table class="bldt"><tr><th>${tr('Link')}</th><th>${tr('Data rate here')}</th><th>${tr('A 5 MB photo takes')}</th></tr>${CMS.map(c=>{const r=black?0:cmRate(c,d);return `<tr><td>${tr(c.n)}</td><td><b>${r?cmBps(r):tr('blackout')}</b></td><td>${!r?'—':4e7/r+lt<1?f1((4e7/r+lt)*1e3,0)+' ms':dur(4e7/r+lt)}</td></tr>`}).join('')}</table>
 <p class="opsn">${tr('Received power falls as 1/distance², so twice as far means a quarter of the data rate. Shorter wavelengths make tighter beams: Ka band carries more than X band through the same dishes, and a laser keeps up with a 3 m dish using a 22 cm telescope and 4 W, but must be pointed far more precisely. Close to Earth the radios hit their hardware limit.')}</p>`}
{const nb=$('navbody');if(nb){const g=grp(nb,'COMMS (light-speed delay and data rate to Earth)');dyn(g,()=>$('nav').classList.contains('h')?'':cmHtml())}}
