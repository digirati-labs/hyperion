import { observeContext } from '../../src/context/observeContext';
import { createStore } from '../../src/redux/createStore';
import { defaultEntities, emptyManifest, importEntities, manifestContext } from '../../src';

describe('context/observe-context', () => {
  test('it can handle changes to the state and context', done => {
    const store = createStore();

    const { subscribe, updateContext } = observeContext({
      context: manifestContext,
      initialValue: 'http://example.org/manifest.json',
      store,
      utility: {},
    });

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

    let times = 0;
    const expected = [{ en: ['manifest label'] }, { en: ['manifest label 2'] }];

    subscribe((state, context) => {
      expect(context.manifest.label).toEqual(expected[times]);
      times++;
      if (times === 1) {
        updateContext('http://example.org/manifest-2.json');
      }
      if (times >= expected.length) {
        done();
      }
    });
  });

});
