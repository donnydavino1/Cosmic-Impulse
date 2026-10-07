# Constructor de naves

Pulsa **7** (móvil: ☰ → Nave → Constructor de naves) para abrir el **🧱 Constructor de naves**. Muestra tu nave de
lado, con la proa a la izquierda y el motor a la derecha, dibujada con el tamaño real de cada módulo. En 🎨
Personalizar elige la forma de casco **Modular** para ver la misma distribución en tu nave 3D.

## Módulos

Cada pieza que instalas se convierte en un **módulo** del eje de la nave (la estructura es el propio eje). Hay dos
tipos más:

| Módulo | Qué es | Tamaño |
|---|---|---|
| 👩‍🚀 Cabina de la tripulación | tu pieza de soporte vital; ahí vive la tripulación | al menos 4 m |
| ⛽ Tanques | todo el propelente y el agua, en un grupo | según el volumen que llevas |
| ⌗ Armazón | una celosía vacía de 5 m, 100 kg de hierro | 5 m |
| 🔬 🏭 🔋 ⚛ ♨ 🛡 | laboratorios, fabricadores, baterías, generadores y reactores, radiadores, blindaje | según su masa y densidad |

Las piezas nuevas se añaden en la popa, justo delante del motor. Una nave nueva empieza con la tripulación en la
proa y los tanques justo detrás.

## Qué cambia la distribución

| Valor | Depende de | Por qué ([[Las leyes de Stellar Impulse|The Laws of Stellar Impulse]]) |
|---|---|---|
| **Giro de 180°** | cuánta masa está lejos del centro de masa | Ley 2: dos propulsores de 220 N deben hacer girar tu momento de inercia |
| **Reapuntar el cañón de riel** | medio giro de 180° | el cañón está fijo a lo largo de la nave: debe apuntar toda la nave ([[Combate|Combat]]) |
| **Aceleración máxima** | la longitud | las estructuras están calculadas para naves de hasta 25 m; las más largas se doblan y baja el límite de g |
| **Dosis del reactor a la tripulación** | la distancia y los módulos en medio | Ley 6: la radiación cae con la distancia²; la masa en medio la absorbe ([[Radiación|Radiation]]) |
| **Refugio de tormentas** | si los tanques tocan la cabina | el agua y el combustible solo protegen si rodean a la tripulación |

El constructor compara **Ahora** con tu **Borrador** y colorea cada cambio en verde (mejor) o rojo (peor).

## Reacondicionar

Prepara el borrador y pulsa **🔧 Reacondicionar con esta distribución**. Es un trabajo para tu fabricador
([[Nave e ingeniería|Ship and Engineering]]): mover módulos cuesta 20 kJ por cada kilo movido, y cada armazón nuevo
necesita 100 kg de hierro. Quitar un armazón devuelve la mitad de su hierro.

## Diseños guardados

**💾 Guardar este borrador** guarda una distribución con un nombre. Un diseño recuerda los *tipos* de módulos en
orden (cabina, tanques, armazones, cada tipo de pieza), así que puedes cargarlo en una nave posterior que tenga las
mismas piezas y reacondicionarla de una vez.

## Diseños para probar

- **El remolcador:** todo bien junto. Giros rápidos y empuje completo, pero un reactor junto a la tripulación.
- **La nave larga:** tripulación en la proa, tanques detrás, un armazón largo y luego el reactor y los radiadores en
  la popa. Casi sin dosis del reactor y con un buen refugio, pero gira despacio y con menos límite de g.
- **La cañonera:** corta y equilibrada alrededor del centro de masa para que el cañón de riel reapunte rápido.

Las naves reales funcionan igual: los cohetes nucleares ponen el reactor lejos, detrás de un escudo de sombra y del
tanque de propelente.
