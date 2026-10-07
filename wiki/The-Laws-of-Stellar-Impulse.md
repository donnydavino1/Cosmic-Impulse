# The Laws of Stellar Impulse

Stellar Impulse has no scripted progression and no special cases. Everything comes from a short list of laws, the same
for every ship, raider and player. Learn these and you can predict anything in the game, design anything, and
argue with anyone's ship on equal terms.

## The ten laws

1. **Gravity.** Everything attracts everything: a = G·M / r². Planets move on their real orbits; your ship falls
   around them. *(rules: `0100-physics.js`)*
2. **Momentum.** You change velocity only by throwing mass away (or by pushing on light). The rocket equation
   follows: Δv = vₑ · ln(m_full / m_empty). *(rules: `0100-physics.js`)*
3. **Conservation of matter.** Mass comes in elements (H, He, C, O, Si, Fe, Ni, Pt, Xe…). Nothing appears from
   nowhere: you mine it, buy it near Earth, or turn one thing into another by a recipe. *(rules: parts, fuel, ledger)*
4. **Conservation of energy.** Every action costs joules: building, research, firing, thrust from electric
   engines, life support. Energy comes from sunlight, reactors, or fuel. *(rules: budgets, manufacturing)*
5. **Heat.** Every watt you use becomes heat, and in vacuum the only way out is radiation (Stefan–Boltzmann: σT⁴
   per m² of radiator). Too much heat breaks parts and cooks crews. *(rules: `0500-budgets.js`)*
6. **The inverse square.** Sunlight, laser beams and radiation spread out: their strength falls with distance².
   Panels work 4× worse at twice the distance from the Sun; lasers deliver ¼ the energy at twice their focus range.
   *(rules: physics, world)*
7. **Light speed.** Nothing goes faster than c. Near it, time on your ship runs slow (γ = 1/√(1−v²/c²)) and the
   energy to go faster climbs without limit. *(rules: `0100-physics.js`)*
8. **Life.** A crew needs 0.84 kg oxygen, 2.5 kg water and 1.6 kg food per person per day, a cabin under 45 °C,
   CO₂ scrubbed, and a radiation dose under 6 Sv. *(rules: `2100-survival.js`)*
9. **Wear.** Parts age with use, heat and radiation, and fail at random; spare parts repair them.
   *(rules: `2100-survival.js`)*
10. **Information.** You only know what your sensors can see: range, precision and detail grow with your sensor
    technology; everything else is a guess. *(rules: `2550-sensors.js`)*

That's all. Prices, research costs and part stats are just *numbers* under these laws, listed on the
[[Engines]], [[Fuels]], [[Parts]] and [[Technologies]] pages.

## What emerges

None of these are coded as features; they fall out of the laws:

| You notice | Because of |
|---|---|
| Pushing forward makes you go *up* and *slower* | 1 + 2: orbital mechanics |
| Chemical rockets for leaving planets, ion and fusion for long trips | 2: thrust vs exhaust speed |
| The inner solar system is rich in power, the outer system in water and ice | 6 + 3 |
| Big lasers need big radiators | 4 + 5 |
| Fights are decided at short range, or by missiles at long range | 6 (lasers spread) + 2 (missiles carry their own Δv) |
| Interstellar crews age less than the people they left | 7 |
| A long trip is a supply-planning puzzle | 8 + 3 |
| Old ships break; prepared ships survive | 9 |
| Better sensors win battles before they start | 10 |
| Shielding from solar storms comes from hiding behind your own water and fuel | 3 + 8 |
| A probe launched from low orbit reaches farther than one launched in deep space | 1 + 2: the Oberth effect |

## Everything else is yours

The laws are the **rules** of the game, shared by every player so battles are fair (see [[Fair Play and Rules]]).
How your ship looks, how your cockpit reads, how your controls feel: that's the **client**, and you (or your AI)
can reshape it completely. See [[Build Your Own Stellar Impulse]].
