import React from 'react';
import {
  useExternalManifest,
  useManifest,
  Context,
  useSelector,
  useVaultEffect,
} from '@hyperion-framework/react-vault';
import { manifestContext, createSelector } from '@hyperion-framework/vault';
import { NestedContext } from '../NestedContext/NestedContext';

function ManifestLabel() {
  const manifest = useManifest();
  const descriptive = useSelector(descriptiveFields);
  const [thumb, setThumb] = React.useState();

  useVaultEffect(vault => {
    if (manifest) {
      vault
        .getThumbnail(
          manifest,
          {
            maxHeight: 500,
            maxWidth: 500,
            unsafeImageService: false,
            returnAllOptions: true,
            preferFixedSize: true,
            explain: true,
          },
          true
        )
        .then(setThumb);
    }
  });

  return (
    <div style={{ border: '1px solid black', padding: 20, margin: 20 }}>
      <h3>{manifest.label.en.join('')}</h3>
      {thumb && thumb.best ? (
        <div>
          <img src={thumb.best.id} />
          <pre>{thumb.log.join('\n')}</pre>
        </div>
      ) : null}
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
      <LoadManifest id="https://purl.stanford.edu/bb475kg5932/iiif/manifest">
        <ManifestLabel />
      </LoadManifest>
      <LoadManifest id="https://view.nls.uk/manifest/9713/97134287/manifest.json">
        <ManifestLabel />
      </LoadManifest>
      <LoadManifest id="https://raw.githubusercontent.com/4d4mm/adam-digirati.github.io/master/balenciaga1.json">
        <ManifestLabel />
      </LoadManifest>
      <LoadManifest id="https://wellcomelibrary.org/iiif/b18035723/manifest">
        <ManifestLabel />
      </LoadManifest>
      <LoadManifest id="https://www.e-codices.unifr.ch/metadata/iiif/sl-0001/manifest.json">
        <ManifestLabel />
      </LoadManifest>
      <LoadManifest id="https://gallica.bnf.fr/iiif/ark:/12148/btv1b525060654/manifest.json">
        <ManifestLabel />
      </LoadManifest>
      <LoadManifest id="https://raw.githubusercontent.com/4d4mm/adam-digirati.github.io/master/balenciaga2.json">
        <ManifestLabel />
        <NestedContext />
      </LoadManifest>
    </div>
  );
}

export default App;
