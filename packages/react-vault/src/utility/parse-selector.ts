import { SupportedSelectors } from '../features/rendering-strategy/selector-extensions';
import { Selector } from '@hyperion-framework/types';

export type ParsedSelector = {
  selector: SupportedSelectors | null;
  selectors: SupportedSelectors[];
};

const BOX_SELECTOR = /&?(xywh=)?(pixel:|percent:)?([0-9]+(?:\.[0-9]+)?),([0-9]+(?:\.[0-9]+)?),([0-9]+(?:\.[0-9]+)?),([0-9]+(?:\.[0-9]+)?)/;

export default function parseSelector(source: Selector | Selector[]): ParsedSelector {
  if (Array.isArray(source)) {
    return (source as Array<string | Selector>).reduce(
      <ParseSelector>(data: ParsedSelector, nextSource: string | Selector) => {
        const { selector, selectors } = parseSelector(nextSource);
        if (selector) {
          if (!data.selector) {
            data.selector = selector;
          }
          data.selectors.push(...selectors);
        }
        return data;
      },
      {
        selector: null,
        selectors: [],
      } as ParsedSelector
    );
  }

  if (!source) {
    return {
      selector: null,
      selectors: [],
    };
  }

  if (typeof source === 'string') {
    const [id, fragment] = source.split('#');

    if (!fragment) {
      // This is an unknown selector.
      return {
        selector: null,
        selectors: [],
      };
    }

    return parseSelector({ type: 'FragmentSelector', value: fragment });
  }

  if (source.type === 'FragmentSelector') {
    const matchBoxSelector = BOX_SELECTOR.exec(source.value);
    if (matchBoxSelector) {
      return {
        selector: {
          type: 'BoxSelector',
          unit: matchBoxSelector[2] === 'percent:' ? 'percent' : 'pixel',
          x: parseFloat(matchBoxSelector[3]),
          y: parseFloat(matchBoxSelector[4]),
          width: parseFloat(matchBoxSelector[5]),
          height: parseFloat(matchBoxSelector[6]),
        },
        selectors: [],
      };
    }

    return {
      selector: null,
      selectors: [],
    };
  }

  return {
    selector: null,
    selectors: [],
  };
}
