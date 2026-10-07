// Battle simulation: ships, heat flow, weapons, missiles, point defence and damage.
//
// Deterministic from a seed. Contains no graphics or input code: the arena, the AI and the tests
// all drive it through the same small set of commands, so a bot plays by exactly the same rules
// as a person. In multiplayer each player is authoritative over their own ship: hits on a
// "remote" ship are not applied here but placed in `outbox` for the network layer to send.

import { TECH, MATERIALS, WORLD } from '../rules/rules.js';
import { radiatorPower, laserFraction, penetration } from './design.js';
import * as V from './math.js';

export const FACES = ['front', 'back', 'left', 'right', 'top', 'bottom'];
const PARTS = ['crew', 'reactor', 'engine', 'generator', 'storage', 'sink'];

/** A fresh ship built from an evaluated design. */
export function createShip(design, { id, name, pos, vel = [0, 0, 0], fwd = [1, 0, 0], remote = false }) {
  const C = TECH.components;
  const weapons = [
    ...design.lasers.map((l) => ({ type: 'laser', ...l, hp: C.weapons.hp })),
    ...Array.from({ length: design.railguns }, () => ({ type: 'railgun', hp: C.weapons.hp, cooldown: 0 })),
    ...(design.missiles ? [{ type: 'missiles', hp: C.weapons.hp, left: design.missiles, cooldown: 0 }] : []),
  ];
  return {
    id,
    name: name || design.name,
    design,
    remote,
    pos: [...pos],
    prevPos: [...pos],
    vel: [...vel],
    acc: [0, 0, 0],
    fwd: V.norm(fwd),
    cmd: { dir: null, throttle: 0 },
    propellant: design.params.propellant,
    water: design.params.water,
    temp: TECH.hull.startTemp,
    energy: design.storageEnergy,
    radExtended: true,
    radArea: design.params.radArea,
    armor: FACES.map(() => design.patchHP),
    parts: Object.fromEntries(PARTS.map((p) => [p, C[p].hp])),
    weapons,
    laserOn: false,
    pd: true,
    target: null,
    heatIn: 0,
    thrusting: 0,
    generating: 0,
    alive: true,
    cause: '',
    stats: { dealt: 0, taken: 0, peakTemp: TECH.hull.startTemp, hits: 0 },
  };
}

export const shipMass = (sh) => sh.design.dry - sh.design.params.water + sh.water + sh.propellant;
export const isHot = (sh) => sh.temp >= TECH.limits.throttleTemp;

/** Which armour face (0–5) a hit from direction `dir` (unit vector, ship → shooter) strikes. */
export function faceIndex(fwd, dir) {
  const c = V.dot(fwd, dir);
  if (c > 0.7) return 0;
  if (c < -0.7) return 1;
  const ref = Math.abs(fwd[2]) < 0.9 ? [0, 0, 1] : [0, 1, 0];
  const right = V.norm(V.cross(fwd, ref));
  const up = V.cross(right, fwd);
  const x = V.dot(dir, right);
  const y = V.dot(dir, up);
  if (Math.abs(x) >= Math.abs(y)) return x > 0 ? 3 : 2;
  return y > 0 ? 4 : 5;
}

export class Battle {
  constructor({ seed = 1 } = {}) {
    this.rng = V.makeRng(seed);
    this.ships = [];
    this.slugs = [];
    this.missiles = [];
    this.events = []; // for the renderer and sound; cleared by whoever reads them
    this.outbox = []; // for the network layer (hits on remote ships, missile kills, defeat)
    this.time = 0;
    this.nextId = 1;
    this.over = null;
  }

  add(ship) {
    this.ships.push(ship);
    return ship;
  }
  ship(id) {
    return this.ships.find((s) => s.id === id);
  }
  enemyOf(sh) {
    return this.ships.find((o) => o !== sh);
  }

  // ---------------- commands (identical for players, AI and network peers) ----------------

  /** Point the engine along `dir` (world vector, or null to coast) at `throttle` 0…1. */
  command(sh, dir, throttle) {
    sh.cmd.dir = dir && V.len(dir) > 0 ? V.norm(dir) : null;
    sh.cmd.throttle = V.clamp(throttle || 0, 0, 1);
  }

  fireRailguns(sh) {
    const tg = this.ship(sh.target);
    if (!sh.alive || !tg || !tg.alive || isHot(sh)) return 0;
    const R = TECH.railgun;
    let fired = 0;
    for (const w of sh.weapons) {
      if (w.type !== 'railgun' || w.hp <= 0 || w.cooldown > 0 || sh.energy < sh.design.railInput) continue;
      const rp = V.sub(tg.pos, sh.pos);
      const rv = V.sub(tg.vel, sh.vel);
      const t = V.interceptTime(rp, rv, R.muzzleSpeed, tg.acc);
      const aim = t > 0 ? V.add(V.add(rp, V.scale(rv, t)), V.scale(tg.acc, (t * t) / 2)) : rp;
      const dir = V.norm(aim);
      sh.energy -= sh.design.railInput;
      sh.heatIn += sh.design.railInput - sh.design.slugEnergy;
      sh.vel = V.sub(sh.vel, V.scale(dir, (R.slugMass * R.muzzleSpeed) / shipMass(sh))); // recoil
      w.cooldown = R.reload;
      const slug = { owner: sh.id, target: tg.id, pos: [...sh.pos], vel: V.add(sh.vel, V.scale(dir, R.muzzleSpeed)), life: 120 };
      this.slugs.push(slug);
      this.events.push({ type: 'rail', from: sh.id, pos: [...slug.pos], vel: [...slug.vel] });
      if (tg.remote) this.outbox.push({ type: 'shot', pos: slug.pos, vel: slug.vel });
      fired++;
    }
    return fired;
  }

  launchMissiles(sh) {
    const tg = this.ship(sh.target);
    const bay = sh.weapons.find((w) => w.type === 'missiles');
    if (!sh.alive || !tg || !tg.alive || !bay || bay.hp <= 0 || bay.cooldown > 0 || bay.left <= 0) return 0;
    const M = TECH.missile;
    const n = Math.min(M.salvo, bay.left);
    const side = V.norm(V.cross(sh.fwd, Math.abs(sh.fwd[2]) < 0.9 ? [0, 0, 1] : [0, 1, 0]));
    for (let i = 0; i < n; i++) {
      const kick = V.scale(side, (i % 2 ? 1 : -1) * 40);
      this.missiles.push({ id: `${sh.id}-m${this.nextId++}`, owner: sh.id, target: tg.id, pos: [...sh.pos], vel: V.add(sh.vel, kick), dvLeft: M.deltaV, hp: M.killEnergy, life: 600 });
    }
    bay.left -= n;
    bay.cooldown = M.reload;
    this.events.push({ type: 'launch', from: sh.id, n });
    return n;
  }

  // ---------------- the simulation step ----------------

  step(dt) {
    if (this.over) return;
    this.time += dt;
    if (this.time >= WORLD.arenaTimeLimit) return this.decideOnPoints();
    for (const sh of this.ships) {
      sh.prevPos = [...sh.pos];
      if (sh.remote) sh.pos = V.add(sh.pos, V.add(V.scale(sh.vel, dt), V.scale(sh.acc, (dt * dt) / 2))); // dead reckoning
      else this.updateShip(sh, dt);
    }
    for (const sh of this.ships) if (!sh.remote && sh.alive) this.fireLasers(sh, dt);
    this.updateSlugs(dt);
    this.updateMissiles(dt);
  }

  updateShip(sh, dt) {
    const d = sh.design;
    const T = TECH;
    const hot = isHot(sh);
    const reactorOK = sh.parts.reactor > 0;
    for (const w of sh.weapons) if (w.cooldown > 0) w.cooldown -= dt;

    // Turn toward the commanded direction, then thrust once lined up
    if (sh.cmd.dir) sh.fwd = V.turnToward(sh.fwd, sh.cmd.dir, d.turnRate * dt);
    let thr = 0;
    if (sh.alive && reactorOK && sh.parts.engine > 0 && sh.cmd.dir && sh.cmd.throttle > 0 && sh.propellant > 0 && V.dot(sh.fwd, sh.cmd.dir) > 0.966)
      thr = sh.cmd.throttle * (hot ? 0.5 : 1);
    const burned = Math.min(sh.propellant, d.massFlow * thr * dt);
    if (burned < d.massFlow * thr * dt) thr = burned / (d.massFlow * dt);
    sh.propellant -= burned;
    sh.acc = V.scale(sh.fwd, (d.thrust * thr) / shipMass(sh));
    sh.vel = V.add(sh.vel, V.scale(sh.acc, dt));
    sh.pos = V.add(sh.pos, V.scale(sh.vel, dt));
    sh.thrusting = thr;

    // The generator recharges energy storage (it stops if the ship is too hot)
    let gen = 0;
    if (sh.parts.storage <= 0) sh.energy = 0;
    else if (sh.alive && reactorOK && sh.parts.generator > 0 && !hot) gen = Math.max(0, Math.min(d.params.genPower, (d.storageEnergy - sh.energy) / dt));
    sh.energy += gen * dt;
    sh.generating = gen;

    // Heat: in from engine leakage, generator waste, weapons and hits; out through the radiators
    const radA = sh.radArea * (sh.radExtended ? 1 : T.radiator.retractedFraction);
    const C = (d.dry - d.params.water) * T.hull.heatCapacity + sh.water * MATERIALS.water.heatCapacity;
    const Q = sh.heatIn + (d.engineHeat * thr + gen * d.generatorWaste - radiatorPower(radA, sh.temp)) * dt;
    sh.heatIn = 0;
    let temp = sh.temp + Q / C;
    const W = MATERIALS.water;
    if (temp > W.boilsAt && sh.water > 0 && sh.parts.sink > 0) {
      // Boiling water holds the temperature at the boiling point until the tank runs dry
      const excess = (temp - W.boilsAt) * C;
      const boiled = Math.min(sh.water, excess / W.latentHeat);
      sh.water -= boiled;
      temp = W.boilsAt + (excess - boiled * W.latentHeat) / C;
    }
    sh.temp = Math.max(150, temp);
    sh.stats.peakTemp = Math.max(sh.stats.peakTemp, sh.temp);
    if (sh.alive && sh.temp > T.limits.crewHarmTemp) this.damagePart(sh, 'crew', (sh.temp - T.limits.crewHarmTemp) * T.limits.crewHarmPerKelvin * dt, 'overheating');
    if (sh.alive && V.len(sh.pos) > WORLD.arenaBoundary) this.defeat(sh, 'fled the battle');
  }

  /** The nearest enemy missile that this ship's lasers can usefully engage. */
  nearestThreat(sh) {
    const reach = Math.max(...sh.weapons.filter((w) => w.type === 'laser' && w.hp > 0).map((w) => w.focus * 2), 0); // beyond 2× focus a beam is too weak
    let best = null;
    let bd = reach;
    for (const m of this.missiles) {
      if (m.owner === sh.id || m.target !== sh.id) continue;
      const dist = V.len(V.sub(m.pos, sh.pos));
      if (dist < bd) {
        bd = dist;
        best = m;
      }
    }
    return best;
  }

  fireLasers(sh, dt) {
    if (isHot(sh)) return;
    const threat = sh.pd ? this.nearestThreat(sh) : null;
    const tg = this.ship(sh.target);
    for (const l of sh.weapons) {
      if (l.type !== 'laser' || l.hp <= 0) continue;
      const aim = threat || (sh.laserOn && tg && tg.alive ? tg : null);
      if (!aim) continue;
      const need = l.power * dt;
      if (sh.energy < need) continue;
      sh.energy -= need;
      sh.heatIn += need * (1 - TECH.laser.efficiency);
      const dist = V.len(V.sub(aim.pos, sh.pos));
      const E = l.output * laserFraction(l.focus, dist) * dt;
      this.events.push({ type: 'beam', from: sh.id, toPos: [...aim.pos], power: l.output, pd: aim === threat });
      if (aim === threat) {
        // Switching to a new missile takes time to find and lock it
        if (l.pdId !== aim.id) {
          l.pdId = aim.id;
          l.pdReady = this.time + TECH.laser.pdRetarget;
        }
        if (this.time < l.pdReady) continue;
        aim.hp -= E;
        if (aim.hp <= 0) this.killMissile(aim, sh);
      } else this.hitShip(sh, aim, { kind: 'laser', energy: E });
    }
  }

  updateSlugs(dt) {
    for (const s of this.slugs) {
      const p0 = s.pos;
      s.pos = V.add(s.pos, V.scale(s.vel, dt));
      s.life -= dt;
      if (s.visual) continue;
      const tg = this.ship(s.target);
      if (!tg || !tg.alive) continue;
      if (V.closestApproach(p0, s.pos, tg.prevPos, tg.pos).dist < TECH.hull.radius) {
        const vr = V.len(V.sub(s.vel, tg.vel));
        this.hitShip(this.ship(s.owner), tg, { kind: 'kinetic', energy: 0.5 * TECH.railgun.slugMass * vr * vr, area: TECH.railgun.impactArea });
        s.life = 0;
      }
    }
    this.slugs = this.slugs.filter((s) => s.life > 0);
  }

  updateMissiles(dt) {
    const M = TECH.missile;
    for (const m of this.missiles) {
      const p0 = m.pos;
      const tg = this.ship(m.target);
      if (!m.remote && tg && tg.alive && m.dvLeft > 0) {
        // Guidance: steer toward where the target will be, given current relative motion
        const rp = V.sub(tg.pos, m.pos);
        const rv = V.sub(tg.vel, m.vel);
        const closing = Math.max(200, -V.dot(rp, rv) / Math.max(1, V.len(rp)));
        const tgo = V.len(rp) / closing;
        const aim = V.add(V.add(rp, V.scale(rv, tgo)), V.scale(tg.acc, (tgo * tgo) / 2));
        const dv = Math.min(M.accel * dt, m.dvLeft);
        m.vel = V.add(m.vel, V.scale(V.norm(aim), dv));
        m.dvLeft -= dv;
      }
      m.pos = V.add(m.pos, V.scale(m.vel, dt));
      m.life -= dt;
      if (m.remote || !tg || !tg.alive || m.life <= 0) continue;
      if (V.closestApproach(p0, m.pos, tg.prevPos, tg.pos).dist < TECH.hull.radius + 3) {
        const vr = V.len(V.sub(m.vel, tg.vel));
        this.hitShip(this.ship(m.owner), tg, { kind: 'kinetic', energy: 0.5 * M.mass * vr * vr, area: M.impactArea });
        this.events.push({ type: 'explosion', pos: [...m.pos], size: 40 });
        m.life = 0;
      }
    }
    this.missiles = this.missiles.filter((m) => m.life > 0);
  }

  killMissile(m, by) {
    m.life = 0;
    this.events.push({ type: 'explosion', pos: [...m.pos], size: 12, pd: true });
    if (m.remote) this.outbox.push({ type: 'mkill', id: m.id });
    if (by) by.stats.pdKills = (by.stats.pdKills || 0) + 1;
  }

  // ---------------- damage ----------------

  hitShip(shooter, tg, hit) {
    hit.fromPos = [...shooter.pos];
    shooter.stats.dealt += hit.energy;
    if (tg.remote) this.outbox.push({ type: 'hit', ...hit });
    else this.applyHit(tg, hit);
  }

  /** Resolve a hit on a ship we are authoritative for. hit = {kind, energy, area?, fromPos}. */
  applyHit(sh, hit) {
    if (!sh.alive || !(hit.energy > 0)) return;
    const T = TECH;
    sh.stats.taken += hit.energy;
    sh.stats.hits++;
    const dir = V.norm(V.sub(hit.fromPos, sh.pos));

    // Extended radiators are big, unarmoured targets
    const exposed = sh.radExtended ? sh.radArea : sh.radArea * T.radiator.retractedFraction;
    const pRad = (T.radiator.hitShare * exposed) / (exposed + T.hull.area);
    if (sh.radArea > 0 && this.rng() < pRad) {
      const lost = Math.min(sh.radArea, hit.energy / (T.radiator.kgPerM2 * MATERIALS.aluminium.ablation) + (hit.kind === 'kinetic' ? 2 : 0));
      sh.radArea -= lost;
      this.events.push({ type: 'radiatorHit', ship: sh.id, lost });
      return;
    }

    const f = faceIndex(sh.fwd, dir);
    if (hit.kind === 'laser') {
      // A laser vaporises armour; whatever gets through burns the insides
      sh.heatIn += hit.energy * T.laser.heatIntoTarget;
      const used = Math.min(hit.energy, sh.armor[f]);
      sh.armor[f] -= used;
      if (used > 0 && sh.armor[f] <= 0) this.events.push({ type: 'breach', ship: sh.id, face: FACES[f] });
      if (hit.energy > used) this.damageInside(sh, hit.energy - used, 'laser');
    } else {
      // A hypervelocity impact punches through armour it can out-penetrate
      const arealLeft = (sh.design.params.areal * sh.armor[f]) / sh.design.patchHP;
      const pen = penetration(hit.energy, hit.area);
      if (pen <= arealLeft) {
        sh.armor[f] = Math.max(0, sh.armor[f] - hit.energy);
        this.events.push({ type: 'impact', ship: sh.id, stopped: true });
      } else {
        const frac = arealLeft / pen;
        sh.armor[f] = Math.max(0, sh.armor[f] - hit.energy * frac);
        this.events.push({ type: 'impact', ship: sh.id, stopped: false });
        this.damageInside(sh, hit.energy * (1 - frac), 'kinetic');
      }
    }
  }

  damageInside(sh, energy, how) {
    const C = TECH.components;
    const pool = [];
    for (const p of PARTS) if (sh.parts[p] > 0) pool.push([p, C[p].share]);
    const guns = sh.weapons.filter((w) => w.hp > 0);
    for (const w of guns) pool.push([w, C.weapons.share / guns.length]);
    const total = pool.reduce((a, [, s]) => a + s, 0);
    let r = this.rng() * total;
    for (const [part, share] of pool) {
      r -= share;
      if (r > 0) continue;
      if (typeof part === 'string') this.damagePart(sh, part, energy, how);
      else {
        part.hp -= energy;
        if (part.hp <= 0) this.events.push({ type: 'partLost', ship: sh.id, part: part.type });
      }
      return;
    }
  }

  damagePart(sh, part, energy, how) {
    if (sh.parts[part] <= 0) return;
    sh.parts[part] -= energy;
    if (sh.parts[part] > 0) return;
    sh.parts[part] = 0;
    this.events.push({ type: 'partLost', ship: sh.id, part });
    if (part === 'sink') sh.water = 0;
    if (part === 'storage') sh.energy = 0;
    if (part === 'crew') this.defeat(sh, how === 'overheating' ? 'the crew died from heat' : 'the crew compartment was destroyed');
    if (part === 'reactor') this.defeat(sh, 'the reactor was destroyed');
  }

  /** Time is up: the ship that delivered more energy to its enemy wins. */
  decideOnPoints() {
    const [a, b] = this.ships;
    const loser = a.stats.dealt >= b.stats.dealt ? b : a;
    const mins = Math.round(WORLD.arenaTimeLimit / 60);
    if (loser.remote) this.over = { loser: loser.id, cause: `lost on points after ${mins} minutes`, time: this.time };
    else this.defeat(loser, `lost on points after ${mins} minutes`);
  }

  defeat(sh, cause) {
    if (!sh.alive) return;
    sh.alive = false;
    sh.cause = cause;
    sh.cmd = { dir: null, throttle: 0 };
    this.events.push({ type: 'defeat', ship: sh.id, cause });
    if (!sh.remote) this.outbox.push({ type: 'over', loser: sh.id, cause });
    this.over = { loser: sh.id, cause, time: this.time };
  }

  // ---------------- multiplayer helpers ----------------

  /** Overwrite a remote ship with the state its owner reported. */
  applyRemoteState(id, st) {
    const sh = this.ship(id);
    if (!sh || !sh.remote) return;
    for (const k of ['pos', 'vel', 'acc', 'fwd']) if (Array.isArray(st[k]) && st[k].every(Number.isFinite)) sh[k] = st[k];
    for (const k of ['temp', 'radArea', 'thrusting', 'propellant', 'water', 'energy']) if (Number.isFinite(st[k])) sh[k] = st[k];
    sh.radExtended = !!st.radExtended;
    if (Number.isFinite(st.dealt)) sh.stats.dealt = st.dealt; // for the decision on points
    sh.laserOn = !!st.laserOn;
    if (Array.isArray(st.armor) && st.armor.length === 6) sh.armor = st.armor.map((x) => Math.max(0, +x || 0));
    if (st.parts && typeof st.parts === 'object') for (const p of PARTS) if (Number.isFinite(st.parts[p])) sh.parts[p] = st.parts[p];
    if (Array.isArray(st.missiles)) {
      const keep = this.missiles.filter((m) => m.owner !== id);
      for (const m of st.missiles.slice(0, 64))
        if (typeof m.id === 'string' && [m.pos, m.vel].every((v) => Array.isArray(v) && v.every(Number.isFinite)))
          keep.push({ id: m.id, owner: id, target: m.target, pos: m.pos, vel: m.vel, hp: TECH.missile.killEnergy, life: 600, remote: true });
      this.missiles = keep;
    }
  }

  /** The state of a ship we own, as sent to the other player. */
  stateOf(sh) {
    const r = (v) => v.map((x) => +x.toPrecision(9));
    return {
      pos: r(sh.pos), vel: r(sh.vel), acc: r(sh.acc), fwd: r(sh.fwd),
      temp: sh.temp, radArea: sh.radArea, radExtended: sh.radExtended, thrusting: sh.thrusting, laserOn: sh.laserOn,
      propellant: sh.propellant, water: sh.water, energy: sh.energy, armor: sh.armor, parts: sh.parts, dealt: sh.stats.dealt,
      missiles: this.missiles.filter((m) => m.owner === sh.id).map((m) => ({ id: m.id, target: m.target, pos: r(m.pos), vel: r(m.vel) })),
    };
  }
}
