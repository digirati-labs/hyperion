import React  from 'react';
import { useExternalManifest, ManifestProvider, useManifest } from '@hyperion-framework/react-vault';
import { manifestContext, createSelector } from '@hyperion-framework/vault';

const manifestLabelSelector = createSelector({
  context: [manifestContext],
  selector: ((state, ctx) => {
    return ctx.manifest.label.en.join('');
  })
});

function ManifestLabel() {
  const label = useManifest(manifestLabelSelector);

  return <div>{label}</div>
}

function App() {
  const { isLoaded, id } = useExternalManifest('https://adam-digirati.github.io/balenciaga1-behaviors.json');

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  return (
    <ManifestProvider id={id}>
      Hello react.
      <ManifestLabel/>
    </ManifestProvider>
  );

}

export default App;
