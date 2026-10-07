// ===== MANUFACTURING: jobs draw power over time (surplus, then battery down to 25%) =====
const matOK=m=>Object.keys(m||{}).every(k=>(s.res[k]||0)>=m[k]-1e-9),takeMat=m=>{for(const k in m||{})s.res[k]-=m[k]},giveMat=(m,f)=>{for(const k in m||{})s.res[k]=(s.res[k]||0)+m[k]*f};
const matTxt=m=>Object.keys(m||{}).length?Object.keys(m).map(k=>((s.res[k]||0)>=m[k]?'✓ ':'✗ ')+f1(m[k],m[k]<10?1:0)+' kg '+(RN[k]||k)+' ('+f1(s.res[k]||0,k==='platinum'?2:0)+')').join(' · '):'no materials';
function queueJob(j){if(j.mat&&!matOK(j.mat))return null;takeMat(j.mat);j.done=0;j.tw=0;j.fr=0;j.t0=T;s.jobs.push(j);if(INSTANT)instantJobs();return j}
function cancelJob(k){const j=s.jobs[k];if(!j)return;giveMat(j.mat,1);if(j.type==='fuel'&&j.water)s.res.water+=j.water;s.jobs.splice(k,1);notify('🏭 Cancelled: '+j.name+' (materials returned)')}
function jobsRun(dt){s.fabHeat=0;if(!s.jobs.length)return;const j=s.jobs[0],av=Math.max(0,Math.min(SH.fabPw*dt,Math.max(0,s.roomX)/.3*dt,s.en-.25*SH.cap)),use=Math.max(0,Math.min(av,j.J-j.done));
 s.en-=use;j.done+=use;s.fabHeat=use/dt*.3;if(j.type==='panel'){const a=use/P1;s.area+=a}j.tw+=dt;
 j.fr=Math.min(j.J>0?j.done/j.J:1,j.minT?j.tw/j.minT:1);if(j.fr>=1-1e-9){s.jobs.shift();finishJob(j)}}
const jobETA=(j,k)=>{const rate=Math.max(1,Math.min(SH.fabPw,Math.max(0,s.pFree)+(s.en>.3*SH.cap?SH.fabPw:0)));let t=Math.max((j.J-j.done)/rate,j.minT?j.minT-j.tw:0);for(let q=0;q<k;q++){const o=s.jobs[q];t+=Math.max((o.J-o.done)/rate,o.minT?o.minT-o.tw:0)}return t};
function finishJob(j){let msg='🏭 Finished: '+j.name;
 if(j.type==='fuel'){s.fuel[j.f]+=j.n;if(j.water)s.madeW=true}else if(j.type==='sup'){s.res[j.k]=(s.res[j.k]||0)+j.n;if(j.k==='oxygen'&&j.mat)s.madeW=true}
 else if(j.type==='part'){const d=PARTS[j.id];if(d.one){const o=s.parts.find(p=>PARTS[p.id].cat===d.cat);if(o){s.parts.splice(s.parts.indexOf(o),1);giveMat(PARTS[o.id].mat,.5);msg+=' (old '+PARTS[o.id].n+' recycled for 50% of its materials)'}}
  s.parts.push({id:j.id,cond:1,fail:false,uid:++UID});s.codex.built[j.id]=1;disc('b_'+j.id,'Built: '+d.n,5,'')}
 else if(j.type==='eng'||j.type==='weap'){UNL[j.id]=1;if(j.id==='missile')s.ammo.missile+=2;s.codex.built[j.id]=1}
 else if(j.type==='missile')s.ammo.missile+=j.n;else if(j.type==='repair'||j.type==='service'){const t=findRef(j.ref);if(t){t.fail=false;t.cond=j.type==='service'?1:Math.max(t.cond,.6)}}
 else if(j.type==='upgrade'){const D=DR.find(x=>x.id===j.id);D.mk++;D.ve=D.ve0*(1+.12*(D.mk-1));D.hf*=.7}else if(j.type==='resize'){const i=DR.findIndex(x=>x.id===j.id);if(i===di)PW=j.pw;DR[i].pw=j.pw}
 else if(j.type==='patch')s.leak=0;else if(j.type==='hull')s.hull=hullMax();ORB.emit('job:done',j);recalc();notify(msg)}
const findRef=r=>r.startsWith('e:')?DR.find(D=>D.id===r.slice(2)):s.parts.find(p=>'p:'+p.uid===r);
const kitsFor=r=>{const t=findRef(r);if(!t)return 1;const m=r.startsWith('e:')?engMass(t,t===DR[di]?PW:t.pw):PARTS[t.id].m;return Math.max(1,Math.min(30,Math.round(m/400)))};
function repairJob(r,service){const t=findRef(r);if(!t)return;const k=service?Math.max(1,Math.ceil(kitsFor(r)*(1-t.cond))):kitsFor(r);if(s.res.spares<k){notify('⚠ Needs '+k+' spare-parts kits (you have '+s.res.spares+'). Make kits in 🏭 Fabricate.');return}
 s.res.spares-=k;queueJob({type:service?'service':'repair',ref:r,name:(service?'Service ':'Repair ')+(r.startsWith('e:')?t.n:PARTS[t.id].n),J:2e6*k,minT:3600*(1+k)})}
function scrapPart(uid){const p=s.parts.find(q=>q.uid===uid);if(!p)return;const d=PARTS[p.id];if(d.cat==='frame'){notify('⚠ The ship needs a frame: build a new one to replace it.');return}s.parts.splice(s.parts.indexOf(p),1);giveMat(d.mat,.5);recalc();notify('♻ Removed '+d.n+': 50% of its materials recovered')}
function scrapEng(id){const i=DR.findIndex(D=>D.id===id);if(!isU(id))return;const others=DR.map((D,k)=>k).filter(k=>k!==i&&isU(DR[k].id));if(!others.length){notify('⚠ Keep at least one engine.');return}delete UNL[id];if(ENGR[id])giveMat(ENGR[id].mat,.5);if(i===di)setDrive(others[0]);recalc();notify('♻ Removed the '+DR[i].n)}
function engUpJob(id){const D=DR.find(x=>x.id===id),need=D.mk===1?'t_eng2':'t_eng3';if(D.mk>=3||!hasT(need))return;const m=engMass(D,D===DR[di]?PW:D.pw),mat={iron:Math.ceil(.2*m),nickel:Math.ceil(.05*m),platinum:+(m*.002).toFixed(2)};
 if(!queueJob({type:'upgrade',id,mat,name:D.n+' → Mk '+(D.mk+1),J:5e6*m}))notify('⚠ Upgrade needs '+matTxt(mat))}
function engResizeJob(id,x){const i=DR.findIndex(D=>D.id===id),D=DR[i],cur=i===di?PW:D.pw,np=cur*x;if(x<1){if(i===di)PW=np;D.pw=np;recalc();return}const dm=D.al*(np-cur),mat={iron:Math.ceil(.7*dm),nickel:Math.ceil(.2*dm),platinum:+(.001*dm).toFixed(2)};
 if(!queueJob({type:'resize',id,pw:np,mat,name:'Enlarge '+D.n+' to '+sci(np)+' W',J:2e6*dm+1e6}))notify('⚠ Enlarging needs '+matTxt(mat))}
