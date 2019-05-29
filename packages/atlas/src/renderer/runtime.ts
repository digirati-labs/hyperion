import { Projection, Viewer } from '../types';
import { World } from '../world';
import { DnaFactory, mutate, scale, scaleAtOrigin, transform } from '../dna';
import { Renderer } from './renderer';
import sync, { FrameData, Process } from 'framesync';

export class Runtime {
  // Helper getters.
  get x(): number {
    return this.target[1];
  }

  set x(x: number) {
    this.target[1] = x;
  }

  get y(): number {
    return this.target[2];
  }

  set y(y: number) {
    this.target[2] = y;
  }

  get x2(): number {
    return this.target[3];
  }

  set x2(x2: number) {
    this.target[3] = x2;
  }

  get y2(): number {
    return this.target[4];
  }

  set y2(y2: number) {
    this.target[4] = y2;
  }

  get width(): number {
    return this.target[3] - this.target[1];
  }

  set width(width: number) {
    this.target[3] = this.target[1] + width;
  }

  get height(): number {
    return this.target[4] - this.target[2];
  }

  set height(height: number) {
    this.target[4] = this.target[2] = height;
  }

  renderer: Renderer;
  world: World;
  target: Float32Array;
  aggregate: Float32Array;
  clock: Process;
  scaleFactor: number;
  transformBuffer = new Float32Array(500);
  lastTarget = new Float32Array(5);
  pendingUpdate = false;
  firstRender = true;

  constructor(renderer: Renderer, world: World, target: Viewer) {
    this.renderer = renderer;
    this.world = world;
    this.target = DnaFactory.projection(target);
    this.aggregate = scale(1);
    this.clock = sync.render(this.render, true);
    this.scaleFactor = target.scale;
    this.world.addLayoutSubscriber((type: string) => {
      if (type === 'repaint') {
        this.pendingUpdate = true;
      }
    });
  }

  resize(fromWidth: number, toWidth: number, fromHeight: number, toHeight: number) {
    this.scaleFactor = this.scaleFactor * (fromWidth / toWidth);
    this.target[3] = this.target[1] + (this.target[3] - this.target[1]) / (fromWidth / toWidth);
    this.target[4] = this.target[2] + (this.target[4] - this.target[2]) / (fromHeight / toHeight);
  }

  getViewport(): Projection {
    return {
      x: this.target[1],
      y: this.target[2],
      width: this.target[3] - this.target[1],
      height: this.target[4] - this.target[2],
    };
  }

  setViewport = (data: { x: number; y: number; width?: number; height?: number }) => {
    if (data.width) {
      this.target[3] = data.x + data.width;
    } else {
      this.target[3] = this.target[3] - this.target[1] + data.x;
    }
    if (data.height) {
      this.target[4] = data.y + data.height;
    } else {
      this.target[4] = this.target[4] - this.target[2] + data.y;
    }
    this.target[1] = data.x;
    this.target[2] = data.y;
  };

  getMinViewportPosition(padding: number) {
    return {
      x: -padding,
      y: -padding,
    };
  }

  getMaxViewportPosition(padding: number) {
    return {
      x: this.world.width - (this.target[3] - this.target[1]) + padding,
      y: this.world.height - (this.target[4] - this.target[2]) + padding,
    };
  }

  viewerToWorld(x: number, y: number) {
    return {
      x: this.target[1] + x / this.scaleFactor,
      y: this.target[2] + y / this.scaleFactor,
    };
  }

  setScale(scaleFactor: number, origin?: { x: number; y: number }) {
    mutate(
      this.target,
      scaleAtOrigin(
        scaleFactor,
        origin ? origin.x : this.target[1] + (this.target[3] - this.target[1]) / 2,
        origin ? origin.y : this.target[2] + (this.target[4] - this.target[2]) / 2
      )
    );
  }

  syncTo(runtime: Runtime) {
    const oldTarget = this.target;
    this.target = runtime.target;

    // Return an unsubscribe.
    return () => {
      this.target = oldTarget;
    };
  }

  invalidate() {
    // The first 0 will ensure no valid target matches.
    this.target.set([0, 0, 0, 0, 0]);
  }

  render = (data: FrameData) => {
    if (
      !this.firstRender &&
      !this.pendingUpdate &&
      // Check if there was a pending update from the renderer.
      !this.renderer.pendingUpdate() &&
      // Then check the points, the first will catch invalidation.
      this.target[0] === this.lastTarget[0] &&
      // The following are x1, y1, x2, y2 points of the target.
      this.target[1] === this.lastTarget[1] &&
      this.target[2] === this.lastTarget[2] &&
      this.target[3] === this.lastTarget[3] &&
      this.target[4] === this.lastTarget[4]
    ) {
      // Nothing to do, target didn't change since last time.
      return;
    }

    // Before everything kicks off, add a hook.
    this.renderer.beforeFrame(this.world, data, this.target);
    // Calculate a scale factor by passing in the height and width of the target.
    this.scaleFactor = this.renderer.getScale(this.target[3] - this.target[1], this.target[4] - this.target[2]);
    // Get the points to render based on this scale factor and the current x,y,w,h in the target buffer.
    const points = this.world.getPointsAt(this.target, this.aggregate, this.scaleFactor);
    const pointsLen = points.length;
    for (let p = 0; p < pointsLen; p++) {
      // each point is an array of [SpacialContent, Float32Array, Float32Array]
      // The first is used to get real rendering data, like Image URLs etc.
      // The second is the points themselves for the layer. If this is a single
      // image this will be a single set of 5 points, for tiled images, it will be
      // the correct list of tiles, and a much longer list of points.
      const paint = points[p][0];
      const point = points[p][1];
      const transformation = points[p][2];
      // Another hook before painting a layer.
      this.renderer.prepareLayer(paint);
      // This is the position of the points. We apply the transform that came with the points.
      // The points before the transformation are just points relative to their parent (canvas?)
      // When we apply the transform, they become relative to the viewer. Both of these point
      // values are useful, but for rendering, we want the viewer-points.
      // @todo add option in renderer to omit this transform, instead passing it as a param.
      const position = transformation ? transform(point, transformation, this.transformBuffer) : point;
      // For loop helps keep this fast, looping through all of the tiles that make up an image.
      // This could be a single point, where len is one.
      const totalTiles = position.length / 5;
      for (let i = 0; i < totalTiles; i++) {
        const key = i * 5;
        // First key position tells us if we should render or not. A 0 will usually
        // indicate that the image is off-screen.
        if (position[key] === 0) {
          continue;
        }
        // This is the most expensive call by a long shot, the client implementation.
        // In the reference Canvas implementation, this will grab the URL of the image,
        // load it into an image tag and then paint it onto the canvas at the viewer points.
        this.renderer.paint(
          paint,
          i,
          position[key + 1],
          position[key + 2],
          position[key + 3] - position[key + 1],
          position[key + 4] - position[key + 2]
        );
      }
      // Another hook after painting each layer.
      this.renderer.afterPaintLayer(paint);
    }
    // A final hook after the entire frame is complete.
    this.renderer.afterFrame(this.world, data, this.target);
    // Finally at the end, we set up the frame we just rendered.
    this.lastTarget.set([this.target[0], this.target[1], this.target[2], this.target[3], this.target[4]]);
    // We've just finished our first render.
    this.firstRender = false;
    this.pendingUpdate = false;
    // @todo add a schedule task to check for dirty items.
    // @todo support dirty-only render, which will only render items marked as dirty if all other checks are false.
    // @todo could be getDirtyPointsAt() - this paint cycle won't actually clear the canvas first, in the canvas
    //       renderer, instead just layering new content.
  };
}
