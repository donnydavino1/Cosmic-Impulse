"""Translation coverage for the game (Español, 中文).
1. Plays the desktop build headless in English (three.js replaced by the smoke-test stand-in), unlocks everything,
   opens every window and Engineering tab, and collects every text, title and placeholder on screen.
2. Reads every notify(...)/alertCrit(...) message template in game/js and turns it into a {} pattern.
3. Switches to each language and lists what the translator still leaves in English.
Usage: python3 tools/i18n-audit.py [--mobile] → tools/smoke/out/i18n-missing[-mobile].json  {lang: [{key, ex}]}
       python3 tools/i18n-audit.py --check  → exit code 1 if anything is missing (used by CI-style checks)"""
import os, re, sys, time, json, glob
from playwright.sync_api import sync_playwright
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
OUT = os.path.join(ROOT, 'tools', 'smoke', 'out'); os.makedirs(OUT, exist_ok=True)
NUM = re.compile(r'(?<![A-Za-z#])[-+−]?[0-9][0-9.,]*(?:e[+-]?[0-9]+)?')
KEEP = set('''Stellar Impulse ORB RULES RP AU NEO RTG ion VASIMR MPD JSON TLM GNU GPLv2 HUD AI Esc Tab Ctrl Shift Alt CoM Mk II III
 Kestrel Halcyon Tamsin Ophir Velka Corvo Nimbus Petra Aldra Brisa Cendre Dorrit Esk Fenwick Galt Hesper Ilsa Jory Kael Lumen Marrow Nyx Orrin
 Pell Quill Rook Sable Tarn Ulla Voss Wren Xan Yarrow Zell Ashby Brann Cove Dusk English Español Cinder Jackal Viper Magpie Hornet Shrike Wraith Talon Mantis'''.split())
# whole texts that stay as they are: ship style names, file names, the rules fingerprint, the language picker
KEEP_TEXT = {'Blue Lancer', 'Corsair', 'Ice Hauler', 'Nebula Runner', 'Solar Monk', 'Sunchaser (stock)', 'wiki.html', '○ Español', '● Español', '○ English', '● English'}
# ---------- 2. message templates in the code (notify, alerts, discoveries, game over, status lines)
def scan(src, i, stop):  # read a JS expression from i until a top-level character in stop; returns (text, end)
    d, q, out = 0, None, ''
    while i < len(src):
        c = src[i]
        if q:
            out += c
            if c == '\\': out += src[i + 1]; i += 2; continue
            if c == q: q = None
            elif q == '`' and src.startswith('${', i):
                j, dd = i + 2, 1
                while dd: dd += {'{': 1, '}': -1}.get(src[j], 0); j += 1
                out += src[i + 1:j]; i = j; continue
            i += 1; continue
        if c in '\'"`': q = c
        elif c in '([{': d += 1
        elif c in ')]}':
            if d == 0: return out, i
            d -= 1
        elif d == 0 and c in stop: return out, i
        out += c; i += 1
    return out, i
def to_key(expr):
    parts, depth, cur, q = [], 0, '', None
    for k, c in enumerate(expr):
        if q:
            cur += c
            if c == q and expr[k - 1] != '\\': q = None
            continue
        if c in '\'"`': q = c; cur += c; continue
        if c in '([{': depth += 1
        if c in ')]}': depth -= 1
        if depth == 0 and c == '+': parts.append(cur.strip()); cur = ''; continue
        cur += c
    parts.append(cur.strip()); key = ''
    for p in parts:
        if re.fullmatch(r"'(?:[^'\\]|\\.)*'|\"(?:[^\"\\]|\\.)*\"", p): key += p[1:-1].replace("\\'", "'")
        elif re.fullmatch(r'`(?:[^`\\]|\\.)*`', p, re.S): key += re.sub(r'\$\{(?:[^{}]|\{[^{}]*\})*\}', '{}', p[1:-1])
        else: key += '{}'
    return re.sub(r'(\{\}){2,}', '{}', key).strip()
def templates():
    out = set()
    for f in glob.glob(os.path.join(ROOT, 'game', 'js', '*.js')):
        src = open(f, encoding='utf-8').read(); exprs = []
        for m in re.finditer(r'\b(notify|alertCrit|gameOver|disc)\(', src):
            i, args = m.end(), []
            while True:
                e, i = scan(src, i, ',')
                args.append(e)
                if i >= len(src) or src[i] != ',': break
                i += 1
            exprs += [args[0]] if m.group(1) != 'disc' else [a for a in args[1:4:2] if a]
        for m in re.finditer(r'\b(?:wMsg|s\.msg)=', src): exprs.append(scan(src, m.end(), ';,')[0])
        for m in re.finditer(r'A\.push\(\{l:[^,]+,t:', src): exprs.append(scan(src, m.end(), ',')[0])
        for e in exprs:
            key = to_key(e)
            if len(re.findall(r'[A-Za-z]{3,}', key.replace('{}', ''))) >= 2: out.add(key)
    return sorted(out)
TPL = templates()
# ---------- 1 and 3. the game itself
BUILD = 'stellar-impulse-mobile.html' if '--mobile' in sys.argv else 'stellar-impulse.html'
s = open(os.path.join(ROOT, BUILD), encoding='utf-8').read()
s = re.sub(r'<script src="https://cdnjs[^"]*three[^"]*"></script>', '<script src="fake3.js"></script>', s)
s = re.sub(r'<script src="https://cdn.jsdelivr.net/npm/peerjs[^"]*"></script>', '', s)
P = os.path.join(ROOT, 'tools', 'smoke', '_audit.html'); open(P, 'w', encoding='utf-8').write(s)
GRAB = """(()=>{const out=[],w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){const p=n.parentNode;if(!p||['SCRIPT','STYLE','TEXTAREA'].includes(p.nodeName))continue;if(p.closest&&p.closest('svg'))continue;out.push(n.__src!==undefined?n.__src:n.nodeValue)}
 document.querySelectorAll('[title],[placeholder]').forEach(e=>{for(const a of['title','placeholder']){const v=e['__a_'+a]||e.getAttribute(a);if(v)out.push(v)}});return out})()"""
STEPS = [('guide', "openGuide()"), ('help', "document.getElementById('help').classList.remove('h')"), ('nav', "toggleNav()"),
         ('customize', "document.getElementById('cust').classList.remove('h')"), ('dash', "document.getElementById('wpal').classList.remove('h')"),
         ('multiplayer', "document.getElementById('mpw').classList.remove('h')"), ('contracts', "ctrToggle()"), ('ops', "opsToggle()"), ('builder', "bldToggle()"),
         ('cockpit', "toggleFP();setTimeout(()=>0,0)"), ('cockpit2', "0"), ('chase', "toggleFP();toggleSV()"), ('map', "toggleSV()"), ('info', "det=true"), ('raid', "raidStart()")]
res = {}
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1400, 'height': 1000}); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + P + '?lang=en'); time.sleep(2.5); ev = pg.evaluate
    ev("unlockAll()"); time.sleep(.3)
    seen = set()
    def grab():
        for t in ev(GRAB):
            for line in t.split('\n'):
                line = line.strip()
                if len(re.findall(r'[A-Za-z]{3,}', line)) and not re.fullmatch(r'#?[0-9a-fA-F]{3,8}', line): seen.add(line)
    grab()
    for name, js in STEPS:
        try: ev(js)
        except Exception: pass
        time.sleep(.6); grab()
    if BUILD.endswith('mobile.html'):
        ev("document.getElementById('mmenu').click()"); time.sleep(.5); grab()
        for i in range(ev("document.querySelectorAll('#mdlist button, #mdlist [data-c]').length")):
            try: ev(f"(document.querySelectorAll('#mdlist button, #mdlist [data-c]')[{i}]||{{}}).click&&0")
            except Exception: pass
        grab()
    ev("toggleShop()"); time.sleep(.4)
    for i in range(ev("document.querySelectorAll('#shopbody .tabs button').length")):
        ev(f"document.querySelectorAll('#shopbody .tabs button')[{i}].click()"); time.sleep(.5); grab()
    # data tables: every name and description the panels can show
    for t in ev("[...Object.values(PARTS).flatMap(p=>[p.n,p.d]),...TECH.flatMap(t=>[t.n,t.d]),...DR.flatMap(d=>[d.n,d.how,d.d]),...Object.values(FUEL).flatMap(f=>[f.n,f.full,f.how]),...WEP.flatMap(w=>[w.n,w.d])].filter(Boolean)"):
        seen.add(t.strip())
    ENV = set(w.lower() for t in seen | set(TPL) for w in re.findall(r'[A-Za-z]{3,}', t)) - {w.lower() for w in KEEP}
    items = []
    for t in sorted(seen):
        key = NUM.sub('{#}', t) if NUM.search(t) else t
        if t in KEEP_TEXT or re.fullmatch(r'[0-9a-f]{16}', t): continue
        items.append({'key': key, 'ex': t})
    items += [{'key': k, 'ex': None} for k in TPL]
    for lang in ['es', 'zh']:
        ev(f"setLang('{lang}')"); time.sleep(.3)
        OWN = {w.lower() for v in json.load(open(os.path.join(ROOT, 'game', 'i18n', lang + '.json'), encoding='utf-8')).values() for w in re.findall(r'[A-Za-zÀ-ÿ]{4,}', v)}
        outs = ev("L=>L.map(x=>x.ex!=null?(I18[x.key]!==undefined||I18[x.ex]!==undefined?'ok':tr(x.ex)):(I18[x.key]?'ok':null))", items)
        miss, keys = [], set()
        for it, o in zip(items, outs):
            if it['key'] in keys: continue
            if o is None: bad = True
            elif o == 'ok': bad = False
            else:
                words = [w.lower() for w in re.findall(r'[A-Za-zÀ-ÿ]{4,}', o)]
                bad = any(w in ENV and w not in OWN for w in words)
            if bad: keys.add(it['key']); miss.append(it)
        res[lang] = miss
    b.close()
os.remove(P)
json.dump(res, open(os.path.join(OUT, 'i18n-missing' + ('-mobile' if BUILD.endswith('mobile.html') else '') + '.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for l, m in res.items(): print(f'{l}: {len(m)} strings still in English (tools/smoke/out/i18n-missing.json)')
for e in errs: print('ERROR', e)
if '--check' in sys.argv and any(res.values()): sys.exit(1)
