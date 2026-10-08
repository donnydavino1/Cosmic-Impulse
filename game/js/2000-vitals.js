// ===== COCKPIT VITALS: everything that can kill you, in one strip across the top of the 1st-person view =====
// Crew health falls when oxygen, water or food run out, CO₂ builds up (no power for the scrubbers), the cabin overheats,
// or the radiation dose passes 1 Sv (6 Sv is fatal). The ship dies when the hull reaches 0. Thresholds match survivalTick.
const VT=(()=>{const box=document.createElement('div');box.id='vitals';document.body.appendChild(box);return{box,last:''}})();
function vChip(ic,lab,val,f,lv,tip){return`<div class="vc ${lv}" title="${tip}"><span class="vi">${ic}</span><span class="vl">${lab}</span><b>${val}</b><i style="width:${Math.round(Math.max(0,Math.min(1,f))*100)}%"></i></div>`}
function vitals(){if(!FP||!s.crew){if(VT.last){VT.box.innerHTML='';VT.last=''}return}
 const c=s.crew,L=lifeDays(),R2=doseNow(),hm=hullMax(),hp=Math.max(0,s.hull/hm),dd=x=>x===Infinity?'∞':x>999?'999+ d':x<1?f1(x*24,1)+' h':f1(x,1)+' d',C=[];let worst=0,warn=0,crit=0;
 const add=(ic,lab,val,f,lv,tip)=>{if(lv==='crit')crit++;else if(lv==='warn')warn++;C.push(vChip(ic,lab,val,f,lv,tip))};
 add('❤','CREW',c.alive?Math.round(c.hp)+'%':'LOST',c.hp/100,c.hp<50?'crit':c.hp<80?'warn':'ok','Crew health. It drops when any life-support item below fails; at 0% the crew dies.');
 add('🛡','HULL',Math.round(hp*100)+'%'+(s.leak?' BREACH':''),hp,hp<.3||s.leak?'crit':hp<.6?'warn':'ok','Hull integrity. At 0% the ship is destroyed. A breach leaks oxygen; patch it in 🛠 → Fabricate.');
 add('🫁','O₂',c.o2ok===false?'NONE':dd(L.o2),L.o2/30,c.o2ok===false||L.o2<2?'crit':L.o2<7?'warn':'ok','Oxygen left. With none, the crew loses 50% health per hour.');
 add('💧','WATER',c.waterok===false?'NONE':dd(L.wat),L.wat/30,c.waterok===false||L.wat<2?'crit':L.wat<5?'warn':'ok','Water left. Running out causes dehydration.');
 add('🍞','FOOD',c.foodok===false?'NONE':dd(L.food),L.food/30,c.foodok===false||L.food<3?'crit':L.food<7?'warn':'ok','Food left. Running out causes starvation (slowly).');
 add('🌫','CO₂',f1(s.co2,2)+' kg',1-s.co2/.6,s.co2>.6?'crit':s.co2>.2?'warn':'ok','Carbon dioxide in the cabin. Above 0.6 kg it is toxic. Scrubbers need battery power.');
 const tc=s.tLo-273;add('🌡','CABIN',f1(tc,0)+' °C',1-Math.max(0,tc-20)/25,s.tLo>318?'crit':s.tLo>308?'warn':'ok','Cabin temperature. Above 45 °C the crew overheats: add low-temperature radiators or cut heat loads.');
 const storm=R2.spe>0;add('☢','DOSE',f1(c.acute,2)+' Sv'+(storm?' STORM':''),1-c.acute/6,c.acute>1||storm&&!s.shelter?'crit':c.acute>.5||flare?'warn':'ok',
  `Recent radiation dose (6 Sv is fatal, sickness above 1 Sv). Now ${f1(R2.tot*86400e3,1)} mSv/day${s.shelter?' · in shelter':''}. Shelter with ${KN(BIND.shelter)} during solar storms.`);
 const bat=s.en/Math.max(1,SH.cap);add('🔋','POWER',Math.round(bat*100)+'%',bat,bat<.05&&s.pFree<0?'crit':bat<.15?'warn':'ok','Battery. Life support and CO₂ scrubbers stop when it is empty.');
 const fl=s.parts.filter(q=>q.fail).length+DR.filter(D=>isU(D.id)&&D.fail).length;add('🔧','SYSTEMS',fl?fl+' FAILED':'OK',fl?0:1,fl?'crit':'ok','Failed components. Repair them in 🛠 → Ship with spare-parts kits ('+s.res.spares+' left).');
 // threats: incoming missiles, raiders in range, a path that hits the planet
 const g=gam(s),mis=OBJS.filter(o=>o.hostile&&o.alive);let th='CLEAR',tl='ok',tf=1,tt='No incoming missiles, no raiders in range, and your orbit does not hit the planet.';
 if(mis.length){let eta=Infinity;for(const m of mis){const dx=m.x-s.x,dy=m.y-s.y,dz=m.z-s.z,d=Math.hypot(dx,dy,dz),cv=-(dx*(m.vx-s.vx/g)+dy*(m.vy-s.vy/g)+dz*(m.vz-s.vz/g))/(d||1);if(cv>1)eta=Math.min(eta,d/cv)}
  th=mis.length+' MISSILE'+(mis.length>1?'S':'')+(eta<Infinity?' '+dur(eta):'');tl='crit';tf=0;tt='Incoming missiles. Target them ('+KN(BIND.target)+') and shoot them down with the pulse laser.'}
 else if(CB.on){const n=CB.raiders.filter(o=>o.alive).length;th=n+' RAIDER'+(n>1?'S':'');tl='warn';tf=.5;tt='Raiders are attacking.'}
 const o=elements(),d=o.d,rp=o.ec<1?o.a*(1-o.ec):Infinity,rv=((s.x-d.x)*(s.vx/g-d.vx)+(s.y-d.y)*(s.vy/g-d.vy)+(s.z-d.z)*(s.vz/g-d.vz))/o.r;
 if(rp<d.R*1.0005&&d!==B[0]&&tl!=='crit'){const alt=o.r-d.R;th='IMPACT '+(rv<0?'in '+dur(alt/-rv):'course');tl=rv<0&&alt/-rv<3600?'crit':'warn';tf=.2;tt=`Your orbit's lowest point is below ${d.n}'s surface. Speed up along your path to raise it.`}
 add('⚠','THREATS',th,tf,tl,tt);
 const head=crit?`<div class="vh crit">🔴 ${crit} DANGER${crit>1?'S':''}</div>`:warn?`<div class="vh warn">🟡 ${warn} WARNING${warn>1?'S':''}</div>`:'<div class="vh ok">🟢 ALL VITALS OK</div>';
 const h=head+C.join('');if(h!==VT.last){VT.last=h;VT.box.innerHTML=h}}
setInterval(()=>{try{vitals()}catch(e){}},300);

// ----- close-range scene (metres): asteroids, drones, projectiles, beams, explosions
const astMesh={},objMesh=new Map(),beamL=new THREE.Line(new THREE.BufferGeometry(),new THREE.LineBasicMaterial({color:0x44ff66}));
beamL.geometry.setAttribute('position',new THREE.BufferAttribute(new Float32Array(6),3));beamL.frustumCulled=false;SS.add(beamL);
function mkRock(a){const geo=new THREE.IcosahedronGeometry(a.r,3),P=geo.attributes.position,sd=a.id*1.37+.5;
 for(let k=0;k<P.count;k++){const x=P.getX(k),y=P.getY(k),z=P.getZ(k),f=1+.2*Math.sin(x*3.1/a.r+sd)*Math.cos(y*2.3/a.r+sd*1.7)+.12*Math.sin(z*5.7/a.r+sd*.3);P.setXYZ(k,x*f,y*f*.85,z*f)}geo.computeVertexNormals();
 return new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:{C:'#5b544c',S:'#9a7b56',M:'#8f9aa8'}[a.t],roughness:a.t==='M'?.45:.95,metalness:a.t==='M'?.6:0,flatShading:true}))}
function mkObj(o){if(o.raider)return mkRaider(o);if(o.pilot){const g=new THREE.Group(),c=(o.cust&&o.cust.hull)||'#d9dcdf',H=new THREE.MeshStandardMaterial({color:c,metalness:.3,roughness:.5});const b=new THREE.Mesh(new THREE.CylinderGeometry(2.2,2.2,12,16),H);b.rotation.z=Math.PI/2;g.add(b);[1,-1].forEach(sg=>{const p=new THREE.Mesh(new THREE.BoxGeometry(4,.1,10),new THREE.MeshStandardMaterial({color:'#1b2a55',metalness:.4,roughness:.3}));p.position.z=sg*7;g.add(p)});return g}if(o.kind==='drone'){const m=new THREE.Mesh(new THREE.OctahedronGeometry(4),new THREE.MeshStandardMaterial({color:'#552222',emissive:'#ff3344',emissiveIntensity:.6,flatShading:true}));m.add(glow('#ff4455',14));return m}
 const g2=new THREE.Group();g2.add(glow(o.hostile?'#ff3344':o.kind==='missile'?'#ffb347':'#fff2a0',o.kind==='missile'?12:6));if(o.kind==='missile')g2.add(new THREE.Mesh(new THREE.CylinderGeometry(.25,.25,3,8),new THREE.MeshStandardMaterial({color:'#e8ecf5'})));return g2}
function ssPrep(){if(!(SV||FP||fi==0))return false;shipUpdate();shipG.visible=!FP;
 if(FP){const q=dirAE();SC.position.set(0,0,0);SC.lookAt(q[0],q[1],q[2]);SC.fov=cam.fov}else if(!SV){const q=dirAE(),D=dist*U;SC.position.set(q[0]*D,q[1]*D,q[2]*D);SC.lookAt(0,0,0);SC.fov=55}
 SC.near=.5;SC.far=1e13;SC.aspect=innerWidth/innerHeight;SC.updateProjectionMatrix();
 AST.forEach((a,k)=>{const A=AS[k]||astState(a),dx=A.x-s.x,dy=A.y-s.y,dz=A.z-s.z,d=Math.hypot(dx,dy,dz);let m=astMesh[a.id];
  if(d<3e6){if(!m){m=astMesh[a.id]=mkRock(a);SS.add(m)}m.visible=true;m.position.set(dx,dy,dz);m.rotation.set(T*1e-4*(1+a.id%3),T*7e-5,0)}else if(m)m.visible=false});
 const seen=new Set();OBJS.forEach(o=>{let m=objMesh.get(o);if(!m){m=mkObj(o);objMesh.set(o,m);SS.add(m)}m.position.set(o.x-s.x,o.y-s.y,o.z-s.z);if(o.raider)m.lookAt(0,0,0);seen.add(o)});
 for(const[o,m]of objMesh)if(!seen.has(o)){SS.remove(m);objMesh.delete(o)}
 const now=performance.now();beamL.visible=!!beamFx;if(beamFx){const b=beamL.geometry.attributes.position.array;if(beamFx.u){b[3]=beamFx.u[0]*5e5;b[4]=beamFx.u[1]*5e5;b[5]=beamFx.u[2]*5e5}else{b[3]=beamFx.tx-s.x;b[4]=beamFx.ty-s.y;b[5]=beamFx.tz-s.z}
  b[0]=b[1]=b[2]=0;beamL.geometry.attributes.position.needsUpdate=true;beamL.material.color.setHex(beamFx.col)}
 FX=FX.filter(f=>{const age=(now-f.t0)/1000;if(age>1.4){SS.remove(f.sp);return false}const k=f.size*(1+age*6);f.sp.scale.set(k,k,1);f.sp.material.opacity=Math.max(0,1-age/1.4);f.sp.position.set(f.x-s.x,f.y-s.y,f.z-s.z);return true});
 return true}
// ----- map view: asteroid dots + labels
const aPos=new Float32Array(AST.length*3),aCol=new Float32Array(AST.length*3),aG=new THREE.BufferGeometry(),AS=[];
AST.forEach((a,k)=>{const c=new THREE.Color({C:'#8a7f72',S:'#d1a46a',M:'#a9b8cc'}[a.t]);aCol[k*3]=c.r;aCol[k*3+1]=c.g;aCol[k*3+2]=c.b});
aG.setAttribute('position',new THREE.BufferAttribute(aPos,3));aG.setAttribute('color',new THREE.BufferAttribute(aCol,3));
const aPts=new THREE.Points(aG,new THREE.PointsMaterial({size:4,sizeAttenuation:false,vertexColors:true}));aPts.frustumCulled=false;sc.add(aPts);
const aLab=AST.map(()=>{const d=document.createElement('div');d.className='l';d.style.color='#e8d9b8';$('lb').appendChild(d);return d});
function astDraw(fp){AST.forEach((a,k)=>{const A=astState(a);AS[k]=A;aPos[k*3]=(A.x-fp.x)/U;aPos[k*3+1]=(A.y-fp.y)/U;aPos[k*3+2]=(A.z-fp.z)/U});aG.attributes.position.needsUpdate=true}
function astLabels(){AST.forEach((a,k)=>{const l=aLab[k],A=AS[k];if(!A){l.style.display='none';return}const isT=(AP&&AP.ast===a)||(WT&&WT.a===a),d=Math.hypot(A.x-s.x,A.y-s.y,A.z-s.z);
 if(!isT&&!(a.neo&&d<.08*AU&&!FP)&&!(d<5e6)){l.style.display='none';return}v3.set(aPos[k*3],aPos[k*3+1],aPos[k*3+2]).project(cam);let x=v3.x,y=v3.y;const beh=v3.z>1;
 if(!FP&&(beh||v3.z<-1)){l.style.display='none';return}if(FP){if(beh){x=-x;y=-y}const kk=Math.max(Math.abs(x)/.9,y>0?y/.78:-y/.42);if(beh||kk>1){x/=kk;y/=kk}l.className='l mk'}else l.className='l';
 l.style.display='';l.textContent=(isT?'🎯 ':'◇ ')+a.n+' ('+a.t+') · '+fmtD(d);l.style.left=(x+1)/2*innerWidth+'px';l.style.top=(1-y)/2*innerHeight+'px'})}
// ----- projected path: fast-forward a copy of the real simulation, autopilot included, then restore everything
let PRED=null,predWall=-1e9,PJ=null;
// The projection fast-forwards a private copy of the universe a few milliseconds per frame, swapping it in and out so the game never stutters.
function grab(){return{b:ALL.map(o=>[o.x,o.y,o.z,o.vx,o.vy,o.vz,o.ax,o.ay,o.az]),objs:ALL.slice(),fuel:{...s.fuel},tLo:s.tLo,tHi:s.tHi,en:s.en,tau:s.tau,burn:s.burn,lit:s.lit,dom:s.dom,AP,note:apNote,thr:THR,T}}
function put(S){ALL.length=0;S.objs.forEach(o=>ALL.push(o));ALL.forEach((o,k)=>{const v=S.b[k];o.x=v[0];o.y=v[1];o.z=v[2];o.vx=v[3];o.vy=v[4];o.vz=v[5];o.ax=v[6];o.ay=v[7];o.az=v[8]});
 s.fuel={...S.fuel};s.tLo=S.tLo;s.tHi=S.tHi;s.en=S.en;s.tau=S.tau;s.burn=S.burn;s.lit=S.lit;s.dom=S.dom;AP=S.AP;apNote=S.note;THR=S.thr;T=S.T}
const pPt=()=>{const d=s.dom;return[B.indexOf(d),s.x-d.x,s.y-d.y,s.z-d.z]};
function predStart(){if(!AP||AP.hold){PJ=null;return}const st=grab();st.AP={...AP};PJ={st,pts:[pPt()],n:0,T0:T,ap:AP,out:''}}
function predRun(ms){if(!PJ)return;const real=grab(),realAP=AP,keys={...K};for(const k in K)K[k]=0;put(PJ.st);PREDICTING=true;const t0=performance.now();let k=0;
 try{while(AP&&PJ.n<150000&&T-PJ.T0<6.3e8){const dt=Math.min(.05*ctl(),3600,apDt());step(dt);T+=dt;PJ.n++;if(PJ.n%15===0)PJ.pts.push(pPt());
  if(AP&&AP.hold){PJ.out='arrive';break}const De=DR[di];if(s.prop<=1e-6){PJ.out='fuel';break}if(De.el&&s.en<=PW&&perM2()*s.area<.01*PW){PJ.out='power';break}
  if(++k%100===0&&performance.now()-t0>ms)break}}catch(e){PJ.out='error'}
 const done=!!PJ.out||!AP||PJ.n>=150000||T-PJ.T0>=6.3e8;
 if(done){if(!PJ.out)PJ.out=!AP?(apNote.startsWith('✅')?'arrive':'stop'):(T-PJ.T0>=6.3e8?'long':'horizon');PJ.pts.push(pPt());const P=PJ.pts,m=Math.ceil(P.length/1500);
  PRED={pts:P.length>1500?P.filter((p,i)=>i%m===0||i===P.length-1):P,dt:T-PJ.T0,T0:PJ.T0,out:PJ.out,where:fmtD(sunDist())+' from the Sun',left:s.prop,fname:DR[di].f?FUEL[DR[di].f].n.toLowerCase():'',n:PJ.n,ap:PJ.ap};predWall=performance.now()}
 else{PJ.st=grab()}
 PREDICTING=false;put(real);AP=realAP;Object.assign(K,keys);if(done)PJ=null}
function predict(){predStart();while(PJ)predRun(1e9)} // synchronous version (testing)
const PA=new Float32Array(1600*3),PG=new THREE.BufferGeometry();PG.setAttribute('position',new THREE.BufferAttribute(PA,3));const pathL=new THREE.Line(PG,new THREE.LineBasicMaterial({color:0x5fe0ff,transparent:true,opacity:.85}));pathL.frustumCulled=false;sc.add(pathL);
function pathDraw(fp){if(!PRED||!AP){pathL.visible=false;return}pathL.visible=true;const P=PRED.pts,n=Math.min(P.length,1600);for(let k=0;k<n;k++){const p=P[k],b=B[p[0]]||B[0];PA[k*3]=(b.x+p[1]-fp.x)/U;PA[k*3+1]=(b.y+p[2]-fp.y)/U;PA[k*3+2]=(b.z+p[3]-fp.z)/U}PG.setDrawRange(0,n);PG.attributes.position.needsUpdate=true}
function navTick(){const el=$('navinfo');if(!AP){PRED=null;el.classList.add('h');return}el.classList.remove('h');
 if(!AP.hold&&!AP.wait&&!PJ&&(!PRED||PRED.ap!==AP||performance.now()-predWall>10000))predStart();const P=PRED,rate=WARP[wi];
 let h='<b>🧭 AUTOPILOT → '+AP.name+'</b><br>'+(AP.stage||'')+'<br>';
 if(AP.hold)h+='Parked in mining range. Pick the mining laser and hold 🔥 FIRE. Any flight key takes manual control.';
 else if(!P||P.ap!==AP)h+='Projecting path… '+(PJ?Math.round(PJ.n/400)+'%':'');
 else{const left=Math.max(0,P.dt-(T-P.T0));h+=P.out==='arrive'?`ETA: <b>${dur(left)}</b> game time → <b>${paused?'(paused)':dur(left/rate)}</b> real time at the current speed (1 s = ${dur(rate)}; ⏩ to go faster)<br>✓ Projected to arrive with ${f1(P.left,P.left<10?2:0)} kg ${P.fname} left`
  :P.out==='power'?`⚠ Projected to stall after ${dur(P.dt)}: the battery runs flat because your panels supply too little power for this engine. Buy more panels or lower engine power.`:P.out==='fuel'?`⚠ Projected to run out of ${P.fname} after ${dur(P.dt)} of game time (≈ ${dur(P.dt/rate)} real), ${P.where}. The autopilot will then stop and tell you what it needs. Fix it now: 🧭 NAVIGATE → ⛽ Buy the fuel this trip needs.`
  :P.out==='horizon'?`Projected ${dur(P.dt)} ahead (≈ ${dur(P.dt/rate)} real) and still flying; the trip is longer than that, but no fuel or power problems so far.`:P.out==='long'?'⚠ This trip takes longer than the 20-year projection window: consider a stronger engine or more fuel.':'Projection: '+P.out;
  {const L=lifeDays(),md=Math.min(L.o2,L.wat,L.food),need=Math.max(0,P.dt-(T-P.T0))/86400;if(need>md)h+=`<br><b style="color:#ff6a5a">⚠ Supplies last ${f1(md,0)} days (oxygen ${L.o2===Infinity?'∞':f1(L.o2,0)}, water ${L.wat===Infinity?'∞':f1(L.wat,0)}, food ${L.food===Infinity?'∞':f1(L.food,0)}) but the trip takes ${f1(need,0)}: 🧭 NAVIGATE → 🫁 Stock up, or research regenerative life support.</b>`}
  h+='<br><span style="color:#5fe0ff">Cyan line = projected path</span>'}el.innerHTML=h}
