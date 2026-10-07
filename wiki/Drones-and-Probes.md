# Drones and Probes

Press **8** (phone: ☰ → Ship → Operations) to open **🛸 Operations**: the things your ship can send out and get back.

## ⛏ Mining drones

Research **Autonomous robotics**, then build drones in the Operations window (40 kg each, built from iron, nickel,
silicates and carbon). Fly within 50 km of an asteroid and press **Deploy drones**:

1. They fly out (20 m/s), dig 18 kg per hour each, and come back when each carries 50 kg.
2. The ore arrives in proportion to what the asteroid is made of (C-type: mostly rock with 15 % water ice; S-type: rock with 18 % iron; M-type: 80 % iron and 9 % nickel).
3. To go out again they **recharge from your battery**: 1.5 MJ for every kilogram they dug. A flat battery keeps them
   docked.
4. **Recall** brings them home with whatever they have dug.

Drones have very little Δv. Stay within 30 km while they work: if you fly more than 100 km away they can't catch up,
and they are lost.

## 🛰 Science probes

Research **Deep-space probes** (needs *Onboard laboratory*), then build probes (90 kg each). The table in the
Operations window shows, for every world: the **Δv** the probe needs, the **xenon** it will take from your tank
(up to 40 kg), the **trip time**, and the **science** it will return.

- The trip is a **Hohmann transfer**, the cheapest path between two orbits (see [[Flying and Orbits]]).
- **Launch from low orbit around a planet** and the probe goes much farther: it uses the planet's gravity well
  (the Oberth effect). From deep space, Saturn and the Sun are out of reach; from low Earth orbit, Saturn is not.
- When the probe arrives, its data comes back at the **speed of light**: minutes from Mars, over an hour from Saturn.
- The first data from a world is worth the most research points; later probes give 30 %.

## Which laws

| You see | Law (see [[The Laws of Cosmic Impulse]]) |
|---|---|
| Drones and probes are built from materials, and the ship gets exactly that much heavier | 3, conservation of matter |
| Drones recharge from your battery | 4, energy |
| Drones can't follow you far; probes need xenon | 2, momentum (rocket equation) |
| Probes reach farther from low orbit | 1 + 2, gravity and momentum |
| Probe data arrives late | 7 + 10, light speed and information |

Contracts can ask for both: *Send a science probe to …* and *Haul … kg of ore with mining drones* (see [[Contracts]]).
