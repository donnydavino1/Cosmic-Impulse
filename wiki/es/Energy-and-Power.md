# Energía y potencia

La energía es la moneda de Cosmic Impulse: compra paneles, combustible, piezas, investigación y disparos.

- Los **paneles solares** captan luz solar: unos 1,36 kW por m² en la Tierra, que cae con el cuadrado de la distancia
  al Sol (4 veces menos al doble de distancia). Funcionan mucho mejor cerca del Sol y mal más allá de Marte.
- **Baterías, volantes de inercia y supercondensadores** la almacenan, con distinta energía por kilo y límites de potencia.
- Los **reactores** (fisión y luego mayores) dan potencia constante en cualquier lugar, incluso en sombra o lejos del
  Sol, pero añaden calor y radiación.
- El **calor** hay que radiarlo. Cada vatio que usas acaba como calor; los radiadores cuestan masa. Si la cabina
  supera 45 °C, la tripulación empieza a sufrir.
- Láseres, haces de partículas y motores eléctricos tiran del mismo bus de potencia. Las gráficas 📈 de la cabina
  muestran potencia producida frente a consumida.

## Tipos de célula solar y envejecimiento

🛠 → 🏭 Fabricar → **TIPO DE CÉLULA SOLAR**. *Silicio* (de serie: 0,2 kg/m², envejece un 0,5 % al año a 1 UA), *GaAs de
triple unión* (30 % más potencia por m², 0,35 kg/m², el doble de resistente: lo que usan las naves reales) o *perovskita
de película delgada* (un cuarto de la masa, dos tercios de la potencia, envejece un 3 % al año). Las células envejecen más
deprisa cerca del Sol (∝ 1/distancia²) y 20 veces más durante una tormenta de protones solares; la potencia de tus
paneles baja con ellas. *Restaura las células* para recuperar toda la potencia, o cambia todas las células por otro tipo
(ambos son trabajos de fabricación).

## Conversión de energía del reactor

Un reactor de fisión produce calor; un convertidor transforma parte en electricidad y el resto va a los radiadores.
🏭 Fabricar → **CONVERSIÓN DE ENERGÍA DEL REACTOR** reforma todos los reactores de fisión (los de fusión conservan el
suyo). El calor del reactor no cambia, así que un convertidor mejor da más vatios y menos calor residual.

| Convertidor | Eficiencia | Masa | Averías |
|---|---|---|---|
| Termoeléctrico | 7 % | ×0,85 | ×0,1 (sin piezas móviles) |
| Stirling (de serie en el reactor pequeño) | 25 % | ×1 | ×1 |
| Brayton (de serie en el de un megavatio) | 30 % | ×1,1 | ×1,2 |
| CO₂ supercrítico | 40 % | ×1,2 | ×1,5 |

Ejemplo: el reactor de 1 MW (3,3 MW de calor) da 233 kW con termoeléctricos y 1,33 MW con CO₂ supercrítico. Brayton y
CO₂ supercrítico necesitan la tecnología de reactores de ciclo Brayton.

## Pilas de combustible

🛠 → 🔧 Nave → **PILAS DE COMBUSTIBLE**: pilas de hidrógeno y oxígeno, como en el Apolo y el transbordador espacial, que
combinan las dos mitades del combustible hidrolox en electricidad y agua pura. Cada pila de 5 kW usa unos 0,36 kg de
propelente por kWh (1,8 kg por hora) y devuelve 0,32 kg de agua potable por kWh. Rinden un 60 %: el resto es calor en
el circuito de la tripulación. Útiles a la sombra, lejos del Sol o cuando falla un reactor, a cambio de combustible.

**Vida del núcleo:** un núcleo de fisión consume su uranio. El del reactor pequeño dura 10 años a plena potencia y el del de un megavatio, 7; después, la potencia cae hasta cero al 120 %. Pide núcleos nuevos a la Tierra estando dentro de su zona gravitatoria (la tabla muestra cuánto se ha usado cada núcleo).

**Sombra orbital:** 🛠 → 🔧 Nave → **SOMBRA ORBITAL** muestra qué parte de cada órbita pasas a la sombra del planeta, asin(R/r)/π en una órbita circular con el Sol en su plano (39 % a 400 km sobre la Tierra: 36 minutos de cada 92), y la energía de batería necesaria para cruzarla.
