// This is valid under a canvas context.

import {useContext, useState} from 'react';
import {ReactContext, useVaultEffect} from '..';
import { CtxFunction, VaultState } from '@hyperion-framework/vault';
import { AnnotationNormalized, CanvasNormalized, Service } from '@hyperion-framework/types';
import { getImageService, getImageServiceFromAnnotation } from '@hyperion-framework/vault';

export const useImageService = (): Service | null => {
  const context = useContext(ReactContext) as CtxFunction<
    VaultState,
    {},
    { canvas?: CanvasNormalized; annotation: AnnotationNormalized } & { [key: string]: any }
  >;
  const [currentImageService, setCurrentImageService] = useState();
  const [isFullyLoaded, setIsFullLoaded] = useState<boolean>(false);

  // @todo new context effect hook.
  useVaultEffect(vault => {
    const state = vault.getState();
    const ctx = context(state, {});
    const imageService = ctx.annotation
      ? getImageServiceFromAnnotation(
        state,
        () => ctx as { annotation: AnnotationNormalized; } & { [key: string]: any; },
        {}
      )
      : getImageService(
        state,
        () => ctx as { canvas: CanvasNormalized; annotation?: AnnotationNormalized; } & { [key: string]: any; },
        {}
      );

    if (imageService && !isFullyLoaded) {
      setCurrentImageService(imageService);
      if (!state.hyperion.requests[imageService.id]) {
        const imageServiceUrl = imageService.id.endsWith('.info.json') ? imageService.id : `${imageService.id}/info.json`;
        vault.load(imageServiceUrl).then(() => {
          setIsFullLoaded(true);
        });
      } else {
        setIsFullLoaded(true);
      }
    }

    if (imageService !== currentImageService) {
      setCurrentImageService(imageService);
    }

  }, [context, isFullyLoaded]);

  return currentImageService;
};
