// Drones and probes follow the laws: built mass equals material mass (Law 3), probe trips are real Hohmann transfers.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameData } from '../tools/game-data.mjs';
const M = ['0100-physics.js', '0300-parts.js', '0400-tech.js', '1760-ops.js'];
test('drones and probes weigh exactly what they are built from', () => {
  const r = gameData(M, '{d:Object.values(OPS.droneMat).reduce((a,b)=>a+b,0),dm:OPS.droneM,p:Object.values(OPS.probeMat).reduce((a,b)=>a+b,0),pm:OPS.probeDry}');
  assert.ok(Math.abs(r.d - r.dm) < 1e-9, `drone ${r.d} kg of materials vs ${r.dm} kg`);
  assert.ok(Math.abs(r.p - r.pm) < 1e-9, `probe ${r.p} kg of materials vs ${r.pm} kg`);
});
test('Earth to Mars is a 2.9 km/s, 259-day Hohmann transfer', () => {
  const r = gameData(M, '{dv:hohDv(B[0].GM,1.496e11,2.2794e11),t:hohT(B[0].GM,1.496e11,2.2794e11)/86400}');
  assert.ok(Math.abs(r.dv - 2945) < 60, 'dv ' + r.dv);
  assert.ok(Math.abs(r.t - 259) < 3, 'days ' + r.t);
});
test('the new technologies exist and unlock in order', () => {
  const T = Object.fromEntries(gameData().TECH.map((t) => [t.id, t]));
  assert.ok(T.t_robo && T.t_probe, 'robotics and probes');
  assert.deepEqual(T.t_probe.pre, ['t_lab2']);
});
