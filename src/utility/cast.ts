import { Collection, Manifest } from '..';
import { Canvas } from '../types/resources/canvas';
import { AnnotationPage } from '../types/resources/annotationPage';
import { Annotation } from '../types/resources/annotation';

export function castTo<T>(jsonLd: unknown): T {
  return jsonLd as T;
}

export const cast = {
  toManifest: (jsonLd: unknown) => castTo<Manifest>(jsonLd),
  toCollection: (jsonLd: unknown) => castTo<Collection>(jsonLd),
  toCanvas: (jsonLd: unknown) => castTo<Canvas>(jsonLd),
  toAnnotationPage: (jsonLd: unknown) => castTo<AnnotationPage>(jsonLd),
  toAnnotation: (jsonLd: unknown) => castTo<Annotation>(jsonLd),
};
