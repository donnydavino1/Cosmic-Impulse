# Construye tu propio Stellar Impulse (con tu IA)

Stellar Impulse está hecho para que sus jugadores lo transformen. No necesitas programar: entrega el repositorio a un asistente de
IA y describe el juego que quieres: *«una cabina como la sala de sónar de un submarino»*, *«controles de un solo pulgar»*,
*«mi nave como una mantarraya que brilla al disparar»*.

## La única regla
Tu IA puede cambiar todo lo que **ves y tocas**. No debe cambiar los **módulos de reglas** si quieres combatir contra otros
jugadores: así tu huella de física sigue idéntica y el juego limpio funciona. Ver [[Juego limpio y reglas|Fair Play and Rules]].

## Cómo
1. Descarga el código (el zip o el repositorio de GitHub).
2. Dale primero a tu IA el archivo **`AGENTS.md`**: explica qué archivos puede cambiar, cuáles son reglas compartidas y cómo comprobarlo.
3. Pide lo que quieras. La IA edita los módulos de `game/` y ejecuta `node tools/build-game.mjs`.
4. Si la compilación dice `physics fingerprint … (official ✓)`, puedes seguir combatiendo contra todos.

## Instrucción de ejemplo para copiar
> Lee AGENTS.md, docs/LAWS.md, docs/ARCHITECTURE.md y docs/MODDING.md de este repositorio. Quiero cambiar cómo se ve y se
> siente mi juego: [descríbelo]. No cambies ningún módulo RULES de game/manifest.json para que mi huella de física siga
> siendo oficial. Compila ambas versiones y dime las huellas.

La documentación técnica (en inglés) está en `docs/` y `AGENTS.md`; tu IA la entiende sin problema aunque le hables en español.
