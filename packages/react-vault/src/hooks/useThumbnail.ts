// A full implementation of getting the correct thumbnail.
// Some of this logic should be moved to main Hyperion package
// Should work under:
// - Collections
// - Manifests
// - Canvas
// - Annotation
//
// It will take in a preferred size, with a sensible default.
// It will also take a maximum external resource, that will state how many resources down the chain its allowed to
// go to fetch a thumbnail. By default it would be 1 on canvas, 2 on manifest, 3 on collection.
// This will be, in React, the definitive way to get a thumbnail for the current resource.
// Possibly in the future an image service could be used to build up an image using tiles onto an HTML5 canvas
// and then a data-uri provided for the thumbnail, again increasing the likely-hood of a thumbnail.
import { useVault } from './useVault';
import { useContext } from 'react';
import {
  CtxFunction,
  defaultThumbnailSizeConfig,
  getCanvasThumbnailAtSize,
  getManifestThumbnailAtSize,
  thumbnailSizeConfig,
  VaultState,
} from '@hyperion-framework/vault';
import { CanvasNormalized, ManifestNormalized } from '@hyperion-framework/types';
import {ReactContext} from "../context/Context";

type ValidThumbnailContext<S extends VaultState> = CtxFunction<
  S,
  {
    thumbnailSize?: thumbnailSizeConfig;
    manifest?: ManifestNormalized;
    canvas?: CanvasNormalized;
    // @todo annotation
    // @todo collection
  }
>;

export function useThumbnail(config?: Partial<thumbnailSizeConfig>) {
  const context = useContext(ReactContext) as ValidThumbnailContext<VaultState>;
  const vault = useVault();
  const state = vault.getState() as VaultState;
  const rawCtx = context(state, {});
  const ctx = config
    ? {
        ...context(state, {}),
        thumbnailSize: {
          ...defaultThumbnailSizeConfig,
          ...(rawCtx.thumbnailSize || {}),
          ...config,
        },
      }
    : rawCtx;

  const thumbnailSize = ctx.thumbnailSize || defaultThumbnailSizeConfig;

  if (thumbnailSize!.virtualThumbnailFromImageService || thumbnailSize!.atAnyCost) {
    //@todo Check if image service is loaded, if not load it up!
  }

  if (thumbnailSize!.atAnyCost) {
    // @todo more overkill thumbnail methods.
  }


  if (ctx.canvas && ctx.manifest) {
    return getCanvasThumbnailAtSize(
      state,
      (() => ctx) as CtxFunction<
        VaultState,
        {
          thumbnailSize: thumbnailSizeConfig;
          canvas: CanvasNormalized;
          manifest: ManifestNormalized;
        }
      >,
      {}
    );
  }

  if (ctx.canvas) {
    return getCanvasThumbnailAtSize(
      state,
      (() => ctx) as CtxFunction<
        VaultState,
        {
          thumbnailSize: thumbnailSizeConfig;
          canvas: CanvasNormalized;
        }
      >,
      {}
    );
  }

  if (ctx.manifest) {
    return getManifestThumbnailAtSize(
      state,
      (() => ctx) as CtxFunction<
        VaultState,
        {
          thumbnailSize: thumbnailSizeConfig;
          manifest: ManifestNormalized;
        }
      >,
      {}
    );
  }

  return null;
}
