import { Vault, VaultState } from './Vault';
import { AllActions } from './redux/entities';

declare global {
  interface Window {
    __hyperionVault__: Vault;
  }
  interface Global {
    __hyperionVault__: Vault;
  }
}

export type RootAction = AllActions;
export type RootState = VaultState;
