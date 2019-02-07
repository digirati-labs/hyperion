import { select, loadManifest, subscribe } from '@hyperion-framework/vault';

loadManifest('https://adam-digirati.github.io/balenciaga1-behaviors.json').then(res => {
  document.getElementById('title').innerText = res.label.en[0];

  const $canvasList = document.getElementById('canvasList');
  $canvasList.innerHTML = '';

  for (let item of res.items) {
    const label = select(item, (state, ctx) => ctx.label);
    // Add our label to the Dom.
    const $item = document.createElement('div');
    $item.innerText = label ? label.en[0] : 'untitled canvas';
    $canvasList.append($item)
  }
});


const $loadingState = document.getElementById('loading-state');
subscribe(
  state => state.hyperion.requests['https://stephenwf.github.io/ocean-liners.json'],
  (res, vault) => {
    if (res) {
      $loadingState.innerText = res.loadingState;
    }
  }
);
