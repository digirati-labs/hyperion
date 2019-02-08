import { select, loadManifest, subscribe } from '@hyperion-framework/vault';

const manifestId = 'https://adam-digirati.github.io/balenciaga1-behaviors.json';

loadManifest(manifestId).then(res => {
  document.getElementById('title').innerText = res.label.en[0];

  const $canvasList = document.getElementById('canvasList');
  $canvasList.innerHTML = '';


  res.items.forEach(ref => {
    const canvas = select(ref);
  })
  for (let ref of res.items) {
    const canvas = select(ref);

    // Add our label to the Dom.
    const $item = document.createElement('div');
    $item.innerText = canvas.label ? canvas.label.en[0] : 'untitled canvas';
    $canvasList.append($item)
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
