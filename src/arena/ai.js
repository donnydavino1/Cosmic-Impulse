// The AI pilot. It only uses the commands a human has (engine direction and throttle, weapons,
// point defence, radiators), so it plays by exactly the same rules. No graphics: tests use it too.

import { TECH } from '../rules/rules.js';
import { shipMass, isHot } from '../kernel/battle.js';
import { laserFraction } from '../kernel/design.js';
import * as V from '../kernel/math.js';

/** The range each class likes to fight at. */
function preferredRange(ship, enemy) {
  const focus = Math.max(0, ...ship.design.lasers.map((l) => l.focus));
  const enemyBrawls = enemy.design.railguns > 0;
  switch (ship.design.cls) {
    case 'brawler':
      return 3e3;
    case 'sniper':
      return Math.max(enemyBrawls ? 60e3 : 20e3, 0.8 * focus);
    case 'scout':
      return Math.max(enemyBrawls ? 40e3 : 10e3, 0.6 * focus);
    case 'carrier':
      return enemyBrawls ? 350e3 : 250e3;
    default:
      return 50e3;
  }
}

export function makeBot(battle, ship, { seed = 7 } = {}) {
  const rng = V.makeRng(seed);
  let jink = null;
  let jinkUntil = 0;
  let radiatorHitAt = -1e9;
  let fireUntil = 0;

  return function think() {
    if (!ship.alive) return;
    const enemy = battle.enemyOf(ship);
    if (!enemy || !enemy.alive) return battle.command(ship, null, 0);
    ship.target = enemy.id;
    const t = battle.time;
    for (const e of battle.events) if (e.type === 'radiatorHit' && e.ship === ship.id) radiatorHitAt = t;

    // ---- movement: close to (or open to) the preferred range, damp sideways drift, dodge ----
    const rp = V.sub(enemy.pos, ship.pos);
    const dist = V.len(rp);
    const u = V.scale(rp, 1 / dist);
    const relVel = V.sub(ship.vel, enemy.vel);
    const vToward = V.dot(relVel, u);
    const aMax = ship.design.thrust / shipMass(ship);
    const err = dist - preferredRange(ship, enemy);
    // Budget fuel: never chase faster than a third of the speed change still in the tanks
    const m = shipMass(ship);
    const dvLeft = ship.design.ve * Math.log(m / (m - ship.propellant));
    const vWant = Math.sign(err) * Math.min(Math.sqrt(2 * 0.5 * aMax * Math.abs(err)), dvLeft / 3, 4000);
    const lateral = V.sub(relVel, V.scale(u, vToward));
    let cmd = V.add(V.scale(u, vWant - vToward), V.scale(lateral, -0.6));

    const enemyMissiles = battle.missiles.some((m) => m.target === ship.id);
    const underFire = (enemy.design.railguns && dist < 60e3) || enemyMissiles;
    if (underFire) {
      if (!jink || t > jinkUntil) {
        const ref = Math.abs(u[2]) < 0.9 ? [0, 0, 1] : [0, 1, 0];
        const a = rng() * 2 * Math.PI;
        const right = V.norm(V.cross(u, ref));
        const up = V.cross(right, u);
        jink = V.add(V.scale(right, Math.cos(a)), V.scale(up, Math.sin(a)));
        jinkUntil = t + 1.5 + rng() * 3;
      }
      cmd = V.add(cmd, V.scale(jink, aMax * 4));
    }
    const mag = V.len(cmd);
    battle.command(ship, mag > 1 ? cmd : null, Math.min(1, mag / (aMax * 3)));

    // ---- heat: keep radiators out unless they are being shot off while we're cool ----
    if (ship.temp > 380) ship.radExtended = true;
    else if (t - radiatorHitAt < 20 && ship.temp < 360) ship.radExtended = false;

    // ---- weapons ----
    ship.pd = true;
    const best = Math.max(0, ...ship.design.lasers.map((l) => laserFraction(l.focus, dist)));
    const cool = ship.temp < TECH.limits.throttleTemp - 25;
    const charged = ship.energy > 0.2 * ship.design.storageEnergy;
    if (best > 0.15 && cool && charged) fireUntil = t + 2;
    ship.laserOn = t < fireUntil && cool && !isHot(ship);
    if (dist < 25e3) battle.fireRailguns(ship);
    if (dist < 900e3) battle.launchMissiles(ship);
  };
}
