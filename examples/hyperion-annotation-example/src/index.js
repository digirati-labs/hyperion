
import React from 'react';
import './main.scss';
import { render } from 'react-dom';
import { MainView } from './components/MainView/MainView';
import { VaultProvider } from '@hyperion-framework/react-vault';

render(
  <VaultProvider>
    <MainView/>
  </VaultProvider>,
  document.getElementById('app')
);
