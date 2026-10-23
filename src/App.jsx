import { useEffect, useRef, useState } from "react";
import { useSteps } from "./hooks.js";
import WatchFace from "./screens/WatchFace.jsx";
import Stopwatch from "./screens/Stopwatch.jsx";
import Timer from "./screens/Timer.jsx";
import Steps from "./screens/Steps.jsx";
import HeartRate from "./screens/HeartRate.jsx";

const SCREEN_NAMES = ["Reloj", "Cronómetro", "Temporizador", "Pasos", "Pulso"];
const SWIPE_START_PX = 10;

export default function App() {
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [bpm, setBpm] = useState(null);
  const { steps, addSteps, resetSteps } = useSteps();

  const gesture = useRef(null);
  const swallowClick = useRef(false);
  const last = SCREEN_NAMES.length - 1;
  const go = (i) => setIndex(Math.min(last, Math.max(0, i)));

  // Flechas del teclado para probar en el navegador.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") setIndex((i) => Math.min(last, i + 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [last]);

  const onPointerDown = (e) => {
    gesture.current = { x: e.clientX, moved: false };
  };

  const onPointerMove = (e) => {
    const g = gesture.current;
    if (!g) return;
    const dx = e.clientX - g.x;
    if (!g.moved && Math.abs(dx) > SWIPE_START_PX) {
      g.moved = true;
      setDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    if (g.moved) {
      const atEdge = (index === 0 && dx > 0) || (index === last && dx < 0);
      setDrag(atEdge ? dx * 0.25 : dx);
    }
  };

  const endGesture = (e) => {
    const g = gesture.current;
    gesture.current = null;
    if (!g?.moved) return;
    const dx = e.clientX - g.x;
    const threshold = e.currentTarget.clientWidth * 0.2;
    if (dx < -threshold) go(index + 1);
    else if (dx > threshold) go(index - 1);
    setDrag(0);
    setDragging(false);
    // Evita que soltar el dedo sobre un boton lo "presione".
    swallowClick.current = true;
    setTimeout(() => (swallowClick.current = false), 0);
  };

  const onClickCapture = (e) => {
    if (swallowClick.current) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  const pages = [
    <WatchFace steps={steps} bpm={bpm} />,
    <Stopwatch />,
    <Timer />,
    <Steps steps={steps} addSteps={addSteps} resetSteps={resetSteps} />,
    <HeartRate bpm={bpm} onMeasured={setBpm} />,
  ];

  return (
    <main className="watch">
      <div
        className="viewport"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endGesture}
        onPointerCancel={endGesture}
        onClickCapture={onClickCapture}
      >
        <div
          className="track"
          style={{
            transform: `translateX(calc(${-index * 100}% + ${drag}px))`,
            transition: dragging ? "none" : undefined,
          }}
        >
          {pages.map((page, i) => (
            <div className="page" key={SCREEN_NAMES[i]} inert={i !== index}>
              {page}
            </div>
          ))}
        </div>
      </div>

      <nav className="dots" aria-label="Pantallas">
        {SCREEN_NAMES.map((name, i) => (
          <button
            key={name}
            className={`dot ${i === index ? "dot-on" : ""}`}
            aria-label={name}
            aria-current={i === index}
            onClick={() => go(i)}
          />
        ))}
      </nav>
    </main>
  );
}
