import { useEffect, useRef, useState } from "react";
import { formatStopwatch } from "../lib/format.js";

export default function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const startedAt = useRef(0); // performance.now() menos lo ya acumulado

  useEffect(() => {
    if (!running) return;
    startedAt.current = performance.now() - elapsed;
    const id = setInterval(() => setElapsed(performance.now() - startedAt.current), 33);
    return () => clearInterval(id);
    // `elapsed` solo se lee al arrancar; no debe reiniciar el intervalo en cada tick
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const reset = () => {
    setRunning(false);
    setElapsed(0);
    setLaps([]);
  };
  const lap = () => setLaps((l) => [elapsed, ...l]);
  const lastLap = laps.length ? elapsed - laps[0] : elapsed;

  return (
    <section className="screen" style={{ "--accent": "var(--c-stopwatch)" }}>
      <h2 className="title">Cronómetro</h2>
      <p className="big mono">{formatStopwatch(elapsed)}</p>
      <p className="hint mono">
        {laps.length > 0 ? `Vuelta ${laps.length} · ${formatStopwatch(lastLap)}` : " "}
      </p>
      <div className="buttons">
        {running ? (
          <>
            <button className="btn" onClick={lap}>Vuelta</button>
            <button className="btn btn-main" onClick={() => setRunning(false)}>Pausa</button>
          </>
        ) : (
          <>
            <button className="btn" onClick={reset} disabled={elapsed === 0}>Reiniciar</button>
            <button className="btn btn-main" onClick={() => setRunning(true)}>
              {elapsed > 0 ? "Seguir" : "Iniciar"}
            </button>
          </>
        )}
      </div>
    </section>
  );
}
