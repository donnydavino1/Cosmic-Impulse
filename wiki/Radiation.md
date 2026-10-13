# Radiation

Three kinds of radiation reach your crew. The dose is measured in sieverts (Sv): above **1 Sv** received quickly the
crew gets sick; **6 Sv** is lethal ([[Survival]]).

| Source | Typical dose | How to block it |
|---|---|---|
| Cosmic rays (galactic) | 1.8 mSv per day in deep space, 0.4 inside Earth's magnetic field | thick shielding helps only a little |
| Solar storms | hours of very high dose, stronger closer to the Sun | mass between you and the Sun, the storm shelter, Earth's magnetic field |
| Your reactor | depends on its size | distance, and mass in between (shadow shielding) |

## Shielding in g/cm²

Shielding is counted as mass per area: g/cm². Your hull gives 2; aluminium plating and polyethylene liners add 5
each (polyethylene counts 1.6× because hydrogen stops particles better). Water walls add up to 20 g/cm² from the
water you carry ([[Parts]]).

## Solar storms

A storm warning gives you about an hour. Press **Z** for the **storm shelter**: the crew moves behind the water and
fuel tanks (up to 15 g/cm²). That only works fully if the tanks sit right next to the crew cabin, which you set in
the [[Ship Builder]]. Storms fall with the square of your distance from the Sun (Law 6), and inside Earth's magnetic
field you get 5 % of the dose. An active magnetic shield cuts storms by 90 %.

## Reactors

A reactor's dose falls with distance squared and with the mass between it and the crew. Put the reactor at the far
end of the ship, behind the tanks and a truss, and the dose almost vanishes. The [[Ship Builder]] shows the number.

## Research

Shielding technologies: polyethylene, water walls and the active magnetic shield ([[Technologies]]).

## Radiation belts

Planetary magnetic fields trap protons and electrons in belts. Dose rates behind 2 g/cm² of shielding:

| Where | Dose |
|---|---|
| Low Earth orbit (under the belts) | none from the belts |
| Earth's inner belt (1.6 Earth radii from the centre) | ~90 mSv/day |
| Earth's outer belt (4.5 radii) | ~80 mSv/day (electrons: a little shielding stops most) |
| Crossing both on the way out | ~2 mSv |
| Jupiter at Io's orbit | ~33 Sv/day: lethal within hours |
| Europa / Ganymede / Callisto | ~5 Sv/day / ~0.24 Sv/day / ~0.5 mSv/day |
| Saturn (rings soak particles up) | ~7 mSv/day at most |

Hard protons are cut by shielding as e^(−ad/15 g/cm²), soft electrons as e^(−ad/1.5), Jupiter's very energetic
electrons only as e^(−ad/20). Alerts warn you when you enter a belt. Callisto is the safe place to park at Jupiter.

## The solar cycle

The Sun's activity rises and falls over about 11 years. Near solar maximum proton storms come about four times as
often as at minimum and are stronger, but the Sun's stronger magnetic field pushes galactic cosmic rays away: their
dose is about 25 % lower at maximum and 25 % higher at minimum. The game starts a little past maximum; the life
support readout (H) shows the activity and when the next maximum or minimum comes.

## Bit flips in the flight computer

A fast particle passing through a memory chip can flip a bit. In a radiation belt or a solar storm an ordinary flight
computer may crash and reboot, and the autopilot drops out (about one upset per 200 mSv/h of exposure per hour: rare
crossing Earth's belts, hourly near Io). A radiation-hardened computer (🏭 Fabricate → **FLIGHT COMPUTER**: special
chips, error-correcting memory, triple voting) shrugs them off.
