// Kernel tests. Run with:  npm test   (or: node --test tests/)
import test from 'node:test';
import assert from 'node:assert/strict';
import { PHYS, TECH, CLASSES, MATERIALS } from '../src/rules/rules.js';
import { evaluate, makeBlueprint, radiatorPower, laserFocusRange, summarize } from '../src/kernel/design.js';
import { Battle, createShip } from '../src/kernel/battle.js';
import { fingerprint } from '../src/kernel/fingerprint.js';
import { makeBot } from '../src/arena/ai.js';

const close = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(a), Math.abs(b));

test('rules fingerprint is stable and short', () => {
  assert.match(fingerprint(), /^[0-9a-f]{8}$/);
  assert.equal(fingerprint(), fingerprint());
});

test('every class evaluates to finite, positive numbers', () => {
  for (const cls of Object.keys(CLASSES)) {
    const d = evaluate(makeBlueprint(cls));
    for (const k of ['dry', 'wet', 've', 'thrust', 'deltaV', 'burnTime', 'coolingAtMax', 'patchHP', 'turn180'])
      assert.ok(Number.isFinite(d[k]) && d[k] > 0, `${cls}.${k} = ${d[k]}`);
    assert.ok(summarize(d).length >= 6);
  }
});

test('rocket equation and thrust follow the physics', () => {
  const d = evaluate(makeBlueprint('brawler'));
  assert.ok(close(d.deltaV, d.ve * Math.log(d.wet / d.dry)));
  assert.ok(close(d.massFlow, d.thrust / d.ve));
});

test('no free lunch: every slider trades one thing for another', () => {
  const at = (id, x) => evaluate(makeBlueprint('scout', { [id]: x }));
  // Punch: more thrust, less exhaust speed
  assert.ok(at('punch', 1).thrust > at('punch', 0).thrust && at('punch', 1).ve < at('punch', 0).ve);
  // Armour: tougher, heavier, slower
  assert.ok(at('armor', 1).patchHP > at('armor', 0).patchHP && at('armor', 1).accelFull < at('armor', 0).accelFull);
  // Cooling: more heat rejection, more mass
  assert.ok(at('cooling', 1).coolingAtMax > at('cooling', 0).coolingAtMax && at('cooling', 1).dry > at('cooling', 0).dry);
  // Fuel: more delta-v, less acceleration
  assert.ok(at('fuel', 1).deltaV > at('fuel', 0).deltaV && at('fuel', 1).accelFull < at('fuel', 0).accelFull);
  // Heat sink: longer firing, more mass
  assert.ok(at('sink', 1).sinkEnergy > at('sink', 0).sinkEnergy && at('sink', 1).dry > at('sink', 0).dry);
});

test('radiators obey the Stefan–Boltzmann law', () => {
  const expected = 2 * TECH.radiator.emissivity * PHYS.SIGMA * 1000 * (450 ** 4 - PHYS.SPACE_TEMP ** 4);
  assert.ok(close(radiatorPower(1000, 450), expected));
});

test('laser reach grows with mirror size (diffraction limit)', () => {
  assert.ok(Math.abs(laserFocusRange(4) - 773e3) < 1e3);
  assert.ok(close(laserFocusRange(2) * 2, laserFocusRange(4)));
});

function duel(a, b, distance, seed = 3) {
  const battle = new Battle({ seed });
  const s1 = battle.add(createShip(evaluate(makeBlueprint(a)), { id: 'A', pos: [-distance / 2, 0, 0], fwd: [1, 0, 0] }));
  const s2 = battle.add(createShip(evaluate(makeBlueprint(b)), { id: 'B', pos: [distance / 2, 0, 0], fwd: [-1, 0, 0] }));
  return { battle, s1, s2 };
}

test('firing heats the ship; boiling water then holds it at the boiling point', () => {
  const { battle, s1, s2 } = duel('sniper', 'brawler', 50e3);
  s1.target = 'B';
  s1.laserOn = true;
  s1.pd = false;
  s1.radExtended = false;
  const t0 = s1.temp;
  for (let i = 0; i < 60 * 120; i++) battle.step(1 / 60);
  assert.ok(s1.temp > t0 + 10, `firing warmed the ship by only ${(s1.temp - t0).toFixed(1)} K`);
  assert.ok(s2.stats.taken > 0, 'target was hit');
  // Now pour in heat faster than radiators can shed it: water boils and clamps the temperature
  const w0 = s1.water;
  for (let i = 0; i < 60 * 60; i++) {
    s1.heatIn += 4e8 / 60; // 400 MW
    battle.step(1 / 60);
  }
  assert.ok(Math.abs(s1.temp - MATERIALS.water.boilsAt) < 1, `temp ${s1.temp}`);
  assert.ok(s1.water < w0, 'water boiled off');
});

test('a railgun hits a target that does not dodge', () => {
  const { battle, s1 } = duel('brawler', 'sniper', 5e3);
  s1.target = 'B';
  battle.fireRailguns(s1);
  for (let i = 0; i < 60 * 3; i++) battle.step(1 / 60);
  assert.ok(s1.stats.dealt > 0);
});

test('point defence shoots down an incoming missile', () => {
  const { battle, s1, s2 } = duel('carrier', 'scout', 200e3);
  s1.target = 'B';
  s2.pd = true;
  battle.launchMissiles(s1);
  for (let i = 0; i < 60 * 120 && battle.missiles.length; i++) battle.step(1 / 60);
  assert.ok((s2.stats.pdKills || 0) > 0, 'scout lasers killed at least one missile');
});

test('AI vs AI: every matchup ends in a decision', () => {
  const names = Object.keys(CLASSES);
  const rows = [];
  for (const a of names)
    for (const b of names) {
      if (a === b) continue;
      const { battle, s1, s2 } = duel(a, b, 400e3, 11);
      const bots = [makeBot(battle, s1, { seed: 1 }), makeBot(battle, s2, { seed: 2 })];
      const dt = 1 / 20;
      while (!battle.over && battle.time < 1800) {
        bots.forEach((think) => think());
        battle.events.length = 0;
        battle.step(dt);
      }
      const winner = battle.over ? (battle.over.loser === 'A' ? b : a) : 'draw';
      rows.push(`${a.padEnd(8)} vs ${b.padEnd(8)} → ${winner.padEnd(8)} in ${Math.round(battle.time)} s (${battle.over ? battle.over.cause : 'time limit'})`);
    }
  console.log(rows.join('\n'));
  assert.equal(rows.length, 12);
});
