import {
  CanvasNormalized,
  DescriptiveNormalized,
  InternationalString,
  LinkingNormalized,
  RangeNormalized,
  Reference,
  TechnicalProperties,
} from '@hyperion-framework/types';
import { EntityReference, Field, SerialiseConfig, serialisedFieldsToObject, UNSET, UNWRAP } from '..';
import { unArray } from './utlities';

function language(languageMap?: InternationalString | null, defaultLanguage = '@none') {
  if (!languageMap) {
    return UNSET;
  }

  const languages = Object.keys(languageMap);

  if (languages.length === 1 && languages[0] === defaultLanguage) {
    const val = languageMap[languages[0]];
    if (!val) {
      return UNSET;
    }
    return unArray(val);
  }

  if (languages.length === 1) {
    return {
      '@language': languages[0],
      '@value': unArray(languageMap[languages[0]]),
    };
  }

  const newMap = [];
  for (const lang of languages) {
    newMap.push({
      '@language': lang,
      '@value': unArray(languageMap[lang]),
    });
  }
  return newMap;
}

const prefix: any = {
  Image: 'dctypes',
  Annotation: 'oa',
};

function mapMotivation(motiv?: string | string[]): undefined | string | string[] {
  if (!motiv) {
    return;
  }
  if (typeof motiv === 'string') {
    if (motiv === 'painting') {
      return 'sc:painting';
    }
    return motiv;
  }
  return motiv.map(mapMotivation as any);
}

export function technical(entity: Partial<TechnicalProperties>) {
  // Lossy, no timeMode.
  return [
    ['@id', entity.id],
    ['@type', entity.type ? `${prefix[entity.type] || 'sc'}:${entity.type}` : UNSET],
    ['format', entity.format || UNSET],
    // @todo is there a conversion.
    ['profile', entity.profile || UNSET],
    ['height', entity.height || UNSET],
    ['width', entity.width || UNSET],
    ['duration', entity.duration || UNSET],
    [
      'viewingDirection',
      entity.viewingDirection && entity.viewingDirection !== 'left-to-right' ? entity.viewingDirection : UNSET,
    ],
    ['behavior', entity.behavior && entity.behavior.length ? entity.behavior : UNSET],
    ['motivation', entity.motivation ? mapMotivation(unArray(entity.motivation as any)) : UNSET],
  ];
}

export function* descriptive(
  entity: Partial<DescriptiveNormalized>,
  defaultLanguage = '@none'
): Generator<EntityReference | EntityReference[], Field[], any> {
  return [
    ['label', language(entity.label, defaultLanguage)],
    ['description', language(entity.summary, defaultLanguage)],
    ['attribution', entity.requiredStatement ? language(entity.requiredStatement.value, defaultLanguage) : UNSET],
    [
      'metadata',
      entity.metadata && entity.metadata.length
        ? entity.metadata
            .map(({ label, value }) => [
              ['label', language(label, defaultLanguage)],
              ['value', language(value, defaultLanguage)],
            ])
            .map(serialisedFieldsToObject)
        : UNSET,
    ],
    ['license', entity.rights || UNSET],
    ['navDate', entity.navDate || UNSET],
    ['thumbnail', entity.thumbnail && entity.thumbnail.length ? unArray(yield entity.thumbnail) : UNSET],
  ];
}

export function convertReference(ref: Reference<any>) {
  return {
    '@id': ref.id,
    '@type': `${prefix[ref.type] || 'sc'}:${ref.type}`,
  };
}

export function* linking(
  entity: Partial<LinkingNormalized>
): Generator<Reference<any> | Reference<any>[], Field[], any> {
  return [
    ['seeAlso', entity.seeAlso && entity.seeAlso.length ? unArray(yield entity.seeAlso) : UNSET],
    ['service', entity.service && entity.service.length ? unArray(yield entity.service) : UNSET],
    ['logo', entity.logo && entity.logo.length ? unArray(yield entity.logo) : UNSET],
    ['homepage', entity.homepage ? unArray(yield entity.homepage) : UNSET],
    ['rendering', entity.rendering && entity.rendering.length ? unArray(yield entity.rendering) : UNSET],
    ['partOf', entity.partOf && entity.partOf.length ? unArray(entity.partOf.map(convertReference)) : UNSET],
    ['start', entity.start ? convertReference(entity.start) : UNSET],
    ['otherContent', entity.supplementary ? yield entity.supplementary : UNSET],
  ];
}

function flatten<T>(input: T[][]): T[] {
  const ret = [];
  for (const t of input) {
    ret.push(...t);
  }
  return ret;
}

export const presentation2: SerialiseConfig = {
  Manifest: function*(manifest) {
    const structures = yield manifest.structures;

    return [
      ['@context', 'http://iiif.io/api/presentation/2/context.json'],
      ...technical(manifest),
      ...(yield* descriptive(manifest, 'en')),
      [
        'sequences',
        {
          '@id': `${manifest.id}/sequence0`,
          '@type': 'sc:Sequence',
          canvases: yield manifest.items,
        },
      ],
      ['structures', structures.filter((s: any) => !s.behavior || s.behavior.indexOf('sequence') === -1)],
      ...(yield* linking(manifest)),
    ];
  },
  Canvas: function*(canvas) {
    return [
      ...technical(canvas),
      ...(yield* descriptive(canvas, 'en')),
      ['images', flatten(yield canvas.items)],
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
      ['resource', yield annotation.body],
      ...(yield* linking(annotation)),
      ['on', annotation.target],
    ];
  },
  AnnotationCollection: function*(collection) {
    // ???
    return [...technical(collection)];
  },
  AnnotationPage: function*(annotationPage) {
    return [[UNWRAP, yield annotationPage.items]];
  },
  Collection: function*(collection) {
    return [
      ...technical(collection),
      ...(yield* descriptive(collection, 'en')),
      ['members', collection.items.map(convertReference)],
      ...(yield* linking(collection)),
    ];
  },
  Range: function*(range, v) {
    const allRanges = range.items.map(r => v.fromRef<RangeNormalized | CanvasNormalized>(r));
    const canvases = allRanges.filter(r => r.type === 'Canvas');
    const ranges = allRanges.filter(r => r.type === 'Range');

    return [
      ...technical(range),
      ...(yield* descriptive(range, 'en')),
      ...(yield* linking(range)),
      ['canvases', canvases ? canvases.map(c => c.id) : UNSET],
      ['ranges', ranges && ranges.length ? yield ranges : UNSET],
    ];
  },
  Selector: function*(selector) {
    return [[UNWRAP, selector]];
  },
  Service: function*(service) {
    return [...technical(service as any)];
  },
};
