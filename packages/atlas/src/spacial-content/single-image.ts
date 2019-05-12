import { SpacialContent } from './spacial-content';
import { DnaFactory } from '../dna';
import { DisplayData, SpacialSize } from '../types';
import { AbstractContent } from './abstract-content';

export class SingleImage extends AbstractContent implements SpacialContent {
  readonly id: string;
  readonly display: DisplayData;
  readonly points: Float32Array;

  constructor(data: { uri: string; width: number; height: number; scale?: number }) {
    super();
    const scale = data.scale || 1;
    this.id = data.uri;
    this.points = DnaFactory.singleBox(data.width, data.height);

    this.display = {
      scale: scale,
      width: data.width / scale,
      height: data.height / scale,
      points: scale !== 1 ? DnaFactory.singleBox(data.width / scale, data.height / scale) : this.points,
    };
  }

  getImageUrl() {
    return this.id;
  }

  static fromImage(uri: string, target: SpacialSize, display?: SpacialSize): SingleImage {
    const width = display ? display.width : target.width;
    const scale = target.width / width;

    return new SingleImage({
      uri,
      width: target.width,
      height: target.height,
      scale,
    });
  }
}
