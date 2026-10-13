# Supervivencia

Tu tripulación necesita **oxígeno, agua y comida**, una **cabina por debajo de 45 °C**, **depurar el CO₂** (que
necesita potencia) y protección contra la **radiación**. La franja de constantes vitales de la cabina muestra cada una:

| Constante | Peligro |
|---|---|
| ❤ Tripulación | al 0 % se pierde la tripulación |
| 🛡 Casco | al 0 % la nave se destruye; una BRECHA pierde oxígeno |
| 🫁 O₂ · 💧 Agua · 🍞 Comida | días restantes; quedarse sin ellos hace daño rápido (oxígeno) o despacio (comida) |
| 🌫 CO₂ | tóxico por encima de 0,6 kg; se acumula si la batería está vacía |
| 🌡 Cabina | la tripulación se sobrecalienta por encima de 45 °C |
| ☢ Dosis | enfermedad por encima de 1 Sv, muerte a 6 Sv; las tormentas solares son el gran riesgo |
| 🔋 Potencia · 🔧 Sistemas | el soporte vital se detiene sin potencia; las piezas averiadas necesitan kits de repuestos |
| ⚠ Amenazas | misiles entrantes, saqueadores, una órbita que choca con el planeta |

**Chocar con el suelo:** tocar un planeta o una luna a más de **10 m/s** respecto a su superficie es un choque:
la nave se destruye y la misión termina. Más despacio, aterrizas (y puedes volver a despegar).

Las **tormentas solares** se anuncian con una hora de antelación: pulsa **Z** para refugiarte tras tus tanques de
agua y combustible, o quédate dentro del campo magnético terrestre. Los **micrometeoroides** desgastan las piezas y a
veces abren brechas en el casco. El soporte vital con reciclaje (investigación) convierte el agua de nuevo en oxígeno.

## Tu tripulación (👩‍🚀 Tripulación, F3)

Vuelas con **dos astronautas**, Ada Reyes y Kenji Sato. Todos respiran, beben y comen: por persona y día **0,84 kg de
oxígeno, 2,5 kg de agua y 1,6 kg de comida** (el soporte vital regenerativo recicla casi toda el agua y el oxígeno).
Empiezas con **un año de suministros para los dos** (615 kg de oxígeno, 1.830 kg de agua, 1.170 kg de comida), y el
cohete inicial lleva 9 toneladas de combustible para poder escapar de la Tierra con todo eso a bordo.

Cada astronauta tiene una **tarea**, y las tareas funcionan solas:

| Tarea | Qué hace | Más rápido con habilidad |
|---|---|---|
| 🩹 Parcheo del casco | sella brechas de micrometeoroides con **kits de parches** | 3 h por brecha en Nivel 1, 36 min en Nivel 5 |
| 🔧 Reparaciones | repara piezas y motores averiados y desgastados con **kits de repuestos** | 6 % del estado por hora × Nivel |
| 🔬 Ciencia | añade puntos de investigación (necesita energía) | 0,5 por hora × Nivel |
| 🛏 Descanso | la tripulación recupera salud el doble de rápido | + Nivel |
| 🧭 Piloto | sin trabajo automático; ayuda a recuperarse | pequeña ayuda |

Ada empieza en parcheo y Kenji en reparaciones, así que las brechas y averías se resuelven solas mientras tengas kits.
La **habilidad** (Nivel 1–5) crece con las horas en una tarea (120, 360, 840 y 1.800 horas), o **📚 Entrénala** ya con
puntos de investigación (30, 60, 120, 240 PI).

**Kits:** los kits de parches pesan 4 kg (2,5 kg de hierro, 1 kg de carbono, 0,5 kg de silicatos); los de repuestos,
14 kg. Empiezas con 8 kits de parches y 6 de repuestos; haz más en 🛠 → 🏭 Fabricar → Suministros.

### Más astronautas, más tareas

**➕ Recluta** un nuevo astronauta en la ventana de Tripulación mientras estés dentro de la zona de gravedad de la
Tierra: te lo lanzan por 2 × 10⁹ J (se ejecuta como un trabajo en 🏭 Fabricar), llega ya con Nivel 2 en una
especialidad y pesa 80 kg. El **espacio en cabina** depende del soporte vital: circuito abierto 4 personas,
regenerativo 8, invernadero 12. Cada astronauta come, bebe y respira, así que los suministros duran menos con una
tripulación mayor. **🏠 Enviar a casa** devuelve a uno a la Tierra (dentro de su zona de gravedad). Cuatro tareas nuevas
ponen a trabajar a una tripulación mayor:

| Tarea | Qué hace (por Nivel de cada uno asignado) |
|---|---|
| 🏭 Fabricación | +15 % de potencia de fabricación |
| ⛏ Minería | +15 % más de la roca que arrancas se recoge |
| 🎯 Artillería | +10 % de daño de armas contra naves y drones |
| ⛑ Medicina | cura un 1 % por hora y elimina antes el mal de radiación |

**🧊 Hibernación** (tecnología *Hibernación de la tripulación*, 800 PI): la tripulación duerme en animación suspendida.
No se come ni se respira nada, nadie envejece ni recibe radiación, las tareas se detienen y la nave se apaga, así que
nada se desgasta ni se avería. Así sobrevive una tripulación a un viaje lento a Próxima Centauri, que puede durar siglos
([[Relatividad|Relativity]]). Despiértalos (☀) para trabajar o combatir; no se puede hibernar durante un combate.

## Las alertas nunca pausan el juego: la 🛟 ralentización de seguridad

Los avisos aparecen como notificaciones y el juego sigue. En su lugar, la **🛟 ralentización de seguridad** (junto a los
controles de tiempo, un interruptor en la cabina física, o **F4**; activada por defecto) vigila cualquier cosa que vaya
a matar a la tripulación en menos de **un día de juego**: quedarse sin oxígeno, agua o comida, una cabina que se
sobrecalienta, la dosis de una tormenta solar, el casco destruyéndose, una órbita que choca con el suelo, un misil que
se acerca. Si encuentra una, un aviso rojo muestra qué y cuándo, y el tiempo se reduce a la velocidad más rápida que
aún te deja **unos 5 minutos reales**. Cuando pasa el peligro, el tiempo vuelve a la velocidad que tenías. En
multijugador el reloj compartido no se puede frenar, pero el aviso sigue apareciendo.

## Puntuación y una segunda oportunidad

Cuando pierdes a la tripulación obtienes una **puntuación**: días sobrevividos, la mayor distancia a la Tierra y la mayor
velocidad, lo cerca que llegaste del Sol, tecnologías, descubrimientos, masa extraída, contratos, asaltantes destruidos y
entrenamiento de la tripulación. Tu mejor puntuación se guarda en tu navegador. En un jugador puedes **⏪ reiniciar 24
horas antes**: el juego guarda una instantánea más o menos cada hora de juego y te devuelve a la de un día antes, a la
velocidad de tiempo más lenta.

## Rasgos, moral y edad

**Rasgos.** Cada astronauta tiene uno: *Manos firmes* (+1 Nivel en reparaciones y parcheo del casco), *Aprende rápido*
(las habilidades crecen un 50 % más deprisa), *Come poco* (20 % menos oxígeno, agua y comida), *Buen ojo* (+1 Nivel en
artillería y minería), *Manitas* (+1 en fabricación y ciencia), *Calma bajo presión* (sube la moral de todos), *Médico de
campo* (+1 en medicina y descanso) o *Piloto as*. Ada Reyes tiene manos firmes, Kenji Sato aprende rápido; los reclutas
llegan con uno.

**La moral (0–100)** marca lo bien que trabajan todos: 50 % de rendimiento a 0, rendimiento completo a 100. Tiende a un
objetivo que explica la ventana de Tripulación: espacio para moverse (cabina por persona), alarmas y avisos, pocos
suministros, una brecha en el casco, mala salud, alguien en descanso, un invernadero y compañeros calmados. Por debajo
de 25 recibes un aviso.

**Edad y la paradoja de los gemelos.** La edad de cada astronauta solo cuenta el tiempo que pasa despierto según el
reloj de la nave. Cerca de la velocidad de la luz el reloj de la nave va más lento ([[Relatividad|Relativity]]) y la
hibernación detiene el envejecimiento, así que tras un viaje rápido la ventana de Tripulación muestra cuánto más jóvenes
son que el calendario de casa.

## Cultivos del invernadero

Con el invernadero biorregenerativo instalado, elige qué crece en él (🏭 Fabricar → **CULTIVOS DEL INVERNADERO**).
Siempre produce todo el oxígeno; el cultivo fija el excedente de comida, la potencia de los LED y el ánimo de la
tripulación. Replantar lleva dos semanas, 40 kg de carbono y 200 kg de agua.

| Cultivo | Excedente de comida por persona y día | Potencia de iluminación | Moral |
|---|---|---|---|
| Patatas y trigo (de serie) | 0,3 kg | 6 kW | +8 |
| Tanques de algas | 0,45 kg | 3,6 kW | −4 |
| Huerto variado | 0,12 kg | 7,5 kW | +16 |

Las algas son la opción de supervivencia cuando falta energía; el huerto mantiene contenta a la tripulación (y
trabajando más rápido) en viajes largos.

## Ingravidez y dosis acumulada

Sin gravedad, los huesos se adelgazan y los músculos se atrofian. Cada astronauta tiene una **forma física** (100 % =
como en la Tierra) que cae cada mes un 2,5 % sin ejercicio, un 1 % con 1 hora al día y un 0,25 % con 2,5 horas al día
(la rutina de la ISS y la base del juego). Elige el horario en 👩‍🚀 Tripulación: menos ejercicio deja más tiempo para las
tareas, pero una forma física baja ralentiza todo el trabajo (× 0,6 + 0,4 · forma) y baja la moral. **El empuje es
gravedad real:** mientras el motor empuja la nave a 2 m/s² o más, la forma física se recupera un 3 % al mes × (g / 9,81).

Cada astronauta lleva además una **dosis acumulada** desde que se unió. El límite de carrera es 600 mSv; cada sievert
añade un 5 % de riesgo de cáncer mortal a lo largo de la vida. Por encima del límite, la moral baja.

## Problemas médicos

Más o menos cada 18 meses cada astronauta sufre un problema médico: un cálculo renal (el doble de probable cuando los
huesos pierden calcio en ingravidez), un absceso dental, una infección de la piel, inflamación ocular porque los
fluidos suben a la cabeza (SANS), una quemadura con una tubería de refrigerante caliente o (rara vez) apendicitis. El
paciente queda fuera de servicio hasta recuperarse, de 3 a 14 días. Un compañero en servicio médico acelera la
recuperación un 50 % por nivel y evita que los casos graves desgasten la salud de la tripulación; sin él, la apendicitis
es peligrosa.

### Gravedad por rotación

Hacer girar la nave da a la tripulación una gravedad centrípeta, g = ω²r (👩‍🚀 Tripulación → **Gravedad por rotación**).
Girar el casco de punta a punta usa la mitad de la longitud de la nave como radio, así que necesita mucho giro para poca
gravedad; un cable de 225 m con contrapeso (400 kg de carbono, +500 kg) da 1 g a unas 2 rpm. Por encima de unas 4 rpm el
oído interno protesta: mareo y menos moral. El giro se detiene mientras el motor empuja, y la gravedad por rotación
recupera la forma física igual que la gravedad por empuje.

### Límite de aceleración

Las personas toleran 1 g indefinidamente, 2–3 g durante horas tumbadas en asientos de aceleración y 6 g solo unos
minutos. En 👩‍🚀 Tripulación elige el límite (1, 2, 3 o 6 g; por defecto 3): el motor se limita a él aunque la estructura
aguante más. Por encima de 2 g la tripulación se agota (salud −1 % por hora por cada g por encima de 2). Una tripulación
en hibernación no tiene límite.

El aislamiento también pesa en la moral: cuando la Tierra está a más de un minuto luz, las llamadas a casa se convierten en grabaciones intercambiadas (moral −2, hasta −10 cuando la Tierra está a días luz).
