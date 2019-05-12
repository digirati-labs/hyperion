import { SpacialContent } from './spacial-content/spacial-content';

export function bestResourceAtRatio<T extends SpacialContent>(ratio: number, resources: T[]): T | never {
  if (resources.length === 0) {
    throw new Error('No resources passed in.');
  }

  return resources.reduce((previous: T, current: T) => {
    return Math.abs(current.display.scale - ratio) < Math.abs(previous.display.scale - ratio) ? current : previous;
  });
}
