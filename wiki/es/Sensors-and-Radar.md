# Sensores y radar

Tus **sensores** deciden hasta dónde y qué tan bien ves; tu **pantalla de radar** decide cómo se ve.

| Nivel | Sensor | Alcance | Descubre |
|---|---|---|---|
| 1 | Radar de pulsos | 500 km | posición (±2 %) |
| 2 | Radar Doppler | 2.000 km | + velocidad y dirección |
| 3 | Antena en fase | 20.000 km | + masa y tamaño |
| 4 | Lidar + espectrómetro | 200.000 km | + de qué está hecho, casco, munición |
| 5 | Red interferométrica | 2.000.000 km | + equipamiento completo y estado del motor |

Tu nivel sube con la investigación (un nivel cada 7 tecnologías), y la antena de tu nave cambia de forma con él.
En multijugador, mejores sensores revelan más sobre tu rival.

**Piezas de sensores:** tu nivel también sube si fabricas una pieza de sensores (🛠 → 🏭 Fabricar → 📡 Sensores): una
*antena de radar Doppler* (al menos nivel 2), un *panel de antena en fase* (nivel 3) o una *torreta de lidar y
espectrómetro* (nivel 4). Mejorarla a Mk III y Mk V añade un nivel cada vez ([[Mejoras|Upgrades]]). Ver también
[[Cabina y pantallas|Cockpit and Displays]] para el sónar y el radar 3D.

**Activo o pasivo (tecla 6):** el radar *activo* (por defecto) emite pulsos: alcance y precisión completos, pero
consume 2 kW y cualquiera que escuche te oye. La detección *pasiva* solo escucha: un tercio del alcance y cuatro veces
el error, pero lo que emite (saqueadores, jugadores con radar activo) se oye a 1,5× tu alcance activo. Una **nave
silenciosa** (pasiva, motor apagado) solo la ven otros a la mitad de su alcance normal, y a los saqueadores les cuesta
mucho más fijarla ([[Combate|Combat]]).

**Diseños de radar:** 🎨 Personalizar → PANTALLA DE RADAR: *3d, sónar, barrido, holo, rejilla, lista, mínimo*. Añade el widget
📡 Sensores a tu cabina desde el editor del panel (**I**). En el móvil aparece un mini radar en la cabina.
Tú (o tu IA) podéis diseñar nuevas pantallas de radar: ver [[Construye tu propio Cosmic Impulse|Build Your Own Cosmic Impulse]].

**Tiempo de luz:** lo que detectan tus sensores salió del objeto hace d/c, así que cada contacto aparece donde *estaba*:
hace 1,3 s a la distancia de la Luna, hace más de 8 minutos a la del Sol. Los contactos llevan este retardo como `lt`
([[Relatividad|Relativity]]).

**Sensores diseñados:** un sensor que diseñes (🧪, [[Constructor de naves|Ship Builder]]) puede ver más o menos lejos que
el estándar de su nivel: por la ecuación del radar, el alcance crece como (potencia × apertura²)^¼.

## Comunicaciones con la Tierra

🧭 NAVEGAR → **COMUNICACIONES** muestra el retardo de la luz hasta la Tierra (de ida, y para una pregunta y su
respuesta) y lo rápido que tres tipos de enlace podrían enviar datos desde donde estás. Un enlace de radio recibe
Pr = Pt·Gt·Gr·(λ/4πd)², con ganancia de antena G = η·(πD/λ)², y transporta R = Pr/(k·Tsys·Eb/N0); un enlace láser
cuenta fotones (unos 2 por bit). En tierra se usa una antena de 34 m para radio y un telescopio de 5 m para el láser.

| Enlace | A 1 UA | A 160 UA |
|---|---|---|
| Radio en banda X, antena de 3 m, 100 W | ~10 Mbit/s | ~390 bit/s |
| Radio en banda Ka, antena de 3 m, 100 W | ~44 Mbit/s | ~1,7 kbit/s |
| Láser, telescopio de 22 cm, 4 W | ~13 Mbit/s | ~510 bit/s |

Las velocidades caen con 1/distancia², y cada enlace tiene un techo de hardware cerca de la Tierra.

Conjunción solar: cuando el Sol queda a menos de 2° de la Tierra vista desde la nave, su ruido de radio ahoga todos los
enlaces (las misiones a Marte pierden el contacto unas dos semanas cada 26 meses). El panel de comunicaciones avisa
cuando el ángulo se cierra.

## Firma térmica

🛠 → 🔧 Nave → **FIRMA TÉRMICA**. Cada vatio que usa tu nave acaba radiado como infrarrojo contra un cielo a 3 K, así que
un sensor te ve cuando P / (4πr²) supera su nivel de ruido: alcance de detección r = √(P / 4πF). Con un telescopio
infrarrojo de 1 m (F ≈ 10⁻¹⁵ W/m²) los ~7 kW de la nave inicial se ven desde unos 750.000 km; un gran telescopio
espacial (10⁻¹⁸ W/m²) la ve desde 0,16 UA. Un motor encendido brilla mucho más. En el espacio no hay sigilo.
