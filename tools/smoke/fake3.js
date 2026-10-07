// A stand-in for three.js r128 used only for headless testing. Real objects where the game relies on
// real state (scene graph children, positions, camera projection); anything else is a harmless dummy.
(function(){
const fake=()=>new Proxy(function(){},{get:(t,p)=>p===Symbol.toPrimitive?()=>0:typeof p==='symbol'?undefined:fake(),apply:()=>fake(),construct:()=>fake(),set:()=>true});
const wrap=o=>new Proxy(o,{get:(t,p)=>{if(p in t)return t[p];if(p===Symbol.toPrimitive)return ()=>0;if(typeof p==='symbol')return undefined;const f=fake();t[p]=f;return f},set:(t,p,v)=>{t[p]=v;return true}});
class V3{constructor(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z;return wrap(this)}
 set(x,y,z){this.x=x;this.y=y;this.z=z;return this}copy(v){this.x=v.x;this.y=v.y;this.z=v.z;return this}clone(){return new V3(this.x,this.y,this.z)}
 length(){return Math.hypot(this.x,this.y,this.z)}normalize(){const l=this.length()||1;this.x/=l;this.y/=l;this.z/=l;return this}
 project(cam){const p=cam.position,t=cam._t||{x:0,y:0,z:0},u=cam.up;let f=[t.x-p.x,t.y-p.y,t.z-p.z];const fl=Math.hypot(...f)||1;f=f.map(a=>a/fl);
  let r=[f[1]*u.z-f[2]*u.y,f[2]*u.x-f[0]*u.z,f[0]*u.y-f[1]*u.x];const rl=Math.hypot(...r)||1;r=r.map(a=>a/rl);const up=[r[1]*f[2]-r[2]*f[1],r[2]*f[0]-r[0]*f[2],r[0]*f[1]-r[1]*f[0]];
  const d=[this.x-p.x,this.y-p.y,this.z-p.z],zc=d[0]*f[0]+d[1]*f[1]+d[2]*f[2],tn=Math.tan((cam.fov||55)*Math.PI/360),zz=Math.abs(zc)<1e-9?1e-9:zc;
  const X=(d[0]*r[0]+d[1]*r[1]+d[2]*r[2])/(zz*tn*(cam.aspect||1)),Y=(d[0]*up[0]+d[1]*up[1]+d[2]*up[2])/(zz*tn);this.x=X;this.y=Y;this.z=zc>0?.5:2;return this}}
class O3{constructor(a,b){this.children=[];this.position=new V3();this.scale=new V3(1,1,1);this.up=new V3(0,1,0);this.rotation=wrap({x:0,y:0,z:0,set(){}});this.visible=true;this.userData={};this.geometry=a||fake();this.material=b||fake();return wrap(this)}
 add(...c){this.children.push(...c);return this}remove(c){const k=this.children.indexOf(c);if(k>=0)this.children.splice(k,1);return this}lookAt(x,y,z){this._t=typeof x==='object'?{x:x.x,y:x.y,z:x.z}:{x,y,z}}
 updateMatrixWorld(){}updateProjectionMatrix(){}clone(){return new O3()}}
class Cam extends O3{constructor(fov,aspect,near,far){super();this.fov=fov;this.aspect=aspect;this.near=near;this.far=far}}
class Ren{constructor(){this.domElement=document.createElement('canvas');return wrap(this)}setSize(){}setPixelRatio(){}render(){}clear(){}clearDepth(){}}
window.THREE=new Proxy({Vector3:V3,PerspectiveCamera:Cam,WebGLRenderer:Ren},{get:(t,p)=>p in t?t[p]:(typeof p==='string'&&/^[A-Z][a-z]/.test(p)&&!/Blending|Side|Wrapping/.test(p)?O3:fake())});
})();
