import {SingleReference} from '../reference';
import {OmitProperties} from '../utility';

export type InternationalString = {
    [language: string]: string[];
};

export type MetadataItem = {
    label: InternationalString;
    value: InternationalString;
};

export type DescriptiveProperties = {
    label: InternationalString | null;
    metadata: MetadataItem[];
    summary: InternationalString | null;
    requiredStatement: InternationalString | null;
    rights: string | null;
    navDate: string | null;
    language: string[];
    // @todo Thumbnail
    thumbnail: any;
    // @todo Poster canvas
    posterCanvas: any;
};

export type DescriptiveNormalized = OmitProperties<DescriptiveProperties, 'thumbnail' | 'posterCanvas'> & {
    thumbnail: Array<SingleReference<'contentResource'>>;
    posterCanvas: SingleReference<'canvas'> | null;
};
