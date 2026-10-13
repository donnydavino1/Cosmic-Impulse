// ===== FUEL CELLS (RULES): electricity and drinking water from rocket fuel =====
// Hydrogen–oxygen fuel cells (as on Apollo and the Space Shuttle) combine the two halves of hydrolox rocket fuel into
// electricity and pure water, with no combustion. Each kWh takes about 0.36 kg of propellant and gives back about
// 0.32 kg of water. When switched on they supply 5 kW (more with more stacks), useful in shadow, far from the Sun, or
// with a failed reactor. They make heat too (~60 % efficient: the rest goes into the crew loop).
const FCELL={kw:5,kgkwh:.36,wat:.32,eta:.6};
if(!s.fcN)s.fcN=0;   // number of 5 kW stacks switched on (0 = off)
const fcW=()=>s.fcN>0&&(s.fuel.chem||0)>0?s.fcN*FCELL.kw*1e3:0;
function fcTick(h){const w=fcW();if(!w||!(h>0))return;const kwh=w/1e3*h,f=Math.min(s.fuel.chem,kwh*FCELL.kgkwh);s.fuel.chem-=f;s.res.water+=f/FCELL.kgkwh*FCELL.wat;if(s.fuel.chem<=0){s.fcN=0;notify('⚡ '+tr('Fuel cells shut down: no rocket fuel left.'))}}
