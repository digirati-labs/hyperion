// Long strand of numbers describing the composition of spacial content

// Cheat sheet for mod 5 (v, x1, y1, x2, y2).
// Column  | mod | check
// visible | 0   | n % 5 == 0
// x1      | 1   | n % 5 === 1
// y1      | 2   | n % 5 === 2
// x2      | 3   | n % 5 === 3
// y2      | 4   | n % 5 === 4
// x1 + x2 | -   | n % 5 % 2 === 1
// y1 + y2 | -   | n % 5 && n % 5 % 2 === 0
import { Projection, PositionPair } from './types';

export const translate = (x: number, y: number) => new Float32Array([1, 0, x, 0, 1, y, 0, 0, 1]);
export const scale = (factor: number) => new Float32Array([factor, 0, 0, 0, factor, 0, 0, 0, 1]);
export const scaleAtOrigin = (factor: number, x: number, y: number) =>
  compose(
    // This is right.
    translate((1 - factor) * x, (1 - factor) * y),
    scale(factor)
  );

export const hidePointsOutsideRegion = (points: Float32Array, target: Float32Array): Float32Array => {
  const len = points.length;
  const ret = new Float32Array(len);
  for (let index = 0; index < len; index++) {
    ret[index] =
      index % 5 === 0
        ? /* x1 */ points[index + 1] < target[3] && // x1 left - x2 right
          /* x2 */ points[index + 3] > target[1] && // x2 right - x1 left
          /* y1 */ points[index + 2] < target[4] && // y1 top - y2 bottom
          /* y2 */ points[index + 4] > target[2] // y2 bottom - y1 top
          ? 1
          : 0
        : points[index];
  }
  return ret;
};

export const getIntersection = (boxA: Float32Array, boxB: Float32Array, buffer?: Float32Array): Float32Array => {
  const intersects =
    /* x1 */ boxA[1] <= boxB[3] && // x1 left - x2 right
    /* x2 */ boxA[3] >= boxB[1] && // x2 right - x1 left
    /* y1 */ boxA[2] <= boxB[4] && // y1 top - y2 bottom
    /* y2 */ boxA[4] >= boxB[2]; // y2 bottom - y1 top

  const mem = buffer ? buffer : new Float32Array(5);
  if (!intersects) {
    mem.set([0, 0, 0, 0, 0]);
    return mem;
  }
  mem.set([
    1,
    Math.max(boxA[1], boxB[1]),
    Math.max(boxA[2], boxB[2]),
    Math.min(boxA[3], boxB[3]),
    Math.min(boxA[4], boxB[4]),
  ]);
  return mem;
};

export const dnaLength = (points: Float32Array) => points.length / 5;

export const filterPoints = (points: Float32Array) =>
  points.filter((v, index: number, arr) => arr[index - (index % 5)]);

export class DnaFactory {
  points: Float32Array;
  index: number = 0;
  length: number;

  constructor(length: number) {
    this.length = length;
    this.points = new Float32Array(this.length);
  }

  static grid(columns: number = 1, rows: number = 1) {
    return new DnaFactory(5 * columns * rows);
  }

  static point(x: number, y: number) {
    return new Float32Array([1, x, y, x, y]);
  }

  static positionPair(positionPair: PositionPair): Float32Array {
    return new Float32Array([1, positionPair.x1, positionPair.y1, positionPair.x2, positionPair.y2]);
  }

  static projection(projection: Projection): Float32Array {
    return DnaFactory.singleBox(projection.width, projection.height, projection.x, projection.y);
  }

  static singleBox(width: number, height: number, x: number = 0, y: number = 0): Float32Array {
    return new Float32Array([1, x, y, width + x, height + y]);
  }

  row(func: (factory: this) => this): this {
    return func(this);
  }

  addPoints(x1: number, y1: number, x2: number, y2: number): this {
    this.points.set([1, x1, y1, x2, y2], this.index);
    this.index += 5;
    return this;
  }

  addBox(x: number, y: number, width: number, height: number): this {
    this.addPoints(x, y, x + width, y + height);
    return this;
  }

  build(): Float32Array {
    if (this.index < this.length) {
      throw new Error(`Incomplete strand. ${this.index / 5} of ${this.length / 5}`);
    }

    return this.points;
  }
}

export const compose = (transformA: Float32Array, transformB: Float32Array, buffer?: Float32Array) => {
  if (transformA.length !== transformB.length || transformA.length !== 9) {
    throw new Error('Transforms must be Mat3 as Float32Array');
  }

  const mem = buffer ? buffer : new Float32Array(9);
  mem.set([
    // Row 1
    transformA[0] * transformB[0] + transformA[1] * transformB[3] + transformA[2] * transformB[6],
    transformA[0] * transformB[1] + transformA[1] * transformB[4] + transformA[2] * transformB[7],
    transformA[0] * transformB[2] + transformA[1] * transformB[5] + transformA[2] * transformB[8],

    // Row 2
    transformA[3] * transformB[0] + transformA[4] * transformB[3] + transformA[5] * transformB[6],
    transformA[3] * transformB[1] + transformA[4] * transformB[4] + transformA[5] * transformB[7],
    transformA[3] * transformB[2] + transformA[4] * transformB[5] + transformA[5] * transformB[8],

    // Row 3
    transformA[6] * transformB[0] + transformA[7] * transformB[3] + transformA[8] * transformB[6],
    transformA[6] * transformB[1] + transformA[7] * transformB[4] + transformA[8] * transformB[7],
    transformA[6] * transformB[2] + transformA[7] * transformB[5] + transformA[8] * transformB[8],
  ]);
  return mem;
};

export const invert = (transformation: Float32Array): Float32Array => {
  const a00 = transformation[0];
  const a01 = transformation[1];
  const a02 = transformation[2];
  const a10 = transformation[3];
  const a11 = transformation[4];
  const a12 = transformation[5];
  const a20 = transformation[6];
  const a21 = transformation[7];
  const a22 = transformation[8];

  const det01 = a22 * a11 - a12 * a21;
  const det11 = -a22 * a10 + a12 * a20;
  const det21 = a21 * a10 - a11 * a20;

  let det = a00 * det01 + a01 * det11 + a02 * det21;

  /* istanbul ignore next */
  if (!det) {
    // Impossible path, unless you bring custom or invalid transforms.
    throw new Error('Could not invert');
  }

  det = 1.0 / det;

  return new Float32Array([
    det01 * det,
    (-a22 * a01 + a02 * a21) * det,
    (a12 * a01 - a02 * a11) * det,
    det11 * det,
    (a22 * a00 - a02 * a20) * det,
    (-a12 * a00 + a02 * a10) * det,
    det21 * det,
    (-a21 * a00 + a01 * a20) * det,
    (a11 * a00 - a01 * a10) * det,
  ]);
};

export const mutate = (points: Float32Array, transformation: Float32Array) => {
  return points.forEach((v, index, arr) => {
    arr[index] =
      index % 5 === 0
        ? transformation[6] * arr[index + 1] + transformation[7] * arr[index + 2] + transformation[8] * v
        : (index % 5) % 2 === 1
        ? /* x */
          transformation[0] * v + transformation[1] * arr[index + 1] + transformation[2]
        : /* y */
          transformation[3] * arr[index - 1] + transformation[4] * v + transformation[5];
  });
};

export const transform = (points: Float32Array, transformation: Float32Array, buffer?: Float32Array): Float32Array => {
  const len = points.length;
  const ret = buffer ? buffer.slice(0, len) : new Float32Array(len);
  for (let index = 0; index < len; index++) {
    ret[index] =
      index % 5 === 0
        ? transformation[6] * points[index + 1] +
          transformation[7] * points[index + 2] +
          transformation[8] * points[index]
        : (index % 5) % 2 === 1
        ? /* x */
          transformation[0] * points[index] + transformation[1] * points[index + 1] + transformation[2]
        : /* y */
          transformation[3] * points[index - 1] + transformation[4] * points[index] + transformation[5];
  }
  return ret;
};
