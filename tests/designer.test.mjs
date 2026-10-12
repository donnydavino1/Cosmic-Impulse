// The part designer (RULES 0570) follows the laws: designs weigh exactly what they are built from (Law 3), and the
// formulas reproduce the stock parts they are based on, so a designed part is never better than physics allows.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameData } from '../tools/game-data.mjs';
const M = ['0100-physics.js', '0300-parts.js', '0400-tech.js', '0560-upgrades.js', '0570-designer.js'];
const des = (spec) => gameData(M, `desPart(${JSON.stringify(spec)})`);
const stock = (id) => gameData(M, `PARTS.${id}`);
const sum = (o) => Object.values(o).reduce((a, b) => a + b, 0);
const SPECS = [
  { kind: 'radiator', type: 'lo', area: 60 }, { kind: 'battery', type: 'li', mass: 500 }, { kind: 'reactor', type: 'brayton', power: 1e6 },
  { kind: 'armour', type: 'ceramic', thick: 5, area: 40 }, { kind: 'frame', type: 'ti', g: 12 }, { kind: 'liner', type: 'pe', ad: 5 },
  { kind: 'sensor', type: 'pa', ap: 12, power: 2e4 }, { kind: 'lab', type: 'station', mass: 5000 }, { kind: 'fab', type: 'ind', mass: 3000 }];
test('every kind of designed part weighs exactly its materials', () => {
  for (const sp of SPECS) {
    const d = des(sp);
    assert.ok(!d.err, sp.kind);
    assert.ok(Math.abs(sum(d.mat) - d.m) < 0.06, `${sp.kind}: ${sum(d.mat)} kg of materials vs ${d.m} kg`);
    assert.ok(d.J > 0 && d.cat, sp.kind);
  }
});
test('the formulas reproduce the stock parts', () => {
  const pairs = [[{ kind: 'frame', type: 'al', g: 3 }, 'frame_al', ['m', 'g']], [{ kind: 'liner', type: 'al', ad: 5 }, 'sh_al', ['m', 'ad']],
    [{ kind: 'sensor', type: 'dop', ap: 7, power: 2e3 }, 'sns_dop', ['m', 'p', 'tier']], [{ kind: 'lab', type: 'lab', mass: 800 }, 'lab2', ['m', 'p', 'rp']],
    [{ kind: 'lab', type: 'station', mass: 5000 }, 'lab3', ['m', 'p', 'rp']], [{ kind: 'fab', type: 'ind', mass: 3000 }, 'fab2', ['m', 'pw']],
    [{ kind: 'fab', type: 'orb', mass: 3e4 }, 'fab3', ['m', 'pw']], [{ kind: 'radiator', type: 'lo', area: 60 }, 'rad_lo', ['m', 'A']]];
  for (const [sp, id, keys] of pairs) {
    const d = des(sp), s = stock(id);
    for (const k of keys) assert.ok(Math.abs(d[k] - s[k]) <= 1e-6 * Math.max(1, Math.abs(s[k])), `${id}.${k}: designed ${d[k]} vs stock ${s[k]}`);
  }
  assert.equal(des({ kind: 'sensor', type: 'dop', ap: 7, power: 2e3 }).rng, 1);
});
test('sensor range follows the radar equation: 16× power or 4× aperture doubles it', () => {
  assert.equal(des({ kind: 'sensor', type: 'dop', ap: 7, power: 2e3 * 16 }).rng, 2);
  assert.equal(des({ kind: 'sensor', type: 'pa', ap: 48, power: 2e4 }).rng, 2);
  assert.ok(des({ kind: 'sensor', type: 'dop', ap: 2, power: 400 }).rng < 1);
});
test('a stiffer frame is heavier, a heavier lab researches faster, out-of-range sizes are clamped', () => {
  assert.ok(des({ kind: 'frame', type: 'cf', g: 12 }).m > des({ kind: 'frame', type: 'cf', g: 6 }).m);
  assert.ok(des({ kind: 'lab', type: 'lab', mass: 2000 }).rp > 6);
  assert.equal(des({ kind: 'frame', type: 'al', g: 99 }).g, 6);
  assert.equal(des({ kind: 'liner', type: 'al', ad: 1e9 }).ad, 20);
});
