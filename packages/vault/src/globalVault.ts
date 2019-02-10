import { VaultOptions, Vault } from './Vault';
import {
  AnnotationCollection,
  AnnotationNormalized,
  AnnotationPageNormalized,
  CanvasNormalized,
  CollectionNormalized,
  ContentResource,
  ManifestNormalized,
  RangeNormalized,
  Reference,
  Selector,
  ServiceNormalized,
} from '@hyperion-framework/types';
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

  if (typeof global !== 'undefined') {
    (global as any).__hyperionVault__ = newVault;
  }
  if (typeof window !== 'undefined') {
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

type MappedType<T extends TraversableEntityTypes> = T extends 'Collection'
  ? CollectionNormalized
  : T extends 'Manifest'
  ? ManifestNormalized
  : T extends 'Canvas'
  ? CanvasNormalized
  : T extends 'AnnotationPage'
  ? AnnotationPageNormalized
  : T extends 'AnnotationCollection'
  ? AnnotationCollection
  : T extends 'Annotation'
  ? AnnotationNormalized
  : T extends 'ContentResource'
  ? ContentResource
  : T extends 'Range'
  ? RangeNormalized
  : T extends 'Service'
  ? ServiceNormalized
  : Selector;

export function select<T extends TraversableEntityTypes>(reference: Reference<T>): MappedType<T> {
  return globalVault().select<MappedType<T>>(reference);
}

export function selectAll<T extends TraversableEntityTypes>(references: Array<Reference<T>>): Array<MappedType<T>> {
  return references.map(reference => select(reference));
}

// export function select<T extends TraversableEntity>(
//   reference: Reference<TraversableEntityTypes>
// ): T;
//
// export function select<T extends TraversableEntity, R>(
//   reference: Reference<TraversableEntityTypes>,
//   selector: <T>(state: VaultState, ctx: T) => R | null
// ): R | null;
//
// export function select<T extends TraversableEntity, R>(
//   reference: Reference<TraversableEntityTypes>,
//   selector?: <T>(state: VaultState, ctx: T) => R | null
// ): R | T | null {
//   return globalVault().select<T, R>(reference, selector);
// }
