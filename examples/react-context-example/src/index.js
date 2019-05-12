import React from 'react';
import { render } from 'react-dom';
import { VaultProvider } from '@hyperion-framework/react-vault';
import App from './components/App/App';
import { Homepage } from './components/Homepage/Homepage';
import { SimpleCollection } from './components/SimpleCollection/SimpleCollection';
import { HashRouter, Route } from 'react-router-dom';
import hyperion from '../../../hyperion.png';
import { ImageTest } from './components/ImageTest/ImageTest';

render(
  <VaultProvider>
    <HashRouter>
      <div>
        <img src={`/assets/${hyperion}`} width={390} alt="Hyperion" />
        <Route path="/" component={Homepage} />
        <Route path="/manifest" component={App} />
        <Route path="/simple-collection" component={SimpleCollection} />
        <Route path="/viewer" component={ImageTest} />
      </div>
    </HashRouter>
  </VaultProvider>,
  document.getElementById('app')
);
