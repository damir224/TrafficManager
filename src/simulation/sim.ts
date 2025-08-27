import { SignalController } from './signalController';
import { SpawnSystem } from './spawnSystem';
import { updateVehicles } from './movementSystem';
import { MetricsTracker } from './metrics';
import type { LaneId, PhaseId, Vehicle } from './types';

const SIM_DT_SEC = 0.1; // 100ms

class Simulation {
  running = true;
  speed = 1;
  private controller: SignalController;
  private spawner: SpawnSystem;
  private vehiclesByLane: Map<LaneId, Vehicle[]> = new Map();
  private metricsTracker = new MetricsTracker();
  private lastTickMs = 0;
  private started = false;

  constructor() {
    // 4-way intersection simple plan: green -> amber -> red (ped) -> red (all)
    this.controller = new SignalController([
      { id: 'green', durationSec: 20 },
      { id: 'amber', durationSec: 3 },
      { id: 'ped', durationSec: 10 },
      { id: 'red', durationSec: 20 }
    ]);

    const lanes: LaneId[] = ['N', 'S', 'E', 'W'];
    lanes.forEach((l) => this.vehiclesByLane.set(l, []));

    this.spawner = new SpawnSystem({ laneIds: lanes, ratePerMin: 40 });
  }

  start() {
    if (this.started) return;
    this.started = true;
    this.lastTickMs = performance.now();
    setInterval(() => this.updateMetrics(), 1000);
    const loop = () => {
      const now = performance.now();
      const realDt = (now - this.lastTickMs) / 1000;
      this.lastTickMs = now;

      if (this.running) {
        let simTime = realDt * this.speed;
        while (simTime > 0) {
          const step = Math.min(SIM_DT_SEC, simTime);
          this.tick(step);
          simTime -= step;
        }
      }

      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  setPhaseDuration(_intersectionId: string, phase: PhaseId, seconds: number) {
    this.controller.setPhaseDuration(phase, seconds);
  }

  setSpeed(mult: number) {
    this.speed = Math.max(0.25, Math.min(4, mult));
  }

  pause() {
    this.running = false;
  }

  resume() {
    this.running = true;
  }

  private spawnVehicle(v: Vehicle) {
    const arr = this.vehiclesByLane.get(v.lane)!;
    // prevent spawn if too close to first vehicle
    if (arr.length > 0 && arr[0].position < 6) return;
    arr.unshift(v);
  }

  private removeDeparted() {
    this.vehiclesByLane.forEach((arr) => {
      for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i].position > 120) {
          arr.splice(i, 1);
          this.metricsTracker.onArrive();
        }
      }
    });
  }

  private tick(dtSec: number) {
    this.controller.tick(dtSec);
    const vehGreen = this.controller.isVehGreen();

    this.spawner.tick(dtSec, (v) => this.spawnVehicle(v));

    this.vehiclesByLane.forEach((arr) =>
      updateVehicles(arr, dtSec, { stopLine: 50, minGap: 6, accel: 2, decel: 3 }, vehGreen)
    );

    this.removeDeparted();
  }

  private updateMetrics() {
    this.metricsTracker.update(this.vehiclesByLane, 1);
  }

  // Exposed read-only metrics
  get metrics() {
    return this.metricsTracker.metrics;
  }

  getVehicles(lane: LaneId): ReadonlyArray<Vehicle> {
    return this.vehiclesByLane.get(lane) ?? [];
  }

  isVehGreen(): boolean {
    return this.controller.isVehGreen();
  }

  isPedGreen(): boolean {
    return this.controller.isPedGreen();
  }
}

export const sim = new Simulation();
