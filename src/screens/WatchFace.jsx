import Ring from "../components/Ring.jsx";
import { useBattery, useNow } from "../hooks.js";
import { formatDate, pad } from "../lib/format.js";

export default function WatchFace({ steps, bpm }) {
  const now = useNow(250);
  const battery = useBattery();
  const seconds = now.getSeconds() + now.getMilliseconds() / 1000;

  return (
    <section className="screen face">
      <Ring progress={seconds / 60} color="var(--c-clock)" stroke={2.5} className="ring-full ring-live" />
      <p className="date">{formatDate(now)}</p>
      <p className="time">
        {pad(now.getHours())}:{pad(now.getMinutes())}
        <span className="secs">{pad(now.getSeconds())}</span>
      </p>
      <ul className="stats">
        <li>👣 {steps.toLocaleString("es-MX")}</li>
        <li>❤️ {bpm ?? "--"}</li>
        {battery && (
          <li>
            {battery.charging ? "⚡" : "🔋"} {battery.level}%
          </li>
        )}
      </ul>
    </section>
  );
}
