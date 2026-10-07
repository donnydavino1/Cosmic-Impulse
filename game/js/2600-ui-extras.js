// ===== UI refresh extras =====
function uiExtra(){const now=performance.now();if(now-lastHist>250){lastHist=now;sample()}if(now-lastDyn>400){lastDyn=now;for(const o of DYN){let h='';try{h=o.fn()}catch(e){h='…'}if(h!==o.last){o.last=h;o.d.innerHTML=h}}}
 dashDraw();mpTick();if(now-lastAuto>60000){lastAuto=now;if(s.crew.alive)saveGame('auto')}}
recalc();

