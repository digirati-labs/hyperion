import { GridBuilder, Zone, SingleImage, WorldObject } from '@hyperion-framework/atlas';
import { Vault } from '@hyperion-framework/vault';
import { renderWorld } from './render-world';
import { imagesFromIIIF } from './images-from-iiif';
// import { hyperionLogo } from "./images/hyperion-logo";

const vault = new Vault();

imagesFromIIIF(vault, location.hash.slice(1) || 'https://view.nls.uk/manifest/9713/97134287/manifest.json').then(
  images => {
    const builder = new GridBuilder();

    builder.setWidth(window.innerWidth);
    builder.setViewingDirection('left-to-right');
    builder.setColumns(Math.round(window.innerWidth / 320));
    builder.setPadding(72);
    builder.setSpacing(40);

    // builder.addContent([
    //   new WorldObject({
    //     id: 'test 1',
    //     width: 239,
    //     height: 98,
    //     layers: [
    //       SingleImage.fromSvg(
    //         hyperionLogo,
    //         { width: 239, height: 98 },
    //         { width: 239 * 2, height: 98 * 2 }
    //       ),
    //     ],
    //   }),
    // ]);

    builder.addContent(images);

    builder.recalculate();

    window.addEventListener('resize', () => {
      builder.setWidth(window.innerWidth);
      builder.setColumns(Math.round(window.innerWidth / 400));
      builder.recalculate();
    });

    const world = builder.getWorld();

    world.addZone(new Zone(world.getObjects().slice(0, 3)));
    world.addZone(new Zone(world.getObjects().slice(1, 4)));
    world.addZone(new Zone(world.getObjects().slice(2, 5)));

    // console.log(world);

    // Create an initial viewport.
    const viewport = { width: window.innerWidth, height: window.innerHeight, x: 0, y: 0, scale: 1 };

    const renderer = renderWorld(world, viewport);

    // renderer.selectZone(world.zones[0].id);
    // setTimeout(() => {
    //   renderer.selectZone(world.zones[1].id);
    // }, 1000);
    // setTimeout(() => {
    //   renderer.selectZone(world.zones[2].id);
    // }, 2000);
    //
    // setTimeout(() => {
    //   renderer.deselectZone();
    // }, 3000);

    // console.log(renderer);
  }
);
