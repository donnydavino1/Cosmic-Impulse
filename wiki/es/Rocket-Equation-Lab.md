# Laboratorio de la ecuación del cohete

¿Qué velocidad te da cada motor y cuánto dura el encendido? Mueve los controles: la gráfica de la izquierda es la
ecuación del cohete (la velocidad que ganas con el combustible que llevas) y la de la derecha es el precio en tiempo
(cuánto debe encenderse el motor para alcanzar cada velocidad). Los motores son los del juego: las mismas velocidades
de escape, factores de empuje y potencias que en [[Motores|Engines]]. [Abrir el laboratorio en su propia página](rocket-lab.html).

<!-- embed: rocket-lab.html -->

## Qué observar

- **Rendimientos decrecientes.** La velocidad crece con el *logaritmo* de la relación de masas: pasar de 2 a 4 veces
  la masa de tu nave en combustible añade mucho menos que pasar de 0 a 2. Solo un escape más rápido eleva toda la curva.
- **La eficiencia cuesta empuje.** Con la misma potencia, empuje = k × potencia ÷ velocidad de escape. Un escape de
  fusión de 15.000 km/s apenas gasta combustible pero empuja con suavidad, así que sus encendidos duran meses o años;
  un cohete nuclear de núcleo gaseoso alcanza 30 km/s en horas.
- **El tamaño del motor es tiempo.** Tiempo de encendido = combustible × velocidad de escape² ÷ (k × potencia): con el
  doble de potencia el mismo encendido dura la mitad (en el juego: 🛠 → Motores → agrandar el motor; pesa más y genera
  más calor).
- **El juego puede ir más lento que el laboratorio.** El laboratorio supone empuje máximo. En vuelo, la falta de
  radiadores (🌡 [[Calor y radiadores|Heat and Radiators]]), la falta de electricidad para los motores eléctricos o el
  límite de g de la tripulación reducen el empuje. La estimación del piloto automático ya lo tiene en cuenta y te dice
  qué está frenando el motor.

Las líneas discontinuas marcan cambios de velocidad desde órbita baja terrestre: 3,2 km/s para escapar de la Tierra,
unos 9 km/s para llegar a 0,2 UA del Sol y unos 21 km/s para caer al Sol (ver [[Mecánica orbital|Orbital Mechanics]]).
