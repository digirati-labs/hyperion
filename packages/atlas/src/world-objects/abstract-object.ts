import { Paintable } from './paint';

export interface AbstractObject {
  id: string;
  height: number;
  width: number;
  layers: Paintable[];
}
