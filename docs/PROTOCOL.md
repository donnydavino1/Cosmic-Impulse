# Cosmic Impulse protocols

Everything one ship (or program) can learn about another goes through a small set of **versioned, documented
formats**. The physics decides the *truth*; your hardware decides *how much of it you receive*; your display decides
*how it looks*. Anyone can build a new radar, HUD or bot against these formats without touching the physics.

All units are SI (m, s, kg, J, m/s). Positions are Sun-centred, in the game's ecliptic axes (x, y in the ecliptic,
z = ecliptic north). Time `t` is coordinate time in seconds since the game epoch (2026-10-04 00:00 UTC);
`tau` is the ship's proper time. Every object carries a `v` field with its format and version.

| Format | What it is | Where |
|---|---|---|
| `ORB-STATE/1` | Your ship's public state | `ORB.api.state()` |
| `ORB-LEDGER/1` | Your conserved quantities | `ORB.api.ledger()` |
| `ORB-TLM/1` | One sensor contact | `ORB.api.contacts()` (array) |
| `ORB-NET/1` | Messages between two games | multiplayer module |
| `ORB-API/1` | The JavaScript surface | `window.ORB.api` |

Versioning: adding a field is allowed within a version; removing or changing the meaning of one needs `/2`.
Readers must ignore unknown fields.

## Fingerprints: playing by the same rules

There are two, and they answer different questions:

- **`RULES`** (gameplay fingerprint): an FNV-1a hash of every number that decides what a ship can do (engines,
  parts, technologies, fuels, weapons, physical constants). Two games may fight fairly only if these match. Desktop
  and phone builds always match, because the controls are not rules.
- **`ORB_FP`** (code fingerprint): SHA-256 (16 hex) of the whole game core (shell + CSS + JS, without the platform
  layer), printed by `tools/build-game.mjs` and embedded in both builds. Equal `ORB_FP` means byte-identical game code.

The combat lab (`src/`) has its own `fingerprint()` over `src/rules/rules.js`, the same idea for that sub-game.

## ORB-STATE/1

```json
{"v":"ORB-STATE/1","t":400.0,"tau":399.99,"name":"Sunchaser",
 "pos":[1.4959e11,8.95e6,0],"vel":[3357.5,22891.3,0],
 "dominant":"Earth","altitude":400000,
 "engine":{"id":"chem","power":1.2e8,"burn":0},
 "hull":1e8,"hullMax":1e8,"sensor":"Pulse radar","rules":"a1b2c3d4","code":"4fb54a9b3b425d29"}
```

## ORB-LEDGER/1: conserved quantities

The ledger is the bookkeeping that keeps the game honest: things can only move between stores, never appear.

| Field | Meaning |
|---|---|
| `mass` | total rest mass, kg |
| `elements` | kg of each element: `H He C O Si Fe Ni Pt Xe …`, plus `anti-H`, plus `structure` (mass not yet itemised) |
| `energy.battery` | J stored |
| `energy.fuel` | J releasable from each fuel (chemical, fusion, antimatter) |
| `energy.kinetic` | (γ−1)mc², Sun frame |
| `energy.hullAbsorb` | J the hull can absorb before failing |
| `momentum` | γmv vector, kg·m/s, Sun frame |
| `gamma`, `speed` | Lorentz factor and speed |
| `t`, `tau` | coordinate and proper time |
| `derived` | quantities that are functions of the above (hull fraction, missiles, rail slugs, crew health) |

Element splits used (mass fractions; change them in `game/js/2560-api.js → COMPO`):

| Item | Composition |
|---|---|
| water | H 0.112, O 0.888 (H₂O) |
| silicates | Si 0.467, O 0.533 (SiO₂) |
| food | C 0.444, H 0.062, O 0.494 ((C₆H₁₀O₅)n) |
| rocket fuel (chem) | H 0.143, O 0.857 (LH₂/LOX at 6:1) |
| fusion fuel | H(D) 0.4, He(³He) 0.6 |
| spares | Fe 0.7, Ni 0.1, C 0.2 |
| installed parts | their fabrication recipe, scaled to the part's mass |
| iron, nickel, carbon, platinum, oxygen, xenon, hydrogen | the pure element |

Energy densities: chemical 1.34×10⁷ J/kg, hydrogen (as fuel) 1.42×10⁸, D–³He fusion 3.5×10¹⁴, antimatter 1.8×10¹⁷
(it annihilates with an equal mass of matter).

**Derived, not conserved:** health, shields, ammunition. A missile is 50 kg (25 kg structure + 25 kg chem fuel);
a railgun slug is 2 kg of iron; hull is absorbable energy. If a new system can't be written as a function of
elements + energy + time, it probably isn't physical yet.

## ORB-TLM/1: sensor contacts

A contact is what your sensors *report*, not the truth: positions carry noise (σ), and how much you learn depends on
your sensor tier. Noise is deterministic per contact and update slot, so a display doesn't flicker between updates.

```json
{"v":"ORB-TLM/1","id":"raider-sem73e","kind":"raider","name":"Raider Cinder","t":421.1,"lvl":5,
 "pos":[1.495939e11,9.465e6,-11760],"sigma":1.66,"range":33240,"hostile":true,
 "vel":[3546.6,22844.9,29.8],"sigmaV":0.1,"closing":133.0,
 "mass":1800,"radius":5,
 "elements":{"Fe":0.6,"C":0.2,"Si":0.1,"Ni":0.05,"Pt":0.001},"hull":1,"ammo":{"missiles":0},
 "loadout":["pulse laser"],"engine":{"accel":12,"burn":1}}
```

`kind`: `raider` `drone` `missile` (hostile) `own-missile` `slug` `asteroid` `player`.

**Fidelity levels** (each includes the ones above it):

| Level | Adds |
|---|---|
| L1 | `pos`, `sigma`, `range`, `hostile`, `kind` (name is `unknown`) |
| L2 | `name`, `vel`, `sigmaV`, `closing` (Doppler) |
| L3 | `mass`, `radius` |
| L4 | `elements` (mass fractions), `hull` (0–1), `ammo` |
| L5 | `loadout`, `engine` |

**Sensor tiers** (today: tier = technologies known ÷ 7, max 5):

| Tier | Name | Range | Error (of range) | Updates/s | Level |
|---|---|---|---|---|---|
| 1 | Pulse radar | 500 km | 2 % | 1 | L1 |
| 2 | Doppler radar | 2,000 km | 0.5 % | 2 | L2 |
| 3 | Phased array | 20,000 km | 0.1 % | 4 | L3 |
| 4 | Lidar + spectrometer | 200,000 km | 0.02 % | 8 | L4 |
| 5 | Interferometric array | 2,000,000 km | 0.005 % | 10 | L5 |

Planned: sensor hardware as real parts (mass, power, heat), active sensing reveals you, passive thermal detection
of hot radiators, light-speed delay on far contacts.

## ORB-SHIP/1: a ship's look and layout

The shareable style (🎨 Customize → Copy style as JSON) plus hardpoint offsets. Parts a module tags as hardpoints
(`userData.mount`) can be moved: today the sensor antenna (`antenna`) and each weapon turret (`weapon:<id>`).

```json
{"name":"Blue Lancer","hull":"#2f6fe0","acc":"#ffb347","shape":"capsule","wings":4,"panel":"holo",
 "trim":"stripes","glow":0.7,"dish":"auto",
 "mounts":{"antenna":{"p":[0,0,1],"r":15,"s":1.15},"weapon:rail":{"p":[1,0,0]}}}
```

`p` = offset in metres from the default spot (x along the ship, y sideways, z up), `r` = degrees about the ship's
long axis, `s` = scale (0.3–3). Looks only: moving a part does not change mass, power or physics.

## ORB-NET/1: messages between two games (peer to peer, JSON)

The host owns the shared clock. Messages today:

| `t` | Direction | Fields |
|---|---|---|
| `hello` | both | `name`, `rules` (gameplay fingerprint), `code` (ORB_FP), `role`, `v` |
| `clock` | host → guest | `T`, `rate`, `wi`, `paused`, `lock` |
| `req` | guest → host | `what`: `faster`/`slower`/`pause` |
| `ship` | both, 10 Hz | `T`, `x y z`, `vx vy vz`, `burn`, `eng`, `area`, `hull`, `hullMax`, `alive`, `name`; every 2 s also `cust` (style) and `led` `{m, el, tier, wep, mis}` (ledger summary) |
| `hit` | attacker → target | weapon, energy, position |
| `wreck` / `wgone` / `loot` | both | wreck created / removed / looted |
| `flare` | host → guest | solar storm `{t0, t1, peak}` |
| `chat` | both | `text`, `sys` |
| `ping` / `pong` | both | round-trip time |

Each receiver builds the other player's ORB-TLM contact from `ship` messages through its *own* sensors, so better
sensors see more of an opponent. Planned for a relay server: attach `ledger` hashes to `ship` messages and reject
changes in element mass or energy that no allowed process explains.
