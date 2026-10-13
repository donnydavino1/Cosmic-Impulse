// ===== REACTOR POWER CONVERSION (RULES): how fission heat becomes electricity =====
// A fission reactor makes heat; a converter turns some of it into electricity and the rest must be radiated away.
// The reactor's heat output stays the same, so a better converter means more watts out and less waste heat:
//   Thermoelectric      7 %  no moving parts (like a radioisotope generator): 15 % lighter, almost never fails
//   Stirling           25 %  free-piston engines: the small reactor's stock converter
//   Brayton            30 %  gas turbine: the megawatt reactor's stock converter, 10 % heavier
//   Supercritical CO₂  40 %  a compact turbine running near CO₂'s critical point: 20 % heavier, more maintenance
// Applies to every fission reactor (not fusion reactors). "Stock" keeps each reactor's own design.
const PCV={te:{n:'Thermoelectric',eta:.07,m:.85,fail:.1,mat:{silicates:60,nickel:20},txt:'Semiconductor couples turn heat straight into current, with no moving parts: very reliable and light, but only 7 % efficient, so almost all of the heat must be radiated.'},
 stir:{n:'Stirling',eta:.25,m:1,fail:1,mat:{iron:150,nickel:40},txt:'Free-piston Stirling engines: 25 % efficient, a good match for small reactors.'},
 bray:{n:'Brayton',eta:.3,m:1.1,fail:1.2,req:'t_fis2',mat:{iron:300,nickel:120,platinum:.5},txt:'A closed-cycle gas turbine: 30 % efficient, heavier, with turbomachinery to maintain.'},
 sco2:{n:'Supercritical CO₂',eta:.4,m:1.2,fail:1.5,req:'t_fis2',mat:{iron:400,nickel:200,platinum:2},txt:'A compact turbine running CO₂ near its critical point: 40 % efficient, the most watts per reactor, but the heaviest and fussiest.'}};
const pcvOn=d=>d&&d.cat==='gen'&&d.eta&&!d.fuel;
// a fission reactor with the chosen converter: same heat output, new efficiency and mass
function pcvApply(d){const c=PCV[s.pcv];if(!c||!pcvOn(d))return d;const e=Object.assign({},d),th=d.pe/d.eta;e.eta=c.eta;e.pe=th*c.eta;e.m=d.m*c.m;return e}
const pcvFailK=d=>{const c=PCV[s.pcv];return c&&pcvOn(d)?c.fail:1},pcvCount=()=>s.parts.filter(p=>pcvOn(PARTS[p.id])).length;
function pcvJob(k){const c=k==='stock'?null:PCV[k],n=pcvCount();if((k==='stock'?!s.pcv:k===s.pcv)||!n)return null;if(c&&c.req&&!hasT(c.req))return null;const m={};const src=c?c.mat:{iron:150,nickel:40};for(const q in src)m[q]=src[q]*n;
 return queueJob({type:'pcv',k,mat:m,name:'Refit '+n+' reactor'+(n>1?'s':'')+' with '+(c?c.n:'their stock')+' converters',J:5e9*n,minT:3600*12})}
// Core life: a fission core burns its uranium. Each reactor's core lasts a number of full-power years (small reactor
// 10, megawatt reactor 7); past that its output falls, reaching zero at 120 %. A fresh core can be ordered from Earth
// while you are in Earth's gravity zone (or anywhere in sandbox).
const CORE={fis1:10,fis2:7},YR=3.15576e7;
const coreUsed=p=>{const L=CORE[p.id],d=PARTS[p.id];if(!L||!d)return 0;return(p.burn||0)/(d.pe/d.eta*L*YR)};
const coreK=p=>{const f=coreUsed(p);return f<1?1:Math.max(0,1-(f-1)/.2)};
function coreJob(){const L=s.parts.filter(p=>CORE[p.id]&&(p.burn||0)>0);if(!L.length)return'none';if(!inEarth()&&!(typeof SBX==='function'&&SBX()))return'earth';
 return queueJob({type:'core',mat:{iron:100*L.length},name:'Fresh reactor cores from Earth ('+L.length+')',J:1e10*L.length,minT:86400*3})?'ok':'mat'}
