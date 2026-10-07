// ===== SURVIVAL: crew, life support, radiation, micrometeoroids, wear & failures =====
Object.defineProperty(s,'dry',{get(){return Math.round(dryMass())},configurable:true});
const MINFO={water:'Drink it, breathe it (electrolysis), burn it (rocket fuel), hide behind it (shielding)',carbon:'Composites, sails, filters, plastics',silicates:'Solar cells, glass, radiators',iron:'The backbone of almost everything you build',nickel:'Alloys, batteries, superconducting magnets',platinum:'Catalysts, electrodes and accelerator parts: rare and precious'};
let flare=null,nextFlare=86400*(30+Math.random()*40),ALERTS=[],HIST=[],lastHist=0,lastAuto=0,lastDyn=0,warned={};
function lifeStep(dt){const c=s.crew;if(!c.alive)return;const d=dt/86400,ls=SH.ls,on=!!ls&&s.en>0,R=s.res;let o2=.84*d,wat=2.5*d,food=1.6*d;
 if(on&&ls===PARTS.ls_regen){wat=.175*d+.95*d;o2=0}else if(on&&ls===PARTS.ls_bio){wat=.05*d;o2=0;food=-.3*d}   // per person per day: 0.84 kg O2, 2.5 kg water, 1.6 kg food
 R.oxygen=Math.max(0,R.oxygen-s.leak*dt);if(o2>0){c.o2ok=R.oxygen>=o2;R.oxygen=Math.max(0,R.oxygen-o2)}else c.o2ok=R.water>0;
 c.waterok=wat<=0||R.water>=wat;R.water=Math.max(0,R.water-wat);c.foodok=food<=0||R.food>=food;R.food=Math.max(0,R.food-food);
 s.co2=on?Math.max(0,s.co2-10*d):s.co2+d}   // scrubbers off → CO2 builds up (~1 kg per day)
function doseNow(){if(!SH)recalc();const r=sunDist(),inMag=Math.hypot(s.x-B[3].x,s.y-B[3].y,s.z-B[3].z)<6e7,ww=SH.ww?Math.min(20,s.res.water/300):0,
  shel=s.shelter?Math.min(15,(s.res.water+s.fuel.chem+s.fuel.h2)/400)*(SH.lay?SH.lay.shelF:1):0,ad=SH.ad+ww+shel,mag=SH.mag&&s.en>0,
  gcr=(inMag?.4:1.8)/86400e3/(1+ad/30)*(mag?.5:1),spe=flare&&T>=flare.t0?flare.peak*(AU/r)**2*Math.exp(-ad/7)*(inMag?.05:1)*(mag?.1:1)/86400:0,
  reac=SH.reactors.reduce((a,q)=>a+(q.d.rad||0),0)/86400e3*Math.exp(-ad/25)*(SH.lay?SH.lay.reacF:1);return{gcr,spe,reac,tot:gcr+spe+reac,ad,inMag,shel}}
function toggleShelter(){s.shelter=!s.shelter;notify(s.shelter?'☢ Crew in the storm shelter: surrounded by water and fuel tanks (+'+f1(doseNow().shel,1)+' g/cm²). Research stops while sheltering.':'☢ Crew left the shelter.')}
function alertCrit(m,pause){notify(m);if(MP.conn)return;if(wi>3)wi=3;if(pause!==false)paused=true}
function survivalTick(dtg){if(!SH)recalc();if(!(dtg>0)||!s.crew.alive)return;recalc();const c=s.crew,h=dtg/3600;
 if(MP.role!=='guest'&&!flare&&T>nextFlare-3600){flare={t0:nextFlare,t1:nextFlare+86400*(.4+Math.random()),peak:.2+Math.random()*1.8};mpSend({t:'flare',flare});alertCrit('☀⚠ Solar proton storm detected! It arrives in about an hour and lasts '+dur(flare.t1-flare.t0)+'. Take shelter ('+KN(BIND.shelter)+'), or stay inside Earth’s magnetic field. Game paused.')}
 if(flare&&T>flare.t1){flare=null;nextFlare=T+86400*(25+Math.random()*60);disc('flare1','Survived a solar proton storm',30,'Shielding mass matters most against these bursts of protons')}
 const R2=doseNow(),dose=R2.tot*dtg;c.dose+=dose;c.acute=c.acute*Math.exp(-dtg/(30*86400))+dose;
 const rs=sunDist(),belt=rs>2.1*AU&&rs<3.3*AU,kuiper=rs>30*AU&&rs<55*AU,oort=rs>2000*AU&&rs<1e5*AU,nearRock=WT&&WT.kind==='ast'&&fireHeld&&astDist(WT.a)<2e4,rate=.04/86400*(1+s.area/2000)*(belt?5:kuiper?8:oort?15:1)*(nearRock?30:1),
  nh=rate*dtg<1?(Math.random()<rate*dtg?1:0):Math.min(20,Math.round(rate*dtg));
 for(let k=0;k<nh;k++){if(SH.whip&&Math.random()<.9)continue;const u=Math.random();
  // icy debris in the Kuiper belt and the Oort cloud arrives at kilometres per second: every hit gouges the hull
  if(kuiper||oort){s.hull-=hullMax()*(.004+.01*Math.random())*(oort?2:1);if(!s.iceWarn||T-s.iceWarn>86400){s.iceWarn=T;alertCrit(oort?'☄ Oort cloud debris is hitting the hull. A Whipple shield stops 90 % of it.':'☄ Kuiper belt debris is hitting the hull. A Whipple shield stops 90 % of it.')}
   if(s.hull<=0&&c.alive){c.alive=false;gameOver(oort?'debris in the Oort cloud':'debris in the Kuiper belt');return}}
  if(u<.15&&!s.leak){s.leak=1.4e-4;alertCrit('💥 A micrometeoroid breached the hull: oxygen is leaking (0.5 kg/hour). Patch it in 🛠 → 🏭 Fabricate.')}
  else if(u<.4)s.pcond=Math.max(.5,s.pcond-.003);else{const q=s.parts[Math.random()*s.parts.length|0];if(q)q.cond=Math.max(0,q.cond-.01-Math.random()*.05)}}
 // close to the Sun, sunlight itself burns the hull unless a sunshade or heat shield takes it
 {const fx=S0*(AU/rs)**2,lim=SH.hs?1.2e6:SH.shade?8e4:2.5e4;if(fx>lim){s.hull-=hullMax()*Math.min(.5,.02*(fx/lim-1))*h;
  if(!s.hotWarn||T-s.hotWarn>3600){s.hotWarn=T;alertCrit('🔥 Sunlight here is '+f1(fx/1e3,0)+' kW/m²: more than your ship can take ('+f1(lim/1e3,0)+' kW/m²). The hull is burning. Back away from the Sun, or build a sunshade or a heat shield.')}
  if(s.hull<=0&&c.alive){c.alive=false;gameOver('the heat of the Sun');return}}}
 const hotLo=Math.max(0,s.tLo-318)/10,hotHi=SH.radHiA?Math.max(0,s.tHi-SH.radHiT)/50:0,storm=R2.spe>1e-6?3:1;
 for(const q of s.parts){const d=PARTS[q.id];if(q.fail)continue;const wr=d.cat==='store'?.01:d.cat==='gen'||d.cat==='life'?.006:.002;q.cond=Math.max(0,q.cond-wr*dtg/2592000*(1+hotLo));
  if(Math.random()<h/(d.mtbf||MTBF[d.cat])*(1+4*(1-q.cond))*storm*(1+hotLo)){q.fail=true;alertCrit('🔧 '+d.n+' has FAILED. Repair it in 🛠 → 🔧 Ship (uses spare-parts kits).')}}
 const D=DR[di];if(s.burnAcc>0){const bh=s.burnAcc/3600;D.cond=Math.max(0,D.cond-bh/3000*(1+hotHi+hotLo));if(!D.fail&&Math.random()<bh/(D.id==='icf'?8e3:2e4)*(1+4*(1-D.cond))*storm){D.fail=true;alertCrit('🔧 The '+D.n+' has FAILED. Repair it in 🛠 → 🔧 Ship.')}s.burnAcc=0}
 let dh=0;if(c.o2ok===false)dh-=50*h;if(s.co2>.6)dh-=(s.co2-.6)*20*h;if(c.waterok===false)dh-=1.4*h;if(c.foodok===false)dh-=.15*h;if(s.tLo>318)dh-=(s.tLo-318)*.4*h;if(c.acute>1)dh-=(c.acute-1)*.8*h;
 if(dh===0)dh=.5*h;c.hp=Math.max(0,Math.min(100,c.hp+dh));
 if(c.hp<=0||c.acute>6){c.alive=false;gameOver(c.acute>6?'a lethal radiation dose ('+f1(c.acute,1)+' Sv)':c.o2ok===false?'running out of oxygen':s.co2>.6?'carbon dioxide poisoning':c.waterok===false?'dehydration':c.foodok===false?'starvation':'overheating');return}
 if(SH.rp&&s.en>0&&!s.shelter)s.rp+=SH.rp*h*(c.acute>1?.6:1);
 if(s.research){const t=TK2[s.research],use=Math.min(t.c-(s.rprog[t.id]||0),s.rp);s.rp-=use;s.rprog[t.id]=(s.rprog[t.id]||0)+use;if(s.rprog[t.id]>=t.c-1e-9){s.tech[t.id]=1;s.research=null;recalc();notify('🔬 Research complete: '+t.n+'. Build what it unlocks in 🛠 → 🏭 Fabricate.');s.codex.log.unshift(fT(T)+' · Researched '+t.n)}}
 checkDisc();alertsUpdate(R2)}
function checkDisc(){const r=sunDist(),S=B[0],g=gam(s),v=Math.hypot(s.vx/g-S.vx,s.vy/g-S.vy,s.vz/g-S.vz),rc=s.codex.rec;
 if(s.dom===S)disc('escape','Escaped Earth’s gravity',20,'');for(let k=9;k>=1;k--)if(r<k/10*AU)disc('r'+k,'Reached '+(k/10).toFixed(1)+' AU from the Sun',15,'Sunlight is '+f1((10/k)**2,1)+'× stronger here than at Earth');
 if(r>1.5*AU)disc('mars','Crossed Mars’s orbit',30,'');if(r>2.2*AU)disc('belt','Entered the main asteroid belt',60,'');
 [[5e4,'50 km/s'],[1e5,'100 km/s'],[1e6,'1,000 km/s'],[.01*C,'1% of light speed'],[.1*C,'10% of light speed'],[.5*C,'half light speed'],[.9*C,'90% of light speed']].forEach(([x,t],k)=>{if(v>x)disc('v'+k,'Speed record: '+t,30*(k+1),'')});
 [[1e3,'1 tonne'],[1e4,'10 tonnes'],[1e5,'100 tonnes'],[1e6,'1,000 tonnes']].forEach(([x,t],k)=>{if(s.mined>=x)disc('mi'+k,'Mined '+t,20*2**k,'')});
 AST.forEach(a=>{if(a.neo||astDist(a)<5e7){if(astDist(a)<1e4)disc('v_'+a.n,'Visited asteroid '+a.n+' ('+a.t+'-type)',10,'')}});
 rc.maxV=Math.max(rc.maxV,v);rc.minR=Math.min(rc.minR,r);rc.maxR=Math.max(rc.maxR,r);rc.mined=s.mined;rc.age=T}
const daysOf=(have,perDay)=>perDay>0?have/perDay:Infinity;
function lifeDays(){const ls=SH.ls,R=s.res,regen=ls===PARTS.ls_regen,bio=ls===PARTS.ls_bio,o2=regen||bio?Infinity:daysOf(R.oxygen,.84+s.leak*86400),wat=daysOf(R.water,bio?.05:regen?1.125:2.5)*(1),food=bio?Infinity:daysOf(R.food,1.6);
 return{o2:regen?daysOf(R.water,1.125):o2,wat,food}}
function alertsUpdate(R2){const A=[],L=lifeDays(),c=s.crew,dd=x=>x===Infinity?'∞':f1(x,1)+' days';
 if(!c.o2ok)A.push({l:'crit',t:'NO OXYGEN: crew suffocating'});else if(L.o2<7)A.push({l:L.o2<2?'crit':'warn',t:'Oxygen for '+dd(L.o2)});
 if(!c.waterok)A.push({l:'crit',t:'NO WATER'});else if(L.wat<5)A.push({l:'warn',t:'Water for '+dd(L.wat)});if(!c.foodok)A.push({l:'crit',t:'NO FOOD'});else if(L.food<7)A.push({l:'warn',t:'Food for '+dd(L.food)});
 if(s.co2>.6)A.push({l:'crit',t:'CO₂ toxic: life support has no power'});else if(s.co2>.2)A.push({l:'warn',t:'CO₂ rising'});
 if(s.leak)A.push({l:'crit',t:'Hull breach: losing oxygen'});if(s.tLo>318)A.push({l:'crit',t:'Cabin overheating: '+f1(s.tLo-273,0)+' °C'});else if(s.tLo>308)A.push({l:'warn',t:'Cabin warm: '+f1(s.tLo-273,0)+' °C'});
 if(SH.radHiA&&s.tHi>SH.radHiT)A.push({l:'crit',t:'High-temp loop over limit'});const fl=s.parts.filter(q=>q.fail).length+DR.filter(D=>isU(D.id)&&D.fail).length;if(fl)A.push({l:'crit',t:fl+' component'+(fl>1?'s':'')+' failed'});
 if(s.en<.05*SH.cap&&s.pFree<0)A.push({l:'warn',t:'Power deficit: battery nearly empty'});if(flare)A.push({l:T>=flare.t0?'crit':'warn',t:(T>=flare.t0?'SOLAR STORM: ':'Solar storm incoming: ')+f1(R2.tot*86400e3,0)+' mSv/day'+(s.shelter?' (sheltered)':'')});
 if(c.acute>.5)A.push({l:c.acute>1?'crit':'warn',t:'Radiation dose '+f1(c.acute,2)+' Sv (sickness above 1)'});if(c.hp<60)A.push({l:'crit',t:'Crew health '+Math.round(c.hp)+'%'});
 [['o2',L.o2,3],['food',L.food,5],['wat',L.wat,3]].forEach(([k,v,th])=>{if(v<th&&!warned[k]){warned[k]=1;alertCrit('⚠ Only '+dd(v)+' of '+(k==='o2'?'oxygen':k==='wat'?'water':'food')+' left. Order or make more in 🛠 → 🏭 Fabricate.')}if(v>th*2)warned[k]=0});ALERTS=A}
// ground contact (RULES): the main loop calls this when the ship is at or below a world's surface. Touching down
// slower than 10 m/s relative to the ground is a landing; anything faster is a crash that destroys the ship.
const LAND_V=10;
function groundContact(d){const g=gam(s),v=Math.hypot(s.vx/g-d.vx,s.vy/g-d.vy,s.vz/g-d.vz),r=Math.hypot(s.x-d.x,s.y-d.y,s.z-d.z)||1,k=d.R/r;
 s.x=d.x+(s.x-d.x)*k;s.y=d.y+(s.y-d.y)*k;s.z=d.z+(s.z-d.z)*k;s.vx=d.vx*g;s.vy=d.vy*g;s.vz=d.vz*g;
 if(v>LAND_V&&s.crew.alive){s.crew.alive=false;s.hull=0;try{if(typeof boom==='function')boom(s.x,s.y,s.z,1)}catch(e){}
  gameOver('a crash into '+d.n+' at '+(v>=1000?f1(v/1e3,2)+' km/s':f1(v,0)+' m/s'));return'crash'}
 s.msg='Landed on '+d.n;return'landed'}
function gameOver(why){if(MP.conn){mpSend({t:'chat',sys:1,text:MP.name+'’s crew was lost to '+why});setTimeout(()=>{s.crew.alive=true;respawn('Your crew was lost to '+why)},50);return}paused=true;$('gotxt').innerHTML='<span>'+tr('Your crew was lost to {}.'.replace('{}',why))+'</span><br><br><span>'+tr('Game time: '+fT(T))+'</span><br><span>'+tr('Closest to the Sun: '+fmtD(s.codex.rec.minR))+'</span><br><span>'+tr('Mined: '+f1(s.mined,0)+' kg')+'</span><br><span>'+tr('Technologies researched: '+Object.keys(s.tech).length)+'</span>';$('go').classList.remove('h')}
{const gb=$('gob');btn(gb,()=>'📂 Load autosave '+slotInfo('auto'),()=>loadGame('auto'),()=>!!slotInfo('auto'));['1','2','3'].forEach(k=>btn(gb,()=>'📂 Load slot '+k+' '+slotInfo(k),()=>loadGame(k),()=>!!slotInfo(k)));btn(gb,'🆕 New game',()=>location.reload())}
