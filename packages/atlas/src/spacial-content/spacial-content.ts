import { DisplayData } from '../types';
import { Paint } from '../world-objects';

export interface SpacialContent {
  readonly id: string;
  readonly type: 'spacial-content';

  x: number;
  y: number;
  width: number;
  height: number;

  isDirty: boolean;
  isMarkedAsDirty(): boolean;

  points: Float32Array;
  readonly display: DisplayData;

  getPointsAt(target: Float32Array, aggregate?: Float32Array, scale?: number): Paint;
  transform(op: Float32Array): void;
  loadFullResource?(): Promise<void>;
}
