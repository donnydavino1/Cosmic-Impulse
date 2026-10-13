// ===== ORBIT SHADOW (client): 🛠 → 🔧 Ship → ORBIT SHADOW =====
// In a low orbit you pass through the planet's shadow every orbit, and solar panels give nothing there. For a circular
// orbit of radius r around a body of radius R, with the Sun in the orbit's plane, the shadow covers an angle 2·asin(R/r):
// a fraction asin(R/r)/π of each orbit (39 % at 400 km above Earth: 36 minutes of every 92). Batteries must carry the ship
// through it: energy = systems power × shadow time.
function ecHtml(){const d=s.dom;if(!d||d===B[0]||d.star)return tr('Orbiting the Sun: no planet shadow.');const el=elements();if(!(el.eps<0))return tr('Not in orbit.');
 const r=el.a,R=d.R;if(r<=R)return tr('Not in orbit.');const fr=Math.asin(Math.min(1,R/r))/Math.PI,per=2*Math.PI*Math.sqrt(r**3/d.GM),sh=fr*per,need=(s.loadNow||SH.load)*sh,cap=SH.cap||1;
 return `<span>${tr('Shadow')}</span> <b>${f1(fr*100,1)} %</b> <span>${tr('of each orbit')}</span> (${dur(sh)} / ${dur(per)}) · <span>${tr('battery needed to cross it')}</span> <b>${sci(need)} J</b> (${f1(need/cap*100,1)} % <span>${tr('of your battery')}</span>)${need>cap?' · ⚠ '+tr('more than your battery holds'):''}<br><small>${tr('For a circular orbit with the Sun in its plane the shadow covers asin(R/r)/π of every orbit.')}</small>`}
{const g=grp(tS,'ORBIT SHADOW (night on every orbit)');dyn(g,()=>ecHtml())}
