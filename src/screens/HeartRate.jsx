import { useEffect, useState } from "react";
import { buzz } from "../lib/haptics.js";

const MEASURE_MS = 4000;

// Los relojes de verdad leen un sensor optico; aqui la medicion es simulada.
export default function HeartRate({ bpm, onMeasured }) {
  const [measuring, setMeasuring] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!measuring) return;
    const start = Date.now();
    const id = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / MEASURE_MS);
      setProgress(p);
      if (p === 1) {
        clearInterval(id);
        setMeasuring(false);
        onMeasured(60 + Math.round(Math.random() * 40));
        buzz(120);
      }
    }, 100);
    return () => clearInterval(id);
  }, [measuring, onMeasured]);

  return (
    <section className="screen" style={{ "--accent": "var(--c-heart)" }}>
      <h2 className="title">Pulso</h2>
      <div
        className={`heart ${bpm && !measuring ? "beating" : ""} ${measuring ? "scanning" : ""}`}
        style={{ "--bpm": bpm ?? 70 }}
      >
        ❤️
      </div>
      <p className="big">
        {measuring ? `${Math.round(progress * 100)}%` : bpm ?? "--"}
        {!measuring && <span className="unit"> bpm</span>}
      </p>
      <p className="hint">{measuring ? "Midiendo…" : "Sensor simulado"}</p>
      <div className="buttons">
        <button className="btn btn-main" onClick={() => setMeasuring(true)} disabled={measuring}>
          {bpm ? "Medir de nuevo" : "Medir"}
        </button>
      </div>
    </section>
  );
}
