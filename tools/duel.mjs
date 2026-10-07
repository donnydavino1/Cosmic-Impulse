// Trace one AI-vs-AI duel:  node tools/duel.mjs brawler sniper [distance_km]
import { evaluate, makeBlueprint, fmtDist } from '../src/kernel/design.js';
import { Battle, createShip } from '../src/kernel/battle.js';
import { makeBot } from '../src/arena/ai.js';
const [a = 'brawler', b = 'sniper', km = '400'] = process.argv.slice(2);
const d = +km * 1e3, battle = new Battle({ seed: 11 });
const s1 = battle.add(createShip(evaluate(makeBlueprint(a)), { id: 'A', pos: [-d / 2, 0, 0], fwd: [1, 0, 0] }));
const s2 = battle.add(createShip(evaluate(makeBlueprint(b)), { id: 'B', pos: [d / 2, 0, 0], fwd: [-1, 0, 0] }));
const bots = [makeBot(battle, s1, { seed: 1 }), makeBot(battle, s2, { seed: 2 })];
const row = (s) => `${s.design.cls.padEnd(7)} T=${s.temp.toFixed(0)}K water=${(s.water / 1e3).toFixed(1)}t prop=${(s.propellant / 1e3).toFixed(1)}t E=${(100 * s.energy / s.design.storageEnergy).toFixed(0)}% rad=${s.radArea.toFixed(0)} armour=${s.armor.map((x) => (100 * x / s.design.patchHP).toFixed(0)).join('/')} crew=${(s.parts.crew / 3e6).toFixed(0)}% dealt=${(s.stats.dealt / 1e9).toFixed(2)}GJ laser=${s.laserOn ? 'ON' : 'off'} missiles=${(s.weapons.find((w) => w.type === 'missiles') || {}).left ?? '-'}`;
let next = 0;
while (!battle.over && battle.time < 1800) {
  bots.forEach((t) => t()); battle.events.length = 0; battle.step(1 / 20);
  if (battle.time >= next) { next += 120; const dist = Math.hypot(...s1.pos.map((x, i) => x - s2.pos[i])); console.log(`t=${Math.round(battle.time)}s dist=${fmtDist(dist)} pdKills A/B=${s1.stats.pdKills || 0}/${s2.stats.pdKills || 0}\n  ${row(s1)}\n  ${row(s2)}`); }
}
console.log(battle.over ? `→ ${battle.over.loser === 'A' ? b : a} wins at ${Math.round(battle.time)} s: ${battle.over.cause}` : '→ draw');
for (const s of [s1, s2]) { const D = s.design; console.log(`${D.cls}: accel ${(D.accelFull / 9.81).toFixed(2)} g, dv ${(D.deltaV / 1e3).toFixed(1)} km/s, laser out ${(D.laserOutput / 1e6).toFixed(0)} MW, patchHP ${(D.patchHP / 1e9).toFixed(1)} GJ, cooling ${(D.coolingAtMax / 1e6).toFixed(1)} MW, laserHeat ${(D.laserHeat / 1e6).toFixed(0)} MW, sink ${(D.sinkEnergy / 1e9).toFixed(1)} GJ, mass ${(D.wet / 1e3).toFixed(0)} t`); }
