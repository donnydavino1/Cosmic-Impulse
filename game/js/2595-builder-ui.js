// ===== SHIP BUILDER (client): arrange modules along the spine, see what it does, then refit (key 7) =====
// Uses the rules in 0550-layout.js: layMetrics(order) for any draft, layRefit(order) to queue the refit job.
// The side view is an SVG drawn from the same module lengths and radii the rules use.
const BLDW=document.createElement('div');BLDW.id='bldw';BLDW.className='h';
BLDW.innerHTML='<div class="card"><h2>🧱 Ship Builder</h2><p class="opsn">Your modules in order from nose (left) to engine (right). Select one, move it, add trusses to spread the ship out. The layout changes how fast you turn, how hard you can thrust, and how much radiation reaches your crew.</p><div id="bldsv"></div><div id="bldb"></div><button id="bldc">Close (7)</button></div>';
document.body.appendChild(BLDW);$('bldc').onclick=()=>BLDW.classList.add('h');
const BLD={order:null,sel:0,n:0,last:0,designs:[]};try{BLD.designs=JSON.parse(localStorage.getItem('orbital-designs')||'[]')}catch(e){}
// a saved design is a list of module kinds (part ids, 'tanks', 'truss'), so it can be applied to any ship that has those parts
const bldTok=k=>k==='tanks'?'tanks':isTruss(k)?'truss':(layPart(k)||{}).id;
function bldFromDesign(toks){const left=s.lay.order.slice(),out=[];for(const t of toks){let i=left.findIndex(k=>bldTok(k)===t);if(i>=0){out.push(left.splice(i,1)[0])}else if(t==='truss')out.push('tnew'+(++BLD.n))}
 return out.concat(left.filter(k=>!isTruss(k)))}
function bldToggle(){BLDW.classList.toggle('h');if(!BLDW.classList.contains('h')){laySync();BLD.order=s.lay.order.slice();BLD.sel=0}bldDraw(true)}
function bldSvg(m){const W=660,H=150,L=m.L+5,k=(W-30)/L,cy=H/2,out=[];let crewX=null;
 out.push(`<line x1="10" y1="${cy}" x2="${W-10}" y2="${cy}" stroke="#2a3766" stroke-dasharray="3 4"/>`);
 m.mods.forEach((q,i)=>{const x0=12+(q.x-q.len/2)*k,w=Math.max(3,q.len*k),h=Math.max(8,Math.min(H*.42,q.r*k)),c=(LAYC[q.cat]||LAYC.truss).col,sel=i===BLD.sel;
  if(q.cat==='truss'){out.push(`<g data-i="${i}"><rect x="${x0}" y="${cy-h}" width="${w}" height="${2*h}" fill="rgba(0,0,0,0)" stroke="${sel?'#ffb84d':c}" stroke-width="${sel?2:1}"/><path d="M${x0} ${cy-h} L${x0+w} ${cy+h} M${x0} ${cy+h} L${x0+w} ${cy-h}" stroke="${c}"/></g>`)}
  else out.push(`<g data-i="${i}"><rect x="${x0}" y="${cy-h}" width="${w}" height="${2*h}" rx="${Math.min(6,h/2)}" fill="${c}" stroke="${sel?'#ffb84d':'#111'}" stroke-width="${sel?3:1}"/>${q.cat==='therm'?`<rect x="${x0+w/2-1.5}" y="${cy-h*2.3}" width="3" height="${h*4.6}" fill="${c}"/>`:''}<text x="${x0+w/2}" y="${cy+5}" text-anchor="middle" font-size="${Math.min(16,Math.max(9,w*.6))}">${w>9?q.ic:''}</text></g>`);
  if(q.cat==='life')crewX=12+q.x*k});
 const ex=12+m.L*k;out.push(`<path d="M${ex} ${cy-10} L${ex+18} ${cy-16} L${ex+18} ${cy+16} L${ex} ${cy+10} Z" fill="#555c68"/>`);
 const cx=12+m.xc*k;out.push(`<path d="M${cx-7} ${H-4} L${cx+7} ${H-4} L${cx} ${H-16} Z" fill="#5fe0ff"/><text x="${cx+10}" y="${H-5}" font-size="10" fill="#5fe0ff">CoM</text>`);
 if(crewX!=null&&m.reacD){const r=m.mods.find(q=>q.rad>0);if(r){const rx=12+r.x*k;out.push(`<path d="M${crewX} 14 L${rx} 14" stroke="#ff8a6a" stroke-dasharray="4 3"/><text x="${(crewX+rx)/2}" y="11" text-anchor="middle" font-size="10" fill="#ff8a6a">☢ ${f1(m.reacD,1)} m</text>`)}}
 return`<svg viewBox="0 0 ${W} ${H}" width="100%" style="background:#060a18;border-radius:8px;cursor:pointer">${out.join('')}</svg>`}
function bldDraw(force){if(BLDW.classList.contains('h')||!BLD.order)return;const now=performance.now();if(!force&&now-BLD.last<900)return;BLD.last=now;
 laySync();BLD.order=BLD.order.filter(k=>k.startsWith('tnew')||s.lay.order.includes(k));for(const k of s.lay.order)if(!BLD.order.includes(k)&&!isTruss(k))BLD.order.splice(BLD.order.length-1,0,k);
 const cur=SH.lay||layMetrics(s.lay.order),dr=layMetrics(BLD.order),q=dr.mods[BLD.sel]||dr.mods[0],gBase=SH.gmax/(cur.gF||1),R0=doseNow(),reacBase=R0.reac/(cur.reacF||1),shBase=Math.min(15,(s.res.water+s.fuel.chem+s.fuel.h2)/400);
 const row=(t,a,b,fmt,better)=>{const d=b-a,cl=better==='x'||Math.abs(d)<1e-9*(Math.abs(a)+1)?'':(better==='lo'?d<0:d>0)?'bld-up':'bld-dn';return`<tr><td>${t}</td><td>${fmt(a)}</td><td class="${cl}">${fmt(b)}</td></tr>`};
 const pending=s.jobs.some(j=>j.type==='refit'),same=BLD.order.join()===s.lay.order.join(),newT=BLD.order.filter(k=>k.startsWith('tnew')).length;
 $('bldsv').innerHTML=bldSvg(dr);
 const h=`<p><b>${q?q.ic+' '+q.n:''}</b> ${q?`· ${f1(q.m,0)} kg · ${f1(q.len,1)} m`:''}</p>
 <p><button data-b="nose">◀ Toward nose</button> <button data-b="tail">Toward tail ▶</button> <button data-b="addt">＋ Truss after this</button> <button data-b="delt" ${q&&q.cat==='truss'?'':'disabled'}>✕ Remove truss</button> <button data-b="reset">Undo changes</button></p>
 <table class="bldt"><tr><th></th><th>Now</th><th>Draft</th></tr>
 ${row('Length',cur.L,dr.L,v=>f1(v,1)+' m','x')}
 ${row('Mass',cur.mass,dr.mass,v=>f1(v/1e3,2)+' t','lo')}
 ${row('Centre of mass (from nose)',cur.xc,dr.xc,v=>f1(v,1)+' m','x')}
 ${row('180° turn',cur.flip,dr.flip,v=>dur(v),'lo')}
 ${row('Railgun re-aim',cur.flip/2,dr.flip/2,v=>dur(v),'lo')}
 ${row('Max acceleration',gBase*cur.gF,gBase*dr.gF,v=>f1(v,2)+' g','hi')}
 ${row('Reactor dose to crew',reacBase*cur.reacF*864e5,reacBase*dr.reacF*864e5,v=>(v>0&&v<.001?sci(v):f1(v,3))+' mSv/day','lo')}
 ${row('Storm shelter',shBase*cur.shelF,shBase*dr.shelF,v=>f1(v,1)+' g/cm²','hi')}</table>
 <p>${pending?'<b>🏭 <span>Refit in progress</span></b>':`<button data-b="apply" ${same?'disabled':''}>🔧 Refit to this layout</button>`} <small>${same?'':(newT?f1(newT*LAY.trussM,0)+' kg iron · ':'')+'<span>done by your fabricator</span>'}</small></p>
 <h4>💾 <span>Saved designs</span></h4><p>${BLD.designs.map((d,i)=>`<button data-b="load" data-i="${i}">${d.name}</button> <button data-b="del" data-i="${i}">✕</button>`).join(' ')||'<span class="opsn">None yet.</span>'} <button data-b="save">💾 Save this draft</button></p>
 <p class="opsn">Tips: a long truss between the crew and a reactor cuts its radiation by distance squared, and tanks in between block even more. Tanks next to the crew make the storm shelter work. A compact ship turns faster, and frames are rated for ships up to 25 m.</p>`;
 const b=$('bldb');if(b._h!==h){b._h=h;b.innerHTML=h}}
$('bldsv').addEventListener('click',e=>{const g=e.target.closest('[data-i]');if(g){BLD.sel=+g.dataset.i;bldDraw(true)}});
$('bldb').addEventListener('click',e=>{const x=e.target.closest('button');if(!x||x.disabled)return;const o=BLD.order,i=BLD.sel,op=x.dataset.b;
 if(op==='nose'&&i>0){[o[i-1],o[i]]=[o[i],o[i-1]];BLD.sel--}
 else if(op==='tail'&&i<o.length-1){[o[i+1],o[i]]=[o[i],o[i+1]];BLD.sel++}
 else if(op==='addt'){o.splice(i+1,0,'tnew'+(++BLD.n));BLD.sel=i+1}
 else if(op==='delt'&&isTruss(o[i])){o.splice(i,1);BLD.sel=Math.max(0,i-1)}
 else if(op==='reset'){BLD.order=s.lay.order.slice();BLD.sel=0}
 else if(op==='save'){const name=(prompt(tr('Name this design'),tr('Design')+' '+(BLD.designs.length+1))||'').trim().slice(0,30);if(name){BLD.designs.push({name,toks:o.map(bldTok)});try{localStorage.setItem('orbital-designs',JSON.stringify(BLD.designs))}catch(e){}}}
 else if(op==='load'){const d=BLD.designs[+x.dataset.i];if(d){BLD.order=bldFromDesign(d.toks);BLD.sel=0}}
 else if(op==='del'){BLD.designs.splice(+x.dataset.i,1);try{localStorage.setItem('orbital-designs',JSON.stringify(BLD.designs))}catch(e){}}
 else if(op==='apply'){const j=layRefit(o);if(j)notify('🔧 Refit queued: '+j.name+'.');else notify('⚠ Missing materials: '+f1(o.filter(k=>k.startsWith('tnew')).length*LAY.trussM,0)+' kg iron')}
 bldDraw(true)});
ORB.on('ui',()=>{try{bldDraw()}catch(e){console.warn('builder',e)}});
ORB.on('job:done',j=>{if(j.type==='refit'&&BLD.order){BLD.order=s.lay.order.slice();BLD.sel=0;bldDraw(true)}});
