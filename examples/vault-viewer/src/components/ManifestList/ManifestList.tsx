import {
  useAnnotationPageManager,
  useCanvas,
  useEventListener,
  useManifest,
  useResources,
  useVault,
} from '@hyperion-framework/react-vault';
import { HeaderPanelButton } from '../HeaderPanel/HeaderPanel.styles';
import React from 'react';
import { manifests } from '../../manifests';
import { InternationalString } from '@hyperion-framework/types';

const getLabel = (str: InternationalString | undefined, defaultValue: string) => {
  if (!str) {
    return defaultValue;
  }
  const keys = Object.keys(str);
  if (!keys.length) {
    return defaultValue;
  }
  return str[keys[0]][0];
};

export function ManifestList({ manifestIndex, setManifestIndex }: { manifestIndex: number; setManifestIndex: any }) {
  const vault = useVault();
  const canvas = useCanvas();
  const currentManifest = useManifest();
  const {
    availablePageIds,
    enabledPageIds,
    setPageEnabled,
    setPageDisabled,
  } = useAnnotationPageManager(currentManifest?.id, { all: true });
  const availablePages = useResources(availablePageIds, 'AnnotationPage');

  useEventListener(canvas, 'onClick', (e: any) => {
    console.log(canvas);
  });

  return (
    <div>
      {manifests.map((manifest, idx) => {
        return (
          <HeaderPanelButton
            style={{ display: 'block', color: '#fff', margin: 10 }}
            key={manifest.url}
            disabled={idx === manifestIndex}
            onClick={() => {
              vault.loadManifest(manifest.url).then(() => {
                setManifestIndex(idx);
              });
            }}
          >
            {manifest.label}
          </HeaderPanelButton>
        );
      })}

      {availablePages.length ? (
        <div style={{ margin: 10 }}>
          <h4>Annotations</h4>
          {availablePages.map((page, n) => {
            const enabled = enabledPageIds.indexOf(page.id) !== -1;
            return (
              <HeaderPanelButton
                key={n}
                style={{ display: 'block', color: '#fff' }}
                onClick={() => {
                  if (enabled) {
                    setPageDisabled(page.id);
                  } else {
                    if (!vault.requestStatus(page.id)) {
                      vault.load(page.id);
                    }
                    setPageEnabled(page.id);
                  }
                }}
              >
                {enabled ? 'Hide' : 'Show'} {getLabel(page.label, `list ${n + 1}`)}
              </HeaderPanelButton>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
