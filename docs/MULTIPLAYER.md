# Multiplayer

Two players share one solar system. There is **no game server**: the two games talk directly to each other
(peer to peer, over WebRTC). One player is the **host** and owns the shared clock; the other **joins** as the guest.
Desktop and phone builds can play together.

## Play together in 1 minute (room code)

1. Both players open the same game version (the same link, or `stellar-impulse.html` / `stellar-impulse-mobile.html` from the same zip).
2. Both press **P** (phone: ☰ → 🌐 Multiplayer & music → Multiplayer) and type a pilot name.
3. **Host:** press **🏠 Host a game**. A 6-letter room code appears (for example `K7QH2M`). Tell it to your friend.
4. **Guest:** type the code into *Friend's room code* and press **🔗 Join**.
5. Both see `✓ <name> is here, playing by the same rules (…)`. The guest's clock jumps to the host's;
   the guest's ship keeps its orbit relative to its planet.

The room code is only used by a free public **matchmaking server** (the PeerJS broker) to introduce the two
browsers. After that, all game data goes directly between them; the broker sees no game data.
The host's window must stay open while the guest joins.

## No internet matchmaking? Connect manually (3 steps)

Works with no server at all, for example on a LAN, or when the broker is blocked. Codes are long; send them by chat.

1. **Host:** press **1. Host: create invite code**. Copy the whole `ORBITAL-INVITE:…` text from the box and send it.
2. **Guest:** paste it into the box, press **2. Friend: paste invite, make reply**. Copy the `ORBITAL-REPLY:…` text back.
3. **Host:** paste the reply into the box, press **3. Host: paste reply, finish**.

Two windows on one computer can connect this way too, which is the easiest way to try multiplayer alone.

## Your own matchmaking server (optional)

Run a PeerJS server (`npm i -g peer` then `peerjs --port 9000`) and open the game with:

```
stellar-impulse.html?peerhost=192.168.1.20&peerport=9000&peerpath=/&peersecure=0
```

Both players must use the same parameters. `peersecure=0` is for plain `http`/`ws`; leave it out for `https`.
(The published claude.ai pages can't take URL parameters; use the files from the zip for this.)

## Rules must match

On connecting, each game sends two fingerprints (`docs/PROTOCOL.md`):

- **`RULES`**: every gameplay number. If it differs you get a ⚠ warning: the physics will disagree, so use the same
  game file. Desktop and phone builds of one version always match.
- **`ORB_FP`**: the exact code. If only this differs (same rules, different build) you get an ℹ note and can play.

## What is shared

| Shared | How |
|---|---|
| Clock and time speed | host broadcasts 5×/s and on every change; the guest's ⏩/⏪/pause buttons ask the host |
| Ship position and velocity | each side 10×/s, propagated between updates |
| Engine burn, hull, alive | in every ship update |
| Style (colours, shape, trim…) | every 2 s |
| Ledger summary (mass, element fractions, sensor tier, weapons, missiles) | every 2 s; what you see of it depends on **your** sensor tier |
| Weapon hits | the shooter sends the energy; the target applies it only if the shooter is within ~2,000 km |
| Wrecks and salvage, solar storms, chat | as events |

Not shared yet: raider waves (single-player only), asteroids mined, research. Close encounters lock time to real
speed for both players.

## Troubleshooting

| Problem | Fix |
|---|---|
| “PeerJS library did not load” | offline or blocked network: use the manual connection |
| Host shows a code, guest can't join | check the code; host window must stay open; try the manual connection |
| Manual codes don't connect | some networks block direct connections (strict NAT); try another network or a phone hotspot |
| ⚠ different rules | both open the same version (same link or same zip) |
| Guest's time jumped | expected: the host owns the clock |

## Messages

The message list (`hello`, `clock`, `req`, `ship`, `hit`, `wreck`, `wgone`, `loot`, `flare`, `chat`, `ping`/`pong`)
and their fields are in `docs/PROTOCOL.md` → ORB-NET/1. Code: `game/js/2800-multiplayer.js`.

## Testing

`python3 tools/smoke/mp_test.py` opens the game twice in a headless browser (host on the desktop build, guest on the
phone build), connects them with the **manual WebRTC path** (the same buttons players use), and checks: roles,
names, matching rules, clock sync, both ships visible, style and ledger arriving, the guest appearing as a sensor
contact, chat, a weapon hit landing within range, and clean disconnects. It needs no internet. If WebRTC is not
available it falls back to an in-memory link that exercises the same message code. The room-code path needs the
public broker, so test it by hand: two browser windows, Host in one, Join in the other.
