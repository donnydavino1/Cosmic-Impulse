"""Two-player multiplayer test, no internet needed.
Opens the game twice in one headless Chromium (host on desktop build, guest on phone build), connects them with the
game's own MANUAL connection (WebRTC invite/reply codes, the same buttons a player uses), then checks:
hello + rules match, clock sync, both see the other ship, style + ledger summary arrive, sensors build a contact,
chat, a weapon hit is applied, and disconnect is handled. Run from repo root: python3 tools/smoke/mp_test.py
If WebRTC can't connect in this environment it falls back to an in-memory link (same message code path) and says so."""
import os, sys, time, re
from playwright.sync_api import sync_playwright
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
def prep(name):
    s = open(os.path.join(ROOT, name), encoding='utf-8').read()
    s = re.sub(r'<script src="https://cdnjs[^"]*three[^"]*"></script>', '<script src="fake3.js"></script>', s)
    s = re.sub(r'<script src="https://cdn.jsdelivr.net/npm/peerjs[^"]*"></script>', '', s)
    p = os.path.join(ROOT, 'tools', 'smoke', '_mp_' + name); open(p, 'w', encoding='utf-8').write(s); return 'file://' + p
fails, errs = [], []
def check(ok, what):
    print(('PASS ' if ok else 'FAIL ') + what)
    if not ok: fails.append(what)
with sync_playwright() as p:
    b = p.chromium.launch()
    H = b.new_context(viewport={'width': 1280, 'height': 800}).new_page()
    G = b.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True).new_page()
    for pg, n in [(H, 'host'), (G, 'guest')]:
        pg.on('pageerror', lambda e, n=n: errs.append(f'{n}: {e}'))
    H.goto(prep('cosmic-impulse.html')); G.goto(prep('cosmic-impulse-mobile.html')); time.sleep(2)
    for pg, n in [(H, 'Hosty'), (G, 'Guesty')]:
        pg.evaluate(f"document.getElementById('help').classList.add('h');MP.name='{n}'")
    G.evaluate("T+=3600*5")   # the guest starts at a different time: sync must fix it
    mode = 'webrtc'
    try:
        H.evaluate("manHost()"); H.wait_for_function("document.getElementById('mpcode').value.startsWith('ORBITAL-INVITE:')", timeout=20000)
        inv = H.evaluate("document.getElementById('mpcode').value")
        G.evaluate("v=>{document.getElementById('mpcode').value=v;manJoin()}", inv)
        G.wait_for_function("document.getElementById('mpcode').value.startsWith('ORBITAL-REPLY:')", timeout=20000)
        rep = G.evaluate("document.getElementById('mpcode').value")
        H.evaluate("v=>{document.getElementById('mpcode').value=v;manFinish()}", rep)
        H.wait_for_function("!!MP.conn", timeout=20000); G.wait_for_function("!!MP.conn", timeout=20000)
    except Exception as e:
        mode = 'memory'; print('note: WebRTC unavailable here (' + str(e).split('\n')[0][:80] + '); using the in-memory link')
        for pg in (H, G): pg.evaluate("window._q=[];")
        H.evaluate("mpAttach({send:x=>_q.push(x),close:()=>{}},'host')"); G.evaluate("mpAttach({send:x=>_q.push(x),close:()=>{}},'guest')")
    def pump(sec):
        t = time.time()
        while time.time() - t < sec:
            if mode == 'memory':
                a = H.evaluate("_q.splice(0)"); c = G.evaluate("_q.splice(0)")
                if a: G.evaluate("L=>L.forEach(mpRecv)", a)
                if c: H.evaluate("L=>L.forEach(mpRecv)", c)
            time.sleep(.1)
    pump(4)
    print('transport:', mode)
    check(H.evaluate("MP.role")=='host' and G.evaluate("MP.role")=='guest', 'roles assigned (host / guest)')
    check(H.evaluate("MP.peerName")=='Guesty' and G.evaluate("MP.peerName")=='Hosty', 'hello exchanged (names)')
    check(H.evaluate("RULES")==G.evaluate("RULES"), 'rules fingerprints match between desktop and phone builds')
    check(G.evaluate("MP.synced"), 'guest clock synchronised to host')
    check(H.evaluate("MP.fair") and G.evaluate("MP.fair"), 'fair play: rules + physics fingerprints match (%s)' % H.evaluate("ORB_RULES_FP"))
    check(abs(H.evaluate("T")-G.evaluate("T")) < 120, 'clocks agree (difference %.1f s)' % abs(H.evaluate("T")-G.evaluate("T")))
    check(H.evaluate("!!RS&&!RS.stale") and G.evaluate("!!RS&&!RS.stale"), 'each side sees the other ship')
    check(H.evaluate("!!(RS&&RS.cust&&RS.cust.trim)"), 'style arrives (hull colour, trim…)')
    pump(2.5)
    check(H.evaluate("!!(RS&&RS.led&&RS.led.m>0)"), 'ledger summary arrives (mass, elements, sensor tier)')
    H.evaluate("unlockAll()"); time.sleep(.3)
    c = H.evaluate("(()=>{const c=ORB.api.contacts().find(c=>c.kind==='player');return c?{n:c.name,l:c.lvl,m:c.mass,el:!!c.elements}:null})()")
    check(bool(c) and c['n']=='Guesty' and c['m'], 'host sensors report the guest as an ORB-TLM contact: %s' % c)
    G.evaluate("mpSend({t:'chat',from:MP.name,text:'hello from the phone'})"); pump(1)
    check('hello from the phone' in H.evaluate("JSON.stringify(MP.chat)"), 'chat delivered')
    # fly the guest to 1 km from the host (hits only count from a ship within ~2,000 km)
    st = H.evaluate("({x:s.x,y:s.y,z:s.z,vx:s.vx,vy:s.vy,vz:s.vz})")
    G.evaluate("o=>{s.x=o.x+1000;s.y=o.y;s.z=o.z;s.vx=o.vx;s.vy=o.vy;s.vz=o.vz;AP=null}", st); pump(1.5)
    check(H.evaluate("Math.hypot(RS.x-s.x,RS.y-s.y,RS.z-s.z)") < 2e6, 'host sees the guest arrive within weapon range (%.0f m)' % H.evaluate("Math.hypot(RS.x-s.x,RS.y-s.y,RS.z-s.z)"))
    h0 = G.evaluate("s.hull")
    H.evaluate("mpSend({t:'hit',E:2e7,kind:'laser'})"); pump(1)
    check(G.evaluate("s.hull") < h0, 'weapon hit applied to the other ship (%.0f → %.0f J)' % (h0, G.evaluate("s.hull")))
    # a player with modified physics: can fly together, but hits are ignored
    G.evaluate("mpRecv(JSON.stringify({t:'hello',name:'Hosty',rules:RULES,code:'x',phys:'modded00',role:'host',v:1}))")
    h1 = G.evaluate("s.hull"); H.evaluate("mpSend({t:'hit',E:2e7,kind:'laser'})"); pump(1)
    check(not G.evaluate("MP.fair") and G.evaluate("s.hull") >= h1 - 1, 'modified physics: fair play off, hits ignored')
    H.evaluate("mpClose()"); pump(2)
    check(not H.evaluate("!!MP.conn"), 'host disconnects cleanly')
    if mode == 'webrtc': check(not G.evaluate("!!MP.conn"), 'guest notices the disconnect')
    b.close()
for f in os.listdir(os.path.join(ROOT, 'tools', 'smoke')):
    if f.startswith('_mp_'): os.remove(os.path.join(ROOT, 'tools', 'smoke', f))
for e in errs: print('PAGE ERROR', e)
print('RESULT:', 'ALL PASSED' if not fails and not errs else f'{len(fails)} failed, {len(errs)} page errors')
sys.exit(1 if fails or errs else 0)
