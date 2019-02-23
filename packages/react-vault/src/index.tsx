import React, { useContext, useEffect, useState } from 'react';
import {
  createContext,
  createContextReturn,
  createSelector,
  defaultEntities,
  VaultState,
  emptyManifest,
} from '@hyperion-framework/vault';
import { InternationalString } from '@hyperion-framework/types';

const manifestContext = createContext({
  name: 'manifest',
  creator: (id: string) => ({ id, type: 'Manifest' }),
  resolve: (ref, state) => {
    return state.hyperion.entities.Manifest[ref.id];
  },
});

// const ManifestContext = React.createContext(manifestContext(''));

const mySelector = createSelector({
  context: [manifestContext],
  selector: (state, ctx) => ctx.manifest.label,
});

function ReactContextFactory<N extends string, T, C, R>(
  hyperionContext: createContextReturn<N, T, C, R>,
  defaultValue: T
) {
  const ReactContext = React.createContext(hyperionContext(defaultValue));

  function Wrapper<Ch>({ id, children }: { id: T; children: Ch }) {
    const [currentCtx, setCtx] = useState(defaultValue);

    useEffect(
      () => {
        setCtx(id);
      },
      [id]
    );

    if (!currentCtx) {
      return children;
    }

    return <ReactContext.Provider value={hyperionContext(currentCtx)}>{children}</ReactContext.Provider>;
  }

  return { ReactContext, Wrapper, hyperionContext };
}

const Manifest = ReactContextFactory(manifestContext, '');

function useSelector<C, R>(selector: (state: VaultState, ...args: any[]) => R, context: C): R {
  return selector(
    {
      hyperion: {
        entities: {
          ...defaultEntities,
          Manifest: {
            'http://testmanifest': {
              ...emptyManifest,
              id: 'http://iiif.org/manifest.json',
              type: 'Manifest',
              label: { en: ['testing label'] },
              summary: { en: ['testing summary'] },
            },
          },
        },
        mapping: {},
        requests: {},
      },
    },
    context,
    {}
  );
}

function useManifestLabel(): InternationalString | null {
  const manifest = useContext(Manifest.ReactContext);

  return useSelector(mySelector, manifest);
}

function Test() {
  const label = useManifestLabel();

  return <div>{label && label.en ? label.en.join('') : ''}</div>;
}

export default function App() {
  return (
    <Manifest.Wrapper id="http://testmanifest">
      <Test />
    </Manifest.Wrapper>
  );
}
