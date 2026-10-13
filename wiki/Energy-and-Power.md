# Energy and Power

Energy is the currency of Cosmic Impulse: it buys panels, fuel, parts, research and weapon shots.

- **Solar panels** collect sunlight: about 1.36 kW per m² at Earth, falling with the square of distance from the Sun
  (4× less at twice the distance). Panels work far better closer to the Sun, and poorly past Mars.
- **Batteries, flywheels, supercapacitors** store it, with different energy-per-kilogram and power limits.
- **Reactors** (fission, then bigger) give steady power anywhere, even in shadow or far from the Sun, but add
  heat and radiation.
- **Heat** must be radiated away. Every watt you use ends up as heat; radiators cost mass. If the cabin passes
  45 °C the crew starts to suffer.
- Lasers, particle beams and electric engines all draw from the same power bus. The 📈 graphs in the cockpit show
  power made versus used.

## Solar cell types and ageing

🛠 → 🏭 Fabricate → **SOLAR CELL TYPE**. *Silicon* (stock: 0.2 kg/m², ages about 0.5 % a year at 1 AU), *triple-junction
GaAs* (30 % more power per m², 0.35 kg/m², twice as tough: what real spacecraft fly) or *thin-film perovskite* (a quarter of
the mass, two-thirds of the power, ages about 3 % a year). Cells age faster closer to the Sun (∝ 1/distance²) and 20×
faster during a solar proton storm; your panels' power drops with them. *Refurbish the cells* to restore full power, or
re-cell every panel with another type (both are fabrication jobs).

## Reactor power conversion

A fission reactor makes heat; a converter turns part of it into electricity and the rest goes to the radiators. 🏭
Fabricate → **REACTOR POWER CONVERSION** refits every fission reactor (fusion reactors keep theirs). The reactor's heat
output stays the same, so a better converter gives more watts and less waste heat.

| Converter | Efficiency | Mass | Failures |
|---|---|---|---|
| Thermoelectric | 7 % | ×0.85 | ×0.1 (no moving parts) |
| Stirling (small reactor's stock) | 25 % | ×1 | ×1 |
| Brayton (megawatt reactor's stock) | 30 % | ×1.1 | ×1.2 |
| Supercritical CO₂ | 40 % | ×1.2 | ×1.5 |

Example: the 1 MW reactor (3.3 MW of heat) gives 233 kW with thermoelectrics and 1.33 MW with supercritical CO₂.
Brayton and supercritical CO₂ need the Brayton-cycle reactor technology.

## Fuel cells

🛠 → 🔧 Ship → **FUEL CELLS**: hydrogen–oxygen fuel cells, as on Apollo and the Space Shuttle, combine the two halves
of hydrolox rocket fuel into electricity and pure water. Each 5 kW stack uses about 0.36 kg of propellant per kWh
(1.8 kg an hour) and gives back 0.32 kg of drinking water per kWh. About 60 % efficient: the rest is heat in the crew
loop. Useful in shadow, far from the Sun, or when a reactor fails, at the cost of rocket fuel.

**Core life:** a fission core burns its uranium. The small reactor's core lasts 10 full-power years, the megawatt reactor's 7; past that, output falls, reaching zero at 120 %. Order fresh cores from Earth while inside Earth's gravity zone (the table shows how much of each core is used).

**Orbit shadow:** 🛠 → 🔧 Ship → **ORBIT SHADOW** shows how much of each orbit you spend in the planet's shadow, asin(R/r)/π of it for a circular orbit with the Sun in its plane (39 % at 400 km above Earth: 36 minutes of every 92), and the battery energy needed to cross it.
