import React from 'react';
import { useExternalManifest } from '@hyperion-framework/react-vault';

export function LoadManifest(props) {
  const { manifest, isLoaded } = useExternalManifest(props.manifest);

  if (!isLoaded || !manifest) {
    return <div>Loading...</div>;
  }

  return <h2>{manifest.label.none[0]}</h2>;
}
