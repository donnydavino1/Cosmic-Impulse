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
KEEP = set('''Cosmic Impulse ORB RULES RP AU NEO RTG ion VASIMR MPD JSON TLM GNU GPLv2 HUD AI Esc Tab Ctrl Shift Alt CoM Mk II III
 Kestrel Halcyon Tamsin Ophir Velka Corvo Nimbus Petra Aldra Brisa Cendre Dorrit Esk Fenwick Galt Hesper Ilsa Jory Kael Lumen Marrow Nyx Orrin
 Pell Quill Rook Sable Tarn Ulla Voss Wren Xan Yarrow Zell Ashby Brann Cove Dusk English Español Apophis Bennu Ryugu Eros Itokawa Didymos Ceres Vesta Psyche Eris Makemake Haumea Quaoar Gonggong Arrokoth Albion Sedna KBO Cinder Jackal Viper Magpie Hornet Shrike Wraith Talon Mantis'''.split())
# whole texts that stay as they are: ship style names, file names, the rules fingerprint, the language picker
KEEP_TEXT = {'t = m_fuel · vₑ² / (k · P)', 'v = c · tanh((vₑ/c) · ln(m₀/m₁))', 'Blue Lancer', 'Ada Reyes', 'Kenji Sato', 'Corsair', 'Ice Hauler', 'Nebula Runner', 'Solar Monk', 'Sunchaser (stock)', 'wiki.html', '○ Español', '● Español', '○ English', '● English'}
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
BUILD = 'cosmic-impulse-mobile.html' if '--mobile' in sys.argv else 'cosmic-impulse.html'
s = open(os.path.join(ROOT, BUILD), encoding='utf-8').read()
s = re.sub(r'<script src="https://cdnjs[^"]*three[^"]*"></script>', '<script src="fake3.js"></script>', s)
s = re.sub(r'<script src="https://cdn.jsdelivr.net/npm/peerjs[^"]*"></script>', '', s)
P = os.path.join(ROOT, 'tools', 'smoke', '_audit.html'); open(P, 'w', encoding='utf-8').write(s)
GRAB = """(()=>{const out=[],w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){const p=n.parentNode;if(!p||['SCRIPT','STYLE','TEXTAREA'].includes(p.nodeName))continue;if(p.closest&&p.closest('svg'))continue;out.push(n.__src!==undefined?n.__src:n.nodeValue)}
 document.querySelectorAll('[title],[placeholder]').forEach(e=>{for(const a of['title','placeholder']){const v=e['__a_'+a]||e.getAttribute(a);if(v)out.push(v)}});return out})()"""
STEPS = [('guide', "openGuide()"), ('help', "document.getElementById('help').classList.remove('h')"), ('nav', "toggleNav()"),
         ('customize', "document.getElementById('cust').classList.remove('h')"), ('dash', "document.getElementById('wpal').classList.remove('h')"),
         ('multiplayer', "document.getElementById('mpw').classList.remove('h')"), ('contracts', "ctrToggle()"), ('ops', "opsToggle()"), ('builder', "bldToggle()"),
         ('cockpit', "toggleFP();setTimeout(()=>0,0)"), ('cockpit2', "0"), ('chase', "toggleFP();toggleSV()"), ('map', "toggleSV()"), ('info', "det=true"), ('raid', "raidStart()"), ('thermal', "thermToggle();TH.at=0;thermDraw()"), ('thermal-fusion', "TH.eng=DR.findIndex(d=>d.id==='fus');TH.thr=60;TH.at=0;thermDraw()"), ('thermal-ion', "TH.eng=DR.findIndex(d=>d.id==='ion');TH.at=0;thermDraw();thermToggle()"),
         ('crew', "s.leak=1.4e-4;crewToggle()"), ('crew2', "crAt=0;crewDraw();crewToggle();s.leak=0"),
         ('designer', "desToggle()"), ('des-frame', "DSP.kind='frame';desType('al');desDraw()"), ('des-liner', "DSP.kind='liner';desType('pe');desDraw()"), ('des-sensor', "DSP.kind='sensor';desType('pa');desDraw()"), ('des-lab', "DSP.kind='lab';desType('station');desDraw()"), ('des-fab', "DSP.kind='fab';desType('orb');desDraw();desToggle()"),
         ('safety', "s.res.oxygen=1;safeToggle(false)"), ('safety2', "s.res.oxygen=600;safeToggle(true)"),
         ('deck', "window.__deckT=[];const c=document.createElement('canvas');c.width=640;c.height=340;const x=c.getContext('2d');x.fillText=t=>{t=String(t);if(!/[0-9]/.test(t))__deckT.push(t)};WT=null;for(const S of DECK.screens)S.draw(x,640,340);ALERTS=[{l:'crit',t:'Hull breach: losing oxygen'}];for(const S of DECK.screens)S.draw(x,640,340);ALERTS=[]"),
         ('interstellar', "window.confirm=m=>{for(const l of m.split('\\n'))if(!/[0-9]/.test(l))__deckT.push(l.replace(/^⚠ /,''));return false};toggleNav();istGo(B.findIndex(b=>b.star))"),
         ('cargo', "cargoToggle()"), ('cargo2', "CG.at=0;cargoDraw(true);cargoToggle()"),
         ('slow trip', "unlockAll();setDrive(DR.findIndex(d=>d.id==='ion'));s.fuel.xe=2000;recalc();apAsk(planDist(1.524,'Mars'),()=>0)"), ('slow trip2', "document.getElementById('tcw').classList.add('h');setDrive(0);recalc()"),
         ('workshop', "ewToggle('dfd')"), ('ws-dt', "EW.c.opt='dt';ewDraw()"), ('ws-dhe3', "EW.c.opt='dhe3';ewDraw()"), ('ws-pb11', "EW.c.opt='pb11';ewDraw()"), ('ws-icf', "EW.id='icf';ewLoad();ewDraw()"),
         ('ws-ion', "EW.id='ion';ewLoad();ewDraw()"), ('ws-kr', "EW.c.opt='kr';ewDraw()"), ('ws-ar', "EW.c.opt='ar';ewDraw()"), ('ws-mpd', "EW.id='mpd';ewLoad();EW.c.opt='li';ewDraw()"), ('ws-vas', "EW.id='vas';ewLoad();EW.c.opt='ar';ewDraw()"),
         ('ws-ntr', "EW.id='ntr';ewLoad();ewDraw()"), ('ws-ch4', "EW.c.opt='ch4';ewDraw()"), ('ws-nh3', "EW.c.opt='nh3';ewDraw()"), ('ws-wat', "EW.c.opt='wat';ewDraw()"), ('ws-chem', "EW.id='chem';ewLoad();ewDraw()"), ('ws-ml', "EW.c.opt='ml';ewDraw()"), ('ws-gcnr', "EW.id='gcnr';ewLoad();ewDraw()"), ('ws-hall', "EW.id='hall';ewLoad();ewDraw()"), ('ws-arc', "EW.id='arc';ewLoad();ewDraw()"), ('ws-solth', "EW.id='solth';ewLoad();ewDraw()"), ('ws-fus', "EW.id='fus';ewLoad();ewDraw();ewToggle()"),
         ('recorder', "wi=7"), ('recorder2', "frToggle()"), ('recorder3', "frToggle();wi=3"),
         ('spectro', "spOpen(AST.find(a=>a.t==='C'))"), ('spectro-S', "spDraw(AST.find(a=>a.t==='S'))"), ('spectro-M', "spDraw(AST.find(a=>a.t==='M'))"), ('spectro-I', "spDraw(AST.find(a=>a.t==='I')||AST[0]);spToggle()"),
         ('plan', "PL.stops=['Mars','Phobos','Earth'];plToggle()"), ('plan2', "plToggle()"), ('pork', "pkToggle()"), ('pork2', "pkToggle()"),
         ('ill', "s.crew.list[0].ill={k:'kidney',left:100};crewToggle()"), ('ill2', "crewToggle();delete s.crew.list[0].ill"),
         ('log', "notify('⚠ No heat-pipe radiators aboard.');lgToggle()"), ('log2', "lgToggle()"), ('crewfit', "s.exer=0;s.crew.list.forEach(m=>m.fit=50);crewToggle()"), ('crewfit2', "crewToggle();s.exer=2.5"),
         ('reac', "unlockAll();s.parts.push({id:'fis1',uid:9e5+3,cond:1,mk:1});s.parts.push({id:'ls_bio',uid:9e5+5,cond:1,mk:1});recalc();toggleShop()"), ('reac2', "toggleShop()"),
         ('sandbox', "sandboxSet(true)"), ('sandbox2', "sandboxSet(false)"),
         ('game over', "s.crew.alive=false;gameOver('a crash into Earth at 7.70 km/s')")]
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
    for t in ev("window.__deckT||[]"):
        if len(re.findall(r'[A-Za-z]{3,}', t)): seen.add(t.strip())
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
