# CONTINUE HERE — handoff for the next session

> **To the developer:** start a new chat, attach this zip, and say **“go”** (or name a direction).
> **To Claude:** this file is your briefing. Read it fully, then `docs/ARCHITECTURE.md`. Do the work in
> **§4 NOW**, keep the rules in **§2**, and before you finish, rewrite **§3–§5** and add a `CHANGELOG.md` entry
> so the next session can continue. The developer may give no other instructions than “go”.

## 1. What Cosmic Impulse is

A physics-first spaceship game in the browser. A to-scale, N-body solar system with special relativity; you start
in low Earth orbit with a small ship and grow it by collecting energy, mining, researching and building. Raiders fight
you; another player can join peer-to-peer. Realism is the identity of the game (real units, real limits), but fun and
looks matter just as much: when they conflict, offer a toggle (see “Cinematic space debris”).

Developer’s standing wishes (from the chat that set up this workflow):
- **Depth in every direction**, especially: thousands of ways to customise the ship inside and out, with looks
  that change as the ship is upgraded; players able to make and share their own styles.
- **Two builds, always**: `cosmic-impulse.html` (desktop) and `cosmic-impulse-mobile.html` (phone). Same game core, byte for
  byte; only the platform layer (controls/layout) differs. Every feature must be reachable on the phone
  (the ☰ menu lists every key action automatically; new panels need a phone check).
- **Standard protocols**: everything another player or program can see is a documented, versioned format
  (`docs/PROTOCOL.md`): ship state, conserved-quantity ledger, sensor contacts. Hardware (like sensors) decides
  how much of it you receive; displays (like radars) are swappable designs over the same data. Grow this pattern
  to as many systems as possible (comms, engines, weapons, shields, power, life support…).
- **Modular ship exterior**: move parts on the hull, swap and upgrade them.
- **A cockpit that looks like real near-future sci-fi**, not 2000s UI.
- **Complexity from simple rules**: depth must come from the ten laws (`docs/LAWS.md`) interacting, not from special
  cases. Before adding a feature, say which laws it follows; rewards and costs must be physical (no matter from nowhere).
- **Players customise through their own AI, on shared rules**: a player reads the wiki, hands `AGENTS.md` and
  the docs to their AI, and gets the cockpit/controls/ship they want, while RULES modules stay identical so they can
  battle anyone on the official physics. Protect this split: keep moving outcome-deciding code into RULES modules
  and everything else out of them.
- **Three languages, always:** English, Español, 中文. New UI text needs entries in `game/i18n/es.json` and `zh.json`;
  new player-facing wiki pages should get `wiki/es/` and `wiki/zh/` versions (fallback to English is allowed but
  shows a notice).
- **Fast iteration across chats**: each session ends with an updated zip that contains everything, including
  this plan.

## 2. How to work (rules for every session)

1. **Edit modules, not the built files.** The game lives in `game/`:
   `game/shell.html` (HTML skeleton) · `game/css/NNN-*.css` · `game/js/NNNN-*.js` · `game/platform/{desktop,mobile}.html`.
   Files are concatenated in name order into ONE classic script, so all top-level names are shared globals.
   New feature → new numbered module (pick a number between neighbours, e.g. `2580-…`). Talk to other modules
   through `ORB.on/emit` hooks (see `0050-bus.js`) instead of editing them, where possible.
2. **Build:** `node tools/build-game.mjs` → writes `cosmic-impulse.html` + `cosmic-impulse-mobile.html` and prints the
   code fingerprint. Never hand-edit those two outputs.
3. **Test:** `npm test` (node; checks the build, that both outputs share the same core, that the script parses,
   plus the arena/kernel tests). If Python + Playwright are available, also run the browser smoke test:
   `python3 tools/smoke/smoke.py` (runs both builds headlessly with a stand-in for three.js; no network needed).
   The stand-in cannot draw 3D, so 3D looks must be checked by the developer: ask for a screenshot.
   **Multiplayer:** `python3 tools/smoke/mp_test.py` (two real browsers over WebRTC, desktop host + phone guest).
   Any change to `2800-multiplayer.js`, ship messages or protocols must keep it passing; update `docs/MULTIPLAYER.md`.
   **Rules vs client:** if you change a RULES module (`game/manifest.json`) on purpose, bump the version and run
   `node tools/build-game.mjs --release` to add the new physics fingerprint to the official list. If you didn't mean
   to change rules, the build line will say *not an official release*: undo that.
   **Wiki:** player-facing changes need a wiki update in all three languages (`wiki/*.md`, `wiki/es/`, `wiki/zh/`,
   plus `TITLES` for a new page; then `node tools/build-wiki.mjs`); publish
   `wiki.html` to https://claude.ai/artifact/PcSnhuD1QhDPnV3zuNw6eX.
4. **Ship it:** zip the whole repo (without `node_modules`), and if the Artifact tool exists publish both
   builds: desktop to https://claude.ai/artifact/QGZvo4jc4NrW7dqb9p7Nrv and phone to
   https://claude.ai/artifact/W72zFdpJBqPeqrWhXQzPtv (update in place with `url`).
5. **Keep the token budget sane:** read only the modules you change (`grep -n` to find things; modules are
   long single lines in places). Do not re-print big files. Prefer small, surgical edits with checks.
6. **Before finishing:** update §3 (state), §4 (now), §5 (next), `CHANGELOG.md`, and any doc whose facts you
   changed. Bump `package.json` version (minor for features).

## 3. Current state (v0.36.0, official physics fingerprint: see `game/official-rules.json`)

Working and tested in a headless browser:
- Solar system, relativity, orbit/XYZ flight, autopilot, chemical start that can escape Earth.
- Engineering (35 technologies, 29 parts, 10 engines), survival + vitals strip, raider combat, Neo cockpit,
  painted planets, debris.
- Platform: module build (`game/`), `ORB` bus/API, ledger, sensors + ORB-TLM/1, radar designs, upgrade-driven looks,
  styles + hardpoints (ORB-SHIP/1), rules/client manifest with physics fingerprint and official releases.
- Multiplayer: room codes, manual WebRTC, fair-play gating; two-browser test passes.
- v0.6: the ten Laws; contracts board with physical rewards (key 9); data-driven wiki generation.
- v0.7: languages in game (live switch, F8) and wiki.
- v0.8: wiki fully translated (21 pages × 3 languages, titles follow the language); `{}` patterns translate
  run-time notifications (combat, contracts, research, shelter, fabrication); GitHub Pages workflow (`website`).

- v0.9: renamed to **Cosmic Impulse** (formerly Orbital). Old `orbital*.html` files are redirects.
  Deliberately unchanged: `orbital-*` storage keys (saves), `orbital-` multiplayer peer prefix and `ORBITAL-INVITE`
  codes, RULES modules (fingerprint unchanged). One stale comment in `game/js/1750-contracts.js` still says
  "The Laws of Orbital": fix it the next time a rules release is made anyway (editing it changes the fingerprint).
  Published artifacts keep their URLs (now titled Cosmic Impulse).

- v0.10: mining drones and science probes (`1760-ops.js` RULES, `2590-ops-ui.js`, key 8), two contract types,
  wiki page *Drones and Probes*. Drones and probes have no 3D model yet (they are not drawn).

- v0.11: name is **Cosmic Impulse**; 🧱 Ship Builder (`0550-layout.js` RULES + `2595-builder-ui.js`, key 7) with
  layout-driven performance; modular 3D hull (`buildSpine` in `1300-ship-model.js`); realistic look by default
  (`1950-realism.js`, `REAL()`); wiki with sections, cover → Vision and Philosophy, auto-links, backlinks, 30 pages.
  **The realistic look and the modular 3D hull have not been seen in a real WebGL renderer yet** (the sandbox has
  no three.js): ask the developer for a screenshot of the 3rd-person view and tune lighting/exposure from it.

- **v0.12:** everything translated (≈1,200 strings per language; `npm run i18n` reports 0 for both builds), builder saved
  designs, translated generated wiki pages.

- **v0.13:** crash > 10 m/s = game over (`groundContact`, RULES); 8 radio channels; music on by default (starts on first input).

- **v0.14:** cockpit styles (default realistic), sonar + 3D radar (default 3d), part upgrades Mk I–V (RULES), realistic Earth texture, overlay fixes, wiki 33 pages.

- **v0.15:** radial mounts with even-spacing symmetry (`s.lay.rad`), sensor parts (Doppler dish, phased array, lidar) feeding `sensorTier()`.

- **v0.16:** active/passive sensing (key 6, RULES), builder drag-and-drop + end view, Mk bands on the 3D ship.

- **v0.17:** physical cockpit console (default; 🎛 button), Earth city lights. The console is HTML/SVG/CSS and was checked in screenshots at 1600×900 and 1280×720.

- **v0.18:** Uranus, Neptune, Pluto, 11 moons, Proxima Centauri + b; real NEAs, belt giants, Kuiper objects, Sedna; Sun heat + sunshade/heat shield; Kuiper/Oort debris; orbit planner (F6, `apOrb`).

- **v0.19:** builder rendered preview (canvas, verified in screenshots), part catalog with build-beside and mirrored pairs (`job.place`), recycle, Δv row; hull panel and foil textures in 3D (not seen in WebGL yet).

- **v0.20:** weapons are layout modules (`w:<id>`; railgun spinal), spare engines' mass at the tail, engine use/scrap in the builder.

- **v0.21:** 16 engines (Hall, arcjet, solar thermal, gas-core NTR, direct fusion drive, electric sail added); no trademarked names (keep it that way: generic engine names only).

- **v0.22:** renamed to **Cosmic Impulse** (old file names redirect). README links use the repository name `Cosmic-Impulse` (website https://donnydavino1.github.io/Cosmic-Impulse/). README hero image: `docs/images/cosmic-impulse-hero.jpg`, rendered by `python3 tools/render_hero.py 1600 660 --bg` (without `--bg`: transparent `cosmic-impulse-ship.png`).

- **v0.23:** hits land by exposure (`hitModule`), armour panels, damage visible; README hero image.

- **v0.24:** raiders search for a quiet ship (contact by emissions or < 25 km); repair drones.

- **v0.25:** raider classes (`RCLS` in `1800-combat.js`: drone, interceptor, gunship, missile boat).

- **v0.26:** per-class raider models (`mkRaider(o)`), radar class markers, `cls` in ORB-TLM from level 3.

- **v0.27:** raider tactics per class (attack runs, kiting, withdrawal) in `raidTick`.

- **v0.28:** trip check before autopilot (`apAsk`), navigator search (all languages).

- **v0.29:** shared universe server + client (ORB-UNI/1), part designer (RULES), planet relief/ocean glint. (WebXR VR was tried in v0.29 and removed in v0.30 at the owner's request: no VR.)

- **v0.30:** VR removed. Part designer: frames, radiation liners, sensors (range ∝ (P·A²)^¼ via `sensorSpec`), labs,
  fabricators (`tests/designer.test.mjs`). Shared universe: persistent **outposts** (server-owned stores, Kepler-propagated
  orbits `kepProp`), PvP hits range-checked by the server, pilots' ships propagated between reports and drawn from their
  real layout (`shipLay`/`laySafe`/`buildRemote`, also in two-player games). Autopilot **rendezvous** with targets in the
  same body's orbit (`apRdv`: Kepler shooting transfer, coast, final approach; key fixes: inside a physics step positions
  are at T+TDT and velocities half a kick behind). Ship clock includes the gravitational (1+Φ/c²) term; sensor contacts
  are light-time delayed. **3D cockpit frame** (`2665-cockpit3d.js`) lit by the real Sun/Earthshine with head sway and
  shake: composition checked with a Python preview only, **not yet seen in WebGL — ask for a screenshot**. Wiki
  *Relativity* has the exact gravity/relativity model (no PN for motion; 1PN clock term).

- **v0.31 (playtest fixes):** starter body radiators 50 m²; 🌡 Thermal view F2 (`2670-thermal-ui.js`, heat breakdown
  `s.hb` from `powerStep`); quantity per click (`QTY`, `buildN` in 1000); crew roster RULES `2105-crew.js` + UI F3
  (`2675`), patch kits `s.res.patch`, consumption × `crewN()`, start with 1 year for 2 and 9 t chem; alerts no longer
  pause (`alertCrit`), 🛟 safety slow-down `2680-safety.js` (F4); score + rewind `2690-score.js` (`saveState`/`loadState`
  in 2200); no strobe `1955-comfort.js` (`visLit()`).

- **v0.36:** RULES `0110-atmosphere.js` (`ATM`, `aeroStep` called from `step()` after thrust, `aeroRho`),
  `0585-power-conversion.js` (`s.pcv`, `pcvApply` from `partEff`; core life `p.burn`, `coreK` in powerStep), `0593-fuel-cells.js` (`s.fcN`, `fcW` into `S.rtg`),
  `0594-hull-coating.js` (`s.coat`, `hullAlpha` in powerStep/analyzer/sun burn limit), `2101-radiation-belts.js`
  (`beltRate` in `doseNow`, solar cycle `solAct/solFlareK/solGcrK`, bit flips `seuTick`/`s.radhard`), `2106-crew-health.js` (fitness `m.fit`, `s.exer`,
  `chFitK` in `crewWork`, `m.d0` lifetime dose, `m.ill` medical events, `crewOn` skips the sick, spin `s.spinMode/s.spinRpm/
  s.tether`, `s.gLim` in engLimits). Engines: clusters `c.n`/`c.lost` (`engClusterK` in thrustAcc and step, `engClusterFail` in 2100), `ENGLIVE`/`engLiveTune`, `ENGBIM`/`engBimReactors` (pushed into
  `SH.reactors`, skipped while that engine burns). Client: porkchop `2644` (Lambert), mission planner `2649`, flip-and-burn
  `2642`, Lagrange `2643`, almanac `2648`, captain's log `2682` (wraps `notify`), heat signature `2683`, orbit shadow `2684`.
- **v0.35:** depth pass. RULES: `0580-engine-design.js` (ENGFAM/ENGOPT/ENGDIM, `engSpec(D,cfg)`, `engRecalc`,
  `engSyncAll` on load, job type `design`, `engDose`; new FUEL entries), `0590-optics.js` (`s.optics`, `optReach`), `0591-rail-slugs.js` (`s.slug`, `slugV`; read by fire/impact in 1700),
  `0595-solar-cells.js` (`s.pv`, `pvAge` from survivalTick), `0596-cryo-tanks.js` (`s.tank`, `cryoTick` from survivalTick, `cryoW` in recalc load), `0597-heat-pipes.js` (`s.hpf`, `hpfApply` called from
  `partEff` for parts flagged `hp`), `0598-sail-film.js` (`s.sailM`, `sailT`, `sailTick`; `sailInit` gives 10,000 m²
  on unlock), `0599-greenhouse.js` (`s.crop`, read by lifeStep, recalc load, crew morale). Client: workshop
  `2671-engine-workshop.js`, transfer windows `2645`, gravity assists `2646`, comms `2647`, recorder `2678`, spectrometer `2679`,
  relativistic sky `2681` (never seen in WebGL), crew traits/morale/age in `2105`/`2675`. Choice groups for cells,
  heat pipes, sail film and crops live in the 🏭 Fabricate tab (1000). Tests: `engine-design`, `depth-choices`.
- **v0.34:** sandbox `2110-sandbox.js` (`SBX()` read by `matOK/takeMat/queueJob` in 0600, fuel in 0700, crew 2105;
  frame hook keeps battery full and turns sandbox off when `MP.conn`/`UNI.on`); cargo `2107-cargo.js` (`cargoItems`,
  `jettison`) + window `2677-cargo-ui.js` + `css/330-cargo.css`; trip estimates `effPush()/burnDays()/apStageTxt()` in
  2650; `rocket-lab.html` (standalone, own i18n dictionary, posts its height to the wiki iframe); wiki renderer supports
  `[text](url)` and `<!-- embed: page.html -->`.
- **v0.33:** Andromeda removed (developer: Proxima is the goal, under 24 real hours). `apIst` climbs out of the Sun's
  gravity before aiming at the star; step loop in 1000 breaks at a body's surface. Realistic deck materials/lighting:
  procedural textures `deckTexMake`, `deckRBox` extrusions, instanced small parts, PMREM cabin panorama `ck3Env`,
  window-gated sun `ck3Win`, 2048 shadow map, ACES only for the cockpit pass, display spill PointLights, windscreen
  reflection group mirrored across a raked plane. **Still never seen in WebGL.**
- **v0.32:** 3D flight deck `2666-flightdeck.js` (style `deck`, default; `deckBuild` called from `ck3Build`; canvas
  screens redrawn every 250 ms; clicks raycast against `DECK.click` faces; CSS `225-flight-deck.css` hides widgets
  unless `body.deckw`); geometry checked with the Python box preview only — **ask for a WebGL screenshot**. Crew
  recruiting/capacity/new duties/hibernation in `2105-crew.js` (`t_cryo` tech, sleep skips life support and wear).
  `WARP` up to 3e10 gated by `deepSpace()` (2,000 AU from any
  star, `WARP_DEEP`); `apIst()` relativistic cruise autopilot; `istGo()` in the trip check; test
  `tests/interstellar.test.mjs`.

Not verified visually (no WebGL in the build sandbox): planets, debris, turrets, antenna/trim, hardpoint moves.
The developer has not yet confirmed that GitHub Pages is switched on (Settings → Pages → Source: GitHub Actions).

## 4. NOW — do this next session (in order)

1. **Ask the developer for a first-person screenshot of the new 3D flight deck** (day side and in shadow, a wide and
   a narrow window) and tune screen sizes, text size, materials and light levels from it. Then: reflections on the
   window, screen glare, animated button lamps tied to real systems.
2. **Outposts that do things:** fuel depots that make propellant from stored water with solar power, fabricator
   modules, docking-port geometry; outposts as sensor beacons; contracts that deliver to outposts.
3. **Raider AI into RULES** and a boss wave every fifth wave.
4. **Authoritative universe server:** run the same RULES modules in Node to check each pilot's reported state.
5. **Relativity extras (optional):** GR light/ship deflection factor (1+β²) near the Sun for relativistic ships.
   Ask for a WebGL screenshot of the relativistic sky (2681) and the workshop plume colours.
6. Keep `npm run i18n` at 0 and update the wiki in all three languages with every change.

## 5. NEXT — backlog, roughly by value

- **Interior customisation:** cockpit skins (frame shape, colours, materials), props, lighting moods; tie premium
  interiors to tech.
- **More standard systems** in the TLM pattern: comms (range, light-speed delay), IFF transponders, active vs passive
  sensing (radar reveals you), thermal stealth, physical shields (magnetic/plasma: power + mass costs).
- **Ledger enforcement:** conserve elements through fabrication/mining; show the ledger in 🛠 → Inventory; in
  multiplayer, compare ledger summaries over time and flag impossible jumps.
- **Optional relay server** that validates ORB-NET messages; more than two players.
- **Cockpit polish:** boot sequence, attitude ladder, target box with TLM fidelity readout.
- **Balance pass** with instant orders OFF.
- Fold the combat-lab kernel (`src/`) into the main game or retire it.

## 6. Known issues

- Two objective boxes can show in the cockpit (the old box and the widget).
- Google Fonts are blocked offline; the Neo theme falls back to system fonts (fine).
- Old saves keep their old engine/fuel (by design); new game for the new starter ship.
- Phone: the cockpit hides desktop widgets; only the mini radar and vitals show.
