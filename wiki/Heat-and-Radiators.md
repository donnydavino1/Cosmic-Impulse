# Heat and Radiators

Every watt your ship uses ends up as heat, and in a vacuum there is no air to carry it away. The only way out is
**radiation**: a radiator glows in infrared (Law 5 in [[The Laws of Cosmic Impulse]]).

## How much a radiator sheds

The Stefan–Boltzmann law: each square metre of radiator surface sheds ε·σ·T⁴, with σ = 5.67×10⁻⁸ W/m²K⁴ and
emissivity ε = 0.85. Temperature matters enormously:

| Radiator temperature | Heat shed per m² | |
|---|---|---|
| 318 K (45 °C) | ≈ 490 W | the crew loop |
| 600 K | ≈ 6.2 kW | |
| 900 K | ≈ 32 kW | liquid-droplet radiators |
| 1200 K | ≈ 100 kW | high-temperature heat pipes |

Radiators shed from both faces, so a 60 m² panel has 120 m² of surface.

## Two cooling loops

- **Low loop (≈300 K):** crew, electronics, batteries, electric thrusters and fabricators. Its radiators can't run
  hotter than the crew can stand. If it overheats, the cabin goes above 45 °C and the crew suffers ([[Survival]]).
- **High loop:** reactors and hot engines, up to the radiator's limit (900–1200 K). Hot radiators are small and
  light for the power they shed, so big reactors need them.

## Radiator parts

| Part | Area | Max temperature | Loop |
|---|---|---|---|
| Low-temp radiator | 60 m² | 400 K | low |
| High-temp heat-pipe radiator | 40 m² | 1200 K | high |
| Liquid-droplet radiator | 400 m² | 900 K | high |

Exact masses and recipes are on [[Parts]]; research is on [[Technologies]].

## The Sun's heat

Sunlight warms the ship too, more the closer you are (it grows with the square of the distance: 1.4 kW/m² at Earth,
9 kW/m² at Mercury, 136 kW/m² at 0.1 AU) and the bigger your ship is side-on. Beyond what the hull can take, sunlight
**burns the hull**:

| Protection | Survives sunlight up to | About this close to the Sun |
|---|---|---|
| Bare hull | 25 kW/m² | 0.23 AU |
| **Multi-layer sunshade** (blocks 95 % of the heat) | 80 kW/m² | 0.13 AU |
| **Carbon-carbon heat shield** (blocks 99.5 %, like the Parker Solar Probe) | 1.2 MW/m² | 0.034 AU |

Both are parts in 🛠 → 🏭 Fabricate (needs *Carbon composites*), and modules you can place in the [[Ship Builder]].

## What it means for design

- A reactor without high-loop radiators dumps its waste heat into the crew loop: it is throttled hard.
- Engines with a heat fraction (nuclear thermal, fusion) need high-loop capacity to run at full power: the
  Design Analyzer in 🛠 shows when heat is your limit.
- Lasers and the railgun turn energy into heat too ([[Combat]]).
- In the [[Ship Builder]], radiators are modules with fins; place them near the heat source or wherever you like:
  the loops are plumbed through the frame.

## The 🌡 Thermal view (F2)

Open it with **F2**, the **🌡 HEAT** button in the top bar, a click on the **SYSTEMS** screen of the 3D flight deck, or 🛠 Engineering → Ship → 🌡 Thermal. It shows:

- a **heat map** of your ship: each module coloured by its loop's temperature (blue cold, green comfortable, yellow at
  the 45 °C crew limit, red hot, white-hot at 1,200 K), radiator fins, and the engine bell glowing while it burns;
- each loop's **heat in**, what its radiators **can shed**, where its temperature **settles**, and how long until it
  goes over the limit;
- **where the heat comes from** right now (systems and crew, sunlight on the hull, weapons, fabrication, reactors,
  the engine);
- a **radiator calculator**: pick an engine, a throttle and the highest cabin temperature you want, and it tells you
  the radiator area each loop needs and **how many of each radiator** to add, with a **🏭 Build N** button.

**Worked example:** the magnetic-confinement fusion drive (1 GW) turns 15 % of its power into heat: **150 MW** for the
high loop. A low-temperature radiator sheds about 60 kW, so it would take 2,500 of them; a heat-pipe radiator sheds
about 7 MW at 1,164 K, so **22** do the job (6.6 t), or 7 liquid-droplet radiators (2.8 t). Without any high-loop
radiators the drive is held to about 0.005 % thrust, and the game tells you why.

The starter ship's hull has 50 m² of body-mounted radiators (both faces), enough for its systems in full sunlight
at Earth's distance.
