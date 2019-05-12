import { createContext, emptyContext } from '../../src/context/createContext';
import { createSelector } from '../../src/context/createSelector';
import { emptyManifest, manifestContext } from '../../src/resources/manifest';
import { combineContext } from '../../src/context/combineContext';
import { defaultEntities, VaultState } from '../../src';

describe('create selector', () => {
  const createState = (): VaultState => ({
    hyperion: {
      entities: {
        ...defaultEntities,
      },
      mapping: {},
      requests: {},
    },
  });

  test('basic selector', () => {
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
          label: manifest.label ? manifest.label[ctx.language].join('') : null,
          summary: manifest.summary ? manifest.summary[ctx.language].join('') : null,
          metadata: manifest.metadata.map(({ label, value }) => ({
            label: label[ctx.language].join(''),
            value: value[ctx.language].join(''),
          })),
          requiredStatement: manifest.requiredStatement
            ? {
                label: manifest.requiredStatement.label[ctx.language].join(''),
                value: manifest.requiredStatement.value[ctx.language].join(''),
              }
            : null,
        };
      },
    });

    // Use our contexts
    const currentManifest = manifestContext('http://iiif.org/manifest.json');
    const englishLanguage = currentLanguage('en');

    // Set up some dummy state.
    const stateToUse = createState();
    stateToUse.hyperion.entities.Manifest['http://iiif.org/manifest.json'] = {
      ...emptyManifest,
      id: 'http://iiif.org/manifest.json',
      type: 'Manifest',
      label: { en: ['testing label'] },
      summary: { en: ['testing summary'] },
      requiredStatement: {
        label: { en: ['testing required statement label'] },
        value: { en: ['testing required statement value'] },
      },
      metadata: [{ label: { en: ['testing metadata label'] }, value: { en: ['testing metadata value'] } }],
    };

    const returnState = descriptiveFields(stateToUse, combineContext(englishLanguage, currentManifest), {});
    // Use our selector, passing in the context and state.
    // State + Context + Selector = Result.
    expect(returnState).toEqual({
      label: 'testing label',
      metadata: [{ label: 'testing metadata label', value: 'testing metadata value' }],
      requiredStatement: { label: 'testing required statement label', value: 'testing required statement value' },
      summary: 'testing summary',
    });
  });

  test('async selector', done => {
    const requestsSelector = createSelector({
      selector: async state => {
        return new Promise(resolve =>
          setTimeout(() => {
            resolve(state.hyperion.mapping);
          }, 500)
        );
      },
    });
    const stateToUse = createState();
    stateToUse.hyperion.mapping['http://example.org/manifest'] = 'Manifest';

    requestsSelector(stateToUse, emptyContext, {}).then(result => {
      expect(result).toEqual({ 'http://example.org/manifest': 'Manifest' });
      done();
    });
  });
});
