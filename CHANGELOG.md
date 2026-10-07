# Changelog

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
