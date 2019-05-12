import React, { useContext, useEffect, useState } from 'react';
import {
  Context,
  useCanvas,
  useExternalManifest,
  useImageService,
  useManifest,
  useThumbnail,
  useVault,
  useVaultEffect,
} from '@hyperion-framework/react-vault';
import { canvasContext, combineContext, manifestContext, thumbnailSizeContext } from '@hyperion-framework/vault';
import { World } from '@hyperion-framework/atlas';
import { ImageService } from '@hyperion-framework/atlas';
import { TiledImage } from '@hyperion-framework/atlas';

const ReactWorldContext = React.createContext(null);

/**
 *
 * @returns World
 */
const useWorld = () => {
  return useContext(ReactWorldContext);
};

const WorldProvider = ({ children, width, height }) => {
  const [world, setWorld] = useState();

  useEffect(
    () => {
      if (!world) {
        setWorld(new World(width, height));
      }
    },
    [world]
  );

  return <ReactWorldContext.Provider value={world}>{children}</ReactWorldContext.Provider>;
};

const ViewerCanvas = ({ setZoom, ...props }) => {
  const canvas = useCanvas();
  const thumbnail = useThumbnail();
  const imageService = useImageService();
  const world = useWorld();

  useEffect(
    () => {
      if (imageService && imageService.tiles.length) {
        world.addObjectAt(
          {
            id: canvas.id,
            width: canvas.width,
            height: canvas.height,
            layers: [ImageService.fromImageService(imageService)],
          },
          { x: 0, y: 0, width: canvas.width, height: canvas.height }
        );
      }
    },
    [world, imageService]
  );

  if (world) {
    const points = world.getPointsAt({ width: 1000, height: 1000, x: 0, y: 0, scale: 1 });
    return (
      <div
        style={{ width: 1000, height: 1000, position: 'relative', border: '1px solid red' }}
      >
        {points.map(layer => {
          const lastPointIndex = (layer.points.length - 5) / 5;
          const p = [];
          for (let i = 0; i <= lastPointIndex; i++) {
            if (!layer.points[i * 5]) continue;
            p.push(
              <img
                key={layer.paintable.id + i}
                src={layer.paintable.getImageUrl(i)}
                style={{
                  outline: '1px solid blue',
                  position: 'absolute',
                  left: layer.points[i * 5 + 1],
                  top: layer.points[i * 5 + 2],
                  width: layer.points[i * 5 + 3] - layer.points[i * 5 + 1],
                  height: layer.points[i * 5 + 4] - layer.points[i * 5 + 2],
                }}
              />
            );
          }
          return <React.Fragment>{p}</React.Fragment>;
        })}
      </div>
    );
  }

  return <img key={thumbnail.id} src={thumbnail} alt="thumbnail" />;
};

const ViewerManifest = () => {
  const manifest = useManifest();
  const [currentCanvas, setCurrentCanvas] = useState(0);
  const [currentCanvasDimension, setCurrentCanvasDim] = useState();
  const [zoom, setZoom] = useState(1);

  useVaultEffect(
    vault => {
      const state = vault.getState();
      const canvas = state.hyperion.entities.Canvas[manifest.items[currentCanvas].id];
      setCurrentCanvasDim({ width: canvas.width, height: canvas.height });
    },
    [currentCanvas]
  );

  if (!currentCanvasDimension) {
    console.log(currentCanvas);
    return 'loading...';
  }

  return (
    <WorldProvider width={currentCanvasDimension.width} height={currentCanvasDimension.height}>
      <Context context={canvasContext(manifest.items[currentCanvas].id || manifest.items[0].id)}>
        <button
          disabled={currentCanvas <= 0}
          onClick={() => setCurrentCanvas(currentCanvas > 0 ? currentCanvas - 1 : currentCanvas)}
        >
          Prev
        </button>
        <button
          disabled={currentCanvas >= manifest.items.length}
          onClick={() =>
            setCurrentCanvas(currentCanvas < manifest.items.length - 1 ? currentCanvas + 1 : currentCanvas)
          }
        >
          Next
        </button>
        <br />
        <ViewerCanvas zoom={zoom} setZoom={setZoom} />
      </Context>
    </WorldProvider>
  );
  return <div>Manifest: {manifest.label.en.join('')}</div>;
};

export const ImageTest = () => {
  const { id, isLoaded } = useExternalManifest('https://view.nls.uk/manifest/7446/74464117/manifest.json');

  if (!isLoaded) {
    return <div>loading...</div>;
  }

  return (
    <Context context={combineContext(manifestContext(id), thumbnailSizeContext({}))}>
      <ViewerManifest />
    </Context>
  );
};
