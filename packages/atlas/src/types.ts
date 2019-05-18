export type Position = { x: number; y: number };
export type PositionPair = { x1: number; y1: number; x2: number; y2: number };
export type SpacialSize = { width: number; height: number };
export type Scaled = { scale: number };
export type Projection = Position & SpacialSize;
export type Viewer = Projection & Scaled;
export type DisplayData = Readonly<SpacialSize & Scaled & { points: Float32Array }>;
export type WorldTime = { start: number; end: number };
