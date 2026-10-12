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
