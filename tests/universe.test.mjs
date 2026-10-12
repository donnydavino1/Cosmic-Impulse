// The shared universe server: join, welcome with the shared clock, other pilots, shared mining, saving.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
const PORT = 18000 + Math.floor(Math.random() * 1000), SAVE = '/tmp/ci-universe-' + PORT + '.json';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
function client(name) {
  const ws = new WebSocket(`ws://localhost:${PORT}`), got = [];
  ws.onmessage = (e) => got.push(JSON.parse(e.data));
  return new Promise((res) => { ws.onopen = () => { ws.send(JSON.stringify({ t: 'join', name, fp: 'test' })); res({ ws, got }) } });
}
test('two pilots share one universe', async () => {
  const srv = spawn(process.execPath, ['server/universe.mjs'], { env: { ...process.env, PORT: String(PORT), SAVE, RATE: '300' }, stdio: 'ignore' });
  try {
    await wait(700);
    const a = await client('Alice'), b = await client('Bob');
    await wait(300);
    const wa = a.got.find((m) => m.t === 'welcome'); assert.ok(wa, 'welcome'); assert.equal(wa.rate, 300); assert.ok(wa.T >= 0);
    a.ws.send(JSON.stringify({ t: 'st', s: { x: 1, y: 2, z: 3, vx: 0, vy: 0, vz: 0, hull: 1 } }));
    a.ws.send(JSON.stringify({ t: 'mine', ast: 3, kg: 250 }));
    await wait(1200);
    assert.ok(b.got.some((m) => m.t === 'ships' && m.list.some((x) => x.name === 'Alice')), 'Bob sees Alice');
    assert.ok(b.got.some((m) => m.t === 'mined' && m.ast === 3 && m.total === 250), 'mining is shared');
    a.ws.close(); b.ws.close();
  } finally { srv.kill('SIGTERM'); await wait(400) }
  const saved = JSON.parse(fs.readFileSync(SAVE, 'utf8')); assert.equal(saved.mined['3'], 250, 'the world is saved'); fs.unlinkSync(SAVE);
});
test('outposts keep supplies on the server and pilot hits are range-checked', async () => {
  const P2 = PORT + 1, SV2 = SAVE + '.2';
  const srv = spawn(process.execPath, ['server/universe.mjs'], { env: { ...process.env, PORT: String(P2), SAVE: SV2, RATE: '300', MAX_OUTPOSTS: '1' }, stdio: 'ignore' });
  const cl = (name) => { const ws = new WebSocket(`ws://localhost:${P2}`), got = []; ws.onmessage = (e) => got.push(JSON.parse(e.data));
    return new Promise((res) => { ws.onopen = () => { ws.send(JSON.stringify({ t: 'join', name, fp: 'test' })); res({ ws, got, send: (o) => ws.send(JSON.stringify(o)) }) } }) };
  try {
    await wait(700);
    const a = await cl('Alice'), b = await cl('Bob'); await wait(200);
    a.send({ t: 'build', name: 'Depot', body: 'Earth', rel: [7e6, 0, 0, 0, 7546, 0], T: 0 }); await wait(250);
    const st = b.got.find((m) => m.t === 'station' && m.st).st; assert.equal(st.name, 'Depot'); assert.equal(st.owner, 'Alice');
    a.send({ t: 'build', name: 'Second', body: 'Earth', rel: [8e6, 0, 0, 0, 7000, 0], T: 0 }); await wait(200);
    assert.ok(a.got.some((m) => m.t === 'denied' && m.why === 'limit'), 'outpost limit per pilot');
    a.send({ t: 'deposit', id: st.id, res: { iron: 500, bogus: 9 }, rq: 1 }); await wait(200);
    assert.deepEqual(a.got.find((m) => m.t === 'stored').res, { iron: 500 }, 'only real resources are stored');
    b.send({ t: 'take', id: st.id, res: { iron: 800 }, rq: 2 }); await wait(200);
    assert.equal(b.got.find((m) => m.t === 'took').res.iron, 500, 'you can only take what is there');
    a.send({ t: 'open', id: st.id, open: false }); a.send({ t: 'deposit', id: st.id, res: { water: 100 }, rq: 3 }); await wait(200);
    b.send({ t: 'take', id: st.id, res: { water: 100 }, rq: 4 }); await wait(200);
    assert.ok(b.got.some((m) => m.t === 'denied' && m.why === 'private'), 'a private outpost refuses others');
    // hits: only between ships within 2,100 km
    a.send({ t: 'st', s: { T: 0, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, hull: 1 } }); b.send({ t: 'st', s: { T: 0, x: 5e6, y: 0, z: 0, vx: 0, vy: 0, vz: 0, hull: 1 } }); await wait(150);
    const ida = a.got.find((m) => m.t === 'welcome').id;
    b.send({ t: 'hit', to: ida, E: 1e8, kind: 'laser' }); await wait(200);
    assert.ok(!a.got.some((m) => m.t === 'hit'), 'out of range: no hit');
    b.send({ t: 'st', s: { T: 0, x: 1e6, y: 0, z: 0, vx: 0, vy: 0, vz: 0, hull: 1 } }); await wait(150);
    b.send({ t: 'hit', to: ida, E: 1e20, kind: 'laser' }); await wait(200);
    const h = a.got.find((m) => m.t === 'hit'); assert.ok(h && h.name === 'Bob' && h.E === 5e9, 'in range: passed on, energy capped');
    a.send({ t: 'scrap', id: st.id }); await wait(200);
    const back = a.got.filter((m) => m.t === 'took').pop(); assert.ok(back.scrap && back.res.iron === 2000 && back.res.water === 100, 'dismantling returns the core and the stores');
    assert.ok(b.got.some((m) => m.t === 'station' && m.gone), 'everyone sees it go');
    a.ws.close(); b.ws.close();
  } finally { srv.kill('SIGTERM'); await wait(400) }
  try { fs.unlinkSync(SV2) } catch { }
});
test('outpost orbits follow Kepler: one period returns to the start, and energy is conserved', async () => {
  const { gameData } = await import('../tools/game-data.mjs');
  const r = gameData(['0100-physics.js'], `(()=>{const mu=3.986e14,r=[7e6,0,0],v=[0,8200,300],a=1/(2/7e6-(8200**2+300**2)/mu),P=2*Math.PI*Math.sqrt(a**3/mu);
    const one=kepProp(mu,r,v,P),half=kepProp(mu,r,v,P/2),E=(q)=>(q[3]**2+q[4]**2+q[5]**2)/2-mu/Math.hypot(q[0],q[1],q[2]);
    // numerical check: leapfrog integration for a third of an orbit
    let x=[...r],u=[...v];const n=200000,h=P/3/n,acc=(p)=>{const d=Math.hypot(...p)**3;return p.map(c=>-mu*c/d)};let A=acc(x);
    for(let i=0;i<n;i++){u=u.map((c,k)=>c+A[k]*h/2);x=x.map((c,k)=>c+u[k]*h);A=acc(x);u=u.map((c,k)=>c+A[k]*h/2)}
    const third=kepProp(mu,r,v,P/3);return{back:Math.hypot(one[0]-r[0],one[1]-r[1],one[2]-r[2]),dE:Math.abs(E(half)-E([...r,...v])),num:Math.hypot(third[0]-x[0],third[1]-x[1],third[2]-x[2])}})()`);
  assert.ok(r.back < 1, 'back after one period, off by ' + r.back + ' m');
  assert.ok(r.dE < 1e-3, 'energy ' + r.dE);
  assert.ok(r.num < 50, 'matches numerical integration within ' + r.num + ' m');
});
