import { Runtime, CanvasRenderer, DebugRenderer, popmotionController } from '@hyperion-framework/atlas';

export function renderWorld(world, viewport) {
  // Create a quick canvas for our viewer.
  const canvas = document.createElement('canvas');
  canvas.style.background = '#000';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // canvas.width = window.innerWidth * (window.devicePixelRatio || 1);
  // canvas.height = window.innerHeight * (window.devicePixelRatio || 1);
  // canvas.style.transform = 'scale(0.5)';
  // canvas.style.transformOrigin = '0px 0px';
  document.getElementById('app').appendChild(canvas);

  // Could be composed.
  const controller = popmotionController(canvas, {
    devicePixelRatio: /*window.devicePixelRatio ||*/ 1,
    zoomOut: document.getElementById('zoom-out'),
    zoomIn: document.getElementById('zoom-in'),
  });

  // Create a renderer for our work, add it to a runtime.
  const renderer = new CanvasRenderer(canvas);
  const runtime = controller(new Runtime(renderer, world, viewport));

  window.addEventListener('resize', () => {
    runtime.resize(canvas.width, window.innerWidth, canvas.height, window.innerHeight);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  // Add a second renderer (debug the world)
  const debugRenderer = new DebugRenderer(debug);
  const secondRuntime = new Runtime(debugRenderer, world, viewport);

  // This will simply assign the same co-ordinates in memory.
  secondRuntime.syncTo(runtime);
}
