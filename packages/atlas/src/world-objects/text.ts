import { WorldObject } from './world-object';
import { TextualContent } from '../spacial-content';

export function fromText({ content, width, height }: { content: string; width: number; height: number }) {
  return new WorldObject({
    id: content,
    width,
    height,
    layers: [new TextualContent({ id: content, width, height, content })],
  });
}
