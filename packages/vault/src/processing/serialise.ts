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
import { Vault } from '../Vault';

export const UNSET = '__$HF_UNSET$__';
export const UNWRAP = '__$HF_UNWRAP$__';

export type Field = any[];

export type Serialiser<Type extends NormalizedEntity> = (entity: Type, vault: Vault) => Generator<EntityReference | EntityReference[], typeof UNSET | Field[], any>;

export type SerialiseConfig = {
  Collection?: Serialiser<CollectionNormalized>,
  Manifest?: Serialiser<ManifestNormalized>,
  Canvas?: Serialiser<CanvasNormalized>,
  AnnotationPage?: Serialiser<AnnotationPageNormalized>,
  AnnotationCollection?: Serialiser<AnnotationCollectionNormalized>,
  Annotation?: Serialiser<AnnotationNormalized>,
  ContentResource?: Serialiser<ContentResource>,
  Range?: Serialiser<RangeNormalized>,
  Service?: Serialiser<ServiceNormalized>,
  Selector?: Serialiser<Selector>,
};

function fieldsToObject<T>(fields: Field[] | [string]): T {
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

export function serialise(vault: Vault, subject: EntityReference, config: SerialiseConfig) {
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

    return fieldsToObject(current.value);
  }

  return flatten(subject);
}
