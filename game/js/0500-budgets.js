// ===== SYSTEM BUDGETS (recomputed whenever the ship changes) =====
function recalc(){const S={mass:0,cap:0,pmax:0,rtg:0,reactors:[],load:300,rp:0,fabPw:0,gmax:.5,ad:2,mag:false,whip:false,ls:null,radLoA:20,radHiA:0,radHiT:0,ww:false};
 for(const p of s.parts){const d=PARTS[p.id];S.mass+=d.m;if(p.fail)continue;const c=.5+.5*p.cond;
  if(d.cat==='frame')S.gmax=Math.max(S.gmax,d.g);else if(d.cat==='store'){S.cap+=d.cap*(d.wear?.5+.5*p.cond:1);S.pmax+=d.pmax}
  else if(d.cat==='gen'){if(d.eta)S.reactors.push({p,d});else S.rtg+=d.pe}
  else if(d.cat==='therm'){if(d.loop==='lo')S.radLoA+=2*d.A*c;else{S.radHiA+=2*d.A*c;S.radHiT=S.radHiT?Math.min(S.radHiT,d.Tmax):d.Tmax}}
  else if(d.cat==='life'){S.ls=d;S.load+=d.p}else if(d.cat==='shield'){if(d.ad)S.ad+=d.hyd?d.ad*1.6:d.ad;if(d.ww)S.ww=true;if(d.mag){S.mag=true;S.load+=d.p}if(d.whip)S.whip=true}
  else if(d.cat==='lab'){S.rp=Math.max(S.rp,d.rp);S.load+=d.p}else if(d.cat==='fab')S.fabPw=Math.max(S.fabPw,d.pw)}
 if(typeof layoutApply==='function')layoutApply(S);
 EFF=s.tech.t_pv3?.47:s.tech.t_pv2?.4:.3;SH=S}
const engMass=(D,P)=>D.base+D.al*P*(1-.25*(D.mk-1)),wepMass=w=>w.id==='mlaser'?20+PML*6e-4:WEPR[w.id].m;
function dryMass(){if(!SH)recalc();let m=SH.mass;DR.forEach((D,i)=>{if(isU(D.id))m+=engMass(D,i===di?PW:D.pw)});WEP.forEach(w=>{if(isU(w.id))m+=wepMass(w)});return m}
const SIG=5.67e-8,EPSR=.85,qrej=(A,T)=>EPSR*SIG*A*(T**4-256);
function engLimits(D,F,m,dts){if(!SH)recalc();if(D.fail){if(!PREDICTING)s.lim={P:0,H:0,G:0,f:0,failed:1};return 0}let fP=1,fH=1,fG=1;
 if(D.el){const av=Math.max(0,s.pFree)+(s.en>0?SH.pmax:0);fP=Math.max(0,Math.min(1,av/PW,(s.en+Math.max(0,s.pFree)*dts)/(PW*dts)))}
 if(D.hf>0&&D.loop!=='none'&&PW>0)fH=Math.max(0,Math.min(1,(D.loop==='lo'?s.roomLo:s.roomHi)/(PW*D.hf)));
 if(F>0)fG=Math.min(1,SH.gmax*9.81*m/F);const f=Math.min(fP,fH,fG);if(!PREDICTING)s.lim={P:fP,H:fH,G:fG,f};return f}
// power bus + two cooling loops. Low loop ≈ 300 K (crew, electronics, batteries, electric thrusters), high loop up to the radiators' limit (reactors, hot engines).
function powerStep(dt,flux){if(!SH)recalc();const S=SH,lit=s.lit,sun=flux*s.area*EFF*lit*s.pcond,hasHi=S.radHiA>0,TloMax=318,ThiMax=hasHi?S.radHiT*.97:TloMax;
 const base=S.load+(STAB?50:0),engEl=DR[di].el&&s.burn>0?s.burn*PW:0;
 let hLo=base*.9+100+.3*flux*10*lit+s.wHeat+(s.fabHeat||0),hHi=0;const capLo=qrej(S.radLoA,TloMax),capHi=hasHi?qrej(S.radHiA,ThiMax):0;
 const demand=base+engEl+(s.jobs.length&&!PREDICTING?S.fabPw:0)+(s.en<S.cap?Math.min(S.pmax,(S.cap-s.en)/600):0)-sun-S.rtg;let reac=0,reacMax=0;
 for(const r of S.reactors){const d=r.d;if(d.fuel&&!(s.fuel[d.fuel]>0))continue;const w=1/d.eta-1,room=hasHi?capHi-hHi:capLo-hLo,mx=Math.max(0,Math.min(d.pe*(.5+.5*r.p.cond),room/w));
  reacMax+=mx;const out=Math.max(0,Math.min(mx,demand-reac));reac+=out;if(hasHi)hHi+=out*w;else hLo+=out*w;if(d.fuel&&!PREDICTING)s.fuel[d.fuel]=Math.max(0,s.fuel[d.fuel]-out/d.eta/3.45e14*dt)}
 const el=DR[di].loop,onLo=el==='lo'||(el==='hi'&&!hasHi);s.roomLo=capLo-hLo;s.roomX=s.roomLo+(s.fabHeat||0)+s.wHeat;s.roomHi=hasHi?capHi-hHi:s.roomLo;if(onLo)hLo+=s.engHeat;else if(el==='hi')hHi+=s.engHeat;
 const relax=(T,Q,A,C,floor)=>{const Teq=Math.max(floor,Math.pow(Math.max(0,Q)/(EPSR*SIG*A)+256,.25)),G=4*EPSR*SIG*A*Teq**3;return Teq+(T-Teq)*Math.exp(-dt*G/C)};
 s.tLo=relax(s.tLo,hLo,S.radLoA,2e6,291);s.tHi=hasHi?relax(s.tHi,hHi,S.radHiA,5e5,150):s.tLo;s.hLo=hLo;s.hHi=hHi;s.capLo=capLo;s.capHi=capHi;
 const gen=sun+S.rtg+reac;s.genNow=gen;s.loadNow=base;s.pFree=sun+S.rtg+reacMax-base;s.en+=(gen-base)*dt;
 if(!PREDICTING){jobsRun(dt);lifeStep(dt)}if(s.en<0)s.en=0;if(s.en>S.cap){s.curt=(s.en-S.cap)/dt;s.en=S.cap}else s.curt=0}
