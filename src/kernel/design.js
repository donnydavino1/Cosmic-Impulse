// Design evaluation: turns a blueprint (a ship class plus slider positions) into real performance.
//
// Players never type in stats. They choose a class and move sliders; every number below follows
// from the shared rules (rules.js) and real physics, so no design gets something for free.

import { TECH, CLASSES, SLIDER_RANGES, PHYS, MATERIALS } from '../rules/rules.js';

const clamp01 = (x) => Math.min(1, Math.max(0, Number(x) || 0));

/** Physical value of slider `id` at position x (0…1). */
export const sliderValue = (id, x) => {
  const r = SLIDER_RANGES[id];
  return r.min + (r.max - r.min) * clamp01(x);
};

/** Heat (W) radiated by panels of one-face area `area` at temperature `temp` (both faces radiate). */
export const radiatorPower = (area, temp) =>
  2 * TECH.radiator.emissivity * PHYS.SIGMA * area * (temp ** 4 - PHYS.SPACE_TEMP ** 4);

/** Distance (m) out to which a laser mirror of diameter `mirror` keeps its spot small (diffraction limit). */
export const laserFocusRange = (mirror) => (mirror * TECH.laser.spot) / (2.44 * TECH.laser.wavelength);

/** Fraction of a laser's output that lands on target at distance d: beyond focus the spot spreads as 1/d². */
export const laserFraction = (focus, d) => (d <= focus ? 1 : (focus / d) ** 2);

/** Kinetic energy of one railgun slug at muzzle speed, and the electricity it takes to fire it. */
export const slugEnergy = () => 0.5 * TECH.railgun.slugMass * TECH.railgun.muzzleSpeed ** 2;

/** Armour (kg/m²) an impact of energy E spread over `area` m² can punch through. */
export const penetration = (E, area) => E / (area * TECH.penetrationEnergy);

/** A blueprint is plain data: safe to save, share and send to other players. */
export function makeBlueprint(cls, sliders = {}, name) {
  const c = CLASSES[cls];
  if (!c) throw new Error(`Unknown ship class: ${cls}`);
  const clean = {};
  for (const k of Object.keys(SLIDER_RANGES)) clean[k] = clamp01(k in sliders ? sliders[k] : c.sliders[k]);
  return { cls, name: String(name || c.name).slice(0, 32), sliders: clean };
}

/** Everything a design can do, derived from its blueprint and the rules. */
export function evaluate(blueprint) {
  const bp = makeBlueprint(blueprint.cls, blueprint.sliders, blueprint.name);
  const cls = CLASSES[bp.cls];
  const s = bp.sliders;
  const T = TECH;

  const p = {
    ox: sliderValue('punch', s.punch),
    areal: sliderValue('armor', s.armor),
    genPower: sliderValue('power', s.power),
    radArea: sliderValue('cooling', s.cooling),
    propellant: sliderValue('fuel', s.fuel),
    water: sliderValue('sink', s.sink),
    reactorHeat: cls.reactor,
  };
  p.hydrogen = p.propellant / (1 + p.ox);
  p.oxygen = p.propellant - p.hydrogen;

  // Weapons
  const lasers = cls.weapons
    .filter((w) => w.type === 'laser')
    .map((w) => ({
      power: w.power,
      mirror: w.mirror,
      output: w.power * T.laser.efficiency,
      focus: laserFocusRange(w.mirror),
      mass: w.power * T.laser.kgPerWatt + Math.PI * (w.mirror / 2) ** 2 * T.laser.mirrorKgPerM2,
    }));
  const railguns = cls.weapons.filter((w) => w.type === 'railgun').length;
  const missiles = cls.weapons.filter((w) => w.type === 'missiles').reduce((a, w) => a + w.count, 0);
  const slug = slugEnergy();
  const railInput = slug / T.railgun.efficiency;
  const laserPower = lasers.reduce((a, l) => a + l.power, 0);

  // Energy storage is sized to feed the weapons for a short burst
  const storageEnergy = T.storage.secondsOfLaserFire * laserPower + T.storage.railShots * railguns * railInput;
  const peakDraw = laserPower + (railguns * railInput) / T.railgun.reload;
  const storageMass = Math.max(storageEnergy / T.storage.joulesPerKg, peakDraw / T.storage.wattsPerKg);

  const mass = {
    hull: T.hull.mass,
    reactor: p.reactorHeat * T.reactor.kgPerWatt,
    generator: p.genPower * T.generator.kgPerWatt,
    storage: storageMass,
    armor: p.areal * T.hull.area,
    radiators: p.radArea * T.radiator.kgPerM2,
    heatSink: p.water,
    weapons: lasers.reduce((a, l) => a + l.mass, 0) + railguns * T.railgun.mass + missiles * T.missile.mass,
    tanks: p.hydrogen * T.tanks.perKgHydrogen + p.oxygen * T.tanks.perKgOxygen,
  };
  const dry = Object.values(mass).reduce((a, b) => a + b, 0);
  const wet = dry + p.propellant;

  // Engine: a nuclear reactor heats hydrogen; adding oxygen trades exhaust speed for thrust
  const E = T.engine;
  const ve = E.veHydrogen * (1 - E.veDropPerOx * p.ox);
  const thrust = ((2 * E.nozzleEfficiency * p.reactorHeat) / E.veHydrogen) * (1 + E.thrustGainPerOx * p.ox);
  const massFlow = thrust / ve;
  const deltaV = ve * Math.log(wet / dry); // Tsiolkovsky rocket equation
  const burnTime = p.propellant / massFlow;

  // Heat: what the ship can soak up, and how fast its radiators shed it
  const tMax = T.limits.throttleTemp;
  const boil = MATERIALS.water.boilsAt;
  const heatCapacity = (dry - p.water) * T.hull.heatCapacity + p.water * MATERIALS.water.heatCapacity;
  const sinkEnergy =
    (dry - p.water) * T.hull.heatCapacity * (tMax - T.hull.startTemp) +
    p.water * (MATERIALS.water.heatCapacity * (boil - T.hull.startTemp) + MATERIALS.water.latentHeat);
  const coolingAtMax = radiatorPower(p.radArea, tMax);
  const engineHeat = p.reactorHeat * T.reactor.leakToShip;
  const generatorWaste = (1 / T.generator.efficiency - 1) * T.generator.shipHeatShare; // W of heat reaching the ship per W of electricity
  const laserHeat =
    lasers.reduce((a, l) => a + l.power * (1 - T.laser.efficiency), 0) + Math.min(p.genPower, laserPower) * generatorWaste;
  const endurance = (heat) => (heat <= coolingAtMax ? Infinity : sinkEnergy / (heat - coolingAtMax));

  // Armour: energy to burn through one patch, and what a railgun slug can punch through
  const patchHP = p.areal * T.hull.armorPatch * MATERIALS.aluminium.ablation;
  const turn180 = T.turn.secondsFor180At100t * Math.cbrt(wet / 1e5);

  return {
    blueprint: bp,
    cls: bp.cls,
    className: cls.name,
    name: bp.name,
    params: p,
    mass,
    dry,
    wet,
    ve,
    thrust,
    massFlow,
    deltaV,
    burnTime,
    accelFull: thrust / wet,
    accelEmpty: thrust / dry,
    turn180,
    turnRate: Math.PI / turn180,
    heatCapacity,
    sinkEnergy,
    coolingAtMax,
    engineHeat,
    generatorWaste,
    laserHeat,
    laserEndurance: endurance(laserHeat),
    burnEndurance: endurance(engineHeat),
    lasers,
    laserPower,
    laserOutput: lasers.reduce((a, l) => a + l.output, 0),
    railguns,
    missiles,
    slugEnergy: slug,
    railInput,
    slugPenetration: penetration(slug, T.railgun.impactArea),
    storageEnergy,
    patchHP,
  };
}

// ---------- Plain-language summary (Layer 2: what the design means, without the physics) ----------

export const fmtTime = (s) => {
  if (!isFinite(s)) return 'indefinitely';
  if (s < 90) return `${Math.round(s)} s`;
  if (s < 5400) return `${Math.round(s / 60)} min`;
  return `${(s / 3600).toFixed(1)} h`;
};
export const fmtDist = (m) => (m >= 1e6 ? `${(m / 1e3).toLocaleString('en', { maximumFractionDigits: 0 })} km` : m >= 1e3 ? `${(m / 1e3).toFixed(m < 1e4 ? 1 : 0)} km` : `${Math.round(m)} m`);
export const fmtMass = (kg) => `${(kg / 1000).toFixed(kg < 1e4 ? 1 : 0)} t`;
export const fmtPower = (w) => (w >= 1e9 ? `${(w / 1e9).toFixed(1)} GW` : w >= 1e6 ? `${(w / 1e6).toFixed(w < 1e7 ? 1 : 0)} MW` : `${(w / 1e3).toFixed(0)} kW`);
export const fmtEnergy = (j) => (j >= 1e9 ? `${(j / 1e9).toFixed(1)} GJ` : `${(j / 1e6).toFixed(0)} MJ`);

/** The design's abilities in game terms. Each line: [topic, sentence]. */
export function summarize(d) {
  const g = PHYS.G0;
  const lines = [
    ['Acceleration', `${(d.accelFull / g).toFixed(2)} g with full tanks, ${(d.accelEmpty / g).toFixed(2)} g when they run dry.`],
    ['Fuel', `${(d.deltaV / 1000).toFixed(1)} km/s of total speed change: about ${fmtTime(d.burnTime)} of full thrust.`],
    ['Turning', `Turns around in ${d.turn180.toFixed(1)} s.`],
  ];
  for (const l of d.lasers)
    lines.push(['Laser', `${fmtPower(l.output)} beam at full strength out to ${fmtDist(l.focus)}; a quarter as strong at twice that.`]);
  if (d.railguns)
    lines.push(['Railguns', `${d.railguns} × ${fmtEnergy(d.slugEnergy)} slugs that punch through ${Math.round(d.slugPenetration)} kg/m² of armour. Hard to land beyond ~20 km against a ship that dodges.`]);
  if (d.missiles)
    lines.push(['Missiles', `${d.missiles} kinetic missiles (${(TECH.missile.deltaV / 1000).toFixed(0)} km/s each). One hit can gut a ship, but lasers can shoot them down.`]);
  if (d.laserPower)
    lines.push(['Heat', d.laserEndurance === Infinity ? 'Radiators keep up: you can fire indefinitely.' : `Can fire every laser for ${fmtTime(d.laserEndurance)} before overheating.`]);
  lines.push(['Engine heat', d.burnEndurance === Infinity ? 'Can burn the engine non-stop without overheating.' : `Can burn the engine for ${fmtTime(d.burnEndurance)} before overheating.`]);
  lines.push(['Armour', `Each armour patch survives ${Math.round(d.patchHP / 50e6)} s under a 50 MW laser.`]);
  lines.push(['Mass', `${fmtMass(d.wet)} fuelled, ${fmtMass(d.dry)} empty.`]);
  return lines;
}
