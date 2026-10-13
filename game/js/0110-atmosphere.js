// ===== ATMOSPHERES (RULES): drag and entry heating =====
// Inside an atmosphere the air pushes back: drag a = ½ ρ v² · Cd · A / m (Cd 2.2, the ship's frontal area ~10 m² scaled
// with its length), with density falling exponentially with height, ρ = ρ0 · e^(−h/H). Dipping your lowest point into
// the air on each pass slows you for free (aerobraking), or captures you in one pass (aerocapture), but the air heats
// the hull: q ≈ 1.74×10⁻⁴ · √(ρ / r_nose) · v³ W/m² (Sutton–Graves). Without a heat shield the hull starts to burn above
// 40 kW/m²; a carbon-carbon heat shield takes 10 MW/m² (Apollo came home at ~5 MW/m²).
// Each atmosphere ends at a 'top' height above which it is ignored (the usual low orbits stay
// clear of it, except at Titan, whose thick haze reaches over 1,000 km). The scale heights H are fitted to the upper
// atmosphere, where aerobraking happens (Earth ~6.9 km, Mars ~8.2 km, Venus ~5.9 km). Speeds are relative to the planet's centre (the atmosphere's own rotation is ignored).
const ATM={Earth:{r:1.225,H:6900,top:1.8e5},Venus:{r:65,H:5900,top:2.5e5},Mars:{r:.02,H:8200,top:1.5e5},Titan:{r:5.3,H:45000,top:1.3e6},
 Jupiter:{r:.16,H:27000,top:1e6},Saturn:{r:.19,H:59500,top:1.5e6},Uranus:{r:.42,H:27700,top:1e6},Neptune:{r:.45,H:19700,top:1e6}};
const AERO={cd:2.2,qlim:4e4,qhs:1e7};
const aeroA=()=>10*(SH&&SH.lay?Math.max(.5,Math.min(6,SH.lay.L*4.4/40)):1);
function aeroRho(b,h){const A=ATM[b.n];return A&&h>=0&&h<A.top?A.r*Math.exp(-h/A.H):0}
// called inside step() after thrust: adds drag to the ship's acceleration, records heating, burns an unshielded hull
function aeroStep(dt,g){s.aeroQ=0;s.aeroA=0;const d=s.dom;if(!d||!ATM[d.n])return;const rx=s.x-d.x,ry=s.y-d.y,rz=s.z-d.z,h=Math.hypot(rx,ry,rz)-d.R,rho=aeroRho(d,h);if(!(rho>0))return;
 const vx=s.vx/g-d.vx,vy=s.vy/g-d.vy,vz=s.vz/g-d.vz,v=Math.hypot(vx,vy,vz);if(v<1)return;
 const a=Math.min(.5*rho*v*v*AERO.cd*aeroA()/mass(),.5*v/Math.max(dt,1e-6));s.ax-=a*vx/v;s.ay-=a*vy/v;s.az-=a*vz/v;
 const q=1.74e-4*Math.sqrt(rho)*v*v*v;s.aeroQ=q;s.aeroA=a;if(PREDICTING)return;
 const lim=SH&&SH.hs?AERO.qhs:AERO.qlim;if(q>lim){s.hull=Math.max(0,s.hull-hullMax()*Math.min(.5,.1*(q/lim-1))*dt/60);if(s.hull<=0&&s.crew.alive){s.crew.alive=false;if(typeof gameOver==='function')gameOver('burning up in the atmosphere of '+d.n)}}
 if(T-(s.aeroTold||-1e9)>3600){s.aeroTold=T;notify('🌫 '+tr(d.n)+' · '+tr('in the atmosphere')+': '+tr('drag')+' '+f1(a,2)+' m/s² · '+tr('heating')+' '+(q>=1e6?f1(q/1e6,1)+' MW':f1(q/1e3,1)+' kW')+'/m²'+(q>lim?' · 🔥 '+tr('the hull is burning: climb, or fit a heat shield'):''))}}
B.forEach(b=>{if(ATM[b.n])b.atm=ATM[b.n].top});
