import { AbstractObject, CanvasWorldObject, Paint, WorldObject } from './world-object';
import { ViewingDirection } from '@hyperion-framework/types';
import { Viewer } from './types';
import { compose, DnaFactory, dnaLength, hidePointsOutsideRegion, scale, translate } from './dna';

type WorldTarget = { x: number; y: number; width?: number; height?: number };

export class World {
  width: number;
  height: number;
  aspectRatio: number;
  viewingDirection: ViewingDirection;
  // These should be the same size.
  private objects: WorldObject[] = [];
  private points: Float32Array;

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

  asWorldObject(): WorldObject | null {
    // @todo.
    return null;
  }

  addObjectAt(object: AbstractObject, target: WorldTarget): WorldObject {
    if (target.width && !target.height) {
      target.height = (target.width / object.width) * object.height;
    } else if (target.height && !target.width) {
      target.width = (target.height / object.height) * object.width;
    }
    if (!target.width || !target.height) {
      throw new Error('Height or width or both must be passed in.');
    }

    const { width, height, x, y } = target;

    const scale = width / object.width;

    if (dnaLength(this.points) === this.objects.length) {
      // resize, doubles each time, @todo change.
      const points = this.points;
      const newPoints = new Float32Array(this.points.length * 2);
      newPoints.set(points, 0);
      this.points = newPoints;
    }
    // @todo integrity to ensure these remain.
    this.points.set(DnaFactory.singleBox(width, height, x, y), this.objects.length * 5);
    const worldObject = new CanvasWorldObject(object);
    worldObject.atScale(scale);
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

  getPointsAt(target: Viewer, aggregate?: Float32Array): Paint[] {
    const filteredPoints = hidePointsOutsideRegion(this.points, {
      x1: target.x,
      y1: target.y,
      x2: target.x + target.width,
      y2: target.y + target.height,
    });

    const scaleTranslate = compose(
      scale(target.scale),
      translate(-target.x, -target.y)
    );

    const transformer = aggregate
      ? target.scale === 1
        ? aggregate
        : compose(
            aggregate,
            scaleTranslate
          )
      : scaleTranslate;

    const len = this.objects.length * 5;
    const layers = [];
    for (let index = 0; index < len; index += 5) {
      if (filteredPoints[index] !== 0) {
        const object = this.objects[index / 5];
        layers.push(...object.getPointsAt(target, transformer));
      }
    }
    return layers;
  }
}
