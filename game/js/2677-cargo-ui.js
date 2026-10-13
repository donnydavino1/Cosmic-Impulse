// ===== CARGO WINDOW (client): key ], 📦 CARGO in the top bar, or 🛠 → ⛏ Inventory =====
// Every loose item on board with its mass and share of the ship, a box to drop any amount (rules: 2107-cargo.js), what
// the built-in parts weigh, and the materials your whole ship is made of. A preview shows your Δv after the drop.
const CGW=document.createElement('div');CGW.id='cgw';CGW.className='h';
CGW.innerHTML='<div class="card"><h2>📦 Cargo</h2><p class="opsn">Everything you carry, and what your ship is made of. Drop any amount of loose cargo: it leaves through the airlock and drifts along your orbit, so your path does not change, only your mass (lighter means more push and more Δv).</p><div id="cgb"></div><button id="cgc">Close (])</button></div>';
document.body.appendChild(CGW);$('cgc').onclick=()=>CGW.classList.add('h');
const CG={at:0,val:{}};
function cargoToggle(){CGW.classList.toggle('h');CG.at=0;cargoDraw(true)}
const cgName=r=>r.kind==='fuel'?tr(FUEL[r.key]?FUEL[r.key].n:r.key):r.kind==='ammo'?tr('Missiles'):RN[r.key]?tr(RN[r.key]):({oxygen:tr('Oxygen'),food:tr('Food'),spares:tr('Spare-parts kits'),patch:tr('Patch kits'),water:tr('water ice')}[r.key]||r.key);
const cgGroup=r=>r.kind==='fuel'?'fuel':r.kind==='ammo'?'ammo':['oxygen','food','spares','patch'].includes(r.key)?'sup':'mat';
const cgKg=kg=>kg>=1e6?f1(kg/1e3,0)+' t':kg>=1e4?f1(kg/1e3,1)+' t':f1(kg,kg<10?2:0)+' kg';
// Δv after dropping d units of item r (only the current engine's propellant changes what can be burned)
function cgDv(r,d){const D=DR[di],M=mass(),dk=Math.min(r.n,d)*r.per,cur=r.kind==='fuel'&&r.key===D.f,P=s.prop-(cur?dk:0),M2=M-dk;
 if(!D.f||!(P>0))return 0;return C*Math.tanh(D.ve/C*Math.log(M2/Math.max(1e-9,M2-P)))}
// what each built-in part is made of, scaled to its mass (recipes from the parts, engines and weapons tables)
function cgBuilt(){const rows=[],el={},add=(m,mat)=>{const tot=Object.values(mat||{}).reduce((a,b)=>a+b,0);if(!(tot>0))return false;for(const k in mat)el[k]=(el[k]||0)+m*mat[k]/tot;return true};
 const byId={};for(const p of s.parts){const d=PARTS[p.id];if(!d)continue;(byId[p.id]=byId[p.id]||{n:tr(d.n),c:0,m:0,mat:d.mat}).c++;byId[p.id].m+=d.m}
 for(const k in byId){const r=byId[k];r.known=add(r.m,r.mat);rows.push(r)}
 DR.forEach((D,i)=>{if(!isU(D.id))return;const m=engMass(D,i===di?PW:D.pw),R2=ENGR[D.id];rows.push({n:tr(D.n),c:1,m,known:add(m,R2&&R2.mat)})});
 WEP.forEach(w=>{if(!isU(w.id))return;const m=wepMass(w),R2=WEPR[w.id];rows.push({n:tr(w.n),c:1,m,known:add(m,R2&&R2.mat)})});
 if(s.area>0)rows.push({n:tr('Solar panels')+' ('+f1(s.area,0)+' m²)',c:1,m:pvKg()*s.area,known:add(pvKg()*s.area,{silicates:.8,carbon:.1,iron:.1})});
 const cn=typeof crewN==='function'?crewN():0;if(cn)rows.push({n:tr('Crew'),c:cn,m:cn*80,known:false,crew:true});
 if(typeof opsMass==='function'&&opsMass()>0)rows.push({n:tr('Drones and probes'),c:1,m:opsMass(),known:false});
 return{rows:rows.sort((a,b)=>b.m-a.m),el}}
function cargoDraw(force){if(CGW.classList.contains('h'))return;const now=performance.now();if(!force&&(now-CG.at<1500||CGW.contains(document.activeElement)))return;CG.at=now;
 const M=mass(),items=cargoItems().filter(r=>r.n>(r.unit==='kg'?.005:0)),dv=dvHave(),B2=cgBuilt(),loose=items.reduce((a,r)=>a+r.kg,0);
 const groups=[['fuel',tr('Propellants')],['mat',tr('Mined and stored materials')],['sup',tr('Crew supplies and kits')],['ammo',tr('Ammunition')]];
 let h=`<div class="crsum"><span>${tr('Ship mass')} <b>${cgKg(M)}</b></span> <span>${tr('loose cargo')} <b>${cgKg(loose)}</b></span> <span>${tr('Δv now')} <b>${isFinite(dv)?f1(dv/1e3,2)+' km/s':'∞'}</b></span>${s.sandbox?' <span>🧪 '+tr('Sandbox: buying is free')+'</span>':''}</div>`;
 h+=`<table class="bldt cgt"><thead><tr><th>${tr('Item')}</th><th>${tr('Amount')}</th><th>${tr('Mass')}</th><th>${tr('Share')}</th><th>${tr('Drop')}</th></tr></thead><tbody>`;
 for(const[g,gn]of groups){const L=items.filter(r=>cgGroup(r)===g);if(!L.length)continue;h+=`<tr class="cgg"><td colspan="5">${gn}</td></tr>`;
  for(const r of L){const id=r.kind+':'+r.key,amt=r.unit==='kg'?cgKg(r.n):Math.floor(r.n)+' '+tr(r.unit),v=CG.val[id]||'';
   h+=`<tr><td>${cgName(r)}${r.kind==='fuel'&&r.key===DR[di].f?' <small class="opsn">· '+tr('your engine burns this')+'</small>':''}</td><td>${amt}</td><td>${cgKg(r.kg)}</td><td>${f1(100*r.kg/M,r.kg/M<.01?2:1)} %</td>
    <td class="cgd"><input type="number" min="0" step="any" inputmode="decimal" data-cg="${id}" value="${v}" placeholder="${r.unit==='kg'?'kg':tr(r.unit)}" aria-label="${tr('Amount to drop')}"><button data-cgx="${id}">${tr('Drop')}</button><button data-cga="${id}">${tr('All')}</button><small class="cgp" data-cgp="${id}"></small></td></tr>`}}
 h+='</tbody></table>';
 h+=`<h3>${tr('Built into the ship')} <small class="opsn">${tr('(remove parts in 🧱 Builder: half of their materials come back)')}</small></h3><table class="bldt cgt"><thead><tr><th>${tr('Part')}</th><th>${tr('Count')}</th><th>${tr('Mass')}</th><th>${tr('Share')}</th></tr></thead><tbody>`+
  B2.rows.map(r=>`<tr><td>${r.n}</td><td>${r.c}</td><td>${cgKg(r.m)}</td><td>${f1(100*r.m/M,r.m/M<.01?2:1)} %</td></tr>`).join('')+'</tbody></table>';
 const el={...B2.el};for(const k of RES)el[k]=(el[k]||0)+(s.res[k]||0);const ek=Object.keys(el).filter(k=>el[k]>.5).sort((a,b)=>el[b]-el[a]),emax=Math.max(1,...ek.map(k=>el[k]));
 h+=`<h3>${tr('What your ship is made of')}</h3><p class="opsn">${tr('Materials in your built parts (from their recipes) plus the materials you carry. Propellant, supplies and the crew are not included.')}</p><div class="cgel">`+
  ek.map(k=>`<div><span>${RN[k]?tr(RN[k]):k}</span><div class="thbar"><i style="width:${(100*el[k]/emax).toFixed(1)}%"></i></div><b>${cgKg(el[k])}</b></div>`).join('')+'</div>';
 $('cgb').innerHTML=h;const box=$('cgb'),find=id=>cargoItems().find(r=>r.kind+':'+r.key===id);
 const prev=id=>{const r=find(id),p=box.querySelector(`[data-cgp="${id}"]`),v=+CG.val[id];if(!p)return;if(!r||!(v>0)){p.textContent='';return}const d2=cgDv(r,v);p.textContent=DR[di].f?' Δv → '+f1(d2/1e3,2)+' km/s':''};
 box.querySelectorAll('[data-cg]').forEach(x=>{x.oninput=()=>{CG.val[x.dataset.cg]=x.value;prev(x.dataset.cg)};prev(x.dataset.cg)});
 const drop=(id,all)=>{const r=find(id);if(!r)return;const n=all?r.n:+CG.val[id];if(!(n>0)){notify('⚠ '+tr('Type how much to drop first.'));return}
  const life=['oxygen','food','water'].includes(r.key)&&r.kind==='res';if(life){const L=lifeDays(),left=(r.n-Math.min(n,r.n))/Math.max(1e-9,r.n)*({oxygen:L.o2,food:L.food,water:L.wat}[r.key]);if(left<30&&!confirm(tr('The crew needs this to live. Drop it anyway?')))return}
  const d=jettison(r.kind,r.key,n);if(d>0){CG.val[id]='';notify('📦 '+tr('Jettisoned')+' '+(r.unit==='kg'?cgKg(d):Math.floor(d)+' '+tr(r.unit))+' '+tr('of')+' '+cgName(r)+'. '+tr('It drifts away along your orbit.'))}cargoDraw(true)};
 box.querySelectorAll('[data-cgx]').forEach(x=>x.onclick=()=>drop(x.dataset.cgx,false));box.querySelectorAll('[data-cga]').forEach(x=>x.onclick=()=>drop(x.dataset.cga,true));
 box.querySelectorAll('[data-cg]').forEach(x=>x.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();drop(x.dataset.cg,false)}e.stopPropagation()})}
ORB.on('ui',()=>cargoDraw(false));
{const b=$('cgbtn');if(b)b.onclick=()=>cargoToggle()}
