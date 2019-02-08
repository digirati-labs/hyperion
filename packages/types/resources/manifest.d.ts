import { TechnicalProperties } from '../iiif/technical';
import { DescriptiveNormalized, DescriptiveProperties } from '../iiif/descriptive';
import { StructuralNormalized, StructuralProperties } from '../iiif/structural';
import { LinkingNormalized, LinkingProperties } from '../iiif/linking';
import { JsonLDContext, OmitProperties, SomeRequired } from '../utility';
import { Reference } from '../reference';
import { Canvas } from './canvas';

export declare type ManifestItems = Canvas;

type ManifestOmittedTechnical = 'format' | 'profile' | 'height' | 'width' | 'duration' | 'timeMode';
type ManifestOmittedDescriptive = 'language';
type ManifestOmittedLinking = 'supplementary';

type ManifestTechnical = OmitProperties<TechnicalProperties, ManifestOmittedTechnical>;
type ManifestDescriptive = OmitProperties<DescriptiveProperties, ManifestOmittedDescriptive>;
type ManifestStructural = StructuralProperties<ManifestItems>;
type ManifestLinking = OmitProperties<LinkingProperties, ManifestOmittedLinking>;

export interface Manifest
  extends SomeRequired<ManifestTechnical, 'id' | 'type'>,
    SomeRequired<ManifestDescriptive, 'label'>,
    SomeRequired<ManifestStructural, 'items'>,
    Partial<ManifestLinking>,
    JsonLDContext {}

type ManifestItemSchemas = 'Canvas';

export declare type ManifestNormalized = OmitProperties<TechnicalProperties, ManifestOmittedTechnical> &
  OmitProperties<DescriptiveNormalized, ManifestOmittedDescriptive> &
  StructuralNormalized<Reference<ManifestItemSchemas>, ManifestItemSchemas> &
  OmitProperties<LinkingNormalized, ManifestOmittedLinking> & { type: 'Manifest' };
