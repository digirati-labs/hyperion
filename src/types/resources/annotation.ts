import { TechnicalProperties } from '../iiif/technical';
import { DescriptiveNormalized, DescriptiveProperties } from '../iiif/descriptive';
import { LinkingNormalized, LinkingProperties } from '../iiif/linking';
import { OmitProperties, SomeRequired } from '../utility';
import { ContentResource } from './contentResource';

type OmittedTechnical = 'format' | 'profile' | 'height' | 'width' | 'duration' | 'viewingDirection' | 'motivation';
type OmittedDescriptive = 'posterCanvas' | 'navDate' | 'language' | 'rights';
type OmittedLinking = 'start' | 'supplementary';

type Technical = OmitProperties<TechnicalProperties, OmittedTechnical>;
type Descriptive = OmitProperties<DescriptiveProperties, OmittedDescriptive>;
type Linking = OmitProperties<LinkingProperties, OmittedLinking>;

export type W3CMotivation =
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

export type AnyMotivation = W3CMotivation | string;

export type LinkedResource = string | { id: string } | any;

export type OtherProperties = {
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

export type ResourceBaseProperties = OtherProperties & {
  role?: string;
};

export type ExternalResourceTypes = 'Dataset' | 'Image' | 'Video' | 'Sound' | 'Text';

export type ExternalWebResource = ResourceBaseProperties & {
  id?: string;
  type: 'Dataset' | 'Image' | 'Video' | 'Sound' | 'Text';
  format?: string;
  language?: string | string[];
  processingLanguage?: string;
  textDirection?: 'ltr' | 'rtl' | 'auto';
};
export type EmbeddedResource = ResourceBaseProperties & {
  id?: string;
  type: 'TextualBody' | string;
  purpose?: string | string[];
  value?: string;
  language?: string | string[];
  format?: string;
};

export type SpecificResource = ResourceBaseProperties & {
  id?: string;
  type?: 'SpecificResource' | string;
  state?: State | State[];
  purpose?: AnyMotivation | AnyMotivation[];
  source?: LinkedResource; // @todo change to specific resource.
  selector?: Selector | Selector[];
  styleClass?: string;
  renderedVia?: Agent | Agent[];
  scope?: LinkedResource;
};

export type Body = string | EmbeddedResource | ExternalWebResource | SpecificResource;
export type Target = string | ExternalWebResource | SpecificResource;

export type RefinedBy = {
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

export type FragmentSelector = RefinedBy & {
  type: 'FragmentSelector';
  value: string;
  conformsTo?: string;
};

export type CssSelector = RefinedBy & {
  type: 'CssSelector';
  value: string;
};
export type XPathSelector = RefinedBy & {
  type: 'XPathSelector';
  value: string;
};
export type TextQuoteSelector = RefinedBy & {
  type: 'TextQuoteSelector';
  exact: string;
  prefix?: string;
  suffix?: string;
};
export type TextPositionSelector = RefinedBy & {
  type: 'TextPositionSelector';
  start: number;
  end: number;
};
export type DataPositionSelector = RefinedBy & {
  type: 'DataPositionSelector';
  start: number;
  end: number;
};
export type SvgSelector =
  | RefinedBy & {
      type: 'SvgSelector';
      value: string;
    }
  | {
      type: 'SvgSelector';
      id: string;
    };

export type RangeSelector<T> = {
  type: 'RangeSelector';
  startSelector: T;
  endSelector: T;
};

export type Selector =
  | string
  | FragmentSelector
  | CssSelector
  | XPathSelector
  | TextQuoteSelector
  | TextPositionSelector
  | DataPositionSelector
  | SvgSelector
  | RangeSelector<FragmentSelector>
  | RangeSelector<CssSelector>
  | RangeSelector<XPathSelector>
  | RangeSelector<TextQuoteSelector>
  | RangeSelector<TextPositionSelector>
  | RangeSelector<DataPositionSelector>
  | RangeSelector<SvgSelector>;

export type State = BasicState | TimeState | RequestHeaderState;

export type BasicState = RefinedByState & {
  id: string;
};

export type RefinedByState = {
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

export type TimeState =
  | RefinedByState & {
      type: 'TimeState';
      sourceDate: string | string[];
      cached?: string | string[];
    }
  | RefinedByState & {
      type: 'TimeState';
      sourceDateStart: string;
      sourceDateEnd: string;
      cached?: string | string[];
    };

export type RequestHeaderState = RefinedByState & {
  type: 'HttpRequestState';
  value: string;
};

export type Stylesheet =
  | {
      id: string;
      type: 'CssStylesheet';
    }
  | {
      type: 'CssStylesheet';
      format?: string;
      value?: string | string[];
    };

export type ChoiceBody = {
  id?: string;
  type: 'Choice';
  items: Body[];
};

export type ChoiceTarget = {
  type: 'Choice';
  items: Target[];
};

export type Creator = string | string[] | Agent | Agent[];

export type W3CAnnotationBody = Body | ChoiceBody;
export type W3CAnnotationTarget = Target | ChoiceTarget | TargetComposite | TargetList | TargetIndependents;

export type AnnotationBody = ChoiceBody | ContentResource;
export type AnnotationTarget = W3CAnnotationTarget | ContentResource;

export type TargetComposite = {
  type: 'Composite';
  items: Array<Target | string>;
};
export type TargetList = {
  type: 'List';
  items: Array<Target | string>;
};
export type TargetIndependents = {
  type: 'Independents';
  items: Array<Target | string>;
};

export type Audience = {
  id: string;
  type: 'Audience' | string;
  [T: string]: string;
};

export type Agent = {
  id?: string;
  type?: 'Person' | 'Organisation' | 'Software';
  name?: string | string[];
  nickname?: string;
  account?: string;
  email?: string;
  email_sha1?: string;
  homepage?: string | string[];
};

export type AnnotationW3C = OtherProperties & {
  '@context'?: 'http://www.w3.org/ns/anno.jsonld';
  body?: W3CAnnotationBody | W3CAnnotationBody[];
  bodyValue?: string;
  target?: W3CAnnotationTarget | W3CAnnotationTarget[];
  canonical?: string;
  via?: string;
  stylesheet?: string | Stylesheet;
};

export type AnnotationW3cNormalised = Required<OtherProperties> & {
  '@context': string | string[];
  body: AnnotationBody[] | [];
  bodyValue: string;
  target: AnnotationTarget[] | [];
  canonical: string;
  via: string;
  stylesheet: Stylesheet;
};

export interface Annotation
  extends SomeRequired<Technical, 'id' | 'type'>,
    Partial<Descriptive>,
    Partial<Linking>,
    Partial<OmitProperties<AnnotationW3C, 'body' | 'target'>> {
  body?: AnnotationBody | AnnotationBody[];
  target?: AnnotationTarget | AnnotationTarget[];
}

export interface AnnotationNormalized
  extends OmitProperties<TechnicalProperties, OmittedTechnical>,
    OmitProperties<DescriptiveNormalized, OmittedDescriptive>,
    OmitProperties<LinkingNormalized, OmittedLinking>,
    AnnotationW3cNormalised {}
