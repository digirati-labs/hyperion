import { allFromRef, loadManifest, subscribe, getThumbnail } from '@hyperion-framework/vault';

const manifestId = 'https://wellcomelibrary.org/iiif/b18035723/manifest';

loadManifest(manifestId).then(async res => {
  document.getElementById('title').innerText = res.label.en[0];

  const $canvasList = document.getElementById('canvasList');
  $canvasList.innerHTML = '';

  for (const canvas of allFromRef(res.items)) {
    if (canvas) {
      const { best } = await getThumbnail(canvas, { maxWidth: 300 }, true);

      if (best) {
        const $image = document.createElement('img');
        $image.src = best.id;
        $image.width = 300;
        $canvasList.append($image);
      }
    }

    // Add our label to the Dom.
    const $item = document.createElement('div');
    $item.innerText = canvas.label ? canvas.label.en[0] : 'untitled canvas';
    $canvasList.append($item);
  }
});

const $loadingState = document.getElementById('loading-state');
subscribe(
  state => state.hyperion.requests[manifestId],
  (res, vault) => {
    if (res) {
      $loadingState.innerText = res.loadingState;
    }
  }
);
