# Cockpit and Displays

How you see the game is yours to change. None of this changes the physics or what your sensors can detect: every
player gets the same information ([[Fair Play and Rules]]).

## 3D flight deck (default)

In first-person view you sit at a modelled **flight deck** under the window: a sloping main console with **three large
glowing screens**, two touch panels, a row of lit keys, side consoles with banks of buttons, and a control stick and
throttle rising into view. The screens are live, redrawn four times a second from your ship, and **every screen is a
button** — move the mouse over one (the pointer becomes a hand) and click:

| Screen | Shows | Click opens |
|---|---|---|
| **FLIGHT** (left) | speed, altitude, orbit, engine, thrust, time speed, date, autopilot stage | 🧭 Navigation |
| **SENSORS** (centre) | your radar display | switches to the next radar design |
| **SYSTEMS** (right) | battery, power in/out, crew-loop and high-loop temperatures, hull, propellant | 🌡 Thermal (heat map and radiator calculator) |
| **CREW** (lower left) | crew health, astronauts and their duties, days of supplies, kits | 👩‍🚀 Crew |
| **TACTICAL** (lower right) | master caution (blinking red) or *all systems nominal*, weapon, target, range | next target |

Dragging still turns your view; only a click without dragging presses a screen. The deck's screens replace the
floating dashboard widgets; **🧩 Show widgets** (top right) brings them back on top. The 🌡 HEAT and 👩‍🚀 CREW buttons
in the top bar open the same windows from any view. Choose another look in 🎨 Customize → COCKPIT STYLE, or press
**🎛 Physical controls** for the switch-and-gauge console.

**Built like real hardware.** The panels are worn painted metal with seams, fasteners and stencilled codes; the
displays sit in bevelled housings with bezel keys under reflective cover glass; the side consoles carry guarded toggle
switches, knurled knobs and backlit keys; a black side-stick stands in a rubber boot. Light is physical: the real Sun
only shines in through the window, the frame throws moving shadows across the console as you turn, the displays spill
cyan light onto the panels around them, metal reflects the cabin, the windscreen faintly mirrors the lit displays and
shows dust and fine scratches when sunlight hits it, and dust motes drift in the sunbeams.

## Physical cockpit

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
| **3D flight deck** (default) | modelled console with live, clickable screens: see above |
| **Physical** | real instruments: see above |
| **Realistic** | matte instrument panels with bezels and screws, a window frame with pillars |
| **Neo glass** | translucent panels with glowing edges |
| **Military** | dark olive panels, amber readouts |
| **Retro** | green phosphor screens with scanlines, 1970s style |
| **Classic** | plain flat panels |

The panels themselves are **widgets**: press **I** to move, resize, add or remove them, and **J** to switch between
saved layouts (Flight, Engineering, Emergency, Custom). See [[Customization]].

### The 3D cockpit frame

In first-person view the window frame, glare shield, side walls, overhead switch panel, grab handles and head-up display
glass are **real 3D geometry**, lit by the actual Sun (its true direction and brightness, and darkness when you pass
into a planet's shadow), by blue Earthshine when you orbit Earth, and by warm instrument lights that turn red with a
critical alarm. Your head sways back against the thrust you feel and the frame shakes with engine rumble and hits.
Turn it on or off in 🎨 Customize → COCKPIT STYLE (*3D cockpit frame*). The *classic* style keeps the flat frame.

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

## Planets in the realistic look

In the realistic look (🎨 Customize), planets have surface relief that catches the low sunlight near the terminator,
Earth's oceans glint where the Sun reflects off them, and its night side shows city lights.

**No strobing at high time speed:** passing in and out of a planet's shadow fades smoothly, and when the day/night
cycle gets faster than a few real seconds the picture shows the orbit's average light (softer shadows, dimmer city
lights) instead of flashing. Power and heat still follow the real, instant shadow.

## Make your own

Cockpit styles and radar displays are plain code: add a style with `ORB.cockpit.register(name, {frame, label})`
plus CSS, and a radar with `ORB.radar.register(name, draw)`. See `docs/MODDING.md` and
[[Build Your Own Cosmic Impulse]].
