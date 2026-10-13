# Ship and Engineering

Open **🛠 Engineering** with **B** (phone: ☰ → Ship). Its tabs:

| Tab | What you do there |
|---|---|
| 🔧 Ship | installed parts, their condition, repairs (spare-parts kits) |
| 🏭 Fabricate | build parts from materials and energy |
| 🔬 Research | spend research points on technologies (37 of them) |
| 🚀 Engines | choose and size engines; power and mass trade off |
| 🔫 Weapons | build weapons, launch practice drones |
| ⛏ Inventory | materials, fuel, supplies |
| 📚 Codex | discoveries and records |
| 💾 Save | save slots and new game |
| 🧪 Testing | cheats: unlock everything, instant orders, free energy |

Everything has **mass**, needs **energy** to make, and most things need **materials** (iron, nickel, carbon,
silicates, platinum, water…), which you mine from asteroids or order from Earth while you're nearby.
The **Design Analyzer** explains what is limiting your ship (power, heat, structure, fuel) and why.

**Orders** take time to complete (fabrication draws power), unless *Instant orders* is on in 🧪 Testing.

**How many per click:** at the top of 🛠 Engineering (and in 🧱 Builder → Add a part) type how many you want, or
pick 1, 5, 10, 50 or 100: every Build, Get, Make and Order button then does that many at once (it stops if materials
run out and tells you how many it queued). Each engine's fuel also has an **Exact amount** box: type the kilograms
and press Enter.

## 📦 Cargo: everything on board

Press **]**, the **📦 CARGO** button in the top bar, or 🛠 → ⛏ Inventory → *Open the cargo manager*. It lists every loose
item you carry (propellants, mined materials, oxygen, food, water, kits, missiles) with its mass and share of the ship.
Type an amount and press **Drop** (or **All**) to push it out of the airlock: it keeps your exact velocity and drifts
along your orbit, so your path does not change, only your mass. A preview shows your Δv after the drop: throwing out
dead weight is the cheapest way to go faster. Dropping oxygen, food or water you need asks first. Below that, the
window lists what your built-in parts, engines, weapons, solar panels and crew weigh, and **what your ship is made
of**: the iron, nickel, carbon, silicates and platinum in its parts (from their recipes) plus what you carry.

## 📈 Flight recorder

Press **;** (or 🛠 → ⛏ Inventory → *Open the flight recorder*): your whole mission against game time in nine charts:
distance from the Sun, speed, altitude, battery, cabin temperature, radiation dose rate, propellant, hull and days of
supplies. When the record gets long, older parts are kept at lower resolution so everything fits. Hover a chart to read
the value at that moment.

## Cryogenic boil-off

Super-cold propellants slowly boil away as heat leaks into the tanks, and the gas is vented. 🛠 → 🚀 Engines & fuel →
**PROPELLANT TANKS** shows the losses per fuel and lets you refit the tanks. Rates are for pure liquid hydrogen at
Earth's distance; the heat leak scales as 0.2 + 0.8·(1 AU/distance)².

| Tanks | Boil-off | Cost |
|---|---|---|
| Multilayer insulation (stock) | 0.3 %/day | none |
| Sunshield + insulation | 0.05 %/day | 250 kg |
| Cryocoolers | 0 | 200 kg + 150 W per tonne of liquid hydrogen at 1 AU (falls back to 0.3 % without power) |

Share of each fuel that boils at that rate: liquid hydrogen 100 %, liquid deuterium and D–T 80 %, methane 25 %,
hydrolox 15 % (it is about 1/7 hydrogen), methalox 8 %. Xenon, krypton, argon, water and ammonia do not boil off.

## Captain's log

Press **'** (or 📜 in 🛠 → ⛏ Inventory). Every message the ship gives you is logged with the mission day, the crew's own
clock (ship time, which falls behind at relativistic speed) and where you were. Search it, write your own entries,
and save the whole log as a text file. The newest 600 entries are kept in saves.

The same panel shows the **tank volume** of every propellant aboard (liquid hydrogen 71 kg/m³, hydrolox ~360, methane 423, water 1,000, xenon ~1,600): hydrogen is so light that the same mass needs tanks fourteen times bigger than water.
