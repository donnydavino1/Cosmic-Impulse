// ===== GRAVITY ASSISTS (client): 🧭 NAVIGATE → GRAVITY ASSISTS =====
// Flying past a planet bends your path around it. In the planet's frame you leave as fast as you arrived (v∞), only
// turned by an angle δ; in the Sun's frame that turn is a free speed change of up to 2·v∞·sin(δ/2).
// The turn is largest for a close, slow pass: sin(δ/2) = 1 / (1 + rp·v∞² / GM), with rp the closest approach (here the
// planet's radius plus 10 %, or the top of its atmosphere). Shown for two arrival speeds: the one you would have
// now (your speed relative to the planet) and the one at the end of a Hohmann transfer from where you are.
function gaOne(b,vinf){const rp=b.R*1.1,e=1+rp*vinf*vinf/b.GM,d=2*Math.asin(1/e);return{d,dv:2*vinf*Math.sin(d/2),rp}}
function gaHtml(){const g=gam(s),tw=typeof twRows==='function'?twRows():[],rows=[];
 B.forEach((b,i)=>{if(!i||b.p!==0||b.star||!(b.GM>0)||!(b.R>0))return;const vr=Math.hypot(s.vx/g-b.vx,s.vy/g-b.vy,s.vz/g-b.vz),now=gaOne(b,vr),h=tw.find(q=>q.b===b),hm=h?gaOne(b,h.varr):null;
  const home=s.dom===b||(s.dom&&s.dom.p>0&&B[s.dom.p]===b);
  rows.push(`<tr><td>${tr(b.n)}</td><td>${home?tr('you are orbiting it'):`${f1(vr/1e3,1)} km/s → ${Math.round(now.d*180/Math.PI)}° · <b>${f1(now.dv/1e3,2)} km/s</b>`}</td><td>${hm?f1(h.varr/1e3,2)+' km/s → '+Math.round(hm.d*180/Math.PI)+'° · <b>'+f1(hm.dv/1e3,2)+' km/s</b>':'–'}</td><td>${fmtD(now.rp-b.R)}</td></tr>`)});
 return `<p class="opsn">${tr('A flyby turns your path around a planet: you leave it as fast as you came, but in a new direction, which is a free speed change in the Sun’s frame. Slow, close passes of heavy planets turn you the most.')}</p><table class="bldt"><tr><th>${tr('Planet')}</th><th>${tr('Arriving at your speed now: turn · free speed change')}</th><th>${tr('Arriving on a Hohmann transfer')}</th><th>${tr('Closest pass (altitude)')}</th></tr>${rows.join('')}</table>`}
{const nb=$('navbody');if(nb){const g=grp(nb,'GRAVITY ASSISTS (free speed from a planet flyby)');dyn(g,()=>$('nav').classList.contains('h')?'':gaHtml())}}
