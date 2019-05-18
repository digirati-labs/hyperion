import { ViewingDirection } from '@hyperion-framework/types';
import { Viewer } from './types';
import { compose, DnaFactory, dnaLength, hidePointsOutsideRegion, scale, translate } from './dna';
import { AbstractWorldObject } from './world-objects/abstract-world-object';
import { WorldObject } from './world-objects/world-object';
import { AbstractObject } from './world-objects/abstract-object';
import { Paint } from './world-objects/paint';

type WorldTarget = { x: number; y: number; width?: number; height?: number };

export class World {
  width: number;
  height: number;
  aspectRatio: number;
  viewingDirection: ViewingDirection;
  // These should be the same size.
  private objects: AbstractWorldObject[] = [];
  private points: Float32Array;
  aggregateBuffer = new Float32Array(9);

  constructor(
    width: number,
    height: number,
    worldObjectCount: number = 100,
    viewingDirection: ViewingDirection = 'left-to-right'
  ) {
    this.width = width;
    this.height = height;
    this.aspectRatio = width / height;
    this.viewingDirection = viewingDirection;
    this.points = new Float32Array(worldObjectCount * 5);
  }

  asWorldObject(): AbstractWorldObject | null {
    // @todo.
    return null;
  }

  addObjectAt(object: AbstractObject, target: WorldTarget): AbstractWorldObject {
    if (target.width && !target.height) {
      target.height = (target.width / object.width) * object.height;
    } else if (target.height && !target.width) {
      target.width = (target.height / object.height) * object.width;
    }
    if (!target.width || !target.height) {
      target.width = object.width;
      target.height = object.height;
    }

    const { width, height, x, y } = target;

    const scaleFactor = width / object.width;

    if (dnaLength(this.points) === this.objects.length) {
      // resize, doubles each time, @todo change.
      const points = this.points;
      const newPoints = new Float32Array(this.points.length * 2);
      newPoints.set(points, 0);
      this.points = newPoints;
    }

    // @todo integrity to ensure these remain.
    this.points.set(DnaFactory.singleBox(width, height, x, y), this.objects.length * 5);
    const worldObject = new WorldObject(object);
    worldObject.atScale(scaleFactor);
    worldObject.translate(x, y);
    this.objects.push(worldObject);

    return worldObject;
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;

    // @todo what happens when projections are out of bounds?
    // @todo what happens when objects are out of bounds?
    return this;
  }

  getObjects() {
    return this.objects;
  }

  getPoints() {
    return this.points;
  }

  getPointsFromViewer(target: Viewer, aggregate?: Float32Array) {
    const targetPoints = DnaFactory.singleBox(target.width, target.height, target.x, target.y);
    return this.getPointsAt(targetPoints, aggregate, target.scale);
  }

  getPointsAt(target: Float32Array, aggregate?: Float32Array, scaleFactor: number = 1): Paint[] {
    const filteredPoints = hidePointsOutsideRegion(this.points, target);
    const translation = compose(
      scale(scaleFactor),
      translate(-target[1], -target[2])
    );

    const transformer = aggregate
      ? compose(
          aggregate,
          translation,
          this.aggregateBuffer
        )
      : translation;

    const len = this.objects.length;
    const layers = [];
    for (let index = 0; index < len; index++) {
      if (filteredPoints[index * 5] !== 0) {
        layers.push(...this.objects[index].getAllPointsAt(target, transformer, scaleFactor));
      }
    }
    return layers;
  }
}
