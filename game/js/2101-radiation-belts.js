// ===== RADIATION BELTS (RULES): particles trapped in planetary magnetic fields =====
// Magnetic fields trap protons and electrons in belts around a planet. Dose rates (Sv/day behind no shielding):
//   Earth (Van Allen) inner belt: protons, peak 0.1 Sv/day at 1.6 Earth radii (from the centre), none below 1.15 radii
//         (the atmosphere sweeps it clean: low orbit, like the ISS, is under it); hard protons, cut by shielding as
//         e^(−ad/15 g/cm²)
//         outer belt: electrons, peak 0.3 Sv/day at 4.5 radii; easily stopped, e^(−ad/1.5)
//         Crossing both on the way out (as Apollo did) costs a few to ~20 mSv; lingering in them does not.
//   Jupiter: by far the strongest: ~36 Sv/day at Io's orbit (5.9 Jupiter radii), falling as e^(−0.54 per radius) outward
//         (Europa ~5 Sv/day, Ganymede ~0.3, Callisto under 0.001); very energetic electrons whose X-rays get through
//         shielding: e^(−ad/20). A crew parked at Io dies in hours; Callisto is the safe base.
//   Saturn: weak (its rings soak the particles up): peak 0.01 Sv/day at 4 radii.
// ad is the ship's shielding in g/cm² (armour, water wall, storm shelter, as for cosmic rays).
const BELTS=[{b:3,parts:[{pk:.1,c:1.6,w:.35,min:1.15,att:15},{pk:.3,c:4.5,w:1.3,min:1.15,att:1.5}]},{b:6,jup:true},{b:7,parts:[{pk:.01,c:4,w:1.5,min:1.5,att:5}]}];
function beltRate(ad,x,y,z){x=x==null?s.x:x;y=y==null?s.y:y;z=z==null?s.z:z;let tot=0;
 for(const E of BELTS){const P=B[E.b];if(!P)continue;const L=Math.hypot(x-P.x,y-P.y,z-P.z)/P.R;
  if(E.jup){if(L<1.5||L>60)continue;const pk=36*(L<5.9?Math.min(1,(L-1.5)/2):Math.exp(-.54*(L-5.9)));tot+=pk*Math.exp(-ad/20);continue}
  for(const q of E.parts){if(L<q.min||L>q.c+4*q.w)continue;tot+=q.pk*Math.exp(-(((L-q.c)/q.w)**2))*Math.exp(-ad/q.att)}}
 return tot/86400}
// ===== SOLAR CYCLE =====
// The Sun's activity rises and falls over about 11 years. Near solar maximum, proton storms come about 4× as often as at
// minimum and are stronger; but the Sun's stronger magnetic field also pushes galactic cosmic rays away, so their dose is
// lowest at maximum (about −25 %) and highest at minimum (+25 %). The game starts a little past maximum.
const SOLC={P:11*3.15576e7,ph:.08};
const solAct=t=>{t=t==null?T:t;return .5+.5*Math.cos(2*Math.PI*(t/SOLC.P+SOLC.ph))};
const solFlareK=()=>1.6-1.2*solAct(),solPeakK=()=>.6+.8*solAct(),solGcrK=()=>1.25-.5*solAct();
function solNext(){const a=solAct(),ph=((T/SOLC.P+SOLC.ph)%1+1)%1,rising=ph>.5;const yrs=(rising?1-ph:.5-ph)*11;return{a,rising,yrs}}
// ===== SINGLE-EVENT UPSETS =====
// A fast particle passing through a memory chip can flip a bit. In a radiation belt or a solar storm, an ordinary flight
// computer may crash and reboot: the autopilot drops out. The chance grows with the dose rate (about one upset per
// 200 mSv/h·h); a radiation-hardened computer (special chips, error-correcting memory, triple voting) shrugs them off.
function seuTick(h){if(!(h>0)||s.radhard)return;const R=typeof doseNow==='function'?doseNow():null;if(!R)return;const mSvh=(R.spe+R.belt)*3600e3;if(mSvh<1)return;
 if(Math.random()<h*mSvh/200){const hadAP=typeof AP!=='undefined'&&AP;if(hadAP)AP=null;if(!hadAP&&T-(s.seuT||-1e9)<21600)return;s.seuT=T;notify('⚡ '+tr('A particle flipped a bit in the flight computer: it rebooted.')+(hadAP?' '+tr('The autopilot is off.'):'')+' '+tr('A radiation-hardened computer prevents this.'))}}
function radhardJob(){if(s.radhard)return null;return queueJob({type:'radhard',mat:{silicates:30,platinum:.2},name:'Install a radiation-hardened flight computer',J:5e8,minT:3600*6})}
