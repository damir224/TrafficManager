import type { PhaseDef, SignalPlan, PhaseId } from './types';

export class SignalController {
  plan: SignalPlan;
  constructor(phases: PhaseDef[]) {
    this.plan = { phases, currentIndex: 0, timeInPhase: 0 };
  }

  setPhaseDuration(phaseId: PhaseId, seconds: number) {
    const p = this.plan.phases.find((x) => x.id === phaseId);
    if (p) p.durationSec = Math.max(1, seconds);
  }

  get currentPhase(): PhaseDef {
    return this.plan.phases[this.plan.currentIndex];
  }

  isVehGreen(): boolean {
    const id = this.currentPhase.id;
    return id === 'green';
  }

  isPedGreen(): boolean {
    return this.currentPhase.id === 'ped';
  }

  tick(dtSec: number) {
    this.plan.timeInPhase += dtSec;
    const cur = this.currentPhase;
    if (this.plan.timeInPhase >= cur.durationSec) {
      this.plan.timeInPhase = 0;
      this.plan.currentIndex = (this.plan.currentIndex + 1) % this.plan.phases.length;
    }
  }
}
