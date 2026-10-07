// Stellar Impulse: the shared rule set ("Same Rules").
//
// Every number that decides what a ship can do lives in this file. Both players (and, later,
// every server) must run identical values: they are hashed into the rules fingerprint, and two
// games with different fingerprints refuse to fight. RULES.md is generated from this file.

export const RULESET = 'orbital-arena-0.1';

const deepFreeze = (o) => {
  Object.values(o).forEach((v) => v && typeof v === 'object' && deepFreeze(v));
  return Object.freeze(o);
};

/** Physical constants (SI units throughout the code base). */
export const PHYS = deepFreeze({
  C: 299_792_458, // speed of light, m/s
  SIGMA: 5.670374419e-8, // Stefan–Boltzmann constant, W/m²/K⁴
  G0: 9.80665, // standard gravity, m/s²
  SPACE_TEMP: 4, // deep-space background, K
});

/** World rules from the Vision. */
export const WORLD = deepFreeze({
  serverSpeed: 300, // game seconds per real second for travel, mining and industry
  encounterSpeed: 1, // PROPOSAL: ships fighting each other run in real time
  arenaDistances: [100e3, 400e3, 1000e3], // starting separation options, m
  arenaBoundary: 5e6, // a ship this far from the arena centre has fled, m
  arenaTimeLimit: 1200, // s; after this the ship that dealt more damage wins on points
});

/** Materials and their real properties. */
export const MATERIALS = deepFreeze({
  aluminium: { name: 'Aluminium alloy', density: 2700, ablation: 11e6 }, // J/kg to melt and vaporise
  water: { name: 'Water', heatCapacity: 4186, latentHeat: 2.26e6, boilsAt: 400 }, // boils at 400 K in a pressurised loop
  hydrogen: { name: 'Liquid hydrogen', density: 71 },
  oxygen: { name: 'Liquid oxygen', density: 1141 },
});

/**
 * Nuclear-era technology: the fixed scaling laws for every arena component.
 * Engineering sources are noted where a number comes from published studies.
 */
export const TECH = deepFreeze({
  era: 'Nuclear',
  // Nuclear thermal rocket core (NERVA-class: about 1 GW of heat for about 8 t)
  reactor: { kgPerWatt: 8e-6, leakToShip: 0.01 }, // 1% of core heat soaks into the ship while burning
  // Oxygen-augmented nuclear thermal rocket (fits to NASA "LANTR" studies)
  engine: { veHydrogen: 9200, veDropPerOx: 0.078, thrustGainPerOx: 0.6, maxOxRatio: 4, nozzleEfficiency: 0.85 },
  generator: { kgPerWatt: 1e-3, efficiency: 0.3, shipHeatShare: 0.15 }, // Brayton turbine with its own hot radiators; 15% of its waste heat reaches the ship
  storage: { joulesPerKg: 5e5, wattsPerKg: 2e4, secondsOfLaserFire: 10, railShots: 2 },
  radiator: { kgPerM2: 3, emissivity: 0.9, maxTemp: 450, retractedFraction: 0.1, hitShare: 0.5 },
  hull: { mass: 15000, heatCapacity: 500, area: 300, radius: 12, armorPatch: 4, startTemp: 300 },
  tanks: { perKgHydrogen: 0.12, perKgOxygen: 0.03 },
  laser: { kgPerWatt: 1e-4, efficiency: 0.35, wavelength: 1.06e-6, mirrorKgPerM2: 60, spot: 0.5, heatIntoTarget: 0.1, pdRetarget: 0.5 },
  railgun: { mass: 4000, slugMass: 1, muzzleSpeed: 6000, efficiency: 0.5, reload: 3, impactArea: 0.01 },
  missile: { mass: 300, deltaV: 6000, accel: 150, killEnergy: 1e7, impactArea: 0.5, salvo: 4, reload: 6 }, // ablative nose cone: 10 MJ to kill
  penetrationEnergy: 2e6, // J per kg/m² of armour a hypervelocity impact must push through, per m² of impact
  turn: { secondsFor180At100t: 4 }, // reaction wheels and thrusters: turn time scales with mass^(1/3)
  // How the ship's insides share damage once armour is breached, and how much each part takes (J)
  components: {
    crew: { share: 0.1, hp: 3e8 },
    reactor: { share: 0.2, hp: 4e8 },
    engine: { share: 0.15, hp: 3e8 },
    generator: { share: 0.15, hp: 2e8 },
    storage: { share: 0.1, hp: 1.5e8 },
    sink: { share: 0.1, hp: 1.5e8 },
    weapons: { share: 0.2, hp: 1.5e8 },
  },
  limits: { throttleTemp: 450, crewHarmTemp: 480, crewHarmPerKelvin: 2e6 }, // crew damage, J per K per second above the limit
});

/** Layer-2 sliders: each maps 0…1 onto a physical range. */
export const SLIDER_RANGES = deepFreeze({
  punch: { param: 'oxygen-to-hydrogen ratio', min: 0, max: 4, unit: '' },
  armor: { param: 'armour areal density', min: 20, max: 200, unit: 'kg/m²' },
  power: { param: 'generator output', min: 2e6, max: 40e6, unit: 'W' },
  cooling: { param: 'radiator area (one face)', min: 300, max: 4000, unit: 'm²' },
  fuel: { param: 'propellant', min: 20e3, max: 160e3, unit: 'kg' },
  sink: { param: 'water heat sink', min: 2e3, max: 30e3, unit: 'kg' },
});

/** Layer-1 ship classes: starting blueprints anyone can fly, tune and later modify. */
export const CLASSES = deepFreeze({
  scout: {
    name: 'Scout',
    role: 'Fast and light. Its laser shreds missiles and thin armour.',
    reactor: 1.2e9,
    weapons: [{ type: 'laser', power: 40e6, mirror: 1.5 }],
    sliders: { punch: 0.7, armor: 0.2, power: 0.4, cooling: 0.5, fuel: 0.6, sink: 0.4 },
  },
  brawler: {
    name: 'Brawler',
    role: 'Heavy armour and twin railguns. Wins up close, if it survives the approach.',
    reactor: 2.5e9,
    weapons: [{ type: 'railgun' }, { type: 'railgun' }, { type: 'laser', power: 10e6, mirror: 1 }],
    sliders: { punch: 0.8, armor: 0.8, power: 0.6, cooling: 0.4, fuel: 0.5, sink: 0.5 },
  },
  sniper: {
    name: 'Sniper',
    role: 'A huge laser behind a 4-metre mirror. Deadly at long range, fragile up close.',
    reactor: 1.5e9,
    weapons: [{ type: 'laser', power: 150e6, mirror: 4 }],
    sliders: { punch: 0.3, armor: 0.3, power: 0.8, cooling: 0.8, fuel: 0.5, sink: 0.7 },
  },
  carrier: {
    name: 'Missile carrier',
    role: 'Salvos of kinetic missiles, guarded by point-defence lasers.',
    reactor: 1.8e9,
    weapons: [{ type: 'missiles', count: 24 }, { type: 'laser', power: 15e6, mirror: 1 }],
    sliders: { punch: 0.5, armor: 0.5, power: 0.5, cooling: 0.5, fuel: 0.6, sink: 0.5 },
  },
});

export const SLIDERS = deepFreeze([
  { id: 'punch', left: 'Endurance', right: 'Punch', help: 'Mixes liquid oxygen into the nuclear engine’s hydrogen exhaust: more thrust, less total speed change.' },
  { id: 'armor', left: 'Agile', right: 'Armoured', help: 'Thicker armour takes longer to burn through, but every tonne makes you slower.' },
  { id: 'power', left: 'Steady', right: 'Powerful', help: 'A bigger generator recharges weapons faster, and makes more heat while it runs.' },
  { id: 'cooling', left: 'Small target', right: 'Big radiators', help: 'More radiator area dumps more heat, but extended panels are fragile and easy to hit.' },
  { id: 'fuel', left: 'Light', right: 'Long legs', help: 'More propellant means more total speed change, but a heavier ship accelerates more slowly.' },
  { id: 'sink', left: 'Short fights', right: 'Long fights', help: 'Boiling water soaks up waste heat, so you can keep firing after your radiators are saturated.' },
]);
