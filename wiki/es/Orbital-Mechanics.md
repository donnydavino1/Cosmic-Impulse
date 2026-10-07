# Mecánica orbital

La versión corta está en [[Vuelo y órbitas|Flying and Orbits]]. Esta página va más a fondo, con las cifras que usa el juego.

## Velocidad en órbita

Para cualquier órbita alrededor de un cuerpo con parámetro gravitatorio μ = G·M, la **ecuación vis-viva** da tu
velocidad a una distancia *r* de su centro, para una órbita cuyo radio medio (semieje mayor) es *a*:

v² = μ · (2/r − 1/a)

- Una **órbita circular** tiene v = √(μ/r). En órbita baja terrestre a 400 km: unos **7,67 km/s**, una vuelta cada 92 minutos.
- La **velocidad de escape** es √(2μ/r): unos 10,85 km/s a 400 km. Desde órbita baja necesitas unos **3,2 km/s**
  más para dejar la Tierra para siempre.

## Las seis direcciones

| Empuje | Nombre | Efecto | Teclas (modo órbita) |
|---|---|---|---|
| a favor del movimiento | **progrado** | sube el lado opuesto de la órbita | W |
| en contra | **retrógrado** | baja el lado opuesto | S |
| hacia / desde el planeta | **radial** | gira el eje largo de la órbita | A / D |
| fuera del plano | **normal / antinormal** | inclina la órbita | E / Q |

## Cambiar de órbita barato: transferencias de Hohmann

Para pasar de una órbita circular a otra más alta, empuja en progrado una vez para estirar la órbita hasta que su
punto lejano toque el objetivo, deja pasar media órbita y vuelve a empujar en progrado para redondearla. Es la
**transferencia de Hohmann**, el camino de dos encendidos más barato. De la órbita de la Tierra alrededor del Sol a
la de Marte cuesta unos **2,9 km/s** el primer empuje y **259 días** de vuelo. Las
[[sondas científicas|Drones and Probes]] usan exactamente este cálculo.

**Ventanas de lanzamiento:** Marte debe estar en el lugar adecuado cuando llegas. La Tierra y Marte se alinean así
cada **780 días** (el periodo sinódico); por eso las misiones reales salen en ventanas.

## El efecto Oberth

Un empuje te da más energía cuando vas más rápido: en el fondo de un pozo gravitatorio, en el punto más bajo de tu
órbita. Salir de la órbita baja terrestre hacia Júpiter cuesta unos 6,3 km/s; el mismo viaje empezado en el espacio
profundo necesita unos 8,8 km/s. Por eso las sondas lanzadas desde órbita baja llegan más lejos.

## Órbitas geoestacionarias y geosíncronas

Una órbita **síncrona** da una vuelta exactamente en el tiempo que el cuerpo tarda en girar una vez. Para la Tierra está
a 42.164 km del centro (35.786 km de altura). **Geoestacionaria** significa síncrona *y* en el ecuador: te quedas sobre
un mismo punto, como los satélites meteorológicos y de televisión. **Geosíncrona** mantiene tu inclinación, así que
dibujas un ocho sobre el suelo.

Pulsa **F6** (o 🛰 *Planificador de órbitas* en 🧭 NAVEGAR) alrededor de cualquier planeta o luna: elige geoestacionaria,
geosíncrona o una órbita circular personalizada, escribe la distancia al centro y mira el periodo, la velocidad y el Δv
antes de que el piloto automático vuele con tu motor y combustible.

## Inclinar una órbita

Cambiar el plano de la órbita un ángulo Δi cuesta Δv = 2·v·sen(Δi/2). A 7,7 km/s, inclinar 10° cuesta 1,3 km/s:
inclina lejos del planeta, donde vas despacio.

## Esferas de influencia

Cerca de un planeta domina su gravedad; lejos domina la del Sol. El juego siempre integra la atracción de todos los
cuerpos, pero los datos de órbita usan tu **cuerpo dominante**, el que más pesa donde estás.

## La ecuación del cohete

Δv = vₑ · ln(m_llena / m_vacía). Duplicar el propelente **no** duplica tu Δv; un escape más rápido (vₑ) sí ayuda.
Ver [[Motores|Engines]] y [[Combustibles|Fuels]], y el Analizador de diseño en 🛠.
