// ===== supplies for a trip =====
function stockDays(){return 1.3*(PRED&&AP&&PRED.ap===AP?Math.max(0,PRED.dt-(T-PRED.T0))/86400:60)}
function stockNeed(d){const ls=SH.ls,regen=ls===PARTS.ls_regen,bio=ls===PARTS.ls_bio;return{oxygen:regen||bio?0:Math.max(0,Math.ceil(d*.84-s.res.oxygen)),water:Math.max(0,Math.ceil(d*(bio?.05:regen?1.125:2.5)-s.res.water)),food:bio?0:Math.max(0,Math.ceil(d*1.6-s.res.food))}}
function stockTxt(d){const n=stockNeed(d);return Object.keys(n).filter(k=>n[k]>0).map(k=>n[k]+' kg '+k).join(', ')}
function stockUp(){const n=stockNeed(stockDays());for(const k in n)if(n[k]>0)supJob(k,n[k]);notify('🫁 Ordered supplies from Earth: '+(stockTxt(stockDays())||'nothing needed')+'. Note: more supplies also mean more mass.')}
