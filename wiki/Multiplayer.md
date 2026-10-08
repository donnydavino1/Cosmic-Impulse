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
