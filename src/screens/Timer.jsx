import { useEffect, useRef, useState } from "react";
import Ring from "../components/Ring.jsx";
import { formatTimer } from "../lib/format.js";
import { buzzPattern } from "../lib/haptics.js";

const PRESETS = [1, 5, 10]; // minutos

export default function Timer() {
  const [totalMs, setTotalMs] = useState(PRESETS[0] * 60_000);
  const [remaining, setRemaining] = useState(PRESETS[0] * 60_000);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const endAt = useRef(0);

  useEffect(() => {
    if (!running) return;
    endAt.current = Date.now() + remaining;
    const id = setInterval(() => {
      const left = Math.max(0, endAt.current - Date.now());
      setRemaining(left);
      if (left === 0) {
        setRunning(false);
        setDone(true);
        buzzPattern();
      }
    }, 100);
    return () => clearInterval(id);
    // `remaining` solo se lee al arrancar; no debe reiniciar el intervalo en cada tick
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const choose = (min) => {
    setRunning(false);
    setDone(false);
    setTotalMs(min * 60_000);
    setRemaining(min * 60_000);
  };
  const reset = () => choose(totalMs / 60_000);

  return (
    <section className="screen" style={{ "--accent": "var(--c-timer)" }}>
      <Ring progress={remaining / totalMs} color="var(--c-timer)" stroke={2.5} className="ring-full" />
      <h2 className="title">Temporizador</h2>
      <p className={`big mono ${done ? "blink" : ""}`}>{done ? "¡Listo!" : formatTimer(remaining)}</p>
      <div className="chips">
        {PRESETS.map((min) => (
          <button
            key={min}
            className={`chip ${totalMs === min * 60_000 ? "chip-on" : ""}`}
            onClick={() => choose(min)}
          >
            {min}m
          </button>
        ))}
      </div>
      <div className="buttons">
        <button className="btn" onClick={reset}>Reiniciar</button>
        <button
          className="btn btn-main"
          onClick={() => (done ? reset() : setRunning((r) => !r))}
          disabled={remaining === 0 && !done}
        >
          {done ? "Aceptar" : running ? "Pausa" : "Iniciar"}
        </button>
      </div>
    </section>
  );
}
