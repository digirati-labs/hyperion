import { SpacialContent } from '../spacial-content';
import { World } from '../world';
import {ZoneInterface} from "../world-objects/zone";
import {Paint} from "../world-objects";
import {PositionPair} from "../types";

export interface Renderer {
  beforeFrame(world: World, delta: number, target: Float32Array): void;
  paint(paint: SpacialContent, index: number, x: number, y: number, width: number, height: number): void;
  afterFrame(world: World, delta: number, target: Float32Array): void;
  getScale(width: number, height: number): number;
  prepareLayer(paint: SpacialContent): void;
  afterPaintLayer(paint: SpacialContent, transform?: Float32Array): void;
  pendingUpdate(): boolean;
  getActiveZone(world: World): ZoneInterface | null;
  getPointsAt(world: World, target: Float32Array, aggregate: Float32Array, scaleFactor: number): Paint[];
  hasActiveZone(): boolean;
  getViewportBounds(world: World, target: Float32Array, padding: number): PositionPair | null;
}
