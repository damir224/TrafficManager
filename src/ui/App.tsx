import { useEffect, useState } from 'react';
import { sim } from '../simulation/sim';
import { useHudStore } from '../state/useHudStore';

export default function App() {
  const running = useHudStore((s) => s.running);
  const speed = useHudStore((s) => s.speed);
  const phases = useHudStore((s) => s.phases);
  const setRunning = useHudStore((s) => s.setRunning);
  const setSpeed = useHudStore((s) => s.setSpeed);
  const setPhase = useHudStore((s) => s.setPhase);
  const [, setTick] = useState(0);

  useEffect(() => {
    sim.start();
    const id = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{position:'fixed',top:12,left:12,background:'#0008',color:'#fff',padding:12,borderRadius:8,minWidth:260}}>
      <div style={{fontWeight:700, marginBottom:8}}>Traffic Manager</div>
      <div>Green: {phases.green}s</div>
      <input type="range" min={5} max={60} value={phases.green} onChange={e=>{ const v=+e.target.value; setPhase('green', v); sim.setPhaseDuration('i1','green',v); }} />
      <div>Amber: {phases.amber}s</div>
      <input type="range" min={2} max={10} value={phases.amber} onChange={e=>{ const v=+e.target.value; setPhase('amber', v); sim.setPhaseDuration('i1','amber',v); }} />
      <div>Red: {phases.red}s</div>
      <input type="range" min={5} max={60} value={phases.red} onChange={e=>{ const v=+e.target.value; setPhase('red', v); sim.setPhaseDuration('i1','red',v); }} />
      <div style={{marginTop:8}}>
        <button onClick={()=>{ const next = !running; setRunning(next); next?sim.resume():sim.pause(); }}>{running?'Pause':'Start'}</button>
        <button onClick={()=>{ const s = Math.max(0.5, speed/2); setSpeed(s); sim.setSpeed(s); }}>Slower</button>
        <button onClick={()=>{ const s = Math.min(4, speed*2); setSpeed(s); sim.setSpeed(s); }}>Faster</button>
      </div>
      <div style={{marginTop:8,fontSize:12}} id="metrics">
        Avg delay: {sim.metrics.avgDelay.toFixed(1)}s · Throughput: {sim.metrics.throughput.toFixed(1)}/min
      </div>
    </div>
  );
}
