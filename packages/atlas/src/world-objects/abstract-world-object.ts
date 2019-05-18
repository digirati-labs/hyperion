import { WorldTime } from '../types';
import { AbstractObject } from './abstract-object';
import { RenderPipeline } from '../render-pipeline';

export interface AbstractWorldObject extends AbstractObject, RenderPipeline {
  x: number;
  y: number;
  scale: number;
  time: WorldTime[];
}
