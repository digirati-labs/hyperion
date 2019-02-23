import { combineSelector } from '../../src/context/combineSelector';
import { createContext, createSelector, defaultEntities, combineContext } from '../../src';
import { emptyManifest, manifestContext } from '../../src/resources/manifest';

describe('context/combine-selector', () => {
  const createState = () => ({
    hyperion: {
      entities: {
        ...defaultEntities,
      },
      mapping: {},
      requests: {},
    },
  });

  test('it works', () => {
    const label = createSelector({
      context: [manifestContext],
      selector: (state, ctx) => ctx.manifest.label,
    });

    const summary = createSelector({
      context: [manifestContext],
      selector: (state, ctx) => ctx.manifest.summary,
    });

    const annotations = createSelector({
      context: [manifestContext],
      selector: (state, ctx) => ctx.manifest.annotations,
    });

    const selector = combineSelector([
      // Tuple of key/selector
      ['label', label],
      ['summary', summary],
      ['annotations', annotations],
    ]);

    // const selector = combineObjectSelector({
    //   label,
    //   summary,
    //   annotations,
    // });

    // set up our contexts.
    const currentManifest = manifestContext('http://iiif.org/manifest.json');

    // Set up some dummy state.
    const stateToUse = createState();
    stateToUse.hyperion.entities.Manifest['http://iiif.org/manifest.json'] = {
      ...emptyManifest,
      id: 'http://iiif.org/manifest.json',
      type: 'Manifest',
      label: { en: ['testing label'] },
      summary: { en: ['testing summary'] },
    };

    const endState = selector(stateToUse, currentManifest, {});

    expect(endState).toEqual({
      annotations: [],
      label: { en: ['testing label'] },
      summary: { en: ['testing summary'] },
    });
  });

  test('combine selector with multiple context', () => {
    // const emptyContextToUse = emptyContext();

    const labelSelector = createSelector({
      context: [manifestContext],
      selector: (state, ctx) => {
        return ctx.manifest.label;
      },
    });

    // Create a language context.
    const currentLanguage = createContext({
      name: 'language',
      creator: (langKey: string) => langKey,
    });

    // Add a big 'ol selector for some fields that use the language
    const descriptiveFields = createSelector({
      context: [manifestContext, currentLanguage],
      selector: (state, ctx) => {
        const manifest = ctx.manifest;
        return {
          metadata: manifest.metadata.map(({ label, value }) => ({
            label: label[ctx.language].join(''),
            value: value[ctx.language].join(''),
          })),
        };
      },
    });

    const combinedSelector = combineSelector([
      // Fields for combining.
      ['label', labelSelector],
      ['descriptive', descriptiveFields],
    ]);

    const en = currentLanguage('en');
    const currentManifest = manifestContext('http://iiif.org/manifest.json');

    const contextToUse = combineContext(en, currentManifest);
    // const combinedSelector = combinedSelectorObject({
    //   label: labelSelector,
    //   descriptive: descriptiveFields,
    // });

    const stateToUse = createState();
    stateToUse.hyperion.entities.Manifest['http://iiif.org/manifest.json'] = {
      ...emptyManifest,
      id: 'http://iiif.org/manifest.json',
      type: 'Manifest',
      label: { en: ['testing label'] },
      summary: { en: ['testing summary'] },
      metadata: [{ label: { en: ['testing metadata label'] }, value: { en: ['testing metadata value'] } }],
    };

    // This should throw a type error here.
    // Not allowed to use this outside of the manifest context, as required by label.
    const returnState = combinedSelector(stateToUse, contextToUse, {});

    expect(returnState).toEqual({
      descriptive: { metadata: [{ label: 'testing metadata label', value: 'testing metadata value' }] },
      label: { en: ['testing label'] },
    });
  });
});
