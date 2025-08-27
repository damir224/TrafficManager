import Phaser from 'phaser';
import { sim } from '../simulation/sim';

export class TrafficScene extends Phaser.Scene {
  lanes = ['N', 'S', 'E', 'W'] as const;
  graphics!: Phaser.GameObjects.Graphics;

  constructor() {
    super('TrafficScene');
  }

  create() {
    this.graphics = this.add.graphics();
  }

  update() {
    const g = this.graphics;
    g.clear();

    // Draw roads
    const cx = this.scale.width / 2;
    const cy = this.scale.height / 2;
    const roadW = 200;
    const laneW = 20;

    g.fillStyle(0x333333, 1);
    g.fillRect(cx - roadW / 2, 0, roadW, this.scale.height); // vertical
    g.fillRect(0, cy - roadW / 2, this.scale.width, roadW); // horizontal

    // stop lines
    g.fillStyle(0xffffff, 1);
    g.fillRect(cx - roadW / 2, cy - 2 - 50, roadW, 4); // north stop line
    g.fillRect(cx - roadW / 2, cy - 2 + 50, roadW, 4); // south stop line
    g.fillRect(cx - 2 - 50, cy - roadW / 2, 4, roadW); // west stop line
    g.fillRect(cx - 2 + 50, cy - roadW / 2, 4, roadW); // east stop line

    // Traffic light state indicator
    const vehGreen = sim.isVehGreen();
    const pedGreen = sim.isPedGreen();
    const color = vehGreen ? 0x00ff00 : pedGreen ? 0x00ffff : 0xff0000;
    g.fillStyle(color, 1);
    g.fillCircle(cx, cy, 10);

    // Draw vehicles per lane as rectangles moving towards center
    const scale = 1.0; // pixels per meter

    const drawLane = (lane: 'N'|'S'|'E'|'W') => {
      const arr = sim.getVehicles(lane);
      arr.forEach((v) => {
        g.fillStyle(0xffff00, 1);
        if (lane === 'N') {
          const x = cx - laneW * 1.5;
          const y = cy - 50 - v.position * scale;
          g.fillRect(x, y - 8, 16, 16);
        } else if (lane === 'S') {
          const x = cx + laneW * 1.5;
          const y = cy + 50 + v.position * scale;
          g.fillRect(x - 16, y - 8, 16, 16);
        } else if (lane === 'W') {
          const x = cx - 50 - v.position * scale;
          const y = cy + laneW * 1.5;
          g.fillRect(x - 8, y - 16, 16, 16);
        } else {
          const x = cx + 50 + v.position * scale;
          const y = cy - laneW * 1.5;
          g.fillRect(x - 8, y, 16, 16);
        }
      });
    };

    this.lanes.forEach((l) => drawLane(l));
  }
}
