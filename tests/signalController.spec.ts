import { describe, it, expect } from 'vitest';
import { SignalController } from '../src/simulation/signalController';

describe('SignalController', () => {
  it('cycles phases by duration', () => {
    const sc = new SignalController([
      { id: 'green', durationSec: 1 },
      { id: 'amber', durationSec: 1 },
      { id: 'red', durationSec: 1 },
    ]);

    expect(sc.currentPhase.id).toBe('green');
    sc.tick(1);
    expect(sc.currentPhase.id).toBe('amber');
    sc.tick(1);
    expect(sc.currentPhase.id).toBe('red');
    sc.tick(1);
    expect(sc.currentPhase.id).toBe('green');
  });

  it('updates phase durations', () => {
    const sc = new SignalController([
      { id: 'green', durationSec: 1 },
      { id: 'amber', durationSec: 1 },
    ]);
    sc.setPhaseDuration('green', 3);
    sc.tick(2);
    expect(sc.currentPhase.id).toBe('green');
    sc.tick(1);
    expect(sc.currentPhase.id).toBe('amber');
  });
});
