// ===== UI refresh extras =====
function uiExtra(){const now=performance.now();if(now-lastHist>250){lastHist=now;sample()}if(now-lastDyn>400){lastDyn=now;for(const o of DYN){let h='';try{h=o.fn()}catch(e){h='…'}if(h!==o.last){o.last=h;o.d.innerHTML=h}}}
 dashDraw();mpTick();if(now-lastAuto>60000){lastAuto=now;if(s.crew.alive)saveGame('auto')}}
recalc();

// keep the weapon cards (#wbar) and the weapon status line (#wpn) above the bottom button rows, however many rows
// the buttons wrap into on this screen width (the cockpit view uses its own fixed position from the CSS)
ORB.on('ui',()=>{try{const W=$('wbar'),P=$('wpn');if(!W||document.body.classList.contains('fp'))return;
 // the bottom control rows: every visible button in the lower part of the screen that is not a weapon card
 let top=Infinity;for(const b of document.querySelectorAll('button')){if(!b.offsetParent||W.contains(b)||(P&&P.contains(b))||b.closest('.card'))continue;const t=b.getBoundingClientRect().top;if(t>innerHeight*.6&&t<top)top=t}
 if(!isFinite(top))return;const bot=Math.max(104,innerHeight-top+8);W.style.bottom=bot+'px';
 if(P){const wh=W.getBoundingClientRect().height;P.style.bottom=Math.max(bot+wh+10,P.dataset.b0?+P.dataset.b0:0)+'px'}}catch(e){}});
