// Small, dependency-free vector and random-number helpers used by the physics kernel.

export const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const scale = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const len = (a) => Math.hypot(a[0], a[1], a[2]);
export const norm = (a) => {
  const l = len(a);
  return l > 0 ? scale(a, 1 / l) : [1, 0, 0];
};
export const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));

/** Rotate unit vector `from` toward `to` by at most `maxAngle` radians. */
export function turnToward(from, to, maxAngle) {
  const c = clamp(dot(from, to), -1, 1);
  const angle = Math.acos(c);
  if (angle <= maxAngle || angle < 1e-9) return [...to];
  let axis = cross(from, to);
  if (len(axis) < 1e-9) axis = Math.abs(from[0]) < 0.9 ? cross(from, [1, 0, 0]) : cross(from, [0, 1, 0]);
  axis = norm(axis);
  // Rodrigues rotation of `from` about `axis` by maxAngle
  const s = Math.sin(maxAngle);
  const k = Math.cos(maxAngle);
  const ax = cross(axis, from);
  return norm(add(add(scale(from, k), scale(ax, s)), scale(axis, dot(axis, from) * (1 - k))));
}

/** Seeded random numbers, so a battle replays identically from the same seed and inputs. */
export function makeRng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Closest distance between two objects moving in straight lines during one step. */
export function closestApproach(p0, p1, q0, q1) {
  const r0 = sub(p0, q0);
  const dr = sub(sub(p1, q1), r0);
  const dd = dot(dr, dr);
  const t = dd > 0 ? clamp(-dot(r0, dr) / dd, 0, 1) : 0;
  return { dist: len(add(r0, scale(dr, t))), t };
}

/**
 * Time for a projectile fired at `speed` (relative to the shooter) to meet a target with relative
 * position p, velocity v and acceleration a. Returns 0 if no intercept exists.
 */
export function interceptTime(p, v, speed, a = [0, 0, 0]) {
  let t = 0;
  for (let i = 0; i < 4; i++) {
    const v2 = add(v, scale(a, t / 2)); // average velocity over the flight
    const qa = dot(v2, v2) - speed * speed;
    const qb = 2 * dot(p, v2);
    const qc = dot(p, p);
    let next;
    if (Math.abs(qa) < 1e-9) next = qb < 0 ? -qc / qb : 0;
    else {
      const disc = qb * qb - 4 * qa * qc;
      if (disc < 0) return 0;
      const r = Math.sqrt(disc);
      const t1 = (-qb - r) / (2 * qa);
      const t2 = (-qb + r) / (2 * qa);
      next = [t1, t2].filter((x) => x > 0).sort((x, y) => x - y)[0] || 0;
    }
    if (!next) return 0;
    t = next;
  }
  return t;
}
