# Build Your Own Cosmic Impulse (with your AI)

Cosmic Impulse is meant to be reshaped by its players. You don't need to code: hand the repository to an AI coding
assistant and describe the game you want: *"a cockpit like a submarine sonar room"*, *"one-thumb phone controls"*,
*"my ship should look like a manta ray and glow when I fire"*, *"a radar that shows only threats, in red"*.

## The one rule
Your AI may change everything **you see and touch**. It must not change the **rules modules** if you want to
battle other players: then your physics fingerprint stays identical and fair play works. See [[Fair Play and Rules]].

## How
1. Get the code: download the zip (or clone the GitHub repository).
2. Give your AI the file **`AGENTS.md`** first. It explains, in AI-friendly form, which files are yours to change,
   which are shared rules, how to build, and how to check that the physics fingerprint didn't change.
3. Ask for what you want. The AI edits modules in `game/` and runs `node tools/build-game.mjs`.
4. Check the build's output line: `physics fingerprint … (official ✓)` means you can still battle everyone.
5. Play your `cosmic-impulse.html` (computer) or `cosmic-impulse-mobile.html` (phone). Share your build with friends.

## Copy-paste starter prompt
> Read AGENTS.md, then docs/ARCHITECTURE.md and docs/MODDING.md in this repository. I want to change how my game
> looks and feels: [describe it]. Keep all RULES modules listed in game/manifest.json unchanged so my physics
> fingerprint stays official. Build both versions and tell me the fingerprints.

## Where the technical documentation lives
| File | For |
|---|---|
| `AGENTS.md` | the brief for your AI: what to change, what not to, how to verify |
| `docs/ARCHITECTURE.md` | how the code is organised, module by module |
| `docs/PROTOCOL.md` | data formats: ship state, ledger, sensor contacts, ship style, network messages |
| `docs/MODDING.md` | styles, radar designs, new modules, widgets, key actions, hardpoints |
| `docs/FAIR-PLAY.md` | fingerprints and how fair battles are enforced |
| `docs/MULTIPLAYER.md` | hosting, joining, servers, troubleshooting |
| `CONTINUE.md` | the developers' running plan |
