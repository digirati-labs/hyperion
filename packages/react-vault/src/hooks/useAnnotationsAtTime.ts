// This works under a canvas context
// The canvas must have a duration
// When given a timestamp (ms) from the canvas clock will return a list of annotations
// that need to be painted.
import { AnnotationNormalized } from '@hyperion-framework/types';
import { usePaintingAnnotations } from './usePaintingAnnotations';

export function useAnnotationsAtTime(time: number, options: { canvasId?: string } = {}): AnnotationNormalized[] {
  const allAnnotations = usePaintingAnnotations(options);

  // @todo filter.

  return allAnnotations;
}
