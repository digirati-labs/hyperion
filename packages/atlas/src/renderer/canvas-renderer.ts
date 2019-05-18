import { FrameData } from 'framesync';
import { SingleImage, SpacialContent, TiledImage } from '../spacial-content';
import { World } from '../world';
import { Renderer } from './renderer';

export type CanvasRendererOptions = {
  beforeFrame?: (data: FrameData) => void;
};

export class CanvasRenderer implements Renderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  imageCache: { [url: string]: HTMLImageElement } = {};
  localCanvases: { [id: string]: HTMLCanvasElement } = {};
  options: CanvasRendererOptions;
  imagesPending: number = 0;
  imagesLoaded: number = 0;
  readonly configuration = {
    segmentRendering: true,
  };

  constructor(canvas: HTMLCanvasElement, options?: CanvasRendererOptions) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;
    this.options = options || {};
  }

  createImage(url: string) {
    // Create an image tag.
    const image = document.createElement('img');
    // Keep track of pending images, so we can continue the render loop.
    this.imagesPending++;
    image.addEventListener('load', () => {
      this.imagesLoaded++;
    });
    image.src = url;
    // @todo Could paint this onto a canvas at this point, make for an easier
    //       repaint onto the main canvas. Although might cost more memory.
    return image;
  }

  afterFrame(world: World): void {
    // After we've rendered, we'll set the pending and loading to correct values.
    this.imagesPending = this.imagesPending - this.imagesLoaded;
    this.imagesLoaded = 0;
  }

  getScale(width: number, height: number): number {
    // It shouldn't happen, but it will. If the canvas is a different shape
    // to the viewport, then this will choose the largest scale to use.
    const w = this.canvas.width / width;
    const h = this.canvas.height / height;
    return w < h ? h : w;
  }

  beforeFrame(world: World, data: FrameData): void {
    // User-facing hook for before frame, contains timing information for
    // animations that might be happening, such as pan/drag.
    if (this.options.beforeFrame) {
      this.options.beforeFrame(data);
    }
    // But we also need to clear the canvas.
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  paint(paint: SpacialContent, index: number, x: number, y: number, width: number, height: number): void {
    // Only supporting single and tiled images at the moment.
    if (paint instanceof SingleImage || paint instanceof TiledImage) {
      try {
        // Simple draw of the (hopefully cached) image.
        this.ctx.drawImage(this.getImage(paint.getImageUrl(index)), x, y, width, height);
      } catch (err) {
        // nothing to do here, likely that the image isn't loaded yet.
      }
    }
  }

  getImage(url: string) {
    // Very simple image cache wrapper.
    if (!this.imageCache[url]) {
      this.imageCache[url] = this.createImage(url);
    }

    // @todo make this into a fixed size, with least-accessed items
    //      removed, allowing them to be GC'd. Can be configurable,
    //      but will act like a disk-flush, falling back to the browsers
    //     image cache, which itself might be flushed.
    return this.imageCache[url];
  }

  afterPaintLayer(paint: SpacialContent, transform: Float32Array): void {
    // no-op
  }

  prepareLayer(paint: SpacialContent): void {
    // no-op
  }

  pendingUpdate(): boolean {
    return this.imagesPending !== 0;
  }
}
