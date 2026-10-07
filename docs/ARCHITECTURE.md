# Architecture

Stellar Impulse ships as **two single-file games** built from one set of modules:

```
game/
  shell.html            HTML skeleton with markers: /*@CSS*/  /*@JS*/  <!--@STAMP-->  <!--@PLATFORM-->
  css/NNN-*.css         styles, concatenated in name order
  js/NNNN-*.js          game code, concatenated in name order into ONE classic <script>
  platform/desktop.html extra layer for desktop (empty today)
  platform/mobile.html  phone layer: touch pad, ☰ menu of every action, mini radar, layout CSS
tools/build-game.mjs    builds stellar-impulse.html + stellar-impulse-mobile.html, computes ORB_FP
tools/smoke/            headless browser smoke test (Playwright + a three.js stand-in)
```

Build: `node tools/build-game.mjs`. The core (shell + css + js) is identical in both outputs; `tests/game-build.test.mjs`
enforces that, so the two platforms can never drift apart.

## Why one script made of numbered files

The game grew as one large script whose parts share globals (`s` the ship, `T` the clock, `B` the bodies…).
Splitting it into ES modules would mean rewriting every cross-reference. Concatenating numbered files keeps the
code exactly as it runs, while letting a session open, read and change **one** file. Gaps between numbers
(0050, 0100 … 2550, 2560) leave room to insert modules where they belong in load order.

Rules of thumb:
- A module may use anything defined by an earlier module at load time, and anything at all inside functions that
  run later (the whole script has loaded by the first frame).
- Prefer adding a module that listens to hooks over editing an existing module.
- Keep a module's top comment up to date: what it owns, what it reads, which hooks it uses.

## Modules

| File | Owns |
|---|---|
| `0050-bus.js` | `ORB` event bus, hook names, ship-model key parts |
| `0060-i18n.js` | languages: dictionaries from `game/i18n/*.json` (injected by the build), on-screen text translation, `setLang` |
| `0100-physics.js` | constants, bodies `B`, fuels `FUEL`, engines `DR`, N-body + relativity integrator `step()`, ship state `s` |
| `0200-render.js` | three.js scene `sc`, map camera `cam`, planet meshes, labels, asteroids `AST`, orbit drawing |
| `0300-parts.js` | `PARTS` catalogue (mass, recipe `mat`, energy `J`, research `req`) |
| `0400-tech.js` | `TECH` tree |
| `0500-budgets.js` | `recalc()` → `SH` (power, heat, shielding, limits) whenever the ship changes |
| `0550-layout.js` | modular ship layout (RULES): module order `s.lay`, sizes, centre of mass, turn time, g limit by length, reactor shadow shielding, storm-shelter factor, refit jobs → `SH.lay` |
| `0600-manufacturing.js` | job queue `s.jobs`, `queueJob`, `finishJob` |
| `0700-fuel.js` | buying/making fuel and supplies |
| `0800-analyzer.js` | design analyzer: what limits thrust, why |
| `0900-research.js` | research and discoveries (`disc`) |
| `1000-engineering-ui.js` | 🛠 window, tabs, `btn/info/grp` helpers, `refreshUI()`, **`frame()` main loop** |
| `1100-keys.js` | `ACTS` table (every action + default key), rebinding, `TK` |
| `1200-stabilizer.js` | view frame lock |
| `1300-ship-model.js` | close-range scene `SS`/`SC`, `buildShip()`, `CUST` style, 🎨 Customize |
| `1400-notify.js` | `notify()` toasts |
| `1500-autopilot.js` | planning and executing transfers |
| `1600-radio.js` | generated music and the audio helpers `tone/noise/kick` |
| `1700-world.js` | `OBJS` (drones, slugs, missiles), `WEP` weapons, `hit()`, `worldTick()` |
| `1750-contracts.js` | contracts board: generation, progress, physical rewards (beam, capsule), key 9 |
| `1760-ops.js` | mining drones and science probes (RULES): build jobs, deploy/recall, ore by composition, Hohmann probe trips, light-speed data, `s.ops` |
| `1800-combat.js` | `CB` raid state, number-key weapons, raider AI, turrets, 2D effects layer `cfxDraw`, weapon bar |
| `1900-look.js` | painted planets, atmospheres, nebula sky, debris field, holo panels, camera cycling, `unlockAll`, instant orders |
| `1950-realism.js` | realistic look (default): filmic tone mapping, dim fill light, Milky Way sky, softer halos; `applyVis()` |
| `2000-vitals.js` | cockpit vitals strip |
| `2100-survival.js` | life support, radiation, failures, game over |
| `2200-save.js` | save/load slots (`saveGame/loadGame`) |
| `2300-text-panels.js` | HTML summaries used by panels and widgets |
| `2400-graphs.js` | history samples and small graphs |
| `2500-dashboard.js` | cockpit widgets `WDEF`, layouts `DASH` |
| `2550-sensors.js` | sensor tiers, ORB-TLM contacts, radar designs, 📡 widget |
| `2560-api.js` | `ORB.api`, ledger, element compositions |
| `2570-ship-style.js` | upgrade-driven exterior, style presets, trims, style JSON, radar/cockpit pickers |
| `2580-hardpoints.js` | movable parts: `CUST.mounts`, offsets applied after `ship:build`, 🎨 HARDPOINTS editor |
| `2590-ops-ui.js` | 🛸 Operations window (key 8) for drones and probes |
| `2595-builder-ui.js` | 🧱 Ship Builder window (key 7): side view, draft vs now, refit |
| `2600-ui-extras.js` | misc UI refresh |
| `2700-trip-supplies.js` | supplies calculator |
| `2800-multiplayer.js` | PeerJS, `RULES` fingerprint, ORB-NET messages, remote ship `RS` |

## How modules talk

1. **Shared globals** (the original style). Key ones: `s` ship state · `T` coordinate time · `B` bodies ·
   `OBJS`/`ALL` dynamic objects · `AST` asteroids · `SH` system budgets · `DR`/`di`/`PW` engines ·
   `WEP`/`WI`/`WT` weapons/target · `UNL` unlocked hardware · `CUST` style · `FP`/`SV` camera modes · `K` held keys.
2. **The bus** (`0050-bus.js`): `ORB.on(event, fn)` / `ORB.emit(event, …)`. Core events: `frame`, `ui`, `ship:build`, `job:done` (a manufacturing job finished; RULES modules use it for new build types).
   `ORB.keyParts` lets a module force a ship-model rebuild when its own state changes.
3. **The public API** (`ORB.api`, `2560-api.js`): read-only, versioned views for mods and other programs.
   Formats in `docs/PROTOCOL.md`.

## Platforms

Both outputs contain the same core. The phone layer hides desktop-only panels and adds its own controls; it
reads the same `ACTS` table, so **every new key action automatically appears in the phone ☰ menu** (categorised
by `MMAP` in `platform/mobile.html`; unknown ids go to “Everything else”). New panels must be checked on a phone
viewport (the smoke test takes a 390×844 screenshot).

## Fingerprints

`RULES` (gameplay data hash), `ORB_RULES_FP` (source hash of the RULES modules listed in `game/manifest.json`) and
`ORB_FP` (whole-core hash). Battles need `RULES` and `ORB_RULES_FP` to match. See `docs/FAIR-PLAY.md`.

## Player wiki

`wiki/*.md` (human pages; `Controls.md` is generated from `ACTS`) → `node tools/build-wiki.mjs` → `wiki.html`.
`tests/wiki.test.mjs` checks links, controls coverage and referenced files.

## Combat lab (`src/`, `arena.html`)

An earlier experiment with a stricter layered design. Kept for its tests and ideas; candidates to fold in or retire.

Stellar Impulse is built in layers. Each layer only depends on the ones below it.

```
src/rules/     The Rules           Constants and scaling laws. Data only.
src/kernel/    The physics kernel  Pure functions and a deterministic simulation. No DOM, no graphics.
src/arena/     The arena game      Interface, rendering, input, AI pilot, networking.
```

## The Rules (`src/rules/rules.js`)

Every number that decides what a ship can do lives here: physical constants, materials, the
technology era's scaling laws (kilograms per watt, efficiencies, limits), slider ranges and the
starting ship classes. Nothing else in the code base hard-codes a game rule.

The whole file is hashed into the **rules fingerprint** (`src/kernel/fingerprint.js`). Two games
only fight if their fingerprints match, so everybody plays by the same physics even though anyone
can fork the code. `RULES.md` is generated from this file so the documentation can never drift.

## The kernel (`src/kernel/`)

- **`design.js`** turns a *blueprint* (a ship class plus six slider positions, plain data that is safe
  to share) into everything the ship can do: masses, thrust, exhaust speed, delta-v (rocket
  equation), radiator cooling (Stefan–Boltzmann), how long it can fire before overheating, laser
  reach (diffraction limit), armour toughness. `summarize()` explains the result in plain words.
  Players never type stats, so stats cannot be faked: anyone can recompute them from the blueprint.
- **`battle.js`** simulates a fight: turning and thrusting, energy storage and the generator, heat
  flowing in (engine, weapons, hits) and out (radiators), boiling water as a heat sink, lasers,
  railgun slugs, guided missiles, point defence, armour faces and internal damage. It is
  deterministic for a given seed and inputs.
- **`math.js`** has vector helpers, intercept prediction and a seeded random-number generator.

Players, the AI and network peers all drive a battle through the same commands
(`command`, `fireRailguns`, `launchMissiles`, and the `laserOn`, `pd` and `radExtended` switches).
The AI therefore cannot cheat.

## Multiplayer model (current: two players, peer to peer)

Each player is authoritative over **their own ship**. The other ship is a *remote* copy updated 20
times a second and dead-reckoned in between. When your weapons hit the remote ship, the hit is
not applied locally: it goes into `battle.outbox`, is sent to its owner, and the owner's kernel
resolves the damage against its own armour state.

Safeguards today: both games must have the same rules fingerprint; each side evaluates the other's
blueprint itself, so stats cannot be faked; and every incoming hit is capped at what the shooter's
design could physically deliver.

**Limit:** a modified client could still lie about its own ship's state. The planned fix is an
authoritative server that runs this same kernel and owns the ledger of conserved quantities
(energy, mass of each element, momentum). Clients would send only intentions ("fire", "burn at
60%"), and the server would decide outcomes. The kernel is already separated from everything
else to make that move straightforward. A Rust/WebAssembly port, so browser and server run
identical code, is the long-term plan.

## The arena (`src/arena/`)

| File | Job |
|---|---|
| `main.js` | Screens, the fixed-step game loop (60 steps per second), AI and online matches |
| `designer.js` | Layer 1 (class) and Layer 2 (sliders) design interface |
| `ai.js` | The AI pilot: fights at its class's preferred range, dodges, manages heat and fuel |
| `render.js` | three.js view: ships built from their design, false-colour infrared radiators, beams, missiles |
| `hud.js` | Heat-first heads-up display and weapon bar |
| `input.js` | Enemy-relative flight controls and key bindings |
| `net.js` | Peer-to-peer transport (PeerJS room codes or manual codes) |

`tools/build.mjs` bundles everything into `dist/stellar-impulse-arena.html` so the arena also works when
opened straight from disk.

## Tests

- `tests/kernel.test.mjs`: physics checks (rocket equation, radiator law, diffraction, every slider
  is a real tradeoff), weapon mechanics, and an AI-vs-AI tournament across every class matchup.
- `tests/arena-smoke.test.mjs`: builds the game and boots it in sandboxed fake browsers. It plays a
  full battle to the results screen and connects two instances to check online damage arrives.

GitHub Actions runs the tests on every push and checks that `RULES.md` and `dist/` are up to date.
