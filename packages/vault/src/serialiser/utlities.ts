export function unArray<T>(input?: T[]): undefined | T | T[] {
  if (input && input.length === 1) {
    return input[0];
  }
  return input;
}

export function emptyObject(obj: any): boolean {
  return Object.keys(obj).length === 0;
}
