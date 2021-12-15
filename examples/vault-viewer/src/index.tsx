import React, { useState } from 'react';
import { render } from 'react-dom';
import { VaultProvider, SimpleViewerProvider } from '@hyperion-framework/react-vault';
import styled from 'styled-components';
import { HeaderPanel } from './components/HeaderPanel/HeaderPanel';
import { PanelsLayout } from './components/PanelsLayout/PanelsLayout';
import { ThumbnailList } from './components/ThumbnailList/ThumbnailList';
import { ImageViewer } from './components/ImageViewer/ImageViewer';
import { CanvasViewer } from './components/CanvasViewer/CanvasViewer';
import { manifests } from './manifests';
import { GlobalStyle } from './components/GlobalStyle/GlobalStyle';
import { ManifestList } from './components/ManifestList/ManifestList';

export const Container = styled.div`
  background: #000;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

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
