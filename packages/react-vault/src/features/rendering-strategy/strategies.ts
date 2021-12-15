import {
  AnnotationPageDescription,
  AudioSequence,
  ImageWithOptionalService,
  SingleAudio,
  SingleVideo,
  VideoSequence,
} from './resource-types';
import { ChoiceDescription } from './choice-types';

export type SingleImageStrategy = {
  type: 'images';
  image: ImageWithOptionalService;
  images: Array<ImageWithOptionalService>;
  choice?: ChoiceDescription;
  annotations?: AnnotationPageDescription;
};

export type MediaStrategy = {
  type: 'media';
  media: SingleAudio | SingleVideo | AudioSequence | VideoSequence;
  choice?: ChoiceDescription;
  annotations?: AnnotationPageDescription;
};

export type ComplexTimelineStrategy = {
  type: 'complex-timeline';
  items: Array<ImageWithOptionalService | SingleAudio | SingleVideo>;
  choice?: ChoiceDescription;
  annotations?: AnnotationPageDescription;
};

export type UnknownStrategy = {
  type: 'unknown';
  reason?: string;
  annotations?: AnnotationPageDescription;
};

export type RenderingStrategy = SingleImageStrategy | MediaStrategy | ComplexTimelineStrategy | UnknownStrategy;
