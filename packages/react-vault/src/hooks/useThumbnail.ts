import { useState } from 'react';
import { useManifest } from './useManifest';
import { useCanvas } from './useCanvas';
import { useVaultEffect } from './useVaultEffect';
import { ImageCandidate, ImageCandidateRequest } from '@atlas-viewer/iiif-image-api/lib/types';

export function useThumbnail(request: ImageCandidateRequest, dereference?: boolean) {
  const [thumbnail, setThumbnail] = useState<ImageCandidate | undefined>();
  const manifest = useManifest();
  const canvas = useCanvas();
  const subject = canvas ? canvas : manifest;

  useVaultEffect(
    v => {
      v.getThumbnail(subject, request, dereference).then(thumb => {
        if (thumb.best) {
          setThumbnail(thumb.best);
        }
      });
    },
    [subject]
  );

  return thumbnail;
}
