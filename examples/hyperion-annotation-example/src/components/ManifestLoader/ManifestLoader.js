import React, { useEffect, useState } from 'react';
import { ResourceProvider, useExternalManifest } from '@hyperion-framework/react-vault';
import { MainView } from '../MainView/MainView';

export const ManifestLoader = () => {
  // this will eventually be dynamic.
  const [manifestUri, setManifestUri] = useState(
    window.location.hash.slice(1) || 'https://wellcomelibrary.org/iiif/b18035723/manifest'
  );
  const { isLoaded, id, manifest } = useExternalManifest(manifestUri);
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

  useEffect(
    () => {
      if (isLoaded) {
        if (manifest && !currentCanvas && manifest.items[0].id) {
          setCurrentCanvas(manifest.items[0].id);
        }
      }
    },
    [manifest, isLoaded, id, currentCanvas]
  );

  if (!isLoaded || !currentCanvas) {
    return 'loading...';
  }

  return (
    <ResourceProvider
      value={{
        manifest: manifest.id,
        canvas: currentCanvas,
      }}
    >
      <MainView setCurrentCanvas={setCurrentCanvas} />
    </ResourceProvider>
  );
};
