import {
  AnnotationCollectionNormalized,
  AnnotationNormalized,
  AnnotationPageNormalized,
  CanvasNormalized,
  CollectionNormalized,
  ContentResource,
  ManifestNormalized,
  RangeNormalized,
  ServiceNormalized,
  Selector
} from '@hyperion-framework/types';
import {EntityReference, NormalizedEntity} from './normalize';
import {Vault, VaultState} from '../Vault';

export const UNSET = '__$HF_UNSET$__';
export const UNWRAP = '__$HF_UNWRAP$__';

export type Field = any[];

export type Serialiser<Type extends NormalizedEntity, S extends VaultState = VaultState> = (entity: Type, vault: Vault<S>) => Generator<EntityReference | EntityReference[], typeof UNSET | Field[], any>;

export type SerialiseConfig<S extends VaultState = VaultState> = {
  Collection?: Serialiser<CollectionNormalized, S>,
  Manifest?: Serialiser<ManifestNormalized, S>,
  Canvas?: Serialiser<CanvasNormalized, S>,
  AnnotationPage?: Serialiser<AnnotationPageNormalized, S>,
  AnnotationCollection?: Serialiser<AnnotationCollectionNormalized, S>,
  Annotation?: Serialiser<AnnotationNormalized, S>,
  ContentResource?: Serialiser<ContentResource, S>,
  Range?: Serialiser<RangeNormalized, S>,
  Service?: Serialiser<ServiceNormalized, S>,
  Selector?: Serialiser<Selector, S>,
};

export function serialisedFieldsToObject<T>(fields: Field[] | [string]): T {
  const object: any = {};

  for (const [key, value] of fields) {
    if (key === UNWRAP) {
      return value as T;
    }
    if (value !== UNSET) {
      object[key] = value;
    }
  }

  return object as T;
}

export function serialise<Return, S extends VaultState>(vault: Vault<S>, subject: EntityReference, config: SerialiseConfig<S>): Return {
  if (!subject.type || !subject.id) {
    throw new Error('Unknown entity');
  }

  if (!config[subject.type as keyof SerialiseConfig]) {
    throw new Error(`Serialiser not found for ${subject.type}`);
  }

  function flatten(sub: EntityReference) {
    const generator = config[sub.type as keyof SerialiseConfig];
    if (!generator) {
      return UNSET;
    }
    const iterator = generator(vault.fromRef(sub as any), vault);
    let current = iterator.next();
    while (!current.done) {
      const requestToHydrate = current.value;
      let next: any = UNSET;
      if (requestToHydrate) {
        if (Array.isArray(requestToHydrate)) {
          const nextList: any[] = [];
          for (const req of requestToHydrate) {
            nextList.push(flatten(req));
          }
          next = nextList;
        } else {
          next = flatten(requestToHydrate);
        }
      }
      current = iterator.next(next);
    }

    if (current.value === UNSET) {
      return UNSET;
    }

    return serialisedFieldsToObject(current.value);
  }

  return flatten(subject) as Return;
}
