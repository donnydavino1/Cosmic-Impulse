# Cockpit and Displays

How you see the game is yours to change. None of this changes the physics or what your sensors can detect: every
player gets the same information ([[Fair Play and Rules]]).

## Physical cockpit (default)

The **🎛 Physical controls** button (top right in the cockpit view, key **V**) turns the cockpit into a real
instrument console instead of floating panels:

| Section | What's on it |
|---|---|
| **Caution / warning** | 12 warning lamps (crew, hull, O₂, water, food, CO₂, cabin, radiation, power, systems, threat, storm): amber = caution, red = warning. **Master caution** blinks until you press it. LCD mission clock and altitude. |
| **Gauges** | analog needles for velocity, battery, propellant, oxygen, cabin temperature and radiation dose, with red zones |
| **Radar** | a round CRT scope behind glass; **SONAR / 3D** switches what it shows |
| **Systems** | guarded toggle switches with lamps: stabilizer, storm shelter, radar active/passive, thrust mode, music; the **time warp** knob |
| **Weapons and ship** | back-lit buttons for weapons 1–5 and target, the big **FIRE** button (hold for beams), and buttons for camera, engineering, navigation, builder, operations and contracts |

Every switch and button does exactly what its key does, and every gauge shows the same numbers as the panels: the
console changes how you *use* the ship, never what you can know ([[Fair Play and Rules]]). Press the button again to
go back to panels, or choose another style below.

## Cockpit styles

🎨 Customize (**K**) → **COCKPIT STYLE**:

| Style | Look |
|---|---|
| **Physical** (default) | real instruments: see above |
| **Realistic** | matte instrument panels with bezels and screws, a window frame with pillars |
| **Neo glass** | translucent panels with glowing edges |
| **Military** | dark olive panels, amber readouts |
| **Retro** | green phosphor screens with scanlines, 1970s style |
| **Classic** | plain flat panels |

The panels themselves are **widgets**: press **I** to move, resize, add or remove them, and **J** to switch between
saved layouts (Flight, Engineering, Emergency, Custom). See [[Customization]].

## Radar displays

The 📡 Sensors widget can draw your contacts in different ways (🎨 Customize → RADAR DISPLAY):

| Display | What it shows |
|---|---|
| **3d** (default) | contacts at their true height above or below you, with range rings, height stems and motion trails; drag it to turn the view |
| **sonar** | a rotating beam like an old submarine or ship radar: each contact only updates as the beam passes it, then fades, so you see where things *were* |
| **holo** | a holographic disc with height stems |
| **sweep** | the classic phosphor sweep, top-down |
| **grid** | a tactical grid with distance labels |
| **list** | a plain list: kind, distance, closing speed, error |
| **minimal** | one ring and coloured dots |

Better sensors make the sonar beam turn faster and see farther ([[Sensors and Radar]]).

## Virtual reality (experimental)

With a VR headset and a browser that supports WebXR, a **🥽 Enter VR** button appears in the cockpit view: the 3D scene
renders in the headset and follows your head, while the keyboard keeps flying the ship. The 2D panels stay on the
desktop screen. In the realistic look, planets also have surface relief and Earth's oceans glint in the sunlight.

## Make your own

Cockpit styles and radar displays are plain code: add a style with `ORB.cockpit.register(name, {frame, label})`
plus CSS, and a radar with `ORB.radar.register(name, draw)`. See `docs/MODDING.md` and
[[Build Your Own Cosmic Impulse]].
