// ===== SOLAR SAIL FILM (RULES): what your sail is made of =====
// Sunlight pushes a mirror with force (1 + ρ) · flux · area / c, where ρ is the share of light reflected (a perfect
// mirror gets twice the push of a black sheet). The light it does not reflect it absorbs, so the sail warms until it
// radiates that heat away: T = (α · flux / (σ · ε))^¼ with α = 1 − ρ and ε the emissivity of both faces. Thrust grows as
// 1/distance², so diving close to the Sun is the fast way to sail, but every film has a temperature it can take:
//   Aluminised polyimide   20 g/m², ρ 0.88, safe to ~600 K (about 0.19 AU): the stock film, tough
//   Thin aluminised film    5 g/m², ρ 0.88, only ~520 K (about 0.25 AU): four times lighter, best far from the Sun
//   Carbon microtruss      10 g/m², ρ 0.70, takes 2,000 K (about 0.015 AU): a black-backed mesh made for Sun-diving
// Above its limit a deployed sail (the active engine) tears and shrinks. Replacing the film or adding area is a job.
const SAILM={poly:{n:'Aluminised polyimide',kg:.02,rho:.88,eps:.65,Tmax:600,mat:{carbon:.015,silicates:.005},txt:'The stock film: tough and forgiving, safe to about 600 K.'},
 thin:{n:'Thin aluminised film',kg:.005,rho:.88,eps:.6,Tmax:520,mat:{carbon:.005},txt:'Four times lighter, so four times the push per kg of sail, but it softens at about 520 K: stay outside a quarter of an AU.'},
 carb:{n:'Carbon microtruss',kg:.01,rho:.7,eps:1.6,Tmax:2000,mat:{carbon:.01},txt:'A carbon mesh with a reflective face and a black back that radiates heat away: it survives 2,000 K, so you can dive to within a few Sun widths, where sunlight is a thousand times stronger.'}};
if(!s.sailM)s.sailM='poly';
const sailM=()=>SAILM[s.sailM]||SAILM.poly,sailKg=()=>sailM().kg,sailRho=()=>sailM().rho;
// equilibrium film temperature at distance r from the Sun, and the closest it may go
const sailT=(r,m)=>{m=m||sailM();return Math.pow((1-m.rho)*S0*(AU/r)**2/(SIG*m.eps),.25)},sailMinR=m=>{m=m||sailM();return AU*(sailT(AU,m)/m.Tmax)**2};
// a sail comes with the unlock: 10,000 m² (also for saves from before this existed)
function sailInit(){if(isU('sail')&&!s.sailInit){s.sailInit=1;if(!(s.sailA>0))s.sailA=1e4}}
// per game hour h: an overheated, deployed sail tears
function sailTick(h){sailInit();if(!(s.sailA>0)||!DR[di].sail||!s.lit||!(h>0))return;const S=B[0],T=sailT(Math.hypot(s.x-S.x,s.y-S.y,s.z-S.z)),m=sailM();if(T<=m.Tmax)return;
 const lost=s.sailA*(1-Math.exp(-h*4*(T/m.Tmax-1)));s.sailA=Math.max(0,s.sailA-lost);
 if(!s.sailWarn||T-s.sailWarn>0){s.sailWarn=T+50;notify('🔥 '+tr('The sail film is overheating and tearing: move farther from the Sun.'))}}
function sailSwapJob(k){const m=SAILM[k];if(!m||k===s.sailM||!(s.sailA>0))return null;const mt={};for(const q in m.mat)mt[q]=+(m.mat[q]*s.sailA).toFixed(1);
 return queueJob({type:'sailm',k,mat:mt,name:'Replace '+f1(s.sailA,0)+' m² of sail film with '+m.n.toLowerCase(),J:2e5*s.sailA,minT:3600*3})}
function sailGrowJob(){if(!isU('sail'))return null;const m=sailM(),A=1e4,mt={};for(const q in m.mat)mt[q]=+(m.mat[q]*A).toFixed(1);
 return queueJob({type:'sailA',A,mat:mt,name:'Add 10,000 m² of '+m.n.toLowerCase(),J:2e5*A,minT:3600*2})}
