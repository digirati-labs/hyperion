import { SpacialContent } from '../spacial-content';

export type Paintable = SpacialContent /*| TemporalContent*/;

export type Paint = [Paintable, Float32Array, Float32Array | undefined];
