# Ship Builder

Press **7** (phone: ☰ → Ship → Ship builder) to open the **🧱 Ship Builder**. It shows your ship from the side, nose on
the left and engine on the right, drawn from the real size of every module. In 🎨 Customize choose the hull shape
**Modular** to see the same layout on your 3D ship.

## Modules

Every part you install becomes a **module** on the ship's spine (the frame is the spine itself). Two more kinds:

| Module | What it is | Size |
|---|---|---|
| 👩‍🚀 Crew cabin | your life-support part; the crew lives here | at least 4 m |
| ⛽ Tanks | all propellant and water, one cluster | from the volume of what you carry |
| ⌗ Truss | an empty 5 m lattice, 100 kg of iron | 5 m |
| 🔬 🏭 🔋 ⚛ ♨ 🛡 | labs, fabricators, batteries, generators and reactors, radiators, shielding | from their mass and density |

New parts are added at the tail end, just ahead of the engine. A new ship starts with the crew at the nose and the
tanks right behind them.

## What the layout changes

| Number | Depends on | Why ([[The Laws of Stellar Impulse]]) |
|---|---|---|
| **180° turn** | how much mass sits far from the centre of mass | Law 2: two 220 N thrusters must spin your moment of inertia |
| **Railgun re-aim** | half a 180° turn | the railgun is fixed along the ship: the whole ship must point ([[Combat]]) |
| **Max acceleration** | length | frames are rated for ships up to 25 m; longer ones bend, so the g limit drops |
| **Reactor dose to crew** | distance and the modules in between | Law 6: radiation falls with distance²; mass in between absorbs it ([[Radiation]]) |
| **Storm shelter** | whether the tanks touch the crew cabin | water and fuel only shield the crew if they surround them |

The builder compares **Now** with your **Draft** and colours each change green (better) or red (worse).

## Refitting

Arrange the draft, then press **🔧 Refit to this layout**. A refit is a job for your fabricator
([[Ship and Engineering]]): moving modules costs 20 kJ for every kilogram moved, and each new truss needs 100 kg of
iron. Removing a truss gives back half its iron.

## Saved designs

**💾 Save this draft** stores a layout under a name. A design remembers the *kinds* of modules in order (crew cabin,
tanks, trusses, each part type), so you can load it onto a later ship that has the same parts and refit in one go.

## Designs to try

- **The tug:** everything packed tight. Fast turns and full thrust, but a reactor next to the crew.
- **The long ship:** crew at the nose, tanks behind them, a long truss, then the reactor and radiators at the tail.
  Almost no reactor dose and a strong storm shelter, but slow to turn and a lower g limit.
- **The gunship:** short and balanced around the centre of mass so the railgun re-aims quickly.

Real spacecraft designs work the same way: nuclear rockets put the reactor far behind a shadow shield and the
propellant tank.
