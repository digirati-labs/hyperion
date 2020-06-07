import { TechnicalProperties } from '../iiif/technical';
import { DescriptiveNormalized, DescriptiveProperties } from '../iiif/descriptive';
import { StructuralNormalized, StructuralProperties } from '../iiif/structural';
import { LinkingNormalized, LinkingProperties } from '../iiif/linking';
import { OmitProperties, SomeRequired } from '../utility';
import { Reference } from '../reference';
import { AnnotationPage } from './annotationPage';

export declare type CanvasItems = AnnotationPage;

type CanvasOmittedTechnical = 'format' | 'profile' | 'viewingDirection' | 'timeMode';
type CanvasOmittedDescriptive = 'language';
type CanvasOmittedLinking = 'services' | 'start' | 'supplementary';
type CanvasOmittedStructural = 'structures';

type CanvasTechnical = OmitProperties<TechnicalProperties, CanvasOmittedTechnical>;
type CanvasDescriptive = OmitProperties<DescriptiveProperties, CanvasOmittedDescriptive>;
type CanvasStructural = OmitProperties<StructuralProperties<CanvasItems>, CanvasOmittedStructural>;
type CanvasLinking = OmitProperties<LinkingProperties, CanvasOmittedLinking>;

export interface Canvas
  extends SomeRequired<CanvasTechnical, 'id' | 'type'>,
    Partial<CanvasDescriptive>,
    Partial<CanvasStructural>,
    Partial<CanvasLinking> {
  '@context'?: string | string[];
}

type CanvasItemSchemas = 'AnnotationPage';

export declare type CanvasNormalized = OmitProperties<TechnicalProperties, CanvasOmittedTechnical> &
  OmitProperties<DescriptiveNormalized, CanvasOmittedDescriptive> &
  OmitProperties<StructuralNormalized<Reference<CanvasItemSchemas>, CanvasItemSchemas>, CanvasOmittedStructural> &
  OmitProperties<LinkingNormalized, CanvasOmittedLinking> & { type: 'Canvas' };
