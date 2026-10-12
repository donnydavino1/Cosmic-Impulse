# The shared universe

One persistent solar system for everyone: a single game clock, every connected pilot's ship (drawn from their real
layout), shared asteroid mining, outposts that stay in the world, pilot-versus-pilot combat checked by the server, and
chat, saved to disk so the world carries on after a restart. The server is one small file with no dependencies:
[`server/universe.mjs`](../server/universe.mjs).

## Run a server

```sh
node server/universe.mjs                  # ws://localhost:8080, 300× time, saves to server/universe-save.json
PORT=9000 RATE=300 SAVE=/data/world.json MAX_OUTPOSTS=5 node server/universe.mjs
```

Open `http://localhost:8080` for a status page (game time, pilots online). Stop it with Ctrl+C: the world is saved.

## Join

In the game: 🌐 **Multiplayer → SHARED UNIVERSE**, type the server address (for example `ws://localhost:8080`) and
press **Connect**. While connected:

- **One clock:** your game time follows the server; time warp is the server's rate for everyone.
- **Other pilots** appear as ships and as sensor contacts (if your sensors reach them).
- **Mining is shared:** what anyone digs out of an asteroid is gone for everyone.
- **Outposts:** build one from 4 t of materials on your orbit; anyone can dock (within 5 km, under 50 m/s) to leave
  or collect supplies; the server owns what each one holds, so nothing is ever duplicated.
- **Combat:** other pilots within 2,000 km can be targeted and fired on; the server passes a hit on only if both ships
  are within 2,100 km and caps its energy at 5×10⁹ J (at most 20 hits a second per pilot).
- **Chat** goes to everyone online.
- **Fair play:** each pilot's rules fingerprint is shared; pilots running different rules are marked.

## Hosting for friends on the internet

The game on GitHub Pages is served over `https`, and browsers only let https pages connect to **`wss://`** (secure
WebSocket) servers. Run the server on any computer or cloud machine you control and put it behind a TLS proxy (for
example a web server with a free certificate) that forwards `wss://your-domain/` to `ws://localhost:8080`. For a quick
test on one computer, open the game from a local file or `http://localhost` and connect to `ws://localhost:8080`.

## Protocol (ORB-UNI/1, JSON over WebSocket)

| Direction | Message | Meaning |
|---|---|---|
| → server | `{t:'join', name, fp}` | join with a pilot name and rules fingerprint |
| ← server | `{t:'welcome', id, T, rate, mined, chat, last}` | your id, the shared clock, the mining state, recent chat |
| → server | `{t:'st', s:{T,x,y,z,vx,vy,vz,hull,cust,lay?}}` | your ship, twice a second; `T` is when it was true (others carry it along its orbit from then); `lay` (your layout, see PROTOCOL.md) every 10 s |
| ← server | `{t:'ships', T, list:[{id,name,fp,s}]}` | the clock and everyone else's ship, twice a second |
| → server | `{t:'mine', ast, kg}` | you mined `kg` from asteroid `ast` |
| ← server | `{t:'mined', ast, total}` | an asteroid's new mined total |
| → server | `{t:'build', name, body, rel:[x,y,z,vx,vy,vz], T}` | build an outpost: state relative to `body` at game time `T` (the client has already spent the 4 t core) |
| ← server | `{t:'built', id}` / `{t:'denied', why, max?}` | built, or refused (`limit`, `bad orbit`, `private`) |
| ← server | `{t:'station', st}` / `{t:'station', id, gone:true}` | an outpost appeared or changed / was dismantled; `st` = `{id,name,owner,body,rel,T0,store,open,built}` |
| → server | `{t:'deposit'|'take', id, res:{key:kg}, rq}` | leave or take supplies; keys: `water carbon silicates iron nickel platinum oxygen food spares chem xe h2 fus am` |
| ← server | `{t:'stored'|'took', id, res, rq, scrap?}` | what was actually stored or handed over (the client refunds or adds exactly that) |
| → server | `{t:'open', id, open}` / `{t:'scrap', id}` | owner only: make public/private, dismantle (returns the core and the stores via `took`) |
| → server | `{t:'hit', to, E, kind}` | you hit pilot `to` with `E` joules (`laser beam kinetic missile`) |
| ← server | `{t:'hit', from, name, fp, E, kind}` | someone hit you (only sent if both ships are within 2,100 km) |
| ↔ | `{t:'say', text}` / `{t:'say', name, text}` | chat |
| ← server | `{t:'joined'|'left', id, name}` | pilots coming and going |

An outpost's orbit is stored as a state vector relative to its body at `T0`; every client propagates it with Kepler's
equation (`kepProp` in `game/js/0100-physics.js`), so it costs the server nothing to keep thousands of them.

Next steps for the universe: a server that also checks the physics of every ship (fully authoritative), outposts
that produce things (fabricators, fuel depots), and factions.
