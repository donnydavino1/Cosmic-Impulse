// Smoke test for the arena interface: builds dist/stellar-impulse-arena.html, then boots it inside
// sandboxed fake browsers (no real DOM or WebGL). It plays a full AI battle to the results screen,
// and connects two game instances to each other to check that online hits travel both ways.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import vm from 'node:vm';
import { fingerprint } from '../src/kernel/fingerprint.js';

execFileSync(process.execPath, ['tools/build.mjs']);
const html = readFileSync('dist/stellar-impulse-arena.html', 'utf8');
const bundle = html.match(/<script>\n([\s\S]*?)<\/script>/)[1].replace('net = new Net(', 'net = globalThis.__net = new Net(').replace('const state = {', 'const state = globalThis.__state = {');

/** A stand-in for three.js: any property or call returns another stand-in. */
const fake3 = () => new Proxy(function () {}, { get: (t, p) => (p === Symbol.toPrimitive ? () => 0 : fake3()), apply: () => fake3(), construct: () => fake3(), set: () => true });

function element() {
  const el = {
    hidden: false, innerHTML: '', textContent: '', value: '', className: '', disabled: false, style: {}, dataset: {}, children: [], handlers: {},
    addEventListener(t, f) { (this.handlers[t] = this.handlers[t] || []).push(f); },
    fire(t, e = {}) { (this.handlers[t] || []).forEach((f) => f({ target: this, ...e })); },
    replaceChildren(...c) { this.children = c; }, prepend(c) { this.children.unshift(c); }, appendChild(c) { this.children.push(c); return c; },
    get lastChild() { return { remove: () => el.children.pop() }; },
    remove() {}, setAttribute() {}, querySelector: () => element(),
    classList: { toggle() {}, add() {}, remove() {} },
    getContext: () => ({ createRadialGradient: () => ({ addColorStop() {} }), fillRect() {} }),
  };
  return el;
}

function boot(name) {
  const els = {};
  const winHandlers = {};
  const frames = [];
  const sent = [];
  const ctx = {
    console, Math, JSON, Date, Promise, Proxy, Symbol, Object, Array, String, Number, Set, Map, isFinite, setTimeout: (f) => f(), clearTimeout() {},
    btoa: (s) => Buffer.from(s, 'binary').toString('base64'), atob: (s) => Buffer.from(s, 'base64').toString('binary'), unescape, escape, encodeURIComponent, decodeURIComponent,
    THREE: fake3(), innerWidth: 1280, innerHeight: 800, devicePixelRatio: 1, __clock: 0,
    performance: { now: () => ctx.__clock },
    localStorage: { m: {}, getItem(k) { return this.m[k] ?? null; }, setItem(k, v) { this.m[k] = String(v); } },
    requestAnimationFrame: (f) => frames.push(f),
    addEventListener: (t, f) => (winHandlers[t] = winHandlers[t] || []).push(f),
    document: { getElementById: (id) => (els[id] = els[id] || element()), createElement: () => element(), querySelectorAll: () => [] },
  };
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(bundle, ctx, { filename: name });
  const api = {
    ctx, els, sent,
    key: (k, down = true) => (winHandlers[down ? 'keydown' : 'keyup'] || []).forEach((f) => f({ key: k, target: {} })),
    frames(n, ms = 16) {
      for (let i = 0; i < n; i++) {
        ctx.__clock += ms;
        const f = frames.shift();
        if (f) f(ctx.__clock);
      }
    },
  };
  return api;
}

test('the built game boots and shows the same rules fingerprint as the kernel', () => {
  const g = boot('A');
  assert.equal(g.els.fp.textContent, fingerprint());
});

test('a full battle against the AI runs to the results screen', () => {
  const g = boot('solo');
  g.els['go-ai'].fire('click');
  const el = (id) => g.ctx.document.getElementById(id);
  el('opponent').value = 'scout';
  el('distance').value = '100000';
  el('speed').value = '4';
  g.els['launch-ai'].fire('click');
  assert.equal(g.els.hud.hidden, false, 'battle HUD is showing');
  g.key('w');
  g.key('1');
  g.key('3');
  g.frames(600);
  assert.match(g.els.self.innerHTML, /Temperature/);
  assert.match(g.els.target.innerHTML, /Distance/);
  g.key('w', false);
  g.frames(20000, 40); // up to the 20-minute time limit at 4× speed
  assert.equal(g.els.result.hidden, false, 'results screen is showing');
  assert.match(g.els['result-title'].textContent, /Victory|Defeat/);
  console.log(`  solo result: ${g.els['result-title'].textContent}. ${g.els['result-cause'].textContent}`);
});

test('two players connect, agree on rules, and their hits reach each other', () => {
  const A = boot('host');
  const B = boot('guest');
  const pipe = (from, to) => (x) => to.ctx.__net.receive(x);
  for (const g of [A, B]) g.els['go-online'].fire('click');
  A.ctx.__net.open({ send: pipe(A, B) }, 'host');
  B.ctx.__net.open({ send: pipe(B, A) }, 'guest');
  assert.match(A.els['net-status'].textContent, /Same rules/);
  assert.match(B.els['net-status'].textContent, /Same rules/);
  A.els['ready'].fire('click');
  B.els['ready'].fire('click');
  assert.equal(A.els['launch-online'].disabled, false, 'host can launch once both are ready');
  A.ctx.document.getElementById('distance-online').value = '100000';
  A.els['launch-online'].fire('click');
  assert.equal(B.els.hud.hidden, false, 'guest entered the battle too');
  A.key('1'); // host fires lasers at the guest
  for (let i = 0; i < 200; i++) {
    A.frames(1);
    B.frames(1);
  }
  const host = A.ctx.__state.me;
  const guest = B.ctx.__state.me;
  assert.ok(host.stats.dealt > 0, 'host dealt damage');
  assert.ok(guest.stats.taken > 0, 'guest received the damage over the network');
  const seen = B.ctx.__state.foe.pos;
  assert.ok(Math.hypot(seen[0] - host.pos[0], seen[1] - host.pos[1], seen[2] - host.pos[2]) < 50, 'guest sees the host where the host really is');
  console.log(`  online: host dealt ${(host.stats.dealt / 1e6).toFixed(1)} MJ; guest received ${(guest.stats.taken / 1e6).toFixed(1)} MJ`);
});
