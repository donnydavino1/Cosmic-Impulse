// ===== SOLAR CELLS (RULES): which kind of cell your panels use, and how they age =====
// Panels lose efficiency over time: ultraviolet light and solar protons damage the cells, faster closer to the Sun.
//   Silicon               the stock cell: light, cheap, ages 0.5 % a year at 1 AU
//   Triple-junction GaAs  three stacked cells catch more of the spectrum: 30 % more power, heavier, very tough
//   Thin-film perovskite  printed cells: a quarter of the mass, two-thirds of the power, age fast
// EFF (0500) is multiplied by pvEff(); panel mass is pvKg() per m² (0100, 0550). Refurbishing restores the cells.
const PVT={si:{n:'Silicon',eff:1,kg:.2,deg:.005,mat:{silicates:.4},txt:'The stock cell: cheap and light. Ages about 0.5 % a year at Earth’s distance.'},
 gaas:{n:'Triple-junction GaAs',eff:1.3,kg:.35,deg:.0025,mat:{silicates:.3,nickel:.08,platinum:.0008},txt:'Three stacked junctions catch more of the Sun’s spectrum: 30 % more power per m², heavier, and twice as tough against radiation. What real spacecraft fly.'},
 thin:{n:'Thin-film perovskite',eff:.65,kg:.05,deg:.03,mat:{silicates:.15,carbon:.05},txt:'Printed cells on plastic film: a quarter of the mass for two-thirds of the power. They age quickly, about 3 % a year, faster near the Sun.'}};
if(!s.pv)s.pv='si';if(s.pvDeg==null)s.pvDeg=0;
const pvT=()=>PVT[s.pv]||PVT.si,pvKg=()=>pvT().kg,pvEff=()=>pvT().eff*(1-Math.max(0,Math.min(.6,s.pvDeg||0)));
// ageing per game hour h: faster in stronger sunlight (∝ 1/distance²) and during solar proton storms
function pvAge(h){if(!(s.area>0)||!(h>0))return;const r=sunDist(),k=(AU/r)**2*(typeof flare!=='undefined'&&flare&&T>=flare.t0?20:1);s.pvDeg=Math.min(.6,(s.pvDeg||0)+pvT().deg*h/8766*k)}
function pvSwapJob(t){const P=PVT[t];if(!P||t===s.pv||!(s.area>0))return null;const m={};for(const k in P.mat)m[k]=+(P.mat[k]*s.area).toFixed(2);
 return queueJob({type:'pvswap',t,mat:m,name:'Re-cell '+f1(s.area,0)+' m² of panels with '+P.n.toLowerCase(),J:P1*.3*s.area,minT:3600})}
function pvFixJob(){if(!(s.area>0)||!(s.pvDeg>.001))return null;return queueJob({type:'pvfix',mat:{silicates:+(PSI*.1*s.area*s.pvDeg*5).toFixed(1)},name:'Refurbish the solar cells (+'+f1(s.pvDeg*100,1)+' % power)',J:P1*.05*s.area,minT:1800})}
