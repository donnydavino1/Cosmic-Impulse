// ===== LASER OPTICS (RULES): wavelength and mirror size of the pulse laser =====
// A laser beam spreads by diffraction: its spot grows as 1.22 × wavelength × distance ÷ mirror diameter. Shorter
// wavelengths and bigger mirrors keep the spot small for longer, so the pulse still delivers its energy far away; but
// making green or ultraviolet light from an infrared laser (frequency doubling, tripling) wastes much of the power.
//   delivered energy per pulse = 5 MJ × conversion efficiency × fall(distance, reach); reach ∝ mirror ÷ wavelength
//   the mirror (beryllium, gold-coated) weighs 120 kg per m² beyond the stock 0.5 m one
// Chosen in 🛠 → 🔫 Weapons → PULSE LASER OPTICS. Read by 1700-world.js (firing, range text) and 0500 (mass).
const OPTICS={ir:{n:'Infrared 1,064 nm',lam:1.064e-6,eff:1,col:0xff3344,txt:'The laser’s own light: full power, but the beam spreads fastest. Invisible to the eye (shown faint red).'},
 green:{n:'Green 532 nm',lam:.532e-6,eff:.6,col:0x4dff6a,txt:'Frequency-doubled: twice the reach of infrared for the same mirror, 60 % of the energy. A visible green beam.'},
 uv:{n:'Ultraviolet 355 nm',lam:.355e-6,eff:.35,col:0xb98cff,txt:'Frequency-tripled: three times the reach of infrared, 35 % of the energy. Invisible (shown violet).'}};
if(!s.optics)s.optics={lam:'ir',D:.5};
const optCfg=()=>{const o=s.optics||{};return{lam:OPTICS[o.lam]?o.lam:'ir',D:Math.max(.1,Math.min(10,+o.D||.5))}};
const optEff=()=>OPTICS[optCfg().lam].eff,optReach=()=>{const c=optCfg();return 5e4*(c.D/.5)*(1.064e-6/OPTICS[c.lam].lam)},optMass=()=>{const c=optCfg();return 120*Math.PI/4*(c.D*c.D-.25)};
function optSetLam(k){if(!OPTICS[k])return false;s.optics=Object.assign(optCfg(),{lam:k});recalc();return true}
// a bigger mirror is cast and polished: silicates (glass backing) and a little platinum for the coating
function optMirrorJob(D){D=Math.max(.1,Math.min(10,D));const c=optCfg(),da=Math.PI/4*(D*D-c.D*c.D);if(da<=0){s.optics=Object.assign(c,{D});recalc();return true}
 return queueJob({type:'optics',D,mat:{silicates:Math.ceil(80*da),iron:Math.ceil(40*da),platinum:+(.02*da).toFixed(2)},name:'Mirror for the pulse laser: '+D.toFixed(2)+' m',J:5e8*da+1e7,minT:1800})}
