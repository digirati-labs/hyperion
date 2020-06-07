import { OmitProperties, Snippet } from '../utility';
import { TechnicalProperties } from '../iiif/technical';
import { LinkingProperties } from '../iiif/linking';
import { Manifest } from './manifest';
import { DescriptiveProperties } from '../iiif/descriptive';

type CollectionOmittedTechnical = 'format' | 'height' | 'width' | 'viewingDirection';
type CollectionOmittedLinking = 'startCanvas';

type CollectionStructural = {
  members?: Array<Snippet<Collection | Manifest>>;
  // @deprecated
  collections?: Snippet<Collection>[];
  // @deprecated
  manifests?: Snippet<Manifest>[];
};

/**
 * An ordered list of manifests, and/or further collections. Collections allow easy advertising and browsing of the
 * manifests in a hierarchical structure, potentially with its own descriptive information. They can also provide
 * clients with a means to locate all of the manifests known to the publishing institution.
 */
export interface Collection
  extends OmitProperties<TechnicalProperties, CollectionOmittedTechnical>,
    DescriptiveProperties,
    CollectionStructural,
    OmitProperties<LinkingProperties, CollectionOmittedLinking> {}
