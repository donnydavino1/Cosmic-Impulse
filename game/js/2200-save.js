// ===== SAVE / LOAD =====
const SKEY='orbital-v3-save-';
function slotInfo(k){try{const v=localStorage.getItem(SKEY+k);if(!v)return'';const o=JSON.parse(v);return'('+fT(o.T)+' in, saved '+new Date(o.time).toLocaleString()+')'}catch(e){return''}}
function saveGame(k){try{const st={v:3,time:Date.now(),T,B:B.map(b=>[b.x,b.y,b.z,b.vx,b.vy,b.vz]),S:{x:s.x,y:s.y,z:s.z,vx:s.vx,vy:s.vy,vz:s.vz,tau:s.tau,en:s.en,area:s.area,fuel:s.fuel,res:s.res,mined:s.mined,sailA:s.sailA,ammo:s.ammo,raid:s.raid,ctr:s.ctr,ops:s.ops,lay:s.lay,passive:!!s.passive,madeW:!!s.madeW,
  parts:s.parts,tLo:s.tLo,tHi:s.tHi,rp:s.rp,tech:s.tech,research:s.research,rprog:s.rprog,jobs:s.jobs,crew:s.crew,co2:s.co2,leak:s.leak,pcond:s.pcond,codex:s.codex,shelter:!!s.shelter,hull:s.hull},
  UNL,D:DR.map(D=>[D.pw,D.mk,D.ve,D.hf,D.cond,D.fail]),di,PW,PML,XYZ,STAB,gi,ast:AST.map(a=>a.mined),flare,nextFlare,UID};localStorage.setItem(SKEY+k,JSON.stringify(st));return true}catch(e){if(k!=='auto')notify('⚠ Could not save: '+e.message);return false}}
function loadGame(k){if(MP.conn){notify('⚠ Loading is disabled while connected: the shared clock belongs to the host.');return}try{if(CB.on)raidEnd('reset');const o=JSON.parse(localStorage.getItem(SKEY+k));if(!o)return;T=o.T;setRails(T);for(const q in o.S)s[q]=o.S[q];if(!o.S.ops)s.ops=opsNew();if(!o.S.lay)s.lay={order:[],tid:0};s.ops.lt=null;
 OBJS.slice().forEach(rmObj);for(const q in UNL)delete UNL[q];Object.assign(UNL,o.UNL);DR.forEach((D,i)=>{[D.pw,D.mk,D.ve,D.hf,D.cond,D.fail]=o.D[i]});di=o.di;PW=o.PW;PML=o.PML;XYZ=o.XYZ;STAB=o.STAB;gi=o.gi;
 AST.forEach((a,i)=>a.mined=o.ast[i]||0);flare=o.flare;nextFlare=o.nextFlare;UID=o.UID||UID;AP=null;PRED=null;PJ=null;WT=null;fireHeld=false;for(const q in K)K[q]=0;acc();ctl();recalc();if(!(s.hull>0))s.hull=hullMax();
 $('go').classList.add('h');paused=false;shipKey='';notify('📂 Loaded '+(k==='auto'?'the autosave':'slot '+k))}catch(e){notify('⚠ Could not load: '+e.message)}}
