# Taller de motores

Pulsa **[**, el botón **🔧 MOTORES** de la barra superior, o *🔧 Rediseñar en el taller de motores* bajo cualquier motor
en 🛠 → 🚀 Motores. Elige un motor, cambia su diseño, compara cada cifra con lo que tienes ahora y pulsa **Construir
este diseño** (se reconstruye con metal: un trabajo en 🏭 Fabricar; instantáneo y gratis en sandbox). El corte está a
escala, con una barra en metros, y el plasma o la llama brillan con el color real de sus iones: fijo en los motores
magnéticos y eléctricos, con un destello por cada pastilla en el motor de fusión inercial. El penacho de tu nave toma el
mismo color y anchura.

## Reacción de fusión (motor de fusión, fusión directa, fusión inercial)

| Reacción | Energía | Neutrones | Efecto en el juego | Combustible | Brillo |
|---|---|---|---|---|---|
| **D–D** (de serie) | 3,65 MeV | ~35 % | la referencia | deuterio del agua | rosa del hidrógeno |
| **D–T** | 17,6 MeV | 80 % | la más fácil de encender: 4× potencia por m³, la mitad de kg por vatio; escape un 15 % más lento, 1,9× calor residual, 6× dosis de neutrones | combustible D–T (tritio criado a partir de litio) | rosa |
| **D–³He** | 18,3 MeV | ~5 % | partículas cargadas que una tobera magnética puede dirigir: **escape un 60 % más rápido**, menos de la mitad de calor, casi sin neutrones; núcleo mayor | helio-3, solo desde la Tierra (suelo lunar) | amarillo melocotón del helio |
| **p–¹¹B** | 8,7 MeV | ~0,1 % | la más limpia; necesita un plasma mucho más caliente: un cuarto de potencia por m³, 2,6× kg por vatio | hidrógeno + boro-11 de la Tierra | rosa blanquecino |

Los neutrones de un núcleo de fusión encendido irradian a la tripulación. Un **escudo de sombra contra neutrones**
(0–20 t) entre el núcleo y la cabina reduce la dosis unas 2,7 veces por cada 1,5 t. La tripulación hibernada no recibe dosis.

## Propelente (motores eléctricos, de plasma, térmicos y químicos)

- **Propulsores iónicos y Hall:** xenón (el más pesado, más empuje por vatio, brillo azul), kriptón (escape un 25 % más
  rápido, 10× más barato, violeta pálido) o argón (escape un 80 % más rápido, menos eficiente, violeta). Mismo voltaje →
  velocidad de escape ∝ 1/√(masa del ion).
- **Helicón, MPD y arcjet:** hidrógeno (el más rápido, rosa), argón (más empuje, violeta) o litio (lo usan los MPD
  reales: se ioniza fácilmente, carmesí).
- **Cohetes nuclear térmico, de núcleo gaseoso y solar térmico:** velocidad de escape ∝ √(temperatura ÷ masa
  molecular): hidrógeno (el más rápido), metano (62 %, de agua + carbono), amoníaco (56 %, de la Tierra) o **agua**
  (42 %, pero puedes extraerla en cualquier parte y bombearla directamente; desgasta más el núcleo).
- **Cohete químico:** hidrolox (el mejor) o metalox (un 16 % más lento, fabricado en el espacio con agua y carbono).

## Ajuste, tamaño y escudo

- **Ajuste (−1 … +1)** cambia velocidad de escape por empuje con la misma potencia: voltaje de rejilla en motores
  iónicos, relación de tobera en motores de plasma y fusión (×0,71 … ×1,41 de velocidad de escape), temperatura de
  cámara en cohetes térmicos y químicos (±12 %; más caliente también genera más calor y desgasta el núcleo hasta 3×).
- **Diámetro y longitud del núcleo** fijan la potencia: potencia = densidad de potencia × volumen del núcleo. La masa
  de la estructura crece con la superficie del núcleo; los kg por vatio del motor siguen contando. Más grande es más
  empuje y más calor que evacuar.
- Cada cambio se previsualiza: velocidad de escape, potencia, empuje, masa del motor, calor residual, aceleración de tu
  nave, combustible, Δv con el combustible que llevas, dosis de la tripulación y desgaste. La línea **EN VIVO** muestra el
  acelerador de tu motor actual, qué lo frena, el consumo y el tiempo de encendido restante.

Prueba antes las cifras en el [[Laboratorio de la ecuación del cohete|Rocket Equation Lab]].

## Campana de la tobera (motores químicos y térmicos)

Los motores químicos y térmicos (nucleares o solares) tienen además una **relación de expansión de la tobera** ε
(área de salida ÷ área de garganta, de 10 a 400; de serie 100). Una campana mayor expande más el gas caliente y
convierte más de su calor en velocidad: alrededor de un +4 % de velocidad de escape por cada factor e de ε (como pasar
de una campana ε 84 a una extendida ε 280 en un motor de hidrógeno real). El mismo caudal sale más rápido, así que el
empuje también sube, mientras el calor residual de la cámara no cambia; el precio es la masa de la campana, que crece
con su área. El corte dibuja la campana a escala.

## Ajuste en vuelo y reactores bimodales

El **motor de magnetoplasma helicón** tiene escape variable: reparte su potencia de RF entre ionizar y calentar el
plasma, así que puede cambiar velocidad de escape por empuje *en vuelo* a potencia constante. Con un diseño del taller
en vigor, **Aplicar este ajuste ahora** lo reajusta al instante, sin reconstruirlo: mucho empuje para salir de un pozo
gravitatorio, escape rápido para el crucero.

Los cohetes térmicos nucleares y de núcleo gaseoso pueden construirse **bimodales**: durante el vuelo inercial el núcleo
funciona suavemente y mueve una turbina Brayton, así que el motor sirve también de central eléctrica (25 kW el térmico
nuclear, 100 kW el de núcleo gaseoso, con un 20 % de eficiencia: el resto va a los radiadores). Cuesta un 15 % más de
masa base del motor y se apaga mientras el motor empuja.

## Grupos de motores

Reparte la misma potencia total entre 1 y 4 motores. Cada motor extra añade un 8 % a la masa base (tuberías, soportes,
cardanes), pero entonces una avería solo detiene uno: los demás siguen empujando al (n − perdidos)/n del empuje hasta
que las reparaciones devuelven el estado del motor por encima del 95 %. Los cohetes reales agrupan motores justo por esta
capacidad de seguir con un motor apagado.

## Película de la vela solar

La vela no tiene motor que rediseñar, pero su película también se elige (🏭 Fabricar → **PELÍCULA DE LA VELA SOLAR**).
La luz del Sol empuja un espejo con fuerza (1 + ρ) · flujo · área / c, donde ρ es la fracción de luz reflejada. Lo que
la película no refleja lo absorbe, y se calienta hasta radiar ese calor: T = ((1 − ρ) · flujo / (σ · ε))^¼. El empuje
crece con 1/distancia², así que la forma rápida de navegar es lanzarse primero hacia el Sol, pero solo hasta donde la
película aguante.

| Película | Masa por área | Refleja | Límite | Distancia segura mínima |
|---|---|---|---|---|
| Poliimida aluminizada (de serie) | 20 g/m² | 88 % | 600 K | 0,18 UA |
| Película aluminizada fina | 5 g/m² | 88 % | 520 K | 0,26 UA |
| Microcelosía de carbono | 10 g/m² | 70 % | 2.000 K | 0,017 UA |

La película fina da cuatro veces más empuje por kilogramo lejos del Sol; la microcelosía de carbono puede acercarse a
unos pocos diámetros solares, donde la luz es más de 3.000 veces más intensa que en la Tierra. Por encima de su límite,
una vela desplegada se rasga y encoge; las alertas de la nave avisan al 90 %. También puedes añadir área de vela de
10.000 en 10.000 m².
