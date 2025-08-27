import Phaser from 'phaser';
import { TrafficScene } from './TrafficScene';

export function startGame(container: HTMLElement) {
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 960,
    height: 640,
    parent: container,
    backgroundColor: '#1b1b1b',
    scene: [TrafficScene],
    physics: { default: 'arcade' },
  });
  return game;
}
