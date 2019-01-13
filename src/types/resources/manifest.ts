import { TechnicalProperties } from '../iiif/technical';
import { DescriptiveNormalized, DescriptiveProperties } from '../iiif/descriptive';
import { StructuralNormalized, StructuralProperties } from '../iiif/structural';
import { LinkingNormalized, LinkingProperties } from '../iiif/linking';
import { OmitProperties, SomeRequired } from '../utility';
import { SingleReference } from '../reference';
import { Canvas } from './canvas';

export type ManifestItems = Canvas;

type OmittedTechnical = 'format' | 'profile' | 'height' | 'width' | 'duration' | 'timeMode';
type OmittedDescriptive = 'language';
type OmittedLinking = 'supplementary';

type Technical = OmitProperties<TechnicalProperties, OmittedTechnical>;
type Descriptive = OmitProperties<DescriptiveProperties, OmittedDescriptive>;
type Structural = StructuralProperties<ManifestItems>;
type Linking = OmitProperties<LinkingProperties, OmittedLinking>;

export interface Manifest
  extends SomeRequired<Technical, 'id' | 'type'>,
    SomeRequired<Descriptive, 'label'>,
    SomeRequired<Structural, 'items'>,
    Partial<Linking> {
  '@context'?: string | string[];
}

type ItemSchemas = 'collection' | 'manifest';

export interface ManifestNormalized
  extends OmitProperties<TechnicalProperties, OmittedTechnical>,
    OmitProperties<DescriptiveNormalized, OmittedDescriptive>,
    StructuralNormalized<SingleReference<ItemSchemas>, ItemSchemas>,
    OmitProperties<LinkingNormalized, OmittedLinking> {}
