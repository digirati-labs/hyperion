import {
  Manifest,
  InternationalString,
  ContentResource,
  Canvas,
  Service,
  Collection,
  ResourceType,
  ViewingDirection,
} from '@hyperion-framework/types';

class ManifestWrapper implements Manifest {
  behaviour: string[] = [];
  homepage: ContentResource[] = [];
  id: string;
  logo: ContentResource[] = [];
  motivation: string = '';
  partOf: Collection[] = [];
  rendering: ContentResource[] = [];
  seeAlso: ContentResource[] = [];
  service: Service[] = [];
  start: Canvas[] = [];
  readonly type: ResourceType = 'Manifest';
  viewingDirection: ViewingDirection = 'left-to-right';
  label: InternationalString;
  items: Canvas[] = [];

  constructor(id: string, label: InternationalString) {
    this.id = id;
    this.label = label;
  }
}

export default ManifestWrapper;
