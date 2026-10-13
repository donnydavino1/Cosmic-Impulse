// ===== ALMANAC (client): 🧭 NAVIGATE → ALMANAC =====
// The physical facts of every body in the game: surface gravity g = GM/R², escape speed √(2GM/R), length of day (one
// rotation), orbital period 2π√(a³/GM), mean surface (or cloud-top) temperature and atmosphere, and how long light takes
// from you to reach it right now. Temperatures and atmospheres are measured values; for bodies without one the
// blackbody equilibrium temperature is shown (≈ 278 K · (1 − albedo)^¼ / √distance in AU).
const ALM={Sun:{T:5772,atm:'H/He plasma'},Mercury:{T:440,atm:'none',al:.09},Venus:{T:737,atm:'CO₂ · 92 bar'},Earth:{T:288,atm:'N₂/O₂ · 1 bar'},Moon:{T:250,atm:'none',al:.12},
 Mars:{T:210,atm:'CO₂ · 0.006 bar'},Jupiter:{T:165,atm:'H₂/He · gas giant'},Saturn:{T:134,atm:'H₂/He · gas giant'},Uranus:{T:76,atm:'H₂/He/CH₄ · ice giant'},Neptune:{T:72,atm:'H₂/He/CH₄ · ice giant'},
 Pluto:{T:44,atm:'N₂ · trace'},'Proxima Centauri':{T:3042,atm:'H/He plasma'},Io:{T:110,atm:'SO₂ · trace'},Europa:{T:102,atm:'O₂ · trace'},Titan:{T:94,atm:'N₂/CH₄ · 1.5 bar'},Triton:{T:38,atm:'N₂ · trace'},Enceladus:{T:75,atm:'none',al:.99}};
function almT(b){const a=ALM[b.n];if(a&&a.T)return{T:a.T,m:1};const S=B[0],r=Math.hypot(b.x-S.x,b.y-S.y,b.z-S.z)/AU,al=a&&a.al!=null?a.al:.12;return{T:278*Math.pow(1-al,.25)/Math.sqrt(Math.max(.01,r)),m:0}}
function almHtml(){const rows=B.map(b=>{const P=b.p>=0?B[b.p]:null,g=b.GM/(b.R*b.R),ve=Math.sqrt(2*b.GM/b.R),per=P&&!b.star?2*Math.PI*Math.sqrt(b.a**3/(P.GM+b.GM)):0,t=almT(b),lt=Math.hypot(b.x-s.x,b.y-s.y,b.z-s.z)/C,at=(ALM[b.n]||{}).atm||'none';
  return `<tr><td>${tr(b.n)}${P&&P!==B[0]?` <small>(${tr(P.n)})</small>`:''}</td><td>${f1(g,g<1?3:2)} m/s² <small>(${f1(g/9.81,g<.1?3:2)} g)</small></td><td>${ve<1e3?f1(ve,0)+' m/s':f1(ve/1e3,ve<1e4?2:1)+' km/s'}</td><td>${dur(b.rot)}</td><td>${per?dur(per):'—'}</td><td>${Math.round(t.T-273.15)} °C${t.m?'':' *'}</td><td>${tr(at)}</td><td>${lt<1?f1(lt*1e3,0)+' ms':dur(lt)}</td></tr>`}).join('');
 return `<table class="bldt"><tr><th>${tr('Body')}</th><th>${tr('Surface gravity')}</th><th>${tr('Escape speed')}</th><th>${tr('Day (one turn)')}</th><th>${tr('Orbit')}</th><th>${tr('Mean temperature')}</th><th>${tr('Atmosphere')}</th><th>${tr('Light from you')}</th></tr>${rows}</table><p class="opsn">${tr('* no measured value: blackbody equilibrium temperature from its distance to the Sun.')}</p>`}
{const nb=$('navbody');if(nb){const g=grp(nb,'ALMANAC (gravity, escape speed, day, temperature, air)');dyn(g,()=>$('nav').classList.contains('h')?'':almHtml())}}
