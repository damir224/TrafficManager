import { describe, it, expect } from 'vitest';
import { updateVehicles } from '../src/simulation/movementSystem';
import type { Vehicle } from '../src/simulation/types';

function makeVehicles(n: number): Vehicle[] {
  const arr: Vehicle[] = [];
  for (let i = 0; i < n; i++) {
    arr.push({ id: `v${i}`, lane: 'N', position: i * 6, speed: 0, targetSpeed: 10, length: 4.5 });
  }
  return arr;
}

describe('Queues under red/green', () => {
  it('vehicles queue on red', () => {
    const veh = makeVehicles(5);
    updateVehicles(veh, 1, { stopLine: 10, minGap: 6, accel: 2, decel: 3 }, false);
    const stopped = veh.filter((v) => v.speed < 0.5).length;
    expect(stopped).toBeGreaterThan(0);
  });

  it('vehicles move on green', () => {
    const veh = makeVehicles(5);
    updateVehicles(veh, 1, { stopLine: 10, minGap: 6, accel: 2, decel: 3 }, true);
    const moving = veh.filter((v) => v.speed > 0.5).length;
    expect(moving).toBeGreaterThan(0);
  });
});
