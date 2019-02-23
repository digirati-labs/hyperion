import React, { useState } from 'react';
import { StoreContext } from 'redux-react-hook';
import {Vault, VaultOptions} from '@hyperion-framework/vault';

export const ReactVaultContext = React.createContext<{
  vault: Vault | null;
  setVaultInstance: (vault: Vault) => void;
}>({
  vault: null,
  setVaultInstance: (vault: Vault) => {},
});

export const VaultProvider: React.FC<{ vault?: Vault, vaultOptions?: VaultOptions }> = ({ vault, vaultOptions, children }) => {
  const [vaultInstance, setVaultInstance] = useState<Vault>(() => {
    if (vault) {
      return vault;
    }
    if (vaultOptions) {
      return new Vault(vaultOptions);
    }
    return new Vault();
  });

  return (
    <ReactVaultContext.Provider value={{ vault: vaultInstance, setVaultInstance }}>
      <StoreContext.Provider value={vaultInstance.getStore()}>{children}</StoreContext.Provider>
    </ReactVaultContext.Provider>
  );
};
