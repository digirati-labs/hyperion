import React, { useState } from 'react';
import { render } from 'react-dom';
import {
  VaultProvider,
  SimpleViewerProvider,
  useVault,
  useCanvas,
  useManifest,
  useEventListener,
  useAnnotationPageManager,
  useResources,
} from '@hyperion-framework/react-vault';
import styled, { createGlobalStyle } from 'styled-components';
import { HeaderPanel } from './components/HeaderPanel/HeaderPanel';
import { PanelsLayout } from './components/PanelsLayout/PanelsLayout';
import { ThumbnailList } from './components/ThumbnailList/ThumbnailList';
import { ImageViewer } from './components/ImageViewer/ImageViewer';
import { CanvasViewer } from './components/CanvasViewer/CanvasViewer';
import { HeaderPanelButton } from './components/HeaderPanel/HeaderPanel.styles';
import { InternationalString } from '@hyperion-framework/types';

export const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
  }
`;

export const Container = styled.div`
  background: #000;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const manifests = [
  { label: 'Medical', url: 'https://iiif.wellcomecollection.org/presentation/b28929780' },
  { label: 'Wunder', url: 'https://iiif.wellcomecollection.org/presentation/v2/b18035723' },
  { label: 'Linking fixtures', url: 'https://digirati-co-uk.github.io/iiif-canvas-panel/extra-fixtures/linking.json' },
  { label: 'Wellcome medicine 2', url: 'https://iiif.wellcomecollection.org/presentation/b22439948' },
  { label: 'Wellcome', url: 'https://iiif.wellcomecollection.org/presentation/b19974760_244_0084' },
  { label: 'Ocean liners', url: 'https://stephenwf.github.io/ocean-liners.json' },
  {
    label: 'Composition',
    url: 'https://preview.iiif.io/cookbook/3333-choice/recipe/0036-composition-from-multiple-images/manifest.json',
  },
  { label: 'Fire', url: 'https://tomcrane.github.io/fire/fire3.json' },
  { label: 'Book', url: 'https://view.nls.uk/manifest/1256/5202/125652021/manifest.json' },
  // { label: 'The Biocrats', url: 'https://wellcomelibrary.org/iiif/b18035978/manifest' },
  { label: 'Greenfly eye', url: 'https://wellcomelibrary.org/iiif/b23984958/manifest' },
  { label: 'Apocalypse', url: 'https://wellcomelibrary.org/iiif/b19684915/manifest' },
  { label: 'Cookbook deep zoom', url: 'https://iiif.io/api/cookbook/recipe/0005-image-service/manifest.json' },
  { label: 'Newspaper', url: 'https://d.lib.ncsu.edu/collections/catalog/nubian-message-1995-04-01/manifest' },
];

const getLabel = (str: InternationalString | undefined, defaultValue: string) => {
  if (!str) {
    return defaultValue;
  }
  const keys = Object.keys(str);
  if (!keys.length) {
    return defaultValue;
  }
  return str[keys[0]][0];
};

export function ManifestList({ manifestIndex, setManifestIndex }: { manifestIndex: number; setManifestIndex: any }) {
  const vault = useVault();
  const canvas = useCanvas();
  const currentManifest = useManifest();
  const {
    availablePageIds,
    enabledPageIds,
    setPageEnabled,
    setPageDisabled,
  } = useAnnotationPageManager(currentManifest?.id, { all: true });
  const availablePages = useResources(availablePageIds, 'AnnotationPage');

  useEventListener(canvas, 'onClick', (e: any) => {
    console.log(canvas);
  });

  return (
    <div>
      {manifests.map((manifest, idx) => {
        return (
          <HeaderPanelButton
            style={{ display: 'block', color: '#fff', margin: 10 }}
            key={manifest.url}
            disabled={idx === manifestIndex}
            onClick={() => {
              vault.loadManifest(manifest.url).then(() => {
                setManifestIndex(idx);
              });
            }}
          >
            {manifest.label}
          </HeaderPanelButton>
        );
      })}

      {availablePages.length ? (
        <div style={{ margin: 10 }}>
          <h4>Annotations</h4>
          {availablePages.map((page, n) => {
            const enabled = enabledPageIds.indexOf(page.id) !== -1;
            return (
              <HeaderPanelButton
                key={n}
                style={{ display: 'block', color: '#fff' }}
                onClick={() => {
                  if (enabled) {
                    setPageDisabled(page.id);
                  } else {
                    if (!vault.requestStatus(page.id)) {
                      vault.load(page.id);
                    }
                    setPageEnabled(page.id);
                  }
                }}
              >
                {enabled ? 'Hide' : 'Show'} {getLabel(page.label, `list ${n + 1}`)}
              </HeaderPanelButton>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function App() {
  const [manifestIndex, setManifestIndex] = useState(0);

  return (
    <VaultProvider>
      <SimpleViewerProvider manifest={manifests[manifestIndex].url} key={manifestIndex}>
        <GlobalStyle />
        <Container>
          <HeaderPanel />
          <PanelsLayout
            leftPanel={{
              title: 'Contents',
              content: (
                <div>
                  <ThumbnailList />
                </div>
              ),
              enabled: true,
              closeDefault: true,
            }}
            rightPanel={{
              title: 'Test Manifests',
              content: <ManifestList manifestIndex={manifestIndex} setManifestIndex={setManifestIndex} />,
              enabled: true,
              closeDefault: false,
            }}
          >
            <ImageViewer>
              <CanvasViewer />
            </ImageViewer>
          </PanelsLayout>
        </Container>
      </SimpleViewerProvider>
    </VaultProvider>
  );
}

const $el = document.getElementById('root');
if ($el) {
  render(<App />, $el);
}
