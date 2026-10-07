// Generates RULES.md, the human-readable Rules file, from src/rules/rules.js.
// The code is the single source of truth; regenerate after changing any rule:  npm run rules

import { writeFileSync } from 'node:fs';
import { RULESET, PHYS, WORLD, MATERIALS, TECH, SLIDER_RANGES, CLASSES, SLIDERS } from '../src/rules/rules.js';
import { fingerprint } from '../src/kernel/fingerprint.js';
import { evaluate, makeBlueprint, summarize } from '../src/kernel/design.js';

const fmt = (v) => (typeof v === 'number' ? (Math.abs(v) >= 1e5 || (Math.abs(v) < 1e-3 && v !== 0) ? v.toExponential(2) : String(v)) : JSON.stringify(v));
const table = (obj) => ['| Rule | Value |', '|---|---|', ...Object.entries(obj).map(([k, v]) => `| ${k} | ${fmt(v)} |`)].join('\n');
const flat = (obj, pre = '') =>
  Object.entries(obj).flatMap(([k, v]) => (v && typeof v === 'object' && !Array.isArray(v) ? flat(v, `${pre}${k}.`) : [[`${pre}${k}`, v]]));

const out = `# Stellar Impulse Rules

> Generated from \`src/rules/rules.js\` by \`npm run rules\`. Do not edit by hand.

Rule set **${RULESET}**, fingerprint **${fingerprint()}**.

These rules are fixed and identical for everyone. Customization changes how your ship looks and
how you see and control it, never what it can physically do. Two games only fight each other if
their fingerprints match.

## Physical constants

${table(PHYS)}

## World

${table(WORLD)}

The Vision sets the server speed at 300× real time. \`encounterSpeed\` is a **proposal**: ships
that are fighting each other run in real time, because a ten-minute battle would otherwise last
two seconds. This needs the project owner's decision before it becomes a final rule.

## Materials

| Material | Properties |
|---|---|
${Object.values(MATERIALS).map((m) => `| ${m.name} | ${Object.entries(m).filter(([k]) => k !== 'name').map(([k, v]) => `${k} ${fmt(v)}`).join(', ')} |`).join('\n')}

## Technology: ${TECH.era} era scaling laws

| Rule | Value |
|---|---|
${flat(TECH).map(([k, v]) => `| ${k} | ${fmt(v)} |`).join('\n')}

## Design sliders

Each slider moves one physical quantity between two limits.

| Slider | Left | Right | Physical quantity | Range |
|---|---|---|---|---|
${SLIDERS.map((s) => { const r = SLIDER_RANGES[s.id]; return `| ${s.id} | ${s.left} | ${s.right} | ${r.param} | ${fmt(r.min)} to ${fmt(r.max)} ${r.unit} |`; }).join('\n')}

## Ship classes (starting blueprints)

${Object.entries(CLASSES).map(([id, c]) => {
  const d = evaluate(makeBlueprint(id));
  return `### ${c.name}\n\n${c.role}\n\n${summarize(d).map(([k, v]) => `- **${k}:** ${v}`).join('\n')}`;
}).join('\n\n')}
`;

writeFileSync(new URL('../RULES.md', import.meta.url), out);
console.log(`RULES.md written (fingerprint ${fingerprint()})`);
