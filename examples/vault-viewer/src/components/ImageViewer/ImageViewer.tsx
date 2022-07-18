import React, { FC, useLayoutEffect, useRef } from 'react';
import {
  useCanvas,
  ContextBridge,
  useContextBridge,
  CanvasContext,
  useVisibleCanvases,
} from '@hyperion-framework/react-vault';
import { AtlasAuto } from '@atlas-viewer/atlas';
import { CanvasViewer } from '../CanvasViewer/CanvasViewer';

export const ImageViewer: FC = () => {
  const canvas = useCanvas();
  const runtime = useRef<any>();
  const bridge = useContextBridge();

  useLayoutEffect(() => {
    if (runtime.current) {
      runtime.current.world.goHome(true);
    }
  }, [canvas]);

  if (!canvas) {
    return null;
  }

  return (
    <AtlasAuto
      onCreated={ctx => (runtime.current = ctx.runtime as any)}
      style={{ flex: '1 1 0px', height: 'calc(100% - 10px)' }}
    >
      <ContextBridge bridge={bridge}>
        <MultiImageViewer />
      </ContextBridge>
    </AtlasAuto>
  );
};

const MultiImageViewer = ({ marginWidth = 40 }: { marginWidth?: number }) => {
  const canvases = useVisibleCanvases();
  let width = 0;
  const canvasComponents = [];
  for (const canvas of canvases) {
    canvasComponents.push(
      <CanvasContext canvas={canvas.id} key={canvas.id}>
        <CanvasViewer x={width} />
      </CanvasContext>
    );
    width += canvas.width + marginWidth;
  }

  return <>{canvasComponents}</>;
};
