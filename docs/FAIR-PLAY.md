# Fair play: shared rules, personal clients

Stellar Impulse wants two things that pull against each other: **anyone can reshape the game** (often with an AI), and
**anyone can battle anyone fairly**. The answer is to split the code and fingerprint the shared part.

## The split

`game/manifest.json` lists the **RULES modules**. Everything that decides outcomes lives there:

| Module | Decides |
|---|---|
| `0100-physics.js` | constants, gravity, relativity, integrator, engines, fuels |
| `0300-parts.js`, `0400-tech.js` | what can be built, its mass, recipe, energy, research |
| `0500-budgets.js` | power, heat, structure and shielding limits |
| `0600-manufacturing.js`, `0700-fuel.js` | how fast things are made, what they cost |
| `1700-world.js` | weapons, projectiles, damage, mining |
| `1750-contracts.js` | what contracts pay and how rewards arrive |
| `0550-layout.js` | how module layout changes turn time, g limit, reactor dose and storm shelter |
| `1760-ops.js` | what drones dig, what probes cost, travel and return |
| `2100-survival.js` | life support, radiation, failures |
| `2550-sensors.js` | what sensors can detect (tiers, ranges, fidelity) |
| `2560-api.js` | the ledger and element compositions |
| `2800-multiplayer.js` | the network protocol and how hits are accepted |

All other modules are **CLIENT**: looks, cockpit, controls, menus, sound, radar *displays*, ship styles.

## Three fingerprints

| Name | Covers | Used for |
|---|---|---|
| `RULES` | the gameplay data tables (engines, parts, tech, fuels, weapons, constants), FNV-1a | must match to play together sensibly |
| `ORB_RULES_FP` | the full source of every RULES module, SHA-256 (16 hex) | must match for **battles** |
| `ORB_FP` | the whole game core (all modules + shell + CSS) | informational: "same build?" |

`ORB_RULES_FP` catches changes in *code*, not just numbers (say, a damage formula), which `RULES` alone would miss.

## What happens on connect

Each game sends `rules`, `phys` (ORB_RULES_FP) and `code` (ORB_FP) in its `hello`:

- `rules` and `phys` both match → `MP.fair = true`, ⚔ *Fair play*, hits are applied.
- `rules` matches, `phys` differs → flying, chat, salvage work; **incoming hits are ignored** (the receiving game
  enforces it, so a modified client can't force damage onto an official one).
- `rules` differs → ⚠ warning: positions and physics will disagree.
- only `code` differs → ℹ note; fine.

## Official rules

`game/official-rules.json` lists the physics fingerprints of official releases. The build embeds the list as
`ORB_OFFICIAL`; the 🌐 window shows **✓ official** when yours is on it. Maintainers add a release with
`node tools/build-game.mjs --release` after changing RULES modules on purpose (and bump the version).

## Limits (honest ones)

This is peer-to-peer: each game trusts its own copy of the rules. A cheater could fake a fingerprint. The
fingerprint stops *accidental* and *well-meaning* divergence (the common case with AI-made clients). Stopping
deliberate cheating needs a referee: the planned relay server would replay ship messages against the ledger
(`docs/PROTOCOL.md`) and reject impossible changes in mass, energy or momentum.

## Moving code between the zones

Several modules still mix rules and client code (for example `1800-combat.js` holds both the single-player raider AI
and the weapon bar UI; `1000-engineering-ui.js` holds the main loop). Splitting them so that more of the game is
customisable without touching rules is ongoing work (`CONTINUE.md`). When you move code into or out of a RULES
module, update `game/manifest.json` and cut a new official release.
