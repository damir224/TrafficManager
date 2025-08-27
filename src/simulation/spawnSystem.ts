import type { Vehicle } from './types';

let nextId = 1;
export interface SpawnConfig {
  laneIds: string[];
  ratePerMin: number; // vehicles per minute total
  turnChoices?: ('L'|'S'|'R')[]; // unused in MVP
}

export class SpawnSystem {
  private config: SpawnConfig;
  private accumulator: number = 0; // seconds

  constructor(config: SpawnConfig) {
    this.config = config;
  }

  tick(dtSec: number, spawn: (v: Vehicle)=>void) {
    const ratePerSec = this.config.ratePerMin / 60;
    this.accumulator += dtSec * ratePerSec;
    while (this.accumulator >= 1) {
      this.accumulator -= 1;
      const lane = this.config.laneIds[Math.floor(Math.random() * this.config.laneIds.length)];
      const v: Vehicle = {
        id: `v${nextId++}`,
        lane,
        position: 0,
        speed: 0,
        targetSpeed: 10,
        length: 4.5
      };
      spawn(v);
    }
  }
}
