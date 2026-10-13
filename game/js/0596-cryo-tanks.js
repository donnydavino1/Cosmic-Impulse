// ===== CRYOGENIC TANKS (RULES): boil-off of super-cold propellants =====
// Liquid hydrogen is stored at 20 K, liquid deuterium at 23 K, liquid methane at 111 K. Sunlight and the ship's own
// warmth leak through any insulation and boil a little of it away every day; the gas has to be vented. How much
// boils (per day, for pure liquid hydrogen at Earth's distance), and the share of each fuel that is that cold:
//   Multilayer insulation   0.3 %/day  (stock: dozens of foil layers, no power)
//   Sunshield + insulation  0.05 %/day (a deployable shade keeps the tanks in shadow: +250 kg)
//   Cryocoolers             0 %/day    (zero boil-off: refrigerators pump the heat out, 150 W per tonne of liquid
//                                       hydrogen at 1 AU, more nearer the Sun; without power they fall back to 0.3 %)
// Heat leak scales as 0.2 + 0.8·(1 AU / distance)². Hydrolox is ~1/7 hydrogen by mass, methalox and methane boil far
// slower, xenon, krypton, argon, water and ammonia are stored warm and do not boil off.
const CRYO={h2:1,chem:.15,fus:.8,dt:.8,ch4:.25,ml:.08},
 TANKS={mli:{n:'Multilayer insulation',r:.003,kg:0,mat:{},txt:'Dozens of reflective foil layers: no power, no extra mass, but liquid hydrogen still boils at about 0.3 % a day at Earth’s distance.'},
  shade:{n:'Sunshield + insulation',r:.0005,kg:250,mat:{carbon:100,silicates:50},txt:'A deployable shade keeps the tanks in shadow, cutting boil-off six-fold. 250 kg.'},
  zbo:{n:'Cryocoolers (zero boil-off)',r:0,kg:200,w:150,mat:{iron:100,nickel:40,platinum:.5},txt:'Refrigerators pump the leaking heat back out: nothing boils, as long as they have power (150 W per tonne of liquid hydrogen at 1 AU, more near the Sun). 200 kg.'}};
if(!s.tank)s.tank='mli';
const tankT=()=>TANKS[s.tank]||TANKS.mli,tankKg=()=>tankT().kg;
const cryoLeak=()=>{const S=B[0],r=Math.hypot(s.x-S.x,s.y-S.y,s.z-S.z);return Math.min(50,.2+.8*(AU/Math.max(r,1e9))**2)};
// liquid-hydrogen-equivalent tonnes aboard, cryocooler power, and boil-off in kg per day for each fuel
const cryoT=()=>{let t=0;for(const k in CRYO)t+=(s.fuel[k]||0)*CRYO[k];return t/1e3};
const cryoW=()=>tankT().w?tankT().w*cryoT()*cryoLeak():0;
function cryoRates(){const T0=tankT(),r=(T0.w&&!(s.en>0))?TANKS.mli.r:T0.r,L=cryoLeak(),o={};for(const k in CRYO)if((s.fuel[k]||0)>0)o[k]=s.fuel[k]*r*CRYO[k]*L;return o}
function cryoTick(h){if(!(h>0)||(typeof SBX==='function'&&SBX()))return;const R=cryoRates();for(const k in R)s.fuel[k]=Math.max(0,s.fuel[k]*Math.exp(-R[k]/Math.max(1e-9,s.fuel[k])*h/24))}
function tankJob(k){const t=TANKS[k];if(!t||k===s.tank)return null;return queueJob({type:'tank',k,mat:{...t.mat},name:'Refit the propellant tanks: '+t.n.toLowerCase(),J:3e8,minT:3600*6})}
// storage densities (kg/m³) for the tank-volume readout: liquid hydrogen is so light that its tanks are huge
const FDENS={h2:71,chem:360,fus:162,dt:190,he3:59,ch4:423,ml:830,nh3:682,wat:1000,xe:1600,kr:1200,ar:1100,li:534,pb:2340,am:71};
const fuelVol=()=>{let v=0;const o={};for(const k in s.fuel){const m=s.fuel[k]||0;if(m>0&&FDENS[k]){o[k]=m/FDENS[k];v+=o[k]}}return{v,o}};
