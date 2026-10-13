# Vuelo y órbitas

En órbita siempre estás cayendo; simplemente te mueves de lado tan rápido que nunca llegas a tocar el planeta.

| Haces | Qué pasa |
|---|---|
| Empujar **hacia delante** (en tu dirección de movimiento, W en modo órbita) | el lado opuesto de tu órbita sube; acabas *más alto y más lento* |
| Empujar **hacia atrás** (S) | el lado opuesto baja; si empujas lo suficiente, chocas con el planeta |
| Empujar **hacia fuera/dentro** (D/A) | gira el eje largo de la órbita; un cambio pequeño y poco eficiente |
| Empujar **arriba/abajo** (E/Q) | inclina el plano de la órbita |

- El **modo órbita** (por defecto) usa direcciones relativas a tu órbita. **M** cambia a ejes fijos **X/Y/Z**.
- La **flecha verde** del mapa orbital muestra hacia dónde te mueves; el **lazo naranja** es tu órbita completa.
- **Escapar de un planeta** requiere unos 3,2 km/s desde la órbita baja terrestre. Tu combustible inicial da unos 3,9 km/s.
- El **delta-v** (cuánto puedes cambiar tu velocidad) sigue la ecuación del cohete: cada kilo de combustible extra
  ayuda menos; un motor mejor (mayor velocidad de escape) ayuda mucho. El Analizador de diseño en 🛠 muestra tu cifra.
- La **aceleración del tiempo** lo acelera todo. Los encendidos manuales limitan el tiempo a ×10; los ataques también;
  los encuentros cercanos en multijugador van en tiempo real.
- **Relatividad:** cerca de la velocidad de la luz, el reloj de tu nave (tiempo propio) va más lento que el resto del
  universo. Se muestran ambos relojes. Llegar a 0,99c es un objetivo de final de partida.

**Encontrar cosas:** la ventana 🧭 NAVEGAR tiene un buscador: escribe parte de un nombre (en cualquiera de los tres
idiomas) para encontrar planetas, lunas, Próxima Centauri, asteroides o la nave de otro jugador, y luego *Mirar*,
*Volar aquí* o volar a su distancia del Sol. **Antes de un viaje** el piloto automático estima el propelente y los días
que necesita; si te falta combustible, oxígeno, agua o comida, te dice qué falta y te pregunta si volar o cancelar.

Los motores van desde cohetes químicos (mucho empuje, poca eficiencia) pasando por iónicos y nucleares hasta fusión
y antimateria (eficiencia enorme, necesitan investigación y combustible). Ver [[Ingeniería|Ship and Engineering]].

## Crucero interestelar

Más allá de los planetas, la búsqueda de 🧭 NAVEGAR también encuentra **Próxima Centauri** (☀) y su planeta
**Próxima b**. El botón **🚀 Crucero interestelar** de la estrella entrega la nave a un piloto automático relativista:
sale del pozo gravitatorio del Sol, acelera hasta que el propelente restante basta justo para frenar (nunca por encima
de 0,99 c), vuela libre y frena a tiempo para detenerse en la estrella. A más de 2.000 UA de toda estrella se activan
**velocidades de espacio profundo** más rápidas (hasta 1 s = 950 años), así que el viaje dura minutos de tiempo real en
vez de días. Ver [[Relatividad|Relativity]] para los tiempos de viaje y [[Supervivencia|Survival]] para la hibernación.

**Las estimaciones son honestas con los motores lentos.** La estimación antes de un viaje incluye cuánto debe
encenderse el motor con el empuje que realmente puede dar, no solo el vuelo libre. Si el calor (faltan radiadores) o la
electricidad limitan el empuje, la comprobación del viaje lo dice, cuánto y qué añadir; en vuelo, la línea del piloto
automático muestra *motor limitado al X %* con el motivo. Eso explica la antigua promesa de "77 días" que nunca
llegaba: un motor suave o limitado da vueltas en espiral alrededor de la Tierra durante meses o años antes de poder
escapar. Ver el [[Laboratorio de la ecuación del cohete|Rocket Equation Lab]] para los tiempos de encendido.

## Ventanas de transferencia

🧭 NAVEGAR → **VENTANAS DE TRANSFERENCIA** muestra cada planeta con el camino más barato hasta él, una transferencia de
Hohmann: el tiempo de vuelo, el cambio de velocidad desde tu órbita actual (salir desde órbita baja terrestre incluye
la ventaja Oberth de encender en lo profundo de la gravedad de la Tierra), tu velocidad de llegada, el ángulo que el
planeta debe llevarte de ventaja (Marte: 44°) frente al ángulo actual y los días hasta la próxima ventana. Las ventanas
se repiten cada periodo sinódico: 780 días para Marte, 584 para Venus, 399 para Júpiter.

## Asistencias gravitatorias

🧭 NAVEGAR → **ASISTENCIAS GRAVITATORIAS** muestra lo que podría darte un sobrevuelo de cada planeta. Respecto al
planeta sales tan rápido como llegaste (v∞), solo desviado un ángulo δ, con sen(δ/2) = 1 / (1 + rp·v∞²/GM); respecto
al Sol ese giro es un cambio de velocidad gratis de hasta 2·v∞·sen(δ/2). La tabla usa un paso más cercano del radio del
planeta más un 10 % y dos velocidades de llegada: tu velocidad relativa al planeta ahora y la del final de una
transferencia de Hohmann. Llegar a Júpiter en una transferencia de Hohmann (unos 5,6 km/s) puede desviarte unos 158° y
darte hasta 11 km/s gratis.

## Atmósferas: aerofrenado y calentamiento de entrada

La Tierra, Venus, Marte, Titán y los planetas gigantes tienen atmósfera. Dentro de una, el arrastre
a = ½ρv²·Cd·A/m te frena (densidad ρ = ρ0·e^(−h/H), con alturas de escala ajustadas a la alta atmósfera: Tierra
~6,9 km, Marte ~8,2 km, Venus ~5,9 km). Baja tu punto más bajo al aire tenue y cada pasada te quita velocidad gratis
(**aerofrenado**), o entra más hondo para quedar capturado en una sola pasada (**aerocaptura**). El aire también
calienta el casco, q ≈ 1,74×10⁻⁴·√ρ·v³ W/m²: por encima de 40 kW/m² un casco sin escudo arde; un escudo térmico de
carbono-carbono aguanta 10 MW/m². Rozar la Tierra a 120 km a velocidad orbital son unos 15 kW/m²; volver de la Luna a
80 km, casi 800 kW/m². Las órbitas bajas habituales quedan por encima del aire, salvo en Titán, cuya bruma supera los
1.000 km (el planificador de órbitas te avisa).

## Planificador de misión

🧭 NAVEGAR → **PLANIFICADOR DE MISIÓN**: encadena paradas (planetas, lunas, Plutón) y mira el cambio de velocidad de cada
tramo y del viaje completo, el tiempo de vuelo inercial y si tu motor y tu propelente bastan. Cada tramo es una
transferencia de Hohmann de órbita baja a órbita baja, con efecto Oberth en ambos extremos; los viajes a una luna de
otro planeta circularizan a la distancia de la luna y luego son capturados por ella. Tierra → órbita baja de Marte son
unos 5,6 km/s; Tierra → Luna, unos 3,8.

## Gráfico porkchop

🧭 NAVEGAR → **GRÁFICO PORKCHOP**: el gráfico que usan los diseñadores de misiones reales para elegir fechas de
lanzamiento. Para cada día de salida (horizontal) y tiempo de vuelo (vertical), el juego resuelve exactamente el
problema de Lambert (la única órbita alrededor del Sol que une tu planeta el día de salida con el objetivo el día de
llegada) y colorea el cambio de velocidad total: salida de la órbita baja más captura en el destino. Oscuro es barato,
las líneas blancas marcan cada 1 km/s y la cruz es el lanzamiento más barato. Pasa el ratón para leer cualquier punto.
Tierra → Marte sale en unos 5,6 km/s para un vuelo de ~260 días, repitiéndose cada ~2,1 años.

## Girar y frenar

🧭 NAVEGAR → **GIRAR Y FRENAR** es para motores potentes que no necesitan esperar ventanas: acelera hacia el destino la
primera mitad del viaje, da la vuelta y frena la segunda mitad. Sobre una distancia en línea recta d con aceleración a,
el viaje dura t = 2√(d/a) y necesita un cambio de velocidad de 2√(d·a). Cerca de la velocidad de la luz se usa la
versión relativista exacta: rapidez en el punto medio φ = acosh(1 + a·d/2c²), tiempo de a bordo 2cφ/a, tiempo
terrestre (2c/a)·senh φ. La tabla muestra la duración, la velocidad máxima y la razón de masas que necesita un encendido
completo con tu motor; si tu propelente no alcanza, el plan acelera, planea y frena. A 1 g Marte está a unos dos días;
Próxima Centauri lleva 3,5 años de tiempo de a bordo (5,9 años en la Tierra). Se ignoran la gravedad y el movimiento de
los planetas.

El planificador de misión puede escribir el plan actual en el diario del capitán (📜).
