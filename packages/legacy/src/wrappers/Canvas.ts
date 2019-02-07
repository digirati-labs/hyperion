import {
  AnnotationPage,
  Canvas,
  ContentResource,
  InternationalString,
  Manifest,
  MetadataItem,
  ResourceType,
  Service,
  ViewingDirection,
} from '@hyperion-framework/types';

class CanvasWrapper implements Canvas {
  behaviour: string[] = [];
  homepage: ContentResource[] = [];
  id: string;
  logo: ContentResource[] = [];
  motivation: string = '';
  partOf: Manifest[] = [];
  rendering: ContentResource[] = [];
  seeAlso: ContentResource[] = [];
  service: Service[] = [];
  start: Canvas[] = [];
  readonly type: ResourceType = 'Canvas';
  viewingDirection: ViewingDirection = 'left-to-right';
  label: InternationalString;
  items: AnnotationPage[] = [];
  duration: number = 0;
  height: number;
  metadata: MetadataItem[] = [];
  navDate: string | null = null;
  posterCanvas: any;
  requiredStatement: MetadataItem | null = null;
  rights: string | null = null;
  summary: InternationalString | null = null;
  thumbnail: any;
  width: number;

  constructor(id: string, label: InternationalString, width: number, height: number) {
    this.id = id;
    this.label = label;
    this.width = width;
    this.height = height;
  }
}

export default CanvasWrapper;
