import React, { FC } from 'react';
import { CanvasContext, useManifest, useSimpleViewer, useThumbnail } from '@hyperion-framework/react-vault';

export const Thumbnail: FC<{ onClick: () => void }> = ({ onClick }) => {
  const thumb = useThumbnail({
    maxHeight: 300,
    maxWidth: 300,
  });

  if (!thumb) {
    return null;
  }

  return <img height={50} src={thumb.id} alt="" loading="lazy" onClick={onClick} />;
};

export const ThumbnailList: FC = () => {
  const manifest = useManifest();
  const { setCurrentCanvasId } = useSimpleViewer();

  return (
    <div style={{ maxHeight: '100%' }}>
      {manifest?.items.map(item => {
        return (
          <CanvasContext key={item.id} canvas={item.id}>
            <Thumbnail onClick={() => setCurrentCanvasId(item.id)} />
          </CanvasContext>
        );
      })}
    </div>
  );
};
