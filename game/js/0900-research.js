// ===== RESEARCH & DISCOVERY =====
function setResearch(id){const t=TK2[id];if(!t||s.tech[id]||!techOK(t))return;s.research=id;notify('🔬 Researching: '+t.n)}
function disc(key,title,rp,text){if(s.codex.seen[key])return;s.codex.seen[key]={t:T,title,text};s.codex.log.unshift(fT(T)+' · '+title);s.codex.log.length=Math.min(s.codex.log.length,60);if(rp){s.rp+=rp;notify('📚 Discovery: '+title+(rp?' (+'+rp+' research points)':'')+(text?'. '+text:''))}}
