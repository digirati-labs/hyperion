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

  // This works, but should be improved.
  // It should create a layered image similar to IIIF with different scale factors of the SVG.
  // And implement its own get points function, to return the right layer.
  // Would also be great if the ID field wasn't the entire SVG.
  static fromSvg(svg: string, target: SpacialSize, display?: SpacialSize): SingleImage {
    return SingleImage.fromImage('data:image/svg+xml;base64,' + btoa(svg), target, display);
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

  getImageUrl() {
    return this.id;
  }
}
