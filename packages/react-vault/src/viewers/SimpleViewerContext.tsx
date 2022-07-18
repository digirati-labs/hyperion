import React, { useCallback, useContext, useEffect } from 'react';
/**
 * Simple viewer context
 * *****************************************************************************
 *
 * This will be the context to use to get a basic IIIF viewer up and running.
 * It will not focus on having compatibility with the full range of IIIF
 * resources, instead offering a viewer for a Manifest, cycling through canvases
 * while ignoring the paged/facing-pages/continuous behaviors.
 *
 * There will not be support for canvas-on-canvas annotations. Annotations will
 * be filtered, giving details of the canvas space and images to be annotated
 * onto that space. The demo implementation of this viewer will use
 * OpenSeadragon to display.
 *
 * Navigation functions will include the basics:
 * - nextCanvas()
 * - previousCanvas()
 * - goToCanvas(id)
 * - goToCanvasIndex(idx)
 * - goToFirstCanvas()
 * - goToLastCanvas()
 *
 * It will take in only a Manifest ID and will load that Manifest when the
 * context loads.
 *
 * There will be no support for external or embedded annotation lists, although
 * you can set up a nested context to support this.
 *
 * There will be no support for ranges in this view.
 *
 * To use this component, first you will need the provider:
 * import { SimpleViewerProvider } from '...';
 *
 * <SimpleViewerProvider id="http://example.org/manifest.json">
 *   <CustomComponent />
 * </SimpleViewerProvider>
 *
 * This is in addition to the core Vault context further up the tree.
 *
 * In components that you want to use parts of the state you can grab the hooks
 * from this file.
 *
 * import { useSimpleViewer } from '...';
 *
 * And use them in your components to get the actions.
 *
 * function NextButton() {
 *   const { nextCanvas } = useSimpleViewer();
 *
 *   return <button onClick={nextCanvas}>Next</button>;
 * }
 *
 * Since this is a single-context, there is only ever one manifest, canvas and
 * annotation list. You can access the current resource using the normal hooks.
 *
 * function CanvasMetadata() {
 *   const metadata = useCanvas(metadataSelector);
 *
 *   return <div> ... </div>
 * }
 *
 * So long as this is inside the provider, it will have the correct context.
 */
import { createContext, FC, useMemo, useState } from 'react';
import { useExternalManifest } from '../hooks/useExternalManifest';
import { ManifestContext } from '../context/ManifestContext';
import { CanvasContext } from '../context/CanvasContext';
import { VisibleCanvasReactContext } from '../context/VisibleCanvasContext';

type SimpleViewerContext = {
  setCurrentCanvasId: (newId: string | ((prev: string) => string)) => void;
  setCurrentCanvasIndex: (newId: number | ((prev: number) => number)) => void;
  currentCanvasIndex: number;
  pagingView: boolean;
  totalCanvases: number;
  nextCanvas: () => void;
  previousCanvas: () => void;
};

const noop = () => {
  //
};

export const SimpleViewerReactContext = createContext<SimpleViewerContext>({
  setCurrentCanvasId: noop,
  setCurrentCanvasIndex: noop,
  nextCanvas: noop,
  previousCanvas: noop,
  currentCanvasIndex: -1,
  totalCanvases: 0,
  pagingView: true,
});

export const SimpleViewerProvider: FC<{ manifest: string }> = props => {
  const manifest = useExternalManifest(props.manifest);
  const [currentCanvasId, setCurrentCanvasId] = useState('');
  const [visible, setVisible] = useState<string[]>([]);
  const pagingView = manifest.manifest && manifest.manifest.behavior && manifest.manifest.behavior.includes('paged');

  useEffect(() => {
    if (manifest.manifest) {
      setCurrentCanvasId(manifest.manifest.items[0]?.id);
      setVisible([manifest.manifest.items[0]?.id]);
    }
  }, [manifest.manifest, props.manifest]);

  const canvasList = useMemo(() => {
    return manifest.manifest?.items.map(c => c.id) || [];
  }, [manifest.manifest, props.manifest]);

  const currentCanvasIndex = useMemo(() => canvasList.indexOf(currentCanvasId), [canvasList, currentCanvasId]);

  const nextCanvas = useCallback(() => {
    if (canvasList.length && currentCanvasId) {
      if (currentCanvasIndex === -1) {
        // This is an error?
        return;
      }
      if (
        canvasList[currentCanvasIndex + 2]
          ? currentCanvasIndex + 2 === canvasList.length
          : currentCanvasIndex === canvasList.length
      ) {
        // We are at the end.
        return;
      }
      const newCanvas =
        pagingView && currentCanvasIndex !== 0
          ? canvasList[currentCanvasIndex + 2]
          : canvasList[currentCanvasIndex + 1];

      const pageCanvas = pagingView
        ? currentCanvasIndex !== 0
          ? canvasList[currentCanvasIndex + 3]
          : canvasList[currentCanvasIndex + 2]
        : null;

      if (newCanvas) {
        setCurrentCanvasId(newCanvas);
        setVisible(pageCanvas ? [newCanvas, pageCanvas] : [newCanvas]);
      }
    }
  }, [pagingView, canvasList, currentCanvasId, currentCanvasIndex]);

  const previousCanvas = useCallback(() => {
    if (canvasList.length && currentCanvasId) {
      if (currentCanvasIndex === 0 || currentCanvasIndex === -1) {
        return;
      }

      const newCanvas =
        pagingView && currentCanvasIndex !== 1
          ? canvasList[currentCanvasIndex - 2]
          : canvasList[currentCanvasIndex - 1];
      const pageCanvas = pagingView && currentCanvasIndex !== 1 ? canvasList[currentCanvasIndex - 1] : null;
      if (newCanvas) {
        setCurrentCanvasId(newCanvas);
        setVisible(pageCanvas ? [newCanvas, pageCanvas] : [newCanvas]);
      }
    }
  }, [pagingView, canvasList, currentCanvasId, currentCanvasIndex]);

  const setCurrentCanvasIndex = useCallback(
    (idx: number) => {
      const realIdx = pagingView && idx % 2 === 1 ? idx - 1 : idx;
      const newId = canvasList[realIdx];
      const newNextId = pagingView && realIdx !== 0 ? canvasList[realIdx + 1] : null;
      if (newId) {
        setCurrentCanvasId(newId);
        setVisible(prevValue => {
          const newValue = newNextId ? [newId, newNextId] : [newId];
          if (prevValue.length === prevValue.length) {
            for (let i = 0; i < prevValue.length; i++) {
              if (prevValue[i] !== newValue[i]) {
                return newValue;
              }
            }
            return prevValue;
          }
          return newValue;
        });
      }
    },
    [pagingView, canvasList]
  );

  const internalSetCurrentCanvasId = useCallback(
    (nextId: string) => {
      const idx = canvasList.indexOf(nextId);
      if (idx !== -1) {
        setCurrentCanvasIndex(idx);
      }
    },
    [canvasList, setCurrentCanvasIndex]
  );

  const ctx = useMemo(
    () =>
      ({
        // Extra functions.
        setCurrentCanvasId: internalSetCurrentCanvasId,
        nextCanvas,
        previousCanvas,
        currentCanvasIndex,
        totalCanvases: canvasList.length,
        setCurrentCanvasIndex,
        pagingView: true,
      } as SimpleViewerContext),
    [nextCanvas, previousCanvas, currentCanvasIndex, canvasList, setCurrentCanvasIndex, internalSetCurrentCanvasId]
  );

  if (!manifest.isLoaded || !manifest.manifest) {
    return <div>Loading...</div>;
  }

  return (
    <SimpleViewerReactContext.Provider value={ctx}>
      <VisibleCanvasReactContext.Provider value={visible}>
        <ManifestContext manifest={manifest.manifest.id}>
          <CanvasContext canvas={currentCanvasId}>{props.children}</CanvasContext>
        </ManifestContext>
      </VisibleCanvasReactContext.Provider>
    </SimpleViewerReactContext.Provider>
  );
};

export function useSimpleViewer() {
  return useContext(SimpleViewerReactContext);
}
