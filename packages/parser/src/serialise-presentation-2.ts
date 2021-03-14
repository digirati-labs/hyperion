import { SerialiseConfig, UNSET, UNWRAP } from './serialise';
import {
  DescriptiveNormalized,
  InternationalString,
  LinkingNormalized,
  TechnicalProperties,
} from '@hyperion-framework/types';
import * as Presentation2 from '@hyperion-framework/presentation-2';

export function languageString2to3(
  value: InternationalString | null | undefined
): Presentation2.LanguageProperty | Presentation2.LanguageProperty[] | undefined {
  if (!value) {
    return undefined;
  }

  const languages = Object.keys(value);

  if (languages.length === 0) {
    return undefined;
  }

  // If there is only one, then return it as a string.
  if (languages.length === 1) {
    const language = languages[0];
    if (!language) {
      return '';
    }

    const singleValue = (value[language] || []).join('');

    if (language === '@none' || language === 'none' || language === 'en') {
      return singleValue;
    }

    return {
      '@language': language,
      '@value': singleValue,
    };
  }

  return languages.map(language => {
    return {
      '@language': language,
      '@value': (value[language] || []).join(''),
    };
  });
}

function parseCanvasTarget(target: any): any {
  if (Array.isArray(target)) {
    return target.map(t => parseCanvasTarget(t));
  }

  if (typeof target === 'string') {
    return target;
  }

  if (target.type && target.type === 'Canvas') {
    return target.id;
  }

  return target;
}

function unNestArray<T>(oneOrArray: T[] | undefined, onlyOne = false): T | T[] | undefined {
  if (!oneOrArray) {
    return undefined;
  }

  if (oneOrArray.length > 1 && !onlyOne) {
    return oneOrArray;
  }
  return oneOrArray[0] || undefined;
}

function convertService(service: any) {
  if (!service) {
    return undefined;
  }

  if (typeof service === 'string') {
    return {
      '@id': service,
    };
  }

  if ('@id' in service) {
    const newService = { ...service };
    delete newService['@type'];
    return newService;
  }

  // @todo support auth.
  return {
    '@context': 'http://iiif.io/api/image/2/context.json',
    '@id': service.id,
    profile: `http://iiif.io/api/image/2/profiles/${service.profile}.json`,
  };
}

function technicalProperties(props: Partial<TechnicalProperties>, type?: string) {
  return [
    ['@id', props.id],
    ['@type', type],
    ['format', props.format],
    ['height', props.height],
    ['width', props.width],
    ['viewingDirection', props.viewingDirection !== 'left-to-right' ? props.viewingDirection : undefined],
    // @todo Viewing hint is merged with behavior
    // ['viewingHint', props.]
  ];
}

function* descriptiveProperties(prop: Partial<DescriptiveNormalized>): Generator<any, any, any> {
  const provider = prop.provider ? prop.provider[0] : undefined;

  return [
    ['label', languageString2to3(prop.label)],
    [
      'metadata',
      prop.metadata && prop.metadata.length
        ? prop.metadata.map(item => ({
            label: languageString2to3(item.label) || '',
            value: languageString2to3(item.value) || '',
          }))
        : undefined,
    ],
    ['description', languageString2to3(prop.summary)],
    ['thumbnail', unNestArray(yield prop.thumbnail)],
    ['navDate', prop.navDate],
    // @todo these needs consideration if the way provider is parsed changes.
    ['logo', provider ? unNestArray(provider.logo) : undefined],
    ['homepage', provider ? provider.homepage : undefined],
    ['attribution', prop.requiredStatement ? languageString2to3(prop.requiredStatement.value) : undefined],
  ];
}

function* linkingProperties(prop: Partial<LinkingNormalized>) {
  return [
    ['seeAlso', unNestArray(yield prop.seeAlso)],
    // @todo support more services (like auth)
    ['service', unNestArray((prop.service || []).map(convertService))],
    ['rendering', unNestArray(yield prop.rendering)],
    // @todo part of to within
    // ['within', unNestArray(yield prop.partOf)],
    // @todo this may not work completely.
    ['startCanvas', prop.start ? prop.start.id : undefined],
  ];
}

export const serialiseConfigPresentation2: SerialiseConfig = {
  Manifest: function*(entity) {
    return [
      ...technicalProperties(entity, 'sc:Manifest'),
      ...(yield* descriptiveProperties(entity)),
      ...(yield* linkingProperties(entity)),
      // Structural.
      // @todo structures
      [
        'sequences',
        [
          {
            '@id': `${entity.id}/sequence0`,
            '@type': 'sc:Sequence',
            canvases: yield entity.items,
          },
        ],
      ],
      ['structures', yield entity.structures],
    ];
  },

  Canvas: function*(entity) {
    const paintingPage = yield entity.items;
    const resources = paintingPage[0];
    return [
      // Items.
      ...technicalProperties(entity, 'sc:Canvas'),
      ...(yield* descriptiveProperties(entity)),
      ...(yield* linkingProperties(entity)),
      ['images', resources ? [resources.resources] : undefined],
      [
        'annotations',
        entity.annotations && entity.annotations.length ? unNestArray(yield entity.annotations) : undefined,
      ],
    ];
  },

  AnnotationPage: function*(entity) {
    return [
      ...technicalProperties(entity, 'sc:AnnotationList'),
      ...(yield* descriptiveProperties(entity)),
      ['resources', entity.items && entity.items.length ? unNestArray(yield entity.items) : undefined],
    ];
  },

  Annotation: function*(entity) {
    return [
      ['@id', entity.id],
      ['@type', 'oa:Annotation'],
      // This could be improved.
      ['motivation', 'sc:painting'],
      ['on', parseCanvasTarget(entity.target)],
      ['resource', unNestArray(yield entity.body, true)],
    ];
  },

  ContentResource: function*(entity: any) {
    switch (entity.type) {
      case 'Image':
        return [
          // Image properties.
          ...technicalProperties(entity, 'dctypes:Image'),
          ...(yield* descriptiveProperties(entity)),
          ...(yield* linkingProperties(entity)),
        ];
      case 'Text':
      case 'Dataset':
      default:
        return [...technicalProperties(entity, undefined), ...(yield* descriptiveProperties(entity))];
    }
  },

  AnnotationCollection: function*(entity) {
    return [
      // @todo expand properties if they are actually used.
      ['@id', entity.id],
      ['@type', 'sc:Layer'],
      ['label', languageString2to3(entity.label)],
    ];
  },

  Collection: function*(entity) {
    return [
      ...technicalProperties(entity, 'sc:Collection'),
      ...(yield* descriptiveProperties(entity)),
      ...(yield* linkingProperties(entity)),
      ['members', yield* entity.items],
    ];
  },

  Range: function*(entity) {
    const members = [];
    const canvases = [];

    if (entity.items) {
      for (const item of entity.items) {
        const canvas = yield item;
        members.push({
          '@id': item.id,
          '@type': item.type,
          label: canvas ? canvas.label : undefined,
          within: entity.id,
        });
        if (item.type === 'Canvas') {
          canvases.push(item.id);
        }
      }
    }

    return [
      ...technicalProperties(entity, 'sc:Range'),
      ...(yield* descriptiveProperties(entity)),
      ...(yield* linkingProperties(entity)),
      ['canvases', canvases.length === members.length ? canvases : undefined],
      ['members', canvases.length !== members.length ? members : undefined],
    ];
  },
};
