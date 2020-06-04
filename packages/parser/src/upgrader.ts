import { Collection, Manifest } from '@hyperion-framework/types';
import Upgrader from 'iiif-prezi2to3';

export function convertPresentation2(entity: any): Manifest | Collection {
  if (
    (entity &&
      entity['@context'] &&
      (entity['@context'] === 'http://iiif.io/api/presentation/2/context.json' ||
        entity['@context'].indexOf('http://iiif.io/api/presentation/2/context.json') !== -1 ||
        // Yale context.
        entity['@context'] === 'http://www.shared-canvas.org/ns/context.json')) ||
    entity['@context'] === 'http://iiif.io/api/image/2/context.json'
  ) {
    // Definitely presentation 3
    const type = entity['@type'] || entity.type;
    if (type === 'Manifest' || type === 'sc:Manifest') {
      // eslint-disable-next-line @typescript-eslint/camelcase
      const upgrade = new Upgrader({ default_lang: 'en', deref_links: false });
      return upgrade.processResource(entity, true);
      // convert manifest.
    }
    if (type === 'Collection' || type === 'sc:Collection') {
      // eslint-disable-next-line @typescript-eslint/camelcase
      const upgrade = new Upgrader({ default_lang: 'en', deref_links: false });
      return upgrade.processResource(entity, true);
    }
    // Image service.
    if (entity.profile) {
      // eslint-disable-next-line @typescript-eslint/camelcase
      const upgrade = new Upgrader({ default_lang: 'en', deref_links: false });
      return upgrade.processResource(entity, true);
    }
  }
  return entity;
}
