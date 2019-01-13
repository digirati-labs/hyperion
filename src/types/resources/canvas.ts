import { TechnicalProperties } from '../iiif/technical';
import { DescriptiveNormalized, DescriptiveProperties } from '../iiif/descriptive';
import { StructuralNormalized, StructuralProperties } from '../iiif/structural';
import { LinkingNormalized, LinkingProperties } from '../iiif/linking';
import { OmitProperties, SomeRequired } from '../utility';
import { SingleReference } from '../reference';
import { AnnotationPage } from './annotationPage';

export type CanvasItems = AnnotationPage;

type OmittedTechnical = 'format' | 'profile' | 'viewingDirection' | 'timeMode';
type OmittedDescriptive = 'language';
type OmittedLinking = 'start' | 'supplementary';
type OmittedStructural = 'structures';

type Technical = OmitProperties<TechnicalProperties, OmittedTechnical>;
type Descriptive = OmitProperties<DescriptiveProperties, OmittedDescriptive>;
type Structural = OmitProperties<StructuralProperties<CanvasItems>, OmittedStructural>;
type Linking = OmitProperties<LinkingProperties, OmittedLinking>;

export interface Canvas
  extends SomeRequired<Technical, 'id' | 'type'>,
    Partial<Descriptive>,
    Partial<Structural>,
    Partial<Linking> {
  '@context'?: string | string[];
}

type ItemSchemas = 'annotationPage';

export interface CanvasNormalized
  extends OmitProperties<TechnicalProperties, OmittedTechnical>,
    OmitProperties<DescriptiveNormalized, OmittedDescriptive>,
    OmitProperties<StructuralNormalized<SingleReference<ItemSchemas>, ItemSchemas>, OmittedStructural>,
    OmitProperties<LinkingNormalized, OmittedLinking> {}
