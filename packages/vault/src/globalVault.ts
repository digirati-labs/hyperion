import { VaultOptions, Vault } from './Vault';
import {CollectionNormalized, ManifestNormalized, Reference} from '@hyperion-framework/types';
import { TraversableEntityTypes } from './processing/traverse';

export function globalVault(options?: VaultOptions) {
  const globalVault: Vault | null = global
    ? (global as any).__hyperionVault__
    : null || window
    ? window.__hyperionVault__
    : null || null;

  if (globalVault) {
    return globalVault;
  }

  const newVault = new Vault(options);

  if (global) {
    (global as any).__hyperionVault__ = newVault;
  }
  if (window) {
    window.__hyperionVault__ = newVault;
  }

  return newVault;
}

export async function load<T>(id: string): Promise<T> {
  return globalVault().load(id);
}

export async function loadManifest(id: string): Promise<ManifestNormalized> {
  return globalVault().loadManifest(id);
}

export async function loadCollection(id: string): Promise<CollectionNormalized> {
  return globalVault().loadCollection(id);
}

export function subscribe<S>(
  selector: (state: any) => any,
  subscription: (state: S | null, vault: Vault) => void
): () => void {
  return globalVault().subscribe(selector, subscription);
}

export function select(
  reference: Reference<TraversableEntityTypes>,
  selector?: (state: unknown, ctx: unknown) => unknown
): unknown {
  return globalVault().select(reference, selector);
}
