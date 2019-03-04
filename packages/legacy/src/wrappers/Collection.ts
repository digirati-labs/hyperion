import {
  AnnotationCollection,
  Canvas,
  Collection,
  ContentResource, InternationalString,
  Manifest, ResourceType, Service, ViewingDirection
} from '@hyperion-framework/types';

class CollectionWrapper implements Collection {
  id: string;
  behaviour = [];
  homepage: ContentResource[] = [];
  logo: ContentResource[] = [];
  motivation: string = '';
  partOf: Array<ContentResource | Canvas | AnnotationCollection> = [];
  rendering: ContentResource[] = [];
  seeAlso: ContentResource[] = [];
  service: Service[] = [];
  type: ResourceType = 'Collection';
  viewingDirection: ViewingDirection = 'left-to-right';
  label: InternationalString;
  items: Array<Collection | Manifest> = [];

  constructor(id: string, label: InternationalString) {
    this.id = id;
    this.label = label;
  }
}

export default CollectionWrapper;
