/// <reference types="geojson" />

import { AllActions, createFetchHelper, createStore, entityActions, ReduxStore } from '@hyperion-framework/store';
import {
  AnnotationNormalized,
  AnnotationPageNormalized,
  CanvasNormalized,
  ChoiceBody,
  CollectionItemSchemas,
  CollectionNormalized,
  ContentResource,
  HyperionStore,
  ManifestNormalized,
  NormalizedEntity,
  Reference,
  TraversableEntityTypes,
} from '@hyperion-framework/types';
import { SerialiseConfig, serialise, serialiseConfigPresentation2, serialiseConfigPresentation3 } from '@hyperion-framework/parser';
import { getFixedSizeFromImage, ImageServiceLoader } from '@atlas-viewer/iiif-image-api';
import mitt, { Emitter } from 'mitt';
import {
  FixedSizeImage,
  FixedSizeImageService,
  ImageCandidate,
  ImageCandidateRequest,
  UnknownSizeImage,
  VariableSizeImage,
} from '@atlas-viewer/iiif-image-api';

export type VaultOptions = {
  reducers: {};
  middleware: [];
  defaultState: {};
  customFetcher: <T>(url: string, options: T) => unknown | Promise<unknown>;
};

export class Vault {
  private readonly options: VaultOptions;
  private readonly store: ReduxStore;
  private readonly emitter: Emitter;
  private readonly imageService: ImageServiceLoader;
  remoteFetcher: (str: string, options?: any) => Promise<NormalizedEntity | undefined>;
  staticFetcher: (str: string, json: any) => Promise<NormalizedEntity | undefined>;

  constructor(options?: Partial<VaultOptions>, store?: ReduxStore) {
    this.options = Object.assign(
      {
        reducers: {},
        middleware: [],
        defaultState: {},
        customFetcher: this.defaultFetcher,
      },
      options || {}
    );
    this.store =
      store ||
      createStore(this.options.reducers, [...this.options.middleware, this.middleware], this.options.defaultState);
    this.emitter = mitt();
    this.imageService = new ImageServiceLoader();
    this.remoteFetcher = createFetchHelper(this.store, this.options.customFetcher) as any;
    this.staticFetcher = createFetchHelper(this.store, (id: string, json: any) => json);
  }

  defaultFetcher = (url: string) => {
    return fetch(url).then(r => r.json());
  };

  modifyEntityField(entity: Reference<TraversableEntityTypes>, key: string, value: any) {
    this.store.dispatch(
      entityActions.modifyEntityField({
        id: entity.id,
        type: entity.type,
        key,
        value,
      })
    );
  }

  middleware = (store: ReduxStore) => (next: (action: AllActions) => HyperionStore) => (
    action: AllActions
  ): HyperionStore => {
    this.emitter.emit(action.type, { action, state: store.getState() });
    const state = next(action);
    this.emitter.emit(`after:${action.type}`, { action, state: store.getState() });
    return state;
  };

  serialise<Return>(entity: Reference<TraversableEntityTypes>, config: SerialiseConfig) {
    return serialise<Return>(this.getState(), entity, config);
  }

  toPresentation2<Return>(entity: Reference<TraversableEntityTypes>) {
    return this.serialise<Return>(entity, serialiseConfigPresentation2);
  }

  toPresentation3<Return>(entity: Reference<TraversableEntityTypes>) {
    return this.serialise<Return>(entity, serialiseConfigPresentation3);
  }

  fromRef<T extends NormalizedEntity, R = T>(
    reference: Reference<TraversableEntityTypes>,
    selector?: <C>(state: HyperionStore, ctx: C) => R
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

  allFromRef<T extends NormalizedEntity, R = T>(
    references: Reference<TraversableEntityTypes>[],
    selector?: <C>(state: HyperionStore, ctx: C) => R
  ): any[] {
    return references.map(reference => this.fromRef(reference, selector));
  }

  select<R>(selector: (state: HyperionStore) => R): R {
    return selector(this.getState());
  }

  getStore(): ReduxStore {
    return this.store;
  }

  getState(): HyperionStore {
    return this.store.getState();
  }

  getImageService(): ImageServiceLoader {
    return this.imageService;
  }

  loadManifest(id: string, json?: unknown): Promise<ManifestNormalized | undefined> {
    return this.load<ManifestNormalized>(id, json);
  }

  loadCollection(id: string, json?: unknown): Promise<CollectionNormalized | undefined> {
    return this.load<CollectionNormalized>(id, json);
  }

  async getThumbnail(
    input:
      | string
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
    dereference?: boolean,
    candidates: Array<ImageCandidate> = [],
    dimensions?: { width: number; height: number }
  ): Promise<{
    best: null | undefined | FixedSizeImage | FixedSizeImageService | VariableSizeImage | UnknownSizeImage;
    fallback: Array<ImageCandidate>;
    log: string[];
  }> {
    if (typeof input === 'string') {
      // Best shot we have.
      return { best: getFixedSizeFromImage(input as any), fallback: [], log: [] };
    }

    // Run through from ref, just in case.
    const fullInput:
      | string
      | ManifestNormalized
      | CollectionNormalized
      | CanvasNormalized
      | AnnotationNormalized
      | AnnotationPageNormalized
      | ContentResource = this.fromRef(input as any);

    if (typeof fullInput === 'string') {
      return { best: getFixedSizeFromImage(fullInput as any), fallback: [], log: [] };
    }

    switch (fullInput.type) {
      case 'Annotation': {
        // Grab the body.
        const contentResources = fullInput.body;
        // @todo this could be configuration.
        const firstContentResources = this.fromRef<ContentResource>(contentResources[0]);
        if (dimensions && !(firstContentResources as any).width) {
          (firstContentResources as any).width = dimensions.width;
          (firstContentResources as any).height = dimensions.height;
        }

        return await this.imageService.getThumbnailFromResource(
          firstContentResources,
          request,
          dereference,
          candidates
        );
      }

      case 'Canvas': {
        const canvas = fullInput as CanvasNormalized;
        // check for thumbnail resource first?
        if (canvas.thumbnail && canvas.thumbnail.length) {
          const thumbnail = this.fromRef<ContentResource>(canvas.thumbnail[0]);
          const potentialThumbnails = await this.imageService.getImageCandidates(thumbnail, dereference);
          if (potentialThumbnails && potentialThumbnails.length) {
            candidates.push(...potentialThumbnails);
          }
        }

        return this.getThumbnail(canvas.items[0], request, dereference, candidates, {
          width: canvas.width,
          height: canvas.height,
        });
      }

      // Unsupported for now.
      case 'AnnotationPage': {
        const annotationPage = fullInput as AnnotationPageNormalized;
        return this.getThumbnail(annotationPage.items[0], request, dereference, candidates, dimensions);
      }

      case 'Choice': {
        const choice: ChoiceBody = fullInput as any;
        // @todo this could also be configuration, just choosing the first choice.
        return this.getThumbnail(choice.items[0] as any, request, dereference, candidates, dimensions);
      }
      case 'Collection': {
        // This one is tricky, as the manifests may not have been loaded. But we will give it a shot.
        const collection = fullInput as CollectionNormalized;
        const firstManifest = collection.items[0];
        return this.getThumbnail(firstManifest, request, dereference, candidates, dimensions);
      }

      case 'Manifest': {
        const manifest = fullInput as ManifestNormalized;
        const firstCanvas = manifest.items[0];
        return this.getThumbnail(firstCanvas, request, dereference, candidates, dimensions);
      }

      case 'SpecificResource':
      case 'Image':
      case 'Dataset':
      case 'Sound':
      case 'Text':
      case 'TextualBody':
      case 'Video':
        if (dimensions && !(fullInput as any).width) {
          (fullInput as any).width = dimensions.width;
          (fullInput as any).height = dimensions.height;
        }

        return this.imageService.getThumbnailFromResource(fullInput, request, dereference, candidates);

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

  load<T>(resource: string, json?: unknown): Promise<T | undefined> {
    if (json) {
      return this.staticFetcher(resource, json) as Promise<T | undefined>;
    }
    return this.remoteFetcher(resource) as Promise<T | undefined>;
  }

  subscribe<T>(
    selector: (state: HyperionStore) => T,
    subscription: (state: T | null, vault: Vault) => void
  ): () => void {
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
