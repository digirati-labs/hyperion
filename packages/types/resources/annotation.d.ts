import { TechnicalProperties } from '../iiif/technical';
import { DescriptiveNormalized, DescriptiveProperties } from '../iiif/descriptive';
import { LinkingNormalized, LinkingProperties } from '../iiif/linking';
import { JsonLDContext, OmitProperties, SomeRequired } from '../utility';
import { ContentResource, ContentResourceString } from './contentResource';
import { Reference } from '../reference';

type AnnotationOmittedTechnical =
  | 'format'
  | 'profile'
  | 'height'
  | 'width'
  | 'duration'
  | 'viewingDirection'
  | 'motivation';
type AnnotationOmittedDescriptive =
  | 'posterCanvas'
  | 'accompanyingCanvas'
  | 'placeholderCanvas'
  | 'navDate'
  | 'language'
  | 'rights';
type AnnotationOmittedLinking = 'services' | 'start' | 'supplementary';

type AnnotationTechnical = OmitProperties<TechnicalProperties, AnnotationOmittedTechnical>;
type AnnotationDescriptive = OmitProperties<DescriptiveProperties, AnnotationOmittedDescriptive>;
type AnnotationLinking = OmitProperties<LinkingProperties, AnnotationOmittedLinking>;

export declare type W3CMotivation =
  | 'assessing'
  | 'bookmarking'
  | 'classifying'
  | 'commenting'
  | 'describing'
  | 'editing'
  | 'highlighting'
  | 'identifying'
  | 'linking'
  | 'moderating'
  | 'questioning'
  | 'replying'
  | 'tagging';

export declare type AnyMotivation = W3CMotivation | string;

export declare type LinkedResource = string | { id: string } | any;

export declare type OtherProperties = {
  // Lifecycle properties.
  created?: string;
  generated?: string;
  modified?: string;
  creator?: Creator;
  generator?: Creator;
  // Intended audience
  audience?: Audience | Audience[];
  accessibility?: string | string[];
  motivation?: AnyMotivation | AnyMotivation[];
  // Rights
  rights?: string | string[];
  // Other identities
  canonical?: string;
  via?: string | string[];
};

export declare type OtherPropertiesNormalized = {
  // Lifecycle properties.
  created: string | null;
  generated: string | null;
  modified: string | null;
  creator: CreatorNormalized;
  generator: CreatorNormalized;
  // Intended audience
  audience: Audience[];
  accessibility: string[];
  motivation: AnyMotivation[];
  // Rights
  rights: string[];
  // Other identities
  canonical: string | null;
  via: string[];
};

export declare type ResourceBaseProperties = OtherProperties & {
  role?: string;
};

export declare type ExternalResourceTypes = 'Dataset' | 'Image' | 'Video' | 'Sound' | 'Text';

export declare type ExternalWebResource = ResourceBaseProperties & {
  id?: string;
  type: 'Dataset' | 'Image' | 'Video' | 'Sound' | 'Text';
  format?: string;
  language?: string | string[];
  processingLanguage?: string;
  textDirection?: 'ltr' | 'rtl' | 'auto';
};
export declare type EmbeddedResource = ResourceBaseProperties & {
  id?: string;
  type: 'TextualBody';
  purpose?: string | string[];
  value?: string;
  language?: string | string[];
  format?: string;
};

export declare type SpecificResource = ResourceBaseProperties & {
  id?: string;
  type?: 'SpecificResource';
  state?: State | State[];
  purpose?: AnyMotivation | AnyMotivation[];
  source?: LinkedResource; // @todo change to specific resource.
  selector?: Selector | Selector[];
  styleClass?: string;
  renderedVia?: Agent | Agent[];
  scope?: LinkedResource;
};

export declare type Body = string | EmbeddedResource | ExternalWebResource | SpecificResource;
export declare type Target = string | ExternalWebResource | SpecificResource;

export declare type RefinedBy = {
  refinedBy?:
    | string
    | FragmentSelector
    | CssSelector
    | XPathSelector
    | TextQuoteSelector
    | TextPositionSelector
    | DataPositionSelector
    | SvgSelector;
};

export declare type FragmentSelector = RefinedBy & {
  type: 'FragmentSelector';
  value: string;
  conformsTo?: string;
};

export declare type CssSelector = RefinedBy & {
  type: 'CssSelector';
  value: string;
};
export declare type XPathSelector = RefinedBy & {
  type: 'XPathSelector';
  value: string;
};
export declare type TextQuoteSelector = RefinedBy & {
  type: 'TextQuoteSelector';
  exact: string;
  prefix?: string;
  suffix?: string;
};
export declare type TextPositionSelector = RefinedBy & {
  type: 'TextPositionSelector';
  start: number;
  end: number;
};
export declare type DataPositionSelector = RefinedBy & {
  type: 'DataPositionSelector';
  start: number;
  end: number;
};
export declare type SvgSelector =
  | (RefinedBy & {
      type: 'SvgSelector';
      value: string;
    })
  | {
      type: 'SvgSelector';
      id: string;
    };

export declare type RangeSelector<T> = {
  type: 'RangeSelector';
  startSelector: T;
  endSelector: T;
};

// IIIF Extensions

/**
 * The Image API Selector is used to describe the operations available via the Image API in order to retrieve a
 * particular image representation. In this case the resource is the abstract image as identified by the IIIF Image
 * API base URI plus identifier, and the retrieval process involves adding the correct parameters after that base URI.
 * For example, the top left hand quadrant of an image has the region parameter of pct:0,0,50,50 which must be put into
 * the requested URI to obtain the appropriate representation.
 *
 * In order to make this as easy as possible for the situations when a IIIF Image API endpoint exists, we introduce a
 * new Selector class called ImageApiSelector. It has properties that give the parameter values needed to fill out the
 * URL structure in the request. If the property is not given, then a default should be used.
 *
 * One use of this is within the IIIF Presentation API, when a Canvas is being painted by part of an image, or an image
 * that requires rotation before display.
 */
type ImageApiSelector = {
  type: 'ImageApiSelector';
  /**
   * The string to put in the region parameter of the URI.
   * Default: "full"
   */
  region?: string;

  /**
   * The string to put in the size parameter of the URI.
   * Default: "full"
   */
  size?: string;

  /**
   * The string to put in the rotation parameter of the URI. Note that this must be a string in order to allow
   * mirroring, for example “!90”.
   * Default: "0"
   */
  rotation?: string;

  /**
   * The string to put in the quality parameter of the URI.
   * Default: "default"
   */
  quality?: string;

  /**
   * The string to put in the format parameter of the URI. Note that the ‘.’ character is not part of the format,
   * just the URI syntax.
   * Default: "jpg"
   */
  format?: string;
};

/**
 * There are common use cases in which a point, rather than a range or area, is the target of the Annotation. For
 * example, putting a pin in a map should result in an exact point, not a very small rectangle. Points in time are not
 * very short durations, and user interfaces should also treat these differently. This is particularly important when
 * zooming in (either spatially or temporally) beyond the scale of the frame of reference. Even if the point takes up a
 * 10 by 10 pixel square at the user’s current resolution, it is not a rectangle bounding an area.
 *
 * It is not possible to select a point using URI Fragments with the Media Fragment specification, as zero-sized
 * fragments are not allowed. In order to fulfill the use cases, this specification defines a new Selector class
 * called PointSelector.
 */
export type PointSelector = {
  type: 'PointSelector';
  /**
   * Optional. An integer giving the x coordinate of the point, relative to the dimensions of the target resource.
   */
  x?: number;
  /**
   * Optional. An integer giving the y coordinate of the point, relative to the dimensions of the target resource.
   */
  y?: number;
  /**
   * Optional. A floating point number giving the time of the point in seconds, relative to the duration of the target
   * resource.
   */
  t?: number;
};

export type AudioContentSelector = {
  type: 'AudioContentSelector';
};

export type VisualContentSelector = {
  type: 'VisualContentSelector';
};

export declare type Selector =
  | string
  | FragmentSelector
  | CssSelector
  | XPathSelector
  | TextQuoteSelector
  | TextPositionSelector
  | DataPositionSelector
  | SvgSelector
  | ImageApiSelector
  | PointSelector
  | AudioContentSelector
  | VisualContentSelector
  | RangeSelector<FragmentSelector>
  | RangeSelector<CssSelector>
  | RangeSelector<XPathSelector>
  | RangeSelector<TextQuoteSelector>
  | RangeSelector<TextPositionSelector>
  | RangeSelector<DataPositionSelector>
  | RangeSelector<SvgSelector>
  | RangeSelector<PointSelector>;

export declare type State = BasicState | TimeState | RequestHeaderState;

export declare type BasicState = RefinedByState & {
  id: string;
};

export declare type RefinedByState = {
  refinedBy?:
    | FragmentSelector
    | CssSelector
    | XPathSelector
    | TextQuoteSelector
    | TextPositionSelector
    | DataPositionSelector
    | SvgSelector
    | State;
};

export declare type TimeState =
  | (RefinedByState & {
      type: 'TimeState';
      sourceDate: string | string[];
      cached?: string | string[];
    })
  | (RefinedByState & {
      type: 'TimeState';
      sourceDateStart: string;
      sourceDateEnd: string;
      cached?: string | string[];
    });

export declare type RequestHeaderState = RefinedByState & {
  type: 'HttpRequestState';
  value: string;
};

export declare type Stylesheet =
  | {
      id: string;
      type: 'CssStylesheet';
    }
  | {
      type: 'CssStylesheet';
      format?: string;
      value?: string | string[];
    };

export declare type ChoiceBody = {
  id?: string;
  type: 'Choice';
  items: Body[];
};

export declare type ChoiceTarget = {
  type: 'Choice';
  items: Target[];
};

export declare type Creator = string | string[] | Agent | Agent[];
export declare type CreatorNormalized = string[] | Agent[];

export declare type W3CAnnotationBody = Body | ChoiceBody;
export declare type W3CAnnotationTarget = Target | ChoiceTarget | TargetComposite | TargetList | TargetIndependents;

export declare type AnnotationBody = ChoiceBody | ContentResource | ContentResourceString;
export declare type AnnotationTarget = W3CAnnotationTarget | ContentResource | ContentResourceString;

export declare type TargetComposite = {
  type: 'Composite';
  items: Array<Target | string>;
};
export declare type TargetList = {
  type: 'List';
  items: Array<Target | string>;
};
export declare type TargetIndependents = {
  type: 'Independents';
  items: Array<Target | string>;
};

export declare type Audience = {
  id: string;
  type: 'Audience' | string;
  [T: string]: string;
};

export declare type Agent = {
  id?: string;
  type?: 'Person' | 'Organisation' | 'Software';
  name?: string | string[];
  nickname?: string;
  account?: string;
  email?: string;
  email_sha1?: string;
  homepage?: string | string[];
  // ?
  'schema:softwareVersion'?: any;
};

export declare type AnnotationW3C = OtherProperties & {
  '@context'?: 'http://www.w3.org/ns/anno.jsonld';
  body?: W3CAnnotationBody | W3CAnnotationBody[];
  bodyValue?: string;
  target?: W3CAnnotationTarget | W3CAnnotationTarget[];
  canonical?: string;
  via?: string;
  stylesheet?: string | Stylesheet;
};

export declare type AnnotationW3cNormalised = JsonLDContext &
  Partial<OtherPropertiesNormalized> & {
    body: Array<Reference<'ContentResource'>>;
    bodyValue?: string | null;
    target: Array<Reference<'ContentResource'>>;
    stylesheet?: Stylesheet | null;
  };

export interface Annotation
  extends SomeRequired<AnnotationTechnical, 'id' | 'type'>,
    Partial<AnnotationDescriptive>,
    Partial<AnnotationLinking>,
    Partial<OmitProperties<AnnotationW3C, 'body' | 'target'>> {
  body?: AnnotationBody | AnnotationBody[];
  target?: AnnotationTarget | AnnotationTarget[];
}

export interface AnnotationNormalized
  extends SomeRequired<OmitProperties<TechnicalProperties, AnnotationOmittedTechnical>, 'id' | 'type'>,
    Partial<OmitProperties<DescriptiveNormalized, AnnotationOmittedDescriptive>>,
    Partial<OmitProperties<LinkingNormalized, AnnotationOmittedLinking>>,
    AnnotationW3cNormalised {}
