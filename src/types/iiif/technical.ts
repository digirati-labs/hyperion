export type ResourceType =
  | 'Collection'
  | 'Manifest'
  | 'Canvas'
  | 'Annotation'
  | 'AnnotationPage'
  | 'AnnotationCollection'
  | 'Range'
  | 'ContentResource'
  | 'Choice'
  | 'CanvasReference'
  | 'Service';

export type ViewingDirection = 'left-to-right' | 'right-to-left' | 'top-to-bottom' | 'bottom-to-top';

export type SpecificationBehaviours =
  | 'auto-advance'
  | 'continuous'
  | 'facing-pages'
  | 'individuals'
  | 'multi-part'
  | 'no-nav'
  | 'non-paged'
  | 'hidden'
  | 'paged'
  | 'repeat'
  | 'sequence'
  | 'thumbnail-nav'
  | 'together'
  | 'unordered';

export type SpecificationTimeMode = 'trim' | 'scale' | 'loop';

export type TechnicalProperties = {
  id: string;
  type: ResourceType;
  format: string;
  profile: string;
  height: number;
  width: number;
  duration: number;
  viewingDirection: ViewingDirection;
  behaviour: SpecificationBehaviours[] | string[];
  timeMode: SpecificationTimeMode | string;
  motivation: string;
};
