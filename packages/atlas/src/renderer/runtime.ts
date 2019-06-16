import { Projection, Viewer } from '../types';
import { World } from '../world';
import { DnaFactory, mutate, scale, scaleAtOrigin, transform } from '../dna';
import { Renderer } from './renderer';

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
  scaleFactor: number;
  transformBuffer = new Float32Array(500);
  lastTarget = new Float32Array(5);
  pendingUpdate = false;
  firstRender = true;
  lastTime: number;
  stopId?: number;

  constructor(renderer: Renderer, world: World, target: Viewer) {
    this.renderer = renderer;
    this.world = world;
    this.target = DnaFactory.projection(target);
    this.aggregate = scale(1);
    this.scaleFactor = target.scale;
    this.world.addLayoutSubscriber((type: string) => {
      if (type === 'repaint') {
        this.pendingUpdate = true;
      }
    });
    this.lastTime = performance.now();
    this.render(this.lastTime);
  }

  /**
   * Resize world
   *
   * This is generally called when the world is re-sized. This recalculates the current target accordingly. It needs to
   * be improved, tested and planned.
   *
   * @param fromWidth
   * @param toWidth
   * @param fromHeight
   * @param toHeight
   */
  resize(fromWidth: number, toWidth: number, fromHeight: number, toHeight: number) {
    this.scaleFactor = this.scaleFactor * (fromWidth / toWidth);
    this.target[3] = this.target[1] + (this.target[3] - this.target[1]) / (fromWidth / toWidth);
    this.target[4] = this.target[2] + (this.target[4] - this.target[2]) / (fromHeight / toHeight);
  }

  /**
   * Get Viewport
   *
   * Returns a projection based on the current target.
   *
   * @todo rename to getProjection.
   * @todo evaluate if we actually need this.
   */
  getViewport(): Projection {
    return {
      x: this.target[1],
      y: this.target[2],
      width: this.target[3] - this.target[1],
      height: this.target[4] - this.target[2],
    };
  }

  /**
   * Set Viewport
   *
   * This is a helper for setting the viewport based on x, y, width and height, opposed to the x1, y1, x2, y2 native
   * co-ordinates of the target.
   *
   * @param data
   */
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

  /**
   * Get bounds
   *
   * Returns the minimum and maximum bounds. This absolutely needs improved. With the addition of zones this is becoming
   * more of an issue. It has to take into account the current layout. There also needs to be a new method for creating
   * a "home" view  that will fit the content to the view.
   *
   * @param padding
   */
  getBounds(padding: number) {
    if (this.renderer.hasActiveZone()) {
      const bounds = this.renderer.getViewportBounds(this.world, this.target, padding);
      if (bounds) {
        return bounds;
      }
    }

    const deltaX = this.scaleFactor < 1 ? this.world.width / this.scaleFactor / 2 : padding;
    const deltaY = this.scaleFactor < 1 ? this.world.height / this.scaleFactor / 2 : padding;
    return {
      x1: -deltaX,
      y1: -deltaY,
      x2: this.world.width - (this.target[3] - this.target[1]) + deltaX,
      y2: this.world.height - (this.target[4] - this.target[2]) + deltaY,
    };
  }

  /**
   * Get minimum viewport position
   *
   * This needs to be removed, and replaced with the getBounds.
   *
   * @deprecated
   * @param padding
   * @param devicePixelRatio
   */
  getMinViewportPosition(padding: number, devicePixelRatio: number = 1) {
    if (this.renderer.hasActiveZone()) {
      const bounds = this.renderer.getViewportBounds(this.world, this.target, padding);
      if (bounds) {
        return {
          x: bounds.x1,
          y: bounds.y1,
        }
      }
    }
    const deltaX = this.scaleFactor < 1 ? this.world.width / this.scaleFactor / 2 : padding;
    const deltaY = this.scaleFactor < 1 ? this.world.height / this.scaleFactor / 2 : padding;
    return {
      x: -deltaX,
      y: -deltaY,
    };
  }

  /**
   * Get maximum viewport position
   *
   * This also needs to be removed, and replaced with getBounds.
   *
   * @deprecated
   * @param padding
   */
  getMaxViewportPosition(padding: number) {
    if (this.renderer.hasActiveZone()) {
      const bounds = this.renderer.getViewportBounds(this.world, this.target, padding);
      if (bounds) {
        return {
          x: bounds.x2,
          y: bounds.y2,
        }
      }
    }
    const deltaX = this.scaleFactor < 1 ? this.world.width / this.scaleFactor / 2 : padding;
    const deltaY = this.scaleFactor < 1 ? this.world.height / this.scaleFactor / 2 : padding;
    return {
      x: this.world.width - (this.target[3] - this.target[1]) + deltaX,
      y: this.world.height - (this.target[4] - this.target[2]) + deltaY,
    };
  }

  /**
   * Converts units from the viewer to the world.
   *
   * Needs to be tested, as this will become more important with the event system.
   *
   * @param x
   * @param y
   */
  viewerToWorld(x: number, y: number) {
    return {
      x: this.target[1] + x / this.scaleFactor,
      y: this.target[2] + y / this.scaleFactor,
    };
  }

  /**
   * Set scale
   *
   * This will set the scale of the target, with an optional origin.
   *
   * @param scaleFactor
   * @param origin
   */
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

  /**
   * Sync runtime instances
   *
   * Allows a single controller to drive 2 runtime instances, or 2 controllers to both
   * control each other.
   *
   * @param runtime
   */
  syncTo(runtime: Runtime) {
    const oldTarget = this.target;
    this.target = runtime.target;

    // Return an unsubscribe.
    return () => {
      this.target = oldTarget;
    };
  }

  /**
   * Invalidate
   *
   * Unused function, not sure what it does.
   * @deprecated
   */
  invalidate() {
    // The first 0 will ensure no valid target matches.
    this.target.set([0, 0, 0, 0, 0]);
  }

  /**
   * Stop the runtime
   *
   * Stops the internal clock, where no more updates will occur. Returns a function to restart it.
   */
  stop(): () => void {
    if (typeof this.stopId !== 'undefined') {
      window.cancelAnimationFrame(this.stopId);
    }

    return () => {
      this.render(performance.now())
    }
  }

  /**
   * Render
   *
   * The hottest path in the runtime, called every 16.7ms, if possible in the future be double-timed on 120hz monitors.
   *
   * @param t
   */
  render = (t: number) => {
    const delta = t - this.lastTime;
    this.lastTime = t;
    // Set up our loop.
    this.stopId = window.requestAnimationFrame(this.render);
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
    this.renderer.beforeFrame(this.world, delta, this.target);
    // Calculate a scale factor by passing in the height and width of the target.
    this.scaleFactor = this.renderer.getScale(this.target[3] - this.target[1], this.target[4] - this.target[2]);
    // Get the points to render based on this scale factor and the current x,y,w,h in the target buffer.
    const points = this.renderer.getPointsAt(this.world, this.target, this.aggregate, this.scaleFactor);
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
    this.renderer.afterFrame(this.world, delta, this.target);
    // Finally at the end, we set up the frame we just rendered.
    this.lastTarget.set([this.target[0], this.target[1], this.target[2], this.target[3], this.target[4]]);
    // We've just finished our first render.
    this.firstRender = false;
    this.pendingUpdate = false;
    // @todo this could be improved, but will work for now.
    const updates = this.world.getScheduledUpdates(this.target, this.scaleFactor);
    const len = updates.length;
    if (len > 0) {
      for (let i = 0; i < len; i++) {
        updates[i]().then(() => {
          this.pendingUpdate = true;
        });
      }
    }
  };
}
