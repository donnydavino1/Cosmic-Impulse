// ===== PART UPGRADES (RULES): every installed part can be refined from Mk I to Mk V =====
// Each step improves what that kind of part is for (table UPG below) and is a manufacturing job. The materials an
// upgrade uses are built INTO the part, so the part gets that much heavier (Law 3: matter is never lost or made).
// Higher marks need more knowledge: Mk III needs 8 technologies known, Mk IV 12, Mk V 16.
// State: p.mk (1..5) and p.add (kg of upgrade material) on each entry of s.parts. Read by recalc() via partEff().
const UPG={max:5,techs:[0,0,0,8,12,16],
 // per mark above I: multiply these fields by (1 + f × (mk − 1))
 cat:{frame:{g:.15},store:{cap:.2,pmax:.2},gen:{pe:.15,rad:-.15},therm:{A:.15,Tmax:.03},life:{p:-.1},shield:{ad:.15,p:-.1},lab:{rp:.25},fab:{pw:.25},sensor:{p:-.1}}};
function partEff(p){const d=PARTS[p.id],k=(p.mk||1)-1;if(!k)return d;const f=UPG.cat[d.cat]||{},e=Object.assign({},d);
 for(const q in f)if(typeof e[q]==='number')e[q]=e[q]*Math.max(.05,1+f[q]*k);e.m=d.m+(p.add||0);return e}
// what the next mark costs: half the part's own materials × current mark, and energy doubling each mark
function upgCost(p){const d=PARTS[p.id],n=p.mk||1;if(n>=UPG.max)return null;const mat={};for(const k in d.mat||{})mat[k]=d.mat[k]*.5*n;
 return{mk:n+1,mat,J:(d.J||1e8)*.5*2**n,needT:UPG.techs[n+1],haveT:Object.keys(s.tech).length,kg:Object.values(mat).reduce((a,b)=>a+b,0)}}
function upgPart(uid){const p=s.parts.find(q=>q.uid===uid);if(!p)return'none';const c=upgCost(p);if(!c)return'max';if(c.haveT<c.needT)return'tech';
 if(s.jobs.some(j=>j.type==='pupgrade'&&j.uid===uid))return'busy';
 return queueJob({type:'pupgrade',uid,mk:c.mk,kg:c.kg,mat:c.mat,name:PARTS[p.id].n+' → Mk '+['','I','II','III','IV','V'][c.mk],J:c.J})?'ok':'mat'}
ORB.on('job:done',j=>{if(j.type!=='pupgrade')return;const p=s.parts.find(q=>q.uid===j.uid);if(p){p.mk=j.mk;p.add=(p.add||0)+j.kg}});
const MKN=n=>'Mk '+['','I','II','III','IV','V'][n||1];
// plain-language effect of one more mark, for panels and the wiki
const UPG_TXT={frame:'+15 % g rating',store:'+20 % storage and power',gen:'+15 % power, −15 % radiation',therm:'+15 % radiator area, +3 % max temperature',
 life:'−10 % power use',shield:'+15 % shielding, −10 % power use',lab:'+25 % research speed',fab:'+25 % manufacturing power',sensor:'+1 sensor level at Mk III and Mk V, −10 % power use'};
