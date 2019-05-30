import './main-demo';
// import { SingleImage, WorldObject, GridBuilder } from '@hyperion-framework/atlas';
// import { renderWorld } from './render-world';
// import { DnaFactory } from '@hyperion-framework/atlas';
// import { CompositeResource } from '@hyperion-framework/atlas';
// import { imageServiceLoader } from '@hyperion-framework/atlas/lib/image-api/image-service-loader';
// import { fromImageService } from "@hyperion-framework/atlas/lib/factory/image-service";
//
// const builder = new GridBuilder();
//
// builder.setWidth(window.innerWidth);
// builder.setViewingDirection('left-to-right');
// builder.setColumns(2);
// builder.setPadding(100);
// builder.setSpacing(50);
//
// const imageService = new CompositeResource({
//   id: 'https://view.nls.uk/iiif/7443/74438561.5',
//   width: 2500,
//   height: 1868,
//   loadFullImages: () => imageServiceLoader.loadService({
//     id: 'https://view.nls.uk/iiif/7443/74438561.5',
//     width: 2500,
//     height: 1868,
//   }).then(service => [fromImageService(service)]),
//   images: [
//     SingleImage.fromImage(
//       'https://deriv.nls.uk/dcn4/7443/74438561.4.jpg',
//       { width: 2500, height: 1868 },
//       { width: 1250, height: 934 },
//       'https://view.nls.uk/iiif/7443/74438561.5'
//     ),
//   ],
// });
//
// // imageService.loadFullResource();
//
// builder.addContent([
//   new WorldObject({
//     id: 'https://view.nls.uk/iiif/7443/74438561.5',
//     width: 2500,
//     height: 1868,
//     layers: [imageService],
//   }),
// ]);
//
// builder.recalculate();
//
// window.addEventListener('resize', () => {
//   builder.setWidth(window.innerWidth);
//   builder.recalculate();
// });
//
// const world = builder.getWorld();
//
// // Create an initial viewport.
// const viewport = { width: window.innerWidth, height: window.innerHeight, x: 0, y: 0, scale: 1 };
//
// renderWorld(world, viewport);
