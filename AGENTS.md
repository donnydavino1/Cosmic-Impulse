# AGENTS.md — brief for AI assistants working on Stellar Impulse

You are helping a player (or developer) change Stellar Impulse, an open-source physics spaceship game. Read this first.

## What you may change, and what keeps battles fair

The game code is `game/js/NNNN-*.js` (plus `game/css`, `game/shell.html`, `game/platform/`). Files are concatenated
in name order into one script. **`game/manifest.json` lists the RULES modules**: physics, parts, technology,
budgets, manufacturing, fuel, weapons/damage, survival, sensors, the ledger/API and the network protocol.

- **Player customisation (the usual case): do NOT edit any RULES module.** Everything else is fair game: cockpit and
  HUD (`2000-vitals.js`, `2500-dashboard.js`, `game/css/*`), controls and layouts (`1100-keys.js` labels/defaults,
  `game/platform/*`), ship looks (`1300-ship-model.js`, `2570-ship-style.js`, `2580-hardpoints.js`), planets and sky
  (`1900-look.js`), music (`1600-radio.js`), radar displays (register new ones; see `docs/MODDING.md`), menus, text.
  Add new client features as NEW modules that hook in via `ORB.on(...)` rather than editing shared code.
- If a client module needs a value from a RULES module, **read** it; never write game state that physics owns
  (`s.x/v`, `s.fuel`, `s.res`, `s.hull`, `s.en`, `UNL`, `s.tech`…) except through existing player actions.
- **Changing a RULES module creates a different game.** That's allowed (the player may want it), but tell them
  clearly: their physics fingerprint will no longer match the official one and battles with other players will be off.

## Verify before you finish

```
node tools/build-game.mjs        # builds stellar-impulse.html + stellar-impulse-mobile.html, prints fingerprints
npm test                         # build checks, both platforms share one core, script parses, wiki links
python3 tools/smoke/smoke.py     # optional: headless run of both builds (needs Playwright)
python3 tools/smoke/mp_test.py   # optional: two-browser multiplayer test
```

The build prints `physics fingerprint ORB_RULES_FP <hash> (official ✓)` when the RULES modules are untouched.
If it says *not an official release*, a RULES module changed: say so to the player.

## Must-keep invariants

1. Both builds exist and work: `stellar-impulse.html` (keyboard/mouse) and `stellar-impulse-mobile.html` (touch). New key actions go in
   `ACTS` and appear in the phone ☰ menu automatically; new panels must fit a 390×844 screen.
2. Never hand-edit the built HTML files; edit `game/` and rebuild.
3. Keep data formats compatible (`docs/PROTOCOL.md`); readers ignore unknown fields; breaking changes need `/2`.
4. Every module starts with a `//` header comment describing what it owns and which hooks it uses.

## Where things are

| Need | Read |
|---|---|
| the ten laws everything follows | `docs/LAWS.md` |
| module map, globals, hooks | `docs/ARCHITECTURE.md` |
| data formats (state, ledger, sensors, ship style, network) | `docs/PROTOCOL.md` |
| recipes: styles, radars, widgets, key actions, hardpoints | `docs/MODDING.md` |
| fingerprints and fair play | `docs/FAIR-PLAY.md` |
| multiplayer | `docs/MULTIPLAYER.md` |
| player-facing explanations | `wiki/` (built into `wiki.html`) |
| the developers' plan (when continuing development) | `CONTINUE.md` |
