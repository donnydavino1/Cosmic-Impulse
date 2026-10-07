// ===== PUBLIC API & LEDGER: the stable surface other code, mods and future servers read =====
// window.ORB.api — see docs/PROTOCOL.md. Everything here is read-only views of game state in SI units.
// The ledger reports conserved quantities: mass by element, energy by store, momentum, and both clocks.
// Element splits of compounds and recipes are explicit below, so they can be checked and argued with.
const COMPO={ // mass fraction of each element in each inventory item / fuel
 iron:{Fe:1},nickel:{Ni:1},carbon:{C:1},platinum:{Pt:1},oxygen:{O:1},
 water:{H:.1119,O:.8881},silicates:{Si:.4674,O:.5326},                      // H2O, SiO2
 food:{C:.444,H:.062,O:.494},                                               // dried food ≈ (C6H10O5)n
 spares:{Fe:.7,Ni:.1,C:.2},
 chem:{H:.1429,O:.8571},                                                    // LH2/LOX burned at oxidiser:fuel 6:1
 xe:{Xe:1},h2:{H:1},fus:{H:.4,He:.6},                                       // deuterium + helium-3, 1:1 by atoms
 am:{'anti-H':1}};
const ESPEC={chem:1.34e7,h2:1.42e8,fus:3.5e14,am:1.8e17};                    // J/kg released if used (antimatter: m and its matter partner)
function addEl(acc,comp,m){if(!comp||!(m>0))return;for(const e in comp)acc[e]=(acc[e]||0)+comp[e]*m}
function ledger(){const el={},g=gam(s),m=mass(),c2=C*C;
 for(const k in s.res)addEl(el,COMPO[k],s.res[k]);
 for(const k in s.fuel)addEl(el,COMPO[k],s.fuel[k]);
 for(const q of s.parts){const d=PARTS[q.id];if(!d)continue;const rm=Object.values(d.mat||{}).reduce((a,b)=>a+b,0)||1;for(const k in d.mat||{})addEl(el,COMPO[k],d.m*d.mat[k]/rm)}
 const known=Object.values(el).reduce((a,b)=>a+b,0);if(m>known)el.structure=(el.structure||0)+(m-known);   // hull, engines, panels: not yet itemised by element
 const fuelE=Object.fromEntries(Object.keys(s.fuel).map(k=>[k,(s.fuel[k]||0)*(ESPEC[k]||0)]));
 const v=[s.vx/g,s.vy/g,s.vz/g],vv=Math.hypot(...v);
 return{v:'ORB-LEDGER/1',t:T,tau:s.tau,mass:m,elements:el,
  energy:{battery:s.en,fuel:fuelE,kinetic:(g-1)*m*c2,hullAbsorb:s.hull,unit:'J'},
  momentum:v.map(x=>g*m*x),gamma:g,speed:vv,frame:'Sun-centred, ecliptic J2000-like axes, SI units',
  derived:{hull:s.hull/hullMax(),missiles:s.ammo.missile,railSlugs:Math.floor((s.res.iron||0)/2),crewHealth:s.crew.hp,
   note:'Derived quantities are functions of the conserved ones: a missile is 50 kg (25 kg structure + 25 kg chem fuel), a rail slug is 2 kg of Fe, hull is absorbable energy in J.'}}}
function shipState(){const g=gam(s),o=elements();return{v:'ORB-STATE/1',t:T,tau:s.tau,name:CUST.name,pos:[s.x,s.y,s.z],vel:[s.vx/g,s.vy/g,s.vz/g],
 dominant:o.d.n,altitude:o.r-o.d.R,engine:{id:DR[di].id,power:PW,burn:s.burn},hull:s.hull,hullMax:hullMax(),sensor:SENSOR_TIERS[sensorTier()].n,
 rules:RULES,code:typeof ORB_FP!=='undefined'?ORB_FP:'?'}}
ORB.api={version:'ORB-API/1',
 state:shipState,ledger,contacts:()=>tlmContacts(),sensor:()=>({tier:sensorTier(),...SENSOR_TIERS[sensorTier()]}),
 on:(ev,fn)=>ORB.on(ev,fn),
 radar:{register:radarReg,list:()=>Object.keys(RADARS),use:n=>{if(RADARS[n]){RADAR_DESIGN=n;try{localStorage.setItem('orbital-radar',n)}catch(e){}}}},
 style:{get:()=>JSON.parse(JSON.stringify(CUST)),set:o=>styleApply(o)}};
ORB.radar=ORB.api.radar;
