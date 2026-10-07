// The translator handles exact text, phrases inside text, and {} patterns for messages built at run time.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function translator(lang) {
  const data = { es: JSON.parse(readFileSync('game/i18n/es.json', 'utf8')), zh: JSON.parse(readFileSync('game/i18n/zh.json', 'utf8')) };
  const src = readFileSync('game/js/0060-i18n.js', 'utf8').replace('/*@I18N_DATA*/{}', JSON.stringify(data));
  const ctx = { location: { search: '?lang=' + lang }, localStorage: { getItem: () => null, setItem() {} }, navigator: { language: 'en' },
    document: { documentElement: {}, body: { nodeType: 1, nodeName: 'BODY', childNodes: [], hasAttribute: () => false }, querySelector: () => null },
    MutationObserver: class { observe() {} }, addEventListener() {}, setTimeout() {}, URLSearchParams };
  vm.createContext(ctx); vm.runInContext(src + '\n;i18nPrep();this.tr=tr;', ctx);
  return ctx.tr;
}
test('patterns translate run-time messages, including their variable parts', () => {
  const tr = translator('es');
  assert.equal(tr('⚔ Wave 3 is already attacking!'), '⚔ ¡La oleada 3 ya está atacando!');
  assert.equal(tr('📋 Accepted: Reach orbit around Mars   ✕'), '📋 Aceptado: Entrar en órbita alrededor de Marte   ✕');
  assert.match(tr('💥 Raider R-2 destroyed: salvaged 40 kg iron, 5 kg nickel, 10 kg silicates, 0.2 kg platinum metals · 2 left'), /Saqueador R-2 destruido: recuperados .* quedan 2$/);
  assert.equal(translator('zh')('Mine 500 kg of asteroid rock'), '开采 500 kg 小行星岩石');
});
test('patterns never invent placeholders, and only drop the ordinals in 1st/3rd person', () => {
  const en = JSON.parse(readFileSync('game/i18n/es.json', 'utf8'));
  for (const l of ['es', 'zh']) { const d = JSON.parse(readFileSync(`game/i18n/${l}.json`, 'utf8'));
    for (const k of Object.keys(en)) if (/\{#?\}/.test(k)) { const n = (d[k].match(/\{(#|\d*)\}/g) || []).length, m = (k.match(/\{#?\}/g) || []).length; assert.ok(n <= m && (n > 0 || /\{#\}(st|rd)/.test(k)), `${l}: ${k}`); } }
});
test('number placeholders only match numbers', () => {
  const tr = translator('es');
  assert.equal(tr('Velocity 37.5 km/s'), 'Velocidad 37.5 km/s');
  assert.equal(tr('Velocity fast km/s'), 'Velocity fast km/s');
});
