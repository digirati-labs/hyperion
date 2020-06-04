import { useState } from 'react';
import { useManifest } from './useManifest';
import { useCanvas } from './useCanvas';
import { useVaultEffect } from './useVaultEffect';
import { ImageCandidate, ImageCandidateRequest } from '@atlas-viewer/iiif-image-api/lib/types';

export function useThumbnail(
  request: ImageCandidateRequest,
  dereference?: boolean,
  { canvasId, manifestId }: { canvasId?: string; manifestId?: string } = {}
) {
  const [thumbnail, setThumbnail] = useState<ImageCandidate | undefined>();
  const manifest = useManifest(manifestId ? { id: manifestId } : undefined);
  const canvas = useCanvas(canvasId ? { id: canvasId } : undefined);
  const subject = canvas ? canvas : manifest;

  if (!subject) throw new Error('Must be called under the context of a manifest or canvas.');

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
