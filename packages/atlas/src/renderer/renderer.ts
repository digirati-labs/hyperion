import { SpacialContent } from '../spacial-content';
import { World } from '../world';

export interface Renderer {
  beforeFrame(world: World, delta: number, target: Float32Array): void;
  paint(paint: SpacialContent, index: number, x: number, y: number, width: number, height: number): void;
  afterFrame(world: World, delta: number, target: Float32Array): void;
  getScale(width: number, height: number): number;
  prepareLayer(paint: SpacialContent): void;
  afterPaintLayer(paint: SpacialContent, transform?: Float32Array): void;
  pendingUpdate(): boolean;
}
