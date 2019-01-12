type ResourceType =
    'Collection' |
    'Manifest' |
    'Canvas' |
    'Annotation' |
    'AnnotationPage' |
    'AnnotationCollection' |
    'Range' |
    'ContentResource' |
    'Choice' |
    'CanvasReference' |
    'Service';

export enum ViewingDirection {
    LeftToRight = 'left-to-right',
    RightToLeft = 'right-to-left',
    TopToBottom = 'top-to-bottom',
    BottomToTop = 'bottom-to-top',
}

export enum SpecificationBehaviours {
    AutoAdvance = 'auto-advance',
    Continuous = 'continuous',
    FacingPages = 'facing-pages',
    Individuals = 'individuals',
    MultiPart = 'multi-part',
    NoNav = 'no-nav',
    NonPaged = 'non-paged',
    Hidden = 'hidden',
    Paged = 'paged',
    Repeat = 'repeat',
    Sequence = 'sequence',
    ThumbnailNav = 'thumbnail-nav',
    Together = 'together',
    Unordered = 'unordered',
}

export enum SpecificationTimeMode {
    Trim = 'trim',
    Scale = 'scale',
    Loop = 'loop',
}

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
