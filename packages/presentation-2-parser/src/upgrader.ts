import * as Presentation3 from '@hyperion-framework/types';
import * as Presentation2 from '@hyperion-framework/presentation-2';
import { Traverse } from './traverse';
import { SomeRequired } from '@hyperion-framework/types';

const configuration = {
  attributionLabel: 'Attribution',
  lang: 'none',
  providerId: '',
  providerName: 'Unknown',
};

export function convertLanguageMapping(
  inputLangProperty?: Presentation2.OneOrMany<Presentation2.LanguageProperty>,
  defaultLang = 'none'
): Presentation3.InternationalString {
  if (!inputLangProperty) {
    return {};
  }

  const arrayOfValues = Array.isArray(inputLangProperty) ? inputLangProperty : [inputLangProperty];

  const languageMap: Presentation3.InternationalString = {};

  for (const language of arrayOfValues) {
    // For strings "label": ["a value"]
    if (typeof language === 'string') {
      languageMap[defaultLang] = languageMap[defaultLang] ? languageMap[defaultLang] : [];
      (languageMap[defaultLang] as string[]).push(language || '');
      continue;
    }

    // For maps without a language
    if (!language['@language']) {
      languageMap[defaultLang] = languageMap[defaultLang] ? languageMap[defaultLang] : [];
      (languageMap[defaultLang] as string[]).push(language['@value'] || '');
      continue;
    }

    // Default case with language.
    const lang = language['@language'];
    languageMap[lang] = languageMap[lang] ? languageMap[lang] : [];
    (languageMap[lang] as string[]).push(language['@value'] || '');
  }
  return languageMap;
}

export function upgradeContext(inputContexts: string | string[]): string[] {
  const contexts: string[] = Array.isArray(inputContexts) ? inputContexts : [inputContexts];
  const newContext: string[] = [];

  for (const context of contexts) {
    switch (context) {
      case 'http://iiif.io/api/image/2/context.json':
        newContext.push('ImageService2');
        break;
      case 'http://iiif.io/api/image/1/context.json':
      case 'http://library.stanford.edu/iiif/image-api/1.1/context.json':
        newContext.push('ImageService1');
        break;
      case 'http://iiif.io/api/annex/openannotation/context.json':
        newContext.push('ImageApiSelector');
        break;
      default:
        newContext.push(context);
    }
  }

  return newContext;
}

function getTypeFromProfile(inputProfile: string): string | undefined {
  switch (inputProfile) {
    case 'http://iiif.io/api/auth/1/kiosk':
    case 'http://iiif.io/api/auth/1/login':
    case 'http://iiif.io/api/auth/1/clickthrough':
    case 'http://iiif.io/api/auth/1/external':
    case 'http://iiif.io/api/auth/0/kiosk':
    case 'http://iiif.io/api/auth/0/login':
    case 'http://iiif.io/api/auth/0/clickthrough':
    case 'http://iiif.io/api/auth/0/external':
      return 'AuthCookieService1';

    case 'http://iiif.io/api/auth/1/token':
    case 'http://iiif.io/api/auth/0/token':
      return 'AuthTokenService1';
    case 'http://iiif.io/api/auth/1/logout':
    case 'http://iiif.io/api/auth/0/logout':
      return 'AuthLogoutService1';

    case 'http://iiif.io/api/search/1/search':
    case 'http://iiif.io/api/search/0/search':
      return 'SearchService1';
    case 'http://iiif.io/api/search/1/autocomplete':
    case 'http://iiif.io/api/search/0/autocomplete':
      return 'AutoCompleteService1';
  }

  return undefined;
}

function removePrefix(str: string) {
  for (const prefix of ['sc', 'oa', 'dcterms', 'dctypes', 'iiif']) {
    if (str.startsWith(`${prefix}:`)) {
      return str.slice(prefix.length + 1);
    }
  }

  return str;
}

function getNewType(oldType: string | string[], profile?: any): string {
  if (profile) {
    const possibleType = getTypeFromProfile(profile);
    if (possibleType) {
      return possibleType;
    }
  }

  if (!oldType) {
    return 'unknown';
  }

  if (Array.isArray(oldType)) {
    if (oldType.indexOf('oa:CssStylesheet') !== -1) {
      return 'CssStylesheet';
    }
    if (oldType.indexOf('cnt:ContentAsText') !== -1) {
      return 'TextualBody';
    }
    // Nothing we can do?
    oldType = oldType[0];
  }

  for (const prefix of ['sc', 'oa', 'dcterms', 'dctypes', 'iiif']) {
    if (oldType.startsWith(`${prefix}:`)) {
      return getNewType(oldType.slice(prefix.length + 1));
    }
  }

  switch (oldType) {
    case 'Layer':
      return 'AnnotationCollection';
    case 'AnnotationList':
      return 'AnnotationPage';
    case 'cnt:ContentAsText':
      return 'TextualBody';
    // @todo There are definitely some missing annotation types here.
  }

  // Again, nothing we can do.
  return oldType;
}

async function getContentTypeOfRemoteResource(resourceId: string): Promise<string | undefined> {
  try {
    const response = await fetch(resourceId, { method: 'HEAD' });
    const headers = response.headers;

    return headers.get('content-type') || undefined;
  } catch (e) {
    // do nothing.
  }

  return undefined;
}

function fixLicense(
  license: Presentation2.RightsProperties['license'],
  licenseLabel = 'Rights/License',
  lang = 'none'
): [Presentation3.DescriptiveProperties['rights'], Presentation3.DescriptiveProperties['metadata']] {
  let rights: Presentation3.DescriptiveProperties['rights'] = null;
  const metadata: Presentation3.DescriptiveProperties['metadata'] = [];

  const licenseList = Array.isArray(license) ? license : [license];

  for (const singleLicense of licenseList) {
    if (
      singleLicense &&
      (singleLicense.indexOf('creativecommons.org') !== -1 || singleLicense.indexOf('rightsstatements.org') !== -1)
    ) {
      rights = singleLicense;
      continue;
    }
    if (singleLicense) {
      metadata.push({
        label: { [lang]: [licenseLabel] },
        value: { [lang]: [singleLicense] },
      });
    }
  }

  return [rights, metadata];
}

function convertMetadata(
  metadata: Presentation2.DescriptiveProperties['metadata']
): Presentation3.DescriptiveProperties['metadata'] {
  if (!metadata) {
    return [];
  }

  return metadata.map(
    (item): Presentation3.MetadataItem => {
      return {
        label: convertLanguageMapping(item.label),
        value: convertLanguageMapping(item.value),
      };
    }
  );
}

function removeUndefinedProperties(obj: any) {
  for (const prop in obj) {
    if (typeof obj[prop] === 'undefined' || obj[prop] === null) {
      delete obj[prop];
    }
  }
  return obj;
}

function mintNewIdFromResource(
  resource: SomeRequired<Presentation2.TechnicalProperties, '@type'>,
  subresource?: string
) {
  // @todo.
  return `http://example.org/${resource['@type']}${subresource ? `/${subresource}` : ''}`;
}

function technicalProperties<T extends Partial<Presentation3.TechnicalProperties>>(
  resource: SomeRequired<Presentation2.TechnicalProperties, '@type'> & {
    motivation?: string | null;
    format?: string;
    profile?: any;
    '@context'?: string | string[] | undefined;
  }
) {
  const allBehaviours = [...(resource.behavior || [])];

  if (resource.viewingHint) {
    allBehaviours.push(resource.viewingHint);
  }

  return {
    '@context': resource['@context'] ? upgradeContext(resource['@context']) : undefined,
    id: resource['@id'] || mintNewIdFromResource(resource),
    type: getNewType(resource['@type'], resource.profile) as any,
    behavior: allBehaviours.length ? allBehaviours : undefined,
    // format: This will be an optional async post-process step.
    height: resource.height ? resource.height : undefined,
    width: resource.width ? resource.width : undefined,
    motivation: resource.motivation ? removePrefix(resource.motivation) : undefined,
    viewingDirection: resource.viewingDirection,
    profile: resource.profile,
    format: resource.format ? resource.format : undefined,
    duration: undefined,
    timeMode: undefined,
  } as any;
}

function descriptiveProperties<T extends Partial<Presentation3.DescriptiveProperties>>(
  resource: Presentation2.DescriptiveProperties &
    Presentation2.RightsProperties &
    Partial<Presentation2.TechnicalProperties>
): T {
  const [rights, extraMetadata] = fixLicense(resource.license);
  const allMetadata = [...(resource.metadata ? convertMetadata(resource.metadata) : []), ...extraMetadata];

  return {
    rights,
    metadata: allMetadata.length ? allMetadata : undefined,
    label: resource.label ? convertLanguageMapping(resource.label) : undefined,
    requiredStatement: resource.attribution
      ? {
          label: convertLanguageMapping(configuration.attributionLabel),
          value: convertLanguageMapping(resource.attribution),
        }
      : undefined,
    navDate: resource.navDate,
    summary: resource.description ? convertLanguageMapping(resource.description) : undefined,
  } as T;
}

function linkingProperties(resource: Presentation2.LinkingProperties & Presentation2.RightsProperties) {
  // @todo related links to metadata.

  const related = resource.related ? (Array.isArray(resource.related) ? resource.related : [resource.related]) : [];
  const layer = resource.contentLayer as Presentation2.Layer;

  return {
    provider:
      resource.logo || related.length
        ? {
            id: configuration.providerId,
            type: 'Agent' as 'Agent',
            homepage: related.length ? (related[0] as any) : undefined,
            logo: resource.logo ? (resource.logo as any) : undefined,
            label: convertLanguageMapping(configuration.providerName),
          }
        : undefined,
    partOf: resource.within ? (resource.within as any) : undefined,
    rendering: undefined,
    seeAlso: undefined,
    start: resource.startCanvas as any,
    service: resource.service ? (resource.service as any) : undefined,
    supplementary: layer ? [layer as any] : undefined,
  };
}

function upgradeCollection(collection: Presentation2.Collection): Presentation3.Collection {
  return removeUndefinedProperties({
    ...technicalProperties(collection),
    ...descriptiveProperties<SomeRequired<Presentation3.CollectionDescriptive, 'label'>>(collection),
    ...linkingProperties(collection),
    items: collection.members as any,
  });
}

function upgradeManifest(manifest: Presentation2.Manifest): Presentation3.Manifest {
  return removeUndefinedProperties({
    ...technicalProperties(manifest),
    ...descriptiveProperties(manifest),
    ...linkingProperties(manifest),
    items: manifest.sequences as any,
  });
}

function upgradeCanvas(canvas: Presentation2.Canvas): Presentation3.Canvas {
  return removeUndefinedProperties({
    ...technicalProperties(canvas),
    ...descriptiveProperties(canvas),
    ...linkingProperties(canvas),
    items: [
      {
        id: mintNewIdFromResource(canvas),
        type: 'AnnotationPage',
        items: canvas.images as any,
      },
    ],
  });
}

function upgradeAnnotationList(annotationPage: Presentation2.AnnotationList): Presentation3.AnnotationPage {
  return removeUndefinedProperties({
    ...(technicalProperties(annotationPage) as any),
    ...(descriptiveProperties(annotationPage) as any),
    ...(linkingProperties(annotationPage) as any),
    items: annotationPage.resources as any,
  });
}

function upgradeSequence(sequence: Presentation2.Sequence): Presentation3.Canvas[] {
  // @todo possibly return some ranges too.
  return sequence.canvases as any;
}

function upgradeAnnotation(annotation: Presentation2.Annotation): Presentation3.Annotation {
  return removeUndefinedProperties({
    ...(technicalProperties(annotation) as any),
    ...(descriptiveProperties(annotation) as any),
    ...(linkingProperties(annotation) as any),
    target: annotation.on,
    body: annotation.resource as any,
    // @todo stylesheet upgrade.
  });
}

function upgradeContentResource(inputContentResource: Presentation2.ContentResource): Presentation3.ContentResource {
  const contentResource = inputContentResource as Presentation2.CommonContentResource;
  // @todo there might be some field dropped here.
  return removeUndefinedProperties({
    ...(technicalProperties(contentResource) as any),
    ...(descriptiveProperties(contentResource) as any),
    ...(linkingProperties(contentResource as any) as any),
  });
}
function upgradeChoice(choice: Presentation2.ChoiceEmbeddedContent): Presentation3.ChoiceBody {
  const items = [];

  if (choice.default && choice.default !== 'rdf:nil') {
    items.push(choice.default);
  }

  if (choice.item && choice.item !== 'rdf:nil') {
    items.push(...choice.item);
  }

  return {
    ...technicalProperties(choice),
    ...descriptiveProperties(choice),
    items: items as any,
  };
}
function upgradeRange(range: any) {
  // Range.
  // At the moment a range only references other ranges by id.
  // So we need to first get
  return range;
}

function upgradeService(service: Presentation2.Service): Presentation3.Service {
  return service; // Technically we could change @id -> id and @type to type
}

function upgradeLayer(layer: Presentation2.Layer): Presentation3.AnnotationCollection {
  return removeUndefinedProperties({
    ...technicalProperties(layer),
    ...descriptiveProperties(layer),
    ...linkingProperties(layer),
  });
}

export const presentation2to3 = new Traverse<{
  Collection: Presentation3.Collection;
  Manifest: Presentation3.Manifest;
  Canvas: Presentation3.Canvas;
  AnnotationList: Presentation3.AnnotationPage;
  Sequence: Presentation3.Canvas[];
  Annotation: Presentation3.Annotation;
  ContentResource: Presentation3.ContentResource;
  Choice: Presentation3.ChoiceBody;
  Range: Presentation3.Range;
  Service: Presentation3.Service;
  Layer: Presentation3.AnnotationCollection;
}>({
  collection: [upgradeCollection],
  manifest: [upgradeManifest],
  canvas: [upgradeCanvas],
  annotationList: [upgradeAnnotationList],
  sequence: [upgradeSequence],
  annotation: [upgradeAnnotation],
  contentResource: [upgradeContentResource],
  choice: [upgradeChoice],
  range: [upgradeRange],
  service: [upgradeService],
  layer: [upgradeLayer],
});
