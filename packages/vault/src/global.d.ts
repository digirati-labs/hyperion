import { Vault } from './Vault';

declare global {
  interface Window {
    __hyperionVault__: Vault;
  }
  interface Global {
    __hyperionVault__: Vault;
  }
}
