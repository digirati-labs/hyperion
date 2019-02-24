import React from 'react';
import { render } from 'react-dom';
import { VaultProvider } from '@hyperion-framework/react-vault';
import App from './components/App/App';

render(
  (
    <VaultProvider>
      <App />
    </VaultProvider>
  ),
  document.getElementById('app')
);
