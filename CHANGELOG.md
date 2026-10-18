# Changelog

## 0.4.0 — “Cinematic”: a new look, the rocket lab in the game, and the release in Settings (2026-10-17)
Version numbering: the previous release (0.36.0 in this file) was published as **v0.3.5**; this one is **v0.4.0**.
Physics are untouched: the physics fingerprint is still `e2a5a6c39fcc5854` (official), so v0.4.0 players can battle v0.3.5 players.
- **Cinematic look (new default, `1960-cinematic.js`):** a deep nebula sky baked once on the GPU (violet-blue cloud
  complex, a red emission cloud, a blue veil, dust lanes, embedded stars, faint galactic band), 70 bright foreground
  stars with soft glows and diffraction spikes, animated star surfaces (granulation on the Sun; a cracked, molten
  crust on red dwarfs) with coronas, a coloured nebula fill light and sky reflections on your ship, steady red/green/
  white running lights, lit windows on pressurised hull panels, finer city lights on Earth's night side, darker night
  sides. *Realistic* and *Stylized* looks are still one click away.
- **Lens and film effects (`2990-postfx.js`):** bloom, light rays from the brightest star (planets and your hull cast
  shadows into them), lens ghosts and halo, anamorphic streaks, edge colour fringing, vignette, film grain and a gentle
  grade. High / Low / Off (phones start on Low); grain and rays have their own switches.
- **Bridge interface (`css/400-bridge.css`, default):** a starship-console skin over the same HUD: dark glass panels with
  cut corners, condensed uppercase labels, tabular numbers, one accent colour per job. *Classic HUD* restores the old one.
- **📈 Rocket lab in the Engines tab** (`2672-engine-lab.js` component + `2673-engine-lab-ui.js`): the rocket-equation and
  burn-time charts, readout, comparison table and equations, fed live from your tuned engines, your engine sizes and
  your ship's mass and fuel, with *your ship* marked on both charts; ⤢ Full screen. Show the eight classics, the engines
  you have, or all 14 engines with propellant.
- **The same component in the wiki:** inlined (no iframe) on the *Engines* page (new section) and the *Rocket Equation
  Lab* page in all three languages; `rocket-lab.html` is now generated from it too.
- **Release in Settings:** 🎨 Customize & settings → ABOUT THIS RELEASE shows the version, name, release date, computer or
  phone build, and both fingerprints; the welcome screen shows the version. The build stamps `ORB_VERSION`,
  `ORB_RELEASED`, `ORB_RELNAME` from `package.json`; `ORB.version` follows it.
- **Graphics settings:** Look (cinematic / realistic / stylized), lens effects, light rays, film grain, interface. The old
  "Realistic look" switch is replaced; "Cinematic space debris" is now "Space debris around the ship".
- **Screenshots with real WebGL in the sandbox:** `python3 tools/smoke/shots.py <three.min.js r128>` (SwiftShader) takes
  ship, map, Sun, Proxima, nebula, flight deck, lab and settings shots. The 3D flight deck and planets have now been
  seen rendered for the first time.
- **Graphics polish (second pass, still v0.4.0):** real atmospheres on Earth, Venus, Mars, Titan and the giant planets
  (limb-brightened shells lit only on the day side, orange at the terminator; `1965-atmospheres.js`); fine surface relief on
  rocky worlds and swirling turbulence in gas-giant bands; Earth's city lights break into specks up close; planets beyond
  Earth are lit more dimly with distance from the Sun (softened inverse square), so Jupiter no longer glows like Earth.
  The Sun has finer granulation, rare sunspots with penumbrae and slowly turning corona streamers; red dwarfs too. A
  camera glare marks the Sun and stars on screen (blocked by planets and your ship), and light rays and flares now follow
  the active camera (ship view and cockpit, not only the map). Ships (`1966-cinematic-ship.js`): a shader exhaust plume
  (white-hot core, propellant colour, shock diamonds in chemical and nuclear-thermal exhaust, flicker), nozzle glow tied to
  the throttle, embossed hull panels, glinting solar panels, neutral steel lighting instead of a violet tint, and
  self-shadowing on High effects. Asteroids are rubble piles with craters and realistic dark albedo (Bennu is one of the
  darkest objects known). All visual: physics fingerprint unchanged.
- Wiki: *Customization* (release, graphics and interface), *Vision and Philosophy*, *FAQ*, *Rocket Equation Lab*, *Engines*
  in English, Spanish and Chinese. 121 new translations per language; both i18n audits at 0.

## 0.36.0 — mission design, living crews, atmospheres and radiation belts
- **🥩 Porkchop plot** (🧭 Navigate): departure day × flight time map of total speed change, each point an exact Lambert
  solution (universal variables), cheapest launch marked, contours every 1 km/s, hover or tap to read.
- **🗺 Mission planner**: chain stops (planets, moons, Pluto); Hohmann legs low orbit to low orbit with the Oberth effect,
  moons of other planets via circularising at the moon's distance; totals vs your ship's Δv and propellant left
  after each leg.
- **Flip-and-burn**: brachistochrone trip times for powerful engines (exact relativistic form, mass ratio needed,
  burn-coast-brake when propellant is short). **Lagrange points** for six pairs. **Almanac**: gravity, escape speed,
  day, orbit, temperature, atmosphere and light time for every body. **Comms**: solar conjunction blackout.
- **🌫 Atmospheres** (RULES `0110-atmosphere.js`): drag and Sutton–Graves entry heating at Earth, Venus, Mars, Titan
  and the giant planets: aerobraking and aerocapture; unshielded hulls burn above 40 kW/m², heat shields take 10 MW/m².
- **☢ Radiation belts** (RULES `2101-radiation-belts.js`): Earth's Van Allen belts (none in low orbit, ~2 mSv to cross),
  Jupiter's lethal belts (~33 Sv/day at Io, safe at Callisto), Saturn's weak ones; alerts. **Solar cycle**: 11-year
  activity, storms 4× as often at maximum, cosmic rays ±25 % (lowest at maximum). **Bit flips**: particles can crash an
  ordinary flight computer and drop the autopilot; build a radiation-hardened one.
- **👩‍🚀 Crew health in space** (RULES `2106-crew-health.js`): fitness lost in weightlessness, exercise schedule (0, 1,
  2.5 h/day) traded against duty time, thrust gravity and **spin gravity** (hull spin or a 225 m tether) rebuild it;
  lifetime dose per astronaut against the 600 mSv career limit with cancer risk; **medical events** (kidney stones,
  SANS, appendicitis…) with medics speeding recovery; **crew acceleration limit** (1–6 g); isolation morale with light
  delay to Earth.
- **⚛ Reactor power conversion**: thermoelectric 7 %, Stirling 25 %, Brayton 30 %, supercritical CO₂ 40 % for every
  fission reactor (same heat, different watts, mass and reliability). **Core life**: cores last 10 / 7 full-power
  years, then fade; order fresh ones from Earth.
- **Engines**: clusters of 1–4 engines (engine-out: a failure stops one, the rest push on), in-flight exhaust tuning for the helicon magnetoplasma engine (variable specific impulse, no rebuild);
  **bimodal** nuclear thermal and gas-core rockets that double as power reactors while coasting.
- **Tank volumes** per propellant (liquid hydrogen needs 14× the volume of water). **Fuel cells** (5 kW stacks: electricity and drinking water from rocket fuel), **hull coatings** (white paint, optical
  solar reflectors, gold foil: solar heat and burn limit), spectrometer shows asteroid gravity, escape speed and spin,
  and first clean spectra earn research points.
- **📜 Captain's log** (key '): every message with mission day, ship time and place; your own entries; save as text.
- **Orbit shadow** panel (shadow fraction asin(R/r)/π and the battery needed); the mission planner can write its plan
  into the captain's log.
- **Heat signature** panel: how far away your infrared glow can be seen. Save-slot dates no longer depend on the
  browser's language.
- Translations for everything new (audit opens the log, planner, porkchop, sick crew and reactor screens); wiki sections
  in Flying and Orbits, Orbital Mechanics, Radiation, Survival, Energy and Power, Heat and Radiators, Sensors and Radar,
  Asteroids and Mining, Solar System, Ship and Engineering, Engine Workshop.

## 0.35.0 — depth everywhere: engine workshop, new fuels, crew personalities, spectrometer, sail films and more
- **🔧 Engine workshop** (key [, top-bar button, Engines tab; RULES `0580-engine-design.js`): redesign every engine
  family. Fusion drives choose their reaction (D–D, D–T, D–³He, p–¹¹B) with real exhaust speeds, heat, neutron dose and
  plasma colour; ion/Hall thrusters choose xenon, krypton or argon; plasma engines hydrogen, argon or lithium; nuclear
  and solar thermal engines hydrogen, methane, ammonia or water (√(T/M)); chemical engines methalox. Tune exhaust speed
  against thrust, set core diameter and length (power scales with size), add a neutron shield, and pick the nozzle
  expansion ratio for chemical and thermal engines (bigger bell: faster exhaust and more thrust, heavier). Live animated cutaway
  with a pulsing plasma glow in the reaction's true colour (inertial fusion flashes at its pellet rate), Now vs This
  design table (exhaust, power, thrust, mass, waste heat, Δv, dose, wear), and live telemetry. Plumes and engine glow
  take the design's colour and size. 10 new fuels: D–T, ³He, boron, krypton, argon, lithium, methane, ammonia, water,
  methalox (multi-material fuel making).
- **Neutron dose from fusion engines** (falls with your shielding and the neutron shield) and engine wear by design.
- **🧭 Transfer windows:** Hohmann flight time, Δv from your orbit (Oberth included), arrival speed, phase angle now and
  needed, next window and synodic period for every planet. **Gravity assists:** turn angle and free speed change from a
  flyby of each planet, at your speed now and on a Hohmann arrival. **Comms:** light-speed delay to Earth and the data rate of X-band,
  Ka-band and laser links from a real link budget.
- **📈 Flight recorder** (key ;): nine charts of the whole mission (distance, speed, altitude, battery, cabin
  temperature, dose rate, propellant, hull, supplies) with hover read-out.
- **👩‍🚀 Crew personalities:** traits (steady hands, quick learner, frugal, sharp eye, tinkerer, calm, medic, ace pilot),
  morale with reasons (it sets how fast everyone works), biological age that runs on ship time (twin paradox shown).
- **🔬 Spectrometer** (key \): reflectance spectra of asteroids (hydrated minerals, olivine/pyroxene, metal, ice
  bands) with distance noise, plus the body's total mass and composition.
- **Pulse laser optics:** infrared, green or ultraviolet (shorter reach-limited by diffraction, less efficient) and the
  mirror diameter; reach = 5×10⁴ km·(D/0.5 m)·(1064 nm/λ).
- **Railgun slugs:** needle 0.5 kg at 16 km/s, standard 2 kg at 8 km/s or heavy 8 kg at 4 km/s (same 64 MJ); impact
  energy now uses the slug's real mass and relative speed; recoil and iron follow the slug.
- **Solar cell types and ageing:** silicon, triple-junction GaAs or thin-film perovskite; cells age with sunlight and
  proton storms; refurbish or re-cell.
- **Cryogenic boil-off:** liquid hydrogen, deuterium, methane and the mixtures slowly boil away (faster near the Sun);
  refit the tanks with a sunshield or power-hungry cryocoolers for zero boil-off.
- **Heat-pipe fluid:** potassium (900 K), sodium (1,200 K) or lithium (1,500 K) in every heat-pipe radiator.
- **Solar sail film:** aluminised polyimide, thin aluminised film or carbon microtruss, with real film temperature,
  closest safe distance to the Sun, tearing when overheated, and more sail area on demand. (Fixed: the sail engine
  had no sail area, so it gave no thrust.)
- **🌱 Greenhouse crops:** potatoes and wheat, algae tanks or a mixed garden (food surplus vs power vs morale).
- **Relativistic sky:** stars crowd forward and turn blue ahead, red behind (aberration and Doppler) at high speed;
  the flight deck shows time dilation γ.
- Translations for everything new; wiki: new Engine Workshop page, and sections in Survival, Flying and Orbits,
  Asteroids and Mining, Combat, Energy and Power, Heat and Radiators, Ship and Engineering, Relativity.

## 0.34.0 — sandbox, cargo manager, honest trip estimates, Rocket Equation Lab
- **Navigator bug fixed:** trip estimates promised e.g. "77 days" while a gentle or throttled engine spiralled around
  Earth for months or years. Estimates (planets, asteroids, orbit planner) now add the burn time at the push the engine
  can really give, after heat (radiators) and electric power limits; the trip check warns when the burns alone take more
  than 20 days and says what is holding the engine back; the autopilot line shows *engine held to X %* and why.
- **🧪 Sandbox mode** (RULES `2110-sandbox.js`, single player): every technology, engine and weapon unlocked; building,
  ordering and training instant and free (no materials, water, research points or energy used; battery kept full);
  Earth-only fuel, supplies and recruits available anywhere. Flying stays real physics. Welcome-screen button, 🧪 Testing
  toggle and a top-bar badge; saved with the game; no personal best; switched off automatically in multiplayer.
- **📦 Cargo manager** (key ], top-bar button, 🛠 → ⛏ Inventory; rules `2107-cargo.js`): every loose item with mass and
  share of the ship, drop any amount (kg, kits or missiles) through the airlock with a Δv preview (momentum conserved:
  the path does not change), what built-in parts weigh, and what the ship is made of (materials from part recipes).
- **Rocket Equation Lab** (`rocket-lab.html`, English/Español/中文): interactive speed-vs-fuel and burn-time charts for eight
  of the game's engines, embedded in a new wiki page (the wiki can now embed pages and link to them) and linked from the
  start page; a test keeps its engine numbers identical to the game's.
- Translations for everything new (the audit now opens the cargo window, sandbox and a slow-engine trip check); wiki:
  Getting Started (sandbox), Ship and Engineering (cargo), Flying and Orbits (trip estimates), Rocket Equation Lab.

## 0.33.0 — Proxima Centauri in under a day, no Andromeda, a far more realistic flight deck
- **Andromeda removed.** The interstellar destination is **Proxima Centauri** (4.25 light-years). Deep-space time speeds
  (1 s = 9.5, 95, 950 years beyond 2,000 AU from every star) stay, so any ship that can leave the solar system gets
  there in well under 24 real hours: about 17 minutes even coasting at 20 km/s, ~40 minutes for a fusion ship, seconds
  of coasting at 0.99 c (4.3 game years, 7.3 months on the ship clock). A test keeps it under 24 hours.
- **Cruise autopilot fixed:** it used to aim straight at the star from Earth orbit, so a gentle engine fell into the Sun
  and was flung out at a nonsense speed. It now climbs out of the Sun's gravity first (pushing along its motion), then
  accelerates until the propellant left is just enough to stop, steering out any sideways drift (aiming straight at
  the star made ships circle it forever), coasts, brakes, and on arrival settles into a circular orbit 1–2 AU from the star. The physics loop also stops a frame
  at a planet's or star's surface so a fast pass can never tunnel through it. The cruise dialog's estimate now includes
  the burns and heat throttling, and warns when heat would hold the engine back.
- **Hyper-realistic flight deck:** worn painted-metal panels with seams, fasteners and stencilled codes; bevelled
  display housings with bezel keys and reflective cover glass; guarded toggle switches, knurled knobs and backlit keys;
  a black side-stick in a rubber boot and a throttle; real-time **shadows** of the window frame across the console;
  sunlight only enters through the window; displays spill cyan light onto the console; metal reflects a live panorama of
  the cabin; the windscreen faintly reflects the lit displays and shows dust and scratches in sunlight; dust motes
  drift in sunbeams; film-like tone mapping; display glass with pixel rows and darker corners.

## 0.32.0 — a real flight deck, a bigger crew, and Andromeda in under an hour
- **3D flight deck** (new default cockpit style, `2666-flightdeck.js`): a modelled console under the window with three
  large live screens (FLIGHT, SENSORS, SYSTEMS), two touch panels (CREW, TACTICAL with a blinking master caution), lit
  keys, side button consoles, control stick and throttle. **Every screen is a mouse button**: SYSTEMS → 🌡 Thermal,
  CREW → 👩‍🚀 Crew, FLIGHT → 🧭 Navigation, TACTICAL → next target, SENSORS → next radar design. The deck replaces the
  floating widgets (🧩 Show widgets brings them back). Players on the old default are moved to it once, with a note.
- **Mouse access to F2/F3:** 🌡 HEAT and 👩‍🚀 CREW buttons in the top bar; THERMAL, CREW and DESIGNER buttons on the
  physical console.
- **Bigger crew:** ➕ recruit astronauts at Earth (2 × 10⁹ J, arrive at Level 2 in a speciality, 80 kg each), cabin space
  from life support (4 / 8 / 12), 🏠 send home. New duties: 🏭 Fabrication (+15 % manufacturing per Level), ⛏ Mining
  (+15 % collected), 🎯 Gunnery (+10 % damage), ⛑ Medicine (heals, clears radiation sickness). **🧊 Hibernation**
  (technology *Crew hibernation*, 800 RP): no supplies, no ageing, no wear while asleep.
- **Andromeda:** the galaxy is now a destination (2.54 million light-years). At 0.99 c the trip is 2.56 million game
  years and ~361,000 ship years — about **31 real days** at the old top time speed. New **deep-space time speeds**
  (1 s = 9.5, 95, 950 years) unlock more than 2,000 AU from every star, so the coast takes **~45 real minutes**.
  🧭 NAVIGATE → Andromeda (or Proxima) → **🚀 Interstellar cruise** runs a relativistic accelerate–coast–brake autopilot
  and shows game, ship and real time first. Deep-space dust, flares and warnings are quiet out there.
- Translations (es, zh) for everything new; the audit now also reads the deck's screens and the cruise dialog. Wiki:
  Cockpit and Displays (flight deck), Survival (recruiting, new duties, hibernation), Relativity (how long to
  Andromeda), Flying and Orbits (interstellar cruise), Heat and Radiators (mouse access), in all three languages.

## 0.31.0 — playtest fixes: heat, crew, no pausing, score, rewind
- **Heat was partly broken:** the starter ship made more heat in sunlight than its hull radiator could shed and slowly
  cooked itself; it now has 50 m² of body radiators (crew loop settles at 18 °C). Hot engines with no high-temperature
  radiators were silently throttled to ~0.005 % (fusion dumps 150 MW; a low-temp radiator sheds ~60 kW, so buying those
  did nothing): the game now says so, and points to the new **🌡 Thermal view (F2)**: a heat map of the ship, each
  loop's heat in / can shed / settling temperature / time to overheat, where the heat comes from, and a **radiator
  calculator** (engine, throttle, cabin limit → how many of each radiator, with *Build N*).
- **How many per click:** a quantity box in 🛠 Engineering and 🧱 Builder → Add a part (1/5/10/50/100 or any number)
  multiplies every Build, Get, Make and Order button; each fuel has an *Exact amount* box.
- **Crew (RULES `2105-crew.js`, 👩‍🚀 F3):** two astronauts with duties (hull patching, repairs, science, rest, pilot),
  skills Level 1–5 that grow with time on duty or by training with research points. Hull breaches are sealed
  automatically with new **hull patch kits**; failed and worn parts are repaired automatically with spare-parts kits.
  Supplies are per person: **you start with a year for both** (615 kg O₂, 1,830 kg water, 1,170 kg food), and the
  starter carries 9 t of rocket fuel so it can still escape Earth. Kits now weigh what they're made of (they counted as
  1 kg before).
- **Alerts never pause the game.** The **🛟 safety slow-down** (next to the time controls, console switch, F4; on by
  default) slows time when something will kill the crew within a game day, leaving ~5 real minutes, with a red banner,
  and restores the rate afterwards.
- **Score** on the game-over screen (days survived, farthest from Earth, fastest speed, closest to the Sun, technologies,
  discoveries, mining, contracts, raiders, crew training; best score kept). **⏪ Restart 24 hours earlier** in single
  player (snapshots about every game hour; slowest time speed).
- **No day/night strobe at high time speed:** lighting fades smoothly, and when the eclipse cycle is faster than a few
  real seconds the view shows the orbit's average light (softer shadows, dimmer city lights).
- Translations (es, zh) for everything new; the audit now also opens the Thermal, Crew, designer and safety screens.
  Wiki: Survival (crew, kits, safety slow-down, score, rewind), Heat and Radiators (Thermal view, worked fusion example),
  Ship and Engineering (quantities), Cockpit and Displays (no strobe), Controls (F2–F4), in all three languages.

## 0.30.0 — outposts, rendezvous, a 3D cockpit, and the exact relativity model
- **VR removed** (the owner doesn't want VR): `1960-vr.js` deleted, the render loop restored, its texts and wiki section gone.
- **Part designer** (F7): five new kinds. *Frames* (aluminium, carbon, titanium-steel; mass ∝ g-rating^0.6),
  *radiation liners* (aluminium or polyethylene, 300 kg per g/cm²), *sensors* (Doppler dish, phased array, lidar;
  range follows the radar equation, ∝ (power × aperture²)^¼, so a big dish really sees farther), *laboratories*
  (research ∝ mass^0.85) and *fabricators* (manufacturing power ∝ mass). The formulas reproduce the stock parts
  exactly (`tests/designer.test.mjs`). New official physics fingerprint.
- **Shared universe:** *outposts* (🛰): turn 4 t of materials into a station on your orbit that stays for everyone;
  dock to leave or take supplies (the server owns the stores, so nothing duplicates), private/public, dismantle.
  *Pilot-versus-pilot* hits, passed on by the server only between ships within 2,100 km (reports carried to a common
  time) and energy-capped. Other pilots' ships are carried along their orbits between reports and drawn **from their
  real layout** (also in two-player games). `tests/universe.test.mjs` covers outposts, hits and Kepler propagation.
- **Autopilot rendezvous** with anything orbiting the same body (outposts): a coasting transfer found by Kepler shooting,
  one burn, coast, gentle final approach, then holding in docking range without fuel. From 460 km behind in low Earth
  orbit: ~150 kg of chemical propellant instead of the whole tank. Fixed two timing bugs that affected every rendezvous
  (target time and half-kick velocity inside a physics step).
- **Relativity:** the ship clock now includes the weak-field gravitational term, dτ = dT/γ · (1 + Φ/c²) (the leading
  post-Newtonian clock correction); the 🕐 Clocks widget shows both factors. Sensor contacts are light-time delayed
  (shown where they were d/c ago; new `lt` field). Wiki *Relativity*: a full section on exactly how gravity and
  relativity are computed and what is left out (no post-Newtonian terms in the motion), in all three languages.
- **3D cockpit frame:** modelled window frame, pillars, glare shield, side walls, overhead switch panel, grab handles and
  HUD glass around the first-person view, lit by the real Sun (dark in a planet's shadow), Earthshine and instrument
  lights (red on critical alarms); head sway against thrust; shake from the engine and hits. 🎨 Customize → COCKPIT STYLE.
- 3D outpost model (turning habitat ring, solar wings, blinking docking lights); outposts on sensors and the overlay.
- Translations: autopilot stages and designer part descriptions are now translated too (they were English before).
- Wiki: Relativity, Multiplayer (outposts, combat, real ships), Ship Builder (designer kinds), Cockpit and Displays
  (3D frame), Sensors and Radar (light-time, designed sensors) in all three languages. Docs: UNIVERSE.md, PROTOCOL.md.

## 0.29.0 — the shared universe, the part designer
- **Shared universe** (`server/universe.mjs`, no dependencies; client `2850-universe.js`; `npm run universe`): one
  persistent solar system for everyone. One clock at the server's rate, every pilot's ship (3D and sensor contacts),
  shared asteroid mining, chat, rules fingerprints shared, world saved every 30 s and on shutdown. Protocol ORB-UNI/1
  in `docs/UNIVERSE.md`. Tested with a real server and two clients; `tests/universe.test.mjs` runs it in `npm test`.
- **Part designer** (F7, or 🧪 in the Ship Builder; RULES `0570-designer.js`): invent radiators (low-temperature,
  heat-pipe, droplet; optional carbon fins), batteries (Li-ion, solid-state, flywheel, supercapacitor), fission
  reactors (Stirling, Brayton) and ceramic armour of any size. Mass, materials (always summing to the mass), build
  energy, research and performance come from shared formulas that reproduce the stock parts exactly. Saved designs
  are real parts: build, mount, upgrade, repair; saved with the game. New official physics fingerprint.
- **Graphics:** in the realistic look, planets get surface relief (bump mapping) and Earth's oceans a sun glint
  (specular map). **Experimental VR:** a 🥽 Enter VR button in the cockpit when the browser supports WebXR.
- Wiki: Multiplayer (shared universe), Ship Builder (designer), Cockpit and Displays (VR) in all three languages.

## 0.28.0 — trip check and navigator search
- **Trip check** (`2650-trip-check.js`): before any autopilot trip (distances, asteroids, search results, orbit
  planner) the game estimates the propellant (or Δv) and days needed and compares them with your propellant, oxygen,
  water and food. If anything falls short, a window lists what is missing and asks: *Fly anyway* or *Cancel*.
- **Navigator search:** a search box in 🧭 NAVIGATE finds planets, moons, stars, asteroids (including the Kuiper belt)
  and another player's ship by name, in English, Español or 中文 (accents optional). Results: *Look*, *Fly here*,
  *Fly to its distance from the Sun*, *Rendezvous*.
- Wiki: Flying and Orbits in all three languages.

## 0.27.0 — raider tactics
- **Each raider class fights its own way:** interceptors make fast attack runs (in at 1.1 km/s, past you, out to
  about 9 km, and back); gunships hold their 12–18 km range and withdraw when below 35 % hull (with a message);
  missile boats back away to keep 60–80 km between you; drones keep circling. Simulated: interceptors swing between
  4 and 35 km, missile boats settle near 89 km, gunships hold 13 km.
- Wiki: Combat in all three languages.

## 0.26.0 — raiders you can tell apart
- **A 3D model per raider class:** interceptors are slim darts with swept wings, gunships are boxy armoured hulls with
  twin barrels, missile boats carry rows of missile tubes and a radar dish; drones keep their cone-and-fins shape.
  Running lights are softer in the realistic look.
- **Radar markers per class:** interceptor triangle, gunship square, missile-boat dotted diamond. The class is part of
  the ORB-TLM contact (`cls`) from sensor level 3 (worked out from mass and size), so better sensors tell you more.
- Fix: the sonar radar no longer errors in very small widgets.
- Wiki: Combat in all three languages; `docs/PROTOCOL.md` documents `cls`. New official physics fingerprint.

## 0.25.0 — raider classes
- Waves now mix four kinds of raider: **drones** (as before), **interceptors** (wave 2+: fast, fragile, close to
  2–4 km, rapid weak lasers), **gunships** (wave 3+: slow, 2.6× tougher, kinetic slugs from 12–18 km that don't fade
  with distance and can puncture tanks) and **missile boats** (wave 4+: stay 60–80 km out and launch missiles).
  A message lists each wave's mix; target labels and sensor contacts name the class.
- Wiki: Combat (raider classes) in all three languages.

## 0.24.0 — hide and repair
- **Raiders must find you:** active radar, a running engine or a shot in the last minute reveals you at any range; a
  quiet ship is only seen within 25 km. Without contact, raiders fly to where they last saw you and circle there,
  and they can't fire. Messages tell you when they lose and regain you.
- **Repair drones** (RULES, `1760-ops.js`; built in 🛸 Operations, needs *Autonomous robotics*): each fixes the most
  damaged part by 10 % of its condition per hour using spare-parts kits; failed parts work again above 60 %.
- Wiki: Combat (hiding) and Drones and Probes (repair drones) in all three languages. New official physics fingerprint.

## 0.23.0 — where hits land
- **Hits strike the outside of the ship** (RULES, `hitModule()` in `0550-layout.js`): each module is a target in
  proportion to its outer area (radiators count their panels); modules mounted beside a host cover 20 % of it each.
  A hit damages the module it strikes (condition, failure below 25 %), kinetic hits on the tanks spill 3 % of the
  propellant, and hits on the crew cabin hurt the crew. Messages say what was hit.
- **Ceramic-composite armour panels** (new part, needs *High-strength alloys*): absorb 60 % of a hit that strikes them;
  other shielding parts absorb 30 %. Mount them around what you want to protect.
- **Ship Builder:** the selected module shows its share of hits and its condition; damaged modules are drawn darker
  (side view and 3D modular hull).
- **README:** a ray-traced hero image (ship above Earth, `tools/render_hero.py --bg`), links to the
  `Cosmic-Impulse` website address.
- Wiki: Combat (where hits land, armour) in all three languages. New official physics fingerprint.

## 0.22.0 — the game is now Cosmic Impulse
- Renamed from Stellar Impulse to **Cosmic Impulse** (to stay clear of the 2011 game *Stellar Impact*): titles, the
  start page, the in-game guide, the wiki in all three languages (including the pages *The Laws of Cosmic Impulse* and
  *Build Your Own Cosmic Impulse*), the README, docs, the overview PDF, the arena and the tools.
- New file names: `cosmic-impulse.html`, `cosmic-impulse-mobile.html`, `dist/cosmic-impulse-arena.html`,
  `docs/Cosmic-Impulse-Overview.pdf`. The old `stellar-impulse*.html` and `orbital*.html` files are redirect pages, so
  old links and bookmarks still work.
- Unchanged on purpose: saved games and settings, multiplayer codes, and the rules (same official physics fingerprint:
  0.21 and 0.22 players can still battle). The GitHub repository name and website address are unchanged until you
  rename the repository.

## 0.21.0 — real propulsion concepts
- **Six new engines**, all real or seriously proposed designs, under generic names: *Hall-effect thruster* (xenon,
  19 km/s), *Arcjet* (hydrogen, 12 km/s), *Solar thermal rocket* (hydrogen, 8 km/s, power follows sunlight through a
  5,000 m² concentrator), *Gas-core nuclear rocket* (hydrogen, 30 km/s, huge thrust), *Direct fusion drive*
  (deuterium, 98 km/s, 10 MW) and *Electric sail* (no propellant, 1 N at 1 AU falling as 1/distance, 20 kW, pushes
  only away from the Sun). Six new technologies in the Propulsion branch. RULES: `DR`, `ENGR`, `solTh()`, e-sail in
  `thrustAcc()`/`sailF()`. New official physics fingerprint.
- **No trademarks:** the "VASIMR" engine is now the *Helicon magnetoplasma engine* and its technology *Magnetoplasma
  propulsion*.
- **Readable ship caption:** a dark translucent backdrop behind the ship-view caption (it was unreadable over large
  bright solar arrays).
- Wiki: new page *Propulsion Concepts* (real-world status of every engine, how to choose), generated Engines and
  Technologies pages, in all three languages.

## 0.20.0 — weapons and engines in the builder
- **Weapons are modules** (RULES, `0550-layout.js`): every built weapon is a module with its real mass. Turrets
  (mining laser, pulse laser, particle beam, missiles) mount beside a module (new ones go beside the first non-crew
  module); the **railgun** is a 6 m spinal module that always stays on the spine. They move your centre of mass and
  turn time like any module, and are drawn as turrets and rails in the builder preview and the 3D modular hull (the old
  free-placed turrets are only used for the classic hull shapes).
- **Engines at the tail:** unused engines now add their mass at the tail instead of mid-ship. The builder lists your
  engines with *Use* and *♻ Scrap*; the preview draws the spare engines as a cluster around the main bell.
- Wiki: Ship Builder (weapons and engines) in all three languages. New official physics fingerprint.

## 0.19.0 — the builder becomes the shipyard
- **Rendered preview** in the 🧱 Ship Builder: the draft drawn as a lit, 3D-looking ship (oblique view, light from the
  upper left): panelled hull with windows, gold-foil tanks, open trusses, radiator wings with coolant tubes, sensor
  dish, fabricator boxes, mounted modules on struts in front of and behind the spine, the engine bell and exhaust glow,
  Mk bands, and the selected module outlined. Updates live with every change.
- **🧩 Add a part** catalog in the builder, by category, with mass, materials, energy and required research:
  *Build* (to the tail), *Build beside* the selected module, or *Build a mirrored pair beside* it; parts are mounted
  there automatically when they finish (RULES: `job.place` in `0550-layout.js`). *♻ Recycle* the selected part.
- **Δv with this fuel** row: your current engine's Δv with the draft's mass.
- **3D textures** (realistic look): panelled hull with seams, rivets and wear on the crew cabin, labs and white tanks;
  crinkled gold foil on insulated tanks. Procedural, no image files.
- Wiki: Ship Builder (catalog, pairs, preview) in all three languages. New official physics fingerprint.

## 0.18.0 — the wider Solar System, the Sun's heat, geostationary orbits
- **New worlds** (RULES, `0100-physics.js`; existing indices unchanged): Uranus, Neptune, Pluto; moons Phobos, Deimos,
  Io, Europa, Ganymede, Callisto, Enceladus, Rhea, Titan, Triton, Charon; and **Proxima Centauri** (4.25 light-years)
  with Proxima b. Real masses, radii, orbit sizes and rotation periods; painted textures for the major ones.
- **Real small bodies** (`0200-render.js`, appended so saves keep their mining): Apophis, Bennu, Ryugu, Eros, Itokawa,
  Didymos; Ceres, Vesta, Psyche; Kuiper belt Eris, Makemake, Haumea, Quaoar, Gonggong, Arrokoth, Albion and 12 more;
  Sedna. New icy **I-type** composition (55 % water ice).
- **The Sun's heat:** sunlight heats the low loop in proportion to the ship's side-on size; beyond 25 kW/m² it burns the
  hull. New parts: *Multi-layer sunshade* (blocks 95 %, survives 80 kW/m²) and *Carbon-carbon heat shield* (99.5 %,
  1.2 MW/m²).
- **Kuiper belt and Oort cloud debris:** many more impacts, and each one damages the hull (Whipple shield stops 90 %).
- **Orbit planner** (F6, or in 🧭 NAVIGATE): geostationary, geosynchronous or custom circular orbit at any distance
  from the centre of the body you orbit, with period, speed and Δv; the autopilot flies it (`apOrb`). Tested: from low
  Earth orbit to 42,039 km, eccentricity 0.005.
- Probes can visit Europa, Titan, Uranus, Neptune and Pluto. Wiki: Heat and Radiators, Asteroids and Mining, Orbital
  Mechanics, and the generated Solar System page, in all three languages. New official physics fingerprint.

## 0.17.0 — the physical cockpit
- **Physical cockpit** (new default; 🎛 *Physical controls* button in the cockpit view, or 🎨 Customize → COCKPIT
  STYLE; `2630-physical-cockpit.js`, `css/220-physical-cockpit.css`): an instrument console instead of pop-up panels.
  Caution/warning annunciator with 12 lamps and a blinking master caution, LCD clock and altitude; six analog gauges
  (velocity, battery, propellant, oxygen, cabin temperature, radiation dose) with needles and red zones; a round CRT
  radar scope (sonar or 3D); guarded toggle switches (stabilizer, shelter, radar active/passive, thrust mode, music)
  with lamps; a time-warp knob; back-lit weapon and ship buttons and a big FIRE button. Brushed metal, screws, glass
  glare and lit plastic are drawn in CSS and SVG. Every control calls its key's action; every reading is the same
  number the panels show. Translated, including the gauge faces.
- **Earth at night:** city lights on the dark side in the realistic look.
- Wiki: *Cockpit and Displays* explains the physical cockpit in all three languages.

## 0.16.0 — active and passive sensing, drag-and-drop builder, Mk bands
- **Active / passive sensing** (key 6; RULES in `2550-sensors.js`): active radar (default) has full range and
  precision, uses 2 kW and can be heard; passive listening has about a third of the range and 4× the error, but hears
  transmitters (raiders, active players) from 1.5× the active range. A quiet ship (passive, engine off) is seen by others
  only within half their range, and raiders lock onto it far less often. Multiplayer sends each ship's mode.
- **Ship Builder:** drag a module along the side view to reorder it, or above/below the line to mount it beside the
  nearest module; an end view shows the selected module's ring of mounted modules.
- **3D ship:** upgraded modules show one coloured band per mark; the ship rebuilds when marks or mounts change.
- Wiki (Sensors and Radar, Ship Builder) in all three languages. New official physics fingerprint.

## 0.15.0 — radial mounts and symmetry, sensor parts
- **Radial mounts** in the 🧱 Ship Builder: mount any module beside a spine module (its host) instead of on the spine.
  Mounted modules add no length (shorter ship: faster turns, higher g limit) but sit off-axis (adds to the moment of
  inertia). Several on one host spread evenly around it: 2 = mirrored pair, 3 = triangle, 4 = cross. Tanks mounted
  around the crew cabin give the best storm shelter (×1.15); a reactor mounted near the crew raises their dose.
  Side view draws mounted modules above/below their host; the 3D modular hull places them around the spine with struts.
  Saved designs remember mounts. Rules: `layMetrics(order, rad)` in `0550-layout.js`; state `s.lay.rad`.
- **Sensor parts** (new category 📡 Sensors): *Doppler radar dish* (level ≥ 2), *Phased-array panel* (≥ 3),
  *Lidar and spectrometer turret* (≥ 4). Your sensor level is the better of research and parts; upgrading a sensor
  part to Mk III and Mk V adds a level each time. The 3D hull shows a dish.
- Builder selection is by module (not position), so mounted modules can be selected and moved.
- Wiki: Ship Builder (mounting), Sensors and Radar (sensor parts, sonar/3D), Upgrades (sensor row), all three languages.
- New official physics fingerprint.

## 0.14.0 — cockpit styles, sonar and 3D radar, part upgrades, realistic Earth, deeper wiki
- **Cockpit styles** (🎨 Customize → COCKPIT STYLE; `2620-cockpit-styles.js`, `css/210-cockpit-themes.css`):
  *Realistic* (new default: matte instrument panels with bezels and screws, a window frame with pillars), *Neo glass*,
  *Military* (olive and amber), *Retro* (green phosphor with scanlines) and *Classic*. Moddable with `ORB.cockpit`.
- **Radar** (`2555-radar-plus.js`): *sonar*, a rotating beam like an old submarine radar where each contact only
  updates as the beam passes and then fades (better sensors turn it faster); *3d* (new default), contacts at their true
  height with range rings, height stems and motion trails, drag to turn.
- **Part upgrades Mk I → Mk V** for every installed part (`0560-upgrades.js`, RULES): frames +15 % g, storage +20 %,
  generators +15 % power and −15 % radiation, radiators +15 % area, labs +25 % research, fabricators +25 %, and more.
  Costs materials (built into the part, so it gets heavier: Law 3) and energy; Mk III/IV/V need 8/12/16 technologies.
  Upgrade from the 🧱 Ship Builder. New official physics fingerprint.
- **Realistic Earth:** sharper 2048-pixel surface in the realistic look, deep navy oceans, darker varied land, deserts,
  mountains and ice.
- **Cockpit de-cluttering:** no duplicate objective panel, weapon line and hints moved clear of the widgets, the left
  button column moves below widgets that would cover it, ship-view caption kept between the side panels.
- **Wiki:** 33 pages per language (new: *First 10 Hours*, *Upgrades*, *Cockpit and Displays*).
- Translations: also covers locked-state texts ("Research first: …", "Not built. Research … first.").

## 0.13.0 — crashes end the game, more radio, music on
- **Crashing is game over:** touching a planet or moon faster than 10 m/s relative to its surface destroys the ship
  and shows the Mission lost screen (reason, game time, records), instead of the ship freezing on the surface.
  Slower touchdowns are landings. The rule lives in `groundContact()` in `2100-survival.js` (RULES): new official
  physics fingerprint. The Mission lost screen is now translated too.
- **Space radio:** four new channels, all generated live: *Orbital Lounge* (electric-piano chords, walking bass),
  *Ion Trance* (four-on-the-floor, arpeggios), *Starlight Lullaby* (music box) and *Red Giant* (slow heavy drone).
- **Music on from the start:** Deep Drift plays from the first click or key press (browsers block sound before
  that). Channel, on/off and volume are remembered.

## 0.12.1 — layout fixes on laptop screens
- Ship-view caption no longer runs over the ENGINEERING / GUIDE / MULTIPLAYER / NAVIGATE buttons: it sits below them,
  wraps to a fixed width, and hides on screens narrower than 1,100 px.
- Weapon cards and the weapon status line now stay above the bottom button rows however many rows they wrap into
  (checked at 1280×720, 1366×768, 1600×900 and 1920×1080, in ship view and map view).

## 0.12.0 — everything in three languages
- **Full translation:** every window, tab, tooltip, readout, alert, notification, discovery, contract, the phone menu
  and pad, canvas text (radar, graphs) and every data name and description (29 parts, 37 technologies, 10 engines,
  5 fuels, 5 weapons) now appear in Español and 中文: about 1,200 strings per language (was 300).
- **Translator:** `{#}` placeholders that match only numbers, patterns bucketed by prefix, a cache (≈12 µs per new
  string), whole-word phrase matching (fixes "Mined" → "Extraed"), multi-line readouts translated line by line,
  canvas `fillText` translated.
- **Coverage tool** `tools/i18n-audit.py` (`npm run i18n`): headless run of both builds in English, every window and
  Engineering tab, plus every message template extracted from the code; reports what each language still lacks.
  Both builds report 0.
- **Wiki:** generated Engines, Fuels, Parts and Technologies pages are now translated too (names, descriptions,
  materials, section headings); the "names stay in English" note is gone.
- **Ship Builder:** 💾 saved designs (name a draft, load it later onto any ship with the same kinds of parts).

## 0.11.0 — Stellar Impulse: modular builder, realistic look, a deeper wiki
- **Name:** the game is now simply **Stellar Impulse** (no "Project").
- **🧱 Ship Builder** (key 7; new RULES module `0550-layout.js`, UI `2595-builder-ui.js`). Every part is a module
  on the spine (plus tanks and 5 m iron trusses). The order sets the centre of mass and moment of inertia → 180°
  turn time (two 220 N RCS) → railgun re-aim time; length → frame g limit (rated to 25 m); distance and mass
  between crew and reactors → reactor dose (shadow shielding); tanks next to the crew → storm shelter.
  Side-view schematic, Now vs Draft comparison, refit as a fabrication job. Saved with the game.
  New official physics fingerprint `a4cdd96a769baf8b`.
- **Modular 3D hull:** hull shape *Modular* (default for new players) builds the ship from the layout at real
  sizes: crew cabin with windows, foil and white tanks, trusses, reactors with shadow shields, radiator wings.
- **Realistic look** (default; `1950-realism.js`): filmic tone mapping, one hard sunlight, nearly no fill light,
  physically based materials without outlines or glowing paint, a faint Milky Way instead of the coloured nebula,
  no cinematic debris, softer planet halos. 🎨 Customize → STYLE → *Realistic look* switches back. New default
  style *Pathfinder*.
- **Wiki:** 30 pages per language (8 new: Vision and Philosophy, Ship Builder, Orbital Mechanics, Relativity,
  Heat and Radiators, Radiation, Asteroids and Mining, Solar System generated from the physics table). A cover on
  Home with a button straight to **Vision and Philosophy**; sidebar grouped into sections; breadcrumbs; every page
  ends with "more in this section", "pages that link here" and previous/next; the first mention of any page's
  topic is linked automatically (~300 extra links per language).

## 0.10.0 — mining drones and science probes
- New RULES module `1760-ops.js` and 🛸 **Operations** window (key 8; phone: ☰ → Ship). New official physics
  fingerprint `901d5a36611fb8e4` (0.9 and 0.10 players can't battle each other: update both).
- **Mining drones** (tech *Autonomous robotics*, 60 RP): 40 kg each, built from exactly 40 kg of materials. Deploy to
  an asteroid within 50 km; they fly at 20 m/s, dig 18 kg/h each, return with 50 kg, ore split by the asteroid's
  composition, then recharge from your battery (1.5 MJ/kg). Recall any time. Lost if you fly more than 100 km away.
- **Science probes** (tech *Deep-space probes*, 100 RP, needs Onboard laboratory): 90 kg each; take up to 40 kg of
  xenon from your tank. Trips are Hohmann transfers (moons: around their planet; nearby worlds: straight shot);
  launching from low orbit uses the Oberth effect. Data returns at light speed; first data from a world pays most.
  The launch pushes your ship back (momentum).
- Contracts: *Send a science probe to …* and *Haul … kg of ore with mining drones*.
- `ORB.emit('job:done', job)` when a manufacturing job finishes; saves include drones and probes.
- Wiki: new page *Drones and Probes* (3 languages), laws table row (Oberth effect), 37 technologies.
- Tests: built mass equals material mass; Earth–Mars Hohmann numbers; new technologies.

## 0.9.0 — renamed to Project Stellar Impulse
- The game is now **Project Stellar Impulse** (short: Stellar Impulse; formerly Orbital). Titles, welcome screen,
  wiki (all three languages), README, docs, start page, overview PDF and the arena were renamed.
- New file names: `stellar-impulse.html`, `stellar-impulse-mobile.html`, `dist/stellar-impulse-arena.html`,
  `docs/Stellar-Impulse-Overview.pdf`; wiki pages *The Laws of Stellar Impulse* and *Build Your Own Stellar Impulse*.
  `orbital.html` and `orbital-mobile.html` remain as tiny redirect pages so old links and bookmarks still work.
- Kept on purpose (so nothing breaks): saved games and settings (`orbital-*` browser storage keys), multiplayer
  room and invite codes (`orbital-` peer prefix, `ORBITAL-INVITE:`/`ORBITAL-REPLY:`), the arena rule-set id, and all
  RULES modules, so the official physics fingerprint is unchanged (`66deaeb82b8cd26e`) and older 0.8 players can
  still battle 0.9 players. "Orbital factory" (a technology) keeps its name: it describes a factory in orbit.

## 0.8.0 — the whole wiki in three languages, translated messages, a website
- Wiki: all 21 pages in Español and 中文 (12 hand-written pages translated; Engines, Fuels, Parts, Technologies
  generated per language with translated headings, intros and columns). Sidebar titles, browser tab title, wiki
  name, search box and "no match" text now follow the language. A ▶ Play button at the top of the sidebar.
- Game: translator understands `{}` patterns, so messages built at run time translate too: combat (waves, missiles,
  kills, bounties, weapon warnings), contracts (titles, accepted, complete, capsule), research, storm shelter,
  fabrication warnings, style sharing. 195 strings per language.
- Website: `.github/workflows/pages.yml` publishes the start page, both builds and the wiki to GitHub Pages on every
  push to `main`; start page links each wiki language; README lists the addresses.
- Tests: every wiki page translated with a title; sidebar titles in the built page; translator patterns.

## 0.7.0 — English, Español, 中文
- Language system (`0060-i18n.js`, client-only, physics fingerprint unchanged): dictionaries in `game/i18n/es.json`
  and `zh.json` (143 strings: every key action, main buttons, tabs, vitals, weapon bar, phone menu, contracts board),
  on-screen text translated live, switch from the welcome screen, 🎨 Customize → LANGUAGE, F8, or `?lang=es`.
  Auto-detects the browser language on first run. Switching back to English restores the original text.
- Wiki in three languages with a switch in the sidebar: Home, The Laws of Orbital, Getting Started, Build Your Own
  Orbital translated; Controls generated per language; other pages fall back to English with a notice.
- Tests: every key-action label must be translated in each language; translated wiki links must resolve.

## 0.6.0 — the Laws, contracts, data-driven wiki
- **The Laws of Orbital** (`wiki/The-Laws-of-Orbital.md`, `docs/LAWS.md`): ten rules everything follows, where each
  lives in the code, and a table of behaviour that emerges from them.
- **Contracts** (`1750-contracts.js`, key 9, RULES): procedurally offered missions (orbit raising, escape, visit a
  world, asteroid survey, mining, bounty, water delivery, Sun dive, light-speed trial). Rewards obey the laws:
  research by radio, energy by power beam (battery room only), matter by supply capsule that docks only inside
  Earth's gravity zone. Saved with the game.
- **Generated wiki pages** from the rules files: Engines (thrust, exhaust speed, Isp), Fuels, Parts (29), Technologies
  (35), via `tools/game-data.mjs` (runs the RULES modules in a sandbox). Wiki now 21 pages.
- New official physics fingerprint `66deaeb82b8cd26e`; tests for game-data extraction.

## 0.5.0 — wiki, AI-ready docs, fair play between customised clients
- Player wiki: 15 pages in `wiki/` (Controls generated from the game's action table), built into a single
  offline `wiki.html` with sidebar and search; published; linked from the welcome screen and F1.
- `AGENTS.md`: the brief a player hands to their AI (what to change, what not to, how to verify).
- Rules/client split: `game/manifest.json` lists RULES modules; new physics fingerprint `ORB_RULES_FP`;
  `game/official-rules.json` + `--release`; the build reports whether you're on official rules.
- Multiplayer fair play: `hello` carries the physics fingerprint; battles only when rules + physics match;
  receiving games ignore hits otherwise; status shown in 🌐. Two new checks in `mp_test.py` (18 total).
- `docs/FAIR-PLAY.md`; tests for wiki links, controls coverage, referenced docs, manifest.

## 0.4.0 — multiplayer documented and tested, hardpoints
- `docs/MULTIPLAYER.md`: hosting, joining, manual (serverless) connection, own matchmaking server, what is shared,
  troubleshooting, testing.
- `tools/smoke/mp_test.py`: real two-browser WebRTC test (desktop host + phone guest) through the manual-connection
  buttons: 16 checks, no internet needed.
- Ship messages now carry style (incl. trim/glow/panels) and a ledger summary; the other player's sensor contact
  shows mass, composition, weapons and missiles if your sensor tier is high enough.
- `hello` also compares code fingerprints (ℹ note if builds differ, ⚠ only if rules differ).
- Self-hosted matchmaking via `?peerhost=…&peerport=…&peerpath=…&peersecure=0`.
- Hardpoints (`2580-hardpoints.js`): move, rotate and resize the antenna and each weapon turret; saved and shared
  with your style (ORB-SHIP/1).

## 0.3.0 — modules, protocols, sensors, styles
- Game split into `game/` modules; `tools/build-game.mjs` builds desktop + phone from one core; code fingerprint `ORB_FP`.
- `CONTINUE.md` handoff for multi-session development; `docs/PROTOCOL.md`, `docs/MODDING.md`, new `docs/ARCHITECTURE.md`.
- Module bus `ORB` (frame / ui / ship:build hooks) and public `ORB.api` (state, ledger, contacts, radar, style).
- Ledger of conserved quantities: mass by element, energy by store, momentum, both clocks.
- Sensor tiers by research, ORB-TLM/1 contacts with fidelity L1–L5, 5 radar designs, custom radar registration,
  📡 Sensors cockpit widget, mini radar on phone.
- Ship exterior grows with upgrades (antenna by sensor tier, rank trim per 7 technologies); 6 style presets,
  trim and glow options, style JSON copy/load.
- Neo glass cockpit theme (toggle in 🎨 → COCKPIT); multiplayer hello now carries the code fingerprint.

## 0.2.x — playable sandbox (earlier chat)
- Sandbox became the main game; combat with raiders; painted planets and debris; vitals strip; phone build;
  instant orders and unlock-all for testing; chemical start that escapes Earth.
