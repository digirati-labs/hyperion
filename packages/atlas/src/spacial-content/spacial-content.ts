import { DisplayData, Viewer } from '../types';
import { Paint } from '../world-object';

export interface SpacialContent {
  readonly id: string;
  readonly type: 'spacial-content';

  x: number;
  y: number;
  width: number;
  height: number;

  points: Float32Array;
  readonly display: DisplayData;

  getPointsAt(target: Viewer, aggregate?: Float32Array): Paint;
  transform(op: Float32Array): void;
}
