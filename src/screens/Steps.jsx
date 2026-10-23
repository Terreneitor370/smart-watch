import Ring from "../components/Ring.jsx";

const GOAL = 6000;

export default function Steps({ steps, addSteps, resetSteps }) {
  return (
    <section className="screen" style={{ "--accent": "var(--c-steps)" }}>
      <Ring progress={steps / GOAL} color="var(--c-steps)" stroke={3} className="ring-full" />
      <h2 className="title">Pasos</h2>
      <p className="big">{steps.toLocaleString("es-MX")}</p>
      <p className="hint">
        {steps >= GOAL ? "¡Meta cumplida! 🎉" : `Meta ${GOAL.toLocaleString("es-MX")}`}
      </p>
      <div className="buttons">
        <button className="btn" onClick={resetSteps} disabled={steps === 0}>Cero</button>
        <button className="btn btn-main" onClick={() => addSteps(100)}>+100</button>
      </div>
    </section>
  );
}
