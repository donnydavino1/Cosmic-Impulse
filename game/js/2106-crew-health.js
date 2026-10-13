// ===== CREW HEALTH IN SPACE (RULES): weightlessness and lifetime radiation =====
// Weightlessness: without gravity, bones lose calcium and muscles waste; astronauts lose about 1–1.5 % of bone mass a
// month with no countermeasures. Exercise (treadmill, cycle, resistance machine) slows it: ISS crews train ~2.5 h a day.
// Each astronaut has a fitness (100 % = as fit as on Earth); it falls per month by
//   0 h/day exercise: 2.5 %   1 h/day: 1 %   2.5 h/day: 0.25 %
// and rises 3 %/month × (g / 9.81) while the engine pushes the ship at 2 m/s² or more (thrust is real gravity).
// Exercise takes time from duties (2.5 h is the baseline the rest of the game assumes; less exercise gives more work
// time). Low fitness slows all work: work × (0.6 + 0.4 · fitness).
// Isolation: once Earth is more than a light-minute away, talking to family becomes exchanging recordings (morale −2 to
// −10, growing with the light delay).
// Lifetime dose: each astronaut's dose since joining. The career limit is 600 mSv; every sievert adds ~5 % lifetime risk of
// fatal cancer. Past the limit, morale drops.
const CHH={ex:{0:2.5,1:1,2.5:.25},rec:3,lim:.6,risk:.05};
if(s.exer==null)s.exer=2.5;
const chExer=()=>CHH.ex[s.exer]!=null?+s.exer:2.5;
const chG=()=>{if(!(s.burn>0)||typeof thrustAcc!=='function')return 0;const L=s.lim||{};return thrustAcc()*s.burn*(L.f!=null?L.f:1)};
const chFit=m=>m.fit==null?100:m.fit,chAvg=()=>{const L=s.crew.list||[];return L.length?L.reduce((a,m)=>a+chFit(m),0)/L.length:100};
const chDose=m=>Math.max(0,(s.crew.dose||0)-(m.d0||0));
// work multiplier: fitness, plus time freed (or taken) by the exercise schedule, relative to the 2.5 h baseline
const chFitK=()=>(.6+.4*chAvg()/100)*(16-chExer())/13.5;
function chTick(h){const c=s.crew;if(!c.alive||c.sleep||!(h>0))return;const g=Math.max(chG(),typeof spinG==='function'?spinG():0),mo=h/730.5;
 for(const m of c.list||[]){if(m.d0==null)m.d0=c.dose||0;let f=chFit(m);f-=CHH.ex[chExer()]*mo;if(g>=2)f+=CHH.rec*Math.min(1,g/9.81)*mo;m.fit=Math.max(30,Math.min(100,f))}
 chMed(h);chGTick(h);
 const a=chAvg();if(a<70&&!c.weakTold){c.weakTold=1;notify('🦴 '+tr('Weightlessness is weakening the crew: more exercise, or thrust gravity, will help. See 👩‍🚀 Crew.'))}if(a>80)c.weakTold=0}
function chMorale(out){const a=chAvg();if(a<70)out.push(['Weak from weightlessness',-Math.round((70-a)/4)]);if((s.crew.list||[]).some(m=>chDose(m)>CHH.lim))out.push(['Past the career radiation limit',-10]);if(chExer()===0)out.push(['No exercise: stiff and restless',-4]);if(typeof spinG==='function'&&spinG()>0){if(s.spinRpm>4)out.push(['Spinning too fast: dizzy',-6]);else if(spinG()>=2)out.push(['Gravity at last',4])}{const E=B[3],lt=Math.hypot(s.x-E.x,s.y-E.y,s.z-E.z)/C;if(lt>60)out.push([lt>86400?'Earth is a light-day away: messages home take days':lt>3600?'Earth is light-hours away: no real conversations home':'Earth is light-minutes away: delayed calls home',-Math.min(10,Math.round(2*Math.log10(lt/60)+2))])}const ill=(s.crew.list||[]).filter(m=>m.ill).length;if(ill)out.push(['Someone is sick',-5*ill])}
// Medical events: about one problem per astronaut every 18 months, more often when deconditioned (bone calcium leaving
// the skeleton raises the risk of kidney stones; fluid shifting to the head in weightlessness swells the optic nerve).
// A sick astronaut is off duty until recovered; medics speed recovery by 50 % per skill level and stop the worst ones
// draining the crew's health.
const ILL={kidney:{n:'Kidney stone',d:6,hp:.02},tooth:{n:'Dental abscess',d:4,hp:.01},skin:{n:'Skin infection',d:3,hp:.005},sans:{n:'Eye swelling from weightlessness (SANS)',d:10,hp:0},
 burn:{n:'Burn from a hot coolant line',d:5,hp:.02},append:{n:'Appendicitis',d:14,hp:.08}};
const chIllW={kidney:3,tooth:2,skin:3,sans:2,burn:2,append:1};
function chMed(h){const c=s.crew,L=c.list||[];if(typeof SBX==='function'&&SBX())return;
 for(const m of L){if(m.ill){const med=L.filter(q=>q!==m&&!q.ill&&q.role==='medic').reduce((a,q)=>a+crewLv(q,'medic'),0),k=1+.5*med;m.ill.left-=h*k;
   const I=ILL[m.ill.k]||{hp:0};if(!med)c.hp=Math.max(0,c.hp-I.hp*h);
   if(m.ill.left<=0){notify('🩺 '+m.n+' '+tr('has recovered from')+' '+tr((I.n||'').toLowerCase())+'.');delete m.ill}continue}
  const risk=(chFit(m)<80?1.6:1)/(1.5*8766);if(Math.random()<risk*h){let tot=0;for(const k in chIllW)tot+=chIllW[k]*(k==='kidney'&&chFit(m)<80?2:1);let r=Math.random()*tot,pick='skin';
   for(const k in chIllW){r-=chIllW[k]*(k==='kidney'&&chFit(m)<80?2:1);if(r<=0){pick=k;break}}m.ill={k:pick,left:ILL[pick].d*24};
   notify('🤒 '+m.n+': '+tr(ILL[pick].n)+'. '+tr('Off duty for about')+' '+ILL[pick].d+' '+tr('days')+(L.some(q=>q!==m&&q.role==='medic')?'':' · '+tr('a crewmate on medicine duty would speed recovery')))}}}
// Spin gravity: turning the ship gives the crew a centripetal "gravity" g = ω²r. Spinning the hull end over end uses half
// the ship's length as the radius (small, so it needs fast spin); a tether with a counterweight gives a 225 m radius
// (1 g at about 2 rpm). Above ~4 rpm the inner ear rebels (dizziness, morale down). The spin stops while the engine
// burns. Spin gravity rebuilds fitness like thrust gravity. The tether is built once (400 kg of carbon, +500 kg).
const SPIN={tetherR:225,tetherKg:500,maxRpm:6};
if(s.spinMode==null)s.spinMode=0;if(s.spinRpm==null)s.spinRpm=2;
const spinR=()=>s.spinMode==='tether'&&s.tether?SPIN.tetherR:s.spinMode==='hull'?Math.max(2,((SH&&SH.lay&&SH.lay.L)||10)/2):0;
const spinG=()=>{if(!s.spinMode||s.burn>0)return 0;const w=2*Math.PI*s.spinRpm/60;return w*w*spinR()};
const tetherKg=()=>s.tether?SPIN.tetherKg:0;
function tetherJob(){if(s.tether)return null;return queueJob({type:'tether',mat:{carbon:400},name:'Build a spin tether and counterweight (225 m)',J:3e9,minT:3600*24})}
// Acceleration limit: people tolerate about 1 g indefinitely, 2–3 g for hours (lying in acceleration couches), 6 g for
// minutes. The engine is held to the limit you set (hibernating crews are not limited); above 2 g the crew tires:
// health −1 %/h per g over 2.
if(s.gLim==null)s.gLim=3;
const chGLim=()=>[1,2,3,6].includes(+s.gLim)?+s.gLim:3;
function chGTick(h){const g=chG()/9.81;if(g>2&&s.crew.alive&&!s.crew.sleep)s.crew.hp=Math.max(0,s.crew.hp-(g-2)*h)}
