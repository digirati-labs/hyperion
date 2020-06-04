import { useResourceContext } from '../context/ResourceContext';
import { AnnotationNormalized } from '@hyperion-framework/types';
import { useVault } from './useVault';
import { useMemo } from 'react';

export function useAnnotation(options?: { id: string }): AnnotationNormalized | undefined;
export function useAnnotation<T>(
  options?: { id: string; selector: (annotation: AnnotationNormalized) => T },
  deps?: any[]
): T | undefined;
export function useAnnotation<T = AnnotationNormalized>(
  options: {
    id?: string;
    selector?: (annotation: AnnotationNormalized) => T;
  } = {},
  deps: any[] = []
): AnnotationNormalized | T | undefined {
  const { id, selector } = options;
  const ctx = useResourceContext();
  const vault = useVault();
  const annotationId = id ? id : ctx.annotation;

  const annotation = annotationId ? vault.select(s => s.hyperion.entities.Annotation[annotationId]) : undefined;

  return useMemo(
    () => {
      if (!annotation) {
        return undefined;
      }
      if (selector) {
        return selector(annotation);
      }
      return annotation;
    },
    [annotation, selector, ...deps]
  );
}
