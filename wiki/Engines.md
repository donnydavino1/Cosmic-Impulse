# Engines

*Generated from the game's own rules files, so the numbers are always the ones the game uses.*

An engine trades **thrust** (how hard it pushes) against **exhaust speed** (how much speed each kilogram of propellant buys).
Thrust = k × power ÷ exhaust speed, so for the same power a slow exhaust pushes harder, and a fast exhaust goes farther.
Delta-v = exhaust speed × ln(full mass ÷ empty mass) (the rocket equation; see [[The Laws of Cosmic Impulse]]).

| Engine | Fuel | Exhaust speed | Specific impulse | Rated power | Thrust at rated power | Needs |
|---|---|---|---|---|---|---|
| 🔥 **Chemical rocket** | Rocket fuel | 4,410 m/s | 450 s | 1.2×10^8 W | 5.4×10^4 N | starting engine |
| ⚛ **Ion thruster** | Xenon | 2.9×10^4 m/s | 3,000 s | 5×10^4 W | 2.04 N | starting engine |
| 🌀 **Helicon magnetoplasma engine** | Liquid hydrogen | 5×10^4 m/s | 5,100 s | 2×10^5 W | 4.8 N | Magnetoplasma propulsion |
| ☢ **Nuclear thermal rocket** | Liquid hydrogen | 8,800 m/s | 897 s | 3×10^8 W | 6.8×10^4 N | Nuclear thermal propulsion |
| ⛵ **Solar sail** | none (sunlight) | 3×10^8 m/s | 3.1×10^7 s | 0 W | 0 N | Solar sails |
| ☀ **Magnetic-confinement fusion drive** | Deuterium | 1.5×10^7 m/s | 1.5×10^6 s | 1×10^9 W | 133 N | Magnetic-confinement fusion |
| ✴ **Antimatter photon rocket** | Antimatter fuel | 3×10^8 m/s | 3.1×10^7 s | 1×10^12 W | 3,340 N | Antimatter production |
| 🧲 **MPD thruster** | Liquid hydrogen | 4×10^4 m/s | 4,080 s | 1×10^6 W | 25 N | Magnetoplasmadynamic thrusters |
| 💥 **Inertial-fusion pulse drive** | Deuterium | 9×10^6 m/s | 9.2×10^5 s | 5×10^9 W | 1,110 N | Inertial-confinement fusion |
| 🌟 **Beamed-core antimatter drive** | Antimatter fuel | 9.9×10^7 m/s | 1×10^7 s | 1×10^11 W | 1,210 N | Beamed-core antimatter drive |
| ◎ **Hall-effect thruster** | Xenon | 1.9×10^4 m/s | 1,940 s | 2×10^4 W | 1.16 N | Hall-effect thrusters |
| ⚡ **Arcjet** | Liquid hydrogen | 1.2×10^4 m/s | 1,220 s | 3×10^4 W | 1.75 N | Arcjets |
| 🔆 **Solar thermal rocket** | Liquid hydrogen | 8,000 m/s | 816 s | 5×10^6 W | 1,250 N | Solar thermal propulsion |
| 🔴 **Gas-core nuclear rocket** | Liquid hydrogen | 3×10^4 m/s | 3,060 s | 5×10^9 W | 3.3×10^5 N | Gas-core nuclear rockets |
| 🌐 **Direct fusion drive** | Deuterium | 9.8×10^4 m/s | 9,990 s | 1×10^7 W | 204 N | Direct fusion drive |
| 🪁 **Electric sail** | none (sunlight) | 3×10^8 m/s | 3.1×10^7 s | 2×10^4 W | 0 N | Electric sails |

### 🔥 Chemical rocket
Burns hydrogen with oxygen; the fuel holds the energy and carries its own heat away. Strong thrust but slow exhaust (4.4 km/s), so fuel runs out fast.

### ⚛ Ion thruster
Electric: fires xenon ions at 29 km/s. Very fuel-efficient but gentle; 30% of its power becomes heat in the power electronics, so it needs radiators.

### 🌀 Helicon magnetoplasma engine
Electric: radio waves heat hydrogen into plasma, a magnetic nozzle shapes it: 50 km/s exhaust from hydrogen you can make from water.

Build: 300 kg iron, 100 kg nickel, 1 kg platinum, 50 kg silicates; 5×10^10 J of energy.

### ☢ Nuclear thermal rocket
A uranium reactor heats hydrogen to ~2,500 °C: 8.8 km/s with strong thrust. The propellant carries most of the heat away.

Build: 1500 kg iron, 300 kg nickel, 5 kg platinum; 1×10^11 J of energy.

### ⛵ Solar sail
A 10,000 m² mirror pushed by sunlight. No fuel, no power, tiny thrust that can only point away from the Sun. Useless in shadow.

Build: 150 kg carbon, 50 kg silicates; 2×10^9 J of energy.

### ☀ Magnetic-confinement fusion drive
Steady D–D fusion plasma held by magnets and bled out of a magnetic nozzle at 5% of light speed. Reliable but heavy; 15% of its power ends up as heat (radiation from the plasma).

Build: 5000 kg iron, 1000 kg nickel, 30 kg platinum, 500 kg carbon, 500 kg silicates; 1×10^12 J of energy.

### ✴ Antimatter photon rocket
Matter and antimatter annihilate into light, reflected out the back. Exhaust = light speed, the only way to 0.99c. Absorbed gamma rays heat the mirror.

Build: 40000 kg iron, 8000 kg nickel, 150 kg platinum, 3000 kg carbon, 4000 kg silicates; 1×10^15 J of energy.

### 🧲 MPD thruster
Magnetoplasmadynamic: a huge current through hydrogen plasma pushes it out with its own magnetic field. Megawatt-class electric thrust, but only ~50% efficient: very hot electrodes.

Build: 600 kg iron, 300 kg nickel, 3 kg platinum; 2×10^11 J of energy.

### 💥 Inertial-fusion pulse drive
Lasers implode deuterium pellets hundreds of times a second inside a magnetic thrust chamber (like Project Daedalus). Lighter and more powerful than steady fusion, lower exhaust speed (3% of c), harder on the hardware.

Build: 4000 kg iron, 800 kg nickel, 60 kg platinum, 800 kg silicates; 1.5×10^12 J of energy.

### 🌟 Beamed-core antimatter drive
Antiprotons annihilate on protons; the charged pions they make are steered out by a magnetic nozzle at a third of light speed. Much more thrust per watt than a photon rocket, lower top speed.

Build: 30000 kg iron, 12000 kg nickel, 300 kg platinum, 2000 kg carbon; 3×10^15 J of energy.

### ◎ Hall-effect thruster
Electric: a ring-shaped magnetic field traps electrons that ionise xenon and accelerate it to 19 km/s. Flown on hundreds of satellites: more thrust per watt than a gridded ion engine, a little less fuel-efficient.

Build: 80 kg iron, 30 kg nickel, 0.2 kg platinum, 20 kg silicates; 3×10^9 J of energy.

### ⚡ Arcjet
Electrothermal: an electric arc heats hydrogen to several thousand degrees before the nozzle: 12 km/s exhaust, simple and robust, but only about 35% efficient.

Build: 60 kg iron, 20 kg nickel, 20 kg silicates; 2×10^9 J of energy.

### 🔆 Solar thermal rocket
A 5,000 m² concentrator focuses sunlight onto a hydrogen heat exchanger: 8 km/s, almost twice a chemical rocket, with no reactor. Its power follows the sunlight: strong near the Sun, weak far out, nothing in shadow.

Build: 400 kg carbon, 300 kg silicates, 200 kg iron; 1×10^10 J of energy.

### 🔴 Gas-core nuclear rocket
Proposed: a ball of fissioning uranium gas, hotter than any solid could survive, heats hydrogen flowing around it. 30 km/s with huge thrust, but heavy, and some uranium escapes with the exhaust.

Build: 12000 kg iron, 3000 kg nickel, 40 kg platinum, 1000 kg carbon; 6×10^11 J of energy.

### 🌐 Direct fusion drive
Proposed: a compact fusion reactor (radio-frequency heated, in a magnetic mirror) whose exhaust is the thrust and which also makes electricity. About 98 km/s and megawatts: a fusion engine small enough for a spacecraft.

Build: 2500 kg iron, 600 kg nickel, 20 kg platinum, 300 kg silicates; 3×10^11 J of energy.

### 🪁 Electric sail
Proposed: kilometres-long charged tethers repel the solar wind's protons. No propellant; an electron gun keeps the tethers charged (20 kW). Thrust is 1 N at Earth's distance and falls only as 1/distance, so it keeps working far out; it can only push away from the Sun.

Build: 50 kg carbon, 30 kg iron, 10 kg silicates; 1×10^9 J of energy.
