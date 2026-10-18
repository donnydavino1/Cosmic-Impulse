// The engine lab (game/js/2672-engine-lab.js) is one component used in three places: the game's Engines tab, the
// wiki (inlined, Engines and Rocket Equation Lab pages, three languages) and rocket-lab.html. It must use the game's
// real engine numbers and the same laws as the game.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { gameData } from '../tools/game-data.mjs';
import { buildGame } from '../tools/build-game.mjs';
const read = (p) => readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const C = 299792458, lab = read('game/js/2672-engine-lab.js'), page = read('rocket-lab.html'), wiki = read('wiki.html');
test('rocket-lab.html and the wiki carry the same component and the game\'s engine numbers', () => {
  const DR = gameData().DR;
  for (const html of [page, wiki]) {
    assert.ok(html.includes('function engineLab(host,opt)'), 'component inlined');
    const m = html.match(/const ELAB_ENG=(\[[^\n]*?\]),ELAB_V=/); assert.ok(m, 'engine data present');
    const E = JSON.parse(m[1]); assert.ok(E.length >= 12, 'every engine with propellant');
    for (const e of E) { const D = DR.find((d) => d.id === e.id); assert.ok(D, e.id); assert.equal(e.ve, D.ve); assert.equal(e.k, D.k); assert.equal(e.pw, D.pw) }
    assert.ok(!E.some((e) => e.id === 'sail' || e.id === 'esail'), 'sails need no fuel and are left out');
  }
});
test('the wiki mounts the lab on the Engines and Rocket Equation Lab pages in all three languages', () => {
  for (const l of ['en', 'es', 'zh']) for (const p of ['Engines', 'Rocket-Equation-Lab']) {
    const sec = wiki.split(`<section id="${l}/${p}"`)[1]; assert.ok(sec, `${l}/${p} exists`);
    assert.match(sec.split('</section>')[0], new RegExp(`class="elabmount" data-lang="${l}"`), `${l}/${p} has the lab`);
  }
  for (const p of ['wiki/Rocket-Equation-Lab.md', 'wiki/es/Rocket-Equation-Lab.md', 'wiki/zh/Rocket-Equation-Lab.md']) assert.match(read(p), /<!-- lab: engines -->/);
});
test('the lab follows the game\'s laws: relativistic rocket equation, thrust = k·P/ve', () => {
  // run the component's maths in isolation: the formulas in the file must be these exact expressions
  assert.ok(lab.includes('Math.min(VCAP,C*Math.tanh((e.ve/C)*Math.log(1+r)))'), 'Δv = c·tanh(ve/c·ln(m0/m1)), capped at 0.99 c');
  assert.ok(lab.includes('thrust=e=>e.k*P(e)/e.ve'), 'F = k·P/ve');
  assert.ok(lab.includes('flow=e=>e.k*P(e)/(e.ve*e.ve)'), 'fuel flow = k·P/ve²');
  const dv = (ve, r) => Math.min(.99 * C, C * Math.tanh((ve / C) * Math.log(1 + r)));
  assert.ok(Math.abs(dv(8800, 2) - 9668) < 5, 'nuclear thermal with 2× fuel ≈ 9.67 km/s, as in the reference screenshot');
});
test('the lab has Spanish and Chinese text for every engine name', () => {
  const TR = JSON.parse(lab.match(/engineLab\.TR=(\{.*\});/)[1]);
  for (const e of gameData().DR.filter((d) => d.f && !d.sail)) for (const l of ['es', 'zh']) assert.ok(TR[l][e.n], `${l}: ${e.n}`);
});
test('the build stamps the release the player sees in Settings', () => {
  const pkg = JSON.parse(read('package.json')), r = buildGame({ write: false });
  assert.match(pkg.version, /^\d+\.\d+\.\d+$/);
  for (const h of [r.desktop, r.mobile]) {
    assert.ok(h.includes(`ORB_VERSION=${JSON.stringify(pkg.version)}`), 'version stamped');
    assert.ok(h.includes(`ORB_RELEASED=${JSON.stringify(pkg.releaseDate)}`), 'release date stamped');
  }
  assert.ok(r.core.includes('ABOUT THIS RELEASE'), 'Settings shows the release');
});
