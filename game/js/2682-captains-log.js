// ===== CAPTAIN'S LOG (client): key ' , or 📜 in 🛠 → ⛏ Inventory =====
// Every message the ship gives you is written into the log with the mission day (game time), the crew's own clock (ship
// time: it falls behind at relativistic speed), and where you were. Add your own entries, search, and save the whole log
// as a text file. Kept in saves (the newest 600 entries).
const CLOG={L:[],max:600,last:'',lastAt:0};
function logAdd(m,own){m=String(m||'').replace(/\s+✕\s*$/,'').trim();if(!m)return;const now=performance.now();if(!own&&m===CLOG.last&&now-CLOG.lastAt<60000)return;CLOG.last=m;CLOG.lastAt=now;
 CLOG.L.push({T,tau:s.tau||0,at:s.dom?s.dom.n:'',m,own:own?1:0});if(CLOG.L.length>CLOG.max)CLOG.L.splice(0,CLOG.L.length-CLOG.max);if(!LGW.classList.contains('h'))lgDraw()}
{const _nf=notify;notify=function(m){try{logAdd(tr(m))}catch(e){}return _nf.apply(this,arguments)}}
const lgDay=t=>{const d=Math.floor(t/86400),h=Math.floor(t%86400/3600),mi=Math.floor(t%3600/60);return tr('Day')+' '+d+', '+String(h).padStart(2,'0')+':'+String(mi).padStart(2,'0')};
const LGW=document.createElement('div');LGW.id='lgw';LGW.className='h';
LGW.innerHTML='<div class="card"><h2>📜 Captain’s log</h2><p class="opsn">Every message from the ship, with the mission day, the crew’s own clock (ship time) and where you were. Add your own entries.</p><div class="lgbar"><input id="lgq" placeholder="Search…" aria-label="Search"><input id="lgin" placeholder="Write an entry…" aria-label="New entry"><button id="lgadd">✍ Add</button><button id="lgsave">💾 Save as text</button></div><div id="lgb"></div><button id="lgc">Close (\')</button></div>';
document.body.appendChild(LGW);$('lgc').onclick=()=>LGW.classList.add('h');
function lgToggle(){LGW.classList.toggle('h');lgDraw()}
function lgDraw(){if(LGW.classList.contains('h'))return;const q=($('lgq').value||'').toLowerCase(),L=CLOG.L.filter(e=>!q||e.m.toLowerCase().includes(q)).slice(-300).reverse();
 $('lgb').innerHTML=L.length?L.map(e=>`<div class="lge${e.own?' lgown':''}"><small>${lgDay(e.T)} · <span>${tr('ship time')}</span> ${lgDay(e.tau)}${e.at?' · '+tr(e.at):''}</small><div>${e.own?'✍ ':''}${e.m.replace(/[<>&]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;'})[c])}</div></div>`).join(''):'<p>'+tr('Nothing logged yet.')+'</p>'}
$('lgq').oninput=lgDraw;
const lgOwn=()=>{const v=$('lgin').value.trim();if(v){logAdd(v,1);$('lgin').value='';lgDraw()}};$('lgadd').onclick=lgOwn;$('lgin').onkeydown=e=>{e.stopPropagation();if(e.key==='Enter')lgOwn()};$('lgq').onkeydown=e=>e.stopPropagation();
$('lgsave').onclick=()=>{const txt=CLOG.L.map(e=>`[${lgDay(e.T)} | ${tr('ship time')} ${lgDay(e.tau)}${e.at?' | '+tr(e.at):''}] ${e.own?'(captain) ':''}${e.m}`).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'}));a.download='captains-log.txt';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),5000)};
