// ===== AUTOPILOT PLANNING =====
// escape cost: strong engines ≈ impulsive burn (√2−1)·v, gentle engines spiral out ≈ v
function escDv(o,i,P,M){const D=DR[i],a=D.k*P/D.ve/M,g=o.d.GM/(o.r*o.r);return (a>.3*g?(Math.SQRT2-1)*o.v*1.1:o.v)+500} // +500 m/s: leave with a little spare speed so you coast out cleanly
function planOne(i){const D=DR[i],S=B[0],M=mass(),F=s.fuel[D.f],cost=FUEL[D.f].cost,E=s.en+Math.max(0,perM2()*s.area*.62+SH.rtg-SH.load)*20*86400,P=i===di?PW:D.pw,inc=perM2()*s.area;let buy=0,U;
 if(D.el){const per=D.ve*D.ve/D.k;if(inc>=.25*P){buy=E/cost;U=F+buy}else if(E>=F*per){buy=(E-F*per)/(per+cost);U=F+buy}else{U=E/per}}else{buy=E/cost;U=F+buy}{const lim=maxMakeRes(D.f);if(buy>lim){U-=buy-lim;buy=lim}}
 const M2=M+buy-buy*cost/(C*C),dv=U>0?C*Math.tanh(D.ve/C*Math.log(M2/(M2-U))):0,o=s.dom!==S?elements():null,esc=o&&o.eps<0?escDv(o,i,P,M2):0,
  helio=dv/1.4-esc,r0=sunDist(),rt=helio>0?Math.max(.04*AU,S.GM/(Math.sqrt(S.GM/r0)+helio)**2):r0;return{i,buy,dv,esc,rt,U,M2}}
function goSun(){const r0=sunDist(),pl=DR.map((D,i)=>i).filter(i=>isU(DR[i].id)&&!DR[i].sail&&DR[i].f).map(planOne),best=pl.reduce((a,b)=>b.rt<a.rt?b:a),top=pl.reduce((a,b)=>b.dv>a.dv?b:a);
 if(best.rt>=r0*.995){const D=DR[top.i],F=FUEL[D.f],need=1.4*(top.esc+Math.max(0,Math.sqrt(B[0].GM/(.9*r0))-Math.sqrt(B[0].GM/r0))),
   kg=(top.M2-top.U)*(Math.exp(need/D.ve)-1)-top.U,J=Math.max(0,kg)*(F.cost+(D.el?D.ve*D.ve/D.k:0));
  notify(`⛔ Autopilot can't get you closer yet. Best option: ${D.n} gives ${f1(top.dv/1e3,2)} km/s of speed change, but ${top.esc>0?'escaping '+s.dom.n+' alone needs ~'+f1(top.esc*1.4/1e3,1)+' km/s':'a useful move needs more'}. Needs about ${sci(Math.max(0,kg))} kg more ${F.n.toLowerCase()} (≈ ${sci(J)} J of energy; you have ${sci(s.en)} J). Collect energy: buy solar panels and wait in sunlight (⏩), then press ☀ again.`);return}
 setDrive(best.i);const D=DR[best.i];let jb=null;if(best.buy>0)jb=buyFu(D.f,best.buy);
 AP={r:best.rt,name:'As close to the Sun as possible ('+(best.rt/AU).toFixed(3)+' AU)',stage:'',auto:true,wait:jb};
 notify(`🧭 Autopilot plan: using the ${D.n}${best.buy>0?', bought '+f1(best.buy,best.buy<10?2:0)+' kg of '+FUEL[D.f].n.toLowerCase():''}. ${f1(best.dv/1e3,2)} km/s available → target ${(best.rt/AU).toFixed(3)} AU from the Sun (now ${(r0/AU).toFixed(3)} AU). Speed up time (⏩) while it flies.`)}
function apWatch(){if(apNote!==lastNote&&apNote.startsWith('✅'))notify(apNote);if(!AP||AP.wait)return;const D=DR[di],inc=perM2()*s.area,out=s.prop<=1e-6,flat=D.el&&s.en<=PW&&inc<.01*PW;
 if(!out&&!flat)return;const F=D.f?FUEL[D.f]:null,tg=AP.r,r=sunDist(),nm=AP.name;let need='';
 if(out&&tg){const t=trip(tg);need=`To continue to ${(tg/AU).toFixed(3)} AU it needs ~${sci(t.extra)} kg more ${F.n.toLowerCase()} (${costTxt(D.f,t.extra)}; you have ${sci(s.en)} J${F.make.water&&!inEarth()?' and '+f1(s.res.water,0)+' kg water':''}).`}
 else if(out)need=`It needs more ${F.n.toLowerCase()} (${F.how}). Check 🛠 → 🚀 Engines & fuel, then start the trip again.`;
 else need='It needs more solar panels, or a fuel-powered engine.';
 AP=null;PRED=null;notify(`⛔ Autopilot exited (${nm}) at ${fmtD(r)} from the Sun: ${out?'out of '+F.n.toLowerCase():'battery empty and too little sunlight for the '+D.n}. `+need)}
