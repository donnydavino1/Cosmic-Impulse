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

| Valor | Depende de | Por qué ([[Las leyes de Cosmic Impulse|The Laws of Cosmic Impulse]]) |
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

## Montar módulos junto al eje

Selecciona un módulo y pulsa **⤴ Montar junto al módulo de delante** para fijarlo al costado de ese módulo (su
*anfitrión*) en vez de ponerlo en el eje. Los módulos montados no añaden longitud, así que la nave se **acorta**:
gira más rápido y aguanta más empuje. Varios módulos en el mismo anfitrión se reparten por igual a su alrededor:
**2 = pareja en espejo, 3 = triángulo, 4 = cruz** (simetría). Usa **◀ / ▶** para pasarlo a otro anfitrión, o
**⤵ Volver al eje**.

Dónde montas cada cosa importa:
- **Tanques montados alrededor de la cabina**: el mejor refugio de tormentas (rodean a la tripulación).
- **Radiadores**: junto al reactor que los calienta.
- Un **reactor** montado junto a la tripulación está cerca de ella: su dosis sube. Déjalo al final del eje.

**Arrastrar y soltar:** en la vista lateral, arrastra un módulo a lo largo de la línea para reordenarlo, o por encima
o por debajo para montarlo junto al módulo más cercano. La pequeña **vista frontal** de la derecha mira a lo largo de
la nave al anillo de módulos montados del módulo seleccionado. Los módulos mejorados muestran una franja de color por
marca en la nave 3D.

## Construir y reciclar desde el constructor

La sección **🧩 Añadir una pieza** lista cada pieza por categoría, con su masa, materiales, energía y la investigación que
necesita. **🏭 Construir** la pone en cola para tu fabricador (se une a la popa de la nave). Con un módulo seleccionado
también puedes **⤴ Construir junto a** él, o **⤴⤴ Construir una pareja en espejo junto a** él: las piezas terminadas se
montan alrededor de ese módulo automáticamente. **♻ Reciclar esta pieza** devuelve la mitad de sus materiales.

Bajo la vista lateral, una **vista previa renderizada** muestra el borrador como una nave iluminada en 3D: paneles del
casco, tanques de lámina dorada, armazones, alas de radiadores, la antena, la tobera del motor y una franja de color por
marca de mejora. La tabla también muestra el **Δv** que tu motor actual obtiene de su combustible con la masa del borrador.

## Las armas y los motores también son módulos

Cada arma que has construido es un módulo. Las **torretas** (láser de minería, láser de pulsos, haz de partículas,
misiles) se montan junto a un módulo como cualquier otro; el **cañón de riel** es un arma larga que va a lo largo del eje,
porque toda la nave debe girar para apuntarlo. Los **motores** están en la popa: el que usas y los demás que tengas
(añaden masa allí y retrasan tu centro de masa). La fila **🚀 Motores en la popa** te deja cambiar de motor o desguazarlo.

## Diseñar tus propias piezas

**🧪 Diseñar una pieza nueva** (o **F7**) abre el diseñador: elige radiador, batería, reactor o blindaje, su tipo y arrastra
su tamaño. El diseñador calcula su masa, materiales, energía de fabricación, investigación necesaria y rendimiento con la
misma física para todos (reproduce exactamente las piezas de serie a sus tamaños). Un diseño guardado aparece en
**Añadir una pieza** y se construye, monta, mejora y repara como cualquier otra.

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
