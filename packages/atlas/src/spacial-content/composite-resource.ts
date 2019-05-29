import { SpacialContent } from './spacial-content';
import { compose, DnaFactory, translate } from '../dna';
import { DisplayData } from '../types';
import { Paint } from '../world-objects';
import { bestResourceAtRatio } from '../utils';
import { AbstractContent } from './abstract-content';

export class CompositeResource extends AbstractContent implements SpacialContent {
  readonly id: string;
  readonly display: DisplayData;
  points: Float32Array;
  images: SpacialContent[];
  scaleFactors: number[];
  aggregateBuffer = new Float32Array(9);
  lazyLoader?: () => Promise<SpacialContent[]>;
  isFullyLoaded = false;

  constructor(data: { id: string; width: number; height: number; images: SpacialContent[], loadFullImages?: () => Promise<SpacialContent[]> }) {
    super();
    this.id = data.id;
    this.points = DnaFactory.singleBox(data.width, data.height);
    this.lazyLoader = data.loadFullImages;
    if (!data.loadFullImages) {
      this.isFullyLoaded = true;
    }
    this.display = {
      points: DnaFactory.singleBox(data.width, data.height),
      height: data.height,
      width: data.width,
      scale: 1,
    };

    this.images = data.images.sort((a: SpacialContent, b: SpacialContent) => b.display.width - a.display.width);
    this.scaleFactors = this.images.map(singleImage => singleImage.display.scale);
  }

  isMarkedAsDirty(): boolean {
    // @todo find a better way of propagating this behaviour.
    if (this.isDirty) {
      return true;
    }
    const items = this.images.length;
    for (let i = 0; i < items; i ++) {
      if (this.images[i].isMarkedAsDirty()) {
        return true;
      }
    }
    return false;
  }

  async loadFullResource() {
    if (this.isFullyLoaded) {
      return;
    }
    if (this.lazyLoader) {
      // Reads: resource has already been requested.
      this.isFullyLoaded = true;
      const newImages = await this.lazyLoader();
      this.images.push(...newImages);
      this.images.sort((a: SpacialContent, b: SpacialContent) => b.display.width - a.display.width);
      this.scaleFactors = this.images.map(singleImage => singleImage.display.scale);
      this.isDirty = true;
    }
  }

  getPointsAt(target: Float32Array, aggregate?: Float32Array, scale?: number): Paint {
    return bestResourceAtRatio(1 / (scale || 1), this.images).getPointsAt(
      target,
      aggregate
        ? compose(
        aggregate,
        translate(this.x, this.y),
        this.aggregateBuffer
        )
        : translate(this.x, this.y),
      scale
    );
  }
}
