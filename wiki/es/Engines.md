# Motores

*Generado a partir de los propios archivos de reglas del juego, así que las cifras siempre son las que usa el juego.*

Un motor compensa **empuje** (cuánto empuja) con **velocidad de escape** (cuánta velocidad compra cada kilo de propelente).
Empuje = k × potencia ÷ velocidad de escape: con la misma potencia, un escape lento empuja más y uno rápido llega más lejos.
Delta-v = velocidad de escape × ln(masa llena ÷ masa vacía) (la ecuación del cohete; ver [[Las leyes de Stellar Impulse|The Laws of Stellar Impulse]]).

| Motor | Combustible | Velocidad de escape | Impulso específico | Potencia nominal | Empuje a potencia nominal | Requiere |
|---|---|---|---|---|---|---|
| 🔥 **Cohete químico** | Combustible de cohete | 4,410 m/s | 450 s | 1.2×10^8 W | 5.4×10^4 N | motor inicial |
| ⚛ **Propulsor iónico** | Xenón | 2.9×10^4 m/s | 3,000 s | 5×10^4 W | 2.04 N | motor inicial |
| 🌀 **Motor de plasma VASIMR** | Hidrógeno líquido | 5×10^4 m/s | 5,100 s | 2×10^5 W | 4.8 N | Propulsión de plasma (VASIMR) |
| ☢ **Cohete nuclear térmico** | Hidrógeno líquido | 8,800 m/s | 897 s | 3×10^8 W | 6.8×10^4 N | Propulsión nuclear térmica |
| ⛵ **Vela solar** | ninguno (luz solar) | 3×10^8 m/s | 3.1×10^7 s | 0 W | 0 N | Velas solares |
| ☀ **Motor de fusión por confinamiento magnético** | Deuterio | 1.5×10^7 m/s | 1.5×10^6 s | 1×10^9 W | 133 N | Fusión por confinamiento magnético |
| ✴ **Cohete de fotones de antimateria** | Combustible de antimateria | 3×10^8 m/s | 3.1×10^7 s | 1×10^12 W | 3,340 N | Producción de antimateria |
| 🧲 **Propulsor MPD** | Hidrógeno líquido | 4×10^4 m/s | 4,080 s | 1×10^6 W | 25 N | Propulsores magnetoplasmadinámicos |
| 💥 **Motor de pulsos de fusión inercial** | Deuterio | 9×10^6 m/s | 9.2×10^5 s | 5×10^9 W | 1,110 N | Fusión por confinamiento inercial |
| 🌟 **Motor de antimateria de núcleo dirigido** | Combustible de antimateria | 9.9×10^7 m/s | 1×10^7 s | 1×10^11 W | 1,210 N | Motor de antimateria de núcleo dirigido |

### 🔥 Cohete químico
Quema hidrógeno con oxígeno; el combustible guarda la energía y se lleva su propio calor. Mucho empuje pero escape lento (4,4 km/s), así que el combustible se acaba rápido.

### ⚛ Propulsor iónico
Eléctrico: dispara iones de xenón a 29 km/s. Muy eficiente pero suave; el 30 % de su potencia se convierte en calor en la electrónica, así que necesita radiadores.

### 🌀 Motor de plasma VASIMR
Eléctrico: ondas de radio calientan hidrógeno hasta convertirlo en plasma y una tobera magnética le da forma: escape de 50 km/s con hidrógeno que puedes fabricar a partir de agua.

Construcción: 300 kg de hierro, 100 kg de níquel, 1 kg de platino, 50 kg de silicatos; 5×10^10 J de energía.

### ☢ Cohete nuclear térmico
Un reactor de uranio calienta hidrógeno a ~2.500 °C: 8,8 km/s con mucho empuje. El propelente se lleva casi todo el calor.

Construcción: 1500 kg de hierro, 300 kg de níquel, 5 kg de platino; 1×10^11 J de energía.

### ⛵ Vela solar
Un espejo de 10.000 m² empujado por la luz solar. Sin combustible ni energía, empuje diminuto que solo puede apuntar lejos del Sol. Inútil a la sombra.

Construcción: 150 kg de carbono, 50 kg de silicatos; 2×10^9 J de energía.

### ☀ Motor de fusión por confinamiento magnético
Plasma de fusión D–D estable sujeto por imanes y expulsado por una tobera magnética al 5 % de la velocidad de la luz. Fiable pero pesado; el 15 % de su potencia acaba como calor (radiación del plasma).

Construcción: 5000 kg de hierro, 1000 kg de níquel, 30 kg de platino, 500 kg de carbono, 500 kg de silicatos; 1×10^12 J de energía.

### ✴ Cohete de fotones de antimateria
Materia y antimateria se aniquilan en luz, reflejada hacia atrás. Escape = velocidad de la luz, la única forma de llegar a 0,99c. Los rayos gamma absorbidos calientan el espejo.

Construcción: 40000 kg de hierro, 8000 kg de níquel, 150 kg de platino, 3000 kg de carbono, 4000 kg de silicatos; 1×10^15 J de energía.

### 🧲 Propulsor MPD
Magnetoplasmadinámico: una corriente enorme a través de plasma de hidrógeno lo expulsa con su propio campo magnético. Empuje eléctrico de clase megavatio, pero solo ~50 % de eficiencia: electrodos muy calientes.

Construcción: 600 kg de hierro, 300 kg de níquel, 3 kg de platino; 2×10^11 J de energía.

### 💥 Motor de pulsos de fusión inercial
Láseres implosionan pastillas de deuterio cientos de veces por segundo en una cámara de empuje magnética (como el Proyecto Dédalo). Más ligero y potente que la fusión estable, menor velocidad de escape (3 % de c), más duro con el equipo.

Construcción: 4000 kg de hierro, 800 kg de níquel, 60 kg de platino, 800 kg de silicatos; 1.5×10^12 J de energía.

### 🌟 Motor de antimateria de núcleo dirigido
Los antiprotones se aniquilan con protones; los piones cargados que producen salen dirigidos por una tobera magnética a un tercio de la velocidad de la luz. Mucho más empuje por vatio que un cohete de fotones, menor velocidad máxima.

Construcción: 30000 kg de hierro, 12000 kg de níquel, 300 kg de platino, 2000 kg de carbono; 3×10^15 J de energía.
