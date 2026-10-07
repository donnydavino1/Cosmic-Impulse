# Juego limpio y reglas

Cosmic Impulse es de código abierto y está hecho para personalizarse, a menudo con un asistente de IA. Entonces, ¿cómo
pueden luchar desconocidos de forma justa?

El juego se divide en dos tipos de código:

| | **Reglas** (compartidas) | **Cliente** (tuyo) |
|---|---|---|
| Qué | física, órbitas, motores, piezas, investigación, daño, supervivencia, sensores, el libro de cuentas, el protocolo de red | aspecto, cabina, controles, distribuciones, sonidos, pantallas de radar, menús, estilos de nave |
| ¿Puedes cambiarlo? | solo si nunca quieres luchar contra otros | sí, todo lo que quieras |
| Huella | **huella de física** (ORB_RULES_FP) y **huella de reglas** (RULES) | huella de código (ORB_FP), informativa |

Cuando dos juegos se conectan, comparan huellas:
- **Misma física y reglas:** ⚔ *Juego limpio*, se puede combatir. Si la huella de física está en la lista oficial,
  el juego muestra **✓ oficial**.
- **Física distinta:** podéis volar y chatear juntos, pero los impactos de armas se desactivan.

Así que: rediseña todo lo que ves y tocas, y aún podrás luchar contra cualquiera que use las reglas oficiales. Si
cambias cómo funcionan los motores, el daño o las órbitas, has creado un juego nuevo (¡y está bien!), jugable con
amigos que usen tu versión.

Tus huellas aparecen en la ventana 🌐 Multijugador. Detalles técnicos: `docs/FAIR-PLAY.md`.
