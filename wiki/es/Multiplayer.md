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
