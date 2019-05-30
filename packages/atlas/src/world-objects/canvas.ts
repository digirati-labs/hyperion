import { CanvasNormalized, IIIFExternalWebResource } from '@hyperion-framework/types';
import { fromContentResource } from '../factory/content-resource';
import { WorldObject } from './world-object';

export function fromCanvas(canvas: CanvasNormalized, resources: IIIFExternalWebResource[] = []): WorldObject {
  return new WorldObject({
    id: canvas.id,
    width: canvas.width,
    height: canvas.height,
    layers: resources.map(resource => fromContentResource(resource)).reduce((arr, next) => arr.concat(next), []),
  });
}
