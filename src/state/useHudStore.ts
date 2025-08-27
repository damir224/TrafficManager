import { create } from 'zustand';

type PhaseKey = 'green'|'amber'|'red';

interface HudState {
  running: boolean;
  speed: number;
  phases: Record<PhaseKey, number>;
  setRunning(v: boolean): void;
  setSpeed(s: number): void;
  setPhase(k: PhaseKey, v: number): void;
}

const STORAGE_KEY = 'traffic-manager:hud';

function loadInitial(): Pick<HudState, 'running'|'speed'|'phases'> {
  if (typeof window === 'undefined') return { running: true, speed: 1, phases: { green: 20, amber: 3, red: 20 } };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { running: true, speed: 1, phases: { green: 20, amber: 3, red: 20 } };
    const parsed = JSON.parse(raw);
    return {
      running: typeof parsed.running === 'boolean' ? parsed.running : true,
      speed: typeof parsed.speed === 'number' ? parsed.speed : 1,
      phases: {
        green: Number(parsed?.phases?.green ?? 20),
        amber: Number(parsed?.phases?.amber ?? 3),
        red: Number(parsed?.phases?.red ?? 20),
      },
    };
  } catch {
    return { running: true, speed: 1, phases: { green: 20, amber: 3, red: 20 } };
  }
}

export const useHudStore = create<HudState>((set, get) => ({
  ...loadInitial(),
  setRunning: (v) => { set({ running: v }); persist(); },
  setSpeed: (s) => { set({ speed: s }); persist(); },
  setPhase: (k, v) => { set((st) => ({ phases: { ...st.phases, [k]: v } })); persist(); }
}));

function persist() {
  if (typeof window === 'undefined') return;
  const { running, speed, phases } = useHudStore.getState();
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ running, speed, phases })); } catch {}
}
