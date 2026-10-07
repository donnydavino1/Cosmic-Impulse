# Contributing

Thank you for helping build Stellar Impulse. A few principles keep the game fair and the code healthy.

1. **The Rules are sacred.** Every gameplay number belongs in `src/rules/rules.js`, nowhere else.
   Changing it changes the rules fingerprint, which means players on different versions can no
   longer fight each other. Propose rule changes in an issue first, explain the physics, and
   regenerate `RULES.md` with `npm run rules`.
2. **No free lunch.** Every new option must trade something for something else: mass, energy,
   heat, fuel, exposure, time. Add a test in `tests/kernel.test.mjs` that proves the tradeoff.
3. **Physics first, then fun.** Use real equations and published engineering data, and note the
   source in a comment. Where a simplification is needed for performance or fun, say so plainly.
4. **The kernel stays pure.** Nothing in `src/kernel/` may touch the DOM, graphics, the network
   or the clock. It must stay deterministic so a server can run it.
5. **Customization never changes capability.** Cosmetic and interface options are welcome without
   limit, but they may only change how information is shown, never what a ship can do or know.
6. **Free means free.** No feature may let real money buy ships, weapons, resources or advantages.

Before opening a pull request, run `npm test` and `npm run build`, and commit the updated
`dist/` and `RULES.md`.

By contributing you agree that your work is released under the GNU GPLv2.
