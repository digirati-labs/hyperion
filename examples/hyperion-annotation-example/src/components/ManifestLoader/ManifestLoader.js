import React, { useEffect, useState } from 'react';
import { Context, useExternalManifest, useVaultEffect } from '@hyperion-framework/react-vault';
import {
  manifestContext,
  createContext,
  combineContext,
  canvasContext,
  thumbnailSizeContext,
} from '@hyperion-framework/vault';
import { MainView } from '../MainView/MainView';

export const languageCtx = createContext({
  name: 'language',
  creator: currentLanguage => currentLanguage,
});

export const ManifestLoader = ({ children }) => {
  // this will eventually be dynamic.
  const [manifestUri, setManifestUri] = useState(
    window.location.hash.slice(1) || 'https://wellcomelibrary.org/iiif/b18035723/manifest'
  );
  const { isLoaded, id } = useExternalManifest(manifestUri);
  const [currentCanvas, setCurrentCanvas] = useState('');

  useEffect(() => {
    const listener = () => {
      if (window.location.hash.slice(1)) {
        setManifestUri(window.location.hash.slice(1));
      }
    };
    window.addEventListener('hashchange', listener);
    return () => {
      window.removeEventListener('hashchange', listener);
    };
  });

  useVaultEffect(
    vault => {
      if (isLoaded) {
        const s = vault.getState();
        const manifest = s.hyperion.entities.Manifest[id];
        if (manifest && !currentCanvas && manifest.items[0].id) {
          setCurrentCanvas(manifest.items[0].id);
        }
      }
    },
    [isLoaded, id, currentCanvas]
  );

  if (!isLoaded || !currentCanvas) {
    return 'loading...';
  }

  return (
    <Context
      context={combineContext(
        manifestContext(id),
        canvasContext(currentCanvas),
        languageCtx('en'),
        thumbnailSizeContext({ width: 500, height: 500 })
      )}
    >
      <MainView setCurrentCanvas={setCurrentCanvas} />
    </Context>
  );
};
