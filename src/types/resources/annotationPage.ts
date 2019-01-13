import { AnnotationCollection, W3CAnnotationCollection } from './annotationCollection';
import { OmitProperties, SomeRequired } from '../utility';
import { Annotation } from './annotation';
import { TechnicalProperties } from '../iiif/technical';
import { DescriptiveProperties } from '../iiif/descriptive';
import { LinkingProperties } from '../iiif/linking';
import { StructuralProperties } from '../iiif/structural';

type OmittedTechnical =
  | 'type'
  | 'format'
  | 'profile'
  | 'height'
  | 'width'
  | 'duration'
  | 'viewingDirection'
  | 'timeMode';
type OmittedDescriptive = 'posterCanvas' | 'navDate' | 'language';
type OmittedLinking = 'partOf' | 'start' | 'supplementary';
type OmittedStructural = 'annotations' | 'structures';

type Technical = OmitProperties<TechnicalProperties, OmittedTechnical>;
type Descriptive = OmitProperties<DescriptiveProperties, OmittedDescriptive>;
type Linking = OmitProperties<LinkingProperties, OmittedLinking>;
type Structural = OmitProperties<StructuralProperties<Annotation>, OmittedStructural>;

export type W3CAnnotationPage = {
  '@context'?: string;
  type: 'AnnotationPage';
  partOf?: SomeRequired<W3CAnnotationCollection, 'id'> | string;
  items?: Annotation[];
  next?: string;
  prev?: string;
  startIndex?: number;
};

export interface AnnotationPage
  extends SomeRequired<Technical, 'id'>,
    Partial<Descriptive>,
    Partial<Linking>,
    Partial<Structural>,
    SomeRequired<OmitProperties<W3CAnnotationPage, 'partOf' | 'items'>, 'type'> {
  partOf?: Array<SomeRequired<AnnotationCollection, 'id'>>;
}
