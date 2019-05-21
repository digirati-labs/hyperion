import { Paint } from '.';

export interface RenderPipeline {
  getAllPointsAt(target: Float32Array, aggregate: Float32Array, scale: number): Paint[];
  transform(op: Float32Array): void;
}
