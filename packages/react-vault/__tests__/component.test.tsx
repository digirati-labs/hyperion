/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import { useManifest } from '../src';
import { Vault } from '@hyperion-framework/vault';
import { createVaultWrapper } from '../test-utils';

const Test = () => {
  return <div role="test">testing</div>;
};

describe('component-test', () => {
  test('a component', async () => {
    render(<Test />);

    const value = await screen.findByRole('test');

    expect(value.textContent).toEqual('testing');
  });

  test('a hook', async () => {
    const vault = new Vault();
    await vault.loadManifest('https://example.org/manifest', {
      id: 'https://example.org/manifest',
      type: 'Manifest',
      label: { en: ['My manifest'] },
    });

    const hook = renderHook(() => useManifest({ id: 'https://example.org/manifest' }), {
      wrapper: createVaultWrapper(vault),
    });

    expect(hook.result.current.label).toEqual({
      en: ['My manifest'],
    });
  });
});
