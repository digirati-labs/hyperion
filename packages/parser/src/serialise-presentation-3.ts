import { SerialiseConfig, UNWRAP } from './serialise';
import {
  TechnicalProperties,
  DescriptiveNormalized,
  LinkingNormalized,
  AnnotationCollection,
} from '@hyperion-framework/types';

function technicalProperties(entity: Partial<TechnicalProperties>): Array<[keyof TechnicalProperties, any]> {
  return [
    // Technical
    ['id', entity.id],
    ['type', entity.type],
    ['format', entity.format],
    ['profile', entity.profile],
    ['height', entity.height],
    ['width', entity.width],
    ['duration', entity.duration || undefined],
    ['viewingDirection', entity.viewingDirection !== 'left-to-right' ? entity.viewingDirection : undefined],
    ['behavior', entity.behavior && entity.behavior.length ? entity.behavior : undefined],
    ['timeMode', entity.timeMode],
    ['motivation', entity.motivation],
  ];
}

function filterEmpty<T>(item?: T[]): T[] | undefined {
  if (!item || item.length === 0) {
    return undefined;
  }
  return item;
}

function* descriptiveProperties(
  entity: Partial<DescriptiveNormalized>
): Generator<any, any, Array<[keyof DescriptiveNormalized, any]>> {
  return [
    ['label', entity.label],
    ['metadata', filterEmpty(entity.metadata)],
    ['summary', entity.summary],
    ['requiredStatement', entity.requiredStatement],
    ['rights', entity.rights],
    ['navDate', entity.navDate],
    ['language', entity.language],
    // We yield these fully as they are embedded in here.
    ['thumbnail', filterEmpty(yield entity.thumbnail)],
    ['placeholderCanvas', yield entity.placeholderCanvas],
    ['accompanyingCanvas', yield entity.accompanyingCanvas],

    // @todo need to test this one.
    ['provider', filterEmpty(entity.provider)],
  ];
}

function* linkingProperties(
  entity: Partial<LinkingNormalized>
): Generator<any, any, Array<[keyof LinkingNormalized, any]>> {
  return [
    ['seeAlso', filterEmpty(yield entity.seeAlso)],
    ['service', filterEmpty(entity.service)],
    ['services', filterEmpty(entity.services)],
    ['rendering', filterEmpty(yield entity.rendering)],
    ['supplementary', filterEmpty(yield entity.supplementary)],

    // Don't yield these, they are references.
    ['partOf', filterEmpty(entity.partOf)],
    ['start', entity.start],
  ];
}

export const serialiseConfigPresentation3: SerialiseConfig = {
  Manifest: function*(entity) {
    return [
      ...technicalProperties(entity),
      ...(yield* descriptiveProperties(entity)),
      ...(yield* linkingProperties(entity)),
      ['items', yield entity.items],
      ['structures', filterEmpty(yield entity.structures)],
    ];
  },

  Canvas: function*(entity) {
    return [
      // Items.
      ...technicalProperties(entity),
      ...(yield* descriptiveProperties(entity)),
      ...(yield* linkingProperties(entity)),
      ['items', yield entity.items],
      ['annotations', filterEmpty(yield entity.annotations)],
    ];
  },

  AnnotationPage: function*(entity) {
    const entries = Object.entries(entity)
      .map(([key, item]) => {
        return [key, Array.isArray(item) ? filterEmpty(item as any) : item];
      })
      .filter(([key, value]) => {
        return key !== 'items';
      });

    return [
      // Any more properties?
      ...entries,
      ...(yield* linkingProperties(entity)),
      ['items', yield entity.items],
    ];
  },

  Service: function*(entity) {
    // Are there other properties on a service?
    return [[UNWRAP, entity]];
  },

  Annotation: function*(entity) {
    const entries = Object.entries(entity)
      .map(([key, item]) => {
        return [key, Array.isArray(item) ? filterEmpty(item as any) : item];
      })
      .filter(([key]) => {
        return key !== 'body';
      });

    return [...entries, ['body', yield entity.body]];
  },

  ContentResource: function*(entity: any) {
    return [
      // Image properties.
      ...technicalProperties(entity),
      ...(yield* descriptiveProperties(entity)),
      ...(yield* linkingProperties(entity)),
    ];
  },

  AnnotationCollection: function*(entity) {
    return [
      // @todo expand properties if they are actually used.
      ['id', entity.id],
      ['type', 'AnnotationCollection'],
      ['label', entity.label],
    ];
  },

  Collection: function*(entity) {
    return [
      ...technicalProperties(entity),
      ...(yield* descriptiveProperties(entity)),
      ...(yield* linkingProperties(entity)),
      ['items', yield* entity.items],
    ];
  },

  Range: function*(entity) {
    const rangeItems = [];

    for (const item of entity.items) {
      if (item.type === 'Range') {
        // Resolve the full range
        rangeItems.push(yield item);
      } else {
        // Just push the reference.
        // @todo could also push in the label of the item?
        rangeItems.push(item);
      }
    }

    return [
      ...technicalProperties(entity),
      ...(yield* descriptiveProperties(entity)),
      ...(yield* linkingProperties(entity)),
      ['items', rangeItems],
      ['annotations', filterEmpty(yield entity.annotations)],
    ];
  },
};
