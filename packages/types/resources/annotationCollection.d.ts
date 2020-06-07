import { W3CAnnotationPage } from './annotationPage';
import { OmitProperties, SomeRequired } from '../utility';
import { TechnicalProperties } from '../iiif/technical';
import { DescriptiveNormalized, DescriptiveProperties } from '../iiif/descriptive';
import { LinkingNormalized, LinkingProperties } from '../iiif/linking';
import { Manifest } from './manifest';
import { Collection } from './collection';

type AnnotationCollectionOmittedTechnical =
  | 'type'
  | 'format'
  | 'profile'
  | 'height'
  | 'width'
  | 'duration'
  | 'viewingDirection'
  | 'timeMode';
type AnnotationCollectionOmittedDescriptive =
  | 'posterCanvas'
  | 'accompanyingCanvas'
  | 'placeholderCanvas'
  | 'navDate'
  | 'language';
type AnnotationCollectionOmittedLinking = 'services' | 'partOf' | 'start' | 'supplementary';

type AnnotationCollectionTechnical = OmitProperties<TechnicalProperties, AnnotationCollectionOmittedTechnical>;
type AnnotationCollectionDescriptive = OmitProperties<DescriptiveProperties, AnnotationCollectionOmittedDescriptive>;
type AnnotationCollectionLinking = OmitProperties<LinkingProperties, AnnotationCollectionOmittedLinking>;

export declare type W3CAnnotationCollection = {
  '@context'?: string;
  id: string;
  type: 'AnnotationCollection';
  label: string | string[];
  total?: number;
  first?: string | OmitProperties<W3CAnnotationPage, 'partOf'>;
  last?: string | OmitProperties<W3CAnnotationPage, 'partOf'>;
};

export interface AnnotationCollection
  extends SomeRequired<AnnotationCollectionTechnical, 'id'>,
    Partial<AnnotationCollectionDescriptive>,
    Partial<AnnotationCollectionLinking>,
    OmitProperties<W3CAnnotationCollection, 'label'> {
  partOf: Array<Collection | Manifest | string>;
}

export interface AnnotationCollectionNormalized
  extends OmitProperties<TechnicalProperties, AnnotationCollectionOmittedTechnical>,
    OmitProperties<DescriptiveNormalized, AnnotationCollectionOmittedDescriptive>,
    OmitProperties<LinkingNormalized, AnnotationCollectionOmittedLinking> {}
