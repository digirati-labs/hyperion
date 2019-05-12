import { CanvasNormalized, IIIFExternalWebResource } from '@hyperion-framework/types';
import {compose, DnaFactory, invert, mutate, scale, transform, translate} from './dna';
import { Viewer } from './types';
import { ImageService, SpacialContent } from './spacial-content';

type Time = { start: number; end: number };

type Paintable = SpacialContent /*| TemporalContent*/;

export class Paint {
  paintable: Paintable;
  points: Float32Array;
  transform: Float32Array;
  invertedTransform: Float32Array;

  constructor(paintable: Paintable, points: Float32Array, transformer?: Float32Array) {
    this.paintable = paintable;
    this.points = transformer ? transform(points, transformer) : points;
    this.transform = transformer || translate(0, 0);
    this.invertedTransform = invert(this.transform);
  }

  pointToCanvas(x: number, y: number) {
    return transform(DnaFactory.point(x, y), this.invertedTransform);
  }
}

export interface WorldObject extends AbstractObject {
  x: number;
  y: number;
  scale: number;
  time: Time[];
  getPointsAt(target: Viewer, aggregate?: Float32Array): Paint[];
}

export interface AbstractObject {
  id: string;
  height: number;
  width: number;
  layers: Paintable[];
}

export class CanvasWorldObject implements WorldObject {
  id: string;
  scale: number;
  layers: Paintable[];
  time: Time[];
  points: Float32Array;

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

  constructor(props: AbstractObject) {
    this.id = props.id;
    this.scale = 1;
    this.layers = props.layers;
    this.time = [];
    this.points = new Float32Array([1, 0, 0, props.width, props.height]);
  }

  static fromCanvas(canvas: CanvasNormalized, resources: IIIFExternalWebResource[] = []): CanvasWorldObject {
    return new CanvasWorldObject({
      id: canvas.id,
      width: canvas.width,
      height: canvas.height,
      layers: resources
        .map(resource => ImageService.fromContentResource(resource))
        .reduce((arr, next) => arr.concat(next), []),
    });
  }

  getPointsAt(target: Viewer, aggregate?: Float32Array): Paint[] {
    const transformer = compose(
      scale(this.scale),
      translate(this.x, this.y)
    );
    // @todo intersection filter.
    return this.layers.map(layer =>
      layer.getPointsAt(
        target,
        aggregate
          ? compose(
              aggregate,
              transformer
            )
          : transformer
      )
    );
  }

  translate(x: number, y: number) {
    mutate(this.points, translate(x, y));
  }

  atScale(factor: number) {
    mutate(this.points, scale(factor));
  }

  addLayers(paintables: Paintable[]) {
    this.layers = this.layers.concat(paintables);
  }

  addContentResource(content: IIIFExternalWebResource) {
    this.layers = this.layers.concat(ImageService.fromContentResource(content));
  }
}
