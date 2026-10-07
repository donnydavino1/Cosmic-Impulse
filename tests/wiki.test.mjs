// The player wiki builds, every [[link]] points to a real page, the Controls page lists every action,
// and every technical document the wiki and AGENTS.md point to exists.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { buildWiki, TITLES } from '../tools/build-wiki.mjs';

const pages = buildWiki();
const files = ['', 'es/', 'zh/'].flatMap((d) => readdirSync('wiki/' + d).filter((f) => f.endsWith('.md')).map((f) => d + f));

test('every [[link]] resolves to a page', () => {
  for (const f of files) for (const m of readFileSync('wiki/' + f, 'utf8').matchAll(/\[\[([^\]]+)\]\]/g))
    { const pg = m[1].includes('|') ? m[1].split('|')[1] : m[1]; assert.ok(pages.includes(pg), `${f} links to missing page "${pg}"`); }
});
test('Controls page lists every key action', () => {
  const ctl = readFileSync('wiki/Controls.md', 'utf8'), keys = readFileSync('game/js/1100-keys.js', 'utf8');
  for (const m of keys.matchAll(/\['([a-z0-9]+)','([^']*)','([^']*)'/g)) if (m[1] !== 'ctrl') assert.ok(ctl.includes(m[3]), 'missing ' + m[1]);
});
test('documents referenced by the wiki and AGENTS.md exist', () => {
  const txt = files.map((f) => readFileSync('wiki/' + f, 'utf8')).join('\n') + readFileSync('AGENTS.md', 'utf8');
  for (const m of txt.matchAll(/`((?:docs|game|tools)\/[\w./-]+\.(?:md|json|mjs|py|js))`/g)) assert.ok(existsSync(m[1]), 'missing ' + m[1]);
});
test('every RULES module in the manifest exists', () => {
  for (const m of JSON.parse(readFileSync('game/manifest.json', 'utf8')).rules) assert.ok(existsSync('game/js/' + m), m);
});

test('every wiki page is translated, with a translated title, and every key action label', () => {
  for (const l of ['es', 'zh']) {
    for (const p of pages) assert.ok(existsSync(`wiki/${l}/${p.replace(/ /g, '-')}.md`), `${l}/${p} is not translated`);
    for (const p of pages) assert.ok(TITLES[l][p], `${l}: no sidebar title for ${p}`);
    const d = JSON.parse(readFileSync(`game/i18n/${l}.json`, 'utf8')), keys = readFileSync('game/js/1100-keys.js', 'utf8');
    for (const m of keys.matchAll(/\['([a-z0-9]+)','([^']*)','([^']*)'/g)) if (m[1] !== 'ctrl') assert.ok(d[m[3]], `${l}: no translation for action "${m[3]}"`);
  }
});
test('sidebar titles follow the language', () => {
  const h = readFileSync('wiki.html', 'utf8');
  for (const [l, T] of Object.entries(TITLES)) for (const t of Object.values(T)) assert.ok(h.includes(`data-l="${l}">${t.replace(/&/g, '&amp;')}</a>`), `${l} sidebar lacks "${t}"`);
});
