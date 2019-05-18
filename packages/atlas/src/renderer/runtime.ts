import { Viewer } from '../types';
import { World } from '../world';
import { DnaFactory, scale, transform } from '../dna';
import { Renderer } from './renderer';
import sync, { FrameData, Process } from 'framesync';

export class Runtime {
  renderer: Renderer;
  world: World;
  target: Float32Array;
  aggregate: Float32Array;
  clock: Process;
  scaleFactor: number;
  transformBuffer = new Float32Array(500);
  lastTarget = new Float32Array(5);
  pendingUpdate = false;

  constructor(renderer: Renderer, world: World, target: Viewer) {
    this.renderer = renderer;
    this.world = world;
    this.target = DnaFactory.projection(target);
    this.aggregate = scale(1);
    this.clock = sync.render(this.render, true);
    this.scaleFactor = target.scale;
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
  };
}
