// Loads the game's own data tables (engines, fuels, parts, technologies, weapons) straight from the RULES modules,
// in a sandbox with dummy browser objects, so docs and wiki pages are generated from the real numbers.
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const stub = () => new Proxy(function () {}, { get: (t, p) => (p === Symbol.toPrimitive ? () => 0 : p === 'length' ? 0 : stub()), apply: () => stub(), construct: () => stub(), set: () => true });
export function gameData(modules = ['0100-physics.js', '0300-parts.js', '0400-tech.js'], expr = null) {
  const base = { Math, JSON, Object, Array, Number, String, Boolean, Date, Infinity, NaN, isFinite, parseFloat, parseInt, console, Symbol, Map, Set,
    Float32Array, Float64Array, Uint8Array, RegExp, Error, Promise, setTimeout: () => 0, setInterval: () => 0 };
  const ctx = vm.createContext(new Proxy(base, { has: () => true, get: (t, p) => (p in t ? t[p] : typeof p === 'string' ? stub() : undefined), set: (t, p, v) => { t[p] = v; return true } }));
  let src = modules.map((m) => readFileSync(join(root, 'game', 'js', m), 'utf8')).join('\n');
  if (expr) return JSON.parse(JSON.stringify(vm.runInContext(src + '\n;(' + expr + ')', ctx)));
  src += '\n;({DR:typeof DR!=="undefined"?DR:null,FUEL:typeof FUEL!=="undefined"?FUEL:null,PARTS:typeof PARTS!=="undefined"?PARTS:null,TECH:typeof TECH!=="undefined"?TECH:null,ENGR:typeof ENGR!=="undefined"?ENGR:null})';
  return JSON.parse(JSON.stringify(vm.runInContext(src, ctx)));
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const d = gameData();
  for (const k in d) console.log(k, d[k] ? (Array.isArray(d[k]) ? d[k].length : Object.keys(d[k]).length) : null);
  console.log(JSON.stringify(d.DR[0]).slice(0, 400)); console.log(JSON.stringify(d.TECH[0])); console.log(JSON.stringify(Object.entries(d.PARTS)[5]));
  console.log(JSON.stringify(d.ENGR && Object.entries(d.ENGR)[0]));
}
