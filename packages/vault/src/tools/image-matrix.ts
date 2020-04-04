// Create an abstract space, e.g. 1000x1000
import { ViewingDirection } from '@hyperion-framework/types';
import mitt, { Emitter } from 'mitt';

export type AbstractObject = { id: string; height: number; width: number; layers: Paintable[] };

export type WorldObject = AbstractObject & { x: number; y: number };

export interface Paintable {
  id: string;
  type: string;
  group?: string;
  points: Int16Array;
  displayPoints: Int16Array;
  displayScale: number;
}

export interface InteractivePaintable {
  translate(x: number, y: number): void;
  show(): void;
  hide(): void;
}

export type PaintTarget = { width: number; height: number; x?: number; y?: number };

// Create a projection, e.g. 0,0 1000,1000
export type Projection = { x1: number; y1: number; x2: number; y2: number };

// Add a viewport that the projection will projected onto.
export type Viewport = { height: number; width: number };

// A tile definition. e.g 1, 100x100
export type TileDefinition = { scale: number; width: number; height: number };

export type ImageServiceTile = {
  width: number;
  height?: number;
  scaleFactors?: number[];
};

export type ImageService = {
  id: string;
  protocol: string;
  height: number;
  width: number;
  tiles?: ImageServiceTile[];
  sizes?: Array<{ width: number; height: number }>;
  profile: Array<
    | string
    | {
        formats?: string[];
        qualities?: string[];
        supports?: string[];
      }
  >;
};

export type ImageServiceSurface = {
  service: ImageService;
  target: { x: number; y: number; width: number; height: number };
};

export const CELL_LENGTH = 5;

// Typed renderables to be returned, inferred using `type`
// Helper methods:
// - get image URL
// - get nicely formatted list of tiles to render (cache!)
// - height/width helpers for tiles
// - scale selection?
// Have most of this encapsulated in a viewer class.
// How to handle user input?
// Streams?

// Cheat sheet for mod 5 (v, x1, y1, x2, y2).
// Column  | mod | check
// visible | 0   | n % 5 == 0
// x1      | 1   | n % 5 === 1
// y1      | 2   | n % 5 === 2
// x2      | 3   | n % 5 === 3
// y2      | 4   | n % 5 === 4
// x1 + x2 | -   | n % 5 % 2 === 1
// y1 + y2 | -   | n % 5 && n % 5 % 2 === 0
export const mapX = (func: (v: number) => number): PointsTransform => points =>
  points.map((v, index) => ((index % 5) % 2 === 1 ? func(v) : v));
export const mapY = (func: (v: number) => number): PointsTransform => points =>
  points.map((v, index) => (index % 5 && (index % 5) % 2 === 0 ? func(v) : v));

export const scale = (factor: number): PointsTransform => (points: Int16Array) => points.map(v => v * factor);
export const translateX = (x: number): PointsTransform => mapX(v => v + x);
export const translateY = (y: number): PointsTransform => mapY(v => v + y);
export const translate = (x: number, y: number): PointsTransform => (points: Int16Array) =>
  translateX(x)(translateY(y)(points));
export const scaleAtOrigin = (factor: number, x: number, y: number): PointsTransform => (points: Int16Array) =>
  translate(x * factor, y * factor)(scale(factor)(points));
export const projectionFilter = (projection: Projection): PointsTransform => (points: Int16Array) =>
  points.map((v, index, arr) =>
    index % 5 === 0
      ? /* x1 */ arr[index + 1] <= projection.x2 && // x1 left - x2 right
        /* x2 */ arr[index + 3] >= projection.x1 && // x2 right - x1 left
        /* y1 */ arr[index + 2] <= projection.y2 && // y1 top - y2 bottom
        /* y2 */ arr[index + 4] >= projection.y1 // y2 bottom - y1 top
        ? 1
        : 0
      : v
  );
export const nullTransform: PointsTransform = points => points;

// For this new image matrix, it will be an array of
export const createMatrix = ({ canvas, tile }: { canvas: { width: number; height: number }; tile: TileDefinition }) => {
  const fullWidth = Math.ceil(canvas.width / tile.scale);
  const fullHeight = Math.ceil(canvas.height / tile.scale);

  // number of points in the x direction.
  const mWidth = Math.ceil(fullWidth / tile.width);
  // width of the last tile.
  // const lastTileWidth = (canvas.width % tile.width) * tile.width;
  // number of points in the y direction
  const mHeight = Math.ceil(fullHeight / tile.height);
  // height of the last tile
  // const lastTileHeight = (canvas.height % tile.height) * tile.height;

  const points = new Int16Array(mWidth * mHeight * CELL_LENGTH);

  // Create matrix
  let rowC = 0;
  for (let y = 0; y < mHeight; y++) {
    for (let x = 0; x < mWidth; x++) {
      const rx = x * tile.width;
      const ry = y * tile.height;
      points.set(
        [
          1, // is visible.
          rx,
          ry,
          x === mWidth - 1 ? fullWidth : rx + tile.width,
          y === mHeight - 1 ? fullHeight : ry + tile.height,
        ],
        rowC * CELL_LENGTH
      );
      rowC++;
    }
  }

  return points;
};

type PointsTransform = (points: Int16Array) => Int16Array;

export class World {
  width: number;
  height: number;
  resources: WorldObject[] = [];
  viewingDirection: ViewingDirection;
  groups: { [name: string]: string[] } = {};

  constructor(
    width: number,
    height: number,
    resources: WorldObject[] = [],
    viewingDirection: ViewingDirection = 'left-to-right'
  ) {
    this.width = width;
    this.height = height;
    this.resources = resources;
    this.viewingDirection = viewingDirection;
  }

  static fromResources(
    resources: AbstractObject[],
    {
      spacing = 0,
      margin = 0,
      viewingDirection = 'left-to-right',
    }: { spacing?: number; margin?: number; viewingDirection?: ViewingDirection } = {
      spacing: 0,
      margin: 0,
      viewingDirection: 'left-to-right',
    }
  ) {
    switch (viewingDirection) {
      case 'left-to-right':
      case 'right-to-left':
        return new World(
          (resources.length - 1) * spacing +
            margin * 2 +
            resources.reduce((acc, resource) => {
              acc += resource.width;
              return acc;
            }, 0),
          margin * 2 + Math.max(...resources.map(resource => resource.height)),
          resources.reduce(
            (acc: { resources: WorldObject[]; currentWidth: number }, resource: AbstractObject) => {
              const x = acc.currentWidth;
              acc.currentWidth += resource.width + spacing;
              acc.resources.push({
                id: resource.id,
                x,
                y: margin,
                height: resource.height,
                width: resource.width,
                layers: resource.layers,
              });
              return acc;
            },
            { resources: [], currentWidth: margin }
          ).resources,
          viewingDirection
        );
      case 'top-to-bottom':
      case 'bottom-to-top':
        return new World(
          margin * 2 + Math.max(...resources.map(resource => resource.width)),
          (resources.length - 1) * spacing +
            margin * 2 +
            resources.reduce((acc, resource) => {
              acc += resource.height;
              return acc;
            }, 0),
          resources.reduce(
            (acc: { resources: WorldObject[]; currentHeight: number }, resource: AbstractObject) => {
              const y = acc.currentHeight;
              acc.currentHeight += resource.height + spacing;
              acc.resources.push({
                id: resource.id,
                x: margin,
                y,
                height: resource.height,
                width: resource.width,
                layers: resource.layers,
              });
              return acc;
            },
            { resources: [], currentHeight: margin }
          ).resources,
          viewingDirection
        );
    }
  }

  setGroup(name: string, selected: string[]) {
    this.groups[name] = selected;
  }

  getRanderablesFromViewport(viewport: Viewport, projection: Projection, transform: PointsTransform = nullTransform) {
    // - Fit projection to viewport (new projection with same aspect ratio)
    // - Add scale + transform
  }

  getRenderablesFromProjection(viewport: Projection, transform: PointsTransform = nullTransform) {
    return this.getRenderables(points => transform(projectionFilter(viewport)(points)));
  }

  getRenderables(transform: PointsTransform = nullTransform) {
    const paints: Paintable[] = [];
    for (let n = 0; n < this.resources.length; n++) {
      for (let m = 0; m < this.resources[n].layers.length; m++) {
        if (
          this.resources[n].layers[m].group &&
          this.groups[this.resources[n].layers[m].group as string] &&
          this.groups[this.resources[n].layers[m].group as string].indexOf(this.resources[n].layers[m].id) === -1
        ) {
          // Skip if not selected in group.
          continue;
        }
        const points = transform(
          translate(this.resources[n].x, this.resources[n].y)(this.resources[n].layers[m].points)
        );
        if (!points.every((el, index) => !!(index % CELL_LENGTH | el))) {
          continue;
        }
        paints.push({
          id: this.resources[n].layers[m].id,
          type: this.resources[n].layers[m].type,
          points,
          displayPoints: this.resources[n].layers[m].displayPoints,
          displayScale: this.resources[n].layers[m].displayScale,
        });
      }
    }
    return paints;
  }
}

export class PaintableImage implements Paintable, InteractivePaintable {
  id: string;
  type = 'image';
  group = '';
  points: Int16Array = new Int16Array(CELL_LENGTH);
  displayPoints: Int16Array = new Int16Array(CELL_LENGTH);
  displayScale = 1;

  constructor(url: string, { x = 0, y = 0, width, height }: PaintTarget) {
    this.id = url;

    this.points.set([1, x, y, x + width, y + height]);
    this.displayPoints.set([1, 0, 0, width, height]);
  }

  translate(x: number, y: number) {
    this.points = translate(x, y)(this.points);
  }

  hide() {
    this.points.set([0], 0);
  }

  show() {
    this.points.set([1], 0);
  }
}

export class PaintableTileSource implements Paintable, InteractivePaintable {
  id: string;
  type = 'tile-source';
  group = '';
  points: Int16Array;
  displayPoints: Int16Array;
  displayScale: number;

  constructor(imageServiceId: string, tile: TileDefinition, { x = 0, y = 0, width, height }: PaintTarget) {
    this.id = `${imageServiceId}--${tile.scale}`;
    this.group = imageServiceId;
    this.displayScale = tile.scale;
    this.displayPoints = scale(tile.scale)(createMatrix({ canvas: { width, height }, tile }));
    this.points = new Int16Array(this.displayPoints);
    this.translate(x, y);
  }

  // @todo maybe this should move out?
  static fromImageService(tileSource: ImageService, target: PaintTarget): Paintable[] {
    const resources: Paintable[] = [];

    // @todo add static images from sizes property.
    // if (tileSource.sizes) {
    //   for (const size of tileSource.sizes) {
    //     resources.push(
    //       new PaintableImage()
    //     );
    //   }
    // }

    return (tileSource.tiles || []).reduce((acc, tile) => {
      return (tile.scaleFactors || []).reduce((innerAcc, scale) => {
        innerAcc.push(
          new PaintableTileSource(
            tileSource.id,
            {
              height: tile.height || tile.width || 256,
              width: tile.width || tile.height || 256,
              scale,
            },
            target
          )
        );
        return innerAcc;
      }, acc);
    }, resources);
  }

  translate(x: number, y: number): void {
    this.points = x && y ? translate(x, y)(this.points) : this.points;
  }

  hide(): void {
    this.points = this.points.map((v, index) => (index % CELL_LENGTH === 0 ? 0 : v));
  }

  show(): void {
    this.points = this.points.map((v, index) => (index % CELL_LENGTH === 0 ? 1 : v));
  }
}

export type Paintables = PaintableTileSource | PaintableImage;

export class MatrixViewer {
  emitter: Emitter;
  views: { [name: string]: Viewport };
  world: World;
  projection: Projection;
  control = false;

  constructor(world: World) {
    this.world = world;
    this.emitter = mitt();
    this.views = {};

    // by default project the whole world.s
    this.projection = { x1: 0, y1: 0, x2: world.width, y2: world.height };
  }

  addView(name: string, viewport: Viewport) {
    this.views[name] = viewport;
    this.emitter.emit('viewport-added', viewport);
  }

  removeView(name: string): Viewport {
    const toRemove = this.views[name];
    delete this.views[name];
    this.emitter.emit('viewport-removed', toRemove);
    return toRemove;
  }

  getView(name: string) {
    const scaleFactor = Math.max(
      this.world.width / this.views[name].width,
      this.world.height / this.views[name].height
    );

    const tX = this.views[name].width - this.world.width / scaleFactor;
    const tY = this.views[name].height - this.world.height / scaleFactor;

    return this.world.getRenderables(v => translate(tX / 2, tY / 2)(scale(1 / scaleFactor)(v)));
  }

  setControl(value: boolean) {
    this.control = value;
    this.emitter.emit('control-change', value);
  }

  translate(x: number, y: number) {
    this.projection.x1 = this.projection.x1 + x;
    this.projection.y1 = this.projection.y1 + y;
    this.projection.x2 = this.projection.x2 + x;
    this.projection.y2 = this.projection.y2 + y;

    this.emitter.emit('translate', this.projection);
  }
}
