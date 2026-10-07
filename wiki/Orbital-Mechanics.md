# Orbital Mechanics

The short version is on [[Flying and Orbits]]. This page goes deeper, with the numbers the game actually uses.

## Speed in orbit

For any orbit around a body with gravitational parameter μ = G·M, the **vis-viva equation** gives your speed at
distance *r* from its centre, for an orbit whose average radius (semi-major axis) is *a*:

v² = μ · (2/r − 1/a)

- A **circular orbit** has v = √(μ/r). Low Earth orbit at 400 km: about **7.67 km/s**, once every 92 minutes.
- **Escape speed** is √(2μ/r): about 10.85 km/s at 400 km. From low orbit you need about **3.2 km/s** more to leave
  Earth for good.

## The six directions

| Push | Name | Effect | Keys (orbit mode) |
|---|---|---|---|
| along your motion | **prograde** | raises the far side of the orbit | W |
| against it | **retrograde** | lowers the far side | S |
| toward / away from the planet | **radial** | rotates the orbit's long axis | A / D |
| out of the orbit plane | **normal / anti-normal** | tilts the orbit | E / Q |

## Changing orbits cheaply: Hohmann transfers

To go from one circular orbit to a higher one, push prograde once to stretch your orbit until its far point touches
the target, coast half an orbit, then push prograde again to round it off. This is the **Hohmann transfer**, the
cheapest two-burn path. From Earth's orbit around the Sun to Mars's it takes about **2.9 km/s** for the first push
and **259 days** of coasting. [[Science probes|Drones and Probes]] use exactly this calculation.

**Launch windows:** Mars must be in the right place when you arrive. Earth and Mars line up like this every
**780 days** (the synodic period), which is why real missions leave in windows.

## The Oberth effect

A push gives you the most energy when you are moving fastest: deep in a gravity well, at the lowest point of your
orbit. Leaving Earth from low orbit for Jupiter takes about 6.3 km/s; the same trip started in deep space needs
about 8.8 km/s. That is why probes launched from low orbit reach farther.

## Tilting an orbit

Changing the orbit plane by an angle Δi costs Δv = 2·v·sin(Δi/2). At 7.7 km/s, a 10° tilt costs 1.3 km/s: tilt far
from the planet, where you move slowly.

## Spheres of influence

Near a planet its gravity dominates; far away the Sun's does. The game always integrates every body's pull, but the
orbit readout uses your **dominant body**, the one whose gravity matters most where you are.

## The rocket equation

Δv = vₑ · ln(m_full / m_empty). Doubling your propellant does **not** double your Δv; a faster exhaust (vₑ) does.
See [[Engines]] and [[Fuels]], and the Design Analyzer in 🛠.
