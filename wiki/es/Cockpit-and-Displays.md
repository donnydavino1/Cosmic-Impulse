# Cabina y pantallas

Cómo ves el juego es cosa tuya. Nada de esto cambia la física ni lo que detectan tus sensores: todos reciben la misma
información ([[Juego limpio y reglas|Fair Play and Rules]]).

## Cabina de vuelo 3D (por defecto)

En la vista en primera persona te sientas ante una **cabina de vuelo** modelada bajo la ventana: una consola principal
inclinada con **tres grandes pantallas luminosas**, dos paneles táctiles, una fila de teclas iluminadas, consolas
laterales con baterías de botones, y una palanca de mando y un acelerador que asoman abajo. Las pantallas están en vivo
(se redibujan cuatro veces por segundo con los datos de tu nave) y **cada pantalla es un botón**: pasa el ratón por
encima (el puntero se convierte en una mano) y haz clic:

| Pantalla | Muestra | Al hacer clic abre |
|---|---|---|
| **VUELO** (izquierda) | velocidad, altitud, órbita, motor, empuje, velocidad del tiempo, fecha, etapa del piloto automático | 🧭 Navegación |
| **SENSORES** (centro) | tu pantalla de radar | cambia al siguiente diseño de radar |
| **SISTEMAS** (derecha) | batería, potencia generada/consumida, temperaturas del circuito de tripulación y del circuito alto, casco, propelente | 🌡 Térmico (mapa de calor y calculadora de radiadores) |
| **TRIPULACIÓN** (abajo a la izquierda) | salud, astronautas y sus tareas, días de suministros, kits | 👩‍🚀 Tripulación |
| **TÁCTICO** (abajo a la derecha) | alarma general (rojo parpadeante) o *todos los sistemas normales*, arma, objetivo, distancia | siguiente objetivo |

Arrastrar sigue girando la vista; solo un clic sin arrastrar pulsa una pantalla. Las pantallas de la cabina sustituyen
a los paneles flotantes; **🧩 Mostrar paneles** (arriba a la derecha) los vuelve a mostrar. Los botones 🌡 CALOR y
👩‍🚀 TRIPULACIÓN de la barra superior abren las mismas ventanas desde cualquier vista. Elige otro aspecto en
🎨 Personalizar → ESTILO DE CABINA, o pulsa **🎛 Controles físicos** para la consola de interruptores y relojes.

**Construida como hardware real.** Los paneles son de metal pintado y desgastado con juntas, tornillos y códigos
estarcidos; las pantallas van en carcasas biseladas con teclas en el marco bajo un cristal reflectante; las consolas
laterales llevan interruptores con guarda, mandos moleteados y teclas retroiluminadas; una palanca lateral negra sale de
un fuelle de goma. La luz es física: el Sol real solo entra por la ventana, el marco proyecta sombras que se mueven por
la consola al girar, las pantallas derraman luz cian sobre los paneles, el metal refleja la cabina, el parabrisas refleja
levemente las pantallas encendidas y muestra polvo y finos arañazos cuando le da el sol, y motas de polvo flotan en los
rayos de sol.

## Cabina física

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
| **Cabina de vuelo 3D** (por defecto) | consola modelada con pantallas en vivo y clicables: ver arriba |
| **Física** | instrumentos reales: ver arriba |
| **Realista** | paneles de instrumentos mate con biseles y tornillos, marco de ventana con pilares |
| **Cristal Neo** | paneles translúcidos con bordes brillantes |
| **Militar** | paneles verde oliva oscuro, lecturas ámbar |
| **Retro** | pantallas de fósforo verde con líneas de barrido, estilo de los 70 |
| **Clásico** | paneles planos sencillos |

Los paneles son **widgets**: pulsa **I** para moverlos, cambiar su tamaño, añadirlos o quitarlos, y **J** para cambiar
de distribución. Ver [[Personalización|Customization]].

### El marco de cabina 3D

En vista de primera persona, el marco de la ventana, el parasol del panel, las paredes laterales, el panel de
interruptores del techo, las asas y el cristal del visor son **geometría 3D real**, iluminada por el Sol de verdad (su
dirección y brillo reales, y oscuridad al entrar en la sombra de un planeta), por el azul reflejo de la Tierra cuando la
orbitas y por las luces cálidas de los instrumentos, que se vuelven rojas con una alarma crítica. Tu cabeza se echa
atrás con el empuje que sientes y el marco tiembla con el motor y los impactos. Actívalo o desactívalo en
🎨 Personalizar → ESTILO DE CABINA (*Marco de cabina 3D*). El estilo *clásico* mantiene el marco plano.

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

## Los planetas en el aspecto realista

En el aspecto realista (🎨 Personalizar), los planetas tienen relieve que se ve con la luz rasante cerca del terminador,
los océanos de la Tierra brillan donde se refleja el Sol y su lado nocturno muestra las luces de las ciudades.

**Sin parpadeos a alta velocidad de tiempo:** entrar y salir de la sombra de un planeta se desvanece suavemente, y
cuando el ciclo día/noche dura menos de unos segundos reales la imagen muestra la luz media de la órbita (sombras más
suaves, luces de ciudades más tenues) en vez de parpadear. La energía y el calor siguen la sombra real e instantánea.

## Crea los tuyos

Estilos de cabina y radares son código: `ORB.cockpit.register(nombre, {frame, label})` más CSS, y
`ORB.radar.register(nombre, dibujo)`. Ver `docs/MODDING.md` y [[Construye tu propio Cosmic Impulse|Build Your Own Cosmic Impulse]].
