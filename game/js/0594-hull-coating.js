// ===== HULL COATING (RULES): how much sunlight the hull soaks up =====
// The sunlit hull absorbs a share α (absorptance) of the sunlight falling on it, and that heat lands in the crew loop.
// Spacecraft are wrapped in coatings chosen for α:
//   White thermal paint             α 0.30  the stock finish: light and cheap
//   Optical solar reflector tiles   α 0.08  silvered quartz mirrors (as on spacecraft that work near the Sun):
//                                            under a third of the solar heat, and the hull survives 3.75× brighter
//                                            sunlight before it starts to burn; +300 kg
//   Gold foil                       α 0.30  looks spectacular, and is what keeps instruments warm far out; no change
//                                            to heat here (kept for the look), +20 kg
// The sunlight the hull can take before burning (without a sunshade or heat shield) is 25 kW/m² × (0.30 / α).
const COAT={white:{n:'White thermal paint',a:.3,kg:0,mat:{silicates:20},txt:'The stock finish: absorbs 30 % of sunlight. Light and cheap.'},
 osr:{n:'Optical solar reflector tiles',a:.08,kg:300,mat:{silicates:200,platinum:.5},txt:'Silvered quartz tiles reflect 92 % of sunlight: under a third of the solar heat in the cabin loop, and the hull takes 3.75× brighter sunlight before it burns. 300 kg.'},
 gold:{n:'Gold foil',a:.3,kg:20,mat:{platinum:2},txt:'Crinkled gold-coloured insulation foil: the classic spacecraft look. Same heat as paint here. 20 kg.'}};
if(!s.coat)s.coat='white';
const coatT=()=>COAT[s.coat]||COAT.white,hullAlpha=()=>coatT().a,coatKg=()=>coatT().kg;
function coatJob(k){const c=COAT[k];if(!c||k===s.coat)return null;return queueJob({type:'coat',k,mat:{...c.mat},name:'Recoat the hull: '+c.n.toLowerCase(),J:2e9,minT:3600*8})}
