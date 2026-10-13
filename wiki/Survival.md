# Survival

Your crew needs **oxygen, water and food**, a **cabin below 45 °C**, **CO₂ scrubbed** (which needs power), and
protection from **radiation**. The cockpit vitals strip shows each one:

| Vital | Danger |
|---|---|
| ❤ Crew | at 0 % the crew is lost |
| 🛡 Hull | at 0 % the ship is destroyed; BREACH leaks oxygen |
| 🫁 O₂ · 💧 Water · 🍞 Food | days left; running out hurts fast (oxygen) or slowly (food) |
| 🌫 CO₂ | toxic above 0.6 kg; builds up if the battery is empty |
| 🌡 Cabin | crew overheats above 45 °C |
| ☢ Dose | sickness above 1 Sv, death at 6 Sv; solar storms are the big risk |
| 🔋 Power · 🔧 Systems | life support stops without power; failed parts need spare kits |
| ⚠ Threats | incoming missiles, raiders, an orbit that hits the planet |

**Hitting the ground:** touching a planet or moon faster than **10 m/s** relative to its surface is a crash: the
ship is destroyed and the mission ends. Slower than that, you land (and can take off again).

**Solar storms** are announced about an hour ahead: press **Z** to shelter behind your water and fuel tanks, or
stay inside Earth's magnetic field. **Micrometeoroids** wear parts and sometimes breach the hull. Recycling life
support (research) turns water back into oxygen.

## Your crew (👩‍🚀 Crew, F3)

You fly with **two astronauts**, Ada Reyes and Kenji Sato. Everyone breathes, drinks and eats: per person per day
**0.84 kg oxygen, 2.5 kg water and 1.6 kg food** (regenerative life support recycles most of the water and oxygen).
You start with **a year of supplies for both** (615 kg oxygen, 1,830 kg water, 1,170 kg food), and the starter rocket
carries 9 tonnes of fuel so it can still escape Earth with all that aboard.

Each astronaut has one **duty**, and duties work on their own:

| Duty | What it does | Faster with skill |
|---|---|---|
| 🩹 Hull patching | seals micrometeoroid breaches with **hull patch kits** | 3 h per breach at Level 1, 36 min at Level 5 |
| 🔧 Repairs | repairs failed and worn parts and engines with **spare-parts kits** | 6 % of a part's condition per hour × Level |
| 🔬 Science | adds research points (needs power) | 0.5 per hour × Level |
| 🛏 Rest | the crew recovers health twice as fast | + Level |
| 🧭 Pilot | no automatic work; helps the crew recover | small bonus |

Ada starts on hull patching and Kenji on repairs, so breaches and breakdowns are handled for you as long as you have
kits. **Skill** (Level 1–5) grows with hours on a duty (120, 360, 840 and 1,800 hours), or **📚 Train** it now with
research points (30, 60, 120, 240 RP).

**Kits:** hull patch kits weigh 4 kg each (2.5 kg iron, 1 kg carbon, 0.5 kg silicates); spare-parts kits 14 kg. You
start with 8 patch kits and 6 spare-parts kits; make more in 🛠 → 🏭 Fabricate → Supplies.

### More astronauts, more duties

**➕ Recruit** a new astronaut in the Crew window while you are inside Earth's gravity zone: they are launched up to
you for 2 × 10⁹ J (it runs as a job in 🏭 Fabricate), arrive already at Level 2 in a speciality, and weigh 80 kg.
**Cabin space** comes from life support: open loop 4 people, regenerative 8, greenhouse 12. Every astronaut eats,
drinks and breathes, so supplies go faster with a bigger crew. **🏠 Send home** returns one to Earth (inside Earth's
gravity zone). Four more duties put a bigger crew to work:

| Duty | What it does (per Level of everyone on it) |
|---|---|
| 🏭 Fabrication | +15 % manufacturing power |
| ⛏ Mining | +15 % more of the rock you break off is collected |
| 🎯 Gunnery | +10 % weapon damage against ships and drones |
| ⛑ Medicine | heals 1 % per hour and clears radiation sickness faster |

**🧊 Hibernation** (technology *Crew hibernation*, 800 RP): the crew sleeps in suspended animation. Nothing is eaten
or breathed, nobody ages or takes radiation, duties stop and the ship powers down, so nothing wears out or breaks. It is
how a crew survives a slow trip to Proxima Centauri, which can take centuries ([[Relativity]]). Wake them (☀) to work or
fight; you can't hibernate during combat.

## Alerts never pause the game: the 🛟 safety slow-down

Warnings appear as notifications and the game keeps running. Instead, the **🛟 safety slow-down** (next to the time
controls, a switch on the physical console, or **F4**; on by default) watches for anything that will kill the crew
within **one game day**: running out of oxygen, water or food, an overheating cabin, a solar storm's dose, the hull
being destroyed, an orbit that hits the ground, an incoming missile. When it finds one, a red banner shows what and
when, and time slows to the fastest rate that still leaves you **about 5 real minutes** to deal with it. When the
danger is over, time goes back to the rate you had. In multiplayer the shared clock can't be slowed, but the banner
still warns you.

## Score, and a second chance

When the crew is lost you get a **score**: days survived, the farthest you got from Earth and the fastest you went,
how close you came to the Sun, technologies, discoveries, mined mass, contracts, raiders destroyed and crew training.
Your best score is kept in your browser. In single player you can **⏪ restart 24 hours earlier**: the game keeps a
snapshot about every game hour and takes you back to the one a day before, at the slowest time speed.

## Traits, morale and age

**Traits.** Every astronaut has one: *Steady hands* (+1 Level at repairs and hull patching), *Quick learner* (skills
grow 50 % faster), *Light eater* (20 % less oxygen, water and food), *Sharp eye* (+1 Level at gunnery and mining),
*Tinkerer* (+1 at fabrication and science), *Calm under pressure* (raises everyone's morale), *Field medic* (+1 at
medicine and rest) or *Ace pilot*. Ada Reyes has steady hands, Kenji Sato is a quick learner; recruits arrive with one.

**Morale (0–100)** sets how well everyone works: 50 % output at 0, full output at 100. It drifts toward a target the
Crew window explains: room to move (cabin space per person), danger alarms and warnings, low supplies, a hull breach,
poor health, someone on rest duty, a greenhouse, and calm crewmates. Below 25 you are warned.

**Age and the twin paradox.** Each astronaut's age counts only the time they spend awake on the ship clock. Near light
speed the ship clock runs slow ([[Relativity]]) and hibernation stops ageing, so after a fast trip the Crew window shows
how much younger they are than the calendar back home.

## Greenhouse crops

With the bioregenerative greenhouse installed, choose what grows in it (🏭 Fabricate → **GREENHOUSE CROPS**).
It always makes all the oxygen; the crop sets the food surplus, the LED power and the crew's mood. Replanting takes
two weeks, 40 kg of carbon and 200 kg of water.

| Crop | Food surplus per person per day | Lighting power | Morale |
|---|---|---|---|
| Potatoes and wheat (stock) | 0.3 kg | 6 kW | +8 |
| Algae tanks | 0.45 kg | 3.6 kW | −4 |
| Mixed garden | 0.12 kg | 7.5 kW | +16 |

Algae is the survival pick when power is short; the garden keeps a crew happy (and working faster) on long voyages.

## Weightlessness and lifetime dose

Without gravity, bones thin and muscles waste. Each astronaut has a **fitness** (100 % = as fit as on Earth) that falls
each month by 2.5 % with no exercise, 1 % with 1 hour a day and 0.25 % with 2.5 hours a day (the ISS routine, and the
game's baseline). Choose the schedule in 👩‍🚀 Crew: less exercise gives more time for duties, but low fitness slows all
work (× 0.6 + 0.4 · fitness) and hurts morale. **Thrust is real gravity:** while the engine pushes the ship at 2 m/s²
or more, fitness recovers by 3 % a month × (g / 9.81).

Every astronaut also carries a **lifetime dose** since joining the crew. The career limit is 600 mSv; each sievert
adds about 5 % lifetime risk of fatal cancer. Past the limit, morale drops.

## Medical events

About once every 18 months each astronaut gets a medical problem: a kidney stone (twice as likely when bones are losing
calcium in weightlessness), a dental abscess, a skin infection, eye swelling from fluids shifting to the head (SANS), a
burn from a hot coolant line, or (rarely) appendicitis. The patient is off duty until recovered, from 3 to 14 days.
A crewmate on medicine duty speeds recovery by 50 % per skill level and stops the serious ones from draining the
crew's health; without one, appendicitis is dangerous.

### Spin gravity

Turning the ship gives the crew centripetal gravity, g = ω²r (👩‍🚀 Crew → **Spin gravity**). Spinning the hull end over
end uses half the ship's length as the radius, so it needs a fast spin for little gravity; a 225 m tether with a
counterweight (400 kg of carbon, +500 kg) gives 1 g at about 2 rpm. Above about 4 rpm the inner ear rebels: dizziness
and lower morale. The spin stops while the engine burns, and spin gravity rebuilds fitness like thrust gravity.

### Acceleration limit

People tolerate about 1 g indefinitely, 2–3 g for hours lying in acceleration couches, and 6 g only for minutes. In
👩‍🚀 Crew choose the crew's limit (1, 2, 3 or 6 g; default 3): the engine is held to it even if the frame could take
more. Above 2 g the crew tires (health −1 % an hour for each g over 2). A hibernating crew is not limited.

Isolation also weighs on morale: once Earth is more than a light-minute away, calls home become exchanged recordings (morale −2, growing to −10 when Earth is light-days away).
