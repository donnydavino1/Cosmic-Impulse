# Flying and Orbits

In orbit you are always falling; you just move sideways fast enough to keep missing the planet.

| You do | What happens |
|---|---|
| Push **forward** (along your motion, W in orbit mode) | the far side of your orbit rises; you end up *higher and slower* |
| Push **back** (S) | the far side drops; push long enough and you hit the planet |
| Push **outward/inward** (D/A) | the orbit tilts its long axis; a small, inefficient change |
| Push **up/down** (E/Q) | the orbit's plane tilts |

- **Orbit mode** (default) uses directions relative to your orbit. **M** switches to fixed **X/Y/Z** axes.
- The **green arrow** on the orbit map shows where you are moving; the **orange loop** is your whole orbit.
- **Escaping a planet** needs about 3.2 km/s from low Earth orbit. Your starting fuel gives about 3.9 km/s.
- **Delta-v** (how much you can change your speed) follows the rocket equation: more fuel helps less and less;
  a better engine (higher exhaust speed) helps a lot. The Design Analyzer in 🛠 shows your number.
- **Time warp** speeds everything up. Manual rocket burns hold time at ×10; raids hold it at ×10; close
  multiplayer encounters run in real time.
- **Relativity:** near light speed your ship clock (proper time) runs slow compared to the rest of the universe.
  Both clocks are shown. Reaching 0.99c is a late-game goal.

**Finding things:** the 🧭 NAVIGATE window has a search box: type part of a name (in any of the three languages)
to find planets, moons, Proxima Centauri, asteroids or another player's ship, then *Look* at it, *Fly here*, or fly to
its distance from the Sun. **Before a trip** the autopilot estimates the propellant and days it needs; if your fuel,
oxygen, water or food falls short, it tells you what is missing and asks whether to fly anyway or cancel.

Engines range from chemical rockets (big thrust, little efficiency) through ion and nuclear to fusion and antimatter
(enormous efficiency, need research and fuel). See [[Ship and Engineering]].

## Interstellar cruise

Beyond the planets, the 🧭 NAVIGATE search also finds **Proxima Centauri** (☀) and its planet **Proxima b**. The star's
**🚀 Interstellar cruise** button hands the ship to a relativistic autopilot: it climbs out of the Sun's gravity, speeds
up until the propellant left is just enough to stop (never past 0.99 c), coasts, and brakes in time to stop at the star.
Once you are 2,000 AU from every star, faster **deep-space time speeds** (up to 1 s = 950 years) unlock, so the trip
takes minutes of real time instead of days. See [[Relativity]] for the trip times and [[Survival]] for crew hibernation.

**Trip estimates are honest about slow engines.** The estimate before a trip includes how long the engine must burn
at the push it can really give, not just the coast. If heat (missing radiators) or electric power holds the throttle
down, the trip check says so, by how much, and what to add; while flying, the autopilot line shows *engine held to
X %* with the reason. That explains the old "77 days" promise that never arrived: a gentle or throttled engine spirals
around Earth for months or years before it can escape. See the [[Rocket Equation Lab]] for burn times.

## Transfer windows

🧭 NAVIGATE → **TRANSFER WINDOWS** lists every planet with the cheapest path to it, a Hohmann transfer: the flight time,
the speed change from your orbit now (leaving from low Earth orbit includes the Oberth bonus of burning deep in Earth's
gravity), your arrival speed, the angle the planet must be ahead of you (Mars: 44°) against the angle now, and the days
until the next window. Windows repeat every synodic period: 780 days for Mars, 584 for Venus, 399 for Jupiter.

## Gravity assists

🧭 NAVIGATE → **GRAVITY ASSISTS** shows what a flyby of each planet could give you. In the planet's frame you leave as
fast as you arrived (v∞), only turned by an angle δ, with sin(δ/2) = 1 / (1 + rp·v∞²/GM); in the Sun's frame that
turn is a free speed change of up to 2·v∞·sin(δ/2). The table uses a closest pass of the planet's radius plus 10 %, and
two arrival speeds: your speed relative to the planet now, and the one at the end of a Hohmann transfer. Arriving at
Jupiter on a Hohmann transfer (about 5.6 km/s) can turn you by about 158° and give up to 11 km/s for free.

## Atmospheres: aerobraking and entry heating

Earth, Venus, Mars, Titan and the giant planets have atmospheres. Inside one, drag a = ½ρv²·Cd·A/m slows you
(density ρ = ρ0·e^(−h/H), with scale heights fitted to the upper air: Earth ~6.9 km, Mars ~8.2 km, Venus ~5.9 km).
Lower your lowest point into the thin upper air and each pass bleeds off speed for free (**aerobraking**), or dive
deeper to be captured in one pass (**aerocapture**). The air also heats the hull, q ≈ 1.74×10⁻⁴·√ρ·v³ W/m²: above
40 kW/m² an unshielded hull burns; a carbon-carbon heat shield takes 10 MW/m². Skimming Earth at 120 km at orbital
speed is about 15 kW/m²; coming in from the Moon at 80 km is nearly 800 kW/m². The usual low orbits stay above the
air, except at Titan, whose haze reaches over 1,000 km (the orbit planner warns you).

## Mission planner

🧭 NAVIGATE → **MISSION PLANNER**: chain stops (planets, moons, Pluto) and see the speed change for every leg and the
whole trip, the coasting time, and whether your engine and propellant can do it. Each leg is a Hohmann transfer from
low orbit to low orbit, with the Oberth effect at both ends; trips to a moon of another planet circularise at the
moon's distance and then are captured by the moon. Earth → Mars low orbit is about 5.6 km/s, Earth → Moon about 3.8.

## Porkchop plot

🧭 NAVIGATE → **PORKCHOP PLOT**: the chart real mission designers use to pick launch dates. For every departure day
(across) and flight time (up) the game solves Lambert's problem exactly (the one orbit around the Sun that joins your
planet on the departure day to the target on the arrival day) and colours the total speed change: burn out of low
orbit plus capture at the target. Dark is cheap, white lines mark every 1 km/s, and the cross is the cheapest launch.
Hover to read any point. Earth → Mars comes out at about 5.6 km/s for a ~260-day flight, repeating every ~2.1 years.

## Flip-and-burn

🧭 NAVIGATE → **FLIP-AND-BURN** is for powerful engines that don't need to wait for windows: accelerate toward the target
for the first half of the trip, flip over, and brake for the second half. Over a straight-line distance d at
acceleration a, the trip takes t = 2√(d/a) and needs a speed change of 2√(d·a). Near light speed the exact relativistic
version is used: midpoint rapidity φ = acosh(1 + a·d/2c²), ship time 2cφ/a, Earth time (2c/a)·sinh φ. The table shows
trip time, top speed and the mass ratio a full burn needs with your engine; if your propellant can't pay for it, the
plan accelerates, coasts and brakes. At 1 g Mars is about two days away; Proxima Centauri takes 3.5 years of ship time
(5.9 years on Earth). Gravity and the planets' motion are ignored.

The mission planner can write the current plan into the captain's log (📜).
