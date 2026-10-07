// 3D view of a battle (three.js, loaded as the global THREE). Purely visual: it reads the battle
// and never changes it. Positions are drawn relative to the player's ship ("floating origin")
// so the view stays precise even hundreds of kilometres apart.

import * as V from '../kernel/math.js';

const TEAM = { me: 0x48d1c7, foe: 0xe5484d };
const COLD = [0x48, 0xd1, 0xc7];
const WARM = [0xf3, 0xa9, 0x3c];
const HOT = [0xe5, 0x48, 0x4d];

/** False-colour infrared: what a thermal camera would show, from coolant cyan to alarm red. */
export function irColor(temp) {
  const t = V.clamp((temp - 280) / (460 - 280), 0, 1);
  const [a, b, k] = t < 0.7 ? [COLD, WARM, t / 0.7] : [WARM, HOT, (t - 0.7) / 0.3];
  const c = a.map((x, i) => Math.round(x + (b[i] - x) * k));
  return (c[0] << 16) | (c[1] << 8) | c[2];
}

function glowTexture(THREE) {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,240,210,1)');
  grad.addColorStop(0.4, 'rgba(243,169,60,0.6)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

export class Renderer {
  constructor(canvas, labelsEl) {
    const THREE = (this.THREE = window.THREE);
    this.gl = new THREE.WebGLRenderer({ canvas, antialias: true, logarithmicDepthBuffer: true });
    this.gl.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    this.scene = new THREE.Scene();
    this.cam = new THREE.PerspectiveCamera(55, 1, 0.5, 2e8);
    this.scene.add(new THREE.AmbientLight(0x404a66, 1));
    this.sun = new THREE.DirectionalLight(0xfff1d6, 1.5);
    this.sun.position.set(1, 0.3, 0.2);
    this.scene.add(this.sun);
    this.glow = glowTexture(THREE);
    this.addStars();
    this.labelsEl = labelsEl;
    this.view = { az: 0, el: 0.25, dist: 160, tactical: false };
    this.ships = new Map();
    this.fx = [];
    this.beams = [];
    this.dots = this.makeDots(256);
    this.bindMouse(canvas);
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.gl.setSize(w, h, false);
    this.cam.aspect = w / h;
    this.cam.updateProjectionMatrix();
  }

  addStars() {
    const THREE = this.THREE;
    const p = [];
    for (let i = 0; i < 1500; i++) {
      const u = Math.random() * 2 - 1;
      const t = Math.random() * Math.PI * 2;
      const r = Math.sqrt(1 - u * u);
      p.push(5e7 * r * Math.cos(t), 5e7 * r * Math.sin(t), 5e7 * u);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
    this.stars = new THREE.Points(g, new THREE.PointsMaterial({ size: 1.4, sizeAttenuation: false, color: 0x9aa3c0 }));
    this.scene.add(this.stars);
    const sun = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.glow, color: 0xfff4d0, depthWrite: false }));
    sun.scale.set(4e6, 4e6, 1);
    sun.position.set(4e7, 1.2e7, 0.8e7);
    this.scene.add(sun);
  }

  makeDots(n) {
    const THREE = this.THREE;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    const pts = new THREE.Points(g, new THREE.PointsMaterial({ size: 5, sizeAttenuation: false, vertexColors: true, depthTest: false }));
    pts.frustumCulled = false;
    pts.renderOrder = 10;
    this.scene.add(pts);
    return pts;
  }

  bindMouse(canvas) {
    let drag = null;
    canvas.addEventListener('pointerdown', (e) => (drag = { x: e.clientX, y: e.clientY }));
    window.addEventListener('pointerup', () => (drag = null));
    window.addEventListener('pointermove', (e) => {
      if (!drag) return;
      this.view.az -= (e.clientX - drag.x) * 0.005;
      this.view.el = V.clamp(this.view.el + (e.clientY - drag.y) * 0.005, -1.4, 1.4);
      drag = { x: e.clientX, y: e.clientY };
    });
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.view.dist = V.clamp(this.view.dist * Math.exp(e.deltaY * 0.0015), 40, 3e6);
    }, { passive: false });
  }

  /** Build the meshes for a new battle. */
  attach(battle, meId) {
    for (const g of this.ships.values()) this.scene.remove(g);
    this.ships.clear();
    for (const s of battle.ships) {
      const g = this.shipMesh(s, s.id === meId ? TEAM.me : TEAM.foe);
      this.ships.set(s.id, g);
      this.scene.add(g);
    }
    this.labelsEl.replaceChildren(
      ...battle.ships.map((s) => {
        const d = document.createElement('div');
        d.className = `label ${s.id === meId ? 'me' : 'foe'}`;
        d.dataset.id = s.id;
        return d;
      }),
    );
  }

  /** A ship model built from its design: radiator wings are sized to the real panel area. */
  shipMesh(ship, team) {
    const THREE = this.THREE;
    const d = ship.design;
    const g = new THREE.Group();
    const metal = new THREE.MeshStandardMaterial({ color: 0x9aa3b5, metalness: 0.6, roughness: 0.45 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x3a4258, metalness: 0.7, roughness: 0.5 });
    const trim = new THREE.MeshBasicMaterial({ color: team });
    const hull = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 34, 18).rotateX(Math.PI / 2), metal);
    const nose = new THREE.Mesh(new THREE.ConeGeometry(4, 8, 18).rotateX(Math.PI / 2), metal);
    nose.position.z = 21;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(4.25, 0.35, 8, 24), trim);
    ring.position.z = 10;
    const bell = new THREE.Mesh(new THREE.ConeGeometry(3.6, 6, 18, 1, true).rotateX(Math.PI / 2), dark);
    bell.position.z = -20;
    g.add(hull, nose, ring, bell);

    if (d.cls === 'sniper') {
      const mirror = new THREE.Mesh(new THREE.CircleGeometry(d.lasers[0].mirror / 2 + 0.5, 32), new THREE.MeshStandardMaterial({ color: 0xf3d58c, metalness: 1, roughness: 0.1, side: THREE.DoubleSide }));
      mirror.position.z = 25.5;
      g.add(mirror);
    }
    if (d.railguns) for (const y of [-5, 5]) {
      const barrel = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 32), dark);
      barrel.position.set(0, y, 4);
      g.add(barrel);
    }
    if (d.missiles) for (const y of [-5.5, 5.5]) {
      const pod = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 14), dark);
      pod.position.set(0, y, -2);
      g.add(pod);
    }

    // Radiator wings: two panels whose one-face area adds up to the design's radiator area
    const panelArea = d.params.radArea / 2;
    const span = Math.sqrt(panelArea / 1.5);
    const length = 1.5 * span;
    const radMat = new THREE.MeshBasicMaterial({ color: irColor(300), side: THREE.DoubleSide });
    const panels = [-1, 1].map((side) => {
      const p = new THREE.Mesh(new THREE.BoxGeometry(span, 0.25, length), radMat);
      p.userData.side = side;
      g.add(p);
      return p;
    });

    const plume = new THREE.Mesh(
      new THREE.ConeGeometry(3, 1, 18, 1, true).rotateX(Math.PI / 2).translate(0, 0, -0.5),
      new THREE.MeshBasicMaterial({ color: d.params.ox > 1.5 ? 0xffb86b : 0xa9d8ff, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    plume.position.z = -23;
    g.add(plume);
    g.userData = { panels, span, radMat, plume, radOut: 1 };
    return g;
  }

  /** Draw one frame. `events` are this frame's battle events (beams, explosions…). */
  frame(battle, meId, events, dtReal) {
    const THREE = this.THREE;
    const me = battle.ship(meId);
    if (!me) return;
    const origin = me.pos;
    const rel = (p) => V.sub(p, origin);

    for (const s of battle.ships) {
      const g = this.ships.get(s.id);
      if (!g) continue;
      const p = rel(s.pos);
      g.position.set(p[0], p[1], p[2]);
      if (s.alive) g.lookAt(p[0] + s.fwd[0], p[1] + s.fwd[1], p[2] + s.fwd[2]);
      else g.rotation.x += dtReal * 0.3; // tumbling wreck
      const u = g.userData;
      u.radOut += ((s.radExtended ? 1 : 0) - u.radOut) * Math.min(1, dtReal * 2);
      const area = Math.sqrt(Math.max(0, s.radArea) / s.design.params.radArea);
      for (const panel of u.panels) {
        const sx = 0.12 + 0.88 * u.radOut;
        panel.scale.set(sx, 1, Math.max(0.02, area));
        panel.position.x = panel.userData.side * (4.3 + (u.span * sx) / 2);
      }
      u.radMat.color.setHex(irColor(s.temp));
      u.plume.visible = s.alive && s.thrusting > 0.01;
      u.plume.scale.set(1, 1, 12 + 70 * s.thrusting);
    }

    // Projectiles and far-away ships as always-visible dots
    const pos = this.dots.geometry.attributes.position;
    const col = this.dots.geometry.attributes.color;
    let n = 0;
    const put = (p, hex) => {
      if (n >= pos.count) return;
      const r = rel(p);
      pos.setXYZ(n, r[0], r[1], r[2]);
      col.setXYZ(n, ((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255);
      n++;
    };
    for (const s of battle.ships) put(s.pos, s.id === meId ? TEAM.me : TEAM.foe);
    for (const m of battle.missiles) put(m.pos, m.owner === meId ? 0x9ff3ea : 0xffa66b);
    for (const sl of battle.slugs) put(sl.pos, 0xffffff);
    this.dots.geometry.setDrawRange(0, n);
    pos.needsUpdate = col.needsUpdate = true;

    // Beams: one line per firing laser this frame
    for (const b of this.beams) this.scene.remove(b);
    this.beams = [];
    for (const e of events) {
      if (e.type === 'beam') {
        const from = rel(battle.ship(e.from).pos);
        const to = rel(e.toPos);
        const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...from), new THREE.Vector3(...to)]);
        const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: e.from === meId ? 0x9ff3ea : 0xff8a7a, transparent: true, opacity: e.pd ? 0.5 : 0.85 }));
        this.beams.push(line);
        this.scene.add(line);
      } else if (e.type === 'explosion' || (e.type === 'impact' && !e.stopped)) {
        const at = e.pos || battle.ship(e.ship).pos;
        const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.glow, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
        sp.userData = { at: [...at], size: e.size || 25, age: 0 };
        this.fx.push(sp);
        this.scene.add(sp);
      }
    }
    this.fx = this.fx.filter((sp) => {
      sp.userData.age += dtReal;
      const a = sp.userData.age;
      if (a > 1.2) {
        this.scene.remove(sp);
        return false;
      }
      const r = rel(sp.userData.at);
      sp.position.set(r[0], r[1], r[2]);
      const k = sp.userData.size * (1 + a * 4);
      sp.scale.set(k, k, 1);
      sp.material.opacity = 1 - a / 1.2;
      return true;
    });

    // Camera: chase view behind our ship, looking toward the enemy (or a wide tactical view)
    const foe = battle.enemyOf(me);
    const toFoe = foe ? V.sub(foe.pos, me.pos) : me.fwd;
    const range = V.len(toFoe);
    const f = V.norm(toFoe);
    const ref = Math.abs(f[2]) < 0.95 ? [0, 0, 1] : [0, 1, 0];
    const right = V.norm(V.cross(f, ref));
    const up = V.cross(right, f);
    const dist = this.view.tactical ? Math.max(this.view.dist, range * 1.2) : this.view.dist;
    const back = V.scale(f, -Math.cos(this.view.el) * Math.cos(this.view.az));
    const side = V.scale(right, Math.cos(this.view.el) * Math.sin(this.view.az));
    const lift = V.scale(up, Math.sin(this.view.el));
    const camPos = V.scale(V.add(V.add(back, side), lift), dist);
    this.cam.position.set(...camPos);
    this.cam.up.set(...up);
    const look = this.view.tactical ? V.scale(toFoe, 0.5) : V.scale(f, dist * 0.6);
    this.cam.lookAt(...look);
    this.stars.position.copy(this.cam.position);
    this.gl.render(this.scene, this.cam);

    // Name labels above each ship
    for (const el of this.labelsEl.children) {
      const s = battle.ship(el.dataset.id);
      const p = new THREE.Vector3(...rel(s.pos)).project(this.cam);
      const visible = p.z < 1 && Math.abs(p.x) < 1.2 && Math.abs(p.y) < 1.2;
      el.hidden = !visible;
      el.style.left = `${((p.x + 1) / 2) * window.innerWidth}px`;
      el.style.top = `${((1 - p.y) / 2) * window.innerHeight}px`;
      el.textContent = s.id === meId ? s.name : `${s.name}  ${(range / 1000).toFixed(range < 1e4 ? 1 : 0)} km`;
    }
  }
}
