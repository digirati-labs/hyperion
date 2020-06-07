import { AnnotationCollection, W3CAnnotationCollection } from './annotationCollection';
import { OmitProperties, SomeRequired } from '../utility';
import { Annotation } from './annotation';
import { TechnicalProperties } from '../iiif/technical';
import { DescriptiveNormalized, DescriptiveProperties } from '../iiif/descriptive';
import { LinkingNormalized, LinkingProperties } from '../iiif/linking';
import { StructuralNormalized, StructuralProperties } from '../iiif/structural';
import { Reference } from '../reference';

type AnnotationPageOmittedTechnical =
  | 'type'
  | 'format'
  | 'profile'
  | 'height'
  | 'width'
  | 'duration'
  | 'viewingDirection'
  | 'timeMode';
type AnnotationPageOmittedDescriptive =
  | 'posterCanvas'
  | 'accompanyingCanvas'
  | 'placeholderCanvas'
  | 'navDate'
  | 'language';
type AnnotationPageOmittedLinking = 'services' | 'partOf' | 'start' | 'supplementary';
type AnnotationPageOmittedStructural = 'annotations' | 'structures';

type AnnotationPageTechnical = OmitProperties<TechnicalProperties, AnnotationPageOmittedTechnical>;
type AnnotationPageDescriptive = OmitProperties<DescriptiveProperties, AnnotationPageOmittedDescriptive>;
type AnnotationPageLinking = OmitProperties<LinkingProperties, AnnotationPageOmittedLinking>;
type AnnotationPageStructural = OmitProperties<StructuralProperties<Annotation>, AnnotationPageOmittedStructural>;

export declare type W3CAnnotationPage = {
  '@context'?: string;
  type: 'AnnotationPage';
  partOf?: SomeRequired<W3CAnnotationCollection, 'id'> | string;
  items?: Annotation[];
  next?: string;
  prev?: string;
  startIndex?: number;
};

export interface AnnotationPage
  extends SomeRequired<AnnotationPageTechnical, 'id'>,
    Partial<AnnotationPageDescriptive>,
    Partial<AnnotationPageLinking>,
    Partial<AnnotationPageStructural>,
    SomeRequired<OmitProperties<W3CAnnotationPage, 'partOf' | 'items'>, 'type'> {
  partOf?: Array<SomeRequired<AnnotationCollection, 'id'>>;
}

type AnnotationPageItemSchemas = 'Annotation';

export declare type AnnotationPageNormalized = OmitProperties<TechnicalProperties, AnnotationPageOmittedTechnical> &
  OmitProperties<DescriptiveNormalized, AnnotationPageOmittedDescriptive> &
  OmitProperties<
    StructuralNormalized<Reference<AnnotationPageItemSchemas>, AnnotationPageItemSchemas>,
    AnnotationPageOmittedStructural
  > &
  OmitProperties<LinkingNormalized, AnnotationPageOmittedLinking> & { type: 'AnnotationPage' };
