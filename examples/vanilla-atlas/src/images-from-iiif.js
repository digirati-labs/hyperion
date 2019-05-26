import { ImageService } from '@hyperion-framework/atlas';
import { getImageServiceFromAnnotation } from '@hyperion-framework/vault';
import { imageServiceLoader } from '@hyperion-framework/atlas/lib/image-api/image-service-loader';

export function imagesFromIIIF(vault, url) {
  return vault
    .loadManifest(url)
    .catch(() => {
      if (location.hash) {
        location.hash = '';
        location.reload();
      }
    })
    .then(async manifestJson => {
      let promises = [];
      const canvases = manifestJson.items.length;

      for (let c = 0; c < canvases; c++) {
        const canvas = vault.fromRef(manifestJson.items[c]);
        const pageLength = canvas.items.length;
        for (let k = 0; k < pageLength; k++) {
          const annotationPage = vault.fromRef(canvas.items[k]);
          const annotations = annotationPage.items.length;
          for (let a = 0; a < annotations; a++) {
            const annotation = vault.fromRef(annotationPage.items[a]);
            const imageService = getImageServiceFromAnnotation(vault.getState(), () => ({ annotation }), {});
            const service = await imageServiceLoader.loadService({
              id: imageService.id,
              width: canvas.width,
              height: canvas.height,
            });

            promises.push({
              id: canvas.id,
              width: canvas.width,
              height: canvas.height,
              layers: ImageService.fromContentResource({
                id: service.id,
                type: 'Image',
                width: canvas.width,
                height: canvas.height,
                service: [service],
              }),
            });
          }
        }
      }

      return promises;
    });
}
