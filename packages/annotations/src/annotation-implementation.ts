import { AnnotationW3C, ImageService, InternationalString } from '@hyperion-framework/types';

type ImplementationFunction<Return, Body = any, Selector = never> = (
  resource: Body,
  selector: Selector,
  originalAnnotation: AnnotationW3C
) => Return;

type BaseData = {
  label?: InternationalString;
  language?: string | string[];
  motivation?: string | string[];
  profile?: string | string[];
};

type ChoiceData = BaseData & { choices: any[]; renderDefaultChoice: () => void };
type ImageData = BaseData & { id: string; width?: number; height?: number; service?: ImageService };
type AudioData = BaseData & { uri: string; format?: string; duration: number };
type VideoData = BaseData & { uri: string; width?: number; height?: number; format?: string; duration: number };
type HighlightData = BaseData & {
  // Geo-JSON?
  properties?: { label?: InternationalString };
}; // Unknown.
type CommentData = BaseData & { format: string; value: string };
type TextData = BaseData & { format: string; value: string };
type Dataset = BaseData & { uri: string; format: string };

type RectSelector = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type TemporalSelector = {
  from: number;
  to: number;
};

// Ocean liners example:
// {
//   "id": "https://iiif.vam.ac.uk/collections/O1023003/annopage/p1/a3",
//   "type": "Annotation",
//   "motivation": "describing",
//   "body": {
//     "type": "TextualBody",
//     "value": "<h2 class=\"annotatedzoom-annotation-detail__label\">First-class restaurant</h2><div class=\"annotatedzoom-annotation-detail__content\"><img class=\"annotatedzoom-annotation-detail__image\" src=\"https://media.vam.ac.uk/feature/annotatedzoom/O1023003/2017KE6204-Aquitania-restaurant-cropped.jpg\" width=300 height=250/><p>Dining on ocean liners was a radically different experience depending on the class of travel. In first class, the <i>Aquitania</i>&#39;s Louis XVI-style dining room offered seating in small isolated groups, echoing elegant restaurants on land. The ship&#39;s architect, Arthur Davis, explained that a &ldquo;cheerful room with comfortable surroundings&rdquo; was a necessary distraction from &ldquo;the often very unpleasant conditions&rdquo; at sea. </p><p class=\"annotatedzoom-annotation-detail__credit\">Photograph from <em>The New Art of Going Abroad</em>, 1929, US. National Art Library: 38041986015030. &copy; Victoria and Albert Museum, London</p></div>",
//     "format": "text/html"
//   },
//   "target": {
//     "id": "https://iiif.vam.ac.uk/collections/O1023003/canvas/c0#xywh=2000,2800,400,400",
//     "type": "Canvas"
//   }
// }
//
// For example:
//
// annotationImplementation({
//   TextData: (body, target) => {
//     renderHTML(body.value);
//     highlightXYWH(target);
//   }
// })

type AnnotationImplementation<T = any | void> = {
  Choice?: ImplementationFunction<T, ChoiceData>;
  Image?:
    | ImplementationFunction<T, ImageData, undefined | Partial<RectSelector | TemporalSelector>>
    | {
        Whole?: ImplementationFunction<T, ImageData>;
        Rect?: ImplementationFunction<T, ImageData, RectSelector>;
        TimeFragment?: ImplementationFunction<T, ImageData, TemporalSelector>;
      };
  Audio?:
    | ImplementationFunction<T, AudioData, undefined | Partial<TemporalSelector & RectSelector>>
    | {
        Whole?: ImplementationFunction<T, AudioData>;
        TimeFragment?: ImplementationFunction<T, AudioData, TemporalSelector>;
      };
  Video?:
    | ImplementationFunction<T, VideoData, undefined | Partial<TemporalSelector & RectSelector>>
    | {
        Whole?: ImplementationFunction<T, VideoData>;
        TimeFragment?: ImplementationFunction<T, VideoData, TemporalSelector>;
        Rect?: ImplementationFunction<T, VideoData, TemporalSelector & RectSelector>;
        RectTimeFragment?: ImplementationFunction<T, VideoData, TemporalSelector & RectSelector>;
      };
  // Highlight?: {
  //   Rect?: (bounds: any) => T;
  //   Polygon?: (points: any) => T;
  //   SVG?: (data: { position: any; svg: any }) => T;
  // };
  // Comment?: {
  //   Point?: (comment: string, selector: { x: number; y: number }) => T;
  //   Rect?: (comment: string, bounds: any) => T;
  //   Polygon?: (comment: string, points: any) => T;
  //   SVG?: (comment: string, { position, svg }: any) => T;
  // };
  // Text?: {
  //   Rect?: (text: string, bounds: any) => T;
  // };
};

type SupportedSelectors = 'Point' | 'Rect' | 'Polygon' | 'SVG' | 'Whole' | 'TimeFragment';

export function annotationImplementation<T>(
  options: AnnotationImplementation<T>
): (annotation: AnnotationW3C) => () => T[] {
  return (annotation: AnnotationW3C) => {
    return () => {
      const returns: T[] = [];

      const bodies = Array.isArray(annotation.body) ? annotation.body : [annotation.body];
      const motiviations = Array.isArray(annotation.motivation) ? annotation.motivation : [annotation.motivation];

      const isComment = motiviations.indexOf('commenting') !== -1;
      const isHighlight = motiviations.indexOf('highlighting') !== -1;
      const isTagging = motiviations.indexOf('tagging') !== -1;

      for (const body of bodies) {
        if (!body) {
          // No body, nothing to do.
          continue;
        }

        if (typeof body === 'string') {
          // String body, no idea.
          continue;
        }

        if (isComment && body.type !== 'TextualBody') {
          // No supported, comments must be text.
          continue;
        }

        const id = body.id;
        const type = body.type;
        const target = annotation.target;

        switch (body.type) {
          case 'Image': {
            if (!id) {
              // Invalid image.
              break;
            }

            const impl = options.Image;
            if (typeof impl === 'function') {
              // We only have a single.
              returns.push(impl(body as any, undefined /* Todo selector */, annotation));
            }

            throw new Error('Individual selectors not supported');
            break;
          }
          case 'Video': {
            if (!id) {
              // Invalid video.
              break;
            }

            const impl = options.Video;
            if (typeof impl === 'function' && body.id) {
              // We only have a single.
              returns.push(impl(body as any, undefined /* Todo selector */, annotation));
            }

            throw new Error('Individual selectors not supported');
            break;
          }
          case 'Sound': {
            if (!id) {
              // Invalid audio.
              break;
            }

            const impl = options.Audio;
            if (typeof impl === 'function' && body.id) {
              // We only have a single.
              returns.push(impl(body as any, undefined /* Todo selector */, annotation));
            }
            break;
          }
          case 'SpecificResource': {
            throw new Error('SpecificResource not supported');
            break;
          }
          case 'Text': {
            throw new Error('Individual selectors not supported');
            break;
          }
          case 'Choice': {
            throw new Error('Individual selectors not supported');
            break;
          }
          case 'Dataset': {
            throw new Error('Individual selectors not supported');
            break;
          }
          case 'TextualBody': {
            throw new Error('Individual selectors not supported');
            break;
          }
          default: {
            // unknown body.
            break;
          }
        }
      }

      // Loop through the bodies.
      // ..

      return returns;
    };
  };
}
