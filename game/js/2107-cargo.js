// ===== CARGO (RULES): every loose item on board, and jettisoning any amount of it =====
// Loose cargo is what the ship carries rather than what it is built from: propellants, mined materials, supplies, kits
// and missiles. jettison() pushes an amount out of the airlock. Momentum is conserved: what you drop keeps your exact
// velocity and drifts along your orbit, so dropping changes your mass (and so your acceleration and Δv), never your
// path. Built-in parts are not cargo: remove those in 🧱 Builder (half their materials are recovered).
// Used by the 📦 Cargo window (2677-cargo-ui.js).
const CARGO={missileKg:50};
// one row per item: kind (fuel/res/ammo), key, amount in its own unit (kg, kits or missiles), kg per unit
function cargoItems(){const out=[];
 for(const f in s.fuel)out.push({kind:'fuel',key:f,unit:'kg',n:s.fuel[f]||0,per:1});
 for(const k in s.res){const kit=k==='spares'||k==='patch';out.push({kind:'res',key:k,unit:kit?'kits':'kg',n:s.res[k]||0,per:kit?kitKg(k):1})}
 out.push({kind:'ammo',key:'missile',unit:'missiles',n:s.ammo.missile||0,per:CARGO.missileKg});
 for(const r of out)r.kg=r.n*r.per;return out}
// drop n units (kg, kits or missiles) of one item; returns how much actually went out
function jettison(kind,key,n){n=+n;if(!(n>0)||!isFinite(n))return 0;let have=0;
 if(kind==='fuel')have=s.fuel[key]||0;else if(kind==='res')have=s.res[key]||0;else if(kind==='ammo'&&key==='missile')have=s.ammo.missile||0;else return 0;
 if(kind==='ammo'||key==='spares'||key==='patch')n=Math.floor(n+1e-9);const d=Math.min(have,n);if(!(d>0))return 0;
 if(kind==='fuel')s.fuel[key]=Math.max(0,have-d);else if(kind==='res')s.res[key]=Math.max(0,have-d);else s.ammo.missile=Math.max(0,have-d);
 recalc();return d}
