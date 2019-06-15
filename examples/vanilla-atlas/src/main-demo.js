import { GridBuilder, SingleImage, WorldObject } from '@hyperion-framework/atlas';
import { Vault } from '@hyperion-framework/vault';
import { renderWorld } from './render-world';
import { imagesFromIIIF } from './images-from-iiif';
import { hyperionLogo } from "./images/hyperion-logo";

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

    // Create an initial viewport.
    const viewport = { width: window.innerWidth, height: window.innerHeight, x: 0, y: 0, scale: 1 };

    renderWorld(world, viewport);
  }
);
