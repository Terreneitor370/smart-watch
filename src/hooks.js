import { useCallback, useEffect, useState } from "react";
import { Device } from "@capacitor/device";

export function useNow(intervalMs = 250) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

// { level: 0-100, charging: boolean } o null si el dispositivo no lo reporta.
export function useBattery() {
  const [battery, setBattery] = useState(null);
  useEffect(() => {
    let alive = true;
    const read = async () => {
      try {
        const info = await Device.getBatteryInfo();
        if (alive && info.batteryLevel != null) {
          setBattery({
            level: Math.round(info.batteryLevel * 100),
            charging: !!info.isCharging,
          });
        }
      } catch {
        /* sin bateria disponible: se oculta el indicador */
      }
    };
    read();
    const id = setInterval(read, 60_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);
  return battery;
}

const STEPS_KEY = "smartwatch.steps";
const dayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

function loadSteps() {
  try {
    const saved = JSON.parse(localStorage.getItem(STEPS_KEY));
    if (saved && saved.day === dayKey()) return saved;
  } catch {
    /* almacenamiento no disponible */
  }
  return { day: dayKey(), count: 0 };
}

// Cuenta pasos con el acelerometro (devicemotion). `add` permite simularlos.
export function useSteps() {
  const [state, setState] = useState(loadSteps);

  useEffect(() => {
    try {
      localStorage.setItem(STEPS_KEY, JSON.stringify(state));
    } catch {
      /* ignorar */
    }
  }, [state]);

  const add = useCallback((n = 1) => {
    setState((s) => {
      const today = dayKey();
      return { day: today, count: (s.day === today ? s.count : 0) + n };
    });
  }, []);

  const reset = useCallback(() => setState({ day: dayKey(), count: 0 }), []);

  useEffect(() => {
    if (typeof window.DeviceMotionEvent === "undefined") return;
    let last = 0;
    let above = false;
    const onMotion = (e) => {
      const a = e.accelerationIncludingGravity;
      if (!a || a.x == null) return;
      const mag = Math.hypot(a.x, a.y, a.z);
      const now = Date.now();
      if (mag > 13 && !above && now - last > 300) {
        above = true;
        last = now;
        add(1);
      } else if (mag < 11) {
        above = false;
      }
    };
    window.addEventListener("devicemotion", onMotion);
    return () => window.removeEventListener("devicemotion", onMotion);
  }, [add]);

  return { steps: state.count, addSteps: add, resetSteps: reset };
}
