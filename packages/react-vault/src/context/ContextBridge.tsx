import React, { useContext } from 'react';
import { ResourceReactContext } from './ResourceContext';
import { ReactVaultContext, VaultProvider } from './VaultContext';
import { SimpleViewerReactContext } from '../viewers/SimpleViewerContext';
import { VisibleCanvasReactContext } from './VisibleCanvasContext';

export function useContextBridge() {
  return {
    VaultContext: useContext(ReactVaultContext),
    ResourceContext: useContext(ResourceReactContext),
    SimpleViewerReactContext: useContext(SimpleViewerReactContext),
    VisibleCanvasReactContext: useContext(VisibleCanvasReactContext),
  };
}

export const ContextBridge: React.FC<{ bridge: ReturnType<typeof useContextBridge> }> = props => {
  return (
    <VaultProvider vault={props.bridge.VaultContext.vault || undefined} resources={props.bridge.ResourceContext}>
      <VisibleCanvasReactContext.Provider value={props.bridge.VisibleCanvasReactContext}>
        <SimpleViewerReactContext.Provider value={props.bridge.SimpleViewerReactContext}>
          {props.children}
        </SimpleViewerReactContext.Provider>
      </VisibleCanvasReactContext.Provider>
    </VaultProvider>
  );
};
