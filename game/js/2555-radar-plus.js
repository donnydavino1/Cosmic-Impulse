// ===== MORE RADAR DISPLAYS (client, visual only): rotating sonar-style sweep, and a 3D radar you can turn =====
// Both read the same ORB-TLM contacts as every other design (fair: nobody sees more than their sensors give).
// 'sonar': like an old submarine or ship radar, a beam turns and each contact is only updated when the beam
// passes over it, then fades; between sweeps you see where things WERE. Better sensors turn the beam faster.
// '3d': contacts at their real height above or below your plane, with range rings, height stems and motion
// trails; drag the display to turn it. Register your own designs with ORB.radar.register (docs/MODDING.md).
const SONAR={};
radarReg('sonar',(x,W,H,L,o)=>{if(Math.min(W,H)<40)return;const cx=W/2,cy=H/2,R=Math.min(W,H)/2-8,now=performance.now()/1000,per=Math.max(1.5,6/(1+.5*o.tier)),a=(now/per*2*Math.PI)%(2*Math.PI);
 const st=SONAR[x.canvas.id||'w']=SONAR[x.canvas.id||'w']||{last:a,blips:new Map()};
 // phosphor screen, bezel and range rings
 const bg=x.createRadialGradient(cx,cy,0,cx,cy,R);bg.addColorStop(0,'rgba(6,40,18,.95)');bg.addColorStop(1,'rgba(2,14,6,.95)');x.fillStyle=bg;x.beginPath();x.arc(cx,cy,R,0,7);x.fill();
 x.strokeStyle='rgba(60,70,64,.9)';x.lineWidth=5;x.beginPath();x.arc(cx,cy,R+3,0,7);x.stroke();x.lineWidth=1;
 x.strokeStyle='rgba(90,255,140,.18)';for(let k=1;k<=4;k++){x.beginPath();x.arc(cx,cy,R*k/4,0,7);x.stroke()}
 for(let k=0;k<12;k++){const t=k*Math.PI/6;x.beginPath();x.moveTo(cx+Math.cos(t)*R*.96,cy-Math.sin(t)*R*.96);x.lineTo(cx+Math.cos(t)*R,cy-Math.sin(t)*R);x.stroke()}
 // the afterglow wedge behind the beam
 for(let k=0;k<24;k++){const t0=a-k*.045;x.fillStyle=`rgba(90,255,140,${(.16*(1-k/24)).toFixed(3)})`;x.beginPath();x.moveTo(cx,cy);x.arc(cx,cy,R,-t0,-t0+.05);x.closePath();x.fill()}
 x.strokeStyle='rgba(150,255,180,.95)';x.lineWidth=2;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx+R*Math.cos(a),cy-R*Math.sin(a));x.stroke();x.lineWidth=1;
 // the beam updates a contact only as it sweeps past its bearing
 const swept=(b0,b1,t)=>{const d=((b1-b0)%(2*Math.PI)+2*Math.PI)%(2*Math.PI),e=((t-b0)%(2*Math.PI)+2*Math.PI)%(2*Math.PI);return d<Math.PI&&e<=d};
 for(const c of L){const p=rLocal(c),an=(Math.atan2(p[1],p[0])+2*Math.PI)%(2*Math.PI),key=c.id||c.name||c.kind+':'+Math.round(c.range/1e3);
  if(swept(st.last,a,an)||!st.blips.has(key))st.blips.set(key,{c,an,r:rMap(c.range,o.range)*R,t:now})}
 st.last=a;for(const[k,b]of st.blips){const age=now-b.t;if(age>per*2.2){st.blips.delete(k);continue}
  const al=Math.max(0,1-age/(per*1.05));if(al<=0)continue;x.globalAlpha=al;x.shadowColor='#7dff9c';x.shadowBlur=8*al;
  const px=cx+b.r*Math.cos(b.an),py=cy-b.r*Math.sin(b.an);x.fillStyle=x.strokeStyle=b.c.hostile||b.c.kind==='missile'?'#ffd36a':'#b6ffc8';rMark(x,b.c,px,py,4);
  x.shadowBlur=0;if(al>.5&&W>200){x.font='9px ui-monospace,monospace';x.fillText(fmtD(b.c.range),px+6,py-4)}x.globalAlpha=1}
 x.fillStyle='#b6ffc8';x.beginPath();x.arc(cx,cy,2.5,0,7);x.fill();
 x.font='9px ui-monospace,monospace';x.fillStyle='rgba(150,255,180,.7)';x.fillText(`SWEEP ${per.toFixed(1)} s`,6,12)},'Rotating sonar-style sweep: contacts update only as the beam passes');
const R3D={};
radarReg('3d',(x,W,H,L,o)=>{const cv=x.canvas,id=cv.id||'w',v=R3D[id]=R3D[id]||{yaw:-.5,pitch:.55,drag:null,trail:new Map()};
 if(!cv._r3d){cv._r3d=1;cv.style.pointerEvents='auto';cv.style.cursor='grab';cv.style.touchAction='none';
  cv.addEventListener('pointerdown',e=>{v.drag=[e.clientX,e.clientY,v.yaw,v.pitch];cv.setPointerCapture&&cv.setPointerCapture(e.pointerId);e.stopPropagation()});
  cv.addEventListener('pointermove',e=>{if(!v.drag)return;v.yaw=v.drag[2]+(e.clientX-v.drag[0])*.01;v.pitch=Math.max(.05,Math.min(1.45,v.drag[3]+(e.clientY-v.drag[1])*.01));e.stopPropagation()});
  addEventListener('pointerup',()=>{v.drag=null})}
 if(!v.drag)v.yaw+=.0015;const cy=Math.cos(v.yaw),sy=Math.sin(v.yaw),cp=Math.cos(v.pitch),sp=Math.sin(v.pitch),S=Math.min(W,H*1.6)*.42,ox=W/2,oy=H*.55;
 // world (x right, y ahead, z up, scaled to radius 1) → screen with a little perspective
 const P=(X,Y,Z)=>{const x1=X*cy-Y*sy,y1=X*sy+Y*cy,y2=y1*cp-Z*sp,z2=y1*sp+Z*cp,f=3/(3+y2*.6);return[ox+x1*S*f,oy-z2*S*f,f,y2]};
 x.fillStyle='rgba(2,10,22,.65)';x.fillRect(0,0,W,H);
 // range rings and a grid on your plane
 for(let k=1;k<=4;k++){x.strokeStyle=`rgba(95,224,255,${k===4?.45:.2})`;x.beginPath();for(let t=0;t<=64;t++){const q=P(Math.cos(t/64*2*Math.PI)*k/4,Math.sin(t/64*2*Math.PI)*k/4,0);t?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1])}x.stroke()}
 x.strokeStyle='rgba(95,224,255,.15)';[[-1,0,1,0],[0,-1,0,1]].forEach(([a,b,c,d])=>{const p1=P(a,b,0),p2=P(c,d,0);x.beginPath();x.moveTo(p1[0],p1[1]);x.lineTo(p2[0],p2[1]);x.stroke()});
 const fw=P(0,1.12,0);x.fillStyle='rgba(95,224,255,.6)';x.font='9px ui-monospace,monospace';x.fillText('▲',fw[0]-4,fw[1]+3);
 // contacts: projected at their true bearing and height, sorted far → near
 const now=performance.now()/1000,items=L.map(c=>{const p=rLocal(c),d=Math.hypot(...p)||1,r=rMap(c.range,o.range),X=p[0]/d*r,Y=p[1]/d*r,Z=p[2]/d*r;return{c,X,Y,Z,q:P(X,Y,Z),g:P(X,Y,0)}}).sort((a,b)=>b.q[3]-a.q[3]);
 for(const it of items){const c=it.c,key=c.id||c.name||c.kind;let tr=v.trail.get(key);if(!tr){tr=[];v.trail.set(key,tr)}if(!tr.length||now-tr[tr.length-1].t>.5){tr.push({X:it.X,Y:it.Y,Z:it.Z,t:now});if(tr.length>8)tr.shift()}
  x.strokeStyle=rCol(c);x.globalAlpha=.25;x.beginPath();tr.forEach((p,i)=>{const q=P(p.X,p.Y,p.Z);i?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1])});x.stroke();
  x.globalAlpha=.55;x.setLineDash([2,3]);x.beginPath();x.moveTo(it.g[0],it.g[1]);x.lineTo(it.q[0],it.q[1]);x.stroke();x.setLineDash([]);
  x.beginPath();x.ellipse(it.g[0],it.g[1],3,1.5,0,0,7);x.stroke();x.globalAlpha=1;x.fillStyle=x.strokeStyle=rCol(c);rMark(x,c,it.q[0],it.q[1],3+2*it.q[2]);
  if(W>220){x.font='9px ui-monospace,monospace';x.fillText(fmtD(c.range),it.q[0]+6,it.q[1]-4)}}
 const me=P(0,0,0);x.fillStyle='#5fe0ff';x.beginPath();x.arc(me[0],me[1],3,0,7);x.fill();
 x.font='9px ui-monospace,monospace';x.fillStyle='rgba(160,220,255,.7)';x.fillText('drag to turn',6,12)},'3D: true height above or below you, motion trails; drag to turn');
