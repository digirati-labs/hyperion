import { DisplayData } from '../types';
import { Paint } from '../world-objects';

export interface SpacialContent {
  readonly id: string;
  readonly type: 'spacial-content';
  readonly display: DisplayData;

  x: number;
  y: number;
  width: number;
  height: number;
  points: Float32Array;

  getScheduledUpdates(target: Float32Array, scaleFactor: number): Array<() => Promise<void>> | null;
  getPointsAt(target: Float32Array, aggregate?: Float32Array, scale?: number): Paint;
  transform(op: Float32Array): void;
  loadFullResource?(): Promise<void>;
}
