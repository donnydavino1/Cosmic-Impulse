# Calor y radiadores

Cada vatio que usa tu nave acaba como calor, y en el vacío no hay aire que se lo lleve. La única salida es la
**radiación**: un radiador brilla en infrarrojo (Ley 5 de [[Las leyes de Cosmic Impulse|The Laws of Cosmic Impulse]]).

## Cuánto calor disipa un radiador

La ley de Stefan–Boltzmann: cada metro cuadrado de superficie emite ε·σ·T⁴, con σ = 5,67×10⁻⁸ W/m²K⁴ y emisividad
ε = 0,85. La temperatura importa muchísimo:

| Temperatura del radiador | Calor por m² | |
|---|---|---|
| 318 K (45 °C) | ≈ 490 W | el circuito de la tripulación |
| 600 K | ≈ 6,2 kW | |
| 900 K | ≈ 32 kW | radiadores de gotas líquidas |
| 1200 K | ≈ 100 kW | tubos de calor de alta temperatura |

Los radiadores emiten por las dos caras, así que un panel de 60 m² tiene 120 m² de superficie.

## Dos circuitos de refrigeración

- **Circuito bajo (≈300 K):** tripulación, electrónica, baterías, propulsores eléctricos y fabricadores. Sus
  radiadores no pueden estar más calientes de lo que aguanta la tripulación. Si se sobrecalienta, la cabina pasa de
  45 °C y la tripulación sufre ([[Supervivencia|Survival]]).
- **Circuito alto:** reactores y motores calientes, hasta el límite del radiador (900–1200 K). Los radiadores
  calientes son pequeños y ligeros para la potencia que disipan, así que los reactores grandes los necesitan.

## Piezas de radiador

| Pieza | Área | Temperatura máxima | Circuito |
|---|---|---|---|
| Radiador de baja temperatura | 60 m² | 400 K | bajo |
| Radiador de tubos de calor de alta temperatura | 40 m² | 1200 K | alto |
| Radiador de gotas líquidas | 400 m² | 900 K | alto |

Masas y recetas exactas en [[Piezas|Parts]]; la investigación, en [[Tecnologías|Technologies]].

## El calor del Sol

La luz solar también calienta la nave, más cuanto más cerca estás (crece con el cuadrado de la distancia: 1,4 kW/m² en la
Tierra, 9 kW/m² en Mercurio, 136 kW/m² a 0,1 UA) y cuanto mayor es tu nave vista de lado. Por encima de lo que aguanta el
casco, la luz solar **quema el casco**:

| Protección | Aguanta luz solar hasta | Más o menos a esta distancia del Sol |
|---|---|---|
| Casco desnudo | 25 kW/m² | 0,23 UA |
| **Parasol multicapa** (bloquea el 95 % del calor) | 80 kW/m² | 0,13 UA |
| **Escudo térmico de carbono-carbono** (bloquea el 99,5 %, como la sonda Parker) | 1,2 MW/m² | 0,034 UA |

Ambos son piezas en 🛠 → 🏭 Fabricar (requieren *Materiales compuestos de carbono*) y módulos que puedes colocar en el
[[Constructor de naves|Ship Builder]].

## Qué significa para el diseño

- Un reactor sin radiadores del circuito alto vierte su calor residual en el circuito de la tripulación: queda muy
  limitado.
- Los motores con fracción de calor (nuclear térmico, fusión) necesitan capacidad del circuito alto para ir a plena
  potencia: el Analizador de diseño en 🛠 muestra cuándo el calor es tu límite.
- Los láseres y el cañón de riel también convierten energía en calor ([[Combate|Combat]]).
- En el [[Constructor de naves|Ship Builder]], los radiadores son módulos con aletas; colócalos donde quieras: los
  circuitos van por la estructura.

## La vista 🌡 Térmico (F2)

Ábrela con **F2**, el botón **🌡 CALOR** de la barra superior, un clic en la pantalla **SISTEMAS** de la cabina de vuelo 3D, o 🛠 Ingeniería → Nave → 🌡 Térmico. Muestra:

- un **mapa de calor** de tu nave: cada módulo coloreado según la temperatura de su circuito (azul frío, verde cómodo,
  amarillo en el límite de 45 °C de la tripulación, rojo caliente, blanco a 1.200 K), las aletas de los radiadores y la
  tobera del motor brillando mientras empuja;
- el **calor entrante** de cada circuito, lo que sus radiadores **pueden disipar**, dónde se **estabiliza** su temperatura
  y cuánto falta para superar el límite;
- **de dónde viene el calor** ahora (sistemas y tripulación, sol sobre el casco, armas, fabricación, reactores, motor);
- una **calculadora de radiadores**: elige un motor, una potencia y la temperatura máxima de la cabina, y te dice el área
  que necesita cada circuito y **cuántos radiadores de cada tipo** añadir, con un botón **🏭 Construir N**.

**Ejemplo:** el motor de fusión por confinamiento magnético (1 GW) convierte el 15 % de su potencia en calor: **150 MW**
para el circuito alto. Un radiador de baja temperatura disipa unos 60 kW, así que harían falta 2.500; uno de tubos de
calor disipa unos 7 MW a 1.164 K, así que bastan **22** (6,6 t), o 7 radiadores de gotas líquidas (2,8 t). Sin
radiadores del circuito alto el motor queda limitado a un 0,005 % del empuje, y el juego te dice por qué.

El casco de la nave inicial tiene 50 m² de radiadores integrados (ambas caras), suficientes para sus sistemas a pleno
sol a la distancia de la Tierra.
