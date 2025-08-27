export type LaneId = string;
export type PhaseId = 'green' | 'amber' | 'red' | 'ped';

export interface PhaseDef {
  id: PhaseId;
  durationSec: number;
}

export interface SignalPlan {
  phases: PhaseDef[];
  currentIndex: number;
  timeInPhase: number; // seconds
}

export interface Vehicle {
  id: string;
  lane: LaneId;
  position: number; // meters from start of lane
  speed: number; // m/s
  targetSpeed: number; // m/s
  length: number; // m
  arrivedAt?: number; // ms timestamp when reached destination
}

export interface Pedestrian {
  id: string;
  crossing: string;
  waitingSince: number; // ms
  crossingTime: number; // seconds to cross
}

export interface LaneQueueMetrics {
  lane: LaneId;
  queueLen: number;
}

export interface Metrics {
  avgDelay: number; // seconds
  throughput: number; // veh/min
  queues: LaneQueueMetrics[];
}
