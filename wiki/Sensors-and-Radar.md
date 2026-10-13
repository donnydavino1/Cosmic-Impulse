# Sensors and Radar

Your **sensors** decide how far and how well you see; your **radar display** decides how it looks.

| Tier | Sensor | Range | Learns |
|---|---|---|---|
| 1 | Pulse radar | 500 km | position (±2 %) |
| 2 | Doppler radar | 2,000 km | + speed and direction |
| 3 | Phased array | 20,000 km | + mass and size |
| 4 | Lidar + spectrometer | 200,000 km | + what it's made of, hull, ammunition |
| 5 | Interferometric array | 2,000,000 km | + full loadout and engine state |

Your tier rises with research (one tier per 7 technologies), and your ship's antenna changes shape with it.
In multiplayer, better sensors reveal more about your opponent.

**Sensor parts:** your level also rises if you build a sensor part (🛠 → 🏭 Fabricate → 📡 Sensors): a *Doppler
radar dish* (at least level 2), a *Phased-array panel* (level 3) or a *Lidar and spectrometer turret* (level 4).
Upgrading one to Mk III and Mk V adds a level each time ([[Upgrades]]). See also [[Cockpit and Displays]] for the
sonar and 3D radar displays.

**Active or passive (key 6):** *active* radar (default) sends out pulses: full range and precision, but it uses
2 kW and anyone listening hears you. *Passive* sensing only listens: about a third of the range and four times the
error, but things that transmit themselves (raiders, players with active radar) are heard from 1.5× your active
range. A **quiet ship** (passive, engine off) is only seen by others within half their normal range, and raiders
find it much harder to lock onto ([[Combat]]).

**Radar designs:** 🎨 Customize → RADAR DISPLAY: *3d, sonar, sweep, holo, grid, list, minimal*. Add the 📡 Sensors widget
to your cockpit from the dashboard editor (**I**). On phones a mini radar shows in the cockpit.
You (or your AI) can design new radar displays: see [[Build Your Own Cosmic Impulse]].

**Light-time:** what your sensors detect left the object d/c ago, so every contact is shown where it *was*: 1.3 s ago
at the Moon's distance, over 8 minutes ago at the Sun's. Contacts carry this delay as `lt` ([[Relativity]]).

**Designed sensors:** a sensor you design (🧪, [[Ship Builder]]) can see farther or less far than the standard one of
its level: by the radar equation, range grows as (transmit power × aperture²)^¼.

## Comms with Earth

🧭 NAVIGATE → **COMMS** shows the light-speed delay to Earth (one way, and for a question and its answer) and how fast
three kinds of link could send data from where you are. A radio link receives Pr = Pt·Gt·Gr·(λ/4πd)², with dish gain
G = η·(πD/λ)², and carries R = Pr/(k·Tsys·Eb/N0); a laser link counts photons (about 2 per bit). The ground uses a
34 m dish for radio and a 5 m telescope for the laser.

| Link | At 1 AU | At 160 AU |
|---|---|---|
| X-band radio, 3 m dish, 100 W | ~10 Mbit/s | ~390 bit/s |
| Ka-band radio, 3 m dish, 100 W | ~44 Mbit/s | ~1.7 kbit/s |
| Laser, 22 cm telescope, 4 W | ~13 Mbit/s | ~510 bit/s |

Rates fall as 1/distance², and each link has a hardware ceiling close to Earth.

Solar conjunction: when the Sun comes within 2° of Earth as seen from the ship, its radio noise drowns every link
(Mars missions lose contact for about two weeks every 26 months). The comms panel warns you as the angle closes.

## Heat signature

🛠 → 🔧 Ship → **HEAT SIGNATURE**. Every watt your ship uses ends up radiated as infrared against a 3 K sky, so a
sensor sees you once P / (4πr²) beats its noise floor: detection range r = √(P / 4πF). With a 1 m infrared telescope
(F ≈ 10⁻¹⁵ W/m²) the starter ship's ~7 kW is visible from about 750,000 km; a large space telescope (10⁻¹⁸ W/m²) sees it
from 0.16 AU. A burning engine is far brighter. There is no stealth in space.
