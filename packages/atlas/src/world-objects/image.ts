import { WorldObject } from './world-object';
import { SingleImage } from '../spacial-content';

export function fromImage(image: {
  src: string;
  height: number;
  width: number;
  target?: { width: number; height: number };
}): WorldObject {
  const { src, target } = image;
  const width = target ? target.width : image.width;
  const height = target ? target.height : image.height;

  return new WorldObject({
    id: src,
    height,
    width,
    layers: [SingleImage.fromImage(src, { height, width }, { width: image.width, height: image.height })],
  });
}
