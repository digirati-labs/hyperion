import React, { useState } from 'react';
import {
  useManifest,
  useCanvas,
  useThumbnail,
  useVaultEffect,
  CanvasContext,
  useCanvasClock,
} from '@hyperion-framework/react-vault';
import { PageLayout as Layout } from '../../blocks/PageLayout/PageLayout';
import { MainHeader } from '../MainHeader/MainHeader';
import { ThumbnailViewer as Thumbs } from '../../blocks/ThumbnailViewer/ThumbnailViewer';

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const CanvasThumbnail = ({ cover = false, onClick, selected }) => {
  const thumbnail = useThumbnail({ minWidth: 100 });

  if (!thumbnail) {
    return null;
  }

  return (
    <Thumbs.Thumbnail cover={cover} onClick={onClick} selected={selected}>
      <Thumbs.ThumbnailWrapper>
        <Thumbs.ThumbnailImage src={thumbnail.id} />
      </Thumbs.ThumbnailWrapper>
    </Thumbs.Thumbnail>
  );
};

export const MainView = ({ setCurrentCanvas }) => {
  const manifest = useManifest();
  const canvas = useCanvas();
  const [thumbnail, setThumbnail] = useState();
  const { isPlaying, currentTime, play, seek, pause, duration } = useCanvasClock();

  const [currentMenu, setCurrentMenu] = useState('tweets');
  const [log, setLog] = useState([]);

  useVaultEffect(
    v => {
      v.getThumbnail(
        canvas,
        {
          maxHeight: 1000,
          maxWidth: 1000,
          explain: true,
        },
        true
      ).then(thumb => {
        console.log(canvas, thumb);
        setLog(thumb.log);
        if (thumb.best) {
          setThumbnail(thumb.best.id);
        }
      });
    },
    [canvas]
  );

  return (
    <Layout>
      <Layout.Header>
        <MainHeader onChangeMenu={setCurrentMenu} currentMenu={currentMenu} />
      </Layout.Header>
      <Layout.LeftPanel>
        <Thumbs book-view large-cover>
          {manifest.items.map(({ id }, i) => (
            <CanvasContext canvas={id} key={id}>
              <CanvasThumbnail cover={i === 0} onClick={() => setCurrentCanvas(id)} selected={id === canvas.id} />
            </CanvasContext>
          ))}
        </Thumbs>
      </Layout.LeftPanel>
      <Layout.RightPanel>
        {currentMenu}
        <button>Login</button>
      </Layout.RightPanel>
      <Layout.Content>
        <div>
          <button onClick={play}>play</button>
          <button onClick={pause}>pause</button>
          <button onClick={() => seek(duration - 10)}>go to near end</button>
          {isPlaying ? 'PLAYING' : 'PAUSED'}
          {currentTime} / {duration}
          {log.map((e, i) => (
            <pre>{e}</pre>
          ))}
        </div>
      </Layout.Content>
      <Layout.ActionPanel>
        <img src={thumbnail} style={{ margin: '0 auto', objectFit: 'contain', flex: '1 1 0px' }} />
      </Layout.ActionPanel>
      <Layout.Footer />
    </Layout>
  );
};
