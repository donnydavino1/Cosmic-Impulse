// ===== LAGRANGE POINTS (client): 🧭 NAVIGATE → LAGRANGE POINTS =====
// Around any pair of bodies (a big primary and a smaller one orbiting it) there are five points where a small object can
// keep pace with the smaller body: L1 and L2 sit either side of it at about the Hill radius r = a·(m / 3M)^⅓, L3 on the
// far side of the primary, and L4 and L5 60° ahead of and behind it on its orbit. L1–L3 are unstable (a craft there
// needs small station-keeping burns); L4 and L5 are stable when M/m > 25, which is why Jupiter's are full of Trojan
// asteroids. Shown: where each point is and how far it is from you now.
const LGP=[[0,3,'Solar observatories watch the Sun from L1; space telescopes keep the Sun and Earth behind them at L2.'],[3,4,'Earth–Moon L2, beyond the far side, is where relay satellites for the far side of the Moon sit.'],[0,5,''],[0,6,'Jupiter’s L4 and L5 hold thousands of Trojan asteroids.'],[0,7,''],[7,20,'']];
function lgPts(P,b){const dx=b.x-P.x,dy=b.y-P.y,dz=b.z-P.z,a=Math.hypot(dx,dy,dz),ux=dx/a,uy=dy/a,uz=dz/a,rH=a*Math.cbrt(b.m/(3*P.m)),rot=th=>[P.x+dx*Math.cos(th)-dy*Math.sin(th),P.y+dx*Math.sin(th)+dy*Math.cos(th),P.z+dz];
 return{rH,a,stab:P.m/b.m>24.96,L:{L1:[b.x-ux*rH,b.y-uy*rH,b.z-uz*rH],L2:[b.x+ux*rH,b.y+uy*rH,b.z+uz*rH],L3:[P.x-dx,P.y-dy,P.z-dz],L4:rot(Math.PI/3),L5:rot(-Math.PI/3)}}}
function lgHtml(){return LGP.map(([pi,bi,note])=>{const P=B[pi],b=B[bi];if(!P||!b)return'';const q=lgPts(P,b),d=p=>fmtD(Math.hypot(p[0]-s.x,p[1]-s.y,p[2]-s.z));
 return `<p><b>${tr(P.n)} – ${tr(b.n)}</b> · L1/L2 ${fmtD(q.rH)} ${tr('from')} ${tr(b.n)} · L4/L5 ${q.stab?tr('stable'):tr('unstable')}${note?` · <small>${tr(note)}</small>`:''}<br><small>${tr('distance from you')}: ${Object.keys(q.L).map(k=>`${k} ${d(q.L[k])}`).join(' · ')}</small></p>`}).join('')}
{const nb=$('navbody');if(nb){const g=grp(nb,'LAGRANGE POINTS (where a craft can keep pace with a planet or moon)');dyn(g,()=>$('nav').classList.contains('h')?'':lgHtml())}}
