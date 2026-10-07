// The two playable files must be built from the same core, and the game script must parse.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { buildGame } from '../tools/build-game.mjs';

const r = buildGame({ write: false });

test('desktop and phone builds share an identical core', () => {
  // everything up to the end of the main game script is the same in both files, apart from the head tweaks
  const main = (h) => h.slice(h.indexOf('<script>const ORB_FP'), h.indexOf('</script>', h.indexOf('// ---- game/js/')) );
  assert.equal(main(r.desktop), main(r.mobile));
  assert.ok(r.desktop.includes(`ORB_FP='${r.fp}'`) && r.mobile.includes(`ORB_FP='${r.fp}'`));
});

test('modules load in order and the game script parses', () => {
  assert.deepEqual(r.modules, [...r.modules].sort());
  const js = r.core.slice(r.core.indexOf('// ---- game/js/'), r.core.indexOf('</script>', r.core.indexOf('// ---- game/js/')));
  assert.doesNotThrow(() => new vm.Script(js, { filename: 'orbital-game.js' }));
});

test('every module starts with a header comment', () => {
  for (const m of r.modules) {
    const start = r.core.indexOf(`// ---- game/js/${m} ----\n`) + `// ---- game/js/${m} ----\n`.length;
    assert.match(r.core.slice(start, start + 4), /^\/\//, `${m} should start with a // header comment`);
  }
});
