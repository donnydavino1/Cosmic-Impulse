// ===== TRANSFER WINDOWS (client): 🧭 NAVIGATE → TRANSFER WINDOWS =====
// When to leave for each planet on the cheapest path, a Hohmann transfer: half an ellipse touching both orbits. You must
// leave when the target is the right angle ahead of you (the phase angle), so it arrives where your ellipse ends.
// For each planet: flight time, the phase angle needed and the one now, days until the next window (windows repeat
// every synodic period), the speed change from your current orbit (Oberth bonus included when you leave from a planet's
// orbit) and the speed you arrive with. Numbers use the real positions of the planets this moment.
function twRows(){const S=B[0],mu=S.GM,home=s.dom&&s.dom!==S&&!s.dom.star?(s.dom.p>0?B[s.dom.p]:s.dom):null,o=home||{x:s.x,y:s.y,z:s.z,vx:s.vx/gam(s),vy:s.vy/gam(s),vz:s.vz/gam(s)};
 const ox=o.x-S.x,oy=o.y-S.y,r1=Math.hypot(ox,oy,o.z-S.z),th1=Math.atan2(oy,ox),n1=Math.sqrt(mu/(r1*r1*r1)),out=[];
 B.forEach((b,i)=>{if(!i||b.p!==0||b.star||b===home)return;const bx=b.x-S.x,by=b.y-S.y,r2=Math.hypot(bx,by,b.z-S.z),n2=Math.sqrt(mu/(r2*r2*r2)),at=(r1+r2)/2,tt=Math.PI*Math.sqrt(at*at*at/mu);
  if(r2>2e3*AU)return;const need=Math.PI-n2*tt,w=n2-n1;let now=Math.atan2(by,bx)-th1;const wrap=a=>{a%=2*Math.PI;return a<0?a+2*Math.PI:a};
  const dphi=wrap(now)-wrap(need);let wait=w===0?Infinity:(w<0?wrap(dphi)/-w:wrap(-dphi)/w);const syn=Math.abs(2*Math.PI/w);if(wait>syn)wait-=syn;
  const v1=Math.sqrt(mu/r1),vinf=Math.abs(v1*(Math.sqrt(2*r2/(r1+r2))-1)),varr=Math.abs(Math.sqrt(mu/r2)*(1-Math.sqrt(2*r1/(r1+r2))));
  let dv=vinf;if(home&&home===s.dom){const el=elements();if(el.eps<0){const rr=el.r,vesc=Math.sqrt(2*s.dom.GM/rr),vc=Math.sqrt(s.dom.GM/rr);dv=Math.sqrt(vinf*vinf+vesc*vesc)-vc}}
  out.push({b,i,tt,need:wrap(need),now:wrap(now),wait,syn,dv,varr})});return out}
const twDeg=a=>Math.round(a*180/Math.PI)+'°';
function twHtml(){const L=twRows(),from=s.dom&&s.dom!==B[0]&&!s.dom.star?tr(s.dom.p>0?B[s.dom.p].n:s.dom.n):tr('your orbit around the Sun');
 return `<p class="opsn">${tr('Leaving from')} <b>${from}</b>. ${tr('Leave when the target is the needed angle ahead of you; windows repeat every synodic period. Speed change is from your orbit now.')}</p><table class="bldt"><tr><th>${tr('Planet')}</th><th>${tr('Flight time')}</th><th>${tr('Speed change')}</th><th>${tr('Arrive at')}</th><th>${tr('Angle now / needed')}</th><th>${tr('Next window')}</th></tr>`+
  L.map(q=>`<tr><td>${tr(q.b.n)}</td><td>${dur(q.tt)}</td><td>${f1(q.dv/1e3,2)} km/s</td><td>${f1(q.varr/1e3,2)} km/s</td><td>${twDeg(q.now)} / ${twDeg(q.need)}</td><td>${q.wait<86400?'<b style="color:#5dff8a">'+tr('open now')+'</b>':tr('in')+' '+dur(q.wait)}<small class="opsn"> · ${tr('every')} ${dur(q.syn)}</small></td></tr>`).join('')+'</table>'}
{const nb=$('navbody');if(nb){const g=grp(nb,'TRANSFER WINDOWS (Hohmann: the cheapest path between two orbits)');dyn(g,()=>$('nav').classList.contains('h')?'':twHtml())}}
