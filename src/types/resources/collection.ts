import {TechnicalProperties} from '../iiif/technical';
import {DescriptiveNormalized, DescriptiveProperties} from '../iiif/descriptive';
import {StructuralNormalized, StructuralProperties} from '../iiif/structural';
import {LinkingNormalized, LinkingProperties} from '../iiif/linking';
import {Manifest} from './manifest';
import {OmitProperties, SomeRequired} from '../utility';
import {Reference} from '../reference';

export type CollectionItems = Collection | Manifest;

type OmittedTechnical = 'format' | 'profile' | 'height' | 'width' | 'duration' | 'timeMode';
type OmittedDescriptive  = 'language';
type OmittedStructural  = 'structures';
type OmittedLinking  = 'start' | 'supplementary';

type Technical = OmitProperties<TechnicalProperties, OmittedTechnical>;
type Descriptive = OmitProperties<DescriptiveProperties, OmittedDescriptive>;
type Structural = OmitProperties<StructuralProperties<CollectionItems>, OmittedStructural>;
type Linking = OmitProperties<LinkingProperties, OmittedLinking>;

export interface Collection extends
    SomeRequired<Technical, 'id' | 'type'>,
    SomeRequired<Descriptive, 'label'>,
    SomeRequired<Structural, 'items'>,
    Partial<Linking> {
}

export type ItemSchemas = 'collection' | 'manifest';

export interface CollectionNormalized extends
    OmitProperties<TechnicalProperties, OmittedTechnical>,
    OmitProperties<DescriptiveNormalized, OmittedDescriptive>,
    OmitProperties<StructuralNormalized<Reference<ItemSchemas>, ItemSchemas>, OmittedStructural>,
    OmitProperties<LinkingNormalized, OmittedLinking> {

}
