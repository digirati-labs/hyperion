import { IIIFExternalWebResource } from '@hyperion-framework/types';
import { ImageService } from '../spacial-content';
import { WorldTime } from '../types';
import { compose, getIntersection, mutate, scale, scaleAtOrigin, transform, translate } from '../dna';
import { Paint, Paintable } from './paint';
import { AbstractWorldObject } from './abstract-world-object';
import { AbstractObject } from './abstract-object';

export class WorldObject implements AbstractWorldObject {
  id: string;
  scale: number;
  layers: Paintable[];
  time: WorldTime[];
  points: Float32Array;
  intersectionBuffer = new Float32Array(5);
  aggregateBuffer = new Float32Array(9);
  invertedBuffer = new Float32Array(9);

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

  get isDirty(): boolean {
    const len = this.layers.length;
    for (let i = 0; i < len; i++) {
      if (this.layers[len].isDirty) {
        return true;
      }
    }
    return false;
  }

  constructor(props: AbstractObject) {
    this.id = props.id;
    this.scale = 1;
    this.layers = props.layers;
    this.time = [];
    this.points = new Float32Array([1, 0, 0, props.width, props.height]);
  }

  getAllPointsAt(target: Float32Array, aggregate: Float32Array, scaleFactor: number): Paint[] {
    const transformer = compose(
      translate(this.x, this.y),
      scale(this.scale),
      this.aggregateBuffer
    );

    const len = this.layers.length;
    const arr = [];
    for (let i = 0; i < len; i++) {
      const inter = getIntersection(target, this.points, this.intersectionBuffer);
      arr[i] = this.layers[i].getPointsAt(
        // Crop intersection.
        transform(
          inter,
          compose(
            scale(1 / this.scale),
            translate(-this.x, -this.y),
            this.invertedBuffer
          )
        ),
        aggregate
          ? compose(
              aggregate,
              transformer,
              this.aggregateBuffer
            )
          : transformer,
        scaleFactor * this.scale
      );
    }
    return arr;
  }

  translate(x: number, y: number) {
    mutate(this.points, translate(x, y));
  }

  atScale(factor: number) {
    mutate(this.points, scaleAtOrigin(factor, this.x, this.y));
    this.scale *= factor;
  }

  addLayers(paintables: Paintable[]) {
    this.layers = this.layers.concat(paintables);
  }

  addContentResource(content: IIIFExternalWebResource) {
    this.layers.push(...ImageService.fromContentResource(content));
  }

  transform(op: Float32Array): void {
    mutate(this.points, op);
  }
}
