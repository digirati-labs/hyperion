import { TechnicalProperties } from '../iiif/technical';
import { DescriptiveNormalized, DescriptiveProperties } from '../iiif/descriptive';
import { StructuralNormalized, StructuralProperties } from '../iiif/structural';
import { LinkingNormalized, LinkingProperties } from '../iiif/linking';
import { OmitProperties, SomeRequired } from '../utility';
import { Reference } from '../reference';
import { Canvas } from './canvas';

export type RangeItems = Range | Canvas | string;

type OmittedTechnical = 'format' | 'profile' | 'height' | 'width' | 'duration' | 'timeMode';
type OmittedDescriptive = 'language';
type OmittedStructural = 'structures';

type Technical = OmitProperties<TechnicalProperties, OmittedTechnical>;
type Descriptive = OmitProperties<DescriptiveProperties, OmittedDescriptive>;
type Structural = OmitProperties<StructuralProperties<RangeItems>, OmittedStructural>;
type Linking = LinkingProperties;

export interface Range
  extends SomeRequired<Technical, 'id' | 'type'>,
    SomeRequired<Descriptive, 'label'>,
    Partial<Structural>,
    Partial<Linking> {}

type ItemSchemas = 'range' | 'canvas';

export interface RangeNormalized
  extends OmitProperties<TechnicalProperties, OmittedTechnical>,
    OmitProperties<DescriptiveNormalized, OmittedDescriptive>,
    OmitProperties<StructuralNormalized<Reference<ItemSchemas>, ItemSchemas>, OmittedStructural>,
    LinkingNormalized {}
