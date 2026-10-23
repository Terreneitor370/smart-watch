const pad = (n, len = 2) => String(n).padStart(len, "0");

// 83450 ms -> "01:23.45"
export function formatStopwatch(ms) {
  const totalCs = Math.floor(ms / 10);
  const cs = totalCs % 100;
  const totalSec = Math.floor(totalCs / 100);
  const sec = totalSec % 60;
  const min = Math.floor(totalSec / 60);
  return `${pad(min)}:${pad(sec)}.${pad(cs)}`;
}

// 83450 ms -> "01:24" (redondea hacia arriba para que el 00:00 llegue justo al final)
export function formatTimer(ms) {
  const totalSec = Math.ceil(ms / 1000);
  return `${pad(Math.floor(totalSec / 60))}:${pad(totalSec % 60)}`;
}

// "mar 20 oct"
export function formatDate(date) {
  const part = (opts) => date.toLocaleDateString("es-MX", opts).replace(/\./g, "");
  return `${part({ weekday: "short" })} ${date.getDate()} ${part({ month: "short" })}`;
}

export { pad };
