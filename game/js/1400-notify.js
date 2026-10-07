// ===== NOTIFICATIONS =====
let toastT=0,lastNote='';
function notify(m){apNote=m;lastNote=m;const t=$('toast');t.textContent=m+'   ✕';t.classList.remove('h');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.add('h'),14000);chime()}
$('toast').onclick=()=>$('toast').classList.add('h');
