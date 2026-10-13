// ===== GREENHOUSE CROPS (RULES): what grows in the bioregenerative greenhouse =====
// The greenhouse (ls_bio) makes all the crew's oxygen and more food than they eat; what you plant sets how much more,
// how much LED power it takes, and how the crew feel about dinner. Figures per crew member per day:
//   Potatoes and wheat   +0.3 kg food surplus, 100 % lighting power, morale +8: the classic dense calories
//   Algae tanks          +0.45 kg (spirulina doubles in days), 60 % power, morale −4: green paste every meal
//   Mixed garden         +0.12 kg (beans, tomatoes, greens), 125 % power, morale +16: real meals, and gardening
// Replanting takes two weeks and a little carbon (growth medium).
const CROPS={pot:{n:'Potatoes and wheat',food:.3,pw:1,mor:8,txt:'Dense calories and the classic choice for a space farm: a steady surplus at the standard lighting power.'},
 alg:{n:'Algae tanks',food:.45,pw:.6,mor:-4,txt:'Spirulina in lit tanks doubles in days: the most food for the least power. The crew eat green paste every meal and are not thrilled.'},
 gar:{n:'Mixed garden',food:.12,pw:1.25,mor:16,txt:'Beans, tomatoes, peppers and greens: barely more food than the crew eat, and hungry for light, but real meals and time in the garden lift everyone.'}};
if(!s.crop)s.crop='pot';
const cropT=()=>CROPS[s.crop]||CROPS.pot;
function cropJob(k){if(!CROPS[k]||k===s.crop||!(SH&&SH.ls===PARTS.ls_bio))return null;
 return queueJob({type:'crop',k,mat:{carbon:40,water:200},name:'Replant the greenhouse with '+CROPS[k].n.toLowerCase(),J:5e8,minT:14*86400})}
