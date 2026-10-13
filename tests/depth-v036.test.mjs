// v0.36 rules: reactor power conversion (0585), hull coating (0594), crew health in space (2106).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameData } from '../tools/game-data.mjs';
const MODS = ['0100-physics.js', '0300-parts.js', '0400-tech.js', '0500-budgets.js', '0560-upgrades.js', '0585-power-conversion.js', '0594-hull-coating.js', '2106-crew-health.js', '2101-radiation-belts.js', '0110-atmosphere.js'];
const q = (expr) => gameData(MODS, expr);
test('power conversion keeps the reactor heat and changes the watts', () => {
  const r = q(`(()=>{const P=PARTS.fis2,th=P.pe/P.eta,o={};for(const k of ['te','stir','bray','sco2']){s.pcv=k;const e=pcvApply(P);o[k]={pe:e.pe,th:e.pe/e.eta,m:e.m}}s.pcv=null;o.stock=pcvApply(P)===P;o.fus=(()=>{s.pcv='sco2';return pcvApply(PARTS.fus_m)===PARTS.fus_m})();o.th=th;return o})()`);
  for (const k of ['te', 'stir', 'bray', 'sco2']) assert.ok(Math.abs(r[k].th - r.th) < 1e-6);
  assert.ok(r.sco2.pe > r.bray.pe && r.bray.pe > r.stir.pe && r.stir.pe > r.te.pe); assert.ok(r.stock && r.fus);
});
test('hull coating: reflector tiles absorb less sunlight', () => {
  const r = q(`(()=>{const a=hullAlpha();s.coat='osr';return{a,b:hullAlpha(),kg:coatKg()}})()`);
  assert.equal(r.a, 0.3); assert.equal(r.b, 0.08); assert.ok(r.kg > 0);
});
test('weightlessness: less exercise loses fitness faster; exercise time trades against work', () => {
  const r = q(`(()=>{s.crew={alive:true,dose:0,list:[{n:'A'}]};const o={};for(const e of [0,1,2.5]){s.exer=e;s.crew.list[0].fit=100;chTick(730.5);o[e]={fit:s.crew.list[0].fit,k:(s.crew.list[0].fit=100,chFitK())}}return o})()`);
  assert.ok(r[0].fit < r[1].fit && r[1].fit < r['2.5'].fit); assert.ok(Math.abs(r['2.5'].k - 1) < 1e-9 && r[0].k > r['2.5'].k);
});
test('radiation belts: none in low Earth orbit, lethal at Io, safe at Callisto', () => {
  const r = q(`(()=>{const at=(P,L)=>beltRate(2,P.x+L*P.R,P.y,P.z)*86400;return{leo:at(B[3],1.06),inner:at(B[3],1.6),io:at(B[6],5.9),cal:at(B[6],26.3)}})()`);
  assert.equal(r.leo, 0); assert.ok(r.inner > 0.01 && r.inner < 1); assert.ok(r.io > 10); assert.ok(r.cal < 0.01);
});
test('atmospheres: thin air high up, none at the parking orbit, density falls with height', () => {
  const r = q(`(()=>{const E=B[3];return{a400:aeroRho(E,4e5),a120:aeroRho(E,1.2e5),a80:aeroRho(E,8e4),m:aeroRho(B[5],1e5),moon:aeroRho(B[4],1e3)}})()`);
  assert.equal(r.a400, 0); assert.ok(r.a80 > r.a120 && r.a120 > 0); assert.ok(r.m > 0); assert.equal(r.moon, 0);
});
test('fission cores fade after their rated life', () => {
  const r = q(`(()=>{const p={id:'fis1'},th=PARTS.fis1.pe/PARTS.fis1.eta*10*3.15576e7;const o=[];for(const f of [0,.5,1,1.1,1.3]){p.burn=th*f;o.push(coreK(p))}return o})()`);
  assert.deepEqual(r.map(x => Math.round(x * 100)), [100, 100, 100, 50, 0]);
});
