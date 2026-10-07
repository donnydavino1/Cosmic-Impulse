// Builds the two playable files from the modules in game/:
//   stellar-impulse.html         desktop (keyboard + mouse)
//   stellar-impulse-mobile.html  phone (touch layout, ☰ menu for every key)
// Both contain the SAME game core (shell + css + js, byte for byte); only the platform layer differs.
// The SHA-256 of that core is the game's rules fingerprint (printed, and embedded as ORB_FP).
// Usage: node tools/build-game.mjs        (or: npm run game)
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const G = (...p) => join(root, 'game', ...p);
const list = (d, ext) => readdirSync(G(d)).filter((f) => f.endsWith(ext)).sort();

export function buildGame({ write = true, release = false } = {}) {
  const shell = readFileSync(G('shell.html'), 'utf8');
  const css = list('css', '.css').map((f) => `/* ---- game/css/${f} ---- */\n` + readFileSync(G('css', f), 'utf8')).join('\n');
  const i18n = Object.fromEntries(readdirSync(G('i18n')).filter((f) => f.endsWith('.json')).sort().map((f) => [f.slice(0, -5), JSON.parse(readFileSync(G('i18n', f), 'utf8'))]));
  const js = list('js', '.js').map((f) => `// ---- game/js/${f} ----\n` + readFileSync(G('js', f), 'utf8')).join('\n').replace('/*@I18N_DATA*/{}', () => JSON.stringify(i18n));
  const core = shell.replace('/*@CSS*/', () => css).replace('/*@JS*/', () => js);
  const fp = createHash('sha256').update(core).digest('hex').slice(0, 16);
  // physics fingerprint: only the RULES modules (game/manifest.json). Client modules can change without affecting it.
  const manifest = JSON.parse(readFileSync(G('manifest.json'), 'utf8'));
  const missing = manifest.rules.filter((m) => !list('js', '.js').includes(m));
  if (missing.length) throw new Error('manifest lists missing rules modules: ' + missing.join(', '));
  const rulesFp = createHash('sha256').update(manifest.rules.map((m) => readFileSync(G('js', m), 'utf8')).join('\n')).digest('hex').slice(0, 16);
  const offPath = G('official-rules.json'), official = JSON.parse(readFileSync(offPath, 'utf8'));
  if (release && !official.releases.some((r) => r.fp === rulesFp)) {
    official.releases.push({ version: JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version, fp: rulesFp, date: new Date().toISOString().slice(0, 10) });
    writeFileSync(offPath, JSON.stringify(official, null, 2) + '\n');
  }
  const stamp = `<script>const ORB_FP='${fp}',ORB_RULES_FP='${rulesFp}',ORB_OFFICIAL=${JSON.stringify(official.releases.map((r) => r.fp))};</script>\n`;
  const stamped = core.replace('<!--@STAMP-->', () => stamp);
  const desktop = stamped.replace('<!--@PLATFORM-->', () => readFileSync(G('platform', 'desktop.html'), 'utf8'));
  const mobile = stamped
    .replace('<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">',
      '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">\n<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes">')
    .replace(/<title>[^<]*<\/title>/, '<title>Stellar Impulse (phone)</title>')
    .replace('<!--@PLATFORM-->', () => readFileSync(G('platform', 'mobile.html'), 'utf8'));
  if (write) {
    writeFileSync(join(root, 'stellar-impulse.html'), desktop);
    writeFileSync(join(root, 'stellar-impulse-mobile.html'), mobile);
  }
  return { fp, rulesFp, official: official.releases, desktop, mobile, core, modules: list('js', '.js'), manifest };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const r = buildGame({ release: process.argv.includes('--release') });
  const off = r.official.some((x) => x.fp === r.rulesFp);
  console.log(`built stellar-impulse.html (${r.desktop.length} B) and stellar-impulse-mobile.html (${r.mobile.length} B) from ${r.modules.length} modules\n  code fingerprint ORB_FP ${r.fp}\n  physics fingerprint ORB_RULES_FP ${r.rulesFp} ${off ? '(official ✓)' : '(not an official release: battles only with identical builds)'}`);
}
