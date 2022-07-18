import React, { FC } from 'react';
import { TileSet } from '@atlas-viewer/atlas';
import { useCanvas, useResourceEvents, useRenderingStrategy, useThumbnail } from '@hyperion-framework/react-vault';
import { RenderAnnotationPage } from '../RenderAnnotationPage/RenderAnnotationPage';

export const CanvasViewer: FC<{ x?: number; y?: number }> = ({ x, y }) => {
  const canvas = useCanvas();
  const elementProps = useResourceEvents(canvas, 'deep-zoom');
  const [strategy] = useRenderingStrategy({
    strategies: ['images'],
  });
  const thumbnail = useThumbnail({ maxWidth: 256, maxHeight: 256 });

  return (
    <world-object height={canvas.height} width={canvas.width} x={x} y={y} {...elementProps}>
      {strategy.type === 'images'
        ? strategy.images.map((image, idx) => {
            return (
              <React.Fragment key={image.id}>
                {!image.service ? (
                  <world-image
                    uri={image.id}
                    target={image.target}
                    display={
                      image.width && image.height
                        ? {
                            width: image.width,
                            height: image.height,
                          }
                        : undefined
                    }
                  />
                ) : (
                  <TileSet
                    key={image.service.id}
                    tiles={{
                      id: image.service.id,
                      height: image.height,
                      width: image.width,
                      imageService: image.service as any,
                      thumbnail: idx === 0 && thumbnail && thumbnail.type === 'fixed' ? thumbnail : undefined,
                    }}
                    x={image.target?.x}
                    y={image.target?.y}
                    width={image.target?.width}
                    height={image.target?.height}
                  />
                )}
              </React.Fragment>
            );
          })
        : null}
      {strategy.annotations && strategy.annotations.pages
        ? strategy.annotations.pages.map(page => {
            return <RenderAnnotationPage key={page.id} page={page} />;
          })
        : null}
    </world-object>
  );
};
