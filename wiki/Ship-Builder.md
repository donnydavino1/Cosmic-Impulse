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

| Number | Depends on | Why ([[The Laws of Cosmic Impulse]]) |
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

## Mounting modules beside the spine

Select a module and press **⤴ Mount beside the module in front** to attach it to the side of that module (its
*host*) instead of putting it on the spine. Mounted modules don't add length, so the ship gets **shorter**: it turns
faster and can thrust harder. Several modules on the same host spread evenly around it: **2 = a mirrored pair,
3 = a triangle, 4 = a cross** (symmetry). Use **◀ / ▶** to move a mounted module to another host, or
**⤵ Back onto the spine**.

Where you mount things matters:
- **Tanks mounted around the crew cabin** make the best storm shelter of all (they surround the crew).
- **Radiators** belong beside the reactor that heats them.
- A **reactor** mounted beside the crew is close to them: its radiation dose goes up. Keep it on the far end of the
  spine, behind other modules, if you want a safe crew.

**Drag and drop:** in the side view, drag a module along the line to reorder it, or drag it above or below the line
to mount it beside the nearest module. The small **end view** on the right looks along the ship at the selected
module's ring of mounted modules. Upgraded modules show one coloured band per mark on the 3D ship.

## Building and recycling from the builder

The **🧩 Add a part** section lists every part by category, with its mass, materials, energy and the research it
needs. **🏭 Build** queues it for your fabricator (it joins the tail of the ship). With a module selected you can also
**⤴ Build beside** it, or **⤴⤴ Build a mirrored pair beside** it: the finished parts are mounted around that module
automatically. **♻ Recycle this part** gives back half its materials.

Under the side view, a **rendered preview** shows the draft as a lit 3D-looking ship: hull panels, gold-foil tanks,
open trusses, radiator wings, the sensor dish, the engine bell, and one coloured band per upgrade mark. The table also
shows the **Δv** your current engine gets from its fuel with the draft's mass.

## Weapons and engines are modules too

Every weapon you have built is a module. **Turrets** (mining laser, pulse laser, particle beam, missiles) mount beside a
module like any other; the **railgun** is a long spinal weapon that lies along the spine, because the whole ship has to
turn to aim it. **Engines** sit at the tail: the one in use and any others you own (they add mass there, which moves your
centre of mass back). The **🚀 Engines at the tail** row lets you switch engine or scrap one.

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
