export declare type ResourceType =
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

export declare type ViewingDirection = 'left-to-right' | 'right-to-left' | 'top-to-bottom' | 'bottom-to-top';

export declare type Specificationbehaviors =
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

export declare type SpecificationTimeMode = 'trim' | 'scale' | 'loop';

export declare type TechnicalProperties = {
  id: string;
  type: ResourceType;
  format: string;
  profile: string;
  height: number;
  width: number;
  duration: number;
  viewingDirection: ViewingDirection;
  behavior: Specificationbehaviors[] | string[];
  timeMode: SpecificationTimeMode | string | null;
  motivation: string | null;
};
