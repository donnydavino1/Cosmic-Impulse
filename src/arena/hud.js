// The battle HUD. Heat leads: temperature, the water heat sink and radiators come first,
// because managing heat is the core decision of every fight.

import { TECH, MATERIALS, PHYS } from '../rules/rules.js';
import { radiatorPower, laserFraction, fmtTime, fmtDist, fmtPower } from '../kernel/design.js';
import { FACES, shipMass, isHot } from '../kernel/battle.js';
import * as V from '../kernel/math.js';
import { KEYS } from './input.js';

const T_MIN = 280;
const T_MAX = 500;
const pct = (x) => `${Math.round(100 * V.clamp(x, 0, 1))}%`;
const tempPos = (t) => pct((t - T_MIN) / (T_MAX - T_MIN));
const PART_NAMES = { crew: 'crew', reactor: 'reactor', engine: 'engine', generator: 'generator', storage: 'energy storage', sink: 'heat sink', laser: 'a laser', railgun: 'a railgun', missiles: 'the missile bay' };

export class Hud {
  constructor(els, controls, actions) {
    this.els = els;
    this.controls = controls;
    this.actions = actions;
    els.keys.innerHTML = KEYS.map(([k, v]) => `<div class="row"><span>${k}</span><span>${v}</span></div>`).join('');
    controls.on('h', () => (els.keys.hidden = !els.keys.hidden));
    this.buildWeapons();
  }

  buildWeapons() {
    const mk = (id, label, key) => {
      const b = document.createElement('button');
      b.dataset.id = id;
      b.innerHTML = `${label} (${key})<small></small>`;
      return b;
    };
    this.btn = {
      laser: mk('laser', 'Lasers', '1'),
      rail: mk('rail', 'Railguns', '2'),
      missiles: mk('missiles', 'Missiles', '3'),
      pd: mk('pd', 'Point defence', 'P'),
      rad: mk('rad', 'Radiators', 'V'),
      thr: mk('thr', 'Throttle', 'Q/E'),
    };
    const hold = (b, prop) => {
      b.addEventListener('pointerdown', () => (this.controls[prop] = true));
      for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) b.addEventListener(ev, () => (this.controls[prop] = false));
    };
    hold(this.btn.laser, 'laserButton');
    hold(this.btn.rail, 'railButton');
    this.btn.missiles.addEventListener('click', () => this.actions.missiles());
    this.btn.pd.addEventListener('click', () => this.actions.pd());
    this.btn.rad.addEventListener('click', () => this.actions.radiators());
    this.btn.thr.addEventListener('click', () => this.actions.throttle());
    this.els.weapons.replaceChildren(...Object.values(this.btn));
  }

  say(text) {
    const d = document.createElement('div');
    d.textContent = text;
    this.els.feed.prepend(d);
    while (this.els.feed.children.length > 4) this.els.feed.lastChild.remove();
  }

  /** Turn battle events into short messages. */
  consume(events, meId) {
    for (const e of events) {
      const mine = e.ship === meId;
      if (e.type === 'breach') this.say(mine ? `Your ${e.face} armour is burned through!` : `Enemy ${e.face} armour burned through.`);
      else if (e.type === 'partLost') this.say(mine ? `You lost ${PART_NAMES[e.part] || e.part}!` : `Enemy lost ${PART_NAMES[e.part] || e.part}.`);
      else if (e.type === 'radiatorHit' && e.lost > 20) this.say(mine ? `Radiator hit: lost ${Math.round(e.lost)} m²` : `Hit their radiators: ${Math.round(e.lost)} m²`);
      else if (e.type === 'launch' && e.from !== meId) this.say(`Incoming: ${e.n} missiles launched at you`);
    }
  }

  update(battle, me, extra = {}) {
    const d = me.design;
    const foe = battle.ship(me.target) || battle.enemyOf(me);
    const radA = me.radArea * (me.radExtended ? 1 : TECH.radiator.retractedFraction);
    const m = shipMass(me);
    const dvLeft = d.ve * Math.log(m / (m - me.propellant));
    const hot = isHot(me);
    const armour = (sh) =>
      `<div class="armour">${FACES.map((f, i) => `<div title="${f}"><i style="height:${pct(sh.armor[i] / sh.design.patchHP)}"></i><span>${f}</span></div>`).join('')}</div>`;
    const lost = Object.entries(me.parts).filter(([, hp]) => hp <= 0).map(([p]) => PART_NAMES[p]);
    const gunsLost = me.weapons.filter((w) => w.hp <= 0).map((w) => PART_NAMES[w.type]);

    this.els.self.innerHTML = `
      <div class="row"><span>${me.name}</span><span>${d.className}</span></div>
      <div class="row" style="align-items:baseline;margin-top:6px"><span>Temperature</span><span class="big" style="color:${me.temp > 440 ? 'var(--hot)' : me.temp > 380 ? 'var(--warm)' : 'var(--cold)'}">${Math.round(me.temp)} K</span></div>
      <div class="gauge" title="Water boils at 400 K; weapons and generator stop at 450 K"><i style="width:${tempPos(me.temp)}"></i>
        <span class="mark" style="left:${tempPos(MATERIALS.water.boilsAt)}"></span><span class="mark" style="left:${tempPos(TECH.limits.throttleTemp)}"></span></div>
      <div class="row"><span>Water heat sink</span><span>${pct(me.water / d.params.water)}${me.temp >= MATERIALS.water.boilsAt - 0.5 && me.water > 0 ? ', boiling' : ''}</span></div>
      <div class="row"><span>Radiators ${me.radExtended ? 'extended' : 'retracted'}</span><span>shedding ${fmtPower(radiatorPower(radA, me.temp))}</span></div>
      ${hot ? '<div class="row" style="color:var(--hot)"><span>Too hot: weapons and generator offline</span></div>' : ''}
      <div class="row" style="margin-top:6px"><span>Weapon energy</span><span>${pct(me.energy / d.storageEnergy)}</span></div>
      <div class="gauge energy"><i style="width:${pct(me.energy / d.storageEnergy)}"></i></div>
      <div class="row"><span>Fuel left</span><span>${(dvLeft / 1000).toFixed(2)} km/s</span></div>
      <div class="row"><span>Thrust</span><span>${me.thrusting > 0 ? ((d.thrust * me.thrusting) / m / PHYS.G0).toFixed(2) + ' g' : 'coasting'}</span></div>
      <div class="row" style="margin-top:6px"><span>Armour</span><span>bars show what is left</span></div>${armour(me)}
      <div class="parts">${lost.length || gunsLost.length ? `<span class="lost">Lost: ${[...lost, ...gunsLost].join(', ')}</span>` : 'All systems working'}</div>`;

    if (foe) {
      const rp = V.sub(foe.pos, me.pos);
      const dist = V.len(rp);
      const closing = -V.dot(V.sub(foe.vel, me.vel), rp) / dist;
      const laserPct = Math.max(0, ...d.lasers.map((l) => laserFraction(l.focus, dist)));
      const flight = dist / (TECH.railgun.muzzleSpeed + Math.max(0, closing));
      const dodge = 0.5 * (foe.design.thrust / shipMass(foe)) * flight * flight;
      this.els.target.innerHTML = `
        <div class="row"><span>${foe.name}</span><span>${foe.design.className}</span></div>
        <div class="row" style="align-items:baseline;margin-top:6px"><span>Distance</span><span class="big">${fmtDist(dist)}</span></div>
        <div class="row"><span>${closing >= 0 ? 'Closing at' : 'Opening at'}</span><span>${Math.abs(closing).toFixed(0)} m/s</span></div>
        <div class="row"><span>Their temperature (infrared)</span><span>${Math.round(foe.temp)} K</span></div>
        <div class="gauge"><i style="width:${tempPos(foe.temp)}"></i></div>
        <div class="row"><span>Their radiators</span><span>${foe.radExtended ? 'extended' : 'retracted'}, ${Math.round(foe.radArea)} m²</span></div>
        ${d.lasers.length ? `<div class="row"><span>Your laser at this range</span><span>${pct(laserPct)} strength</span></div>` : ''}
        ${d.railguns ? `<div class="row"><span>Railgun flight time</span><span>${flight.toFixed(1)} s (${dodge > TECH.hull.radius ? 'they can dodge' : 'hard to dodge'})</span></div>` : ''}
        <div class="row" style="margin-top:6px"><span>Their armour</span><span></span></div>${armour(foe)}`;
    }

    const set = (b, text, on, off) => {
      b.querySelector('small').textContent = text;
      b.classList.toggle('on', !!on);
      b.classList.toggle('off', !!off);
    };
    const laserAlive = me.weapons.some((w) => w.type === 'laser' && w.hp > 0);
    set(this.btn.laser, !d.lasers.length ? 'none fitted' : !laserAlive ? 'destroyed' : hot ? 'too hot' : me.laserOn ? 'firing' : 'ready', me.laserOn, hot || !laserAlive);
    const rails = me.weapons.filter((w) => w.type === 'railgun' && w.hp > 0);
    const cd = Math.max(0, Math.min(...rails.map((w) => w.cooldown)));
    set(this.btn.rail, !d.railguns ? 'none fitted' : !rails.length ? 'destroyed' : cd > 0 ? `reloading ${cd.toFixed(1)} s` : 'ready', false, !rails.length && d.railguns);
    const bay = me.weapons.find((w) => w.type === 'missiles');
    set(this.btn.missiles, !bay ? 'none fitted' : bay.hp <= 0 ? 'destroyed' : `${bay.left} left${bay.cooldown > 0 ? ', reloading' : ''}`, false, bay && bay.hp <= 0);
    set(this.btn.pd, me.pd ? 'on: lasers shoot missiles' : 'off', me.pd);
    set(this.btn.rad, me.radExtended ? 'extended: cool, exposed' : 'retracted: protected, hot', me.radExtended);
    set(this.btn.thr, `${Math.round(this.controls.throttle * 100)}%`);

    const mins = Math.floor(battle.time / 60);
    const secs = Math.floor(battle.time % 60).toString().padStart(2, '0');
    this.els.clock.innerHTML = `${mins}:${secs} of ${fmtTime(extra.limit || 0)}${extra.note ? `<br>${extra.note}` : ''}`;
  }
}
