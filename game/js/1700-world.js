// ===== WORLD: asteroids, drones, projectiles, weapons, mining =====
const OBJS=[];let FX=[],beamFx=null,mineRate=0,wMsg='';
function flyAst(a){const D=DR[di],M=mass(),dv=D.f&&s.prop>0?D.ve*Math.log(M/(M-s.prop)):2000,esc=s.dom!==B[0]?escDv(elements(),di,PW,M):0;AP={ast:a,name:a.n+' ('+a.t+'-type asteroid)',stage:'',vcap:Math.max(150,Math.min(3e4,.3*(dv-esc)))};PJ=null;WT={kind:'ast',a};PRED=null;
 notify(`🧭 Autopilot → ${a.n}, ${fmtD(astDist(a))} away. It escapes ${s.dom!==B[0]?s.dom.n+' first, then':''} matches the asteroid’s orbit and parks 1.5 km away. Cruise speed limited to ${f1(AP.vcap/1e3,1)} km/s to save fuel. Watch the projected path (cyan) and the arrival time (bottom-left).`)}
function astNeed(){if(!AP||!AP.ast)return 0;const D=DR[di];if(!D.f)return 0;const M=mass(),esc=s.dom!==B[0]?escDv(elements(),di,PW,M):0,req=1.35*(esc+2*Math.max(AP.vcap||0,1500)),dry=M-s.prop;return Math.max(0,dry*(Math.exp(req/D.ve)-1)-s.prop)}
const tripExtra=()=>!AP?0:AP.ast?astNeed():trip(AP.r).extra;
function targets(){const L=[];if(RS&&RS.alive&&!RS.stale){const d=Math.hypot(RS.x-s.x,RS.y-s.y,RS.z-s.z);if(d<2e6)L.push({kind:'pl',o:RS,d})}OBJS.forEach(o=>{if((o.kind==='drone'||o.hostile)&&o.alive)L.push({kind:'drone',o,d:Math.hypot(o.x-s.x,o.y-s.y,o.z-s.z)})});AST.forEach(a=>{const d=astDist(a);if(d<2e6)L.push({kind:'ast',a,d})});return L.sort((x,y)=>x.d-y.d)}
const sameT=(x,y)=>x&&y&&x.kind===y.kind&&(x.kind==='ast'?x.a===y.a:x.o===y.o);
function cycleT(){const L=targets();if(!L.length){WT=null;notify('🎯 Nothing within 2,000 km to target. Fly to an asteroid (🧭 NAVIGATE → Asteroids), launch practice drones (🛠 → 🔫 Weapons), or press '+KN(BIND.raid)+' to call in raiders.');return}const k=L.findIndex(t=>sameT(t,WT));WT=L[(k+1)%L.length]}
function cycleW(){for(let k=1;k<=WEP.length;k++){const j=(WI+k)%WEP.length;if(isU(WEP[j].id)){WI=j;return}}}
function tState(t){if(t.kind==='me'){const g=gam(s);return{x:s.x,y:s.y,z:s.z,vx:s.vx/g,vy:s.vy/g,vz:s.vz/g,r:Math.min(shipR,15)}}if(t.kind==='ast')return astState(t.a);const o=t.o;return{x:o.x,y:o.y,z:o.z,vx:o.vx,vy:o.vy,vz:o.vz,r:o.r}}
const tName=t=>t.kind==='pl'?'👤 '+t.o.name+'’s ship':tName0(t),tName0=t=>t.kind==='ast'?t.a.n+' ('+t.a.t+'-type)':t.o.raider?'raider '+t.o.name:t.o.hostile?'⚠ incoming missile':'practice drone';
function wTxt(){const w=WEP[WI];let h=`${w.n}${isU(w.id)?'':' 🔒 not built'}${w.id==='mlaser'?' · '+sci(PML)+' W':''}${w.id==='missile'?' · '+s.ammo.missile+' missiles':''}${w.id==='rail'?' · iron '+f1(s.res.iron,0)+' kg':''}`;
 if(!WT)return h+' · no target ('+KN(BIND.target)+' to pick one)';const T2=tState(WT),d=Math.hypot(T2.x-s.x,T2.y-s.y,T2.z-s.z)-T2.r;
 h+=` · 🎯 ${tName(WT)} · ${fmtD(Math.max(0,d))}`+(WT.kind==='ast'?(d<1e4?' · ✓ in collection range':' · get within 10 km to collect material'):` · ${WT.kind==='pl'?'hull '+Math.round(100*WT.o.hull/WT.o.hullMax)+'%':''}${WT.kind==='pl'?'':' armour '}${WT.kind==='pl'?'':Math.max(0,100*WT.o.hp/(WT.o.hpMax||2e7)).toFixed(0)+'%'}`);
 if(WT.kind!=='ast'&&(w.id==='plaser'||w.id==='pbeam'))h+=' · laser delivers '+Math.round(100*fall(Math.max(0,d),w.id==='plaser'?5e4:1e5))+'% at this range';
 if(mineRate>0)h+=` · collecting ${f1(mineRate*3600,1)} kg/hour`;return h}
// deliver energy to a target; asteroids release material (≈2 MJ/kg by laser, 0.5 MJ/kg by impact), collected only within 10 km
function hit(t,E,kind,dTo){if(t.kind==='pl'){mpSend({t:'hit',E,kind,from:MP.name});MP.dealt+=E;return 0}if(t.kind==='me'){takeHit(E,kind,null);return 0}
 if(t.kind==='drone'){const o=t.o;if(!o.alive)return 0;o.hp-=E;const kill=o.hp<=0;dmgPop(o,E,kill);if(kill){o.alive=false;boom(o.x,o.y,o.z,o.kind==='missile'?20:45);rmObj(o);if(sameT(WT,t))WT=null;
  if(o.kind==='missile'){notify('🛡 Incoming missile destroyed'+(o.from?' (fired by '+o.from+')':''));return 0}
  const near=dTo<5e4;if(near){s.res.iron+=40;s.res.nickel+=5;s.res.silicates+=10;s.res.platinum+=.2}if(o.raider)s.raid.kills++;
  notify('💥 '+(o.raider?'Raider '+o.name:'Drone')+' destroyed'+(near?': salvaged 40 kg iron, 5 kg nickel, 10 kg silicates, 0.2 kg platinum metals':' (too far away to salvage)')+(o.raider&&CB.on?' · '+CB.raiders.filter(q=>q.alive).length+' left':''));
  if(CB.on&&!WT)autoT()}return 0}
 const a=t.a,m=E/(kind==='kinetic'?5e5:2e6),col=dTo<1e4?m*(kind==='kinetic'?.25:.8):0;a.mined+=m;if(col>0){const c=COMP[a.t];for(const k of RES){s.res[k]+=col*c[k];if(c[k]>0)disc('m_'+k,'First '+RN[k]+' collected',10,MINFO[k])}s.mined+=col;disc('ty_'+a.t,'First '+a.t+'-type asteroid mined',40,TYN[a.t])}return col}
function fireDown(){initAudio();if(!WT||(CB.on&&WT.kind==='ast'))autoT();const w=WEP[WI];if(!isU(w.id)){notify('🔒 '+w.n+' is not built yet. Build it in 🛠 ENGINEERING → 🔬 Build.');return}
 if(w.hold){fireHeld=true;return}const now=performance.now();if(now-lastShot<150)return;lastShot=now;
 {const need=w.id==='plaser'?1e7:w.id==='rail'?1.28e8:0,cE=need/Math.max(1,SH.pmax),cA=w.id==='rail'&&SH.lay?SH.lay.flip/2:0,cool=Math.max(cE,cA);if(need&&T-lastShotT<cool){notify(cA>cE?'🎯 Re-aiming the whole ship for the railgun: '+dur(cool-(T-lastShotT))+'. A compact ship turns faster (🧱 Builder, key 7).':'⚡ Recharging: '+dur(cool-(T-lastShotT))+' of game time. Supercapacitors deliver power faster.');return}if(need)lastShotT=T}
 const g=gam(s),sv=[s.vx/g,s.vy/g,s.vz/g];let aim,T2=null;
 if(WT){T2=tState(WT);aim=[T2.x-s.x,T2.y-s.y,T2.z-s.z]}else if(FP)aim=dirAE();else{const d=s.dom,v=[sv[0]-d.vx,sv[1]-d.vy,sv[2]-d.vz];aim=v}
 const al=Math.hypot(...aim)||1;let u=aim.map(x=>x/al);
 if(w.id==='plaser'){if(s.en<1e7){notify('⚠ Battery too low for a pulse (needs 10 MJ)');return}s.en-=1e7;cbShot('plaser');if(WT&&al-T2.r<=w.range)hit(WT,5e6*fall(al-T2.r,5e4),'laser',al-T2.r);
  beamFx=WT?{tx:T2.x,ty:T2.y,tz:T2.z,col:0xff3344,until:now+140}:{u,col:0xff3344,until:now+140};return}
 if(w.id==='rail'){if(s.en<1.28e8||s.res.iron<2){notify('⚠ The railgun needs 128 MJ of energy and 2 kg of iron per shot');return}s.en-=1.28e8;s.res.iron-=2;
  if(WT){const rv=[T2.vx-sv[0],T2.vy-sv[1],T2.vz-sv[2]],t=intercept(aim,rv,8000);if(t>0){const p=[aim[0]+rv[0]*t,aim[1]+rv[1]*t,aim[2]+rv[2]*t],pl=Math.hypot(...p);u=p.map(x=>x/pl)}}
  cbShot('rail');spawnObj({kind:'slug',m:2,tgt:WT,r:.2},u,8000);const k=-2*8000/mass()*g;s.vx+=u[0]*k;s.vy+=u[1]*k;s.vz+=u[2]*k;return}
 if(w.id==='missile'){if(s.ammo.missile<1){notify('⚠ No missiles left. Build more in 🛠 → 🔫 Weapons.');return}s.ammo.missile--;cbShot('missile');spawnObj({kind:'missile',dry:25,fuel:25,tgt:WT,r:.3},u,50)}}
function intercept(p,v,sp){const a=v[0]*v[0]+v[1]*v[1]+v[2]*v[2]-sp*sp,b=2*(p[0]*v[0]+p[1]*v[1]+p[2]*v[2]),c=p[0]*p[0]+p[1]*p[1]+p[2]*p[2],D=b*b-4*a*c;if(D<0||Math.abs(a)<1e-9)return 0;
 const t1=(-b-Math.sqrt(D))/(2*a),t2=(-b+Math.sqrt(D))/(2*a),ts=[t1,t2].filter(t=>t>0);return ts.length?Math.min(...ts):0}
function spawnObj(o,u,sp){const g=gam(s);Object.assign(o,{x:s.x+u[0]*15,y:s.y+u[1]*15,z:s.z+u[2]*15,vx:s.vx/g+u[0]*sp,vy:s.vy/g+u[1]*sp,vz:s.vz/g+u[2]*sp,ax:0,ay:0,az:0,GM:0,age:0});OBJS.push(o);ALL.push(o);return o}
function rmObj(o){if(o.alive)o.alive=false;let k=OBJS.indexOf(o);if(k>=0)OBJS.splice(k,1);k=ALL.indexOf(o);if(k>=0)ALL.splice(k,1)}
function spawnDrones(){const g=gam(s);for(let k=0;k<3;k++){const th=Math.random()*6.283,ph=(Math.random()-.5)*1.2,d=2e4+Math.random()*6e4;
 const o={kind:'drone',hp:2e7,hpMax:2e7,alive:true,r:4,x:s.x+d*Math.cos(ph)*Math.cos(th),y:s.y+d*Math.cos(ph)*Math.sin(th),z:s.z+d*Math.sin(ph),vx:s.vx/g+(Math.random()-.5)*6,vy:s.vy/g+(Math.random()-.5)*6,vz:s.vz/g+(Math.random()-.5)*6,ax:0,ay:0,az:0,GM:0,age:0};OBJS.push(o);ALL.push(o)}
 notify('🎯 3 practice drones launched 20–80 km away. Press '+KN(BIND.target)+' to target one, pick a weapon ('+KN(BIND.weapon)+'), then fire ('+KN(BIND.fire)+').')}
function boom(x,y,z,size){cbBoom(x,y,z,size);const sp=glow('#ffb347',1);sp.material.transparent=true;SS.add(sp);FX.push({x,y,z,size,sp,t0:performance.now()})}
function worldTick(dtg,now){if(PJ)predRun(6);mineRate=0;s.wHeat=0;CB.firing=false;if(beamFx&&beamFx.until<now)beamFx=null;
 if(WT&&WT.kind==='drone'&&!WT.o.alive)WT=null;if(WT&&WT.kind==='ast'&&astDist(WT.a)>2e6)WT=null;if(!WT&&AP&&AP.ast&&!AP.pl&&astDist(AP.ast)<2e6)WT={kind:'ast',a:AP.ast};
 const w=WEP[WI];
 if(fireHeld&&w.hold&&isU(w.id)&&dtg>0){const P=w.id==='mlaser'?PML:5e7,eff=w.id==='mlaser'?.5:.4,use=Math.min(P*dtg,Math.max(0,s.roomX+s.wHeat)/(1-eff)*dtg,Math.max(0,s.en+Math.max(0,s.pFree)*dtg)),col=w.id==='mlaser'?0x44ff66:0xb36bff;s.en=Math.max(0,s.en-use);if(use>0)CB.firing=true;s.wHeat=dtg>0?use/dtg*(1-eff):0;
  if(use<=0)wMsg='⚠ battery empty';else if(WT){const T2=tState(WT),ds=Math.hypot(T2.x-s.x,T2.y-s.y,T2.z-s.z)-T2.r;
   if(ds<=w.range){mineRate=hit(WT,use*eff*(w.id==='pbeam'?fall(ds,1e5):1),w.id==='mlaser'?'laser':'beam',ds)/dtg;beamFx={tx:T2.x,ty:T2.y,tz:T2.z,col,until:now+80}}else wMsg='⚠ target out of range'}
  else{const q=FP?dirAE():[1,0,0];beamFx={u:q,col,until:now+80}}}
 for(const o of OBJS.slice()){if(o.kind==='drone')continue;o.age+=dtg;if(!o.tl||now-o.tl>50){o.tl=now;(o.trail=o.trail||[]).push([o.x-s.x,o.y-s.y,o.z-s.z]);if(o.trail.length>26)o.trail.shift()}
  if(o.kind==='missile'&&o.tgt&&o.fuel>0&&dtg>0){const T2=tState(o.tgt),px=T2.x-o.x,py=T2.y-o.y,pz=T2.z-o.z,pd=Math.hypot(px,py,pz)||1,vx=o.vx-T2.vx,vy=o.vy-T2.vy,vz=o.vz-T2.vz,want=Math.max(Math.hypot(vx,vy,vz)+300,600),
    dx=px/pd*want-vx,dy=py/pd*want-vy,dz=pz/pd*want-vz,dl=Math.hypot(dx,dy,dz)||1,dvm=Math.min(dl,(o.acc||50)*dtg),used=(o.dry+o.fuel)*(1-Math.exp(-dvm/4413)),k=Math.min(1,o.fuel/Math.max(1e-9,used)),dv2=dvm*k;
   o.vx+=dx/dl*dv2;o.vy+=dy/dl*dv2;o.vz+=dz/dl*dv2;o.fuel=Math.max(0,o.fuel-used*k)}
  if(o.tgt&&tAlive(o.tgt)){const T2=tState(o.tgt),rx=o.x-T2.x,ry=o.y-T2.y,rz=o.z-T2.z,R2=T2.r+(o.kind==='missile'?50:5);
   if(o.prel){const ax=o.prel[0],ay=o.prel[1],az=o.prel[2],bx=rx-ax,by=ry-ay,bz=rz-az,bb=bx*bx+by*by+bz*bz,tt=bb>0?Math.max(0,Math.min(1,-(ax*bx+ay*by+az*bz)/bb)):0;
    if(Math.hypot(ax+bx*tt,ay+by*tt,az+bz*tt)<R2){const vr2=(o.vx-T2.vx)**2+(o.vy-T2.vy)**2+(o.vz-T2.vz)**2,Ek=.5*(o.kind==='missile'?o.dry+o.fuel:2)*vr2+(o.kind==='missile'?(o.wh||2e7):0),dTo=Math.hypot(T2.x-s.x,T2.y-s.y,T2.z-s.z)-T2.r,
      cl=hit(o.tgt,Ek,'kinetic',dTo);boom(T2.x+ax+bx*tt,T2.y+ay+by*tt,T2.z+az+bz*tt,o.kind==='missile'?60:20);
     if(o.tgt.kind==='ast')notify(`💥 ${o.kind==='missile'?'Missile':'Railgun slug'} hit ${o.tgt.a.n} with ${sci(Ek)} J${cl>0?': collected '+f1(cl,0)+' kg of fragments':' (get within 10 km to collect the fragments)'}`);rmObj(o);continue}}
   o.prel=[rx,ry,rz]}
  if(o.age>2e5)rmObj(o)}raidTick(dtg,now)}
