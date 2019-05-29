import { SpacialContent } from './spacial-content';
import { DisplayData } from '../types';
import { Paint } from '../world-objects';
import { mutate } from '../dna';

export abstract class AbstractContent implements SpacialContent {
  abstract readonly id: string;
  readonly type: 'spacial-content' = 'spacial-content';
  abstract points: Float32Array;
  abstract readonly display: DisplayData;
  isDirty: boolean = false;

  get x(): number {
    return this.points[1];
  }
  get y(): number {
    return this.points[2];
  }
  get width(): number {
    return this.points[3] - this.points[1];
  }
  get height(): number {
    return this.points[4] - this.points[2];
  }

  isMarkedAsDirty(): boolean {
    // The default implementation, free to override.
    return this.isDirty;
  }

  getPointsAt(target: Float32Array, aggregate?: Float32Array, scale?: number): Paint {
    // Is this the right thing to do?
    this.isDirty = false;
    return [this, this.points, aggregate];
  }

  transform(op: Float32Array): void {
    mutate(this.points, op);
    this.isDirty = true;
  }
}
