const { Vault } = require('@hyperion-framework/vault');
const http = require('https');

const vault = new Vault({
  customFetcher: url => {
    return new Promise(resolve => {
      http.get(url, resp => {
        let data = '';
        resp.on('data', chunk => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          resolve(JSON.parse(data));
        });
      });
    });
  },
});

vault.loadManifest('https://wellcomelibrary.org/iiif/b18035723/manifest').then(manifest => {
  const canvas1 = vault.fromRef(manifest.items[0]);
  vault.getThumbnail(canvas1, {}, false).then(t => {
    console.log(t.best);
  });
});

