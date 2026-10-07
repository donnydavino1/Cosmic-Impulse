# Cosmic Impulse

**Build the spaceship you've always wanted, then fly it through a real, to-scale solar system.**

Design its engines, weapons, armour and power. Explore, mine asteroids, build, and battle other players,
all under one shared set of real physics.

**✓ Free forever**: real money can never buy ships, weapons, resources or advantages.

**✓ Open source**: anyone can read, change and improve it.

**✓ Runs in your web browser**: nothing to install, works on computers and phones.

**✓ Three languages**: English, Español, 中文.

### Same rules for everyone, endless ways to play

In Cosmic Impulse, the server sets the rules: the physics, the resources, what every engine, weapon and sensor can
do, and how technology scales. These rules are identical for every player and can't be bought or bent. Everything on
top of them is yours to reshape without limit. You can customize your ship's look and layout in the game, or go
further and write your own code to change your cockpit, controls, displays, automation and tools, down to how you
experience the game at all. No matter how much you change, you only ever see the same information as everyone else:
the same sensor data, the same physics and the same limits. That means customization changes *how* you play, making
the game more comfortable, efficient or uniquely yours, but never makes the match unfair. The best player wins
through skill, design and creativity, not through hidden advantages.

**How this works technically:** [Fair Play and Rules (wiki)](https://donnydavino1.github.io/Stellar-Impulse/wiki.html#en/Fair-Play-and-Rules)
explains it in plain language. [`docs/FAIR-PLAY.md`](docs/FAIR-PLAY.md) has the full technical details: which code
counts as shared rules, how each game's "physics fingerprint" proves both players use the same rules, and what
happens when they don't. [Build Your Own Cosmic Impulse (wiki)](https://donnydavino1.github.io/Stellar-Impulse/wiki.html#en/Build-Your-Own-Cosmic-Impulse)
shows how to rebuild the whole interface, even with an AI assistant, while still battling everyone fairly.

---

## ▶ Play now (one click)

| | |
|---|---|
| 🏠 **Start page** | [donnydavino1.github.io/Stellar-Impulse](https://donnydavino1.github.io/Stellar-Impulse/) |
| 💻 **Play on a computer** | [Play Cosmic Impulse](https://donnydavino1.github.io/Stellar-Impulse/cosmic-impulse.html) |
| 📱 **Play on a phone** | [Play the phone version](https://donnydavino1.github.io/Stellar-Impulse/cosmic-impulse-mobile.html) |
| 📖 **Player guide (wiki)** | [English](https://donnydavino1.github.io/Stellar-Impulse/wiki.html#en/Home) · [Español](https://donnydavino1.github.io/Stellar-Impulse/wiki.html#es/Home) · [中文](https://donnydavino1.github.io/Stellar-Impulse/wiki.html#zh/Home) |

You don't need a GitHub account to play. Just click a link above.

**New here?** Start with the wiki's
[Vision and Philosophy](https://donnydavino1.github.io/Stellar-Impulse/wiki.html#en/Vision-and-Philosophy) page,
then [Your First 10 Hours](https://donnydavino1.github.io/Stellar-Impulse/wiki.html#en/First-10-Hours).

---

## 🎮 How to play (the short version)

You start in orbit around Earth with a small ship. Collect sunlight with your solar panels, research new
technology, build better parts, mine asteroids, and fly anywhere in the solar system.

| Key | What it does |
|---|---|
| **W A S D Q E** | Fire your engine (in orbit mode, **W** speeds you up along your path) |
| **V** | Switch camera: behind your ship → cockpit → map of your orbit |
| **B** | 🛠 Engineering: build parts, research, buy fuel |
| **N** | 🧭 Navigation and autopilot |
| **7** | 🧱 Ship Builder: arrange and upgrade your ship's modules |
| **8** | 🛸 Operations: mining drones and science probes |
| **9** | 📋 Contracts: missions with rewards |
| **1 – 5** | Choose and fire a weapon (hold for beams) |
| **O** | Pick the next target |
| **0** | Call in a wave of enemy raider drones |
| **K** | 🎨 Customize your ship, cockpit style and radar |
| **P** | 🌐 Play with a friend (multiplayer) |
| **C** | 📖 Full in-game guide, and change any key |
| **F8** | Switch language |
| **F9** | Testing: unlock everything |

**On a phone:** tap **☰** (top right) for every action, hold the pad (bottom left) to fly, and tap the weapon
buttons (bottom right) to fire. Drag to look around, pinch to zoom.

The full list of controls is in the wiki:
[Controls](https://donnydavino1.github.io/Stellar-Impulse/wiki.html#en/Controls).

---

## 🚀 What you can do

- **Fly with real physics.** Orbits work like they do for real spacecraft. Push forward and you go *up*.
  Get close to the speed of light and your ship's clock slows down.
- **Design your ship.** In the 🧱 Ship Builder, the order of your modules changes how fast you turn, how hard you
  can thrust, and how much radiation reaches your crew. Upgrade every part from Mk I to Mk V.
- **Keep your crew alive.** They need oxygen, water, food, a cool cabin, and shelter from solar storms.
- **Mine and explore.** Send mining drones to asteroids and science probes to other planets.
- **Fight.** Battle raider drones, or another player. Lasers get weaker with distance; missiles can be shot down.
- **Play together.** One player hosts and shares a short room code; the other joins.
- **Make it yours.** Choose a cockpit style (realistic, military, retro…), a radar display (3D or a rotating
  sonar sweep), and your ship's look.

---

## 🧭 Finding your way around this page (for GitHub beginners)

This page is a **repository**: the folder where all of the game's files live. You don't need to understand
it to play. If you're curious:

- **The list of files and folders** above this text is the game's source. Click any folder to open it, and use
  your browser's Back button to return.
- **This text you're reading** comes from the file `README.md`.
- **The green "Code" button → "Download ZIP"** downloads the whole game to your computer. Unzip it and
  double-click `cosmic-impulse.html` to play offline (it needs internet the first time).
- **"Actions" tab:** robots that test the game and publish the website automatically every time it's updated.
  A green ✓ means everything worked.
- **"Issues" tab:** report a bug or suggest an idea. You need a free GitHub account for this.

### What's in each folder

| Folder or file | What it is | Should I touch it? |
|---|---|---|
| `cosmic-impulse.html` | **The game** (computer version) | Open it to play |
| `cosmic-impulse-mobile.html` | **The game** (phone version) | Open it to play |
| `wiki.html` | **The player guide**, all in one page | Open it to read |
| `index.html` | The start page with the Play buttons | |
| `game/` | The game's source code, in small pieces | For developers |
| `wiki/` | The player guide's pages, as text files | Writers can edit these |
| `docs/` | Design documents and the [vision](docs/VISION.md) | Good reading |
| `tests/`, `tools/` | Automatic checks and build tools | For developers |
| `src/`, `arena.html`, `dist/` | An older combat experiment | For developers |
| `.github/` | Instructions for GitHub's robots (tests and the website) | No |
| `orbital.html`, `orbital-mobile.html`, `prototype/` | Old addresses; they forward to the new game | No |
| `README.md` | This page | |
| `LICENSE` | The open-source license (GNU GPLv2) | |

---

## 🌌 Vision

> Build the spaceship you've always wanted. Design your engines, weapons, armour, power systems, interiors and
> almost anything else you can imagine. Then take your creation into a massive, to-scale solar system to
> explore, mine, build, and battle other players in their own spaceships.

Three ideas guide everything:

1. **Make it yours:** total freedom over how your ship looks, works and feels.
2. **Same rules for everyone:** your customizations never change the physics, so battles are always fair.
3. **Almost unlimited creation:** the goal is tools to invent what comes next, not just a list of things to unlock.

Read more: [Vision and Philosophy](https://donnydavino1.github.io/Stellar-Impulse/wiki.html#en/Vision-and-Philosophy) ·
[docs/VISION.md](docs/VISION.md) ·
[Non-technical overview (PDF)](docs/Cosmic-Impulse-Overview.pdf)

---

## 🛠 For developers and AI assistants

Everything a developer needs is in these files:

| File | What it covers |
|---|---|
| [`CONTINUE.md`](CONTINUE.md) | **Start here.** How the code is organized, how to build and test, and the current plan |
| [`AGENTS.md`](AGENTS.md) | The brief for AI assistants working on the game |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | How the pieces fit together |
| [`docs/MODDING.md`](docs/MODDING.md) | Styles, cockpit styles, radar screens, new modules, and translations |
| [`docs/FAIR-PLAY.md`](docs/FAIR-PLAY.md) | Which code is shared rules and which you can freely change |
| [`docs/MULTIPLAYER.md`](docs/MULTIPLAYER.md) | Hosting and joining games |
| [`docs/PROTOCOL.md`](docs/PROTOCOL.md) | Data formats other programs can rely on |
| [`CHANGELOG.md`](CHANGELOG.md) | What changed in each version |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Read before changing the rules |

Quick commands (needs [Node.js](https://nodejs.org) 22 or newer; nothing else to install):

```sh
node tools/build-game.mjs   # rebuild the game files after editing game/
npm run build               # rebuild the game, the wiki and the combat lab
npm test                    # run all automatic checks
npm run i18n                # check that every text is translated (needs Python + Playwright)
```

The website at donnydavino1.github.io updates by itself about a minute after every push to the `main` branch.

---

## 📜 License

Cosmic Impulse is free and open source under the **GNU General Public License, version 2**. See [LICENSE](LICENSE).
