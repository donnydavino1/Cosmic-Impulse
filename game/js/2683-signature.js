// ===== HEAT SIGNATURE (client): 🛠 → 🔧 Ship → HEAT SIGNATURE =====
// "There is no stealth in space": everything your ship uses ends up radiated as infrared, against a sky at 3 K. A sensor
// sees you once your flux at its distance, P / (4π r²), beats its noise floor, so the detection range is r = √(P / 4πF).
// Noise floors used: a 1 m infrared telescope ~10⁻¹⁵ W/m², a large space telescope ~10⁻¹⁸ W/m². A burning engine's
// exhaust carries its waste power away as light and heat too (shown separately, much brighter).
function sigHtml(){const lo=(s.hLo||0),hi=(s.hHi||0),P=Math.max(1,lo+hi),eng=s.burn>0?PW*s.burn:0,R=(p,F)=>Math.sqrt(p/(4*Math.PI*F)),fd=r=>fmtD(r);
 return `<span>${tr('Heat radiated now')}</span> <b>${sci(P)} W</b> (${tr('crew loop')} ${sci(lo)} W${hi?` · ${tr('high loop')} ${sci(hi)} W`:''}) · <span>${tr('a 1 m infrared telescope sees you from')}</span> <b>${fd(R(P,1e-15))}</b> · <span>${tr('a large space telescope from')}</span> <b>${fd(R(P,1e-18))}</b>${eng?`<br>🔥 <span>${tr('Engine burning')}</span>: ${sci(eng)} W · <span>${tr('seen from')}</span> <b>${fd(R(eng,1e-15))}</b>`:''}<br><small>${tr('There is no stealth in space: every watt you use is radiated as infrared against a 3 K sky.')}</small>`}
{const g=grp(tS,'HEAT SIGNATURE (how far away you can be seen)');dyn(g,()=>sigHtml())}
