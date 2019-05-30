import { ImageService } from '@hyperion-framework/atlas';
import { getImageServiceFromAnnotation, getThumbnailAtSize } from "@hyperion-framework/vault";
import { imageServiceLoader } from '@hyperion-framework/atlas/lib/image-api/image-service-loader';
import { CompositeResource } from "@hyperion-framework/atlas";
import { fromImageService } from "@hyperion-framework/atlas/lib/factory/image-service";
import { SingleImage } from "@hyperion-framework/atlas/lib/spacial-content/single-image";

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
            const thumbnail = getThumbnailAtSize(vault.getState(), () => ({ canvas, thumbnailSize: {} }), {});
            console.log(thumbnail);

            if (!thumbnail) {
              promises.push({
                id: imageService.id,
                width: canvas.width,
                height: canvas.height,
                layers: [
                  new CompositeResource({
                    id: imageService.id,
                    width: canvas.width,
                    height: canvas.height,
                    images: await imageServiceLoader.loadService({
                      id: imageService.id,
                      width: canvas.width,
                      height: canvas.height,
                    }).then(service => [fromImageService(service)]),
                  })
                ],
              })
            } else {
              promises.push({
                id: imageService.id,
                width: canvas.width,
                height: canvas.height,
                layers: [
                  new CompositeResource({
                    id: imageService.id,
                    width: canvas.width,
                    height: canvas.height,
                    loadFullImages: () => imageServiceLoader.loadService({
                      id: imageService.id,
                      width: canvas.width,
                      height: canvas.height,
                    }).then(service => [fromImageService(service)]),
                    images: [
                      SingleImage.fromImage(
                        thumbnail.uri,
                        { width: canvas.width, height: canvas.height },
                        { width: thumbnail.actualWidth, height: thumbnail.actualHeight },
                        imageService.id
                      ),
                    ],
                  })
                ],
              });
            }
          }
        }
      }

      return promises;
    });
}
