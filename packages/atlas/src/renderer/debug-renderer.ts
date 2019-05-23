import { FrameData } from 'framesync';
import { SpacialContent } from '../spacial-content';
import { World } from '../world';
import { Renderer } from './renderer';

export class DebugRenderer implements Renderer {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  heightRatio: number = 1;
  widthRatio: number = 1;
  target: Float32Array = new Float32Array(5);

  initialWidth: number;
  initialHeight: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.initialWidth = canvas.width;
    this.initialHeight = canvas.height;
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  afterFrame(world: World, data: FrameData, target: Float32Array) {
    // Everything in this debugger happens at the end of the render cycle.
    // This debugger is made to be hacked and changed as needed, so some
    // variables are set up as a convenience.
    // First we clear.
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // We figure out the size of the debugger in relation to the world.
    const widthRatio = this.initialWidth / world.width;
    const heightRatio = this.initialHeight / world.height;

    const ratio = this.widthRatio > this.heightRatio ? widthRatio : heightRatio;
    this.canvas.height = world.height * ratio;
    this.canvas.width = world.width * ratio;

    // If it needs to be used in other methods, it can be.
    this.target = target;

    // Get every point on the world, that is laying out the world items, but
    // not the images that make up the world items. (i.e. canvas dimensions and
    // their positions)
    world.getPoints().forEach((v, k, arr) => {
      // Technically not needed, but some might have been hidden.
      // Could make these a different border.
      if (k % 5 === 0 && v) {
        // Descriptive drawing object, doesn't need to be fast.
        // We are not using all of these fields.
        const toDraw = {
          x1: arr[k + 1] * ratio,
          y1: arr[k + 2] * ratio,
          x2: arr[k + 3] * ratio,
          y2: arr[k + 4] * ratio,
          width: (arr[k + 3] - arr[k + 1]) * ratio,
          height: (arr[k + 4] - arr[k + 2]) * ratio,
        };

        // World items are red bordered boxes.
        this.context.strokeStyle = 'red';
        this.context.strokeRect(toDraw.x1, toDraw.y1, toDraw.width, toDraw.height);
      }
    });

    // If there's a viewport attached, we can render that too
    // There may not be a target, if someone is just debugging a world.
    if (target) {
      // This will be a green box.
      this.context.strokeStyle = 'green';
      this.context.strokeRect(
        target[1] * ratio,
        target[2] * ratio,
        (target[3] - target[1]) * ratio,
        (target[4] - target[2]) * ratio
      );
    }
  }

  getScale(width: number, height: number): number {
    return 1;
  }

  beforeFrame(world: World, data: FrameData) {
    // no op.
  }

  drawImage(url: string, x: number, y: number, width: number, height: number) {
    // no op.
  }

  afterPaintLayer(paint: SpacialContent, transform?: Float32Array): void {
    // paint.
  }

  paint(paint: SpacialContent, index: number, x: number, y: number, width: number, height: number): void {
    // paint.
  }

  prepareLayer(paint: SpacialContent): void {
    // prepare
  }

  pendingUpdate(): boolean {
    // change this to true if you want to render every frame.
    return false;
  }
}
