// ===== FLIP-AND-BURN (client): 🧭 NAVIGATE → FLIP-AND-BURN =====
// With a powerful engine you don't wait for transfer windows: accelerate toward the target the whole first half of the
// trip, flip over, and brake the whole second half (a brachistochrone). Straight-line distance d at acceleration a:
// trip time t = 2√(d/a), top speed √(d·a), speed change 2√(d·a). Near light speed the relativistic version is used
// (see below). If the propellant can't pay for the full burn, the plan accelerates to half of what it can give,
// coasts, and brakes. Gravity and the planets' motion are
// ignored, so this is a rough guide for fast ships; slow ships should use transfer windows.
// relativistic flip-and-burn at constant proper acceleration a: half way, d/2 = (c²/a)(cosh φ − 1), so the midpoint
// rapidity is φ = acosh(1 + a·d / 2c²); ship time τ = 2cφ/a, coordinate time t = (2c/a)·sinh φ, top speed c·tanh φ.
// Propellant is checked in rapidity (speeds don't add near c; rapidities do): a full burn needs 2φ, the propellant gives
// (ve/c)·ln(mass ratio). At low speed all this becomes t = 2√(d/a) and Δv = 2√(d·a).
function fbOne(d,a,phH){const c=C,x=a*d/(2*c*c),ph=x<1e-6?Math.sqrt(2*x):Math.acosh(1+x),phN=2*ph,tau=2*c*ph/a,t=x<1e-6?2*Math.sqrt(d/a):2*c/a*Math.sinh(ph),vmax=c*Math.tanh(ph);
 if(phH>=phN)return{t,tau,vmax,phN,mode:'full'};if(!(phH>0))return{phN,mode:'none'};
 const h=phH/2,v=c*Math.tanh(h),tb=c/a*Math.sinh(h),db=c*c/a*(Math.cosh(h)-1),tc=(d-2*db)/v;return{t:2*tb+tc,tau:2*c*h/a+tc/Math.cosh(h),vmax:v,phN,mode:'coast'}}
function fbHtml(){const P=effPush(),a=P.a*(P.f||1),D=DR[di],M=mass(),f=D.f?(s.fuel[D.f]||0):0,phH=D.f?(f>0&&M>f?D.ve/C*Math.log(M/(M-f)):0):Infinity;
 if(!(a>0))return`<p>${tr('No thrust available right now.')}</p>`;
 const mr=ph=>{const e=ph*C/D.ve;return!D.f?'—':e>700?'∞':Math.exp(e)<1e4?'×'+f1(Math.exp(e),Math.exp(e)<10?2:0):'×'+sci(Math.exp(e))};
 const rows=B.filter(b=>b!==B[0]&&b!==s.dom&&(b.p===0||b.star||b.n==='Moon')).map(b=>{const d=Math.hypot(b.x-s.x,b.y-s.y,b.z-s.z),q=fbOne(d,a,phH);
  return `<tr><td>${tr(b.n)}</td><td>${fmtD(d)}</td><td>${q.mode==='none'?'—':dur(q.t)}${q.tau&&q.tau<q.t*.99?` <small>(${tr('ship')} ${dur(q.tau)})</small>`:''}</td><td>${q.vmax?(q.vmax<1e6?f1(q.vmax/1e3,1)+' km/s':(q.vmax/C).toFixed(3)+' c'):'—'}</td><td>${mr(q.phN)}</td><td>${q.mode==='full'?'✓ '+tr('full burn'):q.mode==='coast'?'↔ '+tr('burn, coast, brake'):'✗ '+tr('no propellant')}</td></tr>`}).join('');
 return `<p class="opsn"><span>${tr('Acceleration now')}</span> <b>${f1(a,a<.01?5:3)} m/s²</b> (${f1(a/9.81,a<.01?6:3)} g) · <span>${tr('mass ratio you have')}</span> <b>${D.f?'×'+f1(M/Math.max(1,M-f),2):tr('unlimited')}</b>. ${tr('Straight-line distances now; gravity and the planets’ motion are ignored.')}</p><table class="bldt"><tr><th>${tr('Target')}</th><th>${tr('Distance')}</th><th>${tr('Trip time')}</th><th>${tr('Top speed')}</th><th>${tr('Mass ratio for a full burn')}</th><th>${tr('Plan')}</th></tr>${rows}</table>`}
{const nb=$('navbody');if(nb){const g=grp(nb,'FLIP-AND-BURN (accelerate half way, flip, brake: for powerful engines)');dyn(g,()=>$('nav').classList.contains('h')?'':fbHtml())}}
