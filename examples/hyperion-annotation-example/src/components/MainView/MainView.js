import React, { useState } from 'react';
import { useManifest, useCanvas, Context, useThumbnail } from '@hyperion-framework/react-vault';
import { PageLayout as Layout } from '../../blocks/PageLayout/PageLayout';
import { MainHeader } from '../MainHeader/MainHeader';
import { ThumbnailViewer as Thumbs } from '../../blocks/ThumbnailViewer/ThumbnailViewer';
import { canvasContext, thumbnailSizeContext } from '@hyperion-framework/vault';

const CanvasThumbnail = ({ cover = false, onClick, selected }) => {
  const thumbnail = useThumbnail();

  return (
    <Thumbs.Thumbnail cover={cover} onClick={onClick} selected={selected}>
      <Thumbs.ThumbnailWrapper>
        <Thumbs.ThumbnailImage src={thumbnail} />
      </Thumbs.ThumbnailWrapper>
    </Thumbs.Thumbnail>
  );
};

export const MainView = ({ setCurrentCanvas }) => {
  const manifest = useManifest();
  const canvas = useCanvas();
  const thumbnail = useThumbnail();
  const [currentMenu, setCurrentMenu] = useState('tweets');

  return (
    <Layout>
      <Layout.Header>
        <MainHeader onChangeMenu={setCurrentMenu} currentMenu={currentMenu} />
      </Layout.Header>
      <Layout.LeftPanel>
        <Context context={thumbnailSizeContext({})}>
          <Thumbs book-view large-cover>
            {manifest.items.map(({ id }, i) => (
              <Context context={canvasContext(id)} key={id}>
                <CanvasThumbnail cover={i === 0} onClick={() => setCurrentCanvas(id)} selected={id === canvas.id} />
              </Context>
            ))}
          </Thumbs>
        </Context>
      </Layout.LeftPanel>
      <Layout.RightPanel>
        {currentMenu}
        <button>Login</button>
      </Layout.RightPanel>
      <Layout.Content>
        <img src={thumbnail} style={{ margin: '0 auto', objectFit: 'contain', flex: '1 1 0px' }} />
      </Layout.Content>
      <Layout.ActionPanel />
      <Layout.Footer />
    </Layout>
  );
};
