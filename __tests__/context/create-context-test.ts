import { combineContext, createContext, createSelector } from '../../packages/vault/src/context/createContext';
import { defaultEntities } from '../../packages/vault/src';
import { emptyManifest } from '../../packages/vault/src/resources/manifest';

describe('create context', () => {
  const createState = () => ({
    hyperion: {
      entities: {
        ...defaultEntities,
      },
      mapping: {},
      requests: {},
    },
  });

  test('basic context creation', () => {
    const createManifestContext = createContext({
      name: 'manifest',
      creator: (id: string) => ({ id, type: 'Manifest' }),
      resolve: (ref, state) => {
        return state.hyperion.entities.Manifest[ref.id];
      },
    });

    const context = createManifestContext('http://iiif.org/manifest.json');

    const stateToUse = createState();
    stateToUse.hyperion.entities.Manifest['http://iiif.org/manifest.json'] = {
      id: 'http://iiif.org/manifest.json',
      type: 'Manifest',
      ...emptyManifest,
    };

    expect(context(stateToUse, {})).toEqual({
      manifest: {
        id: 'http://iiif.org/manifest.json',
        type: 'Manifest',
        ...emptyManifest,
      },
    });
  });
  test('basic selector', () => {
    // Create a manifest context.
    const manifestContext = createContext({
      name: 'manifest',
      creator: (id: string) => ({ id, type: 'Manifest' }),
      resolve: (ref, state) => {
        return state.hyperion.entities.Manifest[ref.id];
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
          label: manifest.label ? manifest.label[ctx.language].join('') : null,
          summary: manifest.summary ? manifest.summary[ctx.language].join('') : null,
          metadata: manifest.metadata.map(({ label, value }) => ({
            label: label[ctx.language].join(''),
            value: value[ctx.language].join('')
          })),
          requiredStatement: manifest.requiredStatement ? {
            label: manifest.requiredStatement.label[ctx.language].join(''),
            value: manifest.requiredStatement.value[ctx.language].join(''),
          } : null,
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
    };

    // Use our selector, passing in the context and state.
    // State + Context + Selector = Result.
    expect(descriptiveFields(stateToUse, combineContext(englishLanguage, currentManifest), {})).toEqual({
      label: 'testing label',
      summary: null,
      metadata: [],
      requiredStatement: null,
    });
  });
});
