# Smart Watch

App para reloj inteligente hecha con **React + Vite** y empaquetada para Android (Wear OS) con **Capacitor**.
La interfaz está pensada para pantalla redonda pequeña: en un reloj ocupa toda la pantalla y en un teléfono o navegador se muestra como un reloj centrado.

## Funciones

Se navega deslizando a izquierda/derecha (o tocando los puntos de abajo; flechas del teclado en el navegador).

| Pantalla | Qué hace |
|---|---|
| **Reloj** | Hora con anillo de segundos, fecha, pasos del día, último pulso y batería (si el dispositivo la reporta). |
| **Cronómetro** | Iniciar / pausa / vuelta / reiniciar, con centésimas. |
| **Temporizador** | Presets de 1, 5 y 10 min; vibra al terminar. |
| **Pasos** | Cuenta pasos con el acelerómetro y los guarda por día. Meta de 6,000. El botón **+100** sirve para simular en el emulador. |
| **Pulso** | Medición de frecuencia cardíaca **simulada** (el sensor óptico real no está disponible desde una app web). |

## Requisitos

- Node.js 22 o superior
- Android Studio con un SDK de Android (API 35/36) y JDK 21

## Probar en el navegador

```bash
npm install
npm run dev
```

Abre <http://localhost:5173>.

## Probar en Android Studio

```bash
npm install
npm run android:sync   # compila la web y la copia al proyecto Android
npm run android:open   # abre la carpeta android/ en Android Studio
```

En Android Studio: elige un emulador en **Device Manager** (un teléfono sirve; para ver el reloj real crea uno de tipo **Wear OS → Small Round**) y presiona **Run ▶**.

Cada vez que cambies código en `src/`, vuelve a ejecutar `npm run android:sync` y luego **Run**.

## Estructura

```
src/
  App.jsx            navegación por deslizamiento entre pantallas
  hooks.js           reloj, batería y contador de pasos
  screens/           Reloj, Cronómetro, Temporizador, Pasos, Pulso
  components/Ring.jsx anillo de progreso SVG
  lib/               formato de tiempo y vibración
android/             proyecto nativo generado por Capacitor
```
