import { useImageService } from './useImageService';
import { useCanvas } from './useCanvas';
import { useEffect, useState } from 'react';
import { ImageService, PaintableTileSource, World } from '@hyperion-framework/vault';

export const useImageMatrix = () => {
  const [world, setWorld] = useState<World>();
  const imageService = useImageService();
  const canvas = useCanvas();


  useEffect(
    () => {
      if (imageService && canvas) {
        const world = World.fromResources([
          { ...canvas, layers: PaintableTileSource.fromImageService(imageService as ImageService, canvas) },
        ]);
        setWorld(world);
      }

      return () => { setWorld(undefined); }
    },
    [canvas, imageService]
  );

  return world;
};
