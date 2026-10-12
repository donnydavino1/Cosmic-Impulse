// Cosmic Impulse shared universe server.
// One solar system for everyone: a single game clock running at a fixed rate (300× real time by default), every
// connected pilot's ship broadcast to everyone else, asteroid mining shared (what one pilot digs out is gone for all),
// chat, outposts (persistent stations anyone can dock at to leave or collect supplies), pilot-versus-pilot hits checked
// by the server, and the world saved to disk so it carries on after a restart. No packages needed: Node 22+ only.
//
//   node server/universe.mjs                 → ws://localhost:8080   (status page: http://localhost:8080)
//   PORT=9000 RATE=300 node server/universe.mjs
//
// Players connect from the game: 🌐 Multiplayer → SHARED UNIVERSE → server address → Connect.
// A page served over https (GitHub Pages) can only connect to wss:// (TLS): put this behind any TLS proxy or host.
// Fair play: the server tells everyone which rules fingerprint each pilot runs; the game shows mismatches.
import http from 'node:http';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const PORT = +(process.env.PORT || 8080), RATE = +(process.env.RATE || 300);
const SAVE = process.env.SAVE || path.join(path.dirname(new URL(import.meta.url).pathname), 'universe-save.json');
const W = { T: 0, mined: {}, pilots: {}, chat: [], stations: {}, nextSt: 1 };   // the persistent world
try { Object.assign(W, JSON.parse(fs.readFileSync(SAVE, 'utf8'))); console.log('resumed world at game time', Math.round(W.T), 's'); } catch { }
const t0 = Date.now(), T0 = W.T, now = () => T0 + (Date.now() - t0) / 1000 * RATE;
const clients = new Map();                                     // socket → {id, name, st, fp}
let nextId = 1;

// ---------- a minimal WebSocket server (RFC 6455): text frames, ping/pong, close
function send(sock, obj) {
  if (sock.destroyed) return; const data = Buffer.from(JSON.stringify(obj)), n = data.length;
  const head = n < 126 ? Buffer.from([0x81, n]) : n < 65536 ? Buffer.from([0x81, 126, n >> 8, n & 255]) : Buffer.concat([Buffer.from([0x81, 127, 0, 0, 0, 0]), Buffer.from([n >>> 24, (n >> 16) & 255, (n >> 8) & 255, n & 255])]);
  sock.write(Buffer.concat([head, data]));
}
function frames(c, chunk, onText) {
  c.buf = Buffer.concat([c.buf, chunk]);
  for (;;) {
    const b = c.buf; if (b.length < 2) return; const op = b[0] & 15, masked = b[1] & 128; let len = b[1] & 127, off = 2;
    if (len === 126) { if (b.length < 4) return; len = b.readUInt16BE(2); off = 4 } else if (len === 127) { if (b.length < 10) return; len = Number(b.readBigUInt64BE(2)); off = 10 }
    const need = off + (masked ? 4 : 0) + len; if (b.length < need) return;
    let data = b.subarray(off + (masked ? 4 : 0), need);
    if (masked) { const m = b.subarray(off, off + 4); data = Buffer.from(data); for (let i = 0; i < data.length; i++) data[i] ^= m[i & 3] }
    c.buf = b.subarray(need);
    if (op === 1) onText(data.toString('utf8')); else if (op === 8) { c.sock.end(); return } else if (op === 9) c.sock.write(Buffer.concat([Buffer.from([0x8a, data.length]), data]));
    if (len > 1 << 20) { c.sock.destroy(); return }
  }
}
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'application/json', 'access-control-allow-origin': '*' });
  res.end(JSON.stringify({ game: 'Cosmic Impulse', universe: true, rate: RATE, T: now(), pilots: [...clients.values()].filter((c) => c.joined).map((c) => c.name), mined: Object.keys(W.mined).length, outposts: Object.values(W.stations).map((s) => ({ name: s.name, owner: s.owner, body: s.body })) }, null, 1));
});
server.on('upgrade', (req, sock) => {
  const key = req.headers['sec-websocket-key']; if (!key) return sock.destroy();
  const acc = crypto.createHash('sha1').update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64');
  sock.write('HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ' + acc + '\r\n\r\n');
  const c = { sock, buf: Buffer.alloc(0), id: nextId++, name: 'pilot', st: null, fp: '?' }; clients.set(sock, c); sock.setNoDelay(true);
  sock.on('data', (d) => frames(c, d, (txt) => { try { onMsg(c, JSON.parse(txt)) } catch { } }));
  sock.on('close', () => { clients.delete(sock); if (c.joined) { saveP(c); broadcast({ t: 'left', id: c.id, name: c.name }); } });
  sock.on('error', () => { });
});
// ---------- the game protocol (ORB-UNI/1, JSON): join → welcome; st (own ship) → ships (everyone); mine; say
function broadcast(o, except) { for (const c of clients.values()) if (c.joined && c !== except) send(c.sock, o) }
function saveP(c) { if (c.st) W.pilots[c.name] = { st: c.st, seen: Date.now() } }
function onMsg(c, m) {
  if (m.t === 'join') {
    c.name = String(m.name || 'pilot').slice(0, 24); c.fp = String(m.fp || '?').slice(0, 32); c.joined = true;
    send(c.sock, { t: 'welcome', v: 'ORB-UNI/1', id: c.id, T: now(), rate: RATE, mined: W.mined, chat: W.chat.slice(-20), last: W.pilots[c.name] || null, stations: Object.values(W.stations) });
    broadcast({ t: 'joined', id: c.id, name: c.name, fp: c.fp }, c);
  } else if (m.t === 'st' && c.joined) { c.st = m.s; c.stAt = Date.now() }
  else if (m.t === 'mine' && c.joined) { const k = String(+m.ast), kg = Math.max(0, Math.min(1e7, +m.kg || 0)); W.mined[k] = (W.mined[k] || 0) + kg; broadcast({ t: 'mined', ast: +m.ast, total: W.mined[k] }) }
  else if (m.t === 'build' && c.joined) buildStation(c, m);
  else if (m.t === 'deposit' && c.joined) moveStore(c, m, +1);
  else if (m.t === 'take' && c.joined) moveStore(c, m, -1);
  else if (m.t === 'open' && c.joined) { const st = W.stations[m.id]; if (st && st.owner === c.name) { st.open = !!m.open; stUpdate(st) } }
  else if (m.t === 'scrap' && c.joined) { const st = W.stations[m.id]; if (st && st.owner === c.name) { delete W.stations[m.id]; const back = { ...st.store }; for (const k in CORE) back[k] = (back[k] || 0) + CORE[k]; send(c.sock, { t: 'took', id: m.id, res: back, scrap: true }); broadcast({ t: 'station', id: m.id, gone: true }) } }
  else if (m.t === 'hit' && c.joined) pvpHit(c, m);
  else if (m.t === 'say' && c.joined) { const e = { name: c.name, text: String(m.text || '').slice(0, 200), at: Date.now() }; W.chat.push(e); W.chat = W.chat.slice(-100); broadcast({ t: 'say', ...e }) }
}
// ---------- outposts: the server owns what is stored in them, so supplies can never be duplicated
// An outpost is a 4-tonne core (the client pays its materials) on a closed orbit around one body; its orbit is stored as a
// state vector relative to that body at game time T0, and every client propagates it with Kepler's equation.
const CORE = { iron: 2000, silicates: 1500, nickel: 300, carbon: 200, platinum: 0.5 };
const KEYS = new Set(['water', 'carbon', 'silicates', 'iron', 'nickel', 'platinum', 'oxygen', 'food', 'spares', 'patch', 'chem', 'xe', 'h2', 'fus', 'am']);
const MAX_ST = +(process.env.MAX_OUTPOSTS || 5), CAP = 5e6;    // outposts per pilot; kg each outpost can hold
const fin = (v, lim) => typeof v === 'number' && isFinite(v) && Math.abs(v) <= lim;
function stUpdate(st) { broadcast({ t: 'station', st }) }
function buildStation(c, m) {
  const rel = m.rel; if (!Array.isArray(rel) || rel.length !== 6 || !rel.every((v, i) => fin(v, i < 3 ? 1e13 : 1e6)) || !fin(m.T, 1e15)) return send(c.sock, { t: 'denied', why: 'bad orbit' });
  if (Object.values(W.stations).filter((s) => s.owner === c.name).length >= MAX_ST) return send(c.sock, { t: 'denied', why: 'limit', max: MAX_ST });
  const id = 'o' + W.nextSt++, st = { id, name: String(m.name || c.name + "'s outpost").slice(0, 32), owner: c.name, body: String(m.body || 'Sun').slice(0, 24), rel, T0: +m.T, store: {}, open: true, built: Date.now() };
  W.stations[id] = st; send(c.sock, { t: 'built', id }); stUpdate(st);
}
function moveStore(c, m, sign) {
  const st = W.stations[m.id]; if (!st || typeof m.res !== 'object' || !m.res) return;
  if (sign < 0 && !st.open && st.owner !== c.name) return send(c.sock, { t: 'denied', why: 'private', id: st.id });   // anyone may leave supplies at any outpost
  const got = {}; let total = Object.values(st.store).reduce((a, b) => a + b, 0);
  for (const k in m.res) {
    if (!KEYS.has(k) || !fin(m.res[k], 1e7) || m.res[k] <= 0) continue; const have = st.store[k] || 0;
    const kg = sign > 0 ? Math.min(m.res[k], CAP - total) : Math.min(m.res[k], have); if (kg <= 0) continue;
    st.store[k] = Math.round((have + sign * kg) * 1000) / 1000; if (st.store[k] <= 1e-6) delete st.store[k]; total += sign * kg; got[k] = kg;
  }
  send(c.sock, { t: sign > 0 ? 'stored' : 'took', id: st.id, res: got, rq: m.rq }); stUpdate(st);
}
// ---------- pilot-versus-pilot: a hit only counts if both ships are within 2,100 km (their own reports) and it isn't absurd
function pvpHit(c, m) {
  const tgt = [...clients.values()].find((x) => x.joined && x.id === +m.to); if (!tgt || !tgt.st || !c.st || tgt === c) return;
  // both reports carried to the same game time (ships move ~7 km/s in low orbit, and reports come every half second)
  const at = now(), ext = (q) => { const dt = fin(q.T, 1e15) && Math.abs(at - q.T) < 3600 ? at - q.T : 0; return [q.x + (q.vx || 0) * dt, q.y + (q.vy || 0) * dt, q.z + (q.vz || 0) * dt] };
  const A = ext(tgt.st), Bp = ext(c.st), d = Math.hypot(A[0] - Bp[0], A[1] - Bp[1], A[2] - Bp[2]); if (!(d < 2.1e6)) return;
  const now2 = Date.now(); c.hits = (c.hits || []).filter((t) => now2 - t < 1000); if (c.hits.length >= 20) return; c.hits.push(now2);
  const E = Math.max(0, Math.min(5e9, +m.E || 0)); if (!E) return;
  send(tgt.sock, { t: 'hit', from: c.id, name: c.name, fp: c.fp, E, kind: ['laser', 'beam', 'kinetic', 'missile'].includes(m.kind) ? m.kind : 'kinetic' });
}
// twice a second everyone gets the clock and everyone else's ship
setInterval(() => {
  const T = now(), ships = [...clients.values()].filter((c) => c.joined && c.st).map((c) => ({ id: c.id, name: c.name, fp: c.fp, s: c.st }));
  for (const c of clients.values()) if (c.joined) send(c.sock, { t: 'ships', T, list: ships.filter((x) => x.id !== c.id) });
}, 500);
// the world is saved every 30 seconds and on shutdown
function persist() { W.T = now(); for (const c of clients.values()) if (c.joined) saveP(c); try { fs.writeFileSync(SAVE, JSON.stringify(W)) } catch (e) { console.warn('save failed', e.message) } }
setInterval(persist, 30000); process.on('SIGINT', () => { persist(); process.exit(0) }); process.on('SIGTERM', () => { persist(); process.exit(0) });
server.listen(PORT, () => console.log(`Cosmic Impulse universe on ws://localhost:${PORT} (×${RATE} time, save: ${SAVE})`));
