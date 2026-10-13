# Rocket Equation Lab

How fast can each engine get you, and how long does the burn take? Move the sliders: the left chart is the rocket
equation (speed gained for the fuel you carry), the right chart is the price in time (how long the engine must burn to
reach each speed). The engines are the game's own: the same exhaust speeds, thrust factors and power as in
[[Engines]]. [Open the lab on its own page](rocket-lab.html).

<!-- embed: rocket-lab.html -->

## What to look for

- **Diminishing returns.** Speed grows with the *logarithm* of the mass ratio: going from 2× to 4× your ship's mass in
  fuel adds far less than going from 0 to 2×. Only a faster exhaust raises the whole curve.
- **Efficiency costs thrust.** For the same power, thrust = k × power ÷ exhaust speed. A 15,000 km/s fusion exhaust
  sips fuel but pushes gently, so its burns take months or years; a gas-core nuclear rocket reaches 30 km/s in hours.
- **Engine size is time.** Burn time = fuel × exhaust speed² ÷ (k × power): double the power and the same burn takes
  half as long (in the game: 🛠 → Engines → enlarge the engine; it gets heavier and makes more heat).
- **The game can be slower than the lab.** The lab assumes full thrust. In flight, missing radiators (🌡 [[Heat and Radiators]]),
  too little electric power for electric engines, or the crew's g-limit hold the throttle down. The autopilot's trip
  estimate now includes this and tells you what is holding the engine back.

The dashed lines mark speed changes from low Earth orbit: 3.2 km/s to escape Earth, about 9 km/s to reach 0.2 AU from
the Sun, about 21 km/s to fall into the Sun (see [[Orbital Mechanics]]).
