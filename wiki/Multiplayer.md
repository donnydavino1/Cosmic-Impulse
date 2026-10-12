# Multiplayer

Two players share one solar system, computer or phone.

1. Both press **P** (phone: ☰ → Multiplayer) and type a pilot name.
2. **Host:** *🏠 Host a game* → read out the 6-letter room code.
3. **Guest:** type the code → *🔗 Join*.

No internet matchmaking? Use the 3-step **manual connection** (invite code → reply code → finish). It also works
between two windows on one computer.

The host owns the clock. You see each other's ship, style and (through your sensors) what it carries.
Battles are on only when both games have the same rules and physics ([[Fair Play and Rules]]).

Full guide with troubleshooting and self-hosted servers: `docs/MULTIPLAYER.md`.

## The shared universe

Besides two-player games, Cosmic Impulse can run a **persistent shared universe**: one solar system for everyone on a
server anyone can run (`node server/universe.mjs`). In 🌐 Multiplayer → **SHARED UNIVERSE**, type the server address
and press **Connect**. Everyone shares one clock, sees each other's ships, mines the same asteroids (what one pilot
digs out is gone for all) and can chat. The world is saved, so it carries on after the server restarts. Hosting
details are in `docs/UNIVERSE.md`.

### Outposts

With 4 tonnes of materials aboard (2,000 kg iron, 1,500 kg silicates, 300 kg nickel, 200 kg carbon, 0.5 kg platinum
metals) you can turn them into an **outpost** on your current orbit: 🌐 Multiplayer → SHARED UNIVERSE → 🛰 OUTPOSTS →
**🏗 Build an outpost here**. It needs a closed orbit clear of the surface, and it stays in the universe for every pilot,
even while you are offline: a station with a turning habitat ring, solar wings and blinking docking lights.

- **🧭 Fly here** plans a real rendezvous: a coasting transfer that meets the outpost about a third of an orbit later
  (worked out with Kepler's equation), one burn to start it, coasting, then a gentle final approach. From 460 km behind
  in low Earth orbit that costs about 150 kg of chemical propellant.
- **Docked** means within 5 km and slower than 50 m/s relative. Then you can **⬇ Leave** or **⬆ Take** materials,
  supplies and propellant. The server keeps what each outpost holds, so supplies can never be duplicated, and what you
  leave or take leaves or joins your ship exactly.
- An owner can make an outpost **🔒 private** (only they can take; anyone can still leave supplies) and **♻ Dismantle**
  it while docked to get its 4 tonnes and everything inside back. A server allows 5 outposts per pilot (MAX_OUTPOSTS).

### Fighting other pilots

Other pilots within 2,000 km can be targeted (**O**) and fired on. The server only passes a hit on if both ships really
are within 2,100 km of each other and caps its energy, and your game only accepts it from a pilot running the same
rules (physics fingerprint). Hits land on your modules exactly as raider hits do ([[Combat]]).

### Seeing each other's ships

Other players now see **your real ship**: its modules in their order, radial mounts, radiators, armour, weapons, upgrade
bands, engine and solar wings, sent as a small layout description (only what their eyes would see). In two-player games
this works the same way.
