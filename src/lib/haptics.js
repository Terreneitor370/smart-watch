import { Haptics } from "@capacitor/haptics";

// Vibra el reloj; en navegador usa la Vibration API si existe.
export async function buzz(ms = 200) {
  try {
    await Haptics.vibrate({ duration: ms });
  } catch {
    navigator.vibrate?.(ms);
  }
}

export async function buzzPattern(times = 3, ms = 250, gap = 200) {
  for (let i = 0; i < times; i++) {
    await buzz(ms);
    await new Promise((r) => setTimeout(r, ms + gap));
  }
}
