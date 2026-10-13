// ===== ENGINE DESIGN (RULES): what each engine burns or fuses, how it is tuned, and how big it is =====
// Every engine can be redesigned in the 🔧 Engine workshop (2671-engine-workshop.js). A design has:
//   opt     the reaction (fusion drives: D–D, D–T, D–³He, p–¹¹B) or the propellant (electric, plasma, thermal and
//           chemical engines). It sets the exhaust speed, efficiency, waste heat, neutron radiation, fuel and plasma colour.
//   tune    −1…+1: trade exhaust speed against thrust at the same power (grid voltage for ion engines, magnetic-nozzle
//           ratio for plasma and fusion drives, chamber temperature for thermal rockets: hotter wears it faster).
//   D, L    core diameter and length in metres. Power = power density × core volume; structure mass grows with the
//           core's surface area; the reaction or propellant sets the power density and the kg per watt.
//   shield  kg of neutron shadow shield between a fusion core and the crew (each 1.5 t cuts the dose ~2.7×).
// The physics, fair-play hash and fuel rules all read DR (ve, k, hf, pw, base, al, f) after engRecalc().
const ENGFAM={chem:'chem',ion:'grid',hall:'grid',vas:'plasma',mpd:'plasma',arc:'plasma',ntr:'thermal',gcnr:'thermal',solth:'thermal',fus:'fusion',dfd:'fusion',icf:'fusion'};
// default core dimensions (m) for the stock engines; the stock power is reached at these sizes
const ENGDIM={chem:[1.5,3],ion:[.4,.3],hall:[.5,.2],vas:[1,4],mpd:[.5,1],arc:[.3,.5],ntr:[1.6,6],gcnr:[4,12],solth:[2,4],fus:[4,20],dfd:[1.5,8],icf:[6,12]};
// options per family. ve, k, hf, al, pd are multipliers on the stock engine; dose is neutron dose per watt (relative);
// col is the true colour of the glowing exhaust (emission lines of the ions in it)
const ENGOPT={
 fusion:{label:'Fusion reaction',def:'dd',o:{
  dd:{n:'D–D',fuel:'fus',ve:1,k:1,hf:1,al:1,pd:1,dose:1,col:'#ff5fae',mev:3.65,neut:35,ign:'medium',
   txt:'Deuterium with deuterium. Fuel from ordinary water. Half the reactions make tritium + proton, half helium-3 + a neutron: about a third of the energy leaves as neutrons. Glows hydrogen pink (Balmer lines).'},
  dt:{n:'D–T',fuel:'dt',ve:.85,k:1,hf:1.9,al:.5,pd:4,dose:6,col:'#ff7a9c',mev:17.6,neut:80,ign:'easiest',
   txt:'Deuterium with tritium: the easiest reaction to ignite, so the core can be small and light. But 80 % of the energy is a 14 MeV neutron: it heats the structure and irradiates the crew. Tritium is bred from lithium.'},
  dhe3:{n:'D–³He',fuel:'he3',ve:1.6,k:1,hf:.45,al:1.6,pd:.5,dose:.12,col:'#ffc98a',mev:18.3,neut:5,ign:'hard',
   txt:'Deuterium with helium-3: almost all the energy comes out as charged particles a magnetic nozzle can steer: fast exhaust, little heat, few neutrons. Helium-3 is rare: mined from the Moon’s soil, only from Earth.'},
  pb11:{n:'p–¹¹B',fuel:'pb',ve:.95,k:1,hf:.7,al:2.6,pd:.25,dose:.01,col:'#ffd6ea',mev:8.7,neut:.1,ign:'hardest',
   txt:'Proton with boron-11: three helium nuclei and almost no neutrons, the cleanest reaction. It needs a far hotter plasma that loses energy as X-rays, so the core is big and heavy. Boron and hydrogen from Earth.'}}},
 grid:{label:'Propellant',def:'xe',o:{
  xe:{n:'Xenon',fuel:'xe',ve:1,k:1,hf:1,col:'#6fa8ff',txt:'Heavy (131 u) and easy to ionise: the most thrust per watt. Glows blue. Rare and only from Earth’s air.'},
  kr:{n:'Krypton',fuel:'kr',ve:1.25,k:.9,hf:1.1,col:'#cfc6ff',txt:'Lighter (84 u): 25 % faster exhaust at the same voltage, a little less efficient. Ten times cheaper than xenon. Glows pale violet-white.'},
  ar:{n:'Argon',fuel:'ar',ve:1.81,k:.75,hf:1.25,col:'#c27dff',txt:'Much lighter (40 u): 80 % faster exhaust but harder to ionise, so less thrust and more heat. Cheap and plentiful in Earth’s air. Glows violet.'}}},
 plasma:{label:'Propellant',def:'h2',o:{
  h2:{n:'Hydrogen',fuel:'h2',ve:1,k:1,hf:1,col:'#ff5fae',txt:'The lightest propellant: the fastest exhaust. Made from water. Hydrogen plasma glows pink-magenta.'},
  ar:{n:'Argon',fuel:'ar',ve:.45,k:1.1,hf:.9,col:'#c27dff',txt:'Forty times heavier atoms: slower exhaust but more thrust per watt. From Earth. Glows violet.'},
  li:{n:'Lithium',fuel:'li',ve:.6,k:1.15,hf:.8,col:'#ff3b4a',txt:'Real MPD thrusters run on lithium vapour: it ionises easily and coats the electrodes, so they wear less. Glows crimson (670.8 nm).'}}},
 thermal:{label:'Propellant',def:'h2',o:{
  h2:{n:'Hydrogen',fuel:'h2',ve:1,k:1,hf:1,col:'#9fc4ff',txt:'Lightest molecules, fastest exhaust (exhaust speed ∝ √(temperature ÷ molecular mass)). Bulky and made from water. Nearly invisible pale blue.'},
  ch4:{n:'Methane',fuel:'ch4',ve:.62,k:1,hf:1,col:'#78d6ff',txt:'Splits into carbon and hydrogen in the core: 62 % of hydrogen’s exhaust speed, far denser. Made from water and carbon (Sabatier reaction). Faint blue.'},
  nh3:{n:'Ammonia',fuel:'nh3',ve:.56,k:1,hf:1,col:'#ffb47a',txt:'Splits into nitrogen and hydrogen: 56 % of hydrogen’s speed, easy to store. Needs nitrogen: from Earth. Faint orange afterglow.'},
  wat:{n:'Water',fuel:'wat',ve:.42,k:1,hf:1.2,col:'#ffd2a0',txt:'Steam rocket: only 42 % of hydrogen’s speed, but water is everywhere: mine it from any C-type asteroid and pump it straight in. Hot steam corrodes the core a little faster.',wear:1.5}}},
 chem:{label:'Propellants',def:'chem',o:{
  chem:{n:'Hydrolox',fuel:'chem',ve:1,k:1,hf:1,col:'#cfe2ff',txt:'Liquid hydrogen + liquid oxygen: the best chemical exhaust speed. Made from water by electrolysis. Almost invisible flame.'},
  ml:{n:'Methalox',fuel:'ml',ve:.84,k:1,hf:1,col:'#5fb4ff',txt:'Liquid methane + liquid oxygen: 16 % slower exhaust, but dense and easy to keep cold. Made from water and carbon in space. Blue flame with shock diamonds.'}}}};
// fuels for the new options (added to FUEL so fuel buying, cost and production rules all work)
Object.assign(FUEL,{
 dt:{n:'D–T fuel',full:'deuterium + tritium',J:2e10,earthJ:5e10,make:{water:15000,silicates:2},how:'deuterium from water, tritium bred from lithium in the reactor blanket'},
 he3:{n:'D–³He fuel',full:'deuterium + helium-3',J:5e11,earthJ:5e11,earthOnly:true,make:{},how:'helium-3 strip-mined from the Moon’s soil: only inside Earth’s gravity zone'},
 pb:{n:'p–¹¹B fuel',full:'hydrogen + boron-11',J:3e9,earthJ:3e9,earthOnly:true,make:{},how:'enriched boron-11 and hydrogen from Earth'},
 kr:{n:'Krypton',full:'krypton gas',J:2e5,earthJ:2e5,earthOnly:true,make:{},how:'distilled from Earth’s air'},
 ar:{n:'Argon',full:'argon gas',J:5e4,earthJ:5e4,earthOnly:true,make:{},how:'distilled from Earth’s air (1 % of it is argon)'},
 li:{n:'Lithium',full:'lithium metal',J:2e6,earthJ:2e6,earthOnly:true,make:{},how:'refined on Earth'},
 ch4:{n:'Liquid methane',full:'liquid methane',J:6e7,earthJ:1.5e8,make:{water:2.25,carbon:.75},how:'Sabatier reaction: carbon + hydrogen from water (2.25 kg water + 0.75 kg carbon → 1 kg)'},
 nh3:{n:'Ammonia',full:'liquid ammonia',J:5e6,earthJ:5e6,earthOnly:true,make:{},how:'made from nitrogen in Earth’s air'},
 wat:{n:'Water (propellant)',full:'purified water',J:2e5,earthJ:1e7,make:{water:1},how:'purified from your stored water: 1 kg → 1 kg'},
 ml:{n:'Methalox',full:'liquid methane + liquid oxygen',J:4e7,earthJ:1e8,make:{water:.9,carbon:.15},how:'methane from carbon and water-hydrogen, oxygen from water (0.9 kg water + 0.15 kg carbon → 1 kg)'}});
for(const k in FUEL){if(!Object.getOwnPropertyDescriptor(FUEL[k],'cost'))Object.defineProperty(FUEL[k],'cost',{get(){return inEarth()&&this.earthJ?this.earthJ:this.J}});if(s.fuel[k]==null)s.fuel[k]=0}
DR.forEach(D=>{D.k0=D.k;D.hfS=D.hf;D.base0=D.base;D.al0=D.al;D.f0=D.f});
const engVol=(d,l)=>Math.PI*d*d/4*l,engArea=(d,l)=>Math.PI*d*l+Math.PI*d*d/2;
// the design in force for an engine (stock values when never redesigned)
function engCfg(D){const fam=ENGFAM[D.id];if(!fam)return null;const c=(s.eng&&s.eng[D.id])||{};const dd=ENGDIM[D.id];
 return{opt:ENGOPT[fam].o[c.opt]?c.opt:ENGOPT[fam].def,tune:Math.max(-1,Math.min(1,+c.tune||0)),D:+c.D||dd[0],L:+c.L||dd[1],shield:Math.max(0,+c.shield||0),eps:Math.max(10,Math.min(400,+c.eps||100)),bim:ENGBIM[D.id]&&c.bim?1:0,n:Math.max(1,Math.min(4,+c.n||1)),dims:!!c.D}}
// nozzle expansion ratio ε (exit area ÷ throat area) for chemical and thermal engines: a bigger bell turns more of the
// gas's heat into speed (≈ +4 % exhaust speed per e-fold of ε, as from a stock ε 84 to an extended ε 280 bell), but the
// bell's mass grows with its area (20 % of the engine's base mass at the stock ε 100). The same mass flow leaves faster, so
// jet power grows as v² and thrust as v; the chamber's waste heat stays the same
const engNoz=(fam,e)=>fam==='thermal'||fam==='chem'?{v:1+.04*Math.log((e||100)/100),m:.8+.2*(e||100)/100}:{v:1,m:1};
const engTuneVe=(fam,t)=>fam==='thermal'||fam==='chem'?1+.12*t:Math.pow(2,t/2);
// everything a design gives, without applying it (the workshop previews with this)
function engSpec(D,c){const fam=ENGFAM[D.id],o=ENGOPT[fam].o[c.opt],dd=ENGDIM[D.id],mk=1+.12*(D.mk-1);
 const nz=engNoz(fam,c.eps),ve=Math.min(.999*C,D.ve0*mk*o.ve*engTuneVe(fam,c.tune)*nz.v),k=D.k0*(o.k||1),hf=D.hfS*Math.pow(.7,D.mk-1)*(o.hf||1)*(fam==='thermal'?1+.5*c.tune:1)/(nz.v*nz.v);
 const pw=(c.dims?D.pw0*(o.pd||1)*engVol(c.D,c.L)/engVol(dd[0],dd[1]):(D===DR[di]?PW:D.pw))*nz.v*nz.v,base=D.base0*Math.pow(engArea(c.D,c.L)/engArea(dd[0],dd[1]),.85)*nz.m*(c.bim?1.15:1)*(1+.08*((c.n||1)-1))+c.shield,al=D.al0*(o.al||1);
 const wear=(o.wear||1)*(fam==='thermal'?Math.pow(3,c.tune):1),mass=base+al*pw*(1-.25*(D.mk-1));
 return{fam,o,ve,k,hf,pw,base,al,wear,mass,F:k*pw/ve,heat:pw*hf,fuel:o.fuel,col:o.col,dose:(o.dose||0)*Math.exp(-c.shield/1500)}}
// apply the design in force to DR (called after building a design, an upgrade, a load, or a multiplayer reset)
function engRecalc(D){const c=engCfg(D);if(!c)return;const p=engSpec(D,c);D.ve=p.ve;D.k=p.k;D.hf=p.hf;D.base=p.base;D.al=p.al;D.f=p.fuel;D.wearMul=p.wear;D.col=p.col;D.doseK=p.dose;
 if(c.dims){D.pw=p.pw;if(D===DR[di])PW=p.pw}}
function engSyncAll(){if(!s.eng)s.eng={};for(const k in FUEL)if(s.fuel[k]==null)s.fuel[k]=0;DR.forEach(engRecalc)}
// materials to rebuild an engine: a quarter of the new engine's mass in metal (more for a bigger engine), plus 5 % of
// any added mass; the shield is cast from iron
function engDesignCost(D,c){const p=engSpec(D,c),old=engMass(D,D===DR[di]?PW:D.pw),dm=Math.max(0,p.mass-old),fresh=.05*p.mass+dm;
 return{mat:{iron:Math.ceil(.6*fresh+.9*Math.max(0,c.shield-engCfg(D).shield)),nickel:Math.ceil(.15*fresh),platinum:+(.0008*fresh).toFixed(2)},J:2e6*fresh+1e6,p}}
function engDesignJob(id,c){const D=DR.find(x=>x.id===id);if(!D||!ENGFAM[id])return null;const q=engDesignCost(D,c);
 return queueJob({type:'design',id,cfg:{opt:c.opt,tune:+c.tune||0,D:+c.D,L:+c.L,shield:+c.shield||0,eps:+c.eps||100,bim:c.bim?1:0,n:Math.max(1,Math.min(4,+c.n||1))},mat:q.mat,name:'Rebuild '+D.n+' ('+ENGOPT[ENGFAM[id]].o[c.opt].n+', '+(+c.D).toFixed(2)+' × '+(+c.L).toFixed(2)+' m)',J:q.J,minT:3600})}
// neutron dose to the crew from a burning fusion core (Sv per second); hull armour and shields cut it further
function engDose(ad){const D=DR[di];if(!(s.burn>0)||!D.doseK)return 0;return 1e-13*D.doseK*PW*s.burn/3600*Math.exp(-(ad||0)/25)}
if(!s.eng)s.eng={};
// variable specific impulse: a helicon magnetoplasma engine can trade exhaust speed for thrust in flight at constant
// power, by changing how much RF power goes into ionising versus heating the plasma. No rebuild: the tuning applies at
// once (other engines must be rebuilt). Needs a workshop design in force (so its size is on record).
const ENGLIVE={vas:1};
function engLiveTune(id,t){const D=DR.find(x=>x.id===id),c=s.eng&&s.eng[id];if(!D||!ENGLIVE[id]||!isU(id)||!c)return false;c.tune=Math.max(-1,Math.min(1,+t||0));engRecalc(D);return true}
// bimodal nuclear thermal rockets: while coasting, the reactor core runs gently and drives a Brayton turbine, so the
// engine doubles as a power plant (as proposed for crewed Mars missions). +15 % engine mass; electric output below,
// 20 % efficient (the rest goes to the radiators); off while the engine is burning.
const ENGBIM={ntr:2.5e4,gcnr:1e5};
function engBimReactors(){const L=[];for(const id in ENGBIM){const D=DR.find(x=>x.id===id),c=s.eng&&s.eng[id];if(!D||!isU(id)||!c||!c.bim||D.fail)continue;
 L.push({p:{cond:D.cond==null?1:D.cond},d:{n:'Bimodal core: '+D.n,cat:'gen',pe:ENGBIM[id],eta:.2,rad:.3,bimEng:id}})}return L}
// engine clusters: the same total power split over n engines (1–4). Each extra engine adds 8 % to the base mass
// (plumbing, mounts, gimbals), but a failure then stops only one of them: the rest keep pushing at (n − lost)/n of the
// thrust until repairs bring the engine's condition back above 95 %.
const engClN=D=>{const c=s.eng&&s.eng[D.id];return c&&c.n>1?Math.min(4,c.n|0):1};
const engClusterK=D=>{const n=engClN(D),c=s.eng&&s.eng[D.id];return n>1?Math.max(0,(n-((c&&c.lost)||0))/n):1};
// called when a failure strikes the active engine: true if a cluster absorbed it
function engClusterFail(D){const n=engClN(D),c=s.eng&&s.eng[D.id];if(n<2||!c||(c.lost||0)>=n-1)return false;c.lost=(c.lost||0)+1;D.cond=Math.max(0,D.cond-.3);return true}
function engClusterTick(){for(const D of DR){const c=s.eng&&s.eng[D.id];if(c&&c.lost&&D.cond>=.95){c.lost=0;notify('🔧 '+tr(D.n)+': '+tr('all engines of the cluster are running again.'))}}}
