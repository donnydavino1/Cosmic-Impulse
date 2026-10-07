# Stellar Impulse

**Build the spaceship you've always wanted.** Design its engines, weapons, armour and power, then
take it into a to-scale solar system to explore, mine, build and battle other players, all under
one shared set of physics.

Stellar Impulse is free to play and open source (GNU GPLv2). Real money can never buy ships, weapons,
resources, upgrades or advantages. Read the [Vision](docs/VISION.md) for the full idea, or the
[non-technical overview (PDF)](docs/Stellar-Impulse-Overview.pdf) for how the game works.

## One-click links

Once GitHub Pages is on (Settings → Pages → Source: **GitHub Actions**; the `website` workflow in
`.github/workflows/pages.yml` then publishes on every push to `main`), everything is a plain web address:

| | Address |
|---|---|
| Start page | `https://<user>.github.io/<repo>/` |
| ▶ Play (computer) | `https://<user>.github.io/<repo>/stellar-impulse.html` |
| 📱 Play (phone) | `https://<user>.github.io/<repo>/stellar-impulse-mobile.html` |
| 📖 Wiki | `https://<user>.github.io/<repo>/wiki.html` (`#es/Home` Español, `#zh/Home` 中文) |

Put the start page in the repository's **About → Website** field so it shows at the top of the GitHub page.

## Languages

The game and wiki come in **English, Español and 中文**: 🌐 on the welcome screen, 🎨 Customize → LANGUAGE, or **F8**.
Translators: see `game/i18n/` and `docs/MODDING.md` → Translations.

## Learn to play

The **[Stellar Impulse Wiki](https://claude.ai/artifact/PcSnhuD1QhDPnV3zuNw6eX)** (also `wiki.html` here, source in `wiki/`)
explains the game for players: getting started, controls, orbits, engineering, survival, combat, sensors,
customisation, multiplayer, fair play, and how to **build your own version with an AI** while still battling
everyone fairly. AI assistants should start with [`AGENTS.md`](AGENTS.md).

## Working on the game

**Start with [`CONTINUE.md`](CONTINUE.md)**: it explains the module layout, the build and test commands, and the
current plan (what to do now and next). The game source is in `game/` and builds into the two playable files with
`node tools/build-game.mjs`. Formats other programs can rely on are in [`docs/PROTOCOL.md`](docs/PROTOCOL.md);
how to make styles, radars and new modules is in [`docs/MODDING.md`](docs/MODDING.md); hosting and joining games is in
[`docs/MULTIPLAYER.md`](docs/MULTIPLAYER.md).

## Play

Open **`stellar-impulse.html`** (or the repository's GitHub Pages site and press *Play Stellar Impulse*). It runs in any
modern browser and needs an internet connection the first time (it loads three.js and PeerJS from public CDNs).

**On a phone,** open **`stellar-impulse-mobile.html`**: the same game with a touch layout. A ☰ menu holds every action from
the keyboard version, a thrust pad sits bottom-left, weapon buttons bottom-right; drag to look and pinch to zoom.

You start in orbit around Earth with a small ship whose chemical rocket carries enough fuel to escape Earth right away. Collect sunlight, build panels, engines and
weapons, mine asteroids, and fly anywhere in a to-scale solar system with real orbital mechanics and relativity.

| Key | What it does |
|---|---|
| **V** | Cycle cameras: 3rd-person chase → 1st-person cockpit → orbit map. The cockpit shows a vitals strip with everything that can kill you |
| **W A S D Q E** | Thrust (orbit mode: W speeds you up along your path) · **M** switches to fixed X/Y/Z axes |
| **1–5** | Select and fire: mining laser, pulse laser, particle beam, railgun, missiles (hold for beams) |
| **O** | Next target |
| **0** | Call in a wave of raider drones |
| **B** | Engineering: build, research, buy fuel |
| **N** | Navigation and autopilot |
| **C** | Full guide and key rebinding |
| **F9** | Testing: unlock every technology, engine and weapon (also in 🛠 → 🧪 Testing, where you can also turn instant orders on or off; they are on for now) |

**Ship Builder (key 7).** Arrange your modules along the spine: the layout sets your turn time, your g limit, how
much reactor radiation reaches the crew, and whether the storm shelter works. Your 3D ship is built from the same
layout, in a realistic look (real lighting, no cartoon glows; the stylized look is one toggle away).

**Drones and probes (key 8).** Research robotics to send mining drones to a nearby asteroid while you do something
else, and deep-space probes to fly Hohmann transfers to other worlds; their data returns at the speed of light.

**Combat.** Raiders close in from 25–45 km and shoot back. From wave 2 they fire missiles you can shoot down.
Lasers obey diffraction, so the energy they deliver falls with the square of distance (full power within
50 km for the pulse laser). Beat a wave for missiles and metals; lose and you lose your ship.

**Look.** Planets are painted procedurally (no image files), with glowing atmospheres and Saturn's rings, under a
nebula sky. Around your ship drifts a debris field so you can feel your motion; it is visual only and never
affects the physics. Turn it off in 🎨 Customize for realistic, nearly empty space.

**Multiplayer:** press P; one player hosts and shares the room code, the other joins. No internet matchmaking?
There's a 3-step manual connection. Full guide: [`docs/MULTIPLAYER.md`](docs/MULTIPLAYER.md).

The **combat lab** (`arena.html`) is an experimental head-to-head ship duel with its own designer. Its ideas
will be merged into the main game.

## Repository layout

```
src/rules/rules.js    The Rules: every constant and scaling law. Single source of truth.
src/kernel/           The physics kernel: pure, deterministic, no graphics.
  design.js           Blueprint → performance (thrust, delta-v, heat, weapons) + plain-language summary
  battle.js           Battle simulation: ships, heat flow, weapons, missiles, damage
  math.js             Vectors, intercepts, seeded random numbers
  fingerprint.js      Hash of the rules, so mismatched games can't fight
src/arena/            The arena game: designer, AI pilot, renderer, HUD, controls, networking
arena.html            Combat lab entry page (ES modules)
dist/                 Built single-file arena (generated by npm run build)
game/                 The game's source modules (edit these): shell, css/, js/, platform/
stellar-impulse.html          Built desktop game (generated; do not edit)
stellar-impulse-mobile.html   Built phone game, same core (generated; do not edit)
CONTINUE.md           Handoff and plan for the next development session
prototype/            Old address of the game; redirects to stellar-impulse.html
tests/                Kernel tests, AI-vs-AI battles, and an interface smoke test
tools/                Build script, Rules-file generator, duel tracer, overview PDF generator
docs/                 Vision, architecture notes and the overview PDF
RULES.md              Human-readable rules, generated from src/rules/rules.js
```

## Develop

Requires [Node.js](https://nodejs.org) 22 or newer. There are no dependencies to install.

```sh
npm test           # physics tests, AI-vs-AI battles for every matchup, interface smoke test
npm run build      # rebuild dist/stellar-impulse-arena.html after changing src/
npm run rules      # regenerate RULES.md after changing src/rules/rules.js
node tools/duel.mjs brawler sniper 400   # watch one AI-vs-AI fight minute by minute
python3 tools/overview_pdf.py           # rebuild docs/Stellar-Impulse-Overview.pdf (needs reportlab)
```

To try the modular version locally, serve the folder, for example `python3 -m http.server`, then
open <http://localhost:8000/arena.html>.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for how the pieces fit together, and
[CONTRIBUTING.md](CONTRIBUTING.md) before changing the rules.

## Status

This is an early, playable foundation. Working now: the physics kernel (nuclear-era engines, power,
heat, armour, lasers, railguns, missiles, point defence), four ship classes with tradeoff sliders,
an AI opponent, and two-player online battles. Next: deeper design layers (custom components),
the solar-system world on the same kernel, an authoritative server for a shared world, and
technology discovered through research. See the overview PDF for the roadmap.

## License

GNU General Public License, version 2. See [LICENSE](LICENSE).
