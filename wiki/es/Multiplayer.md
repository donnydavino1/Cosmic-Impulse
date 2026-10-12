# Multijugador

Dos jugadores comparten un sistema solar, en ordenador o móvil.

1. Ambos pulsan **P** (móvil: ☰ → Multijugador) y escriben un nombre de piloto.
2. **Anfitrión:** *🏠 Crear partida* → lee en voz alta el código de sala de 6 letras.
3. **Invitado:** escribe el código → *🔗 Unirse*.

¿No hay emparejamiento por internet? Usa la **conexión manual** en 3 pasos (código de invitación → código de
respuesta → terminar). También funciona entre dos ventanas en el mismo ordenador.

El anfitrión controla el reloj. Veis la nave y el estilo del otro y (a través de tus sensores) lo que lleva.
Los combates solo se activan si ambos juegos tienen las mismas reglas y física ([[Juego limpio y reglas|Fair Play and Rules]]).

Guía completa con solución de problemas y servidores propios: `docs/MULTIPLAYER.md`.

## El universo compartido

Además de las partidas de dos jugadores, Cosmic Impulse puede ejecutar un **universo compartido persistente**: un sistema
solar para todos en un servidor que cualquiera puede ejecutar (`node server/universe.mjs`). En 🌐 Multijugador →
**UNIVERSO COMPARTIDO**, escribe la dirección del servidor y pulsa **Conectar**. Todos comparten un reloj, ven las naves de
los demás, minan los mismos asteroides (lo que uno extrae desaparece para todos) y pueden chatear. El mundo se guarda.

### Puestos avanzados

Con 4 toneladas de materiales a bordo (2.000 kg de hierro, 1.500 kg de silicatos, 300 kg de níquel, 200 kg de carbono y
0,5 kg de metales del platino) puedes convertirlos en un **puesto avanzado** en tu órbita actual: 🌐 Multijugador →
UNIVERSO COMPARTIDO → 🛰 PUESTOS AVANZADOS → **🏗 Construir un puesto aquí**. Necesita una órbita cerrada que no toque la
superficie, y queda en el universo para todos los pilotos aunque te desconectes: una estación con anillo habitable que
gira, alas solares y luces de atraque que parpadean.

- **🧭 Volar aquí** planea un encuentro real: una transferencia en vuelo libre que alcanza el puesto en un tercio de
  órbita (calculada con la ecuación de Kepler), un encendido para iniciarla, vuelo libre y una aproximación final suave.
  Desde 460 km por detrás en órbita baja cuesta unos 150 kg de propulsante químico.
- **Acoplado** significa a menos de 5 km y a menos de 50 m/s relativos. Entonces puedes **⬇ Dejar** o **⬆ Llevar**
  materiales, suministros y propulsante. El servidor guarda lo que contiene cada puesto, así que nada se duplica, y lo que
  dejas o llevas sale o entra en tu nave exactamente.
- El dueño puede hacer un puesto **🔒 privado** (solo él puede llevarse cosas; cualquiera puede dejarlas) y **♻
  Desmantelarlo** estando acoplado para recuperar sus 4 toneladas y todo lo de dentro. Un servidor permite 5 puestos por
  piloto (MAX_OUTPOSTS).

### Combatir con otros pilotos

Puedes fijar como objetivo (**O**) y disparar a otros pilotos a menos de 2.000 km. El servidor solo transmite un impacto
si ambas naves están de verdad a menos de 2.100 km y limita su energía, y tu juego solo lo acepta de un piloto con las
mismas reglas (huella de física). Los impactos caen en tus módulos igual que los de los asaltantes ([[Combate|Combat]]).

### Ver las naves de los demás

Los demás jugadores ven ahora **tu nave real**: sus módulos en orden, montajes radiales, radiadores, blindaje, armas,
bandas de mejora, motor y alas solares, enviados como una pequeña descripción de la distribución (solo lo que verían sus
ojos). En partidas de dos jugadores funciona igual.
