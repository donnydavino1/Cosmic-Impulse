// The rules modules load in a sandbox and expose their data tables (used for the generated wiki pages).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameData } from '../tools/game-data.mjs';
test('engines, fuels, parts and technologies load from the rules modules', () => {
  const d = gameData();
  assert.ok(d.DR.length >= 5 && d.DR.every((e) => e.id && e.n && e.ve > 0), 'engines');
  assert.ok(Object.keys(d.FUEL).length >= 3, 'fuels');
  assert.ok(Object.values(d.PARTS).every((p) => p.n && p.m > 0), 'parts have names and mass');
  const ids = new Set(d.TECH.map((t) => t.id));
  for (const t of d.TECH) for (const p of t.pre || []) assert.ok(ids.has(p), `${t.id} needs unknown ${p}`);
});
