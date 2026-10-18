// Proxima Centauri must be reachable in a play session: even a slow coast (20 km/s, about what a ship has after
// leaving the solar system) must take well under 24 hours of real time with the fastest allowed time speeds
// (1 s = 1 year within 2,000 AU of a star, the deep-space speeds beyond).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const js = (f) => readFileSync(new URL('../game/js/' + f, import.meta.url), 'utf8');
const AU = 1.495978707e11, c = 299792458;
test('Proxima Centauri takes under 24 real hours, even coasting at 20 km/s', () => {
  const render = js('0200-render.js'), warp = JSON.parse(render.match(/WARP=(\[[^\]]+\])/)[1]);
  const deepIdx = +render.match(/WARP_DEEP=(\d+)/)[1], near = warp[deepIdx], far = warp[warp.length - 1];
  const d = +js('0100-physics.js').match(/\['Proxima Centauri',0,([\d.e+]+)/)[1];
  for (const v of [2e4, 0.02 * c, 0.99 * c]) {
    const nearPart = Math.min(d, 4e3 * AU), real = nearPart / v / near + (d - nearPart) / v / far;
    assert.ok(real < 24 * 3600, `${v} m/s: ${(real / 3600).toFixed(2)} real hours`);
  }
  assert.ok(d / (0.99 * c) / 3.156e7 < 4.4, 'about 4.3 game years at 0.99 c');
});
test('there is no Andromeda in the game', () => {
  assert.doesNotMatch(js('0100-physics.js'), /Andromeda/);
});
test('crew has the new duties and cabin space comes from life support', () => {
  const crew = js('2105-crew.js');
  for (const r of ['fab', 'miner', 'gunner', 'medic']) assert.match(crew, new RegExp(r + ':\\{ic:'));
  assert.ok((js('0300-parts.js').match(/cap:(4|8|12)\b/g) || []).length >= 3, 'life support capacities 4/8/12');
});
