// ===== RELATIVISTIC SKY (client, visual only): what the stars look like near light speed =====
// Light from the stars is seen from a moving ship, so two real effects of special relativity appear as you speed up:
//   aberration   a star at angle θ from your direction of travel appears at θ′ with cos θ′ = (cos θ + β) / (1 + β cos θ):
//                the sky crowds into a bright disc ahead and empties behind
//   Doppler      light from ahead arrives at higher frequency, D = γ (1 + β cos θ): stars ahead turn blue and brighten
//                (∝ D², shown capped), stars behind turn red and fade
// β is the ship's speed relative to the Sun's frame (the stars barely move in it). Applied to every star field in the
// scene; below 0.2 % of light speed nothing changes.
const RSKY={sets:null,at:0,lastB:0,told:0};
function rskyFind(){const L=[];sc.traverse(o=>{if(!o.isPoints||!o.geometry)return;const p=o.geometry.getAttribute&&o.geometry.getAttribute('position');if(!p||p.count<200)return;
 const r=Math.hypot(p.getX(0),p.getY(0),p.getZ(0));if(r<3e5)return;const c=o.geometry.getAttribute('color');
 L.push({o,p,base:Float32Array.from(p.array),c,cbase:c?Float32Array.from(c.array):null})});return L}
ORB.on('frame',now=>{if(now-RSKY.at<100)return;RSKY.at=now;if(!RSKY.sets||!RSKY.sets.length){RSKY.sets=rskyFind();if(!RSKY.sets.length)return}
 const g=gam(s),S=B[0],vx=s.vx/g-S.vx,vy=s.vy/g-S.vy,vz=s.vz/g-S.vz,v=Math.hypot(vx,vy,vz),b=Math.min(.999,v/C);
 if(b<.002){if(RSKY.lastB>0){for(const q of RSKY.sets){q.p.array.set(q.base);q.p.needsUpdate=true;if(q.c){q.c.array.set(q.cbase);q.c.needsUpdate=true}}RSKY.lastB=0}return}
 if(Math.abs(b-RSKY.lastB)<1e-4&&now-RSKY.at<2000)return;RSKY.lastB=b;const ux=vx/v,uy=vy/v,uz=vz/v,gm=1/Math.sqrt(1-b*b);
 if(b>.1&&!RSKY.told){RSKY.told=1;notify('🌌 '+tr('Past 10 % of light speed the stars crowd toward your direction of travel and turn blue ahead, red behind: relativistic aberration and Doppler shift.'))}
 for(const q of RSKY.sets){const P=q.p.array,B0=q.base,Cc=q.c?q.c.array:null,C0=q.cbase;
  for(let i=0;i<P.length;i+=3){const x=B0[i],y=B0[i+1],z=B0[i+2],r=Math.hypot(x,y,z),cs=(x*ux+y*uy+z*uz)/r;let px=x/r-cs*ux,py=y/r-cs*uy,pz=z/r-cs*uz;const pl=Math.hypot(px,py,pz)||1;px/=pl;py/=pl;pz/=pl;
   const c2=(cs+b)/(1+b*cs),s2=Math.sqrt(Math.max(0,1-c2*c2));P[i]=r*(c2*ux+s2*px);P[i+1]=r*(c2*uy+s2*py);P[i+2]=r*(c2*uz+s2*pz);
   if(Cc){const D=gm*(1+b*cs),I=Math.min(2.5,D*D),t=Math.max(-1,Math.min(1,Math.log(D)/1.2)),bl=t>0?[.62,.78,1]:[1,.42,.22],w=Math.abs(t);
    for(let k=0;k<3;k++)Cc[i+k]=Math.min(1,(C0[i+k]*(1-w)+bl[k]*w*Math.max(C0[i],C0[i+1],C0[i+2]))*I)}}
  q.p.needsUpdate=true;if(q.c)q.c.needsUpdate=true}});
