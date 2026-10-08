# Changelog

## 0.29.0 — the shared universe, the part designer, VR
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
