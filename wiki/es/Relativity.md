# Relatividad

Por debajo de unos miles de km/s, basta con Newton. Cerca de la velocidad de la luz (c = 299.792 km/s), Cosmic
Impulse pasa a la relatividad especial, como dice la [[Ley 7|The Laws of Cosmic Impulse]].

## Gamma

El factor de Lorentz γ = 1 / √(1 − v²/c²) dice con qué fuerza actúa la relatividad:

| Velocidad | γ | Un año en tu nave son … en casa |
|---|---|---|
| 1 % de c (3.000 km/s) | 1,00005 | 1 año y 26 minutos |
| 10 % de c | 1,005 | 1 año y 2 días |
| 50 % de c | 1,155 | 1,16 años |
| 90 % de c | 2,29 | 2,3 años |
| 99 % de c | 7,09 | 7,1 años |
| 99,9 % de c | 22,4 | 22 años |

## Dos relojes

El juego muestra el **tiempo de juego** (el reloj del sistema solar) y el **reloj de la nave** (tu tiempo propio).
Cerca de la velocidad de la luz tu tripulación envejece, come y respira según el reloj de la nave, así que una nave
rápida necesita menos suministros para el mismo viaje ([[Supervivencia|Survival]]).

## El muro de energía

La energía cinética es (γ − 1)·m·c². Una nave de 100 toneladas al 10 % de c lleva unos 4,5×10¹⁹ J, más o menos un mes
del consumo energético mundial actual. Al 99 % de c es unas 1.200 veces más. Por eso solo los motores de fusión y
antimateria llegan ([[Motores|Engines]], [[Tecnologías|Technologies]]), y por eso el contrato *Prueba de velocidad
de la luz* pide el 1 % ([[Contratos|Contracts]]).

## Lo que ves

La información de los sensores también viaja a la velocidad de la luz, así que lo lejano se ve como era
([[Sensores y radar|Sensors and Radar]]); los datos de las sondas vuelven a la velocidad de la luz
([[Drones y sondas|Drones and Probes]]).

Cerca de la velocidad de la luz el propio cielo cambia, tal como predice la relatividad. **Aberración**: una estrella a un
ángulo θ de tu dirección de viaje aparece a θ′ con cos θ′ = (cos θ + β) / (1 + β cos θ), así que las estrellas se agolpan en
un disco brillante delante y el cielo de detrás se vacía. **Efecto Doppler**: la luz de delante llega con mayor frecuencia,
D = γ (1 + β cos θ), así que las estrellas de delante se vuelven azules y brillan más y las de detrás se enrojecen y se
apagan. Ambos aparecen en el cielo del juego desde el 0,2 % de la velocidad de la luz. En la cabina de vuelo 3D, la
pantalla VUELO también muestra γ y a qué ritmo va el reloj de tu nave.

## ¿Cuánto se tarda en llegar a Próxima Centauri?

Próxima Centauri, la estrella más cercana, está a **4,25 años luz** (268.000 UA). La duración del viaje depende de lo
rápido que pueda ir tu nave, y ves tres relojes:

| Velocidad máxima | Universo (tiempo de juego) | Reloj de tu nave | Tiempo real (velocidades más rápidas) |
|---|---|---|---|
| **0,99 c** (γ ≈ 7,09, antimateria) | ≈ 4,3 años | ≈ **7,3 meses** | segundos de vuelo libre, más los encendidos |
| 0,24 c (antimateria, 200 t de combustible) | ≈ 18 años + encendidos | ≈ 17,5 años | ≈ 15 minutos |
| 0,02 c (fusión, 400 t de combustible) | ≈ 210 años + encendidos | ≈ 210 años | ≈ 40 minutos |
| 20 km/s (vuelo libre a velocidad de escape) | ≈ 64.000 años | igual | ≈ 17 minutos (casi todo cruzando las 2.000 UA alrededor de cada estrella) |

Las **velocidades de espacio profundo** (**1 s = 9,5, 95 y 950 años**) se activan a más de **2.000 UA de toda
estrella**, donde nada cambia deprisa; a menos de 2.000 UA del Sol o de Próxima lo más rápido es 1 s = 1 año, y al
volver a entrar el tiempo baja a eso automáticamente. Así, cualquier nave capaz de salir del sistema solar llega a
Próxima en mucho menos de un día de tiempo real; el diálogo del crucero muestra la estimación antes de salir. La física
es la misma a cualquier velocidad del tiempo: el integrador solo da pasos más grandes donde la gravedad es débil y suave.

Para ir: 🧭 NAVEGAR → busca *Próxima* → **🚀 Crucero interestelar**. El piloto automático de crucero primero sale del
pozo gravitatorio del Sol (empujando en el sentido de su movimiento, así un motor suave sube en espiral en vez de caer
hacia el Sol), luego acelera hacia Próxima hasta que el propelente restante basta justo para frenar, vuela libre y
frena para llegar a menos de 2 UA de la estrella, y después se coloca en una órbita circular a su alrededor. Te avisa si la tripulación necesitaría suministros para más de un año
(**🧊 hibérnala**: [[Supervivencia|Survival]]), si el calor limitaría tu motor o si no tienes escudo Whipple contra el
polvo de la nube de Oort.

## Cómo calcula el juego la gravedad y la relatividad (el modelo exacto)

**Respuesta corta:** Cosmic Impulse **no** usa un integrador post-newtoniano (PN) completo para el movimiento. Usa
**relatividad especial con gravedad newtoniana**: la gravedad de Newton (inversa del cuadrado) actúa como una fuerza
sobre el momento relativista de la nave, en un único sistema inercial centrado en el Sol. Además, el **reloj de la
nave** incluye el **primer término post-newtoniano del reloj** (la dilatación gravitacional del tiempo, el efecto que
corrigen los satélites GPS). Todo lo que sigue es exactamente lo que hace el código (`game/js/0100-physics.js`).

### Qué se calcula

| Pieza | Fórmula en el juego | Notas |
|---|---|---|
| Sistema y tiempo | un sistema inercial centrado en el Sol; **T** es su tiempo coordenado | el reloj de "tiempo de juego" |
| Estado de tu nave | posición **x** y *velocidad propia* **u = γv** | u es el momento por kilogramo de masa en reposo |
| Factor de Lorentz | γ = √(1 + u²/c²) | escrito con u, así la velocidad nunca supera c |
| Movimiento | dx/dT = u / γ | |
| Gravedad | du/dT = Σ −GMᵢ (x − xᵢ) / \|x − xᵢ\|³ | Sol, planetas, lunas y Próxima Centauri; la ley de Newton actuando sobre el momento |
| Empuje | la fuerza del motor se calcula en el sistema propio de la nave y se transforma: la parte a lo largo del movimiento no cambia, la perpendicular se divide entre γ | la transformación de fuerzas estándar de la relatividad especial |
| Combustible, energía, tripulación | se gastan por **tiempo de la nave** dτ | una nave rápida quema, respira y come según su propio reloj |
| Límite de Δv | v = c · tanh( (vₑ/c) · ln(m₀/m₁) ) | la ecuación relativista del cohete |
| Energía almacenada | añade masa E/c² | una batería llena pesa (muy poco) más |
| Velocidad máxima | 0,99 c (γ ≈ 7,1) | un límite del juego |
| **Reloj de la nave** | dτ = (dT / γ) · (1 + Φ/c²), con Φ = −Σ GMᵢ / rᵢ | **dilatación de la relatividad especial × el término gravitacional de campo débil** |
| Lo que ven los sensores | un contacto aparece donde estaba hace d/c: x − v·d/c | tiempo de luz, a primer orden |

Los planetas y lunas siguen órbitas circulares fijas en un plano (atraen a las naves, las naves no los atraen); los
asteroides siguen órbitas elípticas de Kepler reales. El integrador es un **leapfrog impulso–deriva–impulso**
(Verlet de velocidades): cada paso es como mucho el 2 % del menor tiempo orbital o de cruce local (y como mucho
10 minutos), lo que mantiene las órbitas estables durante muchas vueltas.

En el widget de cabina **🕐 Relojes** (añádelo con el editor del panel, tecla **I**), **Ritmo del reloj de la nave** muestra el total y sus dos factores. En órbita baja terrestre el
factor de velocidad es de unos 1 − 3,3×10⁻¹⁰ y el de gravedad de unos 1 − 1,05×10⁻⁸ (casi todo por el potencial del
Sol a 1 UA; la Tierra añade 6,5×10⁻¹⁰).

### Qué queda fuera y cuánto importa

| Efecto (relatividad general / post-newtoniano) | Tamaño en el sistema solar | Por qué no está |
|---|---|---|
| Correcciones 1PN al *movimiento* (ecuaciones EIH) | el perihelio de Mercurio gira 43″ por siglo; el perigeo de una órbita baja, unos 14″ por año | mucho menor que otras aproximaciones del juego (órbitas planetarias circulares, planetas sin achatamiento) |
| Curvatura extra de objetos rápidos | la RG curva la luz el doble que Newton (1,75″ en el borde del Sol); una nave casi a la velocidad de la luz se curvaría hasta ~2× lo newtoniano | solo importa en naves relativistas que rozan el Sol; podría añadirse |
| Arrastre de marco (Lense–Thirring) | decenas de milisegundos de arco por año en órbita terrestre | despreciable |
| Tiempo de propagación de la gravedad | la gravedad actúa al instante | en RG casi se cancela para fuentes lentas |
| Retardo de Shapiro y curvatura de la luz en sensores | hasta ~200 microsegundos de retardo de radar; los sensores usan líneas rectas | despreciable para el juego |
| Ondas gravitacionales | ~10⁻¹⁶ m/s² equivalentes del sistema Sol–Júpiter | totalmente despreciable |
| Movimiento propio de los planetas | órbitas circulares y coplanares en vez de elipses | la mayor simplificación, elegida por velocidad; *no* es un tema de relatividad |

**En una frase:** movimiento = gravedad newtoniana de N cuerpos + relatividad especial exacta; relojes = relatividad
especial + el primer término gravitacional post-newtoniano (campo débil); lo demás de la relatividad general queda muy
por debajo de lo que podrías notar jugando.
