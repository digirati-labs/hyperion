import { AnnotationBody, ChoiceBody, ContentResource, SpecificResource } from '@hyperion-framework/types';

export interface AnnotationBodyPattern<T> {
  String?: (s: string) => T;
  ChoiceBody?: (c: ChoiceBody) => T;
  ContentResource?: (w: ContentResource) => T;
  SpecificResource?: (s: SpecificResource) => T;
  OtherContentResource?: (o: ContentResource) => T;
}

export function matchAnnotationBody<T>(p: AnnotationBodyPattern<T>): (a?: AnnotationBody | AnnotationBody[]) => T[] {
  return (a?: AnnotationBody | AnnotationBody[]): T[] => {
    if (typeof a === 'undefined' || a === null) {
      return [];
    }
    if (typeof a === 'string') {
      return p.String ? [p.String(a as string)] : [];
    }

    const items: AnnotationBody[] = Array.isArray(a) ? a : [a];

    return items
      .map(item => {
        if (typeof item === 'string') {
          return p.String ? p.String(item as string) : null;
        }

        if (item.type === 'Choice') {
          return p.ChoiceBody ? p.ChoiceBody(item as ChoiceBody) : null;
        }

        if (item.type === 'SpecificResource') {
          return p.SpecificResource ? p.SpecificResource(item as SpecificResource) : null;
        }

        if (['Dataset', 'Image', 'Video', 'Sound', 'Text']) {
          return p.ContentResource ? p.ContentResource(item as ContentResource) : null;
        }

        return p.OtherContentResource ? p.OtherContentResource(item as ContentResource) : null;
      })
      .reduce((acc: T[], next: unknown): T[] => {
        if (next !== null) {
          acc.push(next as T);
        }
        return acc;
      }, []);
  };
}
