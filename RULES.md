# Cosmic Impulse Rules

> Generated from `src/rules/rules.js` by `npm run rules`. Do not edit by hand.

Rule set **orbital-arena-0.1**, fingerprint **163fa166**.

These rules are fixed and identical for everyone. Customization changes how your ship looks and
how you see and control it, never what it can physically do. Two games only fight each other if
their fingerprints match.

## Physical constants

| Rule | Value |
|---|---|
| C | 3.00e+8 |
| SIGMA | 5.67e-8 |
| G0 | 9.80665 |
| SPACE_TEMP | 4 |

## World

| Rule | Value |
|---|---|
| serverSpeed | 300 |
| encounterSpeed | 1 |
| arenaDistances | [100000,400000,1000000] |
| arenaBoundary | 5.00e+6 |
| arenaTimeLimit | 1200 |

The Vision sets the server speed at 300× real time. `encounterSpeed` is a **proposal**: ships
that are fighting each other run in real time, because a ten-minute battle would otherwise last
two seconds. This needs the project owner's decision before it becomes a final rule.

## Materials

| Material | Properties |
|---|---|
| Aluminium alloy | density 2700, ablation 1.10e+7 |
| Water | heatCapacity 4186, latentHeat 2.26e+6, boilsAt 400 |
| Liquid hydrogen | density 71 |
| Liquid oxygen | density 1141 |

## Technology: Nuclear era scaling laws

| Rule | Value |
|---|---|
| era | "Nuclear" |
| reactor.kgPerWatt | 8.00e-6 |
| reactor.leakToShip | 0.01 |
| engine.veHydrogen | 9200 |
| engine.veDropPerOx | 0.078 |
| engine.thrustGainPerOx | 0.6 |
| engine.maxOxRatio | 4 |
| engine.nozzleEfficiency | 0.85 |
| generator.kgPerWatt | 0.001 |
| generator.efficiency | 0.3 |
| generator.shipHeatShare | 0.15 |
| storage.joulesPerKg | 5.00e+5 |
| storage.wattsPerKg | 20000 |
| storage.secondsOfLaserFire | 10 |
| storage.railShots | 2 |
| radiator.kgPerM2 | 3 |
| radiator.emissivity | 0.9 |
| radiator.maxTemp | 450 |
| radiator.retractedFraction | 0.1 |
| radiator.hitShare | 0.5 |
| hull.mass | 15000 |
| hull.heatCapacity | 500 |
| hull.area | 300 |
| hull.radius | 12 |
| hull.armorPatch | 4 |
| hull.startTemp | 300 |
| tanks.perKgHydrogen | 0.12 |
| tanks.perKgOxygen | 0.03 |
| laser.kgPerWatt | 1.00e-4 |
| laser.efficiency | 0.35 |
| laser.wavelength | 1.06e-6 |
| laser.mirrorKgPerM2 | 60 |
| laser.spot | 0.5 |
| laser.heatIntoTarget | 0.1 |
| laser.pdRetarget | 0.5 |
| railgun.mass | 4000 |
| railgun.slugMass | 1 |
| railgun.muzzleSpeed | 6000 |
| railgun.efficiency | 0.5 |
| railgun.reload | 3 |
| railgun.impactArea | 0.01 |
| missile.mass | 300 |
| missile.deltaV | 6000 |
| missile.accel | 150 |
| missile.killEnergy | 1.00e+7 |
| missile.impactArea | 0.5 |
| missile.salvo | 4 |
| missile.reload | 6 |
| penetrationEnergy | 2.00e+6 |
| turn.secondsFor180At100t | 4 |
| components.crew.share | 0.1 |
| components.crew.hp | 3.00e+8 |
| components.reactor.share | 0.2 |
| components.reactor.hp | 4.00e+8 |
| components.engine.share | 0.15 |
| components.engine.hp | 3.00e+8 |
| components.generator.share | 0.15 |
| components.generator.hp | 2.00e+8 |
| components.storage.share | 0.1 |
| components.storage.hp | 1.50e+8 |
| components.sink.share | 0.1 |
| components.sink.hp | 1.50e+8 |
| components.weapons.share | 0.2 |
| components.weapons.hp | 1.50e+8 |
| limits.throttleTemp | 450 |
| limits.crewHarmTemp | 480 |
| limits.crewHarmPerKelvin | 2.00e+6 |

## Design sliders

Each slider moves one physical quantity between two limits.

| Slider | Left | Right | Physical quantity | Range |
|---|---|---|---|---|
| punch | Endurance | Punch | oxygen-to-hydrogen ratio | 0 to 4  |
| armor | Agile | Armoured | armour areal density | 20 to 200 kg/m² |
| power | Steady | Powerful | generator output | 2.00e+6 to 4.00e+7 W |
| cooling | Small target | Big radiators | radiator area (one face) | 300 to 4000 m² |
| fuel | Light | Long legs | propellant | 20000 to 1.60e+5 kg |
| sink | Short fights | Long fights | water heat sink | 2000 to 30000 kg |

## Ship classes (starting blueprints)

### Scout

Fast and light. Its laser shreds missiles and thin armour.

- **Acceleration:** 0.31 g with full tanks, 0.67 g when they run dry.
- **Fuel:** 5.5 km/s of total speed change: about 21 min of full thrust.
- **Turning:** Turns around in 5.0 s.
- **Laser:** 14 MW beam at full strength out to 290 km; a quarter as strong at twice that.
- **Heat:** Can fire every laser for 30 min before overheating.
- **Engine heat:** Can burn the engine for 3.8 h before overheating.
- **Armour:** Each armour patch survives 49 s under a 50 MW laser.
- **Mass:** 194 t fuelled, 90 t empty.

### Brawler

Heavy armour and twin railguns. Wins up close, if it survives the approach.

- **Acceleration:** 0.58 g with full tanks, 0.94 g when they run dry.
- **Fuel:** 3.3 km/s of total speed change: about 8 min of full thrust.
- **Turning:** Turns around in 5.3 s.
- **Laser:** 3.5 MW beam at full strength out to 193 km; a quarter as strong at twice that.
- **Railguns:** 2 × 18 MJ slugs that punch through 900 kg/m² of armour. Hard to land beyond ~20 km against a ship that dodges.
- **Heat:** Can fire every laser for 5.7 h before overheating.
- **Engine heat:** Can burn the engine for 50 min before overheating.
- **Armour:** Each armour patch survives 144 s under a 50 MW laser.
- **Mass:** 236 t fuelled, 146 t empty.

### Sniper

A huge laser behind a 4-metre mirror. Deadly at long range, fragile up close.

- **Acceleration:** 0.21 g with full tanks, 0.34 g when they run dry.
- **Fuel:** 4.1 km/s of total speed change: about 26 min of full thrust.
- **Turning:** Turns around in 5.3 s.
- **Laser:** 53 MW beam at full strength out to 773 km; a quarter as strong at twice that.
- **Heat:** Can fire every laser for 12 min before overheating.
- **Engine heat:** Can burn the engine for 13.7 h before overheating.
- **Armour:** Each armour patch survives 65 s under a 50 MW laser.
- **Mass:** 233 t fuelled, 143 t empty.

### Missile carrier

Salvos of kinetic missiles, guarded by point-defence lasers.

- **Acceleration:** 0.33 g with full tanks, 0.61 g when they run dry.
- **Fuel:** 4.8 km/s of total speed change: about 18 min of full thrust.
- **Turning:** Turns around in 5.2 s.
- **Laser:** 5.3 MW beam at full strength out to 193 km; a quarter as strong at twice that.
- **Missiles:** 24 kinetic missiles (6 km/s each). One hit can gut a ship, but lasers can shoot them down.
- **Heat:** Can fire every laser for 2.4 h before overheating.
- **Engine heat:** Can burn the engine for 1.6 h before overheating.
- **Armour:** Each armour patch survives 97 s under a 50 MW laser.
- **Mass:** 226 t fuelled, 122 t empty.
