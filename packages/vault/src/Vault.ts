import { Entities, Mapping, NormalizedEntity } from './processing/normalize';
import { createStore } from './redux/createStore';
import { Store } from 'redux';
import { Epic } from 'redux-observable';
import mitt, { Emitter } from 'mitt';
import { AllActions, requestOfflineResource, requestResource, RequestState } from './redux/entities';
import { ActionType } from 'typesafe-actions';
import {
  AnnotationNormalized,
  AnnotationPageNormalized,
  CanvasNormalized,
  ChoiceBody,
  CollectionItemSchemas,
  CollectionNormalized,
  ContentResource,
  ManifestNormalized,
  Reference,
} from '@hyperion-framework/types';
import { TraversableEntityTypes } from './processing/traverse';
import { CtxFunction } from './context/createContext';
import { serialise, SerialiseConfig } from './processing/serialise';
import { getFixedSizeFromImage, ImageServiceLoader } from '@atlas-viewer/iiif-image-api';
import {
  FixedSizeImage,
  FixedSizeImageService,
  ImageCandidate,
  ImageCandidateRequest,
  UnknownSizeImage,
  VariableSizeImage,
} from '@atlas-viewer/iiif-image-api/lib/types';

export type VaultOptions = {
  reducers: {};
  epics: Epic[];
  middleware: [];
  defaultState: {};
};

export type VaultState = {
  hyperion: {
    entities: Entities;
    mapping: Mapping;
    requests: RequestState;
  };
};

export class Vault<S extends VaultState = VaultState> {
  private readonly options: VaultOptions;
  private readonly store: Store;
  private readonly emitter: Emitter;
  private readonly imageService: ImageServiceLoader;

  constructor(options?: Partial<VaultOptions>, store?: Store) {
    this.options = Object.assign(options || {}, {
      reducers: {},
      epics: [],
      middleware: [],
      defaultState: {},
    });
    this.store =
      store ||
      createStore(
        this.options.reducers,
        [...this.options.middleware, this.middleware],
        this.options.epics,
        this.options.defaultState
      );
    this.emitter = mitt();
    this.imageService = new ImageServiceLoader();
  }

  middleware = (store: Store) => (next: (action: AllActions) => S) => (action: AllActions): S => {
    this.emitter.emit(action.type, { action, state: store.getState() });
    const state = next(action);
    this.emitter.emit(`after:${action.type}`, { action, state: store.getState() });
    return state;
  };

  serialise<Return>(entity: Reference<TraversableEntityTypes>, config: SerialiseConfig<S>) {
    return serialise<Return, S>(this, entity, config);
  }

  fromRef<T extends NormalizedEntity, R = T>(
    reference: Reference<TraversableEntityTypes>,
    selector?: <C>(state: S, ctx: C) => R
  ): R | T {
    const state = this.getState();
    const resource =
      state.hyperion.entities[reference.type] && state.hyperion.entities[reference.type][reference.id]
        ? (state.hyperion.entities[reference.type][reference.id] as T)
        : reference;

    if (!selector) {
      return resource as T;
    }

    return selector(state, resource) as R;
  }

  select<R, C>(
    selector: (state: S, context: CtxFunction<S, C>, util: any) => R,
    context?: CtxFunction<S, C> | undefined
  ): R {
    return selector(this.getState(), context ? context : () => ({} as C), {});
  }

  getStore(): Store {
    return this.store;
  }

  getState(): S {
    return this.store.getState();
  }

  loadManifest(id: string, json?: unknown): Promise<ManifestNormalized> {
    return this.load<ManifestNormalized>(id, json);
  }

  loadCollection(id: string, json?: unknown): Promise<CollectionNormalized> {
    return this.load<CollectionNormalized>(id, json);
  }

  async getThumbnail(
    input:
      | Reference<CollectionItemSchemas>
      | Reference<'Collection'>
      | Reference<'Manifest'>
      | Reference<'Canvas'>
      | Reference<'Annotation'>
      | Reference<'AnnotationPage'>
      | Reference<'ContentResource'>
      | CollectionNormalized
      | ManifestNormalized
      | CanvasNormalized
      | AnnotationNormalized
      | AnnotationPageNormalized
      | ContentResource,
    request: ImageCandidateRequest,
    dereference?: boolean
  ): Promise<{
    best: null | undefined | FixedSizeImage | FixedSizeImageService | VariableSizeImage | UnknownSizeImage;
    fallback: Array<ImageCandidate>;
    log: string[];
  }> {
    if (typeof input === 'string') {
      // Best shot we have.
      return { best: getFixedSizeFromImage(input), fallback: [], log: [] };
    }

    // Run through from ref, just in case.
    const fullInput:
      | ManifestNormalized
      | CollectionNormalized
      | CanvasNormalized
      | AnnotationNormalized
      | AnnotationPageNormalized
      | ContentResource = this.fromRef(input as any);

    if (typeof fullInput === 'string') {
      return { best: getFixedSizeFromImage(fullInput), fallback: [], log: [] };
    }

    switch (fullInput.type) {
      case 'Annotation': {
        // Grab the body.
        const contentResources = fullInput.body;
        // @todo this could be configuration.
        const firstContentResources = this.fromRef<ContentResource>(contentResources[0]);
        return await this.imageService.getThumbnailFromResource(firstContentResources, request, dereference);
      }

      case 'Canvas': {
        const canvas = fullInput as CanvasNormalized;
        // check for thumbnail resource first?
        if (canvas.thumbnail && canvas.thumbnail.length) {
          const thumbnail = this.fromRef<ContentResource>(canvas.thumbnail[0]);
          const potentialThumbanils = this.getThumbnail(thumbnail, request, dereference);
          if (potentialThumbanils) {
            return potentialThumbanils;
          }
        }

        return this.getThumbnail(canvas.items[0], request, dereference);
      }

      // Unsupported for now.
      case 'AnnotationPage': {
        const annotationPage = fullInput as AnnotationPageNormalized;
        return this.getThumbnail(annotationPage.items[0], request, dereference);
      }

      case 'Choice': {
        const choice: ChoiceBody = fullInput as any;
        // @todo this could also be configuration, just choosing the first choice.
        return this.getThumbnail(choice.items[0], request, dereference);
      }
      case 'Collection': {
        // This one is tricky, as the manifests may not have been loaded. But we will give it a shot.
        const collection = fullInput as CollectionNormalized;
        const firstManifest = collection.items[0];
        return this.getThumbnail(firstManifest, request, dereference);
      }

      case 'Manifest': {
        const manifest = fullInput as ManifestNormalized;
        const firstCanvas = manifest.items[0];
        return this.getThumbnail(firstCanvas, request, dereference);
      }

      case 'SpecificResource':
      case 'Image':
      case 'Dataset':
      case 'Sound':
      case 'Text':
      case 'TextualBody':
      case 'Video':
        return this.imageService.getThumbnailFromResource(fullInput, request, dereference);

      // Seems unlikely these would appear, but it would be an error..
      case 'Service': // @todo could do something with this.
      case 'Range':
      case 'AnnotationCollection':
      case 'CanvasReference':
      case 'ContentResource':
        return { best: undefined, fallback: [], log: [] };
    }

    return { best: undefined, fallback: [], log: [] };
  }

  load<T>(resource: string, json?: unknown): Promise<T> {
    return new Promise(resolve => {
      const storeState = this.getState();
      if (storeState.hyperion.requests[resource]) {
        const { resourceUri } = storeState.hyperion.requests[resource];
        const type = storeState.hyperion.mapping[resourceUri];
        if (storeState.hyperion.entities[type][resourceUri]) {
          resolve(storeState.hyperion.entities[type][resourceUri] as T);
          return;
        }
      }
      this.emitter.on(
        'after:@hyperion/REQUEST_COMPLETE',
        ({ action, state }: { action: ActionType<typeof requestResource>; state: S }) => {
          if (action.payload.id === resource) {
            const { resourceUri } = state.hyperion.requests[action.payload.id];
            const resourceType = state.hyperion.mapping[resourceUri];
            const r = state.hyperion.entities[resourceType][resourceUri];
            resolve(r as T);
          }
        }
      );
      this.store.dispatch(
        json
          ? requestOfflineResource({
              id: resource,
              entity: json,
            })
          : requestResource({
              id: resource,
            })
      );
    });
  }

  subscribe<T>(selector: (state: S) => T | null, subscription: (state: T | null, vault: Vault<S>) => void): () => void {
    let lastState: T | null;
    return this.store.subscribe(() => {
      const state = this.store.getState();
      const selectedState = selector(state);
      if (lastState !== selectedState) {
        subscription(selectedState, this);
      }
      lastState = selectedState;
    });
  }
}
