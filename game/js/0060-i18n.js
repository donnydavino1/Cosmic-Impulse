// ===== LANGUAGE: English · Español · 中文 (switch: 🌐 on the welcome screen, 🎨 Customize → LANGUAGE, or F8) =====
// The game is written in English. Translations live in game/i18n/<code>.json as {"English text": "translation"},
// injected here by the build. A watcher translates every piece of text that appears on screen: exact matches first,
// then {} / {#} patterns for text built at run time, then known phrases inside longer text (multi-word phrases and
// planet names). Untranslated text stays English. Canvas text is translated too (fillText).
// Add a language: create game/i18n/<code>.json and add it to LANGS below. Coverage: python3 tools/i18n-audit.py.
const LANGS={en:'English',es:'Español',zh:'中文'};
const I18N_DATA=/*@I18N_DATA*/{};
const I18_WORDS=new Set(['Moon','Venus','Mars','Mercury','Jupiter','Saturn','Earth','Sun','Destroy','Mine','Deliver','Railgun','Missile','Xenon','Deuterium','Supercapacitors','Battery','Engines','Weapons','Research','Survival']);
let LANG='en';try{const q=new URLSearchParams(location.search).get('lang'),sv=localStorage.getItem('orbital-lang'),nav=(navigator.language||'en').slice(0,2);LANG=LANGS[q]?q:LANGS[sv]?sv:LANGS[nav]?nav:'en'}catch(e){}
let I18=null,I18RX=null;const I18C=new Map();
function i18nPrep(){I18=LANG!=='en'&&I18N_DATA[LANG]||null;I18RX=null;I18C.clear();if(!I18)return;
 i18nPats();const k=Object.keys(I18).filter(x=>!x.includes('{}')&&(/\s/.test(x)||I18_WORDS.has(x))).sort((a,b)=>b.length-a.length).map(x=>(/^[A-Za-z]/.test(x)?'(?<![A-Za-z])':'')+x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+(/[A-Za-z]$/.test(x)?'(?![A-Za-z])':''));
 if(k.length)I18RX=new RegExp(k.join('|'),'g')}
// Keys with {} are patterns for text built at run time ("Wave {} is already attacking!"): each {} matches any text,
// which is translated in turn and put in the same place ({} in order, or {1} {2}… to reorder).
let I18P=[];
// {} matches any text; {#} matches only a number (12, 3.5, 1,000, 4.5e+8, −2). Patterns are bucketed by their first two
// characters so that each piece of text is only tested against the few patterns that can match it.
let I18PB={};const I18NUM='([-+−]?[0-9][0-9.,]*(?:e[+-]?[0-9]+)?)';
function i18nPats(){I18P=[];I18PB={};Object.keys(I18).filter(k=>k.includes('{}')||k.includes('{#}')).sort((a,b)=>b.length-a.length).forEach(k=>{
 const rx=new RegExp('^'+k.split(/(\{#?\})/).map(x=>x==='{}'?'([\\s\\S]*?)':x==='{#}'?I18NUM:x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('')+'$'),p=[rx,I18[k]],pre=k.split(/\{#?\}/)[0],b=pre.length<2?'*':pre.slice(0,2);I18P.push(p);(I18PB[b]=I18PB[b]||[]).push(p)})}
function tr(s){if(!I18||!s)return s;const c=I18C.get(s);if(c!==undefined)return c;const o=tr0(s);if(I18C.size>4000)I18C.clear();I18C.set(s,o);return o}
function tr0(s){if(s.includes('\n')&&s.trim().includes('\n'))return s.split('\n').map(tr).join('\n');const k=s.trim(),x=k.match(/^([\s\S]*?)(\s+✕)$/);if(x)return s.replace(x[1],tr(x[1]));if(I18[k])return s.replace(k,I18[k]);
 for(const L of[I18PB[k.slice(0,2)],I18PB['*']])if(L)for(const[rx,to]of L){const m=k.match(rx);if(m){/* whole-text patterns only */const g=m.slice(1).map(tr);let i=0;const out=to.replace(/\{(#|\d*)\}/g,(_,n)=>g[n&&n!=='#'?n-1:i++]??'');return s.replace(m[0],out)}}
 return I18RX?s.replace(I18RX,m=>I18[m]||m):s}
// text drawn on canvases (radar, graphs, combat labels) goes through the same translator
try{const _ft=CanvasRenderingContext2D.prototype.fillText;CanvasRenderingContext2D.prototype.fillText=function(t,...a){return _ft.call(this,I18&&typeof t==='string'?tr(t):t,...a)}}catch(e){}
const I18_SKIP=new Set(['SCRIPT','STYLE','TEXTAREA','INPUT','CANVAS','svg']);
function trNode(n){if(n.nodeType===3){const p=n.parentNode;if(!p||I18_SKIP.has(p.nodeName))return;
  const src=(n.__out!==undefined&&n.nodeValue===n.__out)?n.__src:n.nodeValue,out=tr(src);n.__src=src;n.__out=out;if(out!==n.nodeValue)n.nodeValue=out}
 else if(n.nodeType===1&&!I18_SKIP.has(n.nodeName)){for(const a of['title','placeholder','aria-label']){if(!n.hasAttribute(a))continue;const k='__a_'+a,v=n.getAttribute(a),src=(n[k+'o']!==undefined&&v===n[k+'o'])?n[k]:v,o=tr(src);n[k]=src;n[k+'o']=o;if(o!==v)n.setAttribute(a,o)}
  for(const c of n.childNodes)trNode(c)}}
const I18MO=new MutationObserver(L=>{if(!I18)return;for(const m of L){if(m.type==='characterData')trNode(m.target);else m.addedNodes.forEach(trNode)}});
function setLang(l){if(!LANGS[l])return;LANG=l;try{localStorage.setItem('orbital-lang',l)}catch(e){}i18nPrep();document.documentElement.lang=l;trNode(document.body);try{notify('🌐 '+LANGS[l])}catch(e){}}
function cycleLang(){const k=Object.keys(LANGS);setLang(k[(k.indexOf(LANG)+1)%k.length])}
function langButtons(p){for(const l in LANGS){const b=document.createElement('button');b.textContent=(l===LANG?'● ':'○ ')+LANGS[l];b.onclick=()=>{setLang(l);p.querySelectorAll('button').forEach((x,i)=>x.textContent=(Object.keys(LANGS)[i]===LANG?'● ':'○ ')+Object.values(LANGS)[i])};p.appendChild(b)}}
i18nPrep();document.documentElement.lang=LANG;I18MO.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['title','placeholder']});
// the welcome screen gets a language row right at the top
{const h=document.querySelector('#help>div');if(h){const d=document.createElement('div');d.style.cssText='display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin:0 0 8px';d.innerHTML='<b>🌐</b>';langButtons(d);h.insertBefore(d,h.children[1])}}
setTimeout(()=>{if(I18)trNode(document.body)},0);
