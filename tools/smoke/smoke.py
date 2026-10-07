"""Headless browser smoke test for both builds (no network needed).
Needs: python3 + playwright (with Chromium). Run from the repo root: python3 tools/smoke/smoke.py
three.js is replaced by tools/smoke/fake3.js, which keeps game logic running but draws no 3D.
Screenshots go to tools/smoke/out/. Exit code 1 if any page error happened."""
import os, sys, time, re
from playwright.sync_api import sync_playwright
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
OUT = os.path.join(ROOT, 'tools', 'smoke', 'out'); os.makedirs(OUT, exist_ok=True)
def prep(name):
    s = open(os.path.join(ROOT, name), encoding='utf-8').read()
    s = re.sub(r'<script src="https://cdnjs[^"]*three[^"]*"></script>', '<script src="fake3.js"></script>', s)
    s = re.sub(r'<script src="https://cdn.jsdelivr.net/npm/peerjs[^"]*"></script>', '', s)
    p = os.path.join(ROOT, 'tools', 'smoke', '_' + name); open(p, 'w', encoding='utf-8').write(s); return 'file://' + p
errs = []
with sync_playwright() as p:
    b = p.chromium.launch()
    for name, ctx in [('stellar-impulse.html', dict(viewport={'width': 1280, 'height': 800})),
                      ('stellar-impulse-mobile.html', dict(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True))]:
        pg = b.new_context(**ctx).new_page(); pg.on('pageerror', lambda e, n=name: errs.append(f'{n}: {e}'))
        pg.goto(prep(name)); time.sleep(2); ev = pg.evaluate
        ev("document.getElementById('help').classList.add('h')")
        ev("raidStart()"); time.sleep(1.5)
        for k in ['2', '5']: pg.keyboard.press(k); time.sleep(.4)
        ev("toggleFP()"); time.sleep(1); pg.screenshot(path=os.path.join(OUT, name + '-cockpit.png'))
        ev("toggleFP()"); ev("unlockAll()"); time.sleep(.5)
        c = ev("ORB.api.contacts().length"); L = ev("ORB.api.ledger().mass")
        print(f'{name}: contacts {c}, ledger mass {L:.0f} kg, fingerprint {ev("ORB_FP")}, layout {ev("SH.lay.mods.length")} modules, 180° turn {ev("SH.lay.flip"):.0f} s')
        if not ev("SH.lay&&isFinite(SH.lay.flip)&&SH.lay.L>0"): errs.append(name + ': ship layout metrics missing')
        ev("CB.raiders.filter(o=>o.alive).forEach(o=>hit({kind:'drone',o},1e9,'laser',1e4))"); time.sleep(.5)
        pg.screenshot(path=os.path.join(OUT, name + '-chase.png'))
    b.close()
for e in errs: print('ERROR', e)
sys.exit(1 if errs else 0)
