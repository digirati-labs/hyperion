import { SpacialContent } from './spacial-content';
import { DnaFactory, hidePointsOutsideRegion, mutate, scale, transform } from '../dna';
import { DisplayData } from '../types';
import { Paint } from '../world-objects';
import { Memoize } from 'typescript-memoize';

export class TiledImage implements SpacialContent {
  readonly id: string;
  readonly type: 'spacial-content' = 'spacial-content';
  readonly display: DisplayData;

  points: Float32Array;
  width: number;
  height: number;
  isDirty: boolean = false;

  get x(): number {
    return this.points[1];
  }
  get y(): number {
    return this.points[2];
  }

  isMarkedAsDirty(): boolean {
    return this.isDirty;
  }

  constructor(data: { url: string; scaleFactor: number; points: Float32Array; width: number; height: number }) {
    this.id = data.url;
    this.points = transform(data.points, scale(data.scaleFactor));
    this.width = data.width;
    this.height = data.height;
    this.display = {
      width: data.width / data.scaleFactor,
      height: data.height / data.scaleFactor,
      points: data.points,
      scale: data.scaleFactor,
    };
  }

  static fromTile(
    url: string,
    canvas: { width: number; height: number },
    tile: { width: number; height?: number },
    scaleFactor: number
  ): TiledImage {
    // Always set a height.
    tile.height = tile.height ? tile.height : tile.width;
    // Dimensions of full image (scaled).
    const fullWidth = Math.ceil(canvas.width / scaleFactor);
    const fullHeight = Math.ceil(canvas.height / scaleFactor);
    // number of points in the x direction.
    const mWidth = Math.ceil(fullWidth / tile.width);
    // number of points in the y direction
    const mHeight = Math.ceil(fullHeight / tile.height);

    const pointsFactory = DnaFactory.grid(mWidth, mHeight);

    // Create matrix
    for (let y = 0; y < mHeight; y++) {
      for (let x = 0; x < mWidth; x++) {
        const rx = x * tile.width;
        const ry = y * tile.height;

        pointsFactory.addPoints(
          rx,
          ry,
          x === mWidth - 1 ? fullWidth : rx + tile.width,
          y === mHeight - 1 ? fullHeight : ry + tile.height
        );
      }
    }

    return new TiledImage({
      url,
      scaleFactor,
      points: pointsFactory.build(),
      width: canvas.width,
      height: canvas.height,
    });
  }

  @Memoize()
  getImageUrl(index: number): string {
    const im = this.points.slice(index * 5, index * 5 + 5);
    const x2 = im[3] - im[1];
    const y2 = im[4] - im[2];
    return `${this.id}/${im[1]},${im[2]},${x2},${y2}/${x2 / this.display.scale},${y2 /
      this.display.scale}/0/default.jpg`;
  }

  getPointsAt(target: Float32Array, aggregate?: Float32Array, scaleFactor?: number): Paint {
    const points = hidePointsOutsideRegion(this.points, target);
    return [this, points, aggregate];
  }

  transform(op: Float32Array): void {
    mutate(this.points, op);
    this.isDirty = true;
  }
}
