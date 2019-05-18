import {
  World,
  fromImage,
  WorldObject,
  Runtime,
  CanvasRenderer,
  DebugRenderer,
  mutate,
  transform,
  translate,
  scale,
} from '@hyperion-framework/atlas';
import { listen, value, pointer, decay, tween, inertia } from 'popmotion';
import nls from './image-tiles/nls';
import wunder from './image-tiles/wunder';
import { scaleAtOrigin } from '@hyperion-framework/atlas';

const app = document.getElementById('app');
const debug = document.getElementById('debug');

// Create a new world.
const world = new World(1200, 1200);

// Add some objects.
world.addObjectAt(
  fromImage({
    src: 'https://dlcs-ida.org/thumbs/2/1/M-1011_R-127_1048/full/280,400/0/default.jpg',
    width: 280,
    height: 400,
    target: { width: 280, height: 400 },
  }),
  { x: 50, y: 550 }
);

// Some tile sources (deep zoom)
world.addObjectAt(nls, { x: 380, y: 0, height: 500 });

world.addObjectAt(wunder, { x: 0, y: 0, height: 500 });

// Create an initial viewport.
const viewport = { width: window.innerWidth / 2, height: window.innerHeight / 2, x: 0, y: 0, scale: 1 };

// Create a quick canvas for our viewer.
const canvas = document.createElement('canvas');
canvas.style.border = '1px solid #000';
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
app.appendChild(canvas);

// Create a renderer for our work, add it to a runtime.
const renderer = new CanvasRenderer(canvas);
const runtime = new Runtime(renderer, world, viewport);

// Some hacky user interactions, using popmotion. This is an observer, listening
//  to the x and y co-ordinates and updating the views.
const xy = value({ x: 0, y: 0 }, ({ x: x1, y: y1 }) => {
  const x = x1 / runtime.scaleFactor;
  const y = y1 / runtime.scaleFactor;

  if (Math.abs(x - runtime.target[3] > 0.001)) return;

  runtime.target[3] = runtime.target[3] - runtime.target[1] - x;
  runtime.target[4] = runtime.target[4] - runtime.target[2] - y;
  runtime.target[1] = -x;
  runtime.target[2] = -y;
});

// This is buggy, but is an implementation of scrolling.
// canvas.addEventListener('wheel', e => {
//   e.preventDefault();
//   mutate(runtime.target, scale(e.deltaY < 0 ? 0.99 : 1.01));
//   mutate(runtime.target, translate(-(runtime.target[3] - runtime.target[1]) / 2, -(runtime.target[4] - runtime.target[2])/2));
//
//
//   console.log('did I?', { x: runtime.target[1], y: runtime.target[2] });
//   xy.update({ x: runtime.target[1], y: runtime.target[2] });
// });

// Popmotion drag start.
listen(canvas, 'mousedown touchstart').start(() => {
  pointer(xy.get())
    .pipe(v => ({ x: v.x >> 0, y: v.y >> 0 }))
    .start(xy);
});

// Simple zoom out control.
document.getElementById('zoom-out').addEventListener('click', () => {
  if (runtime.scaleFactor * 1.25 < 1) return;
  mutate(runtime.target, scaleAtOrigin(1.25, runtime.target[1], runtime.target[2]));
  // Need to update our observables, for pop-motion
  xy.update({ x: runtime.target[1], y: runtime.target[2] });
});

// Simple zoom in control.
document.getElementById('zoom-in').addEventListener('click', () => {
  if (runtime.scaleFactor * 0.8 > 10) return;
  mutate(runtime.target, scaleAtOrigin(0.8, runtime.target[1], runtime.target[2]));
  // Need to update our observables, for pop-motion
  xy.update({ x: runtime.target[1], y: runtime.target[2] });
});

// Popmotion velocity and inertia.
listen(document, 'mouseup touchend').start(() => {
  inertia({
    max: { x: 0, y: 0 },
    min: {
      x: -(world.width * runtime.scaleFactor - (runtime.target[3] - runtime.target[1]) * runtime.scaleFactor),
      y: -(world.height * runtime.scaleFactor - (runtime.target[4] - runtime.target[2]) * runtime.scaleFactor),
    },
    bounceStiffness: 140,
    bounceDamping: 15,
    timeConstant: 200,
    power: 0.2,
    velocity: xy.getVelocity(),
    from: xy.get(),
  })
    .pipe(
      // Simple optimisation to floor the float values of this transform.
      v => ({ x: v.x >> 0, y: v.y >> 0 })
    )
    .start(xy);
});

// Add a second renderer (debug the world)
const debugRenderer = new DebugRenderer(debug);
const secondRuntime = new Runtime(debugRenderer, world, viewport);
// This will simply assign the same co-ordinates in memory.
secondRuntime.syncTo(runtime);
