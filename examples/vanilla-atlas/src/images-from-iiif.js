import { ImageService } from '@hyperion-framework/atlas';
import { getImageServiceFromAnnotation } from '@hyperion-framework/vault';

export function imagesFromIIIF(vault, url) {
  return vault
    .loadManifest(url)
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

      return Promise.all(promises);
    });
}
