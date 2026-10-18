// Engine workshop rules (0580-engine-design.js) and laser optics (0590-optics.js) follow their physics.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameData } from '../tools/game-data.mjs';
const MODS = ['0100-physics.js', '0300-parts.js', '0400-tech.js', '0500-budgets.js', '0580-engine-design.js', '0590-optics.js'];
const q = (expr) => gameData(MODS, expr);
test('fusion reactions: D–³He has the fastest exhaust and least heat, D–T the most neutrons', () => {
  const r = q(`(()=>{const D=DR.find(d=>d.id==='dfd'),o={};for(const k of ['dd','dt','dhe3','pb11']){const p=engSpec(D,{opt:k,tune:0,D:1.5,L:8,shield:0,dims:true});o[k]={ve:p.ve,hf:p.hf,dose:p.dose,fuel:p.fuel,pw:p.pw}}return o})()`);
  assert.ok(r.dhe3.ve > r.dd.ve && r.dhe3.ve > r.dt.ve && r.dhe3.ve > r.pb11.ve);
  assert.ok(r.dhe3.hf < r.dd.hf && r.dt.hf > r.dd.hf);
  assert.ok(r.dt.dose > r.dd.dose && r.dd.dose > r.dhe3.dose && r.dhe3.dose > r.pb11.dose);
  assert.ok(r.dt.pw > r.dd.pw, 'D–T is denser in power'); assert.equal(r.dhe3.fuel, 'he3');
});
test('a bigger core gives more power; the stock size gives the stock power; tuning trades exhaust for thrust', () => {
  const r = q(`(()=>{const D=DR.find(d=>d.id==='dfd'),a=engSpec(D,{opt:'dd',tune:0,D:1.5,L:8,shield:0,dims:true}),b=engSpec(D,{opt:'dd',tune:0,D:3,L:8,shield:0,dims:true}),t=engSpec(D,{opt:'dd',tune:1,D:1.5,L:8,shield:0,dims:true});return{a:a.pw,b:b.pw,pw0:D.pw0,Fa:a.F,Ft:t.F,va:a.ve,vt:t.ve}})()`);
  assert.ok(Math.abs(r.a - r.pw0) / r.pw0 < 1e-9); assert.ok(Math.abs(r.b / r.a - 4) < 1e-9);
  assert.ok(r.vt > r.va && r.Ft < r.Fa);
});
test('thermal propellants follow √(T/M): water slowest, hydrogen fastest; new fuels exist', () => {
  const r = q(`(()=>{const D=DR.find(d=>d.id==='ntr'),o={};for(const k of ['h2','ch4','nh3','wat'])o[k]=engSpec(D,{opt:k,tune:0,D:1.6,L:6,shield:0,dims:true}).ve;o.f=['dt','he3','pb','kr','ar','li','ch4','nh3','wat','ml'].every(k=>FUEL[k]&&FUEL[k].n);return o})()`);
  assert.ok(r.h2 > r.ch4 && r.ch4 > r.nh3 && r.nh3 > r.wat); assert.ok(r.f);
});
test('laser reach grows with the mirror and shorter wavelengths', () => {
  const r = q(`(()=>{const a=optReach();s.optics={lam:'uv',D:1};const b=optReach();return{a,b,e:optEff()}})()`);
  assert.ok(Math.abs(r.b / r.a - 2 * 1.064 / 0.355) < 1e-6); assert.ok(r.e < 1);
});
test('a bigger nozzle bell: faster exhaust and more thrust at the same mass flow, a heavier engine', () => {
  const r = q(`(()=>{const D=DR.find(d=>d.id==='chem'),c={opt:'chem',tune:0,D:1.5,L:3,shield:0,dims:true},a=engSpec(D,{...c,eps:100}),b=engSpec(D,{...c,eps:300}),i=DR.find(d=>d.id==='ion'),x=engSpec(i,{opt:'xe',tune:0,D:.3,L:.3,shield:0,eps:300,dims:false});return{a,b,md:[a.F/a.ve,b.F/b.ve],heat:[a.heat,b.heat],ion:engNoz('grid',300).v}})()`);
  assert.ok(r.b.ve > r.a.ve && r.b.F > r.a.F && r.b.mass > r.a.mass);
  assert.ok(Math.abs(r.md[1] / r.md[0] - 1) < 1e-9, 'same mass flow'); assert.ok(Math.abs(r.heat[1] / r.heat[0] - 1) < 1e-9);
  assert.equal(r.ion, 1);
});
test('in-flight tuning for the variable-exhaust engine; bimodal cores add a reactor', () => {
  const r = q(`(()=>{UNL.vas=1;UNL.ntr=1;const V=DR.find(d=>d.id==='vas'),N=DR.find(d=>d.id==='ntr');const no=engLiveTune('vas',1);s.eng.vas={...engCfg(V),D:engCfg(V).D};engRecalc(V);const v0=V.ve;const ok=engLiveTune('vas',1);s.eng.ntr={...engCfg(N),D:engCfg(N).D,bim:1};engRecalc(N);return{no,ok,v0,v1:V.ve,bim:engBimReactors().length,pe:engBimReactors()[0].d.pe}})()`);
  assert.equal(r.no, false); assert.ok(r.ok && r.v1 > r.v0); assert.equal(r.bim, 1); assert.equal(r.pe, 25000);
});
test('engine clusters absorb failures one engine at a time', () => {
  const r = q(`(()=>{const D=DR.find(d=>d.id==='chem');s.eng.chem={...engCfg(D),D:engCfg(D).D,n:2};const a=engClusterFail(D),k=engClusterK(D),b=engClusterFail(D);return{a,k,b}})()`);
  assert.equal(r.a, true); assert.equal(r.k, 0.5); assert.equal(r.b, false);
});
