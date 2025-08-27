import type { Metrics, Vehicle, LaneId } from './types';

export class MetricsTracker {
  metrics: Metrics = { avgDelay: 0, throughput: 0, queues: [] };
  private arrived: number = 0;
  private sumDelaySec: number = 0;
  private samples: number = 0;

  update(vehiclesByLane: Map<LaneId, Vehicle[]>, dtSec: number) {
    let queues: { lane: LaneId; queueLen: number }[] = [];
    vehiclesByLane.forEach((arr, lane) => {
      const stopped = arr.filter((v) => v.speed < 0.5).length;
      queues.push({ lane, queueLen: stopped });
    });
    this.metrics.queues = queues;

    // simplistic moving averages
    this.samples += 1;
    const queueDelay = queues.reduce((a, b) => a + b.queueLen, 0) * dtSec;
    this.sumDelaySec += queueDelay;
    const windowSec = Math.min(60, this.samples * dtSec);
    this.metrics.avgDelay = this.sumDelaySec / Math.max(1, this.samples);
    this.metrics.throughput = (this.arrived / Math.max(1, windowSec)) * 60;
  }

  onArrive() {
    this.arrived += 1;
  }
}
