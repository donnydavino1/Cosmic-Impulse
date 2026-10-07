// ===== COMBAT: number-key weapons, raider waves, weapon effects you can see at any zoom =====
// Raiders are unmanned drones with real limits: 12 m/s² thrusters, pulse lasers whose delivered energy falls off with
// the square of distance beyond their focus range (diffraction: the spot grows with distance), and, from wave 2, small
// kinetic missiles that you can shoot down. Your own pulse laser and particle beam obey the same falloff.
const fall=(d,ref)=>Math.min(1,(ref/Math.max(d,1))**2);
const CB={on:false,wave:0,raiders:[],prevWi:null,beams:[],booms:[],pops:[],hm:null,hurt:0,muzzle:0,deploy:0,lowNote:false,timeNote:false,hum:null,firing:false,banner:null};
const RNAMES=['Kestrel','Jackal','Viper','Magpie','Hornet','Shrike','Cinder','Wraith','Talon','Rook','Corsair','Mantis'];
if(!s.raid)s.raid={wave:1,best:0,kills:0};
const tAlive=t=>t.kind==='ast'?true:t.kind==='me'?s.crew.alive:!!(t.o&&t.o.alive!==false);
// nearest hostile (raider, practice drone or incoming missile)
function autoT(){const L=targets().filter(t=>t.kind==='drone');if(L.length){WT=L[0];return true}return false}
function wKey(i){initAudio();const w=WEP[i];if(!isU(w.id)){sfx('lock');notify('🔒 '+w.n+' is not built yet. Research it and build it in 🛠 ENGINEERING → 🔬 Build.');return}
 if(WI!==i){WI=i;CB.deploy=performance.now()}fireDown()}
function cbShot(id){const now=performance.now();CB.muzzle=now;CB.deploy=now;sfx(id==='plaser'?'laser':id==='rail'?'rail':'missile')}
// ----- sound effects (Web Audio, generated; no files)
function sfx(k){if(!AC)return;const t=AC.currentTime+.01;try{
 if(k==='laser'||k==='elaser'){const o=AC.createOscillator(),g=AC.createGain(),e=k==='elaser';o.type='sawtooth';o.frequency.setValueAtTime(e?2400:1700,t);o.frequency.exponentialRampToValueAtTime(e?520:200,t+.22);
  g.gain.setValueAtTime(e?.05:.12,t);g.gain.exponentialRampToValueAtTime(.001,t+.26);o.connect(g);g.connect(MG);o.start(t);o.stop(t+.3)}
 else if(k==='rail'){kick(t);noise(t,.25,.35,2500);tone(65,t,.5,{type:'square',v:.1,a:.005,r:.4,cut:300})}
 else if(k==='missile')noise(t,.9,.22,700,'bandpass');
 else if(k==='boom'){kick(t);noise(t,1.3,.45,600,'lowpass')}
 else if(k==='hurt'){noise(t,.35,.45,900,'lowpass');tone(110,t,.3,{type:'square',v:.1,a:.002,r:.25,cut:500,send:0})}
 else if(k==='alarm')[0,.22,.44,.66].forEach((d,i)=>tone(i%2?660:880,t+d,.18,{type:'square',v:.06,a:.005,r:.1,send:0}));
 else if(k==='lock')tone(180,t,.15,{type:'square',v:.08,a:.005,r:.1,send:0});
 else if(k==='warn'){tone(1250,t,.12,{type:'square',v:.06,a:.003,r:.08,send:0});tone(1250,t+.18,.12,{type:'square',v:.06,a:.003,r:.08,send:0})}
 else if(k==='win')[523,659,784,1047].forEach((f,i)=>tone(f,t+i*.12,.5,{type:'triangle',v:.09,a:.01,r:.4,send:.5}));
}catch(e){}}
function humSet(on,hi){if(!AC)return;try{if(on&&!CB.hum){const o=AC.createOscillator(),o2=AC.createOscillator(),g=AC.createGain();o.type='sawtooth';o2.type='square';o.frequency.value=hi?170:118;o2.frequency.value=hi?173.5:120;
  g.gain.value=.0001;g.gain.setTargetAtTime(.045,AC.currentTime,.04);o.connect(g);o2.connect(g);g.connect(MG);o.start();o2.start();CB.hum={o,o2,g}}
 else if(!on&&CB.hum){const h=CB.hum;CB.hum=null;h.g.gain.setTargetAtTime(.0001,AC.currentTime,.04);setTimeout(()=>{try{h.o.stop();h.o2.stop()}catch(e){}},300)}}catch(e){}}
// ----- damage numbers, hit markers, explosions (stored relative to your ship, so they stay put while you orbit)
function dmgPop(o,E,kill){const now=performance.now();CB.hm={t0:now,o,kill};o.pd=(o.pd||0)+E;
 if(kill||now-(o.pt||0)>280){CB.pops.push({x:o.x-s.x,y:o.y-s.y,z:o.z-s.z,t0:now,txt:kill?(o.kind==='missile'?'INTERCEPTED':'DESTROYED'):'−'+Math.max(1,Math.round(100*o.pd/(o.hpMax||2e7)))+'%',col:kill?'#ffd27a':'#ffffff'});o.pd=0;o.pt=now}}
function cbBoom(x,y,z,size){const sp=[];for(let k=0;k<16;k++){const a=Math.random()*6.283,r=.3+Math.random()*.7;sp.push([Math.cos(a)*r,Math.sin(a)*r,Math.random()])}
 CB.booms.push({x:x-s.x,y:y-s.y,z:z-s.z,t0:performance.now(),px:Math.max(14,size*.7),sp});if(size>=20)sfx('boom')}
// ----- taking damage from raiders (the same rules as a hit from another player)
function takeHit(E,kind,src){if(!s.crew.alive)return;const now=performance.now();s.hull-=E;CB.hurt=now;sfx('hurt');
 boom(s.x+(Math.random()-.5)*20,s.y+(Math.random()-.5)*20,s.z+(Math.random()-.5)*20,kind==='kinetic'?40:12);
 if(Math.random()<E/2e8){const q=s.parts[Math.random()*s.parts.length|0];if(q)q.cond=Math.max(0,q.cond-.1)}if(kind==='kinetic'&&Math.random()<.3&&!s.leak)s.leak=1.4e-4;
 const hp=s.hull/hullMax();if(hp<.3&&!CB.lowNote&&s.hull>0){CB.lowNote=true;sfx('alarm');notify('🚨 Hull at '+Math.round(hp*100)+'%! Raiders give up if you get more than 400 km away: burn hard away from them, or finish them fast.')}
 if(s.hull<=0){raidEnd('lost');destroyed(src&&src.raider?'raider '+src.name:'raiders')}}
// ----- raider waves
function raidStart(){initAudio();if(MP.conn){notify('⚔ Raider waves are single-player for now: disconnect from multiplayer to fight them.');return}
 if(!s.crew.alive)return;if(CB.on){notify('⚔ Wave '+CB.wave+' is already attacking!');return}
 const w=s.raid.wave,n=Math.min(2+w,7),g=gam(s);CB.on=true;CB.wave=w;CB.raiders=[];CB.lowNote=false;CB.timeNote=false;
 for(let k=0;k<n;k++){const th=Math.random()*6.283,ph=(Math.random()-.5)*1.4,d=2.5e4+Math.random()*2e4,ax=[Math.random()-.5,Math.random()-.5,Math.random()-.5],al=Math.hypot(...ax)||1;
  const o={kind:'drone',raider:true,name:RNAMES[(k+w*5)%RNAMES.length],hp:1.5e7*(1+.25*(w-1)),alive:true,r:5,
   x:s.x+d*Math.cos(ph)*Math.cos(th),y:s.y+d*Math.cos(ph)*Math.sin(th),z:s.z+d*Math.sin(ph),vx:s.vx/g,vy:s.vy/g,vz:s.vz/g,ax:0,ay:0,az:0,GM:0,age:0,
   acc:12,stand:6e3+Math.random()*6e3,range:6e4,dmg:1.2e6*(1+.2*(w-1)),cd:5+Math.random()*6,mis:w>=4?2:w>=2?1:0,mcd:8+Math.random()*20,axis:ax.map(x=>x/al),spin:Math.random()<.5?1:-1,burn:0};
  o.hpMax=o.hp;OBJS.push(o);ALL.push(o);CB.raiders.push(o)}
 CB.prevWi=null;if(wi>1){CB.prevWi=wi;wi=1}paused=false;if(!FP&&!SV)fi=0;
 autoT();CB.deploy=performance.now();sfx('warn');CB.banner={t0:performance.now(),txt:'WAVE '+w+' INBOUND'};
 notify(`⚔ WAVE ${w}: ${n} raider drones closing in from 25–45 km${w>=2?', armed with missiles':''}. Time is slowed to ×10. Fire with 1 mining laser · 2 pulse laser · 3 particle beam · 4 railgun · 5 missiles (${s.ammo.missile} left); ${KN(BIND.target)} switches target. Lasers lose power with distance, so they hit hardest inside 50 km. If the raiders win, you lose your ship.`)}
function launchEnemyMissile(o){const px=s.x-o.x,py=s.y-o.y,pz=s.z-o.z,d=Math.hypot(px,py,pz)||1,u=[px/d,py/d,pz/d];
 const m={kind:'missile',hostile:true,alive:true,hp:3e5,hpMax:3e5,dry:16,fuel:2.5,acc:20,wh:6e6,tgt:{kind:'me'},r:.4,from:o.name,
  x:o.x+u[0]*12,y:o.y+u[1]*12,z:o.z+u[2]*12,vx:o.vx+u[0]*60,vy:o.vy+u[1]*60,vz:o.vz+u[2]*60,ax:0,ay:0,az:0,GM:0,age:0};
 OBJS.push(m);ALL.push(m);sfx('missile');sfx('warn');
 notify('🚀⚠ '+o.name+' fired a missile at you from '+fmtD(d)+'. Target it ('+KN(BIND.target)+') and shoot it down with the pulse laser (2), or out-burn it.')}
function raidTick(dtg,now){
 if(!CB.on){const hm=hullMax();if(s.hull<hm&&s.res.spares>0&&s.crew.alive&&dtg>0){const rep=Math.min(hm-s.hull,hm*.02/3600*dtg);s.hull+=rep;s.res.spares=Math.max(0,s.res.spares-rep/(hm*.25))}return}
 if(!MP.conn&&wi>1){wi=1;if(!CB.timeNote){CB.timeNote=true;notify('⏱ Time is held at ×10 while raiders are attacking.')}}
 const g=gam(s),sv=[s.vx/g,s.vy/g,s.vz/g];let alive=0,far=0;
 for(const o of CB.raiders){if(!o.alive)continue;alive++;const px=o.x-s.x,py=o.y-s.y,pz=o.z-s.z,d=Math.hypot(px,py,pz)||1;if(d>4e5)far++;
  if(dtg>0){const ux=px/d,uy=py/d,uz=pz/d,vrx=o.vx-sv[0],vry=o.vy-sv[1],vrz=o.vz-sv[2],
    vt=d>o.stand?-Math.min(700,Math.sqrt(2*o.acc*.6*(d-o.stand))):Math.min(60,(o.stand-d)*.05), // close in, braking in time; back off if too close
    tx=o.axis[1]*uz-o.axis[2]*uy,ty=o.axis[2]*ux-o.axis[0]*uz,tz=o.axis[0]*uy-o.axis[1]*ux,tl=Math.hypot(tx,ty,tz)||1,vc=o.spin*90/tl, // circle you at ~90 m/s
    dx=ux*vt+tx*vc-vrx,dy=uy*vt+ty*vc-vry,dz=uz*vt+tz*vc-vrz,dl=Math.hypot(dx,dy,dz)||1,dv=Math.min(dl,o.acc*dtg);
   o.vx+=dx/dl*dv;o.vy+=dy/dl*dv;o.vz+=dz/dl*dv;o.burn=dv/(o.acc*dtg)}
  o.cd-=dtg;if(o.cd<=0&&d<o.range&&s.crew.alive){o.cd=6+Math.random()*5;sfx('elaser');
   // a quiet ship (passive sensing, engine off) is hard to lock onto
   const quiet=s.passive&&!(s.burn>0);if(Math.random()<(.85-.45*d/o.range)*(quiet?.55:1)){CB.beams.push({o,hit:true,until:now+170});takeHit(o.dmg*fall(d,2.5e4),'laser',o);if(!CB.on)return}
   else CB.beams.push({o,hit:false,off:[(Math.random()-.5)*600,(Math.random()-.5)*600,(Math.random()-.5)*600],until:now+170})}
  o.mcd-=dtg;if(o.mis>0&&o.mcd<=0&&d>8e3&&d<1.5e5){o.mis--;o.mcd=25+Math.random()*20;launchEnemyMissile(o)}}
 for(const m of OBJS.slice())if(m.hostile&&m.fuel<=0&&Math.hypot(m.x-s.x,m.y-s.y,m.z-s.z)>2e5)rmObj(m); // spent missiles that missed
 if(alive===0)raidEnd('won');else if(far===alive)raidEnd('escaped')}
function raidEnd(why){if(!CB.on)return;CB.on=false;const w=CB.wave;
 for(const o of CB.raiders)if(o.alive)rmObj(o);for(const m of OBJS.slice())if(m.hostile)rmObj(m);CB.raiders=[];
 if(WT&&WT.kind==='drone'&&!WT.o.alive)WT=null;if(CB.prevWi!=null&&!MP.conn)wi=CB.prevWi;CB.prevWi=null;
 if(why==='won'){s.raid.best=Math.max(s.raid.best,w);s.raid.wave=w+1;const mis=2+(w>>1),pt=.3*w;s.ammo.missile+=mis;s.res.platinum+=pt;sfx('win');
  CB.banner={t0:performance.now(),txt:'WAVE '+w+' CLEARED'};
  notify(`🏆 Wave ${w} destroyed! Bounty: ${mis} missiles and ${f1(pt,1)} kg of platinum-group metals. Press ${KN(BIND.raid)} when you're ready for wave ${w+1} (${Math.min(3+w,7)} raiders, tougher, ${w+1>=4?'2 missiles each':'with missiles'}). Between fights your crew repairs the hull, using spare-parts kits.`);
  if(w===1)disc('raid1','Beat your first raider wave',15,'A laser’s spot grows with distance, so the energy it delivers falls with the square of range: 5 MJ at 50 km is about 1.3 MJ at 100 km');
  if(w===5)disc('raid5','Beat raider wave 5',40,'')}
 else if(why==='escaped')notify('🏃 You got more than 400 km away and the raiders broke off. Wave '+w+' will be waiting (press '+KN(BIND.raid)+').')}
// ----- weapon turrets on the ship model: they pop out when armed and track the target
let TUR=[];const TV2=new THREE.Vector3();
function buildTurrets(rad){TUR=[];const dark=new THREE.MeshStandardMaterial({color:'#30364d',roughness:.5,metalness:.7,flatShading:true}),mounts=[[1.4,0,1],[1.4,0,-1],[-1.2,1,0],[-1.2,-1,0],[-.2,.7,.7]];
 WEP.forEach((w,i)=>{if(!isU(w.id))return;const mt=mounts[i],n=Math.hypot(mt[1],mt[2])||1,base=new THREE.Group(),col=['#44ff66','#ff3344','#b36bff','#9fd8ff','#ffb347'][i],L=[2,2.6,3,4.6,1.8][i],rb=[.18,.24,.36,.16,.2][i];
  base.position.set(mt[0],mt[1]/n*(rad+.1),mt[2]/n*(rad+.1));base.userData.mount='weapon:'+w.id;base.add(new THREE.Mesh(new THREE.SphereGeometry(.9,12,8),dark));const piv=new THREE.Group();base.add(piv);
  if(w.id==='missile'){const pod=part(new THREE.BoxGeometry(1.5,1.5,L),dark,col);pod.position.z=L/2;piv.add(pod)}
  else{const geo=new THREE.CylinderGeometry(rb,rb*1.4,L,8);geo.rotateX(Math.PI/2);geo.translate(0,0,L/2);if(w.id==='rail'){[.24,-.24].forEach(x=>{const b=part(geo,dark,col);b.position.x=x;piv.add(b)})}else piv.add(part(geo,dark,col))}
  const mz=glow(col,3.5);mz.material.opacity=0;mz.position.z=L+.3;piv.add(mz);shipG.add(base);TUR.push({i,piv,mz,L,ext:.12})})}
function turretTick(){if(!TUR.length)return;const now=performance.now();shipG.updateMatrixWorld(true);let tp=null;if(WT){const T2=tState(WT);tp=[T2.x-s.x,T2.y-s.y,T2.z-s.z]}
 for(const t of TUR){const want=t.i===WI&&(CB.on||fireHeld||now-CB.deploy<15000)?1:.12;t.ext+=(want-t.ext)*.12;t.piv.scale.set(1,1,Math.max(.05,t.ext));
  if(tp&&t.ext>.3){TV2.set(tp[0],tp[1],tp[2]);t.piv.lookAt(TV2)}
  const fl=t.i===WI&&(now-CB.muzzle<120||CB.firing);t.mz.material.opacity=fl?.7+.3*Math.random():0}}
function mkRaider(){const g2=new THREE.Group(),M=new THREE.MeshStandardMaterial({color:'#2a1418',emissive:'#ff2233',emissiveIntensity:.35,metalness:.6,roughness:.4,flatShading:true}),
 b=new THREE.Mesh(new THREE.ConeGeometry(2.2,9,5),M);b.rotation.x=Math.PI/2;g2.add(b);[1,-1].forEach(sg=>{const f=new THREE.Mesh(new THREE.BoxGeometry(5,.3,4),M);f.position.set(sg*2.6,0,-2.2);g2.add(f)});g2.add(glow('#ff3344',16));return g2}
// ----- 2D effects layer drawn over the 3D view: beams, tracers, explosions, markers, target brackets, damage feedback
const cfx=document.createElement('canvas');cfx.id='cfx';cfx.style.cssText='position:absolute;inset:0;pointer-events:none;z-index:0;touch-action:none';R.domElement.after(cfx);
const CX=cfx.getContext&&cfx.getContext('2d'),PV=new THREE.Vector3();let cfxW=innerWidth,cfxH=innerHeight;
function scr(x,y,z,CL){if(CL)PV.set(x-s.x,y-s.y,z-s.z).project(SC);else{const fp=FOC[fi];PV.set((x-fp.x)/U,(y-fp.y)/U,(z-fp.z)/U).project(cam)}
 const beh=PV.z>1;let X=PV.x,Y=PV.y;if(beh){X=-X;Y=-Y}return{x:(X+1)/2*cfxW,y:(1-Y)/2*cfxH,beh,on:!beh&&Math.abs(X)<1&&Math.abs(Y)<1}}
const hexc=n=>'#'+(n>>>0).toString(16).padStart(6,'0');
function beamLine(c,a,b,col,w){const fl=.75+.25*Math.random();c.lineCap='round';c.strokeStyle=col;c.globalAlpha=.25*fl;c.lineWidth=w*3.2;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();
 c.globalAlpha=.75*fl;c.lineWidth=w;c.stroke();c.strokeStyle='#ffffff';c.globalAlpha=.9;c.lineWidth=Math.max(1,w*.3);c.stroke();c.globalAlpha=1}
function edgeArrow(c,p,col,lab,W,H){const cx=W/2,cy=H/2,dx=p.x-cx,dy=p.y-cy,m=40,k=Math.max(Math.abs(dx)/(cx-m),Math.abs(dy)/(cy-m))||1,x=cx+dx/k,y=cy+dy/k,a=Math.atan2(dy,dx);
 c.save();c.translate(x,y);c.rotate(a);c.fillStyle=col;c.beginPath();c.moveTo(12,0);c.lineTo(-6,-8);c.lineTo(-6,8);c.closePath();c.fill();c.restore();
 c.fillStyle=col;c.textAlign=x>cx?'right':'left';c.fillText(lab,x+(x>cx?-16:16),y+(y>cy?-12:12));c.textAlign='left'}
function cfxDraw(CL,now){if(!CX)return;const dpr=Math.min(devicePixelRatio||1,2),W=innerWidth,H=innerHeight;cfxW=W;cfxH=H;
 if(cfx.width!==Math.round(W*dpr)||cfx.height!==Math.round(H*dpr)){cfx.width=Math.round(W*dpr);cfx.height=Math.round(H*dpr);cfx.style.width=W+'px';cfx.style.height=H+'px'}
 const c=CX;c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,W,H);
 R.domElement.style.transform=now-CB.hurt<260?`translate(${((Math.random()-.5)*12).toFixed(1)}px,${((Math.random()-.5)*12).toFixed(1)}px)`:'';
 humSet(CB.firing,WEP[WI].id==='pbeam');
 const me=FP?{x:W/2,y:H-150,on:true}:scr(s.x,s.y,s.z,CL),rel=(q,k)=>scr(s.x+q[0]*(k||1),s.y+q[1]*(k||1),s.z+q[2]*(k||1),CL);
 c.save();c.globalCompositeOperation='lighter';
 if(beamFx){const p=beamFx.u?rel(beamFx.u,5e5):scr(beamFx.tx,beamFx.ty,beamFx.tz,CL);if(!p.beh)beamLine(c,me,p,hexc(beamFx.col),WEP[WI].id==='pbeam'?7:4)}
 CB.beams=CB.beams.filter(b=>b.until>now);for(const b of CB.beams){const a=scr(b.o.x,b.o.y,b.o.z,CL);if(a.beh)continue;
  const t=b.hit?(FP?{x:W/2+(Math.random()-.5)*80,y:H/2+(Math.random()-.5)*80}:me):rel(b.off);if(!t.beh)beamLine(c,a,t,'#ff2a3a',3)}
 for(const o of OBJS){if(o.kind!=='slug'&&o.kind!=='missile')continue;const col=o.hostile?'255,70,70':o.kind==='slug'?'255,240,170':'255,180,80',tr=o.trail||[];let pr=null;
  c.lineWidth=o.kind==='slug'?2:3;for(let k=0;k<tr.length;k++){const p=rel(tr[k]);if(pr&&!p.beh&&!pr.beh){c.strokeStyle=`rgba(${col},${(.85*k/tr.length).toFixed(3)})`;c.beginPath();c.moveTo(pr.x,pr.y);c.lineTo(p.x,p.y);c.stroke()}pr=p}
  const h=scr(o.x,o.y,o.z,CL);if(!h.beh){const r=o.kind==='slug'?5:7,gr=c.createRadialGradient(h.x,h.y,0,h.x,h.y,r);gr.addColorStop(0,'#ffffff');gr.addColorStop(1,`rgba(${col},0)`);c.fillStyle=gr;c.beginPath();c.arc(h.x,h.y,r,0,7);c.fill()}}
 CB.booms=CB.booms.filter(f=>now-f.t0<900);for(const f of CB.booms){const p=rel([f.x,f.y,f.z]);if(p.beh)continue;const a=(now-f.t0)/900,r=f.px*(.35+a*1.5),gr=c.createRadialGradient(p.x,p.y,0,p.x,p.y,r);
  gr.addColorStop(0,`rgba(255,245,210,${(1-a).toFixed(3)})`);gr.addColorStop(.4,`rgba(255,150,60,${(.8*(1-a)).toFixed(3)})`);gr.addColorStop(1,'rgba(255,60,20,0)');c.fillStyle=gr;c.beginPath();c.arc(p.x,p.y,r,0,7);c.fill();
  c.strokeStyle=`rgba(255,200,120,${(.6*(1-a)).toFixed(3)})`;c.lineWidth=2;c.beginPath();c.arc(p.x,p.y,r*1.3,0,7);c.stroke();
  for(const q of f.sp){c.fillStyle=`rgba(255,${180+q[2]*70|0},90,${(1-a).toFixed(3)})`;c.fillRect(p.x+q[0]*r*1.7,p.y+q[1]*r*1.7,2.5,2.5)}}
 if(me.on&&(now-CB.muzzle<110||CB.firing)){const r=CB.firing?9+Math.random()*7:24,gr=c.createRadialGradient(me.x,me.y,0,me.x,me.y,r);gr.addColorStop(0,'rgba(255,255,255,.95)');gr.addColorStop(1,'rgba(255,160,80,0)');c.fillStyle=gr;c.beginPath();c.arc(me.x,me.y,r,0,7);c.fill()}
 c.restore();
 c.font='600 11px ui-monospace,Menlo,Consolas,monospace';c.textBaseline='middle';const g=gam(s);
 for(const o of OBJS){if(!o.alive||!(o.kind==='drone'||o.hostile))continue;const d=Math.hypot(o.x-s.x,o.y-s.y,o.z-s.z);if(d>2e6)continue;
  const p=scr(o.x,o.y,o.z,CL),col=o.raider||o.hostile?'#ff4a4a':'#ffb347';let lab;
  if(o.kind==='missile'){const cv=-((o.x-s.x)*(o.vx-s.vx/g)+(o.y-s.y)*(o.vy-s.vy/g)+(o.z-s.z)*(o.vz-s.vz/g))/(d||1);lab='⚠ MISSILE '+fmtD(d)+(cv>1?' · impact in '+dur(d/cv):'')}
  else lab=(o.raider?o.name.toUpperCase():'DRONE')+' · '+fmtD(d);
  if(!p.on){edgeArrow(c,p,col,lab,W,H);continue}
  c.strokeStyle=col;c.lineWidth=2;c.beginPath();if(o.kind==='missile'){c.moveTo(p.x,p.y-8);c.lineTo(p.x+7,p.y+6);c.lineTo(p.x-7,p.y+6)}else{c.moveTo(p.x,p.y-9);c.lineTo(p.x+9,p.y);c.lineTo(p.x,p.y+9);c.lineTo(p.x-9,p.y)}c.closePath();c.stroke();
  c.fillStyle=col;c.fillText(lab,p.x+13,p.y-3);
  if(o.hpMax&&o.kind!=='missile'){const f=Math.max(0,o.hp/o.hpMax);c.fillStyle='rgba(0,0,0,.6)';c.fillRect(p.x+13,p.y+7,50,4);c.fillStyle=f>.5?'#5dff8a':f>.25?'#ffd84d':'#ff4a4a';c.fillRect(p.x+13,p.y+7,50*f,4)}}
 if(WT){const T2=tState(WT),p=scr(T2.x,T2.y,T2.z,CL);if(p.on){const k=15+3*Math.sin(now/140);c.strokeStyle='#5fe0ff';c.lineWidth=2;c.beginPath();
   for(const[sx,sy]of[[-1,-1],[1,-1],[1,1],[-1,1]]){c.moveTo(p.x+sx*k,p.y+sy*(k-6));c.lineTo(p.x+sx*k,p.y+sy*k);c.lineTo(p.x+sx*(k-6),p.y+sy*k)}c.stroke();
   if(WEP[WI].id==='rail'&&WT.kind!=='ast'){const aim=[T2.x-s.x,T2.y-s.y,T2.z-s.z],rv=[T2.vx-s.vx/g,T2.vy-s.vy/g,T2.vz-s.vz/g],t=intercept(aim,rv,8000);
    if(t>0){const q=scr(T2.x+rv[0]*t,T2.y+rv[1]*t,T2.z+rv[2]*t,CL);if(!q.beh){c.strokeStyle='#fff2a0';c.beginPath();c.arc(q.x,q.y,6,0,7);c.stroke();c.fillStyle='#fff2a0';c.fillText('lead',q.x+9,q.y)}}}}}
 if(CB.hm&&now-CB.hm.t0<300&&CB.hm.o){const o=CB.hm.o,p=scr(o.x,o.y,o.z,CL);if(!p.beh){const k=CB.hm.kill?16:9,a=1-(now-CB.hm.t0)/300;c.strokeStyle=`rgba(255,255,255,${a.toFixed(3)})`;c.lineWidth=2;c.beginPath();
   for(const[sx,sy]of[[-1,-1],[1,-1],[1,1],[-1,1]]){c.moveTo(p.x+sx*k*.5,p.y+sy*k*.5);c.lineTo(p.x+sx*k,p.y+sy*k)}c.stroke()}}
 CB.pops=CB.pops.filter(q=>now-q.t0<1200);c.font='700 13px ui-monospace,Menlo,Consolas,monospace';for(const q of CB.pops){const p=rel([q.x,q.y,q.z]);if(p.beh)continue;const a=(now-q.t0)/1200;
  c.globalAlpha=1-a;c.fillStyle='#000';c.fillText(q.txt,p.x+11,p.y-17-a*30);c.fillStyle=q.col;c.fillText(q.txt,p.x+10,p.y-18-a*30);c.globalAlpha=1}
 if(CB.banner&&now-CB.banner.t0<3200){const a=(now-CB.banner.t0)/3200;c.globalAlpha=Math.min(1,(1-a)*3,a*8);c.font='700 34px ui-monospace,Menlo,Consolas,monospace';c.textAlign='center';
  c.shadowColor='#ff8a00';c.shadowBlur=18;c.fillStyle='#ffd27a';c.fillText(CB.banner.txt,W/2,H*.32);c.shadowBlur=0;c.textAlign='left';c.globalAlpha=1}
 const ha=1-(now-CB.hurt)/600,low=CB.on&&s.hull/hullMax()<.3?.14+.1*Math.sin(now/170):0,va=Math.max(ha>0?.45*ha:0,low);
 if(va>0){const gr=c.createRadialGradient(W/2,H/2,Math.min(W,H)*.3,W/2,H/2,Math.max(W,H)*.72);gr.addColorStop(0,'rgba(255,0,0,0)');gr.addColorStop(1,`rgba(255,20,20,${va.toFixed(3)})`);c.fillStyle=gr;c.fillRect(0,0,W,H)}}
// ----- weapon bar (click or tap works too; hold for beams)
const WSL=['⛏ Mining','✦ Pulse','☄ Beam','⇶ Rail','🚀 Missile'];
function cbUIBuild(){const box=$('wslots');box.innerHTML='';
 WEP.forEach((w,i)=>{const b=document.createElement('button');b.className='ws';b.title=w.n+': '+w.d;b.onpointerdown=e=>{e.preventDefault();wKey(i)};const up=()=>fireHeld=false;b.onpointerup=up;b.onpointerleave=up;b.onpointercancel=up;box.appendChild(b)});
 const t=document.createElement('button');t.className='ws';t.id='wst';t.title='Select the next target (nearest first)';t.onclick=()=>{initAudio();cycleT()};box.appendChild(t);
 const r=document.createElement('button');r.className='ws raid';r.id='wsr';r.title='Call in a wave of raider drones';r.onclick=()=>raidStart();box.appendChild(r)}
function cbUI(){const box=$('wslots');if(!box)return;if(!box.children.length)cbUIBuild();
 WEP.forEach((w,i)=>{const b=box.children[i],u=isU(w.id);let sub='🔒 not built',fr=0;
  if(u){fr=1;if(w.id==='plaser'||w.id==='rail'){const need=w.id==='plaser'?1e7:1.28e8,cool=need/Math.max(1,SH.pmax);fr=Math.max(0,Math.min(1,(T-lastShotT)/cool));sub=s.en<need?'battery low':fr<1?'charging':'ready';if(w.id==='rail')sub=Math.floor(s.res.iron/2)+' shots · '+sub}
   else if(w.id==='missile'){sub=s.ammo.missile+' left';fr=s.ammo.missile>0?1:0}else sub='hold'}
  const h=`<b>${KN(BIND['w'+(i+1)])}</b>${WSL[i]}<br><span>${sub}</span><i style="width:${Math.round(fr*100)}%"></i>`;if(b._h!==h){b._h=h;b.innerHTML=h}b.classList.toggle('sel',i===WI);b.classList.toggle('lock',!u)});
 const alive=CB.raiders.filter(o=>o.alive).length,t=$('wst'),r=$('wsr'),rb=$('raidb'),hp=Math.max(0,s.hull/hullMax());
 const th=`<b>${KN(BIND.target)}</b>🎯 Target<br><span>${WT?tName(WT).slice(0,18):'none'}</span>`;if(t._h!==th){t._h=th;t.innerHTML=th}
 const rh=CB.on?`<b>⚔</b>Wave ${CB.wave}<br><span>${alive} left</span>`:`<b>${KN(BIND.raid)}</b>⚔ Raiders<br><span>call wave ${s.raid.wave}</span>`;if(r._h!==rh){r._h=rh;r.innerHTML=rh}
 const txt=CB.on?`⚔ WAVE ${CB.wave} · ${alive} LEFT · HULL ${Math.round(hp*100)}% · BATT ${Math.round(100*s.en/Math.max(1,SH.cap))}%`:hp<.995?`🔧 Hull ${Math.round(hp*100)}% · ${s.res.spares>0?'crew repairing with spare parts':'no spare parts left to repair with'}`:'';
 if(rb._t!==txt){rb._t=txt;rb.textContent=txt}rb.classList.toggle('h',!txt);rb.classList.toggle('calm',!CB.on);rb.classList.toggle('crit',CB.on&&hp<.3)}

