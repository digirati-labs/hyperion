import React, { useEffect } from 'react';
import {
  useExternalCollection,
  useSelector,
  Context,
  useManifest,
  useExternalManifest,
  useImageMatrix,
} from '@hyperion-framework/react-vault';
import {
  createSelector,
  collectionContext,
  thumbnailSizeContext,
  combineContext,
  canvasContext,
  manifestContext,
  MatrixViewer,
} from '@hyperion-framework/vault';
import { useAsyncSelector, useThumbnail, useImageService } from '@hyperion-framework/react-vault';

const viewCollectionSelector = createSelector({
  context: [collectionContext],
  selector: (state, ctx) => ({
    label: ctx.collection.label ? ctx.collection.label.en.join('') : 'Untitled',
    manifests: ctx.collection.items.filter(item => item.type === 'Manifest'),
  }),
});

export const ViewCanvas = () => {
  const thumb = useThumbnail();
  const service = useImageService();
  const world = useImageMatrix();

  // const { world, viewer } = useImageMatrix({ width: 700, height: 500, loadImageService: true, singleCanvas: true });

  // <ViewerContext width={} height={}> </ViewerContext>
  // const niceHelper = useViewer('testing', { width: 700, height: 500 })
  // niceHelper.getPainting(); // Array<{url, type, x, y, w, h}>
  // const { translate, scale, scaleToPoint, viewerUnitToCanvasUnit, deltaTranslate } = useViewerActions();

  if (world) {
    const test = new MatrixViewer(world);
    test.addView('testing', { width: 700, height: 500 });

    world.setGroup(service.id, `${service.id}--4`);

    const renderables = test.getView('testing');
    if (renderables && renderables[0]) {
      const choice = renderables[0];
      const len = choice.points.length / 5;
      const images = [];

      for (let x = 0; x < len; x++) {
        const [x1, y1, x2, y2] = choice.displayPoints.subarray(x * 5 + 1, x * 5 + 5);
        images.push(
          <img
            src={`${service.id}/${x1},${y1},${x2 - x1},${y2 - y1}/${(x2 - x1) / choice.displayScale},${(y2 - y1) /
              choice.displayScale}/0/default.jpg`}
            style={{
              position: 'absolute',
              width: choice.points[x * 5 + 3] - choice.points[x * 5 + 1],
              height: choice.points[x * 5 + 4] - choice.points[x * 5 + 2],
              left: choice.points[x * 5 + 1],
              top: choice.points[x * 5 + 2],
            }}
          />
        );
      }

      return <div style={{ background: '#000', width: 700, height: 500, position: 'relative' }}>{images}</div>;
    }
  }

  return (
    thumb && (
      <img
        alt={service && service.tiles.length ? 'Image service available' : 'loading...'}
        src={thumb.uri}
        height={thumb.height}
        width={thumb.width}
      />
    )
  );
};

export const ViewManifest = () => {
  const manifest = useManifest();
  const { isLoaded } = useExternalManifest(manifest.id);
  const [isLoadedAsync, value] = useAsyncSelector(asyncTestSelector);

  return (
    <div>
      <h5>{manifest.label.en.join()}</h5>
      {isLoadedAsync ? value : 'loading async...'}
      <a style={{ fontSize: 10 }} href={manifest.id}>
        {manifest.id}
      </a>
      <div>{manifest.items.length} canvases found.</div>
      <div>
        {manifest.items.slice(0, 2).map(canvas => {
          return (
            <Context key={canvas.id} context={canvasContext(canvas.id)}>
              <ViewCanvas />
            </Context>
          );
        })}
      </div>
      <div>{isLoaded ? 'Fully loaded!' : 'loading more fields'}</div>
    </div>
  );
};

let tick = 0;
const asyncTestSelector = createSelector({
  context: [manifestContext],
  selector: async (state, ctx) => {
    tick++;
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(tick);
      }, 1000);
    });
  },
});

export const ViewCollection = () => {
  const collection = useSelector(viewCollectionSelector);

  return (
    <div>
      <h4>{collection.label}</h4>
      {collection.manifests.slice(0, 3).map(manifest => (
        <Context key={manifest.id} context={manifestContext(manifest.id)}>
          <ViewManifest />
        </Context>
      ))}
    </div>
  );
};

export const SimpleCollection = () => {
  const { isLoaded, id } = useExternalCollection('https://view.nls.uk/collections/7446/74466699.json');
  // const { isLoaded, id } = useExternalCollection('https://wellcomelibrary.org/service/collections/topics/6-Phytase/');
  // const { isLoaded, id } = useExternalCollection('http://manifests.ydc2.yale.edu/manifest');
  // const { isLoaded, id } = useExternalCollection('https://iiif.bodleian.ox.ac.uk/iiif/collection/arabic');
  if (!isLoaded) {
    return <div>loading..</div>;
  }

  return (
    <Context context={combineContext(collectionContext(id), thumbnailSizeContext({}))}>
      <ViewCollection />
    </Context>
  );
};
