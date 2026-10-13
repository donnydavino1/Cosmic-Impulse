// ===== HEAT-PIPE WORKING FLUID (RULES): what boils inside your high-temperature radiators =====
// A heat pipe is a sealed tube: liquid metal boils at the hot end, the vapour carries heat to the cold end, condenses and
// wicks back. Each metal works only in its own temperature band, so the fluid sets how hot the radiator may run, and the
// tube wall has to survive it:
//   Potassium  up to 900 K   thin steel tubes: lighter and cheap, but sheds less heat (radiated power ∝ T⁴)
//   Sodium     up to 1,200 K the stock fluid, in nickel-alloy tubes
//   Lithium    up to 1,500 K needs refractory-metal tubes (niobium–zirconium, here platinum-group stock): 40 % heavier,
//              but (1500/1200)⁴ ≈ 2.4× the heat per m²
// Applies to every heat-pipe radiator (stock and designed: parts flagged hp). Droplet radiators use molten tin instead.
// Refilling swaps the fluid in all of them at once: a job that costs the new tube materials per radiator.
const HPF={k:{n:'Potassium',T:900,m:.85,mat:{iron:60},txt:'Boils low: thin steel tubes, light and cheap, but a 900 K radiator sheds only about a third of what a 1,200 K one does.'},
 na:{n:'Sodium',T:1200,m:1,mat:{nickel:40,iron:20},txt:'The standard choice for space reactors: works from about 900 to 1,200 K in nickel-alloy tubes.'},
 li:{n:'Lithium',T:1500,m:1.4,mat:{nickel:40,platinum:4},txt:'Runs at 1,500 K, so each m² sheds 2.4× the heat of sodium. Needs refractory-metal tubes: 40 % heavier and costly.'}};
if(!s.hpf)s.hpf='na';
const hpfT=()=>HPF[s.hpf]||HPF.na;
// a heat-pipe part with the current fluid: its temperature limit and mass (scaled from the sodium baseline of 1,200 K)
function hpfApply(d){const f=hpfT();if(f===HPF.na)return d;const e=Object.assign({},d);e.Tmax=Math.round(d.Tmax*f.T/1200);e.m=d.m*f.m;return e}
const hpfCount=()=>s.parts.filter(p=>(PARTS[p.id]||{}).hp).length;
function hpfJob(k){const f=HPF[k],n=hpfCount();if(!f||k===s.hpf||!n)return null;const m={};for(const q in f.mat)m[q]=f.mat[q]*n;
 return queueJob({type:'hpf',k,mat:m,name:'Refill '+n+' heat-pipe radiator'+(n>1?'s':'')+' with '+f.n.toLowerCase(),J:2e9*n,minT:3600*2})}
