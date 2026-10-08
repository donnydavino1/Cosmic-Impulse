// ===== SHIP BUILDER (client): arrange modules along the spine, see what it does, then refit (key 7) =====
// Uses the rules in 0550-layout.js: layMetrics(order) for any draft, layRefit(order) to queue the refit job.
// The side view is an SVG drawn from the same module lengths and radii the rules use.
const BLDW=document.createElement('div');BLDW.id='bldw';BLDW.className='h';
BLDW.innerHTML='<div class="card"><h2>🧱 Ship Builder</h2><p class="opsn">Your modules in order from nose (left) to engine (right). Select one, move it, mount it beside the spine, or add trusses to spread the ship out. The layout changes how fast you turn, how hard you can thrust, and how much radiation reaches your crew.</p><div id="bldsv"></div><div id="bldb"></div><button id="bldc">Close (7)</button></div>';
document.body.appendChild(BLDW);$('bldc').onclick=()=>BLDW.classList.add('h');
const BLD={order:null,rad:{},sel:null,n:0,last:0,designs:[]};try{BLD.designs=JSON.parse(localStorage.getItem('orbital-designs')||'[]')}catch(e){}
// a saved design is a list of module kinds (part ids, 'tanks', 'truss') plus radial mounts by kind, so it can be
// applied to any ship that has those parts
const bldTok=k=>k==='tanks'?'tanks':isTruss(k)?'truss':(layPart(k)||{}).id;
function bldFromDesign(d){const all=s.lay.order.concat(Object.keys(s.lay.rad||{})),left=all.filter(k=>!isTruss(k)),out=[],rad={};
 for(const t of d.toks){let i=left.findIndex(k=>bldTok(k)===t);if(i>=0)out.push(left.splice(i,1)[0]);else if(t==='truss')out.push('tnew'+(++BLD.n))}
 for(const [t,hi] of d.rad||[]){const i=left.findIndex(k=>bldTok(k)===t),h=out[hi];if(i>=0&&h)rad[left.splice(i,1)[0]]=h}
 return{order:out.concat(left),rad}}
function bldToggle(){BLDW.classList.toggle('h');if(!BLDW.classList.contains('h')){laySync();BLD.order=s.lay.order.slice();BLD.rad=Object.assign({},s.lay.rad||{});BLD.sel=BLD.order[0]}bldDraw(true)}
function bldSvg(m){const W=660,H=170,L=m.L+5,k=(W-30)/L,cy=H/2,out=[];let crewX=null;BLD.geo={W,H,cy,spine:(m.spine||m.mods).map(q=>({k:q.k,x:12+q.x*k}))};
 out.push(`<line x1="10" y1="${cy}" x2="${W-10}" y2="${cy}" stroke="#2a3766" stroke-dasharray="3 4"/>`);
 const draw=(q,x0,yc,w,h)=>{const c=(LAYC[q.cat]||LAYC.truss).col,sel=q.k===BLD.sel;
  if(q.cat==='truss')return`<g data-k="${q.k}"><rect x="${x0}" y="${yc-h}" width="${w}" height="${2*h}" fill="rgba(0,0,0,0)" stroke="${sel?'#ffb84d':c}" stroke-width="${sel?2:1}"/><path d="M${x0} ${yc-h} L${x0+w} ${yc+h} M${x0} ${yc+h} L${x0+w} ${yc-h}" stroke="${c}"/></g>`;
  const pp=q.k&&q.k[0]==='p'?layPart(q.k):null,dmg=pp&&pp.cond<.6;
  return`<g data-k="${q.k}"${dmg?' opacity="0.75"':''}><rect x="${x0}" y="${yc-h}" width="${w}" height="${2*h}" rx="${Math.min(6,h/2)}" fill="${dmg?'#7a5148':c}" stroke="${sel?'#ffb84d':'#111'}" stroke-width="${sel?3:1}"/>${q.cat==='therm'&&!q.radial?`<rect x="${x0+w/2-1.5}" y="${yc-h*2.3}" width="3" height="${h*4.6}" fill="${c}"/>`:''}<text x="${x0+w/2}" y="${yc+5}" text-anchor="middle" font-size="${Math.min(16,Math.max(9,w*.6))}">${w>9?q.ic:''}</text></g>`};
 (m.spine||m.mods).forEach(q=>{const x0=12+(q.x-q.len/2)*k,w=Math.max(3,q.len*k),h=Math.max(8,Math.min(H*.3,q.r*k));out.push(draw(q,x0,cy,w,h));if(q.cat==='life')crewX=12+q.x*k});
 // radial modules: drawn above (or below) their host, joined by a strut; the side view shows their up/down offset
 for(const q of m.radial||[]){const w=Math.max(3,q.len*k),h=Math.max(6,Math.min(H*.18,q.r*k)),x0=12+(q.x-q.len/2)*k,up=Math.sin(q.ang)>=-.01,yc=up?h+6:H-h-20;
  out.push(`<line x1="${12+q.x*k}" y1="${cy}" x2="${12+q.x*k}" y2="${yc}" stroke="#4a5059" stroke-width="2"/>`);out.push(draw(q,x0,yc,w,h));if(q.cat==='life')crewX=12+q.x*k}
 const ex=12+m.L*k;out.push(`<path d="M${ex} ${cy-10} L${ex+18} ${cy-16} L${ex+18} ${cy+16} L${ex} ${cy+10} Z" fill="#555c68"/>`);
 const cx=12+m.xc*k;out.push(`<path d="M${cx-7} ${H-4} L${cx+7} ${H-4} L${cx} ${H-16} Z" fill="#5fe0ff"/><text x="${cx+10}" y="${H-5}" font-size="10" fill="#5fe0ff">CoM</text>`);
 if(crewX!=null&&m.reacD){const r=m.mods.find(q=>q.rad>0);if(r){const rx=12+r.x*k;out.push(`<path d="M${crewX} 14 L${rx} 14" stroke="#ff8a6a" stroke-dasharray="4 3"/><text x="${(crewX+rx)/2}" y="11" text-anchor="middle" font-size="10" fill="#ff8a6a">☢ ${f1(m.reacD,1)} m</text>`)}}
 return`<svg id="bldside" viewBox="0 0 ${W} ${H}" width="100%" style="background:#060a18;border-radius:8px;cursor:pointer;touch-action:none">${out.join('')}</svg>`}
// end view: looking along the ship at the selected module's ring of mounted modules
function bldEnd(m){const q=m.mods.find(x=>x.k===BLD.sel);if(!q)return'';const host=q.radial?m.mods.find(h=>h.k===q.host):q,ring=m.radial.filter(r=>r.host===host.k),S=60,ext=Math.max(host.r,...ring.map(r=>r.off+r.r))+.5,k=(S-6)/ext,out=[];
 out.push(`<circle cx="${S}" cy="${S}" r="${host.r*k}" fill="${(LAYC[host.cat]||LAYC.truss).col}" stroke="${host.k===BLD.sel?'#ffb84d':'#111'}" stroke-width="2"/><text x="${S}" y="${S+5}" text-anchor="middle" font-size="14">${host.ic}</text>`);
 for(const r of ring){const x=S+Math.cos(r.ang)*r.off*k,y=S-Math.sin(r.ang)*r.off*k;out.push(`<line x1="${S}" y1="${S}" x2="${x}" y2="${y}" stroke="#4a5059" stroke-width="2"/><g data-k="${r.k}"><circle cx="${x}" cy="${y}" r="${Math.max(5,r.r*k)}" fill="${(LAYC[r.cat]||LAYC.truss).col}" stroke="${r.k===BLD.sel?'#ffb84d':'#111'}" stroke-width="2"/><text x="${x}" y="${y+4}" text-anchor="middle" font-size="11">${r.ic}</text></g>`)}
 return`<svg viewBox="0 0 ${2*S} ${2*S}" width="120" height="120" style="background:#060a18;border-radius:8px;flex:none">${out.join('')}</svg>`}
const bldSame=()=>BLD.order.join()===s.lay.order.join()&&JSON.stringify(Object.entries(BLD.rad).sort())===JSON.stringify(Object.entries(s.lay.rad||{}).sort());
function bldDraw(force){if(BLDW.classList.contains('h')||!BLD.order)return;const now=performance.now();if(!force&&now-BLD.last<900)return;BLD.last=now;
 laySync();const known=new Set(s.lay.order.concat(Object.keys(s.lay.rad||{})));
 BLD.order=BLD.order.filter(k=>k.startsWith('tnew')||known.has(k));for(const k in BLD.rad)if(!known.has(k)||!BLD.order.includes(BLD.rad[k]))delete BLD.rad[k];
 for(const k of known)if(!BLD.order.includes(k)&&!BLD.rad[k]&&!isTruss(k))BLD.order.push(k);
 const cur=SH.lay||layMetrics(s.lay.order,s.lay.rad),dr=layMetrics(BLD.order,BLD.rad);if(!dr.mods.some(q=>q.k===BLD.sel))BLD.sel=BLD.order[0];
 const q=dr.mods.find(q=>q.k===BLD.sel),gBase=SH.gmax/(cur.gF||1),R0=doseNow(),reacBase=R0.reac/(cur.reacF||1),shBase=Math.min(15,(s.res.water+s.fuel.chem+s.fuel.h2)/400);
 const row=(t,a,b,fmt,better)=>{const d=b-a,cl=better==='x'||Math.abs(d)<1e-9*(Math.abs(a)+1)?'':(better==='lo'?d<0:d>0)?'bld-up':'bld-dn';return`<tr><td>${t}</td><td>${fmt(a)}</td><td class="${cl}">${fmt(b)}</td></tr>`};
 const pending=s.jobs.some(j=>j.type==='refit'),same=bldSame(),newT=BLD.order.filter(k=>k.startsWith('tnew')).length,onSpine=q&&!q.radial,ix=BLD.order.indexOf(BLD.sel);
 if(!BLD.drag||!BLD.drag.moved)$('bldsv').innerHTML=`<div style="display:flex;gap:8px;align-items:center"><div style="flex:1">${bldSvg(dr)}</div><div style="text-align:center">${bldEnd(dr)}<div class="opsn">End view</div></div></div><div class="opsn">Drag a module along the line to reorder it, or above/below the line to mount it beside another.</div><canvas id=\"bldprev\" width=\"1320\" height=\"340\"></canvas>`;if(!BLD.drag||!BLD.drag.moved)bldPreview(dr);
 const qp=q&&q.k&&q.k[0]==='p'?layPart(q.k):null,uc=qp?upgCost(qp):null,host=q&&q.radial?dr.mods.find(h=>h.k===q.host):null,nOn=q&&q.radial?dr.radial.filter(r=>r.host===q.host).length:0;
 const h=`<p><b>${q?q.ic+' '+q.n:''}</b> ${q?`· ${f1(q.m,0)} kg · ${f1(q.len,1)} m`:''}${qp?` · <b>${MKN(qp.mk)}</b>`:''}${host?` · <span>mounted beside</span> ${host.ic} ${host.n} (${nOn}× <span>symmetry</span>)`:''}${(()=>{const ex=layExposure(dr),tot=ex.reduce((a,e)=>a+e.w,0)||1,me=ex.find(e=>e.q.k===BLD.sel);return me?` · <span>takes</span> ${Math.round(100*me.w/tot)} % <span>of hits</span>`:''})()}${qp&&qp.cond<1?` · <span>condition</span> ${Math.round(qp.cond*100)} %${qp.fail?' ⚠':''}`:''}</p>
 ${qp?`<p class="bldup">${uc?`<button data-b="upg" ${uc.haveT<uc.needT?'disabled':''}>⬆ <span>Upgrade to</span> ${MKN(uc.mk)}</button> <small>${UPG_TXT[PARTS[qp.id].cat]||''} · ${Object.entries(uc.mat).map(([k,v])=>f1(v,v<1?2:0)+' kg '+k).join(', ')} · ${sci(uc.J)} J${uc.haveT<uc.needT?` · <span>needs</span> ${uc.needT} <span>technologies</span> (${uc.haveT})`:''}</small>`:'<small>✓ <span>Fully upgraded</span> (Mk V)</small>'}</p>`:''}
 <p>${onSpine?`<button data-b="nose" ${ix>0?'':'disabled'}>◀ Toward nose</button> <button data-b="tail" ${ix<BLD.order.length-1?'':'disabled'}>Toward tail ▶</button> <button data-b="addt">＋ Truss after this</button> <button data-b="delt" ${q&&q.cat==='truss'?'':'disabled'}>✕ Remove truss</button> <button data-b="mount" ${q&&q.cat!=='truss'&&q.k!=='w:rail'&&BLD.order.length>1?'':'disabled'}>⤴ Mount beside the module in front</button>`
  :`<button data-b="hnose">◀ Move to the module in front</button> <button data-b="htail">Move to the module behind ▶</button> <button data-b="unmount">⤵ Back onto the spine</button>`} <button data-b="reset">Undo changes</button></p>
 <table class="bldt"><tr><th></th><th>Now</th><th>Draft</th></tr>
 ${row('Length',cur.L,dr.L,v=>f1(v,1)+' m','x')}
 ${row('Mass',cur.mass,dr.mass,v=>f1(v/1e3,2)+' t','lo')}
 ${row('Centre of mass (from nose)',cur.xc,dr.xc,v=>f1(v,1)+' m','x')}
 ${row('180° turn',cur.flip,dr.flip,v=>dur(v),'lo')}
 ${row('Railgun re-aim',cur.flip/2,dr.flip/2,v=>dur(v),'lo')}
 ${row('Max acceleration',gBase*cur.gF,gBase*dr.gF,v=>f1(v,2)+' g','hi')}
 ${row('Reactor dose to crew',reacBase*cur.reacF*864e5,reacBase*dr.reacF*864e5,v=>(v>0&&v<.001?sci(v):f1(v,3))+' mSv/day','lo')}
 ${row('Storm shelter',shBase*cur.shelF,shBase*dr.shelF,v=>f1(v,1)+' g/cm²','hi')}
 ${(()=>{const D=DR[di],fu=D.f?s.fuel[D.f]||0:0;if(!D.ve||!D.f)return'';const dv=M=>D.ve*Math.log(M/Math.max(1,M-fu));return row('Δv with this fuel',dv(cur.mass),dv(dr.mass),v=>f1(v/1e3,2)+' km/s','hi')})()}</table>
 <p>${pending?'<b>🏭 <span>Refit in progress</span></b>':`<button data-b="apply" ${same?'disabled':''}>🔧 Refit to this layout</button>`} <small>${same?'':(newT?f1(newT*LAY.trussM,0)+' kg iron · ':'')+'<span>done by your fabricator</span>'}</small></p>
 <h4>🚀 <span>Engines at the tail</span></h4><p>${DR.map((E,i)=>isU(E.id)?`<span class="bldeng${i===di?' on':''}">${E.ic||'🚀'} ${E.n} Mk ${E.mk||1} · ${f1(engMass(E,i===di?PW:E.pw),0)} kg ${i===di?'· <b>✓ <span>in use</span></b>':`<button data-b="euse" data-e="${i}">Use</button> <button data-b="escr" data-e="${i}">♻</button>`}</span>`:'').join(' ')}</p>
 <p class="opsn">All your engines sit at the tail: unused ones still add mass there. Weapons are modules too: turrets mount beside a module, and the railgun lies along the spine (the whole ship aims it).</p>
 <h4>🧩 <span>Add a part</span></h4><p><button data-b="design">🧪 Design a new part</button></p><p>${Object.entries(CATN).map(([c,n])=>`<button data-b="cat" data-c="${c}" class="${BLD.cat===c?'bldsel':''}">${n}</button>`).join(' ')}</p>
 ${BLD.cat?`<div class="bldcat">${Object.entries(PARTS).filter(([k,d])=>d.cat===BLD.cat).map(([k,d])=>{const ok=hasT(d.req),hostOK=onSpine&&q&&q.cat!=='truss'&&!d.one&&d.cat!=='frame';
  return`<div class="bldpi${ok?'':' bldlock'}"><b>${d.n}</b> <small>${f1(d.m,0)} kg · ${Object.entries(d.mat||{}).map(([m,v])=>f1(v,v<1?2:0)+' kg '+m).join(', ')} · ${sci(d.J||0)} J${ok?'':' · 🔒 <span>research</span> '+(TECH.find(t=>t.id===d.req)||{n:d.req}).n}</small><br>
  ${ok?`<button data-b="bld" data-p="${k}">🏭 Build</button> ${hostOK?`<button data-b="bld1" data-p="${k}">⤴ <span>Build beside</span> ${q.ic}</button> <button data-b="bld2" data-p="${k}">⤴⤴ <span>Build a mirrored pair beside</span> ${q.ic}</button>`:''}`:''}</div>`}).join('')}</div>`:''}
 ${qp&&PARTS[qp.id].cat!=='frame'?`<p><button data-b="scrap">♻ <span>Recycle this part (50 % of its materials back)</span></button></p>`:''}
 <h4>💾 <span>Saved designs</span></h4><p>${BLD.designs.map((d,i)=>`<button data-b="load" data-i="${i}">${d.name}</button> <button data-b="del" data-i="${i}">✕</button>`).join(' ')||'<span class="opsn">None yet.</span>'} <button data-b="save">💾 Save this draft</button></p>
 <p class="opsn">Tips: a long truss between the crew and a reactor cuts its radiation by distance squared, and tanks in between block even more. Tanks next to the crew make the storm shelter work, and tanks mounted around the crew cabin work best. Mounting modules beside the spine makes the ship shorter: it turns faster and can thrust harder. Several modules on one host spread evenly around it (2 = mirrored, 3 = triangle, 4 = cross).</p>`;
 const b=$('bldb');if(b._h!==h){b._h=h;b.innerHTML=h}}
$('bldsv').addEventListener('click',e=>{if(BLD.dragged){BLD.dragged=false;return}const g=e.target.closest('[data-k]');if(g){BLD.sel=g.dataset.k;bldDraw(true)}});
// drag and drop in the side view: along the line reorders, above or below the line mounts beside the nearest module
$('bldsv').addEventListener('pointerdown',e=>{const g=e.target.closest('#bldside [data-k]');if(!g)return;BLD.drag={k:g.dataset.k,x:e.clientX,y:e.clientY,g,moved:false};g.setPointerCapture&&g.setPointerCapture(e.pointerId)});
$('bldsv').addEventListener('pointermove',e=>{const D=BLD.drag;if(!D)return;const dx=e.clientX-D.x,dy=e.clientY-D.y;if(!D.moved&&Math.hypot(dx,dy)<6)return;D.moved=true;
 const sv=$('bldside'),r=sv.getBoundingClientRect(),sc=BLD.geo.W/r.width;D.g.setAttribute('transform',`translate(${dx*sc},${dy*sc})`);D.g.style.opacity=.7});
addEventListener('pointerup',e=>{const D=BLD.drag;BLD.drag=null;if(!D||!D.moved)return;BLD.dragged=true;const sv=$('bldside');if(!sv)return;const r=sv.getBoundingClientRect(),G=BLD.geo,sx=(e.clientX-r.left)/r.width*G.W,sy=(e.clientY-r.top)/r.height*G.H;
 const o=BLD.order,R=BLD.rad,k=D.k;if((isTruss(k)||k==='w:rail')&&Math.abs(sy-G.cy)>G.H*.22){bldDraw(true);return}
 const wasSpine=o.indexOf(k);if(wasSpine>=0)o.splice(wasSpine,1);delete R[k];
 const sp=G.spine.filter(p=>p.k!==k&&o.includes(p.k));
 if(Math.abs(sy-G.cy)>G.H*.22&&sp.length){let best=sp[0];for(const p of sp)if(Math.abs(p.x-sx)<Math.abs(best.x-sx))best=p;for(const c in R)if(R[c]===k)R[c]=best.k;R[k]=best.k}
 else{const before=sp.filter(p=>p.x<sx).length,at=before?o.indexOf(sp[before-1].k)+1:0;o.splice(at,0,k);if(wasSpine<0)0;else for(const c in R)if(R[c]===k)0}
 BLD.sel=k;bldDraw(true)});
$('bldb').addEventListener('click',e=>{const x=e.target.closest('button');if(!x||x.disabled)return;const o=BLD.order,R=BLD.rad,k=BLD.sel,i=o.indexOf(k),op=x.dataset.b;
 if(op==='nose'&&i>0){[o[i-1],o[i]]=[o[i],o[i-1]]}
 else if(op==='tail'&&i>=0&&i<o.length-1){[o[i+1],o[i]]=[o[i],o[i+1]]}
 else if(op==='addt'&&i>=0){const t='tnew'+(++BLD.n);o.splice(i+1,0,t);BLD.sel=t}
 else if(op==='delt'&&isTruss(k)){o.splice(i,1);for(const r in R)if(R[r]===k)delete R[r];BLD.sel=o[Math.max(0,i-1)]}
 else if(op==='mount'&&i>=0){const host=o[i>0?i-1:1];o.splice(i,1);for(const r in R)if(R[r]===k)R[r]=host;R[k]=host}
 else if((op==='hnose'||op==='htail')&&R[k]){const hi=o.indexOf(R[k]),ni=hi+(op==='hnose'?-1:1);if(ni>=0&&ni<o.length)R[k]=o[ni]}
 else if(op==='unmount'&&R[k]){const hi=o.indexOf(R[k]);delete R[k];o.splice(hi+1,0,k)}
 else if(op==='euse'){setDrive(+x.dataset.e);recalc()}
 else if(op==='escr'){const E=DR[+x.dataset.e];if(E&&confirm(tr('Scrap this engine')+'? '+E.n)){scrapEng(E.id);recalc()}}
 else if(op==='design'){desToggle()}
 else if(op==='cat'){BLD.cat=BLD.cat===x.dataset.c?null:x.dataset.c}
 else if(op==='bld'||op==='bld1'||op==='bld2'){const pk=x.dataset.p,d=PARTS[pk],n=op==='bld2'?2:1;let ok=0;for(let c=0;c<n;c++){const j={type:'part',id:pk,mat:{...d.mat},name:d.n,J:d.J};if(op!=='bld')j.place=k;if(queueJob(j))ok++}
  notify(ok?'🏭 '+(ok>1?ok+' × ':'')+d.n+' '+tr('queued')+(op==='bld'?'.':' → '+tr('mounted beside the selected module when finished.')):'⚠ Missing materials: '+Object.entries(d.mat||{}).map(([m,v])=>f1(v,0)+' kg '+m).join(', '))}
 else if(op==='scrap'){const qp=layPart(k);if(qp&&confirm(tr('Recycle this part (50 % of its materials back)')+'?')){scrapPart(qp.uid);recalc();BLD.order=BLD.order.filter(z=>z!==k);delete R[k];BLD.sel=BLD.order[0]}}
 else if(op==='reset'){BLD.order=s.lay.order.slice();BLD.rad=Object.assign({},s.lay.rad||{});BLD.sel=BLD.order[0]}
 else if(op==='upg'){const qp=layPart(k);const r=qp?upgPart(qp.uid):'none';notify(r==='ok'?'⬆ Upgrade queued: '+PARTS[qp.id].n+'.':r==='mat'?'⚠ Not enough materials for this upgrade.':r==='busy'?'⏳ That part is already being upgraded.':'⚠ Cannot upgrade that.')}
 else if(op==='save'){const name=(prompt(tr('Name this design'),tr('Design')+' '+(BLD.designs.length+1))||'').trim().slice(0,30);if(name){BLD.designs.push({name,toks:o.map(bldTok),rad:Object.entries(R).map(([r,h])=>[bldTok(r),o.indexOf(h)])});try{localStorage.setItem('orbital-designs',JSON.stringify(BLD.designs))}catch(e){}}}
 else if(op==='load'){const d=BLD.designs[+x.dataset.i];if(d){const r=bldFromDesign(d);BLD.order=r.order;BLD.rad=r.rad;BLD.sel=BLD.order[0]}}
 else if(op==='del'){BLD.designs.splice(+x.dataset.i,1);try{localStorage.setItem('orbital-designs',JSON.stringify(BLD.designs))}catch(e){}}
 else if(op==='apply'){const j=layRefit(o,R);if(j)notify('🔧 Refit queued: '+j.name+'.');else notify('⚠ Missing materials: '+f1(o.filter(k=>k.startsWith('tnew')).length*LAY.trussM,0)+' kg iron')}
 bldDraw(true)});
ORB.on('ui',()=>{try{bldDraw()}catch(e){console.warn('builder',e)}});
ORB.on('job:done',j=>{if(j.type==='refit'&&BLD.order){BLD.order=s.lay.order.slice();BLD.rad=Object.assign({},s.lay.rad||{});BLD.sel=BLD.order[0];bldDraw(true)}});
// ===== rendered preview: the draft drawn as a lit, 3D-looking ship (oblique view, light from the upper left) =====
function bldPreview(m){const cv=$('bldprev');if(!cv)return;const x=cv.getContext('2d'),W=cv.width,H=cv.height;x.clearRect(0,0,W,H);
 const bg=x.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#04060c');bg.addColorStop(1,'#0b0f1c');x.fillStyle=bg;x.fillRect(0,0,W,H);
 for(let i=0;i<90;i++){x.fillStyle=`rgba(255,255,255,${(.15+.6*((i*7)%10)/10).toFixed(2)})`;x.fillRect((i*211)%W,(i*61+i*i*3)%H,1.3,1.3)}
 const ext=Math.max(...m.mods.map(q=>(q.off||0)+(q.cat==='therm'?Math.min(9,((PARTS[q.id]||{}).A||60)/8)+.6:q.cat==='sensor'?q.r*2:q.r)),3),L=m.L+7,k=Math.min((W-200)/L,(H*.44)/ext),cy=H*.52,X0=Math.max(40,(W-L*k)/2);
 const P=(X,Y,Z)=>[X0+X*k+Z*k*.42,cy-Y*k-Z*k*.22];
 const hull=CUST.hull||'#d9dcdf',col=q=>q.cat==='tanks'?'#c8a24a':q.cat==='gen'?'#7d8590':q.cat==='store'?'#5c636d':q.cat==='shield'?'#a7a093':hull;
 const shade=(c,f)=>{const n=parseInt(c.slice(1),16),r=(n>>16)&255,g=(n>>8)&255,b=n&255;return`rgb(${Math.round(Math.min(255,r*f))},${Math.round(Math.min(255,g*f))},${Math.round(Math.min(255,b*f))})`};
 const cyl=(xa,xb,Y,Z,r,c,q)=>{const a=P(xa,Y,Z),b=P(xb,Y,Z),rx=r*k*.42,ry=r*k;
  const g=x.createLinearGradient(0,a[1]-ry,0,a[1]+ry);g.addColorStop(0,shade(c,1.3));g.addColorStop(.3,shade(c,1));g.addColorStop(1,shade(c,.3));
  x.fillStyle=g;x.beginPath();x.moveTo(a[0],a[1]-ry);x.lineTo(b[0],b[1]-ry);x.ellipse(b[0],b[1],rx,ry,0,-Math.PI/2,Math.PI/2);x.lineTo(a[0],a[1]+ry);x.ellipse(a[0],a[1],rx,ry,0,Math.PI/2,-Math.PI/2,true);x.fill();
  if(q&&q.cat==='tanks'){x.strokeStyle='rgba(255,240,200,.22)';for(let t=a[0]+4;t<b[0];t+=6){x.beginPath();x.moveTo(t,a[1]-ry*.9);x.lineTo(t+3,a[1]+ry*.9);x.stroke()}}
  if(q&&(q.cat==='life'||q.cat==='lab')){x.fillStyle='rgba(8,16,30,.92)';for(let t=0;t<3;t++){const wx=a[0]+(b[0]-a[0])*(.25+t*.25);x.fillRect(wx-3,a[1]-ry*.55,6,ry*.3)}}
  x.strokeStyle='rgba(0,0,0,.3)';x.lineWidth=1;for(let t=1;t<4;t++){const sx=a[0]+(b[0]-a[0])*t/4;x.beginPath();x.moveTo(sx,a[1]-ry);x.lineTo(sx,a[1]+ry);x.stroke()}
  const cg=x.createRadialGradient(a[0]-rx*.3,a[1]-ry*.4,1,a[0],a[1],ry);cg.addColorStop(0,shade(c,1.2));cg.addColorStop(1,shade(c,.5));x.fillStyle=cg;x.beginPath();x.ellipse(a[0],a[1],rx,ry,0,0,7);x.fill();
  if(q&&q.k===BLD.sel){x.strokeStyle='#ffb84d';x.lineWidth=2;x.beginPath();x.ellipse(a[0],a[1],rx+3,ry+3,0,0,7);x.stroke();x.lineWidth=1}};
 const draw=q=>{const Y=q.radial?Math.sin(q.ang)*q.off:0,Z=q.radial?Math.cos(q.ang)*q.off:0,xa=q.x-q.len/2,xb=q.x+q.len/2;
  if(q.radial){const a=P(q.x,0,0),b=P(q.x,Y,Z);x.strokeStyle='#4a5059';x.lineWidth=3;x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.stroke();x.lineWidth=1}
  if(q.cat==='truss'){x.strokeStyle='#8b929c';for(const[y,z]of[[.7,.7],[-.7,.7],[.7,-.7],[-.7,-.7]]){const a=P(xa,y,z),b=P(xb,y,z);x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.stroke()}
   for(let t=0;t<4;t++){const u0=xa+(xb-xa)*t/4,u1=xa+(xb-xa)*(t+1)/4,a=P(u0,.7,.7),b=P(u1,-.7,.7),c=P(u0,-.7,-.7),d=P(u1,.7,-.7);x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.moveTo(c[0],c[1]);x.lineTo(d[0],d[1]);x.stroke()}return}
  if(q.cat==='therm'){cyl(xa,xb,Y,Z,.5,'#5c636d');const A=(PARTS[q.id]||{}).A||60,h=Math.min(9,A/8);for(const sg of[1,-1]){const a=P(xa+.2,Y+sg*.6,Z),b=P(xb-.2,Y+sg*.6,Z),c=P(xb-.2,Y+sg*(h+.6),Z),d=P(xa+.2,Y+sg*(h+.6),Z);
    const g=x.createLinearGradient(a[0],a[1],d[0],d[1]);g.addColorStop(0,'#c5ccd2');g.addColorStop(1,'#f4f6f8');x.fillStyle=g;x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.lineTo(c[0],c[1]);x.lineTo(d[0],d[1]);x.closePath();x.fill();
    x.strokeStyle='rgba(110,120,130,.55)';for(let t=1;t<6;t++){const u=xa+.2+(xb-xa-.4)*t/6,p1=P(u,Y+sg*.6,Z),p2=P(u,Y+sg*(h+.6),Z);x.beginPath();x.moveTo(p1[0],p1[1]);x.lineTo(p2[0],p2[1]);x.stroke()}}return}
  if(q.cat==='weapon'){if(q.id==='rail'){for(const s2 of[.35,-.35]){const a=P(xa,Y+s2,Z),b=P(xb+1.5,Y+s2,Z);x.strokeStyle='#8b929c';x.lineWidth=Math.max(2,k*.18);x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.stroke()}x.lineWidth=1;cyl(xa,xa+1,Y,Z,.6,'#4a5059');return}
   cyl(xa,xb,Y,Z,.45,'#4a5059');const c=P(q.x,Y+(Y>=0?.5:-.5),Z),e=P(q.x-1.6,Y+(Y>=0?.7:-.7),Z);x.fillStyle='#5c636d';x.beginPath();x.arc(c[0],c[1],.45*k,0,7);x.fill();x.strokeStyle='#2b2f35';x.lineWidth=Math.max(2,k*.16);x.beginPath();x.moveTo(c[0],c[1]);x.lineTo(e[0],e[1]);x.stroke();x.lineWidth=1;
   if(q.k===BLD.sel){x.strokeStyle='#ffb84d';x.lineWidth=2;x.beginPath();x.arc(c[0],c[1],.45*k+3,0,7);x.stroke();x.lineWidth=1}return}
  if(q.cat==='sensor'){cyl(xa,xb,Y,Z,.4,'#5c636d');const c=P(q.x,Y+q.r*1.4,Z),g=x.createRadialGradient(c[0]-6,c[1]-6,2,c[0],c[1],q.r*k*1.2);g.addColorStop(0,'#ffffff');g.addColorStop(1,'#9aa1a8');x.fillStyle=g;x.beginPath();x.ellipse(c[0],c[1],q.r*k*1.2,q.r*k*.5,-.3,0,7);x.fill();return}
  if(q.cat==='fab'){const a=P(xa,Y+q.r*.9,Z),b=P(xb,Y-q.r*.9,Z),g=x.createLinearGradient(0,a[1],0,b[1]);g.addColorStop(0,shade(hull,1.2));g.addColorStop(1,shade(hull,.42));x.fillStyle=g;x.fillRect(a[0],a[1],b[0]-a[0],b[1]-a[1]);
   const t=P(xa,Y+q.r*.9,Z+q.r*.9),u=P(xb,Y+q.r*.9,Z+q.r*.9);x.fillStyle=shade(hull,1.4);x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(P(xb,Y+q.r*.9,Z)[0],a[1]);x.lineTo(u[0],u[1]);x.lineTo(t[0],t[1]);x.closePath();x.fill();
   if(q.k===BLD.sel){x.strokeStyle='#ffb84d';x.lineWidth=2;x.strokeRect(a[0]-2,a[1]-2,b[0]-a[0]+4,b[1]-a[1]+4);x.lineWidth=1}return}
  cyl(xa,xb,Y,Z,q.r,col(q),q);
  const pp=q.k&&q.k[0]==='p'?layPart(q.k):null,mk=pp?(pp.mk||1)-1:0;for(let b2=0;b2<mk;b2++){const a=P(xb-.25-b2*.3,Y,Z);x.strokeStyle=CUST.acc||'#c8a24a';x.lineWidth=2;x.beginPath();x.ellipse(a[0],a[1],q.r*k*.42+1,q.r*k+1,0,0,7);x.stroke();x.lineWidth=1}};
 const back=m.radial.filter(q=>Math.cos(q.ang)<-.01),front=m.radial.filter(q=>Math.cos(q.ang)>=-.01);
 back.forEach(draw);
 // the engine bell at the tail and a faint exhaust glow
 {const others=DR.filter((E,i)=>i!==di&&isU(E.id)).length;for(let o2=0;o2<others;o2++){const ang=Math.PI/2+o2*2*Math.PI/Math.max(1,others),a=P(m.L+.3,Math.sin(ang)*1.6,Math.cos(ang)*1.6),b=P(m.L+1.8,Math.sin(ang)*1.9,Math.cos(ang)*1.9);x.fillStyle='#3a3f46';x.beginPath();x.moveTo(a[0],a[1]-.3*k);x.lineTo(b[0],b[1]-.6*k);x.lineTo(b[0],b[1]+.6*k);x.lineTo(a[0],a[1]+.3*k);x.closePath();x.fill()}}
 {const a=P(m.L+.2,0,0),b=P(m.L+3.4,0,0),r0=1*k,r1=2.2*k,g=x.createLinearGradient(0,a[1]-r1,0,a[1]+r1);g.addColorStop(0,'#9aa1a8');g.addColorStop(.4,'#4a5059');g.addColorStop(1,'#16191e');
  x.fillStyle=g;x.beginPath();x.moveTo(a[0],a[1]-r0);x.lineTo(b[0],b[1]-r1);x.lineTo(b[0],b[1]+r1);x.lineTo(a[0],a[1]+r0);x.closePath();x.fill();
  const pg=x.createLinearGradient(b[0],0,b[0]+130,0);pg.addColorStop(0,'rgba(255,190,120,.35)');pg.addColorStop(1,'rgba(255,190,120,0)');x.fillStyle=pg;x.beginPath();x.moveTo(b[0],b[1]-r1*.8);x.lineTo(b[0]+130,b[1]-r1*.3);x.lineTo(b[0]+130,b[1]+r1*.3);x.lineTo(b[0],b[1]+r1*.8);x.fill()}
 m.spine.slice().reverse().forEach(draw);front.forEach(draw);
 x.fillStyle='rgba(200,215,235,.75)';x.font='13px ui-monospace,monospace';x.fillText(`${f1(m.L,1)} m · ${f1(m.mass/1e3,1)} t`,12,H-12)}
