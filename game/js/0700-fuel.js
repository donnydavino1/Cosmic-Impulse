// ===== FUEL & SUPPLIES =====
const maxP=()=>Math.max(0,Math.floor(s.res.silicates/PSI)),canP=n=>maxP()>=n;
function arrLayout(){const A=s.area;return A<=200?CUST.wings+' fold-out wings (next layout at 200 m²)':A<=5000?'petal fans, 8 petals × 2 stacked layers (next layout at 5,000 m²)':A<=2e5?'2 stacked rings of hexagonal tiles (next layout at 200,000 m²)':'3 stacked hexagonal discs'}
function maxMakeRes(f){const F=FUEL[f];if(f==='am'&&!isU('am'))return 0;if(inEarth()&&F.earthJ)return Infinity;if(F.earthOnly)return 0;return F.make.water?s.res.water/F.make.water:Infinity}
function canMake(f,n){if(!(n>0)||!isFinite(n))return false;const F=FUEL[f];if(f==='am'&&!isU('am'))return false;if(inEarth()&&F.earthJ)return true;if(F.earthOnly)return false;return!F.make.water||s.res.water>=n*F.make.water}
function buyFu(f,n){if(!f||!canMake(f,n))return null;const F=FUEL[f],earth=inEarth()&&F.earthJ,w=earth?0:(F.make.water||0)*n;if(w)s.res.water-=w;
 return queueJob({type:'fuel',f,n,water:w,name:(earth?'Order ':'Make ')+f1(n,n<10?2:0)+' kg '+F.n.toLowerCase()+(earth?' from Earth':''),J:n*(earth?F.earthJ:F.J)})}
function costTxt(f,n){if(!f)return'';const F=FUEL[f];if(f==='am'&&!isU('am'))return'needs the antimatter factory';if(inEarth()&&F.earthJ)return sci(n*F.earthJ)+' J (ordered from Earth)';if(F.earthOnly)return'only inside Earth’s gravity zone';return(F.make.water?f1(n*F.make.water,0)+' kg water + ':'')+sci(n*F.J)+' J'}
const SUPR={oxygen:{n:'Oxygen',earthJ:1e7,make:{water:1.125},J:1.6e7,how:'split from water by electrolysis'},food:{n:'Food',earthJ:2e7,how:'only from Earth (or a greenhouse)'},water:{n:'Water',earthJ:1e7,how:'from Earth, or mine C-type asteroids'},
 spares:{n:'Spare-parts kits (15 kg)',mat:{iron:10,nickel:2,silicates:2,platinum:.01},J:5e7,kg:15,how:'machined from iron, nickel, silicates and a little platinum'}};
function supJob(k,n){const R2=SUPR[k];if(R2.mat){const m={};for(const q in R2.mat)m[q]=R2.mat[q]*n;if(!queueJob({type:'sup',k,n,mat:m,name:'Make '+n+' '+R2.n.toLowerCase(),J:R2.J*n}))notify('⚠ Needs '+matTxt(m));return}
 if(inEarth()&&R2.earthJ){queueJob({type:'sup',k,n,name:'Order '+n+' kg '+R2.n.toLowerCase()+' from Earth',J:R2.earthJ*n});return}
 if(R2.make){const m={};for(const q in R2.make)m[q]=R2.make[q]*n;if(!queueJob({type:'sup',k,n,mat:m,name:'Make '+n+' kg '+R2.n.toLowerCase(),J:R2.J*n}))notify('⚠ Needs '+matTxt(m));return}notify('⚠ '+R2.n+': '+R2.how)}
function setDrive(i){if(!isU(DR[i].id))return;DR[di].pw=PW;di=i;PW=DR[di].pw}
const spd=b=>b<1e-3?f1(b*C/1e3,1)+' km/s':(b<.9999?b.toFixed(4):b.toFixed(6))+' c ('+f1(b*C/1e3,0)+' km/s)';
function topSpeed(i){const D=DR[i];if(!D.f)return 0;const m0=mass(),fu=s.fuel[D.f];if(fu<=0)return 0;return Math.tanh(D.ve/C*Math.log(m0/(m0-fu)))}
function fuelFor(i,b){const D=DR[i];if(!D.f)return 0;const M=mass(),F=s.fuel[D.f],R=Math.exp(C/D.ve*Math.atanh(b));if(!isFinite(R))return Infinity;return Math.max(0,(M-F)*(R-1)-F)}
const fmtNeed=(i,b)=>{const k=fuelFor(i,b);return !isFinite(k)||k>1e40?'impossible (more fuel than exists)':k<=0?'✓ you have enough':(k>1e7?sci(k):f1(k,k<10?2:0))+' kg more'+(k>6e24?' (more than Earth weighs!)':'')};
function statsTxt(i){const D=DR[i];if(D.esail){const r=sunDist();return `${tr('Electric sail')} · ${f1(D.F0*(AU/r),3)} N ${tr('here')} (${D.F0} N ${tr('at 1 AU, falling as 1/distance')}) · ${sci(D.pw)} W · ${tr('no propellant')}`}if(D.sail){const S=B[0],r=Math.hypot(s.x-S.x,s.y-S.y,s.z-S.z),F=2*S0*(AU/r)**2*s.sailA/C;return `Sail ${f1(s.sailA,0)} m² · thrust in full sunlight here ${sci(F)} N, 4× stronger at half the distance · no fuel limit, only time`}
 const P=i===di?PW:D.pw,Fn=D.k*P/D.ve;return `Mk ${D.mk} · rated ${sci(P)} W · engine mass ${f1(engMass(D,P),0)} kg · exhaust ${D.ve<1e6?f1(D.ve/1e3,1)+' km/s':f1(D.ve/C,3)+' c'} · energy from ${D.el?'your POWER BUS':'the FUEL'} · waste heat ${sci(P*D.hf)} W → ${D.loop==='none'?'carried away':D.loop==='lo'?'low-temp loop':'high-temp loop'} · fuel is ${FUEL[D.f].how} · on board ${f1(s.fuel[D.f],s.fuel[D.f]<10?2:0)} kg · full thrust ${sci(Fn)} N · TOP SPEED with this fuel: ${spd(topSpeed(i))}`}
const reachTxt=i=>`Fuel to reach 1,000 km/s: ${fmtNeed(i,1e6/C)} | 0.1c: ${fmtNeed(i,.1)} | 0.99c: ${fmtNeed(i,.99)}`;
const info=(p,fn)=>{const d=document.createElement('div');d.className='inf';p.appendChild(d);regs.push({b:d,label:fn,html:true});return d};
const DYN=[];const dyn=(p,fn)=>{const d=document.createElement('div');d.className='inf';p.appendChild(d);DYN.push({d,fn,last:''});return d};
