// Anillo de progreso SVG. progress: 0..1
export default function Ring({ progress, color, size = 100, stroke = 4, className = "" }) {
  const r = size / 2 - stroke;
  const circ = 2 * Math.PI * r;
  const p = Math.min(1, Math.max(0, progress));
  return (
    <svg className={`ring ${className}`} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle className="ring-track" cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} />
      <circle
        className="ring-bar"
        cx={size / 2}
        cy={size / 2}
        r={r}
        strokeWidth={stroke}
        stroke={color}
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - p)}
      />
    </svg>
  );
}
