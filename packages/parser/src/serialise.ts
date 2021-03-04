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
  Selector,
  NormalizedEntity,
  Reference,
  HyperionStore,
} from '@hyperion-framework/types';

export const UNSET = '__$HF_UNSET$__';
export const UNWRAP = '__$HF_UNWRAP$__';

export type Field = any[];

export type Serialiser<Type extends NormalizedEntity> = (
  entity: Type,
  state: HyperionStore
) => Generator<Reference | Reference[], typeof UNSET | Field[], any>;

export type SerialiseConfig = {
  Collection?: Serialiser<CollectionNormalized>;
  Manifest?: Serialiser<ManifestNormalized>;
  Canvas?: Serialiser<CanvasNormalized>;
  AnnotationPage?: Serialiser<AnnotationPageNormalized>;
  AnnotationCollection?: Serialiser<AnnotationCollectionNormalized>;
  Annotation?: Serialiser<AnnotationNormalized>;
  ContentResource?: Serialiser<ContentResource>;
  Range?: Serialiser<RangeNormalized>;
  Service?: Serialiser<ServiceNormalized>;
  Selector?: Serialiser<Selector>;
};

function resolveIfExists<T extends NormalizedEntity>(state: HyperionStore, url: string): T | undefined {
  const request = state.hyperion.requests[url];
  // Return the resource.
  const resourceType = state.hyperion.mapping[url];
  if (
    !resourceType &&
    (request && request.resourceUri && !state.hyperion.entities[resourceType][request.resourceUri])
  ) {
    // Continue refetching resource, this is an invalid state.
    return undefined;
  }
  return state.hyperion.entities[resourceType][request ? request.resourceUri : url] as T;
}

export function serialisedFieldsToObject<T>(fields: Field[] | [string]): T {
  const object: any = {};

  for (const [key, value] of fields) {
    if (key === UNWRAP) {
      return value as T;
    }
    if (value !== UNSET && typeof value !== 'undefined' && value !== null) {
      object[key] = value;
    }
  }

  return object as T;
}

export function serialise<Return>(state: HyperionStore, subject: Reference, config: SerialiseConfig): Return {
  if (!subject.type || !subject.id) {
    throw new Error('Unknown entity');
  }

  if (!config[subject.type as keyof SerialiseConfig]) {
    throw new Error(`Serialiser not found for ${subject.type}`);
  }

  function flatten(sub: Reference) {
    const generator = config[sub.type as keyof SerialiseConfig];
    if (!generator) {
      return UNSET;
    }

    const resource = resolveIfExists(state, sub.id);
    if (!resource) {
      return UNSET;
    }
    const iterator = generator(resource as any, state);
    let current = iterator.next();
    while (!current.done) {
      const requestToHydrate: Reference | Reference[] = current.value as any;
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
