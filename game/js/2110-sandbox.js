// ===== SANDBOX MODE (RULES, single player only): build and buy anything, at once, for free =====
// With s.sandbox on: every technology, engine and weapon is known; manufacturing jobs finish at once; materials, water,
// research points and energy are never used up (the battery stays full); supplies and fuel that normally only come from
// Earth can be ordered anywhere; recruits can be launched anywhere. Flying stays real physics: propellant, heat, thrust,
// radiation and the crew's needs work as always. Turn it on from the welcome screen or 🛠 → 🧪 Testing.
// Multiplayer is always real: connecting to a friend or the shared universe switches sandbox off.
// Hooks: ORB.on('frame') keeps the battery full and enforces "off in multiplayer". Read by 0600/0700/2105 via SBX().
const SBX=()=>!!s.sandbox;
function sandboxSet(on){on=!!on;const inMP=(typeof MP!=='undefined'&&MP.conn)||(typeof UNI!=='undefined'&&UNI.on);
 if(on&&inMP){notify('⚠ '+tr('Sandbox mode is single player only: leave the multiplayer game first.'));return false}
 s.sandbox=on;if(on){TECH.forEach(t=>s.tech[t.id]=1);s.research=null;DR.forEach(D=>UNL[D.id]=1);WEP.forEach(w=>UNL[w.id]=1);s.ammo.missile=Math.max(s.ammo.missile||0,99);recalc();s.en=SH.cap;
  try{if(s.jobs.length)instantJobs()}catch(e){}notify('🧪 '+tr('Sandbox on: everything is unlocked, and building and buying is instant and free. Flying is still real physics.'))}
 else notify('🧪 '+tr('Sandbox off: costs and waiting are back. Everything you built stays.'));
 if(typeof ORB!=='undefined'&&ORB.emit)ORB.emit('ui');return on}
ORB.on('frame',()=>{if(!s.sandbox)return;if((typeof MP!=='undefined'&&MP.conn)||(typeof UNI!=='undefined'&&UNI.on)){s.sandbox=false;notify('🧪 '+tr('Sandbox switched off: multiplayer always uses the real rules.'));return}
 if(SH&&s.en<SH.cap)s.en=SH.cap});
// a badge in the top bar so it is always clear that this is a sandbox game
{const b=document.createElement('button');b.id='sbxbadge';b.className='minibtn';b.hidden=true;b.onclick=()=>{if(confirm(tr('Switch sandbox mode off?')))sandboxSet(false)};
 const nb=document.getElementById('navbtn');if(nb)nb.before(b);
 ORB.on('ui',()=>{b.hidden=!s.sandbox;const t='🧪 '+tr('SANDBOX');if(b._t!==t){b._t=t;b.textContent=t;b.title=tr('Sandbox mode: click to switch it off')}})}
