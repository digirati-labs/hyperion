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
export const translate = (x: number, y: number) => new Float32Array([1, 0, x, 0, 1, y, 0, 0, 1]);
export const scale = (factor: number) => new Float32Array([factor, 0, 0, 0, factor, 0, 0, 0, 1]);
export const scaleAtOrigin = (factor: number, x: number, y: number) =>
  compose(
    translate(-x, -y),
    scale(factor)
  );

export const hidePointsOutsideRegion = (
  points: Float32Array,
  { x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }
) => {
  return points.map((v, index: number, arr) =>
    index % 5 === 0
      ? /* x1 */ arr[index + 1] <= x2 && // x1 left - x2 right
        /* x2 */ arr[index + 3] >= x1 && // x2 right - x1 left
        /* y1 */ arr[index + 2] <= y2 && // y1 top - y2 bottom
        /* y2 */ arr[index + 4] >= y1 // y2 bottom - y1 top
        ? 1
        : 0
      : v
  );
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

  static grid(columns = 1, rows = 1) {
    return new DnaFactory(5 * columns * rows);
  }

  static point(x: number, y: number) {
    return new Float32Array([ 1, x, y, x, y ]);
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
    if (this.index > this.length) {
      throw new Error(`Buffer overflow. ${this.index / 5} of ${this.length / 5}`);
    }

    return this.points;
  }
}

export const filterX = (points: Float32Array): Float32Array => points.filter((v, index) => (index % 5) % 2 === 1);
export const filterY = (points: Float32Array): Float32Array =>
  points.filter((v, index) => index % 5 && (index % 5) % 2 === 0);

export const compose = (transformA: Float32Array, transformB: Float32Array) => {
  if (transformA.length !== transformB.length && transformA.length !== 9) {
    throw new Error('Transforms must be Mat3 as Float32Array');
  }

  return new Float32Array([
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
};

export const invert = (transform: Float32Array): Float32Array => {
  const a00 = transform[0];
  const a01 = transform[1];
  const a02 = transform[2];
  const a10 = transform[3];
  const a11 = transform[4];
  const a12 = transform[5];
  const a20 = transform[6];
  const a21 = transform[7];
  const a22 = transform[8];

  const det01 = a22 * a11 - a12 * a21;
  const det11 = -a22 * a10 + a12 * a20;
  const det21 = a21 * a10 - a11 * a20;

  let det = a00 * det01 + a01 * det11 + a02 * det21;

  if (!det) {
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

export const mutate = (points: Float32Array, transform: Float32Array) => {
  return points.forEach((v, index, arr) => {
    arr[index] =
      index % 5 === 0
        ? transform[6] * arr[index + 1] + transform[7] * arr[index + 2] + transform[8] * v
        : (index % 5) % 2 === 1
        ? /* x */
          transform[0] * v + transform[1] * arr[index + 1] + transform[2]
        : /* y */
          transform[3] * arr[index - 1] + transform[4] * v + transform[5];
  });
};

export const transform = (points: Float32Array, transform: Float32Array) => {
  return points.map((v, index, arr) => {
    return index % 5 === 0
      ? transform[6] * arr[index + 1] + transform[7] * arr[index + 2] + transform[8] * v
      : (index % 5) % 2 === 1
      ? /* x */
        transform[0] * v + transform[1] * arr[index + 1] + transform[2]
      : /* y */
        transform[3] * arr[index - 1] + transform[4] * v + transform[5];
  });
};
