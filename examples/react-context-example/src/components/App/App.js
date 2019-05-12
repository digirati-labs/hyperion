import React from 'react';
import { useExternalManifest, useManifest, Context, useSelector } from '@hyperion-framework/react-vault';
import { manifestContext, createSelector } from '@hyperion-framework/vault';
import { NestedContext } from '../NestedContext/NestedContext';

function ManifestLabel() {
  const manifest = useManifest();
  const descriptive = useSelector(descriptiveFields);

  return (
    <div style={{ border: '1px solid black', padding: 20, margin: 20 }}>
      <h3>{manifest.label.en.join('')}</h3>
      <ul>
        {descriptive.map(({ label, value }, k) => {
          return (
            <div key={k}>
              <strong>{label}:</strong> {value}
            </div>
          );
        })}
      </ul>
    </div>
  );
}

const descriptiveFields = createSelector({
  context: [manifestContext],
  selector: (state, ctx) => {
    const manifest = ctx.manifest;
    return manifest.metadata.map(({ label, value }) => ({
      label: (label.en || label['@none']).join(''),
      value: (value.en || value['@none']).join(''),
    }));
  },
});

function LoadManifest({ id: loadId, children }) {
  const { isLoaded, id } = useExternalManifest(loadId);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return <Context context={manifestContext(id)}>{children}</Context>;
}

function App() {
  return (
    <div>
      <LoadManifest id="https://dlib.indiana.edu/iiif_av/jwd/chopin.json">
        <ManifestLabel />
      </LoadManifest>
      <LoadManifest id="https://adam-digirati.github.io/balenciaga1.json">
        <ManifestLabel />
      </LoadManifest>
      <LoadManifest id="https://adam-digirati.github.io/balenciaga2.json">
        <ManifestLabel />
        <NestedContext />
      </LoadManifest>
    </div>
  );
}

export default App;
