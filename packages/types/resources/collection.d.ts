import { TechnicalProperties } from '../iiif/technical';
import { DescriptiveNormalized, DescriptiveProperties } from '../iiif/descriptive';
import { StructuralNormalized, StructuralProperties } from '../iiif/structural';
import { LinkingNormalized, LinkingProperties } from '../iiif/linking';
import { Manifest } from './manifest';
import { JsonLDContext, OmitProperties, SomeRequired } from '../utility';
import { Reference } from '../reference';

export declare type CollectionItems = Collection | Manifest;

type CollectionOmittedTechnical = 'format' | 'profile' | 'height' | 'width' | 'duration' | 'timeMode';
type CollectionOmittedDescriptive = 'language';
type CollectionOmittedStructural = 'structures';
type CollectionOmittedLinking = 'start' | 'supplementary';

type CollectionTechnical = OmitProperties<TechnicalProperties, CollectionOmittedTechnical>;
type CollectionDescriptive = OmitProperties<DescriptiveProperties, CollectionOmittedDescriptive>;
type CollectionStructural = OmitProperties<StructuralProperties<CollectionItems>, CollectionOmittedStructural>;
type CollectionLinking = OmitProperties<LinkingProperties, CollectionOmittedLinking>;

export interface Collection
  extends SomeRequired<CollectionTechnical, 'id' | 'type'>,
    SomeRequired<CollectionDescriptive, 'label'>,
    SomeRequired<CollectionStructural, 'items'>,
    Partial<CollectionLinking>,
    JsonLDContext {}

export declare type CollectionItemSchemas = 'Collection' | 'Manifest';

export declare type CollectionNormalized = OmitProperties<TechnicalProperties, CollectionOmittedTechnical> &
  OmitProperties<DescriptiveNormalized, CollectionOmittedDescriptive> &
  OmitProperties<
    StructuralNormalized<Reference<CollectionItemSchemas>, CollectionItemSchemas>,
    CollectionOmittedStructural
  > &
  OmitProperties<LinkingNormalized, CollectionOmittedLinking> & { type: 'Collection' };
