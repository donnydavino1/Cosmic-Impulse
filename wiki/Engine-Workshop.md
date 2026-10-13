# Engine Workshop

Press **[**, the **🔧 ENGINES** button in the top bar, or *🔧 Redesign in the engine workshop* under any engine in
🛠 → 🚀 Engines. Pick an engine, change its design, compare every number with what you have now, then **Build this
design** (it is rebuilt from metal: a job in 🏭 Fabricate; instant and free in sandbox). The cutaway is to scale, with a
scale bar in metres, and the plasma or flame glows in the true colour of the ions in it: steady for magnetic and
electric engines, flashing with every pellet for the inertial-fusion drive. Your ship's exhaust plume takes the same
colour and width.

## Fusion reaction (fusion drive, direct fusion drive, inertial-fusion drive)

| Reaction | Energy | Neutrons | Effect in the game | Fuel | Glow |
|---|---|---|---|---|---|
| **D–D** (stock) | 3.65 MeV | ~35 % | the reference | deuterium from water | hydrogen pink |
| **D–T** | 17.6 MeV | 80 % | easiest to ignite: 4× power per m³, half the kg per watt; 15 % slower exhaust, 1.9× the waste heat, 6× the neutron dose | D–T fuel (tritium bred from lithium) | pink |
| **D–³He** | 18.3 MeV | ~5 % | charged particles a magnetic nozzle can steer: **60 % faster exhaust**, less than half the heat, almost no neutrons; bigger core | helium-3, only from Earth (Moon soil) | helium yellow-peach |
| **p–¹¹B** | 8.7 MeV | ~0.1 % | the cleanest; needs a far hotter plasma: a quarter of the power per m³, 2.6× the kg per watt | hydrogen + boron-11 from Earth | pale pink-white |

Neutrons from a burning fusion core irradiate the crew. A **neutron shadow shield** (0–20 t) between core and cabin
cuts the dose about 2.7× for every 1.5 t. Hibernating crews take no dose.

## Propellant (electric, plasma, thermal and chemical engines)

- **Ion and Hall thrusters:** xenon (heaviest, most thrust per watt, glows blue), krypton (25 % faster exhaust,
  10× cheaper, pale violet) or argon (80 % faster exhaust, less efficient, violet). Same voltage → exhaust speed ∝ 1/√(ion mass).
- **Helicon, MPD and arcjet:** hydrogen (fastest, pink), argon (more thrust, violet) or lithium (real MPD thrusters
  use it: easy to ionise, crimson).
- **Nuclear thermal, gas-core and solar thermal rockets:** exhaust speed ∝ √(temperature ÷ molecular mass):
  hydrogen (fastest), methane (62 %, made from water + carbon), ammonia (56 %, from Earth) or **water** (42 %, but you
  can mine it anywhere and pump it straight in; it wears the core faster).
- **Chemical rocket:** hydrolox (best) or methalox (16 % slower, made in space from water and carbon).

## Tuning, size and shield

- **Tuning (−1 … +1)** trades exhaust speed against thrust at the same power: grid voltage for ion engines, nozzle
  ratio for plasma and fusion drives (×0.71 … ×1.41 exhaust speed), chamber temperature for thermal and chemical rockets
  (±12 %; hotter also makes more heat and wears the core up to 3× faster).
- **Core diameter and length** set the power: power = power density × core volume. Structure mass grows with the core's
  surface area; the engine's kg per watt still applies. Bigger means more thrust and more heat to radiate.
- Every change is previewed: exhaust speed, power, thrust, engine mass, waste heat, push on your ship, fuel, Δv with the
  fuel you carry, the crew's dose and core wear. The **LIVE** line shows your current engine's throttle, what is
  holding it back, fuel flow and burn time left.

Try the numbers first in the [[Rocket Equation Lab]].

## Nozzle bell (chemical and thermal engines)

Chemical and nuclear/solar thermal engines also get a **nozzle expansion ratio** ε (exit area ÷ throat area, 10 to
400; stock 100). A bigger bell expands the hot gas further and turns more of its heat into speed: about +4 % exhaust
speed per e-fold of ε (like going from an ε 84 to an extended ε 280 bell on a real hydrogen engine). The same mass
flow leaves faster, so thrust rises too, while the chamber's waste heat stays the same; the price is the bell's mass,
which grows with its area. The cutaway draws the bell to scale.

## In-flight tuning and bimodal reactors

The **helicon magnetoplasma engine** has variable exhaust: it moves its RF power between ionising and heating the
plasma, so it can trade exhaust speed for thrust *in flight* at constant power. Once a workshop design is in force,
**Apply this tuning now** re-tunes it instantly, without a rebuild: high thrust to climb out of a gravity well, fast
exhaust for the cruise.

Nuclear thermal and gas-core nuclear rockets can be built **bimodal**: while coasting, the core runs gently and drives
a Brayton turbine, so the engine doubles as a power plant (25 kW for the nuclear thermal rocket, 100 kW for the gas
core, 20 % efficient: the rest goes to the radiators). It costs 15 % more engine base mass and switches off while the
engine burns.

## Engine clusters

Split the same total power over 1 to 4 engines. Each extra engine adds 8 % to the base mass (plumbing, mounts,
gimbals), but a failure then stops only one of them: the rest keep pushing at (n − lost)/n of the thrust until repairs
bring the engine's condition back above 95 %. Real rockets cluster engines for exactly this engine-out capability.

## Solar sail film

The sail has no engine to redesign, but its film is a choice too (🏭 Fabricate → **SOLAR SAIL FILM**). Sunlight
pushes a mirror with force (1 + ρ) · flux · area / c, where ρ is the share of light reflected. What the film does not
reflect it absorbs, and it warms until it radiates that heat away: T = ((1 − ρ) · flux / (σ · ε))^¼. Thrust grows
as 1/distance², so the fast way to sail is to dive toward the Sun first, but only as close as the film survives.

| Film | Areal mass | Reflects | Limit | Closest safe distance |
|---|---|---|---|---|
| Aluminised polyimide (stock) | 20 g/m² | 88 % | 600 K | 0.18 AU |
| Thin aluminised film | 5 g/m² | 88 % | 520 K | 0.26 AU |
| Carbon microtruss | 10 g/m² | 70 % | 2,000 K | 0.017 AU |

Thin film gives four times the push per kilogram far from the Sun; carbon microtruss can dive to a few Sun widths,
where sunlight is over 3,000 times stronger than at Earth. Past its limit a deployed sail tears and shrinks; the
ship's alerts warn you at 90 %. You can also add sail area 10,000 m² at a time.
