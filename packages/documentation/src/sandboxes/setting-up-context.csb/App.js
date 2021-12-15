import React from 'react';
import { VaultProvider } from '@hyperion-framework/react-vault';
import { LoadManifest } from './Manifest';

// Try switching this for your own manifest.
const url = 'https://wellcomelibrary.org/iiif/b18035723/manifest';

export default function App() {
  return (
    <VaultProvider>
      <div>This is inside the vault.</div>

      {/* We can create components that use the vault inside */}
      <LoadManifest manifest={url} />
    </VaultProvider>
  );
}
