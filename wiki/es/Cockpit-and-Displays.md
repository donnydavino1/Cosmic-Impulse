# Cabina y pantallas

Cómo ves el juego es cosa tuya. Nada de esto cambia la física ni lo que detectan tus sensores: todos reciben la misma
información ([[Juego limpio y reglas|Fair Play and Rules]]).

## Cabina física (por defecto)

El botón **🎛 Controles físicos** (arriba a la derecha en la vista de cabina, tecla **V**) convierte la cabina en una
consola de instrumentos real en vez de paneles flotantes:

| Sección | Qué tiene |
|---|---|
| **Precaución / alarma** | 12 luces de aviso (tripulación, casco, O₂, agua, comida, CO₂, cabina, radiación, energía, sistemas, amenaza, tormenta): ámbar = precaución, rojo = alarma. **Precaución general** parpadea hasta que la pulsas. Reloj de misión y altitud en LCD. |
| **Indicadores** | agujas analógicas de velocidad, batería, propelente, oxígeno, temperatura de cabina y dosis de radiación, con zonas rojas |
| **Radar** | una pantalla CRT redonda tras un cristal; **SÓNAR / 3D** cambia lo que muestra |
| **Sistemas** | interruptores con protección y luces: estabilizador, refugio, radar activo/pasivo, modo de empuje, música; la rueda de **aceleración del tiempo** |
| **Armas y nave** | botones retroiluminados para las armas 1–5 y el objetivo, el gran botón **DISPARAR** (mantén para los haces), y botones de cámara, ingeniería, navegación, constructor, operaciones y contratos |

Cada interruptor y botón hace exactamente lo mismo que su tecla, y cada indicador muestra las mismas cifras que los
paneles: la consola cambia cómo *usas* la nave, nunca lo que puedes saber ([[Juego limpio y reglas|Fair Play and Rules]]).

## Estilos de cabina

🎨 Personalizar (**K**) → **ESTILO DE CABINA**:

| Estilo | Aspecto |
|---|---|
| **Física** (por defecto) | instrumentos reales: ver arriba |
| **Realista** | paneles de instrumentos mate con biseles y tornillos, marco de ventana con pilares |
| **Cristal Neo** | paneles translúcidos con bordes brillantes |
| **Militar** | paneles verde oliva oscuro, lecturas ámbar |
| **Retro** | pantallas de fósforo verde con líneas de barrido, estilo de los 70 |
| **Clásico** | paneles planos sencillos |

Los paneles son **widgets**: pulsa **I** para moverlos, cambiar su tamaño, añadirlos o quitarlos, y **J** para cambiar
de distribución. Ver [[Personalización|Customization]].

## Pantallas de radar

| Pantalla | Qué muestra |
|---|---|
| **3d** (por defecto) | contactos a su altura real, anillos de alcance, tallos de altura y estelas; arrástrala para girarla |
| **sónar** | un haz giratorio como el de un viejo submarino: cada contacto solo se actualiza cuando pasa el haz y luego se desvanece |
| **holo** | disco holográfico con tallos de altura |
| **barrido** | el barrido clásico de fósforo, vista cenital |
| **rejilla** | rejilla táctica con etiquetas de distancia |
| **lista** | lista simple: tipo, distancia, velocidad de acercamiento, error |
| **mínimo** | un anillo y puntos de colores |

Mejores sensores hacen girar el sónar más rápido y ver más lejos ([[Sensores y radar|Sensors and Radar]]).

## Realidad virtual (experimental)

Con un visor de RV y un navegador compatible con WebXR, aparece un botón **🥽 Entrar en RV** en la vista de cabina: la
escena 3D se muestra en el visor y sigue tu cabeza, y el teclado sigue pilotando. En el aspecto realista, los planetas
tienen relieve y los océanos de la Tierra brillan al sol.

## Crea los tuyos

Estilos de cabina y radares son código: `ORB.cockpit.register(nombre, {frame, label})` más CSS, y
`ORB.radar.register(nombre, dibujo)`. Ver `docs/MODDING.md` y [[Construye tu propio Cosmic Impulse|Build Your Own Cosmic Impulse]].
