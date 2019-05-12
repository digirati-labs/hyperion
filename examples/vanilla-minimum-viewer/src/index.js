import { fromRef, loadManifest, subscribe } from '@hyperion-framework/vault';

const manifestId = 'https://adam-digirati.github.io/balenciaga1-behaviors.json';

loadManifest(manifestId).then(res => {
  document.getElementById('title').innerText = res.label.en[0];

  const $canvasList = document.getElementById('canvasList');
  $canvasList.innerHTML = '';

  for (let ref of res.items) {
    const canvas = fromRef(ref);
    if (canvas) {
      // Loop canvases
      canvas.items.forEach(annotationPageRef => {
        const annotationPage = fromRef(annotationPageRef);
        // Loop the annotation pages.
        annotationPage.items.forEach(annotationRef => {
          // Loop the annotations.
          const annotation = fromRef(annotationRef);
          // Map the body
          annotation.body.map(resource => {
            // Loop the bodies of the annotations.
            if (resource.id) {
              const $image = document.createElement('img');
              $image.src = resource.id;
              $image.width = 100;
              $canvasList.append($image);
            }
          });
        });
      });
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
