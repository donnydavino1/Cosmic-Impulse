# Drones y sondas

Pulsa **8** (móvil: ☰ → Nave → Operaciones) para abrir **🛸 Operaciones**: lo que tu nave puede enviar y recuperar.

## ⛏ Drones mineros

Investiga **Autonomous robotics** y fabrica drones en la ventana de Operaciones (40 kg cada uno, hechos de hierro,
níquel, silicatos y carbono). Acércate a menos de 50 km de un asteroide y pulsa **Desplegar drones**:

1. Vuelan hasta allí (20 m/s), excavan 18 kg por hora cada uno y vuelven cuando cada uno lleva 50 kg.
2. El mineral llega en proporción a la composición del asteroide (tipo C: sobre todo roca con 15 % de hielo de agua; tipo S: roca con 18 % de hierro; tipo M: 80 % de hierro y 9 % de níquel).
3. Para volver a salir **se recargan de tu batería**: 1,5 MJ por cada kilo excavado. Con la batería vacía se quedan acoplados.
4. **Llamar de vuelta** los trae a casa con lo que hayan excavado.

Los drones tienen muy poco delta-v. Quédate a menos de 30 km mientras trabajan: si te alejas más de 100 km no pueden
alcanzarte y se pierden.

## 🔧 Drones de reparación

Los drones de reparación (también *Autonomous robotics*) recorren el casco y arreglan la pieza más dañada un 10 % de su
estado por hora cada uno, usando kits de repuestos (un kit restaura una pieza entera). Una pieza averiada vuelve a
funcionar por encima del 60 %. Fabrícalos en 🛸 Operaciones.

## 🛰 Sondas científicas

Investiga **Deep-space probes** (requiere *Onboard laboratory*) y fabrica sondas (90 kg cada una). La tabla de la
ventana de Operaciones muestra, para cada mundo: el **Δv** que necesita la sonda, el **xenón** que tomará de tu tanque
(hasta 40 kg), la **duración del viaje** y la **ciencia** que devolverá.

- El viaje es una **transferencia de Hohmann**, el camino más barato entre dos órbitas (ver [[Vuelo y órbitas|Flying and Orbits]]).
- **Lánzala desde una órbita baja alrededor de un planeta** y llegará mucho más lejos: aprovecha el pozo gravitatorio del
  planeta (el efecto Oberth). Desde el espacio profundo, Saturno y el Sol quedan fuera de alcance; desde la órbita baja
  terrestre, Saturno no.
- Cuando la sonda llega, sus datos vuelven a la **velocidad de la luz**: minutos desde Marte, más de una hora desde Saturno.
- Los primeros datos de un mundo dan más puntos de investigación; las sondas siguientes dan el 30 %.

## Qué leyes

| Lo que ves | Ley (ver [[Las leyes de Cosmic Impulse|The Laws of Cosmic Impulse]]) |
|---|---|
| Drones y sondas se fabrican con materiales, y la nave pesa exactamente eso más | 3, conservación de la materia |
| Los drones se recargan de tu batería | 4, energía |
| Los drones no pueden seguirte lejos; las sondas necesitan xenón | 2, momento (ecuación del cohete) |
| Las sondas llegan más lejos desde órbita baja | 1 + 2, gravedad y momento |
| Los datos de las sondas llegan tarde | 7 + 10, velocidad de la luz e información |

Los contratos pueden pedir ambas cosas: *Envía una sonda científica a …* y *Trae … kg de mineral con drones mineros*
(ver [[Contratos|Contracts]]).
