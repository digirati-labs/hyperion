import { SpacialContent } from './spacial-content/spacial-content';

export function bestResourceAtRatio<T extends SpacialContent>(ratio: number, resources: T[]): T | never {
  const len = resources.length;
  if (len === 0) {
    throw new Error('No resources passed in.');
  }

  let best = resources[0];
  for (let i = 0; i < len; i++) {
    best = Math.abs(resources[i].display.scale - ratio) < Math.abs(best.display.scale - ratio) ? resources[i] : best;
  }
  return best;
}
