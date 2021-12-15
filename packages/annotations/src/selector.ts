import { AnnotationW3C, Selector, W3CAnnotationTarget } from '@hyperion-framework/types';

type ParsedTarget =
  | {
      type: 'List';
      items: ParsedTarget[];
    }
  | {
      type: string;
    };

export function parseSelector(selector: Selector | Selector[]): any {
  const primarySelector = Array.isArray(selector) ? selector[0] : selector;

  if (typeof primarySelector === 'string') {
    return parseSelector({
      type: 'FragmentSelector',
      value: primarySelector,
    });
  }

  switch (primarySelector.type) {
    case 'CssSelector':
    case 'DataPositionSelector':
    case 'FragmentSelector':
    case 'RangeSelector':
    case 'SvgSelector':
    case 'TextPositionSelector':
    case 'TextQuoteSelector':
    case 'XPathSelector':
    case 'AudioContentSelector':
    case 'ImageApiSelector':
    case 'PointSelector':
    case 'VisualContentSelector':
    default: {
      throw new Error('Selector not supported');
      break;
    }
  }
}

function parseTarget(target: W3CAnnotationTarget | W3CAnnotationTarget[]): any {
  const primaryTarget = Array.isArray(target) ? target[0] : target;

  if (typeof primaryTarget === 'string') {
    return parseTarget({
      id: primaryTarget,
      type: 'SpecificResource',
    });
  }

  if (!primaryTarget.type) {
    return parseTarget({
      ...primaryTarget,
      type: 'SpecificResource',
    });
  }

  switch (primaryTarget.type) {
    case 'Choice':
    case 'Independents':
    case 'List': {
      const parsedTargets = primaryTarget.items.map(t => parseTarget(t));
      return {
        type: primaryTarget.type,
        items: parsedTargets,
      };
    }
    case 'SpecificResource': {
      return {
        type: primaryTarget.type,
        selector: primaryTarget.selector ? parseSelector(primaryTarget.selector) : undefined,
      };
    }

    case 'Sound':
    case 'Video':
    case 'Text':
    case 'Dataset':
    default: {
      throw new Error('Target not supported');
      break;
    }
  }
}
