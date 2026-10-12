// ===== COMFORT (client, visual only): no strobing day/night at high time speed =====
// In low orbit you pass from sunlight into a planet's shadow every ~45 minutes. At high time speed that becomes a
// flicker several times a second, which is unpleasant (and can make people feel sick). The light you SEE therefore
// fades smoothly instead of switching, and when the day/night cycle is faster than a few real seconds the picture
// shows the average light of the orbit, with softer shadows and dimmer city lights. The physics (power, heat) still
// uses the real, instant sunlight and shadow.
const VLT={v:1,last:0,fast:0,amb:null,night:null};
function visCycle(){try{const d=s.dom;if(!d||d===B[0])return Infinity;const o=elements();if(!(o.ec<1)||!(o.a>0))return Infinity;const P=2*Math.PI*Math.sqrt(o.a**3/d.GM),rate=paused?0:(typeof UNI!=='undefined'&&UNI.on?UNI.rate:WARP[wi]);return rate>0?P/rate:Infinity}catch(e){return Infinity}}
const visLit=()=>VLT.v;
ORB.on('frame',now=>{const dt=VLT.last?Math.min(.5,(now-VLT.last)/1000):0;VLT.last=now;const Pr=visCycle(),tau=Pr<20?Math.max(.3,Math.min(30,1.5*Pr)):.35;
 VLT.v+=((s.lit?1:0)-VLT.v)*(1-Math.exp(-dt/tau));VLT.fast=Math.max(0,Math.min(1,(15-Pr)/12));
 try{if(!VLT.amb)VLT.amb=sc.children.filter(o=>o.isAmbientLight);const real=typeof REAL==='function'&&REAL(),base=real?.35:1;VLT.amb.forEach(l=>l.intensity=base+VLT.fast*(real?.9:.5));
  if(typeof light!=='undefined'&&light)light.intensity=1.8*(1-.35*VLT.fast);
  if(VLT.night===null){VLT.night=[];sc.traverse(o=>{if(o.material&&o.material.userData&&o.material.userData.night)VLT.night.push(o.material)})}
  for(const m of VLT.night)m.emissiveIntensity=m.userData.night*(1-.8*VLT.fast)}catch(e){}});
