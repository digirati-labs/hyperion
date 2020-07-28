// This is valid under a canvas context.
import { AnnotationNormalized } from '@hyperion-framework/types';
import { useCanvas } from './useCanvas';
import { useVaultSelector } from './useVaultSelector';
import { resolveList } from '@hyperion-framework/store';

export function usePaintingAnnotations(options: { canvasId?: string } = {}): AnnotationNormalized[] {
  const canvas = useCanvas(options.canvasId ? { id: options.canvasId } : undefined);

  return useVaultSelector(
    state => {
      if (!canvas) {
        return [];
      }
      const annotationPages = resolveList(state, canvas.items);
      const flatAnnotations: AnnotationNormalized[] = [];
      for (const page of annotationPages) {
        flatAnnotations.push(...resolveList(state, page.items));
      }
      return flatAnnotations;
    },
    [canvas]
  );
}
