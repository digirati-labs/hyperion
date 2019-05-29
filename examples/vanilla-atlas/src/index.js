import { SingleImage, WorldObject, GridBuilder } from '@hyperion-framework/atlas';
import { renderWorld } from './render-world';
import { DnaFactory } from "@hyperion-framework/atlas";
import { ImageService } from "@hyperion-framework/atlas";

const builder = new GridBuilder();

builder.setWidth(window.innerWidth);
builder.setViewingDirection('left-to-right');
builder.setColumns(2);
builder.setPadding(100);
builder.setSpacing(50);

const lazyImages = [
  SingleImage.fromImage(
    'https://via.placeholder.com/250x250',
    { width: 4000, height: 4000 },
    { width: 1000, height: 1000 }
  ),
  SingleImage.fromImage(
    'https://via.placeholder.com/500x500',
    { width: 4000, height: 4000 },
    { width: 2000, height: 2000 }
  ),
  SingleImage.fromImage(
    'https://via.placeholder.com/750x750',
    { width: 4000, height: 4000 },
    { width: 4000, height: 4000 }
  ),
];
const imageService = new ImageService({
    id: 'my-image',
    height: 4000,
    width: 4000,
    images: [
      SingleImage.fromImage(
        'https://via.placeholder.com/100x100',
        { width: 4000, height: 4000 },
        { width: 100, height: 100 }
      ),
    ],
  });

builder.addContent([
  new WorldObject({
    id: 'test 1',
    width: 4000,
    height: 4000,
    layers: [
      imageService,
    ],
  }),
]);

builder.recalculate();

window.addEventListener('resize', () => {
  builder.setWidth(window.innerWidth);
  builder.recalculate();
});

const world = builder.getWorld();

// Create an initial viewport.
const viewport = { width: window.innerWidth, height: window.innerHeight, x: 0, y: 0, scale: 1 };

renderWorld(world, viewport);
