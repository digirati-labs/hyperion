import { World, fromImage, Runtime, CanvasRenderer, DebugRenderer } from '@hyperion-framework/atlas';
import { listen, value, pointer, tween, inertia } from 'popmotion';
import nls from './image-tiles/nls';
import wunder from './image-tiles/wunder';

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

// Some user interactions, using popmotion. This is an observer, listening
//  to the x, y, height and width co-ordinates and updating the views.
// This acts as a bridge to popmotion, allowing us to twean these values as
// we see fit.
const viewer = value(
  {
    x: runtime.target[1],
    y: runtime.target[2],
    width: runtime.target[3] - runtime.target[1],
    height: runtime.target[4] - runtime.target[2],
  },
  // This takes in a {x, y, width, height} and updates the viewport.
  runtime.setViewport
);

// These two control the dragging, panning and zooming. The second has inertia
// so it will slow down and bounce on the sides.
listen(canvas, 'mousedown touchstart').start(() => {
  const { x, y } = viewer.get();
  pointer({
    x: -x * runtime.scaleFactor,
    y: -y * runtime.scaleFactor,
  })
    .pipe(v => ({ x: -v.x / runtime.scaleFactor, y: -v.y / runtime.scaleFactor }))
    .start(viewer);
});
listen(document, 'mouseup touchend').start(() => {
  const padding = 200;
  inertia({
    min: runtime.getMinViewportPosition(padding),
    max: runtime.getMaxViewportPosition(padding),
    bounceStiffness: 120,
    bounceDamping: 15,
    timeConstant: 240,
    power: 0.1,
    velocity: viewer.getVelocity(),
    from: viewer.get(),
  }).start(viewer);
});

// A generic zoom to function, with an optional origin parameter.
// All of the points referenced are world points. You can pass your
// own in or it will simply default to the middle of the viewport.
// Note: the factor changes the size of the VIEWPORT on the canvas.
// So smaller values will zoom in, and larger values will zoom out.
function zoomTo(factor, origin) {
  if (factor < 1 && runtime.scaleFactor * factor >= 10) return;
  if (factor > 1 && runtime.scaleFactor * factor <= 1) return;
  // Save the before for the tween.
  const fromPos = runtime.getViewport();
  // set the new scale.
  runtime.setScale(factor, origin);
  // Need to update our observables, for pop-motion
  tween({
    from: fromPos,
    to: runtime.getViewport(),
    duration: 200,
  }).start(viewer);
}

// Let's use that new zoom method, first we will hook up the UI buttons to zoom.
// Simple zoom out control.
document.getElementById('zoom-out').addEventListener('click', () => zoomTo(1.25));
// Simple zoom in control.
document.getElementById('zoom-in').addEventListener('click', () => zoomTo(0.8));

// Next we will add a scrolling event to the scroll-wheel.
canvas.addEventListener('wheel', e => {
  e.preventDefault();
  zoomTo(
    // Generating a zoom from the wheel delta
    1 + e.deltaY / 100,
    // Convert the cursor to an origin
    runtime.viewerToWorld(e.pageX - canvasPos.x, e.pageY - canvasPos.y)
  );
});

// For clicking its a little trickier. We want to still allow panning. So this
// little temporary variable will nuke the value when the mouse is down.
const canvasPos = canvas.getBoundingClientRect();
let click;
canvas.addEventListener('mousedown', () => {
  click = true;
  setTimeout(() => {
    click = false;
  }, 500);
});

// Next we will add another zoom option, click to zoom. This time the origin will
// be where our mouse is in relation to the world.
canvas.addEventListener('click', ({ pageX, pageY }) => {
  if (click) {
    zoomTo(0.6, runtime.viewerToWorld(pageX - canvasPos.x, pageY - canvasPos.y));
  }
});

// On mouse move we will display the world co-ordinates over the mouse in the UI.
canvas.addEventListener('mousemove', ({ pageX, pageY }) => {
  // Here we stop a click if the mouse has moved (starting a drag).
  click = false;
  const { x, y } = runtime.viewerToWorld(pageX - canvasPos.x, pageY - canvasPos.y);

  document.getElementById('x').innerText = '' + Math.floor(x);
  document.getElementById('y').innerText = '' + Math.floor(y);
});

// Add a second renderer (debug the world)
const debugRenderer = new DebugRenderer(debug);
const secondRuntime = new Runtime(debugRenderer, world, viewport);
// This will simply assign the same co-ordinates in memory.
secondRuntime.syncTo(runtime);
