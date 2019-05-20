import { YogaBuilder, ImageService } from '@hyperion-framework/atlas';
import { Vault, getImageServiceFromAnnotation } from '@hyperion-framework/vault';
import { renderWorld } from './render-world';

const vault = new Vault();

vault
  .loadManifest(location.hash.slice(1) || 'https://view.nls.uk/manifest/9713/97134287/manifest.json')
  .catch(() => {
    if (location.hash) {
      location.hash = '';
      location.reload();
    }
  })
  .then(manifestJson => {
    let promises = [];
    manifestJson.items.map(canvasRef => {
      const canvas = vault.fromRef(canvasRef);
      canvas.items.forEach(annotationPageRef => {
        const annotationPage = vault.fromRef(annotationPageRef);

        annotationPage.items.forEach(annotationRef => {
          const annotation = vault.fromRef(annotationRef);
          const imageService = getImageServiceFromAnnotation(vault.getState(), () => ({ annotation }), {});
          const imageServiceUrl = imageService.id.endsWith('.info.json')
            ? imageService.id
            : `${imageService.id}/info.json`;
          promises.push(
            new Promise(resolve => {
              vault.load(imageServiceUrl).then(serviceData => {
                const { service, ...resource } = vault.fromRef(annotation.body[0]);
                resolve({
                  id: canvas.id,
                  width: canvas.width,
                  height: canvas.height,
                  layers: ImageService.fromContentResource({
                    ...resource,
                    service: [serviceData],
                  }),
                });
              });
            })
          );
        });
      });
    });

    Promise.all(promises).then(images => {
      const builder = new YogaBuilder();

      builder.setWidth(window.innerWidth);
      builder.setViewingDirection('left-to-right');

      builder.addContent(images);

      builder.recalculate();

      const world = builder.getWorld();

      // Create an initial viewport.
      const viewport = { width: window.innerWidth, height: window.innerHeight, x: 0, y: 0, scale: 1 };

      renderWorld(world, viewport);
    });
  });
