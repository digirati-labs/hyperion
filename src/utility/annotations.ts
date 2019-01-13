type AnnotationSelector = {
  unit: 'percent' | 'pixel';
  x: number;
  y: number;
  width: number;
  height: number;
  id: string;
};

export function parseSelectorTarget(toParse: string): AnnotationSelector | string {
  if (!toParse) {
    return toParse;
  }
  const W3C_SELECTOR = /[#&?](xywh=)?(pixel:|percent:)?([0-9]+(\.[0-9]+)?),([0-9]+(\.[0-9]+)?),([0-9]+(\.[0-9]+)?),([0-9]+(\.[0-9]+)?)/;
  const match = W3C_SELECTOR.exec(toParse);

  if (match) {
    return {
      unit: match[2] === 'percent:' ? 'percent' : 'pixel',
      x: parseFloat(match[3]),
      y: parseFloat(match[5]),
      width: parseFloat(match[7]),
      height: parseFloat(match[9]),
      id: toParse.split('#')[0],
    };
  }
  return toParse;
}
