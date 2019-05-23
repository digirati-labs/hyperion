import { ViewingDirection } from '@hyperion-framework/types';
import { Viewer } from './types';
import {
  compose,
  DnaFactory,
  dnaLength,
  hidePointsOutsideRegion,
  mutate,
  scale,
  scaleAtOrigin,
  translate,
} from './dna';
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
  aggregateBuffer = new Float32Array(9);
  // These should be the same size.
  private objects: AbstractWorldObject[] = [];
  private points: Float32Array;
  private subscriptions: Array<(type: string, changes?: unknown) => void> = [];

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

    const { width, x, y } = target;

    const scaleFactor = width / object.width;

    if (dnaLength(this.points) === this.objects.length) {
      // resize, doubles each time, @todo change.
      const points = this.points;
      const newPoints = new Float32Array(this.points.length * 2);
      newPoints.set(points, 0);
      this.points = newPoints;
    }

    // @todo integrity to ensure these remain.
    this.points.set(DnaFactory.singleBox(object.width, object.height, 0, 0), this.objects.length * 5);
    const worldObject = new WorldObject(object);
    // worldObject.atScale(scaleFactor);
    // worldObject.translate(x, y);
    this.objects.push(worldObject);
    this.scaleWorldObject(this.objects.length - 1, scaleFactor);
    this.translateWorldObject(this.objects.length - 1, x, y);

    this.triggerRepaint();

    return worldObject;
  }

  scaleWorldObject(index: number, factor: number) {
    mutate(
      this.points.subarray(index * 5, index * 5 + 5),
      scaleAtOrigin(factor, this.points[index * 5 + 1], this.points[index * 5 + 2])
    );
    this.objects[index].atScale(factor);
    this.triggerRepaint();
  }

  translateWorldObject(index: number, x: number, y: number) {
    mutate(this.points.subarray(index * 5, index * 5 + 5), translate(x, y));
    this.objects[index].translate(x, y);
    this.triggerRepaint();
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;

    // @todo what happens when projections are out of bounds?
    // @todo what happens when objects are out of bounds?
    this.triggerRepaint();

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

  addLayoutSubscriber(subscription: (type: string, data: unknown) => void) {
    const length = this.subscriptions.length;
    this.subscriptions.push(subscription);

    return () => {
      this.subscriptions.splice(length, 1);
    };
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

  trigger<T>(type: string, data?: T) {
    const len = this.subscriptions.length;
    for (let i = 0; i < len; i++) {
      this.subscriptions[i](type, data);
    }
  }

  triggerRepaint() {
    this.trigger('repaint');
  }
}
