// Heat-pipe fluid (0597), solar sail film (0598) and greenhouse crops (0599) follow their physics.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameData } from '../tools/game-data.mjs';
const MODS = ['0100-physics.js', '0300-parts.js', '0400-tech.js', '0500-budgets.js', '0560-upgrades.js', '0597-heat-pipes.js', '0598-sail-film.js', '0599-greenhouse.js', '0591-rail-slugs.js', '0596-cryo-tanks.js'];
const q = (expr) => gameData(MODS, expr);
test('heat-pipe fluid sets the radiator limit and mass; droplet radiators are untouched', () => {
  const r = q(`(()=>{const o={};for(const k of ['k','na','li']){s.hpf=k;const e=hpfApply(PARTS.rad_hi);o[k]={T:e.Tmax,m:e.m}}s.hpf='li';o.dr=PARTS.rad_dr.hp?1:0;o.pe=partEff({id:'rad_hi',mk:1}).Tmax;return o})()`);
  assert.equal(r.k.T, 900); assert.equal(r.na.T, 1200); assert.equal(r.li.T, 1500);
  assert.ok(r.li.m > r.na.m && r.na.m > r.k.m); assert.equal(r.dr, 0); assert.equal(r.pe, 1500);
});
test('sail film: temperature falls as 1/√distance; carbon survives closest; thin film pushes most per kg', () => {
  const r = q(`(()=>{const P=SAILM.poly,o={t1:sailT(AU,P),t4:sailT(AU/4,P)};o.min=Object.fromEntries(Object.keys(SAILM).map(k=>[k,sailMinR(SAILM[k])/AU]));o.a=Object.fromEntries(Object.keys(SAILM).map(k=>[k,(1+SAILM[k].rho)/SAILM[k].kg]));o.Tm=sailT(sailMinR(P),P);return o})()`);
  assert.ok(Math.abs(r.t4 / r.t1 - 2) < 1e-9); assert.ok(Math.abs(r.Tm - 600) < 1e-6);
  assert.ok(r.min.carb < r.min.poly && r.min.poly < r.min.thin);
  assert.ok(r.a.thin > r.a.carb && r.a.carb > r.a.poly);
});
test('greenhouse crops trade food surplus, power and morale', () => {
  const r = q(`CROPS`);
  assert.ok(r.alg.food > r.pot.food && r.pot.food > r.gar.food && r.gar.food > 0);
  assert.ok(r.alg.pw < r.pot.pw && r.pot.pw < r.gar.pw); assert.ok(r.gar.mor > r.pot.mor && r.pot.mor > r.alg.mor);
});
test('railgun slugs share 64 MJ: v = √(2E/m), recoil momentum grows with √m', () => {
  const r = q(`({v:[slugV(.5),slugV(2),slugV(8)],p:[.5*slugV(.5),8*slugV(8)]})`);
  assert.deepEqual(r.v.map(Math.round), [16000, 8000, 4000]); assert.ok(Math.abs(r.p[1] / r.p[0] - 4) < 1e-9);
});
test('cryogenic boil-off: hydrogen boils, xenon does not; a sunshield cuts it, cryocoolers stop it', () => {
  const r = q(`(()=>{s.fuel.h2=1e4;s.fuel.xe=500;s.en=1e9;const a=cryoRates();s.tank='shade';const b=cryoRates();s.tank='zbo';const c=cryoRates(),w=cryoW();return{a,b,c,w}})()`);
  assert.ok(r.a.h2 > 0 && !r.a.xe); assert.ok(Math.abs(r.a.h2 / r.b.h2 - 6) < 1e-9); assert.equal(r.c.h2, 0); assert.ok(r.w > 0);
});
