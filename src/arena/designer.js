// The ship designer: Layer 1 (pick a class) and Layer 2 (tune plain-language sliders).
// Every change is re-evaluated by the physics kernel and explained in game terms.

import { CLASSES, SLIDERS, SLIDER_RANGES } from '../rules/rules.js';
import { evaluate, makeBlueprint, summarize, fmtMass, fmtPower, fmtEnergy } from '../kernel/design.js';

const STORE = 'orbital-arena-blueprint';

export function loadBlueprint() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE));
    if (saved && CLASSES[saved.cls]) return makeBlueprint(saved.cls, saved.sliders, saved.name);
  } catch (e) {
    /* no saved design yet */
  }
  return makeBlueprint('brawler');
}

export class Designer {
  constructor(els, blueprint, onChange) {
    this.els = els;
    this.bp = blueprint;
    this.onChange = onChange;
    this.renderClasses();
    this.renderSliders();
    this.update();
  }

  renderClasses() {
    this.els.classes.replaceChildren(
      ...Object.entries(CLASSES).map(([id, c]) => {
        const b = document.createElement('button');
        b.className = 'class-card';
        b.dataset.cls = id;
        b.innerHTML = `<strong>${c.name}</strong><span>${c.role}</span>`;
        b.addEventListener('click', () => {
          this.bp = makeBlueprint(id); // a new class starts from its own default tuning
          this.renderSliders();
          this.update();
        });
        return b;
      }),
    );
  }

  renderSliders() {
    this.els.sliders.replaceChildren(
      ...SLIDERS.map((s) => {
        const wrap = document.createElement('div');
        wrap.className = 'slider';
        const id = `slider-${s.id}`;
        wrap.innerHTML = `<label class="ends" for="${id}"><span>${s.left}</span><span>${s.right}</span></label>
          <input id="${id}" type="range" min="0" max="1" step="0.01" value="${this.bp.sliders[s.id]}">
          <p>${s.help}</p>`;
        wrap.querySelector('input').addEventListener('input', (e) => {
          this.bp = makeBlueprint(this.bp.cls, { ...this.bp.sliders, [s.id]: +e.target.value });
          this.update();
        });
        return wrap;
      }),
    );
  }

  update() {
    const d = evaluate(this.bp);
    this.design = d;
    for (const b of this.els.classes.children) b.setAttribute('aria-pressed', String(b.dataset.cls === this.bp.cls));
    this.els.abilities.replaceChildren(
      ...summarize(d).map(([topic, text]) => {
        const li = document.createElement('li');
        li.innerHTML = `<b>${topic}</b>${text}`;
        return li;
      }),
    );
    const rows = [
      ...Object.entries(SLIDER_RANGES).map(([id, r]) => {
        const v = { punch: d.params.ox, armor: d.params.areal, power: d.params.genPower, cooling: d.params.radArea, fuel: d.params.propellant, sink: d.params.water }[id];
        const shown = r.unit === 'W' ? fmtPower(v) : r.unit === 'kg' ? fmtMass(v) : `${v.toFixed(r.unit ? 0 : 2)} ${r.unit}`;
        return [r.param, shown];
      }),
      ['reactor heat', fmtPower(d.params.reactorHeat)],
      ['thrust', `${(d.thrust / 1000).toFixed(0)} kN`],
      ['exhaust speed', `${(d.ve / 1000).toFixed(2)} km/s`],
      ['radiator cooling at 450 K', fmtPower(d.coolingAtMax)],
      ['heat the ship can soak up', fmtEnergy(d.sinkEnergy)],
      ['laser waste heat when firing', fmtPower(d.laserHeat)],
      ['energy storage', fmtEnergy(d.storageEnergy)],
      ...Object.entries(d.mass).map(([k, m]) => [`mass: ${k}`, fmtMass(m)]),
    ];
    this.els.numbers.innerHTML = rows.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('');
    try {
      localStorage.setItem(STORE, JSON.stringify(this.bp));
    } catch (e) {
      /* storage unavailable: the design just isn't remembered */
    }
    if (this.onChange) this.onChange(this.bp, d);
  }
}
