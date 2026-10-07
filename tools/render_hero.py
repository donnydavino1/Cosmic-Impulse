"""Renders docs/images/cosmic-impulse-ship.png: a ray-traced spaceship on a transparent background, for the README.
A tiny numpy ray tracer: cylinders, cones, capsules, boxes and spheres; sunlight with hard shadows, a blue fill light
from a planet below, Blinn-Phong highlights, procedural panel seams, windows, crinkled gold foil, solar cells and
radiator tubes, then filmic tone mapping. Usage: python3 tools/render_hero.py [width] [height] (needs numpy, Pillow)."""
import sys, os, numpy as np
from PIL import Image

BG = "--bg" in sys.argv; sys.argv = [a for a in sys.argv if a != "--bg"]
W = int(sys.argv[1]) if len(sys.argv) > 1 else 1500
H = int(sys.argv[2]) if len(sys.argv) > 2 else 620
SS = 2                                    # supersampling per axis
RW, RH = W * SS, H * SS
F = np.float32
INF = F(1e9)

def norm(v):
    return v / np.maximum(np.linalg.norm(v, axis=-1, keepdims=True), 1e-9)

# ---------------- camera
cam = np.array([-11.0, 8.0, 27.5], F); look = np.array([10.8, .2, 0.0], F); up = np.array([0, 1, 0], F)
fw = norm(look - cam); rt = norm(np.cross(fw, up)); upv = np.cross(rt, fw); fov = np.tan(np.radians(31) / 2)
ys, xs = np.mgrid[0:RH, 0:RW].astype(F)
px = (2 * (xs + .5) / RW - 1) * fov * RW / RH; py = (1 - 2 * (ys + .5) / RH) * fov
D = norm(px[..., None] * rt + py[..., None] * upv + fw).reshape(-1, 3)
O = np.broadcast_to(cam, D.shape)

# ---------------- primitives: (kind, params, material)
P = []
def cyl(x0, x1, r, cy=0, cz=0, m='hull', caps=True): P.append(('cyl', (x0, x1, r, cy, cz, caps), m))
def cone(x0, x1, r0, r1, m='bell'): P.append(('cone', (x0, x1, r0, r1), m))
def cap(a, b, r, m='metal'): P.append(('cap', (np.array(a, F), np.array(b, F), r), m))
def box(lo, hi, m): P.append(('box', (np.array(lo, F), np.array(hi, F)), m))
def sph(c, r, m, clip=None): P.append(('sph', (np.array(c, F), r, clip), m))

# crew cabin with a rounded nose, docking ring, gold-foil tank, truss, reactor with shadow shield, radiators, engine
sph((.9, 0, 0), 2.1, 'hull', clip=('xlt', .9)); cyl(.9, 4.2, 2.1, m='hull')
cyl(3.9, 4.25, 2.22, m='metal'); cyl(4.3, 6.9, 2.25, m='foil'); cyl(6.9, 7.2, 1.6, m='metal')
for (yy, zz) in [(.75, .75), (-.75, .75), (.75, -.75), (-.75, -.75)]: cap((7.1, yy, zz), (15.6, yy, zz), .08, 'metal')
for k in range(6):
    xa, xb = 7.1 + k * 1.42, 7.1 + (k + 1) * 1.42
    for (a, b) in [((.75, .75), (-.75, .75)), ((.75, -.75), (-.75, -.75)), ((.75, .75), (.75, -.75)), ((-.75, .75), (-.75, -.75))]:
        s = 1 if k % 2 else -1
        cap((xa, a[0], a[1]), (xb, b[0] if s > 0 else a[0], b[1] if s > 0 else a[1]) if False else (xb, b[0], b[1]), .045, 'metal')
cap((6.9, 0, 0), (16, 0, 0), .22, 'dark')
cone(15.6, 16.0, 1.75, 1.15, 'dark'); cyl(16.0, 18.3, 1.25, m='dark'); cyl(16.4, 16.6, 1.32, m='metal'); cyl(17.7, 17.9, 1.32, m='metal')
box((16.4, 1.45, -.035), (20.0, 6.2, .035), 'rad'); box((16.4, -6.2, -.035), (20.0, -1.45, .035), 'rad')
cap((18.2, 1.3, 0), (18.2, 6.2, 0), .09, 'metal'); cap((18.2, -1.3, 0), (18.2, -6.2, 0), .09, 'metal')
cone(18.4, 22.6, .62, 2.05, 'bell'); cyl(18.25, 18.5, .9, m='dark')
# solar wings on masts beside the tank, and a dish on the cabin
for s in (1, -1):
    cap((5.6, 0, s * 2.2), (5.6, 0, s * 3.2), .07, 'metal')
    box((3.0, -.03, s * 3.2 if s > 0 else -14.2), (8.2, .03, 14.2 if s > 0 else -3.2), 'solar')
cap((2.2, 2.0, 0), (2.2, 3.3, 0), .09, 'metal'); sph((2.2, 4.9, 0), 1.75, 'dish', clip=('dish', 4.9 - 1.0))
# small RCS blocks and a turret
for s in (1, -1): box((.95, s * 1.85 - .25, -.25), (1.45, s * 1.85 + .25, .25), 'dark')
sph((10.5, 1.15, 0), .42, 'dark'); cap((10.5, 1.3, 0), (8.7, 1.45, 0), .06, 'dark')

# ---------------- intersection (vectorised over rays)
def hit(kind, p, O, D):
    ox, oy, oz = O[:, 0], O[:, 1], O[:, 2]; dx, dy, dz = D[:, 0], D[:, 1], D[:, 2]
    t = np.full(len(D), INF, F)
    if kind == 'cyl':
        x0, x1, r, cy, cz, caps = p; ay, az = oy - cy, oz - cz
        a = dy * dy + dz * dz; b = 2 * (ay * dy + az * dz); c = ay * ay + az * az - r * r; disc = b * b - 4 * a * c
        ok = (disc > 0) & (a > 1e-9); sq = np.sqrt(np.maximum(disc, 0))
        for tt in ((-b - sq) / (2 * a + 1e-12), (-b + sq) / (2 * a + 1e-12)):
            x = ox + dx * tt; g = ok & (tt > 1e-3) & (x >= x0) & (x <= x1) & (tt < t); t = np.where(g, tt, t)
        if caps:
            for xc in (x0, x1):
                tt = (xc - ox) / np.where(np.abs(dx) < 1e-9, 1e-9, dx); y = ay + dy * tt; z = az + dz * tt
                g = (tt > 1e-3) & (y * y + z * z <= r * r) & (tt < t); t = np.where(g, tt, t)
    elif kind == 'cone':
        x0, x1, r0, r1 = p; k = (r1 - r0) / (x1 - x0); w0 = r0 + k * (ox - x0)
        a = dy * dy + dz * dz - (k * dx) ** 2; b = 2 * (oy * dy + oz * dz - w0 * k * dx); c = oy * oy + oz * oz - w0 * w0
        disc = b * b - 4 * a * c; ok = disc > 0; sq = np.sqrt(np.maximum(disc, 0)); aa = np.where(np.abs(a) < 1e-9, 1e-9, a)
        for tt in ((-b - sq) / (2 * aa), (-b + sq) / (2 * aa)):
            x = ox + dx * tt; g = ok & (tt > 1e-3) & (x >= x0) & (x <= x1) & (tt < t); t = np.where(g, tt, t)
    elif kind == 'cap':
        A, B, r = p; ba = B - A; oa = O - A; baba = ba @ ba; bard = D @ ba; baoa = oa @ ba; rdoa = np.sum(D * oa, 1); oaoa = np.sum(oa * oa, 1)
        a = baba - bard * bard; b = baba * rdoa - baoa * bard; c = baba * oaoa - baoa * baoa - r * r * baba; h = b * b - a * c
        ok = (h >= 0) & (np.abs(a) > 1e-9); tt = (-b - np.sqrt(np.maximum(h, 0))) / np.where(np.abs(a) < 1e-9, 1, a); y = baoa + tt * bard
        g = ok & (y > 0) & (y < baba) & (tt > 1e-3); t = np.where(g, tt, t)
        for E in (A, B):  # rounded ends
            oc = O - E; bb = np.sum(D * oc, 1); cc = np.sum(oc * oc, 1) - r * r; hh = bb * bb - cc; tt = -bb - np.sqrt(np.maximum(hh, 0))
            g = (hh > 0) & (tt > 1e-3) & (tt < t); t = np.where(g, tt, t)
    elif kind == 'box':
        lo, hi = p; inv = 1 / np.where(np.abs(D) < 1e-9, 1e-9, D); t0 = (lo - O) * inv; t1 = (hi - O) * inv
        tn = np.max(np.minimum(t0, t1), 1); tf = np.min(np.maximum(t0, t1), 1); g = (tf >= tn) & (tf > 1e-3)
        t = np.where(g, np.where(tn > 1e-3, tn, tf), t)
    elif kind == 'sph':
        Cc, r, clip = p; oc = O - Cc; b = np.sum(D * oc, 1); c = np.sum(oc * oc, 1) - r * r; h = b * b - c; ok = h > 0; sq = np.sqrt(np.maximum(h, 0))
        for tt in (-b - sq, -b + sq):
            q = O + D * tt[:, None]; g = ok & (tt > 1e-3) & (tt < t)
            if clip and clip[0] == 'xlt': g &= q[:, 0] <= clip[1]
            if clip and clip[0] == 'dish': g &= q[:, 1] <= clip[1]
            t = np.where(g, tt, t)
    return t

def normal(kind, p, Q, Dd):
    if kind == 'cyl':
        x0, x1, r, cy, cz, caps = p; n = np.stack([np.zeros(len(Q), F), Q[:, 1] - cy, Q[:, 2] - cz], 1)
        if caps:
            n[np.abs(Q[:, 0] - x0) < 1e-3] = (-1, 0, 0); n[np.abs(Q[:, 0] - x1) < 1e-3] = (1, 0, 0)
    elif kind == 'cone':
        x0, x1, r0, r1 = p; k = (r1 - r0) / (x1 - x0); rr = r0 + k * (Q[:, 0] - x0); n = np.stack([-k * rr, Q[:, 1], Q[:, 2]], 1)
    elif kind == 'cap':
        A, B, r = p; ba = B - A; h = np.clip(((Q - A) @ ba) / (ba @ ba), 0, 1); n = Q - (A + h[:, None] * ba)
    elif kind == 'box':
        lo, hi = p; c = (lo + hi) / 2; e = (hi - lo) / 2; d = (Q - c) / e; ax = np.argmax(np.abs(d), 1); n = np.zeros_like(Q); n[np.arange(len(Q)), ax] = np.sign(d[np.arange(len(Q)), ax])
    else:
        Cc, r, clip = p; n = Q - Cc
    n = norm(n.astype(F))
    flip = np.sum(n * Dd, 1) > 0; n[flip] *= -1   # two-sided surfaces face the viewer
    return n

def trace(O, D):
    best = np.full(len(D), INF, F); idx = np.full(len(D), -1, np.int32)
    for i, (k, p, m) in enumerate(P):
        t = hit(k, p, O, D); g = t < best; best = np.where(g, t, best); idx = np.where(g, i, idx)
    return best, idx

def occluded(O, D):
    blk = np.zeros(len(D), bool)
    for (k, p, m) in P:
        blk |= hit(k, p, O, D) < INF
    return blk

# ---------------- procedural textures
rng = np.random.default_rng(7); NG = rng.random((256, 256)).astype(F)
def vnoise(u, v):
    u = u % 256; v = v % 256; i0 = np.floor(u).astype(int) % 256; j0 = np.floor(v).astype(int) % 256; fu = u - np.floor(u); fv = v - np.floor(v)
    fu = fu * fu * (3 - 2 * fu); fv = fv * fv * (3 - 2 * fv); i1 = (i0 + 1) % 256; j1 = (j0 + 1) % 256
    return (NG[i0, j0] * (1 - fu) + NG[i1, j0] * fu) * (1 - fv) + (NG[i0, j1] * (1 - fu) + NG[i1, j1] * fu) * fv

MAT = {'hull': ((.8, .8, .78), .35, 40), 'metal': ((.55, .57, .6), .6, 60), 'dark': ((.16, .17, .19), .35, 30), 'foil': ((.7, .42, .1), 2.2, 22),
       'rad': ((.88, .9, .92), .25, 20), 'solar': ((.015, .03, .09), 2.5, 160), 'bell': ((.11, .105, .12), .9, 30), 'dish': ((.9, .9, .9), .3, 20)}

def shade(Q, n, mat, Dd):
    N = len(Q); alb = np.tile(np.array(MAT[mat][0], F), (N, 1)); spec = np.full(N, MAT[mat][1], F); pw = MAT[mat][2]
    x, y, z = Q[:, 0], Q[:, 1], Q[:, 2]; th = np.arctan2(z, y)
    if mat == 'hull':
        seam = (np.abs(((x + .5) % 1.1) - .55) > .52) | (np.abs(((th / (np.pi / 6)) % 1) - .5) > .485); alb[seam] *= .55
        win = (x > 1.3) & (x < 3.6) & (np.abs(((x - 1.3) % .75) - .35) < .18) & (np.abs(th - .55) < .16); alb[win] = (.02, .025, .035); spec[win] = 2.0
        grime = .9 + .1 * vnoise(x * 3, th * 9); alb *= grime[:, None]
    if mat == 'foil':
        nz = vnoise(x * 9, th * 26) - .5; nz2 = vnoise(x * 23 + 50, th * 61) - .5
        n = norm(n + (np.stack([nz * 1.4, nz2 * 1.0, (nz + nz2) * 1.0], 1)).astype(F))
        alb *= (.55 + .8 * vnoise(x * 5, th * 14))[:, None]
    if mat == 'rad':
        tube = np.abs(((x - 16.4) % .45) - .225) < .04; alb[tube] *= .62
    if mat == 'solar':
        cell = (np.abs(((x - 3) % .52) - .26) > .245) | (np.abs(((np.abs(z) - 3.2) % .52) - .26) > .245); alb[cell] = (.62, .64, .66); spec[cell] = .5
        alb *= (.9 + .2 * vnoise(x * 2, z * 2))[:, None]
    if mat == 'bell':
        heat = np.clip(1 - (x - 18.4) / 1.6, 0, 1); alb = alb * (1 - heat[:, None] * .4) + heat[:, None] * np.array((.45, .28, .16), F) * .6
    return alb, spec, pw, n

# ---------------- render
t, idx = trace(O, D); hitm = idx >= 0; col = np.zeros((len(D), 3), F)
Lsun = norm(np.array([-.7, .62, .18], F)); Csun = np.array([1.0, .96, .9], F) * 1.75
Lfill = norm(np.array([.3, -.85, .25], F)); Cfill = np.array([.35, .55, 1.0], F) * .32
amb = np.array([.018, .02, .028], F)
for i, (k, p, m) in enumerate(P):
    sel = np.where(idx == i)[0]
    if not len(sel): continue
    Q = O[sel] + D[sel] * t[sel, None]; n = normal(k, p, Q, D[sel]); alb, spec, pw, n = shade(Q, n, m, D[sel])
    ndl = np.clip(n @ Lsun, 0, None); ndf = np.clip(n @ Lfill, 0, None)
    sh = occluded(Q + n * F(.02), np.broadcast_to(Lsun, Q.shape).copy()); lit = np.where(sh, F(0), F(1))
    hv = norm(Lsun - D[sel]); sp = spec * np.clip(np.sum(n * hv, 1), 0, None) ** pw * lit
    stint = alb * 1.6 if m in ('foil', 'metal', 'bell') else np.ones_like(alb)
    fres = (1 - np.clip(-np.sum(n * D[sel], 1), 0, 1)) ** 5
    c = alb * (ndl * lit)[:, None] * Csun + alb * ndf[:, None] * Cfill + alb * amb + sp[:, None] * stint * Csun * .5 + fres[:, None] * np.array([.1, .14, .22], F)
    if m == 'bell':  # a faint glow deep in the throat
        c += np.clip(1 - (Q[:, 0] - 18.4) / .9, 0, 1)[:, None] * np.array([1.0, .45, .15], F) * .5
    col[sel] = c
if BG:
    perm = np.random.default_rng(3).permutation(256)
    def n3(p):
        q = np.floor(p).astype(int); f = p - q; f = f * f * (3 - 2 * f); out = 0
        for dx in (0, 1):
            for dy in (0, 1):
                for dz in (0, 1):
                    h = perm[(perm[(perm[(q[:, 0] + dx) & 255] + q[:, 1] + dy) & 255] + q[:, 2] + dz) & 255] / 255.0
                    w = (f[:, 0] if dx else 1 - f[:, 0]) * (f[:, 1] if dy else 1 - f[:, 1]) * (f[:, 2] if dz else 1 - f[:, 2]); out = out + h * w
        return out
    def fbm3(p, o):
        a, s2, t2 = .5, 0, 0
        for _ in range(o): s2 = s2 + a * n3(p); t2 += a; p = p * 2.03; a *= .5
        return s2 / t2
    miss = np.where(~hitm)[0]; Dm = D[miss]
    PC = np.array([30.0, -160.0, -150.0], F); PR = F(150.0)   # a planet far below and behind the ship
    oc = cam - PC; b = Dm @ oc; c = oc @ oc - PR * PR; h = b * b - c; onp = h > 0; tt = -b - np.sqrt(np.maximum(h, 0))
    bgc = np.zeros((len(miss), 3), F)
    if onp.any():
        Q = cam + Dm[onp] * tt[onp, None]; nn = norm(Q - PC); u = nn * 3.0
        land = fbm3(u * 1.0 + 10, 6) ; cloud = fbm3(u * 2.6 + 40, 6)
        ocean = np.array([.012, .045, .13], F) * (.8 + .4 * fbm3(u * 6, 3))[:, None]
        green = np.array([.07, .1, .045], F); tan = np.array([.33, .26, .16], F); lnd = green + (tan - green) * np.clip((fbm3(u * 4 + 7, 4) - .45) * 3, 0, 1)[:, None]
        surf = np.where((land > .53)[:, None], lnd, ocean)
        cl = np.clip((cloud - .47) * 3.0, 0, 1)[:, None]; surf = surf * (1 - cl) + cl * np.array([.85, .87, .9], F)
        ndl = np.clip(nn @ Lsun, 0, None); vdn = np.clip(-np.sum(nn * Dm[onp], 1), 0, 1)
        spec = np.where(land <= .53, (np.clip(np.sum(nn * norm(Lsun - Dm[onp]), 1), 0, None) ** 60) * .6, 0) * (1 - cl[:, 0])
        rim = (1 - vdn) ** 3; atm = np.array([.25, .5, 1.0], F)
        col_p = surf * (ndl * 1.3)[:, None] + spec[:, None] * np.array([1, .95, .85], F) + rim[:, None] * atm * (.2 + 1.2 * ndl)[:, None]
        lights = (fbm3(u * 18 + 3, 3) > .62) & (land > .55) & (ndl < .02); col_p[lights] += np.array([.5, .35, .15], F) * .25
        bgc[onp] = col_p
    # thin atmosphere glow beyond the limb
    d_ = np.sqrt(np.maximum(c - b * b + PR * PR - PR * PR, 0)); dist = np.sqrt(np.maximum(oc @ oc - b * b, 0)); halo = (~onp) & (dist < PR * 1.025)
    hv_ = np.clip(1 - (dist - PR) / (PR * .025), 0, 1) ** 2; sunside = np.clip(norm(cam + Dm * (-b)[:, None] - PC) @ Lsun + .3, 0, 1)
    bgc += (halo * hv_ * sunside)[:, None] * np.array([.25, .5, 1.0], F) * .9
    # stars (hidden behind the planet) and a faint Milky Way band
    st = np.random.default_rng(11).random(len(miss)) ; star = (~onp) & (st > .9993)
    bgc[star] += (np.random.default_rng(12).random(star.sum()) * .9 + .2)[:, None] * np.array([1, .97, .92], F)
    band = np.exp(-((Dm @ norm(np.array([.3, .9, -.3], F))) ** 2) / .02) * (~onp)
    bgc += band[:, None] * np.array([.05, .05, .07], F) * (.5 + fbm3(Dm * 6 + 5, 4))[:, None]
    col[miss] = bgc

# filmic tone mapping (ACES fit) and gamma
a, b, c2, d2, e = 2.51, .03, 2.43, .59, .14; col = np.clip((col * (a * col + b)) / (col * (c2 * col + d2) + e), 0, 1) ** (1 / 2.2)
img = np.concatenate([col, (np.ones_like(hitm) if BG else hitm)[:, None].astype(F)], 1).reshape(RH, RW, 4)
img[..., :3] *= img[..., 3:4]  # premultiply, downsample, un-premultiply (clean transparent edges)
img = img.reshape(H, SS, W, SS, 4).mean((1, 3)); al = np.maximum(img[..., 3:4], 1e-6); img[..., :3] = np.where(al > 1e-5, img[..., :3] / al, 0)
if not BG:
    ys2, xs2 = np.where(img[..., 3] > .01); m = 24
    img = img[max(0, ys2.min() - m):ys2.max() + m, max(0, xs2.min() - m):xs2.max() + m]
out = os.path.join(os.path.dirname(__file__), '..', 'docs', 'images'); os.makedirs(out, exist_ok=True)
name = 'cosmic-impulse-hero.jpg' if BG else 'cosmic-impulse-ship.png'; im8 = Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8), 'RGBA')
(im8.convert('RGB').save(os.path.join(out, name), quality=90) if BG else im8.save(os.path.join(out, name), optimize=True))
print('wrote docs/images/' + name, img.shape[1], 'x', img.shape[0])
