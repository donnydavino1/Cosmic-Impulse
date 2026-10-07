# Engines

*Generated from the game's own rules files, so the numbers are always the ones the game uses.*

An engine trades **thrust** (how hard it pushes) against **exhaust speed** (how much speed each kilogram of propellant buys).
Thrust = k × power ÷ exhaust speed, so for the same power a slow exhaust pushes harder, and a fast exhaust goes farther.
Delta-v = exhaust speed × ln(full mass ÷ empty mass) (the rocket equation; see [[The Laws of Stellar Impulse]]).

| Engine | Fuel | Exhaust speed | Specific impulse | Rated power | Thrust at rated power | Needs |
|---|---|---|---|---|---|---|
| 🔥 **Chemical rocket** | Rocket fuel | 4,410 m/s | 450 s | 1.2×10^8 W | 5.4×10^4 N | starting engine |
| ⚛ **Ion thruster** | Xenon | 2.9×10^4 m/s | 3,000 s | 5×10^4 W | 2.04 N | starting engine |
| 🌀 **VASIMR plasma engine** | Liquid hydrogen | 5×10^4 m/s | 5,100 s | 2×10^5 W | 4.8 N | Plasma propulsion (VASIMR) |
| ☢ **Nuclear thermal rocket** | Liquid hydrogen | 8,800 m/s | 897 s | 3×10^8 W | 6.8×10^4 N | Nuclear thermal propulsion |
| ⛵ **Solar sail** | none (sunlight) | 3×10^8 m/s | 3.1×10^7 s | 0 W | 0 N | Solar sails |
| ☀ **Magnetic-confinement fusion drive** | Deuterium | 1.5×10^7 m/s | 1.5×10^6 s | 1×10^9 W | 133 N | Magnetic-confinement fusion |
| ✴ **Antimatter photon rocket** | Antimatter fuel | 3×10^8 m/s | 3.1×10^7 s | 1×10^12 W | 3,340 N | Antimatter production |
| 🧲 **MPD thruster** | Liquid hydrogen | 4×10^4 m/s | 4,080 s | 1×10^6 W | 25 N | Magnetoplasmadynamic thrusters |
| 💥 **Inertial-fusion pulse drive** | Deuterium | 9×10^6 m/s | 9.2×10^5 s | 5×10^9 W | 1,110 N | Inertial-confinement fusion |
| 🌟 **Beamed-core antimatter drive** | Antimatter fuel | 9.9×10^7 m/s | 1×10^7 s | 1×10^11 W | 1,210 N | Beamed-core antimatter drive |

### 🔥 Chemical rocket
Burns hydrogen with oxygen; the fuel holds the energy and carries its own heat away. Strong thrust but slow exhaust (4.4 km/s), so fuel runs out fast.

### ⚛ Ion thruster
Electric: fires xenon ions at 29 km/s. Very fuel-efficient but gentle; 30% of its power becomes heat in the power electronics, so it needs radiators.

### 🌀 VASIMR plasma engine
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
