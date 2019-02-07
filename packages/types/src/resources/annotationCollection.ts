import { W3CAnnotationPage } from './annotationPage';
import { OmitProperties, SomeRequired } from '../utility';
import { TechnicalProperties } from '../iiif/technical';
import {DescriptiveNormalized, DescriptiveProperties} from '../iiif/descriptive';
import {LinkingNormalized, LinkingProperties} from '../iiif/linking';
import { Manifest } from './manifest';
import { Collection } from './collection';

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

type Technical = OmitProperties<TechnicalProperties, OmittedTechnical>;
type Descriptive = OmitProperties<DescriptiveProperties, OmittedDescriptive>;
type Linking = OmitProperties<LinkingProperties, OmittedLinking>;

export type W3CAnnotationCollection = {
  '@context'?: string;
  id: string;
  type: 'AnnotationCollection';
  label: string | string[];
  total?: number;
  first?: string | OmitProperties<W3CAnnotationPage, 'partOf'>;
  last?: string;
};

export interface AnnotationCollection
  extends SomeRequired<Technical, 'id'>,
    Partial<Descriptive>,
    Partial<Linking>,
    OmitProperties<W3CAnnotationCollection, 'first' | 'label'> {
  partOf: Array<Collection | Manifest | string>;
}

export interface AnnotationCollectionNormalized
  extends OmitProperties<TechnicalProperties, OmittedTechnical>,
    OmitProperties<DescriptiveNormalized, OmittedDescriptive>,
    OmitProperties<LinkingNormalized, OmittedLinking> {}
