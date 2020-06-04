import React from 'react';
import './main.scss';
import { render } from 'react-dom';
import { MainView } from './components/MainView/MainView';
import { VaultProvider } from '@hyperion-framework/react-vault';
import { ManifestLoader } from './components/ManifestLoader/ManifestLoader';

render(
  <VaultProvider>
    <ManifestLoader />
  </VaultProvider>,
  document.getElementById('app')
);
