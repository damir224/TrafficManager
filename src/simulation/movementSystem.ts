import type { Vehicle } from './types';

export interface MovementParams {
  stopLine: number; // meters from start where red light stops
  minGap: number; // meters
  accel: number; // m/s^2
  decel: number; // m/s^2
}

export function updateVehicles(
  vehicles: Vehicle[],
  dtSec: number,
  params: MovementParams,
  canGo: boolean
) {
  // Sort vehicles by position ascending (front-most last)
  vehicles.sort((a, b) => a.position - b.position);

  for (let i = 0; i < vehicles.length; i++) {
    const v = vehicles[i];

    // Determine front gap
    let frontGap = Infinity;
    if (i < vehicles.length - 1) {
      const front = vehicles[i + 1];
      frontGap = front.position - v.position - front.length;
    } else {
      // gap to stop line if red
      if (!canGo) {
        frontGap = Math.min(frontGap, params.stopLine - v.position);
      }
    }

    // Simple rule: if gap < minGap, brake else accelerate up to targetSpeed
    if (frontGap < params.minGap) {
      v.speed = Math.max(0, v.speed - params.decel * dtSec);
    } else if (canGo) {
      v.speed = Math.min(v.targetSpeed, v.speed + params.accel * dtSec);
    } else {
      // Approaching red: brake if near stop line
      if (v.position + v.speed * dtSec >= params.stopLine - 2) {
        v.speed = Math.max(0, v.speed - params.decel * dtSec);
      } else {
        v.speed = Math.min(v.targetSpeed / 2, v.speed + (params.accel / 2) * dtSec);
      }
    }

    // Clamp
    if (!canGo) v.speed = Math.min(v.speed, Math.max(0, params.stopLine - v.position));

    // Integrate position
    v.position += v.speed * dtSec;
  }
}
