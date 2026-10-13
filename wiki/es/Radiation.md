# Radiación

Tres tipos de radiación llegan a tu tripulación. La dosis se mide en sieverts (Sv): por encima de **1 Sv** recibido
en poco tiempo la tripulación enferma; **6 Sv** es mortal ([[Supervivencia|Survival]]).

| Fuente | Dosis típica | Cómo bloquearla |
|---|---|---|
| Rayos cósmicos (galácticos) | 1,8 mSv al día en el espacio profundo, 0,4 dentro del campo magnético terrestre | un blindaje grueso ayuda solo un poco |
| Tormentas solares | horas de dosis muy alta, más fuerte cerca del Sol | masa entre tú y el Sol, el refugio, el campo magnético terrestre |
| Tu reactor | según su tamaño | distancia y masa en medio (blindaje de sombra) |

## Blindaje en g/cm²

El blindaje se cuenta como masa por área: g/cm². Tu casco da 2; el chapado de aluminio y los forros de polietileno
añaden 5 cada uno (el polietileno cuenta 1,6× porque el hidrógeno frena mejor las partículas). Las paredes de agua
añaden hasta 20 g/cm² con el agua que llevas ([[Piezas|Parts]]).

## Tormentas solares

El aviso de tormenta te da como una hora. Pulsa **Z** para el **refugio**: la tripulación se pone detrás de los
tanques de agua y combustible (hasta 15 g/cm²). Solo funciona del todo si los tanques están junto a la cabina, lo que
se ajusta en el [[Constructor de naves|Ship Builder]]. Las tormentas caen con el cuadrado de tu distancia al Sol
(Ley 6), y dentro del campo magnético terrestre recibes el 5 % de la dosis. Un escudo magnético activo reduce las
tormentas un 90 %.

## Reactores

La dosis de un reactor cae con el cuadrado de la distancia y con la masa entre él y la tripulación. Pon el reactor
en el extremo de la nave, detrás de los tanques y de un armazón, y la dosis casi desaparece. El
[[Constructor de naves|Ship Builder]] muestra la cifra.

## Investigación

Tecnologías de blindaje: polietileno, paredes de agua y escudo magnético activo ([[Tecnologías|Technologies]]).

## Cinturones de radiación

Los campos magnéticos planetarios atrapan protones y electrones en cinturones. Dosis tras 2 g/cm² de blindaje:

| Dónde | Dosis |
|---|---|
| Órbita baja terrestre (bajo los cinturones) | nada de los cinturones |
| Cinturón interior de la Tierra (1,6 radios terrestres desde el centro) | ~90 mSv/día |
| Cinturón exterior (4,5 radios) | ~80 mSv/día (electrones: un poco de blindaje frena la mayoría) |
| Cruzar ambos al salir | ~2 mSv |
| Júpiter en la órbita de Ío | ~33 Sv/día: mortal en horas |
| Europa / Ganímedes / Calisto | ~5 Sv/día / ~0,24 Sv/día / ~0,5 mSv/día |
| Saturno (los anillos absorben las partículas) | ~7 mSv/día como máximo |

Los protones duros se reducen con el blindaje como e^(−ad/15 g/cm²), los electrones blandos como e^(−ad/1,5) y los
electrones muy energéticos de Júpiter solo como e^(−ad/20). Las alertas avisan al entrar en un cinturón. Calisto es el
lugar seguro para aparcar en Júpiter.

## El ciclo solar

La actividad del Sol sube y baja en unos 11 años. Cerca del máximo solar las tormentas de protones son unas cuatro veces
más frecuentes que en el mínimo y más fuertes, pero el campo magnético más intenso del Sol aparta los rayos cósmicos
galácticos: su dosis es un 25 % menor en el máximo y un 25 % mayor en el mínimo. El juego empieza poco después del
máximo; el panel de soporte vital (H) muestra la actividad y cuándo llega el próximo máximo o mínimo.

## Cambios de bit en el ordenador de vuelo

Una partícula rápida que atraviesa un chip de memoria puede cambiar un bit. En un cinturón de radiación o una tormenta
solar, un ordenador de vuelo normal puede bloquearse y reiniciarse, y el piloto automático se desconecta (alrededor de
un fallo por cada 200 mSv/h de exposición por hora: raro al cruzar los cinturones terrestres, cada hora cerca de Ío). Un
ordenador endurecido contra la radiación (🏭 Fabricar → **ORDENADOR DE VUELO**: chips especiales, memoria con corrección
de errores, votación triple) no se inmuta.
