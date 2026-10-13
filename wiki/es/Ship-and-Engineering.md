# Nave e ingeniería

Abre **🛠 Ingeniería** con **B** (móvil: ☰ → Nave). Sus pestañas:

| Pestaña | Qué haces ahí |
|---|---|
| 🔧 Nave | piezas instaladas, su estado, reparaciones (kits de repuestos) |
| 🏭 Fabricar | construir piezas con materiales y energía |
| 🔬 Investigar | gastar puntos de investigación en tecnologías (hay 37) |
| 🚀 Motores | elegir y dimensionar motores; potencia y masa se compensan |
| 🔫 Armas | construir armas, lanzar drones de práctica |
| ⛏ Inventario | materiales, combustible, suministros |
| 📚 Códice | descubrimientos y registros |
| 💾 Guardar | ranuras de guardado y partida nueva |
| 🧪 Pruebas | trucos: desbloquearlo todo, pedidos instantáneos, energía gratis |

Todo tiene **masa**, necesita **energía** para fabricarse y casi todo necesita **materiales** (hierro, níquel,
carbono, silicatos, platino, agua…), que extraes de asteroides o pides a la Tierra mientras estás cerca.
El **Analizador de diseño** explica qué limita tu nave (potencia, calor, estructura, combustible) y por qué.

Los **pedidos** tardan en completarse (la fabricación consume potencia), salvo que actives *Pedidos instantáneos*
en 🧪 Pruebas.

**Cuántos por clic:** arriba en 🛠 Ingeniería (y en 🧱 Constructor → Añadir una pieza) escribe cuántos quieres, o
elige 1, 5, 10, 50 o 100: cada botón Construir, Obtener, Fabricar y Pedir hace entonces esa cantidad de una vez (se
detiene si se acaban los materiales y te dice cuántos puso en cola). El combustible de cada motor tiene además una
casilla de **Cantidad exacta**: escribe los kilogramos y pulsa Intro.

## 📦 Carga: todo lo que hay a bordo

Pulsa **]**, el botón **📦 CARGA** de la barra superior, o 🛠 → ⛏ Inventario → *Abrir el gestor de carga*. Muestra
cada artículo suelto que llevas (propelentes, materiales extraídos, oxígeno, comida, agua, kits, misiles) con su masa y
su parte de la nave. Escribe una cantidad y pulsa **Soltar** (o **Todo**) para sacarlo por la esclusa: conserva
exactamente tu velocidad y se aleja siguiendo tu órbita, así que tu trayectoria no cambia, solo tu masa. Una vista
previa muestra tu Δv tras soltarlo: tirar peso muerto es la forma más barata de ir más rápido. Soltar oxígeno, comida o
agua que necesitas pide confirmación. Debajo, la ventana muestra lo que pesan tus piezas, motores, armas, paneles
solares y tripulación, y **de qué está hecha tu nave**: el hierro, níquel, carbono, silicatos y platino de sus piezas
(según sus recetas) más lo que llevas.

## 📈 Registrador de vuelo

Pulsa **;** (o 🛠 → ⛏ Inventario → *Abrir el registrador de vuelo*): toda tu misión frente al tiempo de juego en nueve
gráficas: distancia al Sol, velocidad, altitud, batería, temperatura de la cabina, tasa de dosis de radiación,
propelente, casco y días de suministros. Cuando el registro se alarga, las partes antiguas se guardan con menos
resolución para que todo quepa. Pasa el ratón por una gráfica para leer el valor en ese momento.

## Evaporación criogénica

Los propelentes muy fríos se evaporan poco a poco cuando el calor entra en los tanques, y el gas se ventila. 🛠 → 🚀
Motores y combustible → **TANQUES DE PROPELENTE** muestra las pérdidas de cada combustible y permite reformar los
tanques. Las tasas son para hidrógeno líquido puro a la distancia de la Tierra; la fuga de calor escala como
0,2 + 0,8·(1 UA/distancia)².

| Tanques | Evaporación | Coste |
|---|---|---|
| Aislamiento multicapa (de serie) | 0,3 %/día | ninguno |
| Parasol + aislamiento | 0,05 %/día | 250 kg |
| Criorefrigeradores | 0 | 200 kg + 150 W por tonelada de hidrógeno líquido a 1 UA (vuelve al 0,3 % sin energía) |

Fracción de cada combustible que se evapora a esa tasa: hidrógeno líquido 100 %, deuterio líquido y D–T 80 %, metano
25 %, hidrolox 15 % (es 1/7 hidrógeno), metalox 8 %. El xenón, kriptón, argón, agua y amoníaco no se evaporan.

## Diario del capitán

Pulsa **'** (o 📜 en 🛠 → ⛏ Inventario). Cada mensaje de la nave se registra con el día de misión, el reloj de la
tripulación (tiempo de a bordo, que se retrasa a velocidades relativistas) y dónde estabas. Búscalo, escribe tus propias
entradas y guarda todo el diario como archivo de texto. Las 600 entradas más recientes se guardan en las partidas.

El mismo panel muestra el **volumen de los tanques** de cada propelente a bordo (hidrógeno líquido 71 kg/m³, hidrolox ~360, metano 423, agua 1.000, xenón ~1.600): el hidrógeno es tan ligero que la misma masa necesita tanques catorce veces más grandes que el agua.
