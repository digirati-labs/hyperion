import { SpacialContent } from './spacial-content';
import { DnaFactory } from '../dna';
import { DisplayData } from '../types';
import { AbstractContent } from './abstract-content';

export class TextualContent extends AbstractContent implements SpacialContent {
  readonly type: 'spacial-content' = 'spacial-content';
  readonly display: DisplayData;
  readonly id: string;
  points: Float32Array;
  content: string;
  // fontSize ?
  // fontFamily ?
  // fitToWidth ?
  // color ?
  // style ?

  constructor(data: { id: string; width: number; height: number; content: string }) {
    super();
    this.id = data.id; // @todo maybe generate id?
    this.content = data.content;
    this.points = DnaFactory.singleBox(data.width, data.height);
    this.display = {
      scale: 1,
      width: data.width,
      height: data.height,
      points: this.points,
    };
  }
}
