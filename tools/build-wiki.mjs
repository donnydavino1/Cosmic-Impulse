// Builds the player wiki:
//   wiki/Controls.md   generated from the game's action table (game/js/1100-keys.js), so it never drifts
//   wiki/_Sidebar.md   navigation for a GitHub Wiki (copy wiki/*.md into the repo's wiki to publish there)
//   wiki.html          the whole wiki as one offline page with sidebar, search and [[links]] (open in any browser)
// Usage: node tools/build-wiki.mjs   (also run by npm run build)
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gameData } from './game-data.mjs';
const root = join(dirname(fileURLToPath(import.meta.url)), '..'), W = (f) => join(root, 'wiki', f);
// The wiki is organised in sections (sidebar groups, breadcrumbs, "more in this section"). ORDER follows them.
export const SECTIONS = [
  ['start', { en: 'Start here', es: 'Empieza aquí', zh: '从这里开始' }, ['Vision and Philosophy', 'Getting Started', 'Controls', 'The Laws of Stellar Impulse', 'FAQ']],
  ['fly', { en: 'Flying', es: 'Pilotaje', zh: '飞行' }, ['Flying and Orbits', 'Orbital Mechanics', 'Relativity']],
  ['ship', { en: 'Your ship', es: 'Tu nave', zh: '你的飞船' }, ['Ship and Engineering', 'Ship Builder', 'Engines', 'Fuels', 'Parts', 'Technologies', 'Energy and Power', 'Heat and Radiators']],
  ['life', { en: 'Staying alive', es: 'Sobrevivir', zh: '生存' }, ['Survival', 'Radiation']],
  ['world', { en: 'The solar system', es: 'El sistema solar', zh: '太阳系' }, ['Solar System', 'Asteroids and Mining', 'Drones and Probes', 'Contracts']],
  ['fight', { en: 'Combat and sensors', es: 'Combate y sensores', zh: '战斗与传感器' }, ['Combat', 'Sensors and Radar']],
  ['make', { en: 'Make it yours', es: 'Hazla tuya', zh: '让它成为你的' }, ['Customization', 'Build Your Own Stellar Impulse', 'Multiplayer', 'Fair Play and Rules']],
  ['ref', { en: 'Reference', es: 'Referencia', zh: '参考' }, ['Glossary']]];
const ORDER = ['Home', ...SECTIONS.flatMap((x) => x[2])];

const UI = { es: { t: 'Controles', note: '*Página generada a partir de la tabla de acciones del juego. Todas las teclas se pueden reasignar en la guía (C).*', pc: 'Ordenador', key: 'Tecla', act: 'Acción', mouse: 'Ratón: arrastra para mirar, rueda para acercar.', phone: 'Móvil', ph: '- **☰ (arriba a la derecha):** menú con todas las acciones.\n- **Cruceta (abajo a la izquierda):** mantén para empujar; 🎥 cambia de cámara.\n- **Botones de armas (abajo a la derecha):** toca para disparar, mantén para haces.\n- **Arrastra** para mirar, **pellizca** para acercar.', ban: 'Esta página aún no está traducida; se muestra en inglés.' },
  zh: { t: '操作', note: '*本页由游戏自身的动作表自动生成。所有按键都可以在指南（C）中重新绑定。*', pc: '电脑', key: '按键', act: '动作', mouse: '鼠标：拖动查看，滚轮缩放。', phone: '手机', ph: '- **☰（右上角）：** 包含所有动作的菜单。\n- **方向键盘（左下）：** 按住推进；中间的 🎥 切换视角。\n- **武器按钮（右下）：** 点击开火，粒子束请按住。\n- **拖动**查看，**双指**缩放。', ban: '本页尚未翻译，以下显示英文原文。' } };
const LANGS = { en: 'English', es: 'Español', zh: '中文' };
export function controlsPageL(lang) {
  const u = UI[lang], dict = JSON.parse(readFileSync(join(root, 'game', 'i18n', lang + '.json'), 'utf8'));
  const src = readFileSync(join(root, 'game', 'js', '1100-keys.js'), 'utf8');
  const acts = [...src.matchAll(/\['([a-z0-9]+)','([^']*)','([^']*)'/g)].filter((m) => m[1] !== 'ctrl');
  return `# ${u.t}\n\n${u.note}\n\n## ${u.pc}\n\n| ${u.key} | ${u.act} |\n|---|---|\n${acts.map((m) => `| **${m[2] === ' ' ? 'Space' : m[2].toUpperCase()}** | ${dict[m[3]] || m[3]} |`).join('\n')}\n\n${u.mouse}\n\n## ${u.phone}\n\n${u.ph}\n`;
}
export function controlsPage() {
  const src = readFileSync(join(root, 'game', 'js', '1100-keys.js'), 'utf8');
  const acts = [...src.matchAll(/\['([a-z0-9]+)','([^']*)','([^']*)'/g)].filter((m) => m[1] !== 'ctrl');
  const key = (k) => (k === ' ' ? 'Space' : k.length === 1 ? k.toUpperCase() : k.toUpperCase());
  return `# Controls

*This page is generated from the game's own action table, so it is always current. Every key can be rebound in the
in-game guide (C).*

## Computer

| Key | Action |
|---|---|
${acts.map((m) => `| **${key(m[2])}** | ${m[3]} |`).join('\n')}

Mouse: drag to look around, scroll to zoom.

## Phone

- **☰ (top right):** a menu with every action above, grouped (camera, time, weapons, flight, ship, multiplayer, help).
- **Pad (bottom left):** hold to thrust; 🎥 in the middle switches camera. Labels follow your thrust mode.
- **Weapon buttons (bottom right):** tap to fire, hold for beams; target and raider buttons too.
- **Drag** to look around, **pinch** to zoom. A mini radar shows in the cockpit.
`;
}

const sci = (x) => { if (x == null || !isFinite(x)) return '—'; const a = Math.abs(x); if (a === 0) return '0'; if (a >= 1e4 || a < 1e-2) { const e = Math.floor(Math.log10(a)); return (x / 10 ** e).toFixed(1).replace(/\.0$/, '') + '×10^' + e } return (+x.toPrecision(3)).toLocaleString('en-US') };
const W_ = (x) => sci(x) + ' W', J_ = (x) => sci(x) + ' J';
const mats = (m) => Object.entries(m || {}).map(([k, v]) => `${v} kg ${k}`).join(', ') || '—';
// Text of the generated pages per language. Data names (engines, parts, technologies) come from the rules files
// and stay in English so they match the game; everything around them is translated.
const DT = {
  en: { head: "*Generated from the game's own rules files, so the numbers are always the ones the game uses.*", eT: 'Engines',
    eI: 'An engine trades **thrust** (how hard it pushes) against **exhaust speed** (how much speed each kilogram of propellant buys).\nThrust = k × power ÷ exhaust speed, so for the same power a slow exhaust pushes harder, and a fast exhaust goes farther.\nDelta-v = exhaust speed × ln(full mass ÷ empty mass) (the rocket equation; see [[The Laws of Stellar Impulse]]).',
    eC: ['Engine', 'Fuel', 'Exhaust speed', 'Specific impulse', 'Rated power', 'Thrust at rated power', 'Needs'], sun: 'none (sunlight)', start: 'starting engine', build: 'Build', energy: 'of energy',
    fT: 'Fuels', fC: ['Fuel', 'What it is', 'Energy to make (in space)', 'From Earth', "How it's made"],
    pT: 'Parts', pI: 'Every part has mass, is built from materials plus energy, and many need research first. Build them in 🛠 → 🏭 Fabricate.', pC: ['Part', 'Mass', 'Materials', 'Energy to build', 'Needs', 'What it does'],
    tT: 'Technologies', tI: 'Research points (RP) come from your crew and labs over time. Each technology may need others first.', tC: ['Technology', 'Cost', 'Needs', 'Effect'], note: '' },
  es: { head: '*Generado a partir de los propios archivos de reglas del juego, así que las cifras siempre son las que usa el juego.*', eT: 'Motores',
    eI: 'Un motor compensa **empuje** (cuánto empuja) con **velocidad de escape** (cuánta velocidad compra cada kilo de propelente).\nEmpuje = k × potencia ÷ velocidad de escape: con la misma potencia, un escape lento empuja más y uno rápido llega más lejos.\nDelta-v = velocidad de escape × ln(masa llena ÷ masa vacía) (la ecuación del cohete; ver [[Las leyes de Stellar Impulse|The Laws of Stellar Impulse]]).',
    eC: ['Motor', 'Combustible', 'Velocidad de escape', 'Impulso específico', 'Potencia nominal', 'Empuje a potencia nominal', 'Requiere'], sun: 'ninguno (luz solar)', start: 'motor inicial', build: 'Construcción', energy: 'de energía',
    fT: 'Combustibles', fC: ['Combustible', 'Qué es', 'Energía para fabricarlo (en el espacio)', 'Desde la Tierra', 'Cómo se fabrica'],
    pT: 'Piezas', pI: 'Cada pieza tiene masa, se fabrica con materiales y energía, y muchas requieren investigación. Constrúyelas en 🛠 → 🏭 Fabricar.', pC: ['Pieza', 'Masa', 'Materiales', 'Energía para construir', 'Requiere', 'Qué hace'],
    tT: 'Tecnologías', tI: 'Los puntos de investigación (PI) vienen de tu tripulación y laboratorios con el tiempo. Cada tecnología puede requerir otras antes.', tC: ['Tecnología', 'Coste', 'Requiere', 'Efecto'],
    note: '> Los nombres y descripciones de la tabla salen de los archivos de reglas y aún están en inglés, igual que en el juego.' },
  zh: { head: '*本页由游戏自身的规则文件生成，所以数值永远与游戏一致。*', eT: '发动机',
    eI: '发动机在**推力**（推得多猛）和**排气速度**（每公斤推进剂能换来多少速度）之间权衡。\n推力 = k × 功率 ÷ 排气速度：同样的功率下，排气慢推力大，排气快则走得远。\nDelta-v = 排气速度 × ln(满载质量 ÷ 空载质量)（火箭方程；参见[[Stellar Impulse 的定律|The Laws of Stellar Impulse]]）。',
    eC: ['发动机', '燃料', '排气速度', '比冲', '额定功率', '额定功率下推力', '前置要求'], sun: '无（阳光）', start: '初始发动机', build: '建造', energy: '能量',
    fT: '燃料', fC: ['燃料', '是什么', '制造能耗（太空中）', '从地球', '制造方式'],
    pT: '部件', pI: '每个部件都有质量，用材料加能量制造，很多还需要先研究。在 🛠 → 🏭 制造 中建造。', pC: ['部件', '质量', '材料', '建造能耗', '前置要求', '作用'],
    tT: '科技', tI: '研究点数（RP）随时间由船员和实验室产生。每项科技可能需要先完成其他科技。', tC: ['科技', '花费', '前置要求', '效果'],
    note: '> 表格中的名称和说明来自规则文件，目前与游戏中一样为英文。' } };
const row = (c) => '| ' + c.join(' | ') + ' |\n|' + c.map(() => '---').join('|') + '|';
export function dataPages(lang = 'en') {
  const x = DT[lang], d = gameData(), dict = lang === 'en' ? {} : JSON.parse(readFileSync(join(root, 'game', 'i18n', lang + '.json'), 'utf8')), L = (t) => (t && dict[t]) || t;
  // names and descriptions come from the rules files; the game's own dictionary translates them, exactly as on screen
  for (const e of d.DR) { e.n = L(e.n); e.how = L(e.how); e.d = L(e.d) } for (const p of Object.values(d.PARTS)) { p.n = L(p.n); p.d = L(p.d) }
  for (const t of d.TECH) { t.n = L(t.n); t.d = L(t.d) } for (const f of Object.values(d.FUEL)) { f.n = L(f.n); f.full = L(f.full); f.how = L(f.how) }
  const T = Object.fromEntries(d.TECH.map((t) => [t.id, t])), tn = (id) => (T[id] ? T[id].n : id);
  const mats = (m) => Object.entries(m || {}).map(([k, v]) => lang === 'en' ? `${v} kg ${k}` : `${v} ${L('kg ' + k).replace(/^kg\s*/, 'kg ')}`).join(', ') || '—';
  const SEC = { es: { frame: 'Estructura', store: 'Almacenamiento de energía', gen: 'Generación', therm: 'Térmico', life: 'Soporte vital', shield: 'Blindaje', lab: 'Investigación', fab: 'Fabricación', Energy: 'Energía', Thermal: 'Térmico', Materials: 'Materiales', Propulsion: 'Propulsión', 'Life support': 'Soporte vital', Shielding: 'Blindaje', 'Industry & science': 'Industria y ciencia', Weapons: 'Armas' },
    zh: { frame: '船架', store: '储能', gen: '发电', therm: '热管理', life: '生命维持', shield: '屏蔽', lab: '研究', fab: '制造', Energy: '能源', Thermal: '热管理', Materials: '材料', Propulsion: '推进', 'Life support': '生命维持', Shielding: '屏蔽', 'Industry & science': '工业与科学', Weapons: '武器' } }[lang] || {};
  const head = x.head + '\n\n';
  const g0 = 9.80665;
  const eng = `# ${x.eT}\n\n${head}${x.eI}\n\n${row(x.eC)}
${d.DR.map((e) => `| ${e.ic || ''} **${e.n}** | ${e.f ? (d.FUEL[e.f] || {}).n || e.f : x.sun} | ${sci(e.ve)} m/s | ${sci(e.ve / g0)} s | ${W_(e.pw)} | ${e.ve ? sci(e.k * e.pw / e.ve) + ' N' : '—'} | ${d.ENGR && d.ENGR[e.id] && d.ENGR[e.id].req ? tn(d.ENGR[e.id].req) : x.start} |`).join('\n')}

${d.DR.map((e) => `### ${e.ic || ''} ${e.n}\n${e.how || e.d || ''}${d.ENGR && d.ENGR[e.id] ? `\n\n${x.build}: ${mats(d.ENGR[e.id].mat)}; ${J_(d.ENGR[e.id].J)} ${x.energy}.` : ''}`).join('\n\n')}
`;
  const fuel = `# ${x.fT}\n\n${head}${row(x.fC)}\n${Object.entries(d.FUEL).map(([k, f]) => `| **${f.n}** | ${f.full || ''} | ${J_(f.J)}/kg | ${J_(f.earthJ)}/kg | ${f.how || ''} |`).join('\n')}\n`;
  const cats = {};for (const [id, p] of Object.entries(d.PARTS)) (cats[p.cat] = cats[p.cat] || []).push([id, p]);
  const parts = `# ${x.pT}\n\n${head}${x.pI}\n\n${Object.entries(cats).map(([c, L]) => `## ${SEC[c] || c[0].toUpperCase() + c.slice(1)}\n\n${row(x.pC)}\n${L.map(([id, p]) => `| **${p.n}** | ${sci(p.m)} kg | ${mats(p.mat)} | ${J_(p.J)} | ${p.req ? tn(p.req) : '—'} | ${p.d || ''} |`).join('\n')}`).join('\n\n')}\n`;
  const br = {};for (const t of d.TECH) (br[t.b] = br[t.b] || []).push(t);
  const tech = `# ${x.tT}\n\n${head}${x.tI}\n\n${Object.entries(br).map(([b, L]) => `## ${SEC[b] || b}\n\n${row(x.tC)}\n${L.map((t) => `| **${t.n}** | ${t.c} RP | ${(t.pre || []).map(tn).join(', ') || '—'} | ${t.d || ''} |`).join('\n')}`).join('\n\n')}\n`;
  return { Engines: eng, Fuels: fuel, Parts: parts, Technologies: tech };
}
// Page titles for the sidebar and browser tab, so every title follows the language even if a page body falls back.
export const TITLES = {
  es: { 'Home': 'Wiki de Stellar Impulse', 'The Laws of Stellar Impulse': 'Las leyes de Stellar Impulse', 'Getting Started': 'Primeros pasos', 'Controls': 'Controles', 'Contracts': 'Contratos',
    'Flying and Orbits': 'Vuelo y órbitas', 'Engines': 'Motores', 'Fuels': 'Combustibles', 'Ship and Engineering': 'Nave e ingeniería', 'Drones and Probes': 'Drones y sondas', 'Vision and Philosophy': 'Visión y filosofía', 'Ship Builder': 'Constructor de naves', 'Orbital Mechanics': 'Mecánica orbital', 'Relativity': 'Relatividad', 'Heat and Radiators': 'Calor y radiadores', 'Radiation': 'Radiación', 'Asteroids and Mining': 'Asteroides y minería', 'Solar System': 'Sistema solar', 'Energy and Power': 'Energía y potencia',
    'Parts': 'Piezas', 'Technologies': 'Tecnologías', 'Survival': 'Supervivencia', 'Combat': 'Combate', 'Sensors and Radar': 'Sensores y radar', 'Customization': 'Personalización',
    'Multiplayer': 'Multijugador', 'Fair Play and Rules': 'Juego limpio y reglas', 'Build Your Own Stellar Impulse': 'Construye tu propio Stellar Impulse', 'Glossary': 'Glosario', 'FAQ': 'Preguntas frecuentes' },
  zh: { 'Home': 'Stellar Impulse 百科', 'The Laws of Stellar Impulse': 'Stellar Impulse 的定律', 'Getting Started': '入门', 'Controls': '操作', 'Contracts': '合同',
    'Flying and Orbits': '飞行与轨道', 'Engines': '发动机', 'Fuels': '燃料', 'Ship and Engineering': '飞船与工程', 'Drones and Probes': '无人机与探测器', 'Vision and Philosophy': '愿景与理念', 'Ship Builder': '飞船建造器', 'Orbital Mechanics': '轨道力学', 'Relativity': '相对论', 'Heat and Radiators': '热量与散热器', 'Radiation': '辐射', 'Asteroids and Mining': '小行星与采矿', 'Solar System': '太阳系', 'Energy and Power': '能量与功率',
    'Parts': '部件', 'Technologies': '科技', 'Survival': '生存', 'Combat': '战斗', 'Sensors and Radar': '传感器与雷达', 'Customization': '自定义',
    'Multiplayer': '多人游戏', 'Fair Play and Rules': '公平竞技与规则', 'Build Your Own Stellar Impulse': '打造你自己的 Stellar Impulse', 'Glossary': '术语表', 'FAQ': '常见问题' } };

// ---- the cover of Home, footers, and automatic links between pages
const HERO = { en: { tag: 'Build the spaceship you’ve always wanted, then fly it through a real, to-scale solar system: explore, mine, build and battle under the same physics as everyone else.', vis: '🌌 Vision & Philosophy', go: '🚀 Getting started', laws: '⚖ The ten laws', build: '🧱 Ship Builder' },
  es: { tag: 'Construye la nave que siempre quisiste y vuela con ella por un sistema solar real y a escala: explora, mina, construye y lucha con la misma física que todos los demás.', vis: '🌌 Visión y filosofía', go: '🚀 Primeros pasos', laws: '⚖ Las diez leyes', build: '🧱 Constructor de naves' },
  zh: { tag: '打造你一直想要的飞船，驾驶它穿越真实、按比例构建的太阳系：在与所有人相同的物理规则下探索、采矿、建造和战斗。', vis: '🌌 愿景与理念', go: '🚀 入门', laws: '⚖ 十条定律', build: '🧱 飞船建造器' } };
const FOOT = { en: { more: 'More in', from: 'Pages that link here', prev: 'Previous', next: 'Next' }, es: { more: 'Más en', from: 'Páginas que enlazan aquí', prev: 'Anterior', next: 'Siguiente' }, zh: { more: '本节更多', from: '链接到本页的页面', prev: '上一页', next: '下一页' } };
const ALIAS = {
  en: { 'Hohmann transfer': 'Orbital Mechanics', 'Oberth effect': 'Orbital Mechanics', 'vis-viva': 'Orbital Mechanics', 'delta-v': 'Flying and Orbits', radiators: 'Heat and Radiators', radiator: 'Heat and Radiators', 'solar storms': 'Radiation', 'solar storm': 'Radiation', 'storm shelter': 'Radiation', sieverts: 'Radiation', 'time dilation': 'Relativity', 'speed of light': 'Relativity', asteroids: 'Asteroids and Mining', asteroid: 'Asteroids and Mining', 'mining laser': 'Asteroids and Mining', 'mining drones': 'Drones and Probes', 'science probes': 'Drones and Probes', probes: 'Drones and Probes', raiders: 'Combat', raider: 'Combat', railgun: 'Combat', contracts: 'Contracts', research: 'Technologies', reactors: 'Energy and Power', reactor: 'Energy and Power', 'solar panels': 'Energy and Power', 'life support': 'Survival', fingerprint: 'Fair Play and Rules', hardpoints: 'Customization', truss: 'Ship Builder', layout: 'Ship Builder', engines: 'Engines', propellant: 'Fuels', Moon: 'Solar System', Mars: 'Solar System', Jupiter: 'Solar System', Saturn: 'Solar System', Venus: 'Solar System', Mercury: 'Solar System', laws: 'The Laws of Stellar Impulse' },
  es: { 'transferencia de Hohmann': 'Orbital Mechanics', 'efecto Oberth': 'Orbital Mechanics', radiadores: 'Heat and Radiators', 'tormentas solares': 'Radiation', refugio: 'Radiation', 'velocidad de la luz': 'Relativity', asteroides: 'Asteroids and Mining', asteroide: 'Asteroids and Mining', 'drones mineros': 'Drones and Probes', sondas: 'Drones and Probes', saqueadores: 'Combat', 'cañón de riel': 'Combat', contratos: 'Contracts', investigación: 'Technologies', reactor: 'Energy and Power', 'paneles solares': 'Energy and Power', 'soporte vital': 'Survival', huella: 'Fair Play and Rules', armazón: 'Ship Builder', motores: 'Engines', propelente: 'Fuels', Marte: 'Solar System', Júpiter: 'Solar System', Saturno: 'Solar System', Venus: 'Solar System', Mercurio: 'Solar System', Luna: 'Solar System' },
  zh: { 霍曼转移: 'Orbital Mechanics', 奥伯特效应: 'Orbital Mechanics', 散热器: 'Heat and Radiators', 太阳风暴: 'Radiation', 避难所: 'Radiation', 光速: 'Relativity', 小行星: 'Asteroids and Mining', 采矿无人机: 'Drones and Probes', 探测器: 'Drones and Probes', 袭击者: 'Combat', 轨道炮: 'Combat', 合同: 'Contracts', 研究: 'Technologies', 反应堆: 'Energy and Power', 太阳能板: 'Energy and Power', 生命维持: 'Survival', 指纹: 'Fair Play and Rules', 桁架: 'Ship Builder', 发动机: 'Engines', 推进剂: 'Fuels', 火星: 'Solar System', 木星: 'Solar System', 土星: 'Solar System', 金星: 'Solar System', 水星: 'Solar System', 月球: 'Solar System' } };
// link the first mention of another page's title or alias in ordinary text (not headings, code, table headers or links)
function autoLink(html, lang, self, titleOf) {
  const map = {}; for (const n of ORDER) if (n !== 'Home') map[titleOf(n).toLowerCase()] = n;
  for (const [k, v] of Object.entries(ALIAS[lang] || {})) map[k.toLowerCase()] = v;
  const keys = Object.keys(map).filter((k) => k.length > 1).sort((a, b) => b.length - a.length).map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const rx = lang === 'zh' ? new RegExp('(' + keys.join('|') + ')', 'gi') : new RegExp('(?<![\\p{L}\\p{N}])(' + keys.join('|') + ')(?![\\p{L}\\p{N}])', 'giu');
  const linked = new Set([self]); for (const m of html.matchAll(/href="#[a-z]+\/([^"]+)"/g)) linked.add(m[1].replace(/-/g, ' '));
  let skip = 0, n = 0;
  return html.split(/(<[^>]+>)/).map((t) => {
    if (t.startsWith('<')) { if (/^<(a|h[1-3]|code|pre|th)[\s>]/.test(t)) skip++; else if (/^<\/(a|h[1-3]|code|pre|th)>/.test(t)) skip = Math.max(0, skip - 1); return t }
    if (skip || n > 30) return t;
    return t.replace(rx, (m) => { const pg = map[m.toLowerCase()]; if (!pg || linked.has(pg)) return m; linked.add(pg); n++; return `<a class="al" href="#${lang}/${slug(pg)}">${m}</a>` });
  }).join('');
}
// ---- generated: the Solar System, from the physics module's own body table
const SSX = { en: { t: 'Solar System', i: 'Every world in the game, with its real size and orbit. Distances, gravity and sunlight are computed from the same numbers the physics uses (see [[Orbital Mechanics]] and [[Energy and Power]]).', c: ['World', 'Orbits', 'Distance', 'Radius', 'Surface gravity', 'Escape speed', 'Orbit takes', 'Sunlight'], sun: 'the Sun', d: 'd', y: 'y', h: 'Facts your probes report', star: '—' },
  es: { t: 'Sistema solar', i: 'Todos los mundos del juego, con su tamaño y órbita reales. Distancias, gravedad y luz solar se calculan con las mismas cifras que usa la física (ver [[Mecánica orbital|Orbital Mechanics]] y [[Energía y potencia|Energy and Power]]).', c: ['Mundo', 'Orbita', 'Distancia', 'Radio', 'Gravedad en superficie', 'Velocidad de escape', 'Una órbita dura', 'Luz solar'], sun: 'el Sol', d: 'd', y: 'años', h: 'Lo que cuentan tus sondas', star: '—' },
  zh: { t: '太阳系', i: '游戏中的每个世界，及其真实的大小和轨道。距离、重力和日照都由物理使用的同一组数字计算得出（见[[轨道力学|Orbital Mechanics]]和[[能量与功率|Energy and Power]]）。', c: ['世界', '绕行', '距离', '半径', '表面重力', '逃逸速度', '公转周期', '日照'], sun: '太阳', d: '天', y: '年', h: '你的探测器报告的事实', star: '—' } };
function solarPage(lang) {
  const x = SSX[lang], dict = lang === 'en' ? {} : JSON.parse(readFileSync(join(root, 'game', 'i18n', lang + '.json'), 'utf8')), tn = (n) => dict[n] || n;
  const B = gameData(['0100-physics.js'], 'B.map(b=>({n:b.n,p:b.p,a:b.a,m:b.m,R:b.R,GM:b.GM}))');
  const F = gameData(['0100-physics.js', '0300-parts.js', '0400-tech.js', '1760-ops.js'], 'OPS_FACT'), AU = 1.496e11;
  const row = (b) => { const P = b.p >= 0 ? B[b.p] : null, g = b.GM / b.R ** 2 / 9.80665, ve = Math.sqrt(2 * b.GM / b.R) / 1e3, T = P ? 2 * Math.PI * Math.sqrt(b.a ** 3 / P.GM) / 86400 : 0, ah = b.p > 0 ? B[b.p].a : b.a, sun = b.p < 0 ? x.star : Math.round(1361 * (AU / ah) ** 2).toLocaleString('en') + ' W/m²';
    return `| **${tn(b.n)}** | ${P ? tn(P.n === 'Sun' ? x.sun : P.n) : '—'} | ${P ? (b.p > 0 ? Math.round(b.a / 1e3).toLocaleString('en') + ' km' : (b.a / AU).toFixed(2) + ' AU') : '—'} | ${Math.round(b.R / 1e3).toLocaleString('en')} km | ${g.toFixed(2)} g | ${ve.toFixed(1)} km/s | ${P ? (T > 600 ? (T / 365.25).toFixed(1) + ' ' + x.y : T.toFixed(1) + ' ' + x.d) : '—'} | ${sun} |` };
  return `# ${x.t}\n\n${x.i}\n\n| ${x.c.join(' | ')} |\n|${x.c.map(() => '---').join('|')}|\n${B.map(row).join('\n')}\n\n## ${x.h}\n\n${Object.entries(F).map(([k, v]) => `- **${tn(k)}:** ${dict[v] || v}`).join('\n')}\n`;
}
const CHROME = { en: { wiki: 'Stellar Impulse Wiki', q: 'Search…', none: 'No page matches.', play: '▶ Play' },
  es: { wiki: 'Wiki de Stellar Impulse', q: 'Buscar…', none: 'Ninguna página coincide.', play: '▶ Jugar' },
  zh: { wiki: 'Stellar Impulse 百科', q: '搜索…', none: '没有匹配的页面。', play: '▶ 开始游戏' } };
const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const slug = (n) => n.replace(/ /g, '-');
function md(t, lang = 'en') { // small Markdown subset: headings, tables, lists, quotes, code, bold, italics, code spans, [[links]]
  const inl = (s) => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\*([^*]+)\*/g, '<i>$1</i>')
    .replace(/\[\[([^\]]+)\]\]/g, (_, n) => { const [txt, pg] = n.includes('|') ? n.split('|') : [n, n]; return `<a href="#${lang}/${slug(pg)}">${txt}</a>` });
  const out = [], L = [];
  let inCode = false;   // join wrapped lines back onto their paragraph or list item
  for (const l of t.split('\n')) {
    if (/^```/.test(l)) inCode = !inCode;
    const block = inCode || /^(```|#|\||\s*- |\s*\d+\. |> )/.test(l) || !l.trim();
    const prev = L[L.length - 1];
    if (!block && prev && prev.trim() && !/^(```|#|\|)/.test(prev) && !inCode) L[L.length - 1] = prev + (/[\u3000-\u9fff\uff00-\uffef]$/.test(prev) ? '' : ' ') + l.trim(); else L.push(l);
  }
  for (let i = 0; i < L.length; i++) {
    const l = L[i];
    if (/^```/.test(l)) { const c = []; while (++i < L.length && !/^```/.test(L[i])) c.push(esc(L[i])); out.push('<pre>' + c.join('\n') + '</pre>'); continue }
    if (/^#{1,3} /.test(l)) { const n = l.match(/^#+/)[0].length; out.push(`<h${n}>${inl(l.slice(n + 1))}</h${n}>`); continue }
    if (/^\|/.test(l)) { const rows = []; while (i < L.length && /^\|/.test(L[i])) rows.push(L[i++]); i--;
      const cells = (r) => r.split('|').slice(1, -1).map((c) => inl(c.trim()));
      out.push('<table><tr>' + cells(rows[0]).map((c) => `<th>${c}</th>`).join('') + '</tr>' + rows.slice(2).map((r) => '<tr>' + cells(r).map((c) => `<td>${c}</td>`).join('') + '</tr>').join('') + '</table>'); continue }
    if (/^\s*(- |\d+\. )/.test(l)) { const ol = /^\s*\d/.test(l), it = []; while (i < L.length && /^\s*(- |\d+\. )/.test(L[i])) it.push(L[i++].replace(/^\s*(- |\d+\. )/, '')); i--;
      out.push(`<${ol ? 'ol' : 'ul'}>` + it.map((x) => `<li>${inl(x)}</li>`).join('') + `</${ol ? 'ol' : 'ul'}>`); continue }
    if (/^> /.test(l)) { out.push('<blockquote>' + inl(l.slice(2)) + '</blockquote>'); continue }
    if (l.trim()) out.push('<p>' + inl(l) + '</p>');
  }
  return out.join('\n');
}
export function buildWiki() {
  writeFileSync(W('Controls.md'), controlsPage());
  for (const l of ['es', 'zh']) writeFileSync(W(l + '/Controls.md'), controlsPageL(l));
  for (const l of ['en', 'es', 'zh']) for (const [n, t] of Object.entries({ ...dataPages(l), 'Solar-System': solarPage(l) })) writeFileSync(W((l === 'en' ? '' : l + '/') + n + '.md'), t);
  writeFileSync(W('_Sidebar.md'), ORDER.map((n) => `- [[${n}]]`).join('\n') + '\n');
  const files = readdirSync(join(root, 'wiki')).filter((f) => f.endsWith('.md') && !f.startsWith('_'));
  const names = ORDER.filter((n) => files.includes(slug(n) + '.md')).concat(files.map((f) => f.slice(0, -3).replace(/-/g, ' ')).filter((n) => !ORDER.includes(n)));
  const navs = {}, secs = [];
  const secOf = (n) => SECTIONS.find((x) => x[2].includes(n));
  for (const l in LANGS) {
    const titleOf = (n) => (l === 'en' ? n : TITLES[l][n] || n), body = {}, links = {};
    for (const n of names) {
      const tf = l === 'en' ? W(slug(n) + '.md') : W(l + '/' + slug(n) + '.md');
      let t, ban = '';
      try { t = readFileSync(tf, 'utf8') } catch (e) { t = readFileSync(W(slug(n) + '.md'), 'utf8'); ban = `<p class="ban">${UI[l].ban}</p>` }
      if (ban) t = t.replace(/^# .+$/m, '# ' + titleOf(n));
      let h = ban + autoLink(md(t, l), l, n, titleOf);
      if (n === 'Home') h += SECTIONS.map(([id, st, ps]) => `<h2>${st[l]}</h2><ul class="dir">` + ps.filter((p) => names.includes(p)).map((p) => `<li><a href="#${l}/${slug(p)}">${esc(titleOf(p))}</a></li>`).join('') + '</ul>').join('');
      if (n === 'Home') { const x = HERO[l]; h = `<div class="hero"><div class="hero-t">STELLAR IMPULSE</div><p>${x.tag}</p><div class="hero-b"><a class="hb main" href="#${l}/Vision-and-Philosophy">${x.vis}</a><a class="hb" href="#${l}/Getting-Started">${x.go}</a><a class="hb" href="#${l}/The-Laws-of-Stellar-Impulse">${x.laws}</a><a class="hb" href="#${l}/Ship-Builder">${x.build}</a><a class="hb playlink" href="stellar-impulse.html">${CHROME[l].play}</a></div></div>` + h }
      body[n] = h; links[n] = new Set([...h.matchAll(/href="#[a-z]+\/([^"]+)"/g)].map((m) => m[1].replace(/-/g, ' ')));
    }
    let nav = `<a href="#${l}/Home" data-l="${l}">${esc(titleOf('Home'))}</a>`;
    for (const [id, st, ps] of SECTIONS) nav += `<div class="st" data-l="${l}">${st[l]}</div>` + ps.filter((n) => names.includes(n)).map((n) => `<a href="#${l}/${slug(n)}" data-l="${l}">${esc(titleOf(n))}</a>`).join('');
    navs[l] = [nav];
    names.forEach((n, i) => {
      const sx = secOf(n), F = FOOT[l], a = (p) => `<a href="#${l}/${slug(p)}">${esc(titleOf(p))}</a>`;
      const from = names.filter((p) => p !== n && links[p].has(n));
      const crumb = n === 'Home' ? '' : `<div class="crumb"><a href="#${l}/Home">🏠 ${esc(titleOf('Home'))}</a>${sx ? ' › ' + sx[1][l] : ''}</div>`;
      const foot = n === 'Home' ? '' : `<div class="foot">${sx ? `<div><b>${F.more} ${sx[1][l]}:</b> ${sx[2].filter((p) => p !== n && names.includes(p)).map(a).join(' · ')}</div>` : ''}${from.length ? `<div><b>${F.from}:</b> ${from.map(a).join(' · ')}</div>` : ''}<div class="pn">${i > 0 ? `<a href="#${l}/${slug(names[i - 1])}">← ${esc(titleOf(names[i - 1]))}</a>` : '<span></span>'}${i < names.length - 1 ? `<a href="#${l}/${slug(names[i + 1])}">${esc(titleOf(names[i + 1]))} →</a>` : ''}</div></div>`;
      secs.push(`<section id="${l}/${slug(n)}" data-l="${l}">${crumb}${body[n]}${foot}</section>`);
    });
  }
  const pages = secs.join('\n');
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Stellar Impulse Wiki</title><style>
:root{--bg:#070b18;--pn:#0d1430;--fg:#dde7ff;--mut:#8ea0c8;--ac:#ffb84d;--ln:#5fe0ff}*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.6 system-ui,-apple-system,Segoe UI,sans-serif;display:flex;min-height:100vh}
nav{width:250px;flex:none;background:var(--pn);border-right:1px solid #24305a;padding:18px 14px;position:sticky;top:0;height:100vh;overflow:auto}
nav h1{font-size:18px;margin:0 0 10px;color:var(--ac)}nav input{width:100%;padding:8px;border-radius:6px;border:1px solid #3a4468;background:#060a18;color:var(--fg);margin-bottom:10px}
#play{background:var(--ac);color:#1d1405!important;font-weight:700;text-align:center;margin-bottom:10px}nav a{display:block;padding:5px 8px;border-radius:5px;color:var(--fg);text-decoration:none}nav a:hover,nav a.on{background:#1b2650;color:var(--ac)}
main{flex:1;min-width:0;padding:24px clamp(16px,4vw,56px);max-width:980px}section{display:none}section.on{display:block}
h1{color:var(--ac);margin-top:0}h2{color:var(--ln);border-bottom:1px solid #24305a;padding-bottom:4px}a{color:var(--ln)}
table{border-collapse:collapse;width:100%;margin:10px 0;display:block;overflow-x:auto}td,th{border:1px solid #2a3766;padding:6px 10px;text-align:left;vertical-align:top}th{background:#121b3d}
code{background:#121b3d;padding:1px 5px;border-radius:4px;font-size:.92em}pre{background:#060a18;padding:12px;border-radius:8px;overflow:auto}
#langs{display:flex;gap:4px;margin-bottom:8px}#langs button{flex:1;padding:6px 2px;border-radius:6px;border:1px solid #3a4468;background:#060a18;color:var(--fg);cursor:pointer}#langs button.on{border-color:var(--ac);color:var(--ac)}.ban{background:#2a1d08;border:1px solid #6a4a10;padding:6px 10px;border-radius:6px;color:#ffd9a0}
nav .st{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--mut);margin:12px 8px 4px}
.hero{background:radial-gradient(ellipse at 70% 0%,#1d2a5a 0%,#070b18 70%);border:1px solid #24305a;border-radius:14px;padding:28px 24px;margin-bottom:22px}.hero-t{font-size:clamp(26px,5vw,44px);font-weight:800;letter-spacing:.18em;color:#fff}.hero p{color:#c9d6f5;font-size:16px;max-width:640px}
.hero-b{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}.hb{padding:9px 14px;border-radius:8px;border:1px solid #3a4468;background:#0d1430;text-decoration:none;color:var(--fg)}.hb.main{background:var(--ac);border-color:var(--ac);color:#1d1405;font-weight:700}.hb:hover{border-color:var(--ac)}
.crumb{font-size:13px;color:var(--mut);margin-bottom:6px}.crumb a{color:var(--mut)}ul.dir{columns:2;column-gap:28px}@media (max-width:720px){ul.dir{columns:1}}a.al{text-decoration:none;border-bottom:1px dotted var(--ln)}
.foot{margin-top:28px;padding-top:12px;border-top:1px solid #24305a;font-size:14px;color:var(--mut)}.foot div{margin:6px 0}.pn{display:flex;justify-content:space-between;gap:10px;margin-top:12px}
blockquote{border-left:3px solid var(--ac);margin:10px 0;padding:6px 14px;background:#121b3d;color:#f0e0c0}
@media (max-width:720px){body{display:block}nav{width:auto;height:auto;position:static}main{padding:16px}}
</style></head><body><nav><h1>🪐 <span id="wt">Stellar Impulse Wiki</span></h1><a id="play" href="stellar-impulse.html" data-l="*">▶ Play</a><div id="langs">${Object.entries(LANGS).map(([l, n]) => `<button data-set="${l}">${n}</button>`).join('')}</div><input id="q" placeholder="Search…">${Object.values(navs).flat().join('')}</nav>
<main>${pages}<p id="none" style="display:none">No page matches.</p></main>
<script>
const S=[...document.querySelectorAll('section')],A=[...document.querySelectorAll('nav a[data-l]:not(#play)')],C=${JSON.stringify(CHROME)};if(/claude/.test(location.hostname))document.querySelectorAll('#play,.playlink').forEach(a=>a.href='https://claude.ai/artifact/QGZvo4jc4NrW7dqb9p7Nrv');let L='en';try{L=localStorage.getItem('orbital-lang')||((navigator.language||'en').slice(0,2));}catch(e){}if(!['en','es','zh'].includes(L))L='en';
function cur(){let h=decodeURIComponent(location.hash.slice(1))||'Home';if(!h.includes('/'))h=L+'/'+h;return h}
function show(){const id=cur();L=id.split('/')[0];try{localStorage.setItem('orbital-lang',L)}catch(e){}document.documentElement.lang=L;const c=C[L],sec=document.getElementById(id),h=sec&&sec.querySelector('h1');document.title=(h&&id.split('/')[1]!=='Home'?h.textContent+' · ':'')+c.wiki;document.getElementById('wt').textContent=c.wiki;document.getElementById('q').placeholder=c.q;document.getElementById('none').textContent=c.none;document.getElementById('play').textContent=c.play;
 S.forEach(s=>s.classList.toggle('on',s.id===id));document.querySelectorAll('nav .st').forEach(x=>x.style.display=x.dataset.l===L?'':'none');A.forEach(a=>{a.style.display=a.dataset.l===L?'':'none';a.classList.toggle('on',a.getAttribute('href')==='#'+id)});
 document.querySelectorAll('#langs button').forEach(b=>b.classList.toggle('on',b.dataset.set===L));scrollTo(0,0)}
document.querySelectorAll('#langs button').forEach(b=>b.onclick=()=>{location.hash=b.dataset.set+'/'+cur().split('/').slice(1).join('/')});
addEventListener('hashchange',show);show();
document.getElementById('q').oninput=e=>{const q=e.target.value.toLowerCase().trim();if(!q){show();return}let n=0;
 S.forEach((s,i)=>{const hit=s.dataset.l===L&&s.textContent.toLowerCase().includes(q);s.classList.toggle('on',hit);n+=hit});
 A.forEach(a=>{const s=document.getElementById(a.getAttribute('href').slice(1));a.style.display=a.dataset.l===L&&s&&s.classList.contains('on')?'':'none'});document.getElementById('none').style.display=n?'none':''};
</script></body></html>`;
  writeFileSync(join(root, 'wiki.html'), html);
  return names;
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) console.log('wiki: ' + buildWiki().length + ' pages → wiki.html');
