import { VaultOptions, Vault } from './Vault';
import {
  CollectionNormalized,
  HyperionStore,
  ManifestNormalized,
  Reference,
  TraversableEntityMappedType,
  TraversableEntityTypes,
} from '@hyperion-framework/types';
import { ImageCandidateRequest } from '@atlas-viewer/iiif-image-api';

export function globalVault(options?: VaultOptions) {
  try {
    let gv: Vault | null = globalThis
      ? (globalThis as any).__hyperionVault__
      : typeof window !== 'undefined' && (window as any).__hyperionVault__
      ? (window as any).__hyperionVault__
      : null;

    try {
      // @ts-ignore
      if (!gv && global && global.__hyperionVault__) {
        // @ts-ignore
        gv = global.__hyperionVault__;
      }
    } catch (e) {
      // no-op
    }

    if (gv) {
      return gv;
    }
  } catch (e) {
    // no-op
  }

  const newVault = new Vault(options);

  try {
    if (typeof globalThis !== 'undefined') {
      (globalThis as any).__hyperionVault__ = newVault;
    }
  } catch (e) {
    // no-op
  }

  try {
    if (typeof global !== 'undefined') {
      (global as any).__hyperionVault__ = newVault;
    }
  } catch (e) {
    // no-op
  }

  if (typeof window !== 'undefined') {
    (window as any).__hyperionVault__ = newVault;
  }

  return newVault;
}

export async function load<T>(id: string): Promise<T | undefined> {
  return globalVault().load(id);
}

export async function getThumbnail(input: any, req: ImageCandidateRequest, dereference?: boolean) {
  return globalVault().getThumbnail(input, req, dereference);
}

export async function loadManifest(id: string): Promise<ManifestNormalized | undefined> {
  return globalVault().loadManifest(id);
}

export async function loadCollection(id: string): Promise<CollectionNormalized | undefined> {
  return globalVault().loadCollection(id);
}

export function subscribe<S>(
  selector: (state: any) => any,
  subscription: (state: S | null, vault: Vault) => void
): () => void {
  return globalVault().subscribe(selector, subscription);
}

export function fromRef<T extends TraversableEntityTypes>(reference: Reference<T>): TraversableEntityMappedType<T> {
  return globalVault().fromRef<TraversableEntityMappedType<T>>(reference);
}

export function allFromRef<T extends TraversableEntityTypes>(
  references: Array<Reference<T>>
): Array<TraversableEntityMappedType<T>> {
  return references.map(reference => fromRef(reference));
}

export function select<T>(selector: (state: HyperionStore) => T): T {
  return globalVault().select(selector);
}
