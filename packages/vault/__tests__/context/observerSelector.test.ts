import { observeSelector } from '../../src/context/observeSelector';
import { createStore, defaultEntities, emptyManifest, importEntities, manifestContext } from '../../src';
import { createSelector } from '../../src/context/createSelector';

describe('context/observer-selector', () => {
  test('it works', async done => {
    const store = createStore();
    store.dispatch(
      importEntities({
        entities: {
          ...defaultEntities,
          Manifest: {
            'http://example.org/manifest.json': {
              ...emptyManifest,
              id: 'http://example.org/manifest.json',
              type: 'Manifest',
              label: { en: ['manifest label'] },
            },
            'http://example.org/manifest-2.json': {
              ...emptyManifest,
              id: 'http://example.org/manifest-2.json',
              type: 'Manifest',
              label: { en: ['manifest label 2'] },
            },
          },
        },
      })
    );

    const manifestSelector = createSelector({
      context: [manifestContext],
      selector: (state, ctx) => {
        return ctx.manifest.label;
      },
    });

    const { subscribe, updateContext } = observeSelector({
      context: manifestContext,
      initialValue: 'http://example.org/manifest.json',
      store,
      utility: {},
      selector: manifestSelector,
    });

    let times = 0;
    const expected = [{ en: ['manifest label'] }, { en: ['manifest label 2'] }];

    subscribe(state => {
      expect(state).toEqual(expected[times]);
      times++;
      if (times === 1) {
        updateContext('http://example.org/manifest-2.json');
      }
      if (times >= expected.length) {
        done();
      }
    });

    done();
  });
});
