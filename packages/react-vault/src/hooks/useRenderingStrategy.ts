import { IIIFExternalWebResource, SpecificResource } from '@hyperion-framework/types';
import { resolveList } from '@hyperion-framework/store';
import { getImageServices } from '@atlas-viewer/iiif-image-api';

import { useCanvas } from './useCanvas';
import { usePaintingAnnotations } from './usePaintingAnnotations';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useVault } from './useVault';

import { RenderingStrategy } from '../features/rendering-strategy/strategies';
import { ImageWithOptionalService } from '../features/rendering-strategy/resource-types';
import { BoxSelector, SupportedSelectors } from '../features/rendering-strategy/selector-extensions';
import { parseSpecificResource } from '../features/rendering-strategy/rendering-utils';
import { expandTarget } from '../utility/expand-target';
import { useAnnotationPageManager } from './useAnnotationPageManager';
import { useManifest } from './useManifest';
import { useResources } from './useResources';

// @todo we may not have any actions returned from the rendering strategy.
export type StrategyActions = {
  // makeChoice: (choiceId: string) => void;
};

export type UseRenderingStrategy = [RenderingStrategy, StrategyActions];

const emptyActions = {};

const unknownResponse: UseRenderingStrategy = [{ type: 'unknown' }, emptyActions];

const unsupported = (reason: string): UseRenderingStrategy => {
  return [{ type: 'unknown', reason, annotations: { pages: [] } }, emptyActions];
};

export type UseRenderingStrategyOptions = {
  strategies?: Array<RenderingStrategy['type']>;
  annotationPageManagerId?: string;
};

export function useRenderingStrategy(options?: UseRenderingStrategyOptions): UseRenderingStrategy {
  const manifest = useManifest();
  const canvas = useCanvas();
  const paintingAnnotations = usePaintingAnnotations();
  const vault = useVault();
  const didUnmount = useRef(false);
  const { enabledPageIds } = useAnnotationPageManager(options?.annotationPageManagerId || manifest?.id, { all: false });
  const enabledPages = useResources(enabledPageIds, 'AnnotationPage');

  useEffect(() => {
    return () => {
      didUnmount.current = true;
    };
  }, []);

  // console.log('painting annotations', paintingAnnotations);

  const supports = options?.strategies || [
    'single-image',
    'composite-image',
    // 'complex-timeline' not supported yet.
    'media',
  ];
  const [imageServiceStatus, setImageServiceStatus] = useState<Record<string, string>>({});

  const paintables = useMemo(() => {
    const types: string[] = [];
    const items: Array<{
      type: string;
      resource: IIIFExternalWebResource | SpecificResource;
      target: any;
      selector: any;
    }> = [];
    const state = vault.getState();
    for (const annotation of paintingAnnotations) {
      const bodies = resolveList(state, annotation.body);
      for (const unknownBody of bodies) {
        const [body, { selector }] = parseSpecificResource(unknownBody);
        const type = (body.type || 'unknown').toLowerCase();
        if (types.indexOf(type) === -1) {
          types.push(type);
        }

        items.push({
          type: type,
          resource: body as IIIFExternalWebResource,
          target: annotation.target,
          selector,
        });
      }
    }

    return {
      types,
      items,
    };
  }, [vault, paintingAnnotations]);

  const strategy = useMemo(() => {
    if (!canvas) {
      return unknownResponse;
    }

    if (paintables.types.length !== 1) {
      // @todo this is a ComplexTimelineStrategy.
      return unsupported('ComplexTimelineStrategy not yet supported');
    }

    const mainType = paintables.types[0];

    if (mainType === 'image') {
      const imageTypes: ImageWithOptionalService[] = [];
      for (const singleImage of paintables.items) {
        // SingleImageStrategy
        const resource: IIIFExternalWebResource =
          singleImage.resource && singleImage.resource.type === 'SpecificResource'
            ? singleImage.resource.source
            : singleImage.resource;

        // Validation.
        if (!resource.id) {
          // @todo we could skip this?
          return unsupported('No resource Identifier');
        }

        let imageService = null;
        if (resource.service) {
          const loader = vault.getImageService();
          const imageServices = getImageServices(resource) as any[];
          imageService = imageServices[0] as any;
          const imageServiceId = imageService.id || (imageService['@id'] as string);

          // We want to kick this off.
          const syncLoaded = loader.loadServiceSync({
            id: imageServiceId,
            width: imageService.width || canvas.width,
            height: imageService.height || canvas.height,
          });

          if (syncLoaded) {
            imageService = syncLoaded;
          } else if (!imageServiceStatus[imageServiceId]) {
            if (!didUnmount.current) {
              setImageServiceStatus(r => {
                return {
                  ...r,
                  [imageServiceId]: 'loading',
                };
              });
            }
            loader
              .loadService({
                id: imageServiceId,
                width: imageService.width || canvas.width,
                height: imageService.height || canvas.height,
              })
              .then(() => {
                if (!didUnmount.current) {
                  setImageServiceStatus(r => {
                    return {
                      ...r,
                      [imageServiceId]: 'done',
                    };
                  });
                }
              });
          }
        }

        // @todo temporary hacks for data normalisation.
        if (singleImage.target === 'https://bvmm.irht.cnrs.fr/iiif/2309/canvas/canvas-981394#xywh=3949,994,1091,1232') {
          singleImage.target = 'https://bvmm.irht.cnrs.fr/iiif/4490/canvas/canvas-981394#xywh=3949,994,1091,1232';
        }
        if (
          imageService &&
          imageService.profile === 'http://library.stanford.edu/iiif/image-api/1.1/compliance.html#level2'
        ) {
          // hack.
          imageService.profile = 'http://iiif.io/api/image/2/level2.json';
          imageService.sizes = [{ width: imageService.width, height: imageService.height }];
          imageService.tiles = [{ width: 256, height: 256, scaleFactors: [1, 2, 4, 8, 16, 32] }];
        }

        const { selector: imageTarget, source } = expandTarget(singleImage.target);

        if (source.id !== canvas.id) {
          // Skip invalid targets.
          continue;
        }

        // Target is where it should be painted.
        const defaultTarget: BoxSelector = {
          type: 'BoxSelector',
          x: 0,
          y: 0,
          width: canvas.width,
          height: canvas.height,
        };

        const target: SupportedSelectors | null = imageTarget
          ? imageTarget.type === 'TemporalSelector'
            ? {
                type: 'TemporalBoxSelector',
                startTime: imageTarget.startTime,
                endTime: imageTarget.endTime,
                x: defaultTarget.x,
                y: defaultTarget.y,
                width: defaultTarget.width,
                height: defaultTarget.height,
              }
            : imageTarget
          : null;

        // Support for cropping before painting an annotation.
        const defaultImageSelector = {
          type: 'BoxSelector',
          x: 0,
          y: 0,
          width: canvas.width,
          height: canvas.height,
        } as BoxSelector;
        const imageSelector =
          singleImage.resource.type === 'SpecificResource' ? expandTarget(singleImage.resource) : null;
        const selector: BoxSelector =
          imageSelector &&
          imageSelector.selector &&
          (imageSelector.selector.type === 'BoxSelector' || imageSelector.selector.type === 'TemporalBoxSelector')
            ? {
                type: 'BoxSelector',
                x: imageSelector.selector.x,
                y: imageSelector.selector.y,
                width: imageSelector.selector.width,
                height: imageSelector.selector.height,
              }
            : defaultImageSelector;

        const imageType: ImageWithOptionalService = {
          id: resource.id,
          type: 'Image',
          width: target ? resource.width : canvas.width,
          height: target ? resource.height : canvas.height,
          service: imageService,
          sizes:
            imageService && imageService.sizes
              ? imageService.sizes
              : [{ width: resource.width, height: resource.height }],
          target: target ? target : defaultTarget,
          selector,
        };

        imageTypes.push(imageType);
      }

      return [
        {
          type: 'images',
          image: imageTypes[0],
          images: imageTypes,
        },
        emptyActions,
      ];
    }

    if (mainType === 'audio') {
      // Media Strategy with audio or audio sequence.
      return unsupported('Audio strategy not yet supported');
    }

    if (mainType === 'video') {
      // Media Strategy with video or video sequence.
      return unsupported('Video strategy not yet supported');
    }

    // Unknown fallback.
    return unknownResponse;
  }, [canvas, imageServiceStatus, paintables, vault]);

  return useMemo(() => {
    return [
      {
        ...strategy[0],
        annotations: { pages: enabledPages },
      } as any,
      strategy[1],
    ];
  }, [strategy, enabledPages]);
}
