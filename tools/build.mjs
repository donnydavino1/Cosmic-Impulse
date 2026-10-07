// Builds dist/stellar-impulse-arena.html: the whole arena in one file you can open by double-clicking.
// (Browsers refuse to load ES modules from file:// URLs, so the modular arena.html needs a web
// server or GitHub Pages; this bundle does not.)  Usage:  npm run build
//
// A deliberately tiny bundler with no dependencies. It supports the import/export forms this
// code base uses: `import { a, b as c } from './x.js'`, `import * as X from './x.js'`, and
// `export function|class|const`.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const IMPORT = /^import\s+(.+?)\s+from\s+'(.+?)';\s*$/gm;

const modules = new Map(); // absolute path -> { id, code }
const order = [];

function load(file) {
  if (modules.has(file)) return modules.get(file);
  const src = readFileSync(file, 'utf8');
  const mod = { id: `__m${modules.size}`, file, src };
  modules.set(file, mod);
  for (const [, , spec] of src.matchAll(IMPORT)) load(resolve(dirname(file), spec));
  order.push(mod);
  return mod;
}

function transform(mod) {
  const exported = [];
  let code = mod.src.replace(IMPORT, (_, what, spec) => {
    const dep = modules.get(resolve(dirname(mod.file), spec)).id;
    if (what.startsWith('* as ')) return `const ${what.slice(5).trim()} = ${dep};`;
    const names = what.replace(/[{}]/g, '').split(',').map((s) => s.trim()).filter(Boolean).map((s) => s.replace(/\s+as\s+/, ': '));
    return `const { ${names.join(', ')} } = ${dep};`;
  });
  code = code.replace(/^export\s+(async\s+function|function|class|const|let)\s+([A-Za-z_$][\w$]*)/gm, (_, kind, name) => {
    exported.push(name);
    return `${kind} ${name}`;
  });
  if (/^export\s/m.test(code)) throw new Error(`Unsupported export form in ${relative(root, mod.file)}`);
  return `// ---- ${relative(root, mod.file)} ----\nconst ${mod.id} = (() => {\n${code}\nreturn { ${exported.join(', ')} };\n})();\n`;
}

const html = readFileSync(resolve(root, 'arena.html'), 'utf8');
const entry = resolve(root, 'src/arena/main.js');
load(entry);
const bundle = order.map(transform).join('\n');
const css = readFileSync(resolve(root, 'src/arena/arena.css'), 'utf8');

const out = html
  .replace('<link rel="stylesheet" href="src/arena/arena.css">', () => `<style>\n${css}</style>`)
  .replace('<script type="module" src="src/arena/main.js"></script>', () => `<script>\n// Built by tools/build.mjs from the sources in src/. Edit those, not this file.\n${bundle}</script>`)
  .replace('href="stellar-impulse.html"', 'href="../stellar-impulse.html"');

mkdirSync(resolve(root, 'dist'), { recursive: true });
writeFileSync(resolve(root, 'dist/stellar-impulse-arena.html'), out);
console.log(`dist/stellar-impulse-arena.html: ${order.length} modules, ${(out.length / 1024).toFixed(0)} KB`);
