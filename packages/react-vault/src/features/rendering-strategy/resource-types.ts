import { AnnotationPage, ImageService, InternationalString } from '@hyperion-framework/types';
import { BoxSelector, TemporalBoxSelector, TemporalSelector } from './selector-extensions';

export type ImageWithOptionalService = {
  id: string;
  type: 'Image';
  service?: ImageService;
  width?: number;
  height?: number;
  sizes?: Array<{
    width: number;
    height: number;
  }>;
  target: BoxSelector | TemporalBoxSelector;
  selector: BoxSelector;
};

export type SingleAudio = {
  type: 'Sound';
  url: string;
  format: string;
  duration: number;
  target: TemporalSelector;
  /**
   * Which part of this audio should be used (cropping).
   */
  selector: TemporalSelector;
};

export type SingleVideo = {
  type: 'Video';
  url: string;
  format: string;
  duration: number;
  /**
   * Where on the canvas should this section of video be painted.
   */
  target: TemporalBoxSelector;

  /**
   * Which part of this video should be painted.
   */
  selector: TemporalBoxSelector;
};

export type AudioSequence = {
  type: 'SoundSequence';
  items: SingleAudio[];
};

export type VideoSequence = {
  type: 'VideoSequence';
  items: SingleVideo[];
};

// Similar to an annotation page itself, but virtual.
export type AnnotationPageDescription = {
  pages: AnnotationPage[];
};
