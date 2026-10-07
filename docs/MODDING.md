# Modding Stellar Impulse

Three levels, from no code to new systems.

## 1. Styles (no code)

🎨 Customize → **SHARE YOUR STYLE** copies your ship's style as JSON; **Load a style** pastes one in. A style:

```json
{"name":"Blue Lancer","hull":"#2f6fe0","acc":"#ffb347","shape":"capsule","wings":4,
 "panel":"holo","trim":"stripes","glow":0.7,"dish":"auto"}
```

| Key | Values |
|---|---|
| `hull`, `acc` | `#rrggbb` colours (hull, accent/edges/glow) |
| `shape` | `sphere`, `capsule`, `ring` |
| `wings` | 0, 2, 4 |
| `panel` | `holo`, `classic` |
| `trim` | `rings`, `stripes`, `chevrons`, `none` (count grows with research) |
| `glow` | 0–2 |
| `dish` | `auto` (antenna follows sensor tier) or `hidden` |
| `mounts` | hardpoint offsets, see ORB-SHIP/1 in `docs/PROTOCOL.md` |

Unknown keys are ignored; bad values are skipped. Presets live in `STYLE_PRESETS` (`game/js/2570-ship-style.js`):
add one line to add a preset.

## 2. Scripts against the API (browser console or a module)

```js
ORB.api.state()        // ORB-STATE/1
ORB.api.ledger()       // ORB-LEDGER/1
ORB.api.contacts()     // [ORB-TLM/1, …] what your sensors see right now
ORB.api.on('frame', now => { /* every frame */ })
```

### Design your own radar

A radar design is one function. It gets a 2D canvas context, its size, the contacts, and info
`{range, sensorRange, tier, sensor, me}`; `range` is the current display scale in metres.

```js
ORB.radar.register('compass', (x, W, H, contacts, o) => {
  x.strokeStyle = '#7fe6ff'; x.beginPath(); x.arc(W/2, H/2, H/2 - 4, 0, 7); x.stroke();
  for (const c of contacts) {
    const dx = c.pos[0] - o.me.x, dy = c.pos[1] - o.me.y;   // Sun-frame offset, metres
    const a = Math.atan2(dy, dx), r = Math.min(1, c.range / o.range) * (H/2 - 6);
    x.fillStyle = c.hostile ? '#ff4a4a' : '#9fdcff';
    x.fillRect(W/2 + r*Math.cos(a) - 2, H/2 - r*Math.sin(a) - 2, 4, 4);
  }
}, 'North-up compass');
ORB.radar.use('compass');
```

Built-in designs (`sweep`, `holo`, `grid`, `list`, `minimal`) are in `game/js/2550-sensors.js` and are good
starting points; `rLocal(c)` turns a contact into ship-local coordinates (x right, y ahead, z up).

## Translations

UI text: `game/i18n/<code>.json` maps exact English text to the translation (`{"Zoom in": "Acercar"}`). Multi-word keys
are also replaced inside longer text. Messages built at run time use `{}` (any text) and `{#}` (a number only) patterns that must match the whole text:
`{"⚔ Wave {} is already attacking!": "⚔ ¡La oleada {} ya está atacando!"}`; each `{}` is translated in turn (use
`{1}` `{2}` to reorder). Wiki sidebar titles live in `TITLES` in `tools/build-wiki.mjs`.
**Check coverage:** `npm run i18n` plays both builds headless in each language, opens every window and tab, reads every
`notify`/alert/discovery template in the code, and lists anything still in English (`tools/smoke/out/i18n-missing*.json`).
It must report 0 before a release. Data names (parts, technologies, engines, fuels, weapons) are translated in the same
files and also feed the generated wiki pages. Add a language by creating the file and adding it to `LANGS` in
`game/js/0060-i18n.js`. `tests/wiki.test.mjs` requires every key-action label to be translated. Wiki pages go in
`wiki/<code>/<Page>.md` (missing pages fall back to English with a notice); `Controls` is generated per language.

## 3. New modules (changing the game)

1. Create `game/js/NNNN-yourthing.js` with a number that puts it after what it needs.
2. Start it with a header comment: what it does, what it reads, which hooks it uses.
3. Hook in instead of editing others: `ORB.on('frame', …)`, `ORB.on('ui', …)`,
   `ORB.on('ship:build', ({g, rad, part, H, dark, A}) => g.add(…))`, `ORB.keyParts.push(() => myState)`.
4. Add a cockpit widget: `WDEF.myid = {t:'Title', w:20, h:20, draw:(body)=>{…}}` (after `2500-dashboard.js`).
5. Add a key action: push `['id','key','Label',()=>fn()]` into `ACTS` before keys are bound (or add it in
   `1100-keys.js`); it shows up in the phone ☰ menu automatically.
6. Make a part movable: set `obj.userData.mount = 'my-part'` on a direct child of the ship group inside a
   `ship:build` hook registered before `2580-hardpoints.js` runs its own; it then appears in 🎨 → HARDPOINTS.
7. `node tools/build-game.mjs && npm test`.

If your change alters gameplay numbers, the `RULES` fingerprint changes and you can only fight players with the
same change. That's by design.
