import { EntityReference, Field, SerialiseConfig, serialisedFieldsToObject, UNSET, UNWRAP } from '..';
import {
  CanvasNormalized,
  DescriptiveNormalized,
  LinkingNormalized,
  RangeNormalized,
  Reference,
  TechnicalProperties,
} from '@hyperion-framework/types';
import { emptyObject, unArray } from './utlities';

export function convertReference(ref: Reference<any>) {
  return {
    id: ref.id,
    type: ref.type,
  };
}

export function technical(entity: Partial<TechnicalProperties>) {
  return [
    ['@id', entity.id],
    ['@type', entity.type || UNSET],
    ['format', entity.format || UNSET],
    ['profile', entity.profile || UNSET],
    ['height', entity.height || UNSET],
    ['width', entity.width || UNSET],
    ['duration', entity.duration || UNSET],
    [
      'viewingDirection',
      entity.viewingDirection && entity.viewingDirection !== 'left-to-right' ? entity.viewingDirection : UNSET,
    ],
    ['behavior', entity.behavior && entity.behavior.length ? entity.behavior : UNSET],
    ['motivation', entity.motivation && entity.motivation.length ? unArray(entity.motivation as any) : UNSET],
  ];
}

export function* descriptive(
  entity: Partial<DescriptiveNormalized>
): Generator<EntityReference | EntityReference[], Field[], any> {
  return [
    ['label', !emptyObject(entity.label) ? entity.label : UNSET],
    ['summary', !emptyObject(entity.summary) ? entity.summary : UNSET],
    ['requiredStatement', !emptyObject(entity.requiredStatement) ? entity.requiredStatement : UNSET],
    [
      'metadata',
      entity.metadata && entity.metadata.length
        ? entity.metadata.map(({ label, value }) => [['label', label], ['value', value]]).map(serialisedFieldsToObject)
        : UNSET,
    ],
    ['license', entity.rights || UNSET],
    ['navDate', entity.navDate || UNSET],
    ['thumbnail', entity.thumbnail && entity.thumbnail.length ? yield entity.thumbnail : UNSET],
  ];
}

export function* linking(
  entity: Partial<LinkingNormalized>
): Generator<Reference<any> | Reference<any>[], Field[], any> {
  return [
    ['seeAlso', entity.seeAlso && entity.seeAlso.length ? yield entity.seeAlso : UNSET],
    ['service', entity.service && entity.service.length ? yield entity.service : UNSET],
    ['logo', entity.logo && entity.logo.length ? yield entity.logo : UNSET],
    ['homepage', entity.homepage ? yield entity.homepage : UNSET],
    ['rendering', entity.rendering && entity.rendering.length ? yield entity.rendering : UNSET],
    ['partOf', entity.partOf && entity.partOf.length ? entity.partOf.map(convertReference) : UNSET],
    ['start', entity.start ? convertReference(entity.start) : UNSET],
    ['otherContent', entity.supplementary ? yield entity.supplementary : UNSET],
  ];
}

export const presentation3: SerialiseConfig = {
  Manifest: function*(manifest, v) {
    return [
      ['@context', 'http://iiif.io/api/presentation/3/context.json'],
      ...technical(manifest),
      ...(yield* descriptive(manifest)),
      ['items', yield manifest.items],
      ['structures', yield manifest.structures],
      ...(yield* linking(manifest)),
    ];
  },
  Canvas: function*(canvas) {
    return [
      ...technical(canvas),
      ...(yield* descriptive(canvas)),
      ['items', yield canvas.items],
      ...(yield* linking(canvas)),
    ];
  },
  ContentResource: function*(resource) {
    if (typeof resource === 'string') {
      return [[UNWRAP, resource]];
    }

    return [
      ...technical(resource as any),
      ...(yield* descriptive(resource as any)),
      ...(yield* linking(resource as any)),
    ];
  },
  Annotation: function*(annotation) {
    return [
      ...technical(annotation as any),
      ...(yield* descriptive(annotation as any)),
      ['body', yield annotation.body],
      ...(yield* linking(annotation)),
      ['target', annotation.target],
    ];
  },
  AnnotationCollection: function*(collection) {
    // ???
    return [...technical(collection), ...(yield* descriptive(collection))];
  },
  AnnotationPage: function*(annotationPage) {
    return [[UNWRAP, yield annotationPage.items]];
  },
  Collection: function*(collection) {
    return [
      ...technical(collection),
      ...(yield* descriptive(collection)),
      ['items', collection.items.map(convertReference)],
      ...(yield* linking(collection)),
    ];
  },
  Range: function*(range, v) {
    const allRanges = range.items.map(r => v.fromRef<RangeNormalized | CanvasNormalized>(r));
    const canvases = allRanges.filter(r => r.type === 'Canvas');
    const ranges = allRanges.filter(r => r.type === 'Range');

    return [
      ...technical(range as any),
      ...(yield* descriptive(range)),
      ['items', ...canvases.map(({ id, type }) => ({ id, type })), ...(yield ranges)],
      ...(yield* linking(range)),
    ];
  },
  Selector: function*(selector) {
    return [[UNWRAP, selector]];
  },
  Service: function*(service) {
    return [...technical(service as any), ...(yield* descriptive(service as any)), ...(yield* linking(service as any))];
  },
};
