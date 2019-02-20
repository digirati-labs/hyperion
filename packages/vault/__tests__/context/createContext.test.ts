import { defaultEntities } from '../../src';
import { createContext } from '../../src/context/createContext';
import { emptyManifest } from '../../src/resources/manifest';

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

    const contextValue = context(stateToUse, {});

    expect(contextValue).toEqual({
      manifest: {
        id: 'http://iiif.org/manifest.json',
        type: 'Manifest',
        ...emptyManifest,
      },
    });
  });
});
