// Player controls. Movement is relative to the enemy, which is how combat pilots think:
// toward / away, circle left / right, climb / dive. The ship turns its engine to match.

import * as V from '../kernel/math.js';

export const KEYS = [
  ['W / S', 'thrust toward / away from the enemy'],
  ['A / D', 'circle left / right around them'],
  ['R / F', 'climb / dive'],
  ['B', 'brake: match the enemy’s velocity'],
  ['Q / E', 'less / more throttle'],
  ['1 (hold)', 'fire lasers'],
  ['2 (hold)', 'fire railguns'],
  ['3', 'launch a missile salvo'],
  ['P', 'point defence on / off'],
  ['V', 'extend / retract radiators'],
  ['C', 'chase / tactical camera'],
  ['Mouse', 'drag to look around, scroll to zoom'],
  ['H', 'hide this help'],
];

export class Controls {
  constructor() {
    this.down = new Set();
    this.throttle = 1;
    this.handlers = {};
    this.laserButton = false;
    this.railButton = false;
    window.addEventListener('keydown', (e) => {
      if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      const k = e.key.toLowerCase();
      if (!this.down.has(k) && this.handlers[k]) this.handlers[k]();
      this.down.add(k);
    });
    window.addEventListener('keyup', (e) => this.down.delete(e.key.toLowerCase()));
    window.addEventListener('blur', () => this.down.clear());
  }

  /** Register a one-shot action for a key (fires once per press). */
  on(key, fn) {
    this.handlers[key] = fn;
  }

  /** Turn held keys into commands for this simulation step. */
  apply(battle, me) {
    if (!me.alive) return;
    const foe = battle.ship(me.target);
    const k = this.down;
    const f = foe ? V.norm(V.sub(foe.pos, me.pos)) : me.fwd;
    const ref = Math.abs(f[2]) < 0.95 ? [0, 0, 1] : [0, 1, 0];
    const right = V.norm(V.cross(f, ref));
    const up = V.cross(right, f);
    let dir = [0, 0, 0];
    if (k.has('w')) dir = V.add(dir, f);
    if (k.has('s')) dir = V.sub(dir, f);
    if (k.has('d')) dir = V.add(dir, right);
    if (k.has('a')) dir = V.sub(dir, right);
    if (k.has('r')) dir = V.add(dir, up);
    if (k.has('f')) dir = V.sub(dir, up);
    if (k.has('b') && foe) {
      const rv = V.sub(foe.vel, me.vel);
      if (V.len(rv) > 0.5) dir = V.add(dir, V.norm(rv));
    }
    battle.command(me, V.len(dir) > 0 ? dir : null, V.len(dir) > 0 ? this.throttle : 0);
    me.laserOn = k.has('1') || this.laserButton;
    if (k.has('2') || this.railButton) battle.fireRailguns(me);
  }
}
