# Fair Play and Rules

Cosmic Impulse is open source and built to be customised, often by an AI assistant. So how can strangers battle fairly?

The game is split into two kinds of code:

| | **Rules** (shared) | **Client** (yours) |
|---|---|---|
| What | physics, orbits, engines, parts, research, damage, survival, sensors, the ledger, the network protocol | looks, cockpit, controls, layouts, sounds, radar displays, menus, ship styles |
| Can you change it? | only if you never want to battle others | yes, as much as you like |
| Fingerprint | **physics fingerprint** (ORB_RULES_FP) and **rules fingerprint** (RULES) | code fingerprint (ORB_FP), informational |

When two games connect they compare fingerprints:
- **Same rules and physics:** ⚔ *Fair play*, battles are on. If the physics fingerprint is in the official list,
  the game shows **✓ official**.
- **Different physics:** you can still fly and chat together, but weapon hits are switched off.

So: restyle everything you see and touch, and you can still fight anyone running the official rules. Change how
engines, damage or orbits work and you've made a new game (which is fine!), playable with friends who use your build.

Your fingerprints are shown in the 🌐 Multiplayer window. Technical details: `docs/FAIR-PLAY.md`.
