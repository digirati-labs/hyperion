import {TechnicalProperties} from '../iiif/technical';
import {DescriptiveNormalized, DescriptiveProperties} from '../iiif/descriptive';
import {LinkingNormalized, LinkingProperties} from '../iiif/linking';
import {OmitProperties, SomeRequired} from '../utility';

type OmittedTechnical = 'format' | 'profile' | 'height' | 'width' | 'duration' | 'viewingDirection' | 'motivation';
type OmittedDescriptive  =  'posterCanvas' | 'navDate' | 'language' | 'rights';
type OmittedLinking  = 'start' | 'supplementary';

type Technical = OmitProperties<TechnicalProperties, OmittedTechnical>;
type Descriptive = OmitProperties<DescriptiveProperties, OmittedDescriptive>;
type Linking = OmitProperties<LinkingProperties, OmittedLinking>;

type W3CMotivation =
    'assessing' |
    'bookmarking' |
    'classifying' |
    'commenting' |
    'describing' |
    'editing' |
    'highlighting' |
    'identifying' |
    'linking' |
    'moderating' |
    'questioning' |
    'replying' |
    'tagging';

type AnyMotivation = W3CMotivation | string;

type LinkedResource = string | {id: string} | any;

type OtherProperties = {
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

type ResourceBaseProperties = OtherProperties & {
    role?: string;
};

type ExternalWebResource = ResourceBaseProperties & {
    id?: string;
    type: 'Dataset' | 'Image' | 'Video' | 'Sound' | 'Text';
    format?: string;
    language?: string;
    processingLanguage?: string;
    textDirection: 'ltr' | 'rtl' | 'auto';
};
type EmbeddedResource = ResourceBaseProperties & {
    id?: string;
    type: 'TextualBody' | string;
    purpose?: string | string[];
    value?: string;
    language?: string | string[];
    format?: string;
};

type SpecificResource = ResourceBaseProperties & {
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

type Body = string | EmbeddedResource | ExternalWebResource | SpecificResource;
type Target = string | ExternalWebResource | SpecificResource;

type RefinedBy = {
    refinedBy?: string |
        FragmentSelector |
        CssSelector |
        XPathSelector |
        TextQuoteSelector |
        TextPositionSelector |
        DataPositionSelector |
        SvgSelector;
};

type FragmentSelector = RefinedBy & {
    type: 'FragmentSelector';
    value: string;
    conformsTo?: string;
};

type CssSelector = RefinedBy & {
    type: 'CssSelector';
    value: string;
};
type XPathSelector = RefinedBy & {
    type: 'XPathSelector';
    value: string;
};
type TextQuoteSelector = RefinedBy & {
    type: 'TextQuoteSelector';
    exact: string;
    prefix?: string;
    suffix?: string;
};
type TextPositionSelector = RefinedBy & {
    type: 'TextPositionSelector';
    start: number;
    end: number;
};
type DataPositionSelector = RefinedBy & {
    type: 'DataPositionSelector';
    start: number;
    end: number;
};
type SvgSelector = RefinedBy & {
    type: 'SvgSelector';
    value: string;
} | {
    type: 'SvgSelector';
    id: string;
};

type RangeSelector<T> = {
    type: 'RangeSelector';
    startSelector: T;
    endSelector: T;
};

type Selector = string |
    FragmentSelector |
    CssSelector |
    XPathSelector |
    TextQuoteSelector |
    TextPositionSelector |
    DataPositionSelector |
    SvgSelector |
    RangeSelector<FragmentSelector> |
    RangeSelector<CssSelector> |
    RangeSelector<XPathSelector> |
    RangeSelector<TextQuoteSelector> |
    RangeSelector<TextPositionSelector> |
    RangeSelector<DataPositionSelector> |
    RangeSelector<SvgSelector>;

type State = BasicState | TimeState | RequestHeaderState;

type BasicState = RefinedByState & {
    id: string;
};

type RefinedByState = {
    refinedBy?: FragmentSelector |
        CssSelector |
        XPathSelector |
        TextQuoteSelector |
        TextPositionSelector |
        DataPositionSelector |
        SvgSelector |
        State;
};

type TimeState = RefinedByState & {
    type: 'TimeState';
    sourceDate: string | string[];
    cached?: string | string[];
} | RefinedByState & {
    type: 'TimeState';
    sourceDateStart: string;
    sourceDateEnd: string;
    cached?: string | string[];
};

type RequestHeaderState = RefinedByState & {
    type: 'HttpRequestState';
    value: string;
};

type Stylesheet = {
    id: string;
    type: 'CssStylesheet';
} | {
    type: 'CssStylesheet';
    value?: string | string[];
};

type ChoiceBody = {
    id?: string;
    type: 'Choice';
    items: Body[];
};

type ChoiceTarget = {
    type: 'Choice';
    items: Target[];
};

type Creator = string | string[] | Agent | Agent[];

type AnnotationBody = Body | string | ChoiceBody;
type AnnotationTarget = Target | string | ChoiceTarget | TargetComposite | TargetList | TargetIndependents;

type TargetComposite = {
    type: 'Composite';
    items: Array<Target | string>;
};
type TargetList = {
    type: 'List';
    items: Array<Target | string>;
};
type TargetIndependents = {
    type: 'Independents';
    items: Array<Target | string>;
};

type Audience = {
  id: string;
  type: 'Audience' | string;
  [T: string]: string;
};

type Agent = {
  id?: string;
  type?: 'Person' | 'Organisation' | 'Software';
  name?: string | string[];
  nickname?: string;
  account?: string;
  email?: string;
  email_sha1?: string;
  homepage?: string | string[];
};

type AnnotationW3C = OtherProperties & {
  '@context': 'http://www.w3.org/ns/anno.jsonld';
  body?: AnnotationBody | AnnotationBody[];
  bodyValue?: string;
  target?: AnnotationTarget | AnnotationTarget[];
  canonical?: string;
  via?: string;
  stylesheet?: string | Stylesheet;
};

export interface Annotation extends
    SomeRequired<Technical, 'id' | 'type'>,
    Partial<Descriptive>,
    Partial<Linking>,
    AnnotationW3C {
}

export interface AnnotationNormalized extends
    OmitProperties<TechnicalProperties, OmittedTechnical>,
    OmitProperties<DescriptiveNormalized, OmittedDescriptive>,
    OmitProperties<LinkingNormalized, OmittedLinking> {
}
