// The Rocket Equation Lab (rocket-lab.html, embedded in the wiki) must use the game's real engine numbers, and the
// wiki must embed it in all three languages.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { gameData } from '../tools/game-data.mjs';
const C = 299792458, html = readFileSync(new URL('../rocket-lab.html', import.meta.url), 'utf8');
test('the lab uses the same exhaust speed, thrust factor and power as the game', () => {
  const DR = gameData().DR, rows = [...html.matchAll(/\{id:'([a-z]+)',n:'[^']*',ve:([^,]+),k:([^,]+),pw:([^}]+)\}/g)];
  assert.ok(rows.length >= 8, 'eight engines in the lab');
  for (const [, id, ve, k, pw] of rows) {
    const D = DR.find((d) => d.id === id); assert.ok(D, `${id} exists in the game`);
    const v = Function('C', 'return ' + ve)(C);
    assert.ok(Math.abs(v - D.ve) / D.ve < 1e-9, `${id} exhaust speed`); assert.equal(+k, D.k, `${id} k`); assert.equal(+pw, D.pw, `${id} power`);
  }
});
test('the wiki embeds the lab in English, Spanish and Chinese', () => {
  for (const p of ['wiki/Rocket-Equation-Lab.md', 'wiki/es/Rocket-Equation-Lab.md', 'wiki/zh/Rocket-Equation-Lab.md'])
    assert.match(readFileSync(new URL('../' + p, import.meta.url), 'utf8'), /<!-- embed: rocket-lab\.html -->/);
  assert.match(html, /zh:\{/); assert.match(html, /es:\{/);
});
