import React, { useEffect, useState } from 'react';
import {
  VaultProvider,
  Context,
  useExternalManifest,
  useManifest,
  useVault,
  useVaultEffect,
} from '@hyperion-framework/react-vault';
import { manifestContext, createContext, combineContext, canvasContext } from '@hyperion-framework/vault';
import { PageLayout as Layout } from '../../blocks/PageLayout/PageLayout';
import { MainHeader } from '../MainHeader/MainHeader';

export const languageCtx = createContext({
  name: 'language',
  creator: currentLanguage => currentLanguage,
});

export const MainView = () => {
  const { isLoaded, id } = useExternalManifest('https://wellcomelibrary.org/iiif/b18035723/manifest');
  const [currentCanvas, setCurrentCanvas] = useState('');
  const [currentMenu, setCurrentMenu] = useState('tweets');

  useVaultEffect((vault) => {
    if (isLoaded) {
      const s = vault.getState();
      const manifest = s.hyperion.entities.Manifest[ id ];
      if (manifest && !currentCanvas && manifest.items[0].id) {
        setCurrentCanvas(manifest.items[0].id)
      }
    }
  }, [isLoaded, id, currentCanvas]);

  if (!isLoaded || !currentCanvas) {
    return 'loading...';
  }

  return (
    <Context context={combineContext(manifestContext(id), canvasContext(currentCanvas), languageCtx('en'))}>
      <Layout>
        <Layout.Header>
          <MainHeader onChangeMenu={setCurrentMenu} currentMenu={currentMenu}/>
        </Layout.Header>
        <Layout.LeftPanel />
        <Layout.RightPanel>
          {currentMenu}
          <button>Login</button>
        </Layout.RightPanel>
        <Layout.Content />
        <Layout.ActionPanel />
        <Layout.Footer/>
      </Layout>
    </Context>
  );
};
