// ===== DESIGN ANALYZER: what limits the ship, and why =====
function analyze(add){const keep=s.parts;if(add){s.parts=s.parts.concat(add.map(id=>({id,cond:1,fail:false})));recalc()}
 const D=DR[di],M=mass(),P=PW,r=sunDist(),flux=S0*(AU/r)**2,F=D.sail?2*flux*s.sailA/C:D.k*P/D.ve,reac=SH.reactors.reduce((a,q)=>a+q.d.pe,0),reacW=SH.reactors.reduce((a,q)=>a+q.d.pe*(1/q.d.eta-1),0),
  gen=flux*s.area*EFF*.62+SH.rtg+reac,free=gen-SH.load,capLo=qrej(SH.radLoA,318),capHi=SH.radHiA?qrej(SH.radHiA,SH.radHiT*.97):0,baseLo=SH.load*.9+100+.3*flux*10,
  roomLo=capLo-baseLo-(SH.radHiA?0:reacW),roomHi=SH.radHiA?capHi-reacW:roomLo,
  fP=D.el?Math.max(0,Math.min(1,free/P)):1,fH=D.hf>0&&D.loop!=='none'&&P>0?Math.max(0,Math.min(1,(D.loop==='lo'?roomLo:roomHi)/(P*D.hf))):1,fG=F>0?Math.min(1,SH.gmax*9.81*M/F):1,
  f=Math.min(fP,fH,fG),acc=F*f/M,fuel=D.f?s.fuel[D.f]:Infinity,dv=D.f?(fuel>0?C*Math.tanh(D.ve/C*Math.log(M/(M-fuel))):0):Infinity,md=D.sail?0:F*f/D.ve,burn=md>0?fuel/md:Infinity,
  lim=[['power supply',fP],['heat rejection',fH],['structure',fG]].sort((a,b)=>a[1]-b[1])[0],o={M,F,f,acc,dv,burn,fP,fH,fG,lim,gen,free,capLo,capHi,roomLo,roomHi,gmax:SH.gmax,cap:SH.cap,baseLo,reacW};
 if(add){s.parts=keep;recalc()}return o}
const pct=x=>Math.round(x*100)+'%',bar=(x,c)=>`<span style="display:inline-block;width:70px;height:7px;background:#1a2440;border-radius:3px;vertical-align:middle;overflow:hidden"><i style="display:block;height:100%;width:${Math.round(Math.max(0,Math.min(1,x))*100)}%;background:${c||(x>=.999?'#5dff8a':x>.5?'#ffd84d':'#ff6a5a')}"></i></span>`;
function whyTxt(){const D=DR[di];if(!isU(D.id))return'Selected engine is not built.';const a=analyze(),lb=a.lim[0];
 let h=`<b>${D.ic} ${D.n} Mk ${D.mk}</b> · rated ${sci(PW)} W → ${sci(a.F)} N at full power · ship ${f1(a.M,0)} kg<br>Usable: <b>${pct(a.f)}</b> of full thrust → <b>${sci(a.acc)} m/s²</b> (${(a.acc/9.81).toPrecision(2)} g)<br>`;
 h+=`${bar(a.fP)} power ${pct(a.fP)}${D.el?` · needs ${sci(PW)} W, average spare power ${sci(Math.max(0,a.free))} W`:' · not electric'}<br>`;
 h+=`${bar(a.fH)} heat ${pct(a.fH)}${D.loop!=='none'&&D.hf>0?` · makes ${sci(PW*D.hf)} W of heat; ${D.loop==='lo'||!SH.radHiA?'low':'high'}-temp radiators have ${sci(Math.max(0,D.loop==='lo'?a.roomLo:a.roomHi))} W spare`:' · heat carried away by exhaust'}<br>`;
 h+=`${bar(a.fG)} structure ${pct(a.fG)} · frame rated ${SH.gmax} g${a.F>0?`, full thrust would be ${(a.F/a.M/9.81).toPrecision(2)} g`:''}<br>`;
 if(a.f<.999)h+=`<b style="color:#ffd84d">Limiting factor: ${lb.toUpperCase()}.</b> `+(lb==='power supply'?'Add solar panels or a reactor, or lower engine power.':lb==='heat rejection'?(D.loop==='lo'||!SH.radHiA?'Add low-temp radiators'+(D.loop==='hi'?' (or research high-temp heat pipes: hot engines need them)':'')+', or lower engine power.':'Add high-temp radiators, or lower engine power.'):'Build a stronger frame, or the engine is too big for this ship.')+'<br>';
 else h+='<b style="color:#5dff8a">Engine runs at full power: nothing is limiting it.</b><br>';
 h+=`Δv with the fuel on board: <b>${isFinite(a.dv)?(a.dv<.001*C?f1(a.dv/1e3,2)+' km/s':(a.dv/C).toFixed(4)+' c'):'unlimited (sail)'}</b> · full burn lasts ${isFinite(a.burn)?dur(a.burn):'forever'}`;return h}
function burnCurve(cv){if(!cv||!cv.getContext)return;const x=cv.getContext('2d'),W=cv.width,H=cv.height,a=analyze(),D=DR[di];x.clearRect(0,0,W,H);
 const tEnd=Math.min(isFinite(a.burn)?a.burn:30*86400,365*86400),md=D.sail?0:a.F*a.f/D.ve,pts=[];for(let k=0;k<=80;k++){const t=tEnd*k/80,m=a.M-md*t,v=D.sail?a.acc*t:D.ve*Math.log(a.M/Math.max(1e-9,m));pts.push([t,v])}
 const vmax=Math.max(1,pts[pts.length-1][1]);x.strokeStyle='#2a3458';x.strokeRect(30,8,W-38,H-26);x.strokeStyle='#ff9a3d';x.lineWidth=2;x.beginPath();pts.forEach(([t,v],k)=>{const px=30+(W-38)*t/tEnd,py=H-18-(H-26)*v/vmax;k?x.lineTo(px,py):x.moveTo(px,py)});x.stroke();
 x.fillStyle='#9aa8d0';x.font='10px monospace';x.fillText((vmax<1e6?f1(vmax/1e3,1)+' km/s':(vmax/C).toFixed(3)+' c'),32,18);x.fillText('0',20,H-18);x.fillText(dur(tEnd),W-60,H-4);x.fillText('speed gained in a straight full burn →',34,H-4)}
