// Exports facts for the overview PDF (class abilities, AI tournament) so the document always
// matches what the game actually computes.  Usage: node tools/export-facts.mjs > /tmp/facts.json
import { CLASSES, RULESET, SLIDERS } from '../src/rules/rules.js';
import { evaluate, makeBlueprint, summarize } from '../src/kernel/design.js';
import { Battle, createShip } from '../src/kernel/battle.js';
import { fingerprint } from '../src/kernel/fingerprint.js';
import { makeBot } from '../src/arena/ai.js';

const classes = Object.entries(CLASSES).map(([id, c]) => ({ id, name: c.name, role: c.role, summary: summarize(evaluate(makeBlueprint(id))) }));
const results = [];
for (const a of Object.keys(CLASSES))
  for (const b of Object.keys(CLASSES)) {
    if (a === b) continue;
    const battle = new Battle({ seed: 11 });
    const s1 = battle.add(createShip(evaluate(makeBlueprint(a)), { id: 'A', pos: [-200e3, 0, 0], fwd: [1, 0, 0] }));
    const s2 = battle.add(createShip(evaluate(makeBlueprint(b)), { id: 'B', pos: [200e3, 0, 0], fwd: [-1, 0, 0] }));
    const bots = [makeBot(battle, s1, { seed: 1 }), makeBot(battle, s2, { seed: 2 })];
    while (!battle.over) { battle.step(1 / 20); bots.forEach((t) => t()); battle.events.length = 0; }
    results.push({ a: CLASSES[a].name, b: CLASSES[b].name, winner: battle.over.loser === 'A' ? CLASSES[b].name : CLASSES[a].name, minutes: battle.time / 60, cause: battle.over.cause });
  }
console.log(JSON.stringify({ ruleset: RULESET, fingerprint: fingerprint(), sliders: SLIDERS, classes, results }, null, 1));
