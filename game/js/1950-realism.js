// ===== REALISTIC LOOK (client, visual only): 🎨 Customize → STYLE → "Realistic look" (on by default) =====
// Real space is black: one hard light (the Sun), almost no fill light, no outlines, no glowing paint. This module
// switches the renderer to filmic tone mapping, dims the fill lights, swaps the coloured nebula for a faint Milky Way
// and softens planet halos. 'stylized' restores the original look. Ship materials follow REAL() in 1300-ship-model.js.
const VIS={sky:{},lights:null};
function realSkyTex(){if(VIS.sky.real!==undefined)return VIS.sky.real;let t=null;try{
 const ca=Math.cos(1.05),sa=Math.sin(1.05),cv=eqTex(1024,512,(x,y,z)=>{const zg=z*ca+y*sa,band=Math.exp(-zg*zg*28),n=fbm(x*4,y*4,z*4,5,41),dust=sstep(.55,.75,fbm(x*9,y*9,z*9,4,42));
  const v=band*(.25+.75*n)*(1-.6*dust)*26;return[v*1.05+1,v+1,v*.92+2]});if(cv)t=new THREE.CanvasTexture(cv)}catch(e){console.warn('real sky',e)}VIS.sky.real=t;return t}
function applyVis(){const real=REAL();try{
 if(THREE.ACESFilmicToneMapping!==undefined){R.toneMapping=real?THREE.ACESFilmicToneMapping:THREE.NoToneMapping;R.toneMappingExposure=real?1.35:1}
 if(!VIS.lights){VIS.lights={amb:SS.children.filter(o=>o.isAmbientLight),hemi:SS.children.filter(o=>o.isHemisphereLight),mapAmb:sc.children.filter(o=>o.isAmbientLight)}}
 sLight.intensity=real?3.2:1.8;VIS.lights.amb.forEach(l=>l.intensity=real?.09:1);VIS.lights.hemi.forEach(l=>l.intensity=real?.06:.6);VIS.lights.mapAmb.forEach(l=>l.intensity=real?.35:1);
 if(VIV.sky){if(VIS.sky.styl===undefined)VIS.sky.styl=VIV.sky.material.map;const m=real?realSkyTex():VIS.sky.styl;if(m){VIV.sky.material.map=m;VIV.sky.material.needsUpdate=true}}
 for(const X of PLX)if(X.halo){X.halo.material.opacity=real?.35:1;X.halo.material.transparent=true}
 // materials compile differently with tone mapping on or off
 [sc,SS].forEach(S=>S.traverse(o=>{if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.needsUpdate=true)}}));shipKey=''}catch(e){console.warn('vis',e)}}
setTimeout(applyVis,1500);
