# Relativity

Below a few thousand km/s, Newton is enough. Toward the speed of light (c = 299,792 km/s), Cosmic Impulse switches to
special relativity, as in [[Law 7|The Laws of Cosmic Impulse]].

## Gamma

The Lorentz factor γ = 1 / √(1 − v²/c²) says how strongly relativity acts:

| Speed | γ | One year on your ship is … at home |
|---|---|---|
| 1 % of c (3,000 km/s) | 1.00005 | 1 year and 26 minutes |
| 10 % of c | 1.005 | 1 year and 2 days |
| 50 % of c | 1.155 | 1.16 years |
| 90 % of c | 2.29 | 2.3 years |
| 99 % of c | 7.09 | 7.1 years |
| 99.9 % of c | 22.4 | 22 years |

## Two clocks

The game shows **game time** (the solar system's clock) and **ship clock** (your proper time). Near light speed
your crew ages, eats and breathes by the ship clock, so a fast ship needs fewer supplies for the same trip
([[Survival]]).

## The energy wall

Kinetic energy is (γ − 1)·m·c². A 100-tonne ship at 10 % of c carries about 4.5×10¹⁹ J, roughly a month of today's
world energy use. At 99 % of c it is about 1,200 times more. That is why only fusion and antimatter drives get there
([[Engines]], [[Technologies]]), and why the *Light-speed trial* contract asks for 1 % ([[Contracts]]).

## What you see

Sensor information travels at light speed too, so far away things are seen as they were ([[Sensors and Radar]]);
probe data comes home at light speed ([[Drones and Probes]]).

## How long to Proxima Centauri?

Proxima Centauri, the nearest star, is **4.25 light-years** away (268,000 AU). How long the trip takes depends on how
fast your ship can go, and you see three clocks:

| Top speed | Universe (game time) | Your ship clock | Real time (fastest time speeds) |
|---|---|---|---|
| **0.99 c** (γ ≈ 7.09, antimatter) | ≈ 4.3 years | ≈ **7.3 months** | seconds of coasting, plus the burns |
| 0.24 c (antimatter, 200 t fuel) | ≈ 18 years + burns | ≈ 17.5 years | ≈ 15 minutes |
| 0.02 c (fusion, 400 t fuel) | ≈ 210 years + burns | ≈ 210 years | ≈ 40 minutes |
| 20 km/s (an escape-speed coast) | ≈ 64,000 years | same | ≈ 17 minutes (most of it crossing the 2,000 AU around each star) |

**Deep-space time speeds** (**1 s = 9.5, 95 and 950 years**) unlock when you are more than **2,000 AU from every star**,
where nothing changes quickly; within 2,000 AU of the Sun or Proxima the fastest is 1 s = 1 year, and coming back in
drops time to that automatically. So any ship that can leave the solar system reaches Proxima in well under a day of
real time; the cruise dialog shows the estimate before you go. The physics is the same at every time speed: the
integrator just takes bigger steps where gravity is weak and smooth.

To go: 🧭 NAVIGATE → search *Proxima* → **🚀 Interstellar cruise**. The cruise autopilot first climbs out of the
Sun's gravity (pushing along its motion, so a gentle engine spirals outward instead of falling sunward), then speeds up
toward Proxima until the propellant left is just enough to stop, coasts, and brakes so it arrives within 2 AU of the
star, then settles into a circular orbit around it. It warns you if the crew would need supplies for more than a year (**🧊 hibernate** them: [[Survival]]), if heat
would throttle your engine, or if you have no Whipple shield for the dust of the Oort cloud.

## How the game computes gravity and relativity (the exact model)

**Short answer:** Cosmic Impulse does **not** use a full post-Newtonian (PN) integrator for motion. It uses
**special relativity with Newtonian gravity**: Newton's inverse-square gravity acts as a force on the ship's
relativistic momentum, inside one inertial frame centred on the Sun. On top of that, the **ship clock** includes the
**leading post-Newtonian clock term** (gravitational time dilation, the effect GPS satellites correct for). Everything
below is exactly what the code does (`game/js/0100-physics.js`).

### What is computed

| Piece | Formula in the game | Notes |
|---|---|---|
| Frame and time | one inertial frame centred on the Sun; **T** is its coordinate time | the "game time" clock |
| State of your ship | position **x** and *proper velocity* **u = γv** | u is momentum per kilogram of rest mass |
| Lorentz factor | γ = √(1 + u²/c²) | written in u, so speed can never pass c |
| Motion | dx/dT = u / γ | |
| Gravity | du/dT = Σ −GMᵢ (x − xᵢ) / \|x − xᵢ\|³ | Sun, planets, moons and Proxima Centauri; Newton's law acting on momentum |
| Thrust | engine force is worked out in the ship's own frame, then converted: the part along your motion is unchanged, the part across it is divided by γ | the standard special-relativity force transformation |
| Fuel, power, crew | used per **ship time** dτ | a fast ship burns, breathes and eats by its own clock |
| Speed limit for Δv | v = c · tanh( (vₑ/c) · ln(m₀/m₁) ) | the relativistic rocket equation |
| Stored energy | adds mass E/c² | a full battery is (very slightly) heavier |
| Speed cap | 0.99 c (γ ≈ 7.1) | a game limit, so numbers stay sane |
| **Ship clock** | dτ = (dT / γ) · (1 + Φ/c²), with Φ = −Σ GMᵢ / rᵢ | **special-relativistic dilation × the weak-field gravitational term** |
| What sensors see | a contact is shown where it was d/c ago: x − v·d/c | light-time, to first order |

The planets and moons move on fixed circular orbits in one plane (they pull on ships, ships don't pull on them);
asteroids follow real elliptical Kepler orbits. The integrator is a **kick–drift–kick leapfrog** (velocity Verlet):
each step is at most 2 % of the shortest local orbital or crossing time (and at most 10 minutes), which keeps orbits
stable over many revolutions instead of slowly spiralling in or out.

You can watch the clock terms in the **🕐 Clocks** cockpit widget (add it with the dashboard editor, key **I**): **Ship clock rate** shows the total and its two factors. In low
Earth orbit the speed factor is about 1 − 3.3×10⁻¹⁰ and the gravity factor about 1 − 1.05×10⁻⁸ (most of that is the
Sun's potential at 1 AU; Earth adds 6.5×10⁻¹⁰).

### What is left out, and how big it is

| Effect (general relativity / post-Newtonian) | Size in the solar system | Why it's left out |
|---|---|---|
| 1PN corrections to *motion* (the EIH equations) | Mercury's perihelion turns 43″ per century; a low Earth orbit's perigee about 14″ per year | far smaller than the game's other approximations (circular planet orbits, no planet oblateness) |
| Extra bending of fast objects | GR bends light twice as much as Newton (1.75″ at the Sun's edge); a ship near light speed would bend up to ~2× the Newtonian amount | only matters for relativistic ships grazing the Sun; could be added later |
| Frame dragging (Lense–Thirring) | tens of milliarcseconds per year in Earth orbit | negligible |
| Gravity's own travel time | gravity acts instantly | in GR this nearly cancels for slowly moving sources |
| Shapiro delay, light bending for sensors | up to ~200 microseconds of radar delay; sensors use straight lines | negligible for gameplay |
| Gravitational waves | ~10⁻¹⁶ m/s² equivalent from the Sun–Jupiter system | utterly negligible |
| Planets' own motion | circular, coplanar orbits instead of ellipses | the largest simplification, chosen for speed; it is *not* a relativity issue |

**In one sentence:** motion = Newtonian N-body gravity + exact special relativity; clocks = special relativity + the
first post-Newtonian (weak-field) gravity term; everything else from general relativity is far below what you could
notice while playing.
