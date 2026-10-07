// ===== COCKPIT STYLES (client, visual only): 🎨 Customize → COCKPIT, or ORB.cockpit.use(name) =====
// A style is a CSS skin for the dashboard widgets (css/210-cockpit-themes.css, body class ck-<name>) plus a window
// frame drawn in the #canopy SVG. Add your own: ORB.cockpit.register(name, {frame: '<svg paths>', label}) and CSS.
const CKS={
 real:{label:'Realistic: matte instrument panels, window frame with pillars',frame:`<defs><linearGradient id="ckf" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#3a3f47"/><stop offset="1" stop-color="#16191e"/></linearGradient></defs>
  <path d="M -10 610 L -10 70 C 120 30 300 14 500 14 C 700 14 880 30 1010 70 L 1010 610 L 1010 -10 L -10 -10 Z" fill="#0b0d10"/>
  <path d="M -10 70 C 120 30 300 14 500 14 C 700 14 880 30 1010 70" fill="none" stroke="url(#ckf)" stroke-width="26" vector-effect="non-scaling-stroke"/>
  <path d="M 500 14 L 500 70 M 150 40 L 40 610 M 850 40 L 960 610" stroke="#22262c" stroke-width="16" vector-effect="non-scaling-stroke"/>
  <path d="M 500 14 L 500 70 M 150 40 L 40 610 M 850 40 L 960 610" stroke="#4a5059" stroke-width="2" vector-effect="non-scaling-stroke" opacity=".5"/>
  <g fill="#5a616b">${[[300,22],[700,22],[120,48],[880,48],[80,250],[920,250]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.2"/>`).join('')}</g>`},
 military:{label:'Military: dark olive panels, amber readouts',frame:`<path d="M -10 610 L -10 90 L 160 30 L 840 30 L 1010 90 L 1010 610 L 1010 -10 L -10 -10 Z" fill="#0b0c07"/>
  <path d="M -10 90 L 160 30 L 840 30 L 1010 90" fill="none" stroke="#3c4224" stroke-width="22" vector-effect="non-scaling-stroke"/>
  <path d="M 500 30 L 500 90 M 160 30 L 60 610 M 840 30 L 940 610" stroke="#2b2f19" stroke-width="18" vector-effect="non-scaling-stroke"/>
  <path d="M 380 34 L 420 34 M 580 34 L 620 34" stroke="#ffb000" stroke-width="4" vector-effect="non-scaling-stroke"/>`},
 retro:{label:'Retro: green phosphor screens, 1970s style',frame:`<path d="M -10 610 C -10 230 170 40 500 40 C 830 40 1010 230 1010 610 L 1010 -10 L -10 -10 Z" fill="#050805"/>
  <path d="M -10 610 C -10 230 170 40 500 40 C 830 40 1010 230 1010 610" fill="none" stroke="#2d3a2d" stroke-width="28" vector-effect="non-scaling-stroke"/>
  <path d="M -10 610 C -10 230 170 40 500 40 C 830 40 1010 230 1010 610" fill="none" stroke="#39ff7a" stroke-opacity=".35" stroke-width="1.5" vector-effect="non-scaling-stroke"/>`},
 neo:{label:'Neo glass: translucent panels, glowing edges',frame:null},
 classic:{label:'Classic: plain flat panels',frame:null}};
const CK0=document.getElementById('canopy')?document.getElementById('canopy').innerHTML:'';
let CK_STYLE='physical';try{CK_STYLE=localStorage.getItem('orbital-cockpit')||(localStorage.getItem('orbital-retro')==='1'?'classic':'physical')}catch(e){}
function ckUse(n){if(!CKS[n])return false;if(n==='physical')document.body.classList.add('ck-real');CK_STYLE=n;try{localStorage.setItem('orbital-cockpit',n)}catch(e){}
 for(const k in CKS)document.body.classList.toggle('ck-'+k,k===n||(n==='physical'&&k==='real'));document.body.classList.toggle('retro',n==='classic');
 const cv=document.getElementById('canopy');if(cv)cv.innerHTML=CKS[n].frame||CK0;return true}
setTimeout(()=>ckUse(CK_STYLE),0);
ORB.cockpit={use:ckUse,list:()=>Object.keys(CKS),register:(n,o)=>{CKS[n]=Object.assign({label:n,frame:null},o);return true},get:()=>CK_STYLE};
// keep cockpit overlays from covering each other: hide the floating objective when the Objective widget is on the
// dashboard, and keep the ship-view caption inside the free space between the left buttons and the right panels
ORB.on('ui',()=>{try{const lay=(DASH.L[DASH.cur]||[]);
 // the cockpit's left button column moves down below any widget that would cover it
 const fb=document.getElementById('fpbar');if(fb&&FP){let top=120;const fr=fb.getBoundingClientRect();for(const w of document.querySelectorAll('.wdg')){const r=w.getBoundingClientRect();if(r.left<fr.right&&r.right>fr.left&&r.top<top+40&&r.bottom>top)top=r.bottom+8}fb.style.top=top+'px'}document.body.classList.toggle('objw',FP&&lay.some(w=>(w.id||w[0])==='objective'));
 const C=document.getElementById('svname');if(C&&SV&&!FP){const O=document.getElementById('obj'),I=document.getElementById('info')||document.getElementById('hud');
  const L0=Math.max(240,I&&I.offsetParent?I.getBoundingClientRect().right+16:240),R0=O&&O.offsetParent?O.getBoundingClientRect().left-16:innerWidth-240,w=R0-L0;
  if(w<260){C.style.visibility='hidden'}else{C.style.visibility='';C.style.left=(L0+w/2)+'px';C.style.maxWidth=Math.min(560,w)+'px'}}}catch(e){}});
