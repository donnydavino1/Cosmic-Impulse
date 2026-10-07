// Cosmic Impulse Arena: screens, the game loop, and the two ways to play (against the AI, or online).

import { CLASSES, WORLD, TECH, RULESET } from '../rules/rules.js';
import { evaluate, makeBlueprint, fmtDist, fmtEnergy } from '../kernel/design.js';
import { Battle, createShip } from '../kernel/battle.js';
import { fingerprint } from '../kernel/fingerprint.js';
import * as V from '../kernel/math.js';
import { makeBot } from './ai.js';
import { Designer, loadBlueprint } from './designer.js';
import { Renderer } from './render.js';
import { Hud } from './hud.js';
import { Controls } from './input.js';
import { Net } from './net.js';

const $ = (id) => document.getElementById(id);
const FP = fingerprint();
const SCREENS = ['menu', 'design', 'hud', 'result'];
const state = { mode: 'ai', battle: null, me: null, foe: null, bot: null, speed: 1, ending: false, last: 0, acc: 0, hudAt: 0, sendAt: 0, flushAt: 0, lastLaserHit: 0 };
let net = null; // created below, once the online UI exists
const online = { remoteBp: null, remoteName: '', myReady: false, theirReady: false, rulesOk: false, pilot: '' };

function show(name) {
  for (const s of SCREENS) $(s).hidden = s !== name;
}

// ---------------- menu and designer ----------------

$('ruleset').textContent = RULESET;
$('fp').textContent = FP;
for (const b of document.querySelectorAll('[data-go]')) b.addEventListener('click', () => leaveBattle(b.dataset.go));
$('go-ai').addEventListener('click', () => openDesigner('ai'));
$('go-online').addEventListener('click', () => openDesigner('online'));

for (const sel of [$('distance'), $('distance-online')])
  sel.innerHTML = WORLD.arenaDistances.map((d) => `<option value="${d}" ${d === 400e3 ? 'selected' : ''}>${fmtDist(d)}</option>`).join('');
$('opponent').innerHTML = `<option value="random">Surprise me</option>` + Object.entries(CLASSES).map(([id, c]) => `<option value="${id}">${c.name}</option>`).join('');

const designer = new Designer({ classes: $('classes'), sliders: $('sliders'), abilities: $('abilities'), numbers: $('numbers') }, loadBlueprint(), (bp) => {
  if (net && net.connected) {
    clearTimeout(online.designTimer);
    online.designTimer = setTimeout(() => net.send({ t: 'design', bp, name: online.pilot }), 250);
    setReady(false);
  }
});

function openDesigner(mode) {
  state.mode = mode;
  $('match-ai').hidden = mode !== 'ai';
  $('match-online').hidden = mode !== 'online';
  show('design');
}

// ---------------- battle setup ----------------

const controls = new Controls();
const renderer = new Renderer($('view'), $('labels'));
const hud = new Hud({ self: $('self'), target: $('target'), feed: $('feed'), weapons: $('weapons'), keys: $('keys'), clock: $('clock') }, controls, {
  missiles: () => state.battle && state.battle.launchMissiles(state.me),
  pd: () => state.me && (state.me.pd = !state.me.pd),
  radiators: () => state.me && (state.me.radExtended = !state.me.radExtended),
  throttle: () => (controls.throttle = controls.throttle >= 1 ? 0.25 : controls.throttle + 0.25),
});
controls.on('3', () => state.battle && state.battle.launchMissiles(state.me));
controls.on('p', () => state.me && (state.me.pd = !state.me.pd));
controls.on('v', () => state.me && (state.me.radExtended = !state.me.radExtended));
controls.on('q', () => (controls.throttle = Math.max(0.25, controls.throttle - 0.25)));
controls.on('e', () => (controls.throttle = Math.min(1, controls.throttle + 0.25)));
controls.on('c', () => (renderer.view.tactical = !renderer.view.tactical));

/** Two ships facing each other `distance` apart. `remote` marks the ship another computer controls. */
function startBattle({ seed, distance, myBp, foeBp, myId, foeId, foeName, remote, mySide }) {
  const battle = new Battle({ seed });
  const half = distance / 2;
  const me = battle.add(createShip(evaluate(myBp), { id: myId, name: online.pilot || 'You', pos: [mySide * half, 0, 0], fwd: [-mySide, 0, 0] }));
  const foe = battle.add(createShip(evaluate(foeBp), { id: foeId, name: foeName, pos: [-mySide * half, 0, 0], fwd: [mySide, 0, 0], remote }));
  me.target = foe.id;
  foe.target = me.id;
  Object.assign(state, { battle, me, foe, ending: false, acc: 0, last: performance.now(), bot: remote ? null : makeBot(battle, foe, { seed: seed + 1 }) });
  renderer.attach(battle, me.id);
  renderer.view = { az: 0, el: 0.25, dist: 160, tactical: false };
  $('feed').replaceChildren();
  show('hud');
  hud.say(`${foe.name} is ${fmtDist(distance)} away. Good hunting.`);
}

function startAI() {
  const pick = $('opponent').value;
  const ids = Object.keys(CLASSES);
  const cls = pick === 'random' ? ids[Math.floor(Math.random() * ids.length)] : pick;
  state.speed = +$('speed').value || 1;
  state.lastAI = { cls, distance: +$('distance').value };
  startBattle({
    seed: (Math.random() * 1e9) | 0,
    distance: state.lastAI.distance,
    myBp: designer.bp,
    foeBp: makeBlueprint(cls),
    myId: 'me',
    foeId: 'ai',
    foeName: `AI ${CLASSES[cls].name}`,
    remote: false,
    mySide: -1,
  });
}
$('launch-ai').addEventListener('click', startAI);
$('rematch').addEventListener('click', () => (state.mode === 'ai' ? startAI() : openDesigner('online')));

function leaveBattle(to) {
  if (state.battle && state.mode === 'online' && !state.battle.over) net.send({ t: 'over', loser: state.me.id, cause: 'left the battle' });
  state.battle = null;
  if (to === 'design') openDesigner(state.mode);
  else show(to);
}

// ---------------- the game loop ----------------

const STEP = 1 / 60;
function loop(now) {
  requestAnimationFrame(loop);
  const { battle, me } = state;
  if (!battle) return;
  const real = Math.min(0.1, (now - state.last) / 1000);
  state.last = now;
  state.acc += real * state.speed;
  const events = [];
  while (state.acc >= STEP) {
    state.acc -= STEP;
    controls.apply(battle, me);
    battle.step(STEP);
    if (state.bot) state.bot(); // the AI decides from what just happened, like a player would
    events.push(...battle.events);
    battle.events.length = 0;
    if (state.mode === 'ai') battle.outbox.length = 0;
  }
  hud.consume(events, me.id);
  renderer.frame(battle, me.id, events, real);
  if (state.mode === 'online') onlineTick(now);
  if (now - state.hudAt > 100) {
    state.hudAt = now;
    hud.update(battle, me, { limit: WORLD.arenaTimeLimit, note: state.mode === 'online' ? `Online, rules ${FP}` : state.speed > 1 ? `Practice speed ${state.speed}×` : '' });
  }
  if (battle.over && !state.ending) {
    state.ending = true;
    setTimeout(showResult, 2500);
  }
}
requestAnimationFrame(loop);

function showResult() {
  const { battle, me, foe } = state;
  if (!battle) return;
  const won = battle.over.loser !== me.id;
  $('result-title').textContent = won ? 'Victory' : 'Defeat';
  $('result-cause').textContent = `${battle.over.loser === me.id ? 'Your ship' : foe.name}: ${battle.over.cause}.`;
  const rows = [
    ['Damage dealt', (s) => fmtEnergy(s.stats.dealt)],
    ['Damage taken', (s) => fmtEnergy(s.stats.taken)],
    ['Peak temperature', (s) => `${Math.round(s.stats.peakTemp)} K`],
    ['Missiles shot down', (s) => s.stats.pdKills || 0],
    ['Fuel left', (s) => `${Math.round((100 * s.propellant) / s.design.params.propellant)}%`],
  ];
  $('result-table').innerHTML =
    `<tr><th></th><th>${me.name} (${me.design.className})</th><th>${foe.name} (${foe.design.className})</th></tr>` +
    rows.map(([k, f]) => `<tr><td>${k}</td><td>${f(me)}</td><td>${state.mode === 'online' && k !== 'Damage dealt' ? '–' : f(foe)}</td></tr>`).join('') +
    `<tr><td>Battle time</td><td colspan="2">${Math.floor(battle.time / 60)} min ${Math.round(battle.time % 60)} s</td></tr>`;
  state.battle = null;
  show('result');
}

// ---------------- online play ----------------

const status = (text, cls = '', code) => {
  const el = $('net-status');
  el.textContent = text;
  el.className = `status ${cls}`;
  if (code !== undefined) $('room-code').textContent = code;
};

net = new Net({
  onStatus: status,
  onOpen: (role) => {
    if (!online.rulesOk) status(`Connected as ${role}. Checking that you both play by the same rules…`, 'ok'); // their hello may already have arrived
    net.send({ t: 'hello', ruleset: RULESET, fp: FP, name: online.pilot });
    net.send({ t: 'design', bp: designer.bp, name: online.pilot });
  },
  onClose: () => {
    status('Disconnected.', 'bad');
    online.rulesOk = false;
    if (state.battle && state.mode === 'online' && !state.battle.over) {
      state.battle.over = { loser: state.foe.id, cause: 'lost the connection' };
    }
    refreshLaunch();
  },
  onMessage: onMessage,
});

online.pilot = localStorage.getItem('orbital-pilot') || `Pilot ${100 + Math.floor(Math.random() * 900)}`;
$('pilot').value = online.pilot;
$('pilot').addEventListener('input', (e) => {
  online.pilot = e.target.value.slice(0, 20) || 'Pilot';
  localStorage.setItem('orbital-pilot', online.pilot);
});
$('host').addEventListener('click', () => net.host());
$('join').addEventListener('click', () => net.join($('room').value));
$('manual-1').addEventListener('click', async () => ($('manual-code').value = await net.invite().catch((e) => `Error: ${e.message}`)));
$('manual-2').addEventListener('click', async () => ($('manual-code').value = await net.answer($('manual-code').value).catch((e) => `That invite did not work: ${e.message}`)));
$('manual-3').addEventListener('click', () => net.finish($('manual-code').value).catch((e) => status(`That reply did not work: ${e.message}`, 'bad')));
$('ready').addEventListener('click', () => setReady(!online.myReady));
$('launch-online').addEventListener('click', () => {
  const seed = (Math.random() * 1e9) | 0;
  const distance = +$('distance-online').value;
  net.send({ t: 'start', seed, distance });
  startOnline(seed, distance);
});

function setReady(on) {
  online.myReady = on;
  $('ready').textContent = on ? 'Ready ✓' : 'I’m ready';
  net.send({ t: 'ready', on });
  refreshLaunch();
}

function refreshLaunch() {
  const ok = net.connected && online.rulesOk && online.remoteBp && online.myReady && online.theirReady;
  $('launch-online').disabled = !(ok && net.role === 'host');
  $('launch-online').textContent = net.role === 'guest' ? 'The host launches' : 'Launch';
}

function startOnline(seed, distance) {
  const host = net.role === 'host';
  state.speed = WORLD.encounterSpeed; // online battles always run in real time
  startBattle({ seed, distance, myBp: designer.bp, foeBp: online.remoteBp, myId: host ? 'H' : 'G', foeId: host ? 'G' : 'H', foeName: online.remoteName || 'Opponent', remote: true, mySide: host ? -1 : 1 });
}

function onMessage(msg) {
  const { battle, me, foe } = state;
  switch (msg.t) {
    case 'hello':
      online.remoteName = String(msg.name || 'Opponent').slice(0, 20);
      online.rulesOk = msg.fp === FP;
      status(online.rulesOk ? `Connected to ${online.remoteName}. Same rules (${FP}). Pick your ship, then press “I’m ready”.` : `${online.remoteName} runs different rules (${msg.fp}, yours ${FP}). Both players need the same version of the game.`, online.rulesOk ? 'ok' : 'bad');
      break;
    case 'design':
      try {
        online.remoteBp = makeBlueprint(msg.bp.cls, msg.bp.sliders, msg.bp.name); // we evaluate it ourselves: stats can't be faked
        online.remoteName = String(msg.name || online.remoteName).slice(0, 20);
        online.theirReady = false;
      } catch (e) {
        online.remoteBp = null;
      }
      break;
    case 'ready':
      online.theirReady = !!msg.on;
      break;
    case 'start':
      if (net.role === 'guest' && Number.isFinite(msg.seed) && WORLD.arenaDistances.includes(msg.distance)) startOnline(msg.seed, msg.distance);
      break;
    case 'state':
      if (battle && msg.s) battle.applyRemoteState(foe.id, msg.s);
      break;
    case 'hit': {
      const hit = battle && validateHit(msg);
      if (hit) battle.applyHit(me, hit);
      break;
    }
    case 'shot':
      if (battle && [msg.pos, msg.vel].every((v) => Array.isArray(v) && v.length === 3 && v.every(Number.isFinite)))
        battle.slugs.push({ owner: foe.id, pos: msg.pos, vel: msg.vel, life: 60, visual: true });
      break;
    case 'mkill':
      if (battle) battle.missiles = battle.missiles.filter((m) => m.id !== msg.id || m.owner !== me.id);
      break;
    case 'over':
      if (battle && msg.loser === foe.id && !battle.over) {
        foe.alive = false;
        battle.over = { loser: foe.id, cause: String(msg.cause || 'defeated').slice(0, 80), time: battle.time };
      }
      break;
  }
  refreshLaunch();
}

/** Never trust a reported hit beyond what the shooter's design could physically deliver. */
function validateHit(msg) {
  const { me, foe } = state;
  if (!(msg.energy > 0)) return null;
  const relSpeed = V.len(V.sub(foe.vel, me.vel));
  if (msg.kind === 'laser') {
    const now = performance.now();
    const elapsed = V.clamp((now - (state.lastLaserHit || now - 100)) / 1000, 0.1, 0.5);
    state.lastLaserHit = now;
    return { kind: 'laser', energy: Math.min(msg.energy, foe.design.laserOutput * elapsed * 1.5), fromPos: foe.pos };
  }
  if (msg.kind === 'kinetic') {
    const missile = foe.design.missiles && msg.area === TECH.missile.impactArea;
    if (!missile && !foe.design.railguns) return null;
    const cap = missile
      ? 0.5 * TECH.missile.mass * (relSpeed + TECH.missile.deltaV + 500) ** 2
      : 0.5 * TECH.railgun.slugMass * (relSpeed + TECH.railgun.muzzleSpeed + 500) ** 2;
    return { kind: 'kinetic', energy: Math.min(msg.energy, cap), area: missile ? TECH.missile.impactArea : TECH.railgun.impactArea, fromPos: foe.pos };
  }
  return null;
}

function onlineTick(now) {
  const { battle, me } = state;
  if (now - state.sendAt > 50) {
    state.sendAt = now;
    net.send({ t: 'state', s: battle.stateOf(me) });
  }
  if (now - state.flushAt > 100) {
    state.flushAt = now;
    let laser = 0;
    for (const m of battle.outbox.splice(0)) {
      if (m.type === 'hit' && m.kind === 'laser') laser += m.energy;
      else if (m.type === 'hit') net.send({ t: 'hit', kind: 'kinetic', energy: m.energy, area: m.area });
      else if (m.type === 'shot') net.send({ t: 'shot', pos: m.pos, vel: m.vel });
      else if (m.type === 'mkill') net.send({ t: 'mkill', id: m.id });
      else if (m.type === 'over') net.send({ t: 'over', loser: m.loser, cause: m.cause });
    }
    if (laser > 0) net.send({ t: 'hit', kind: 'laser', energy: laser });
  }
}
