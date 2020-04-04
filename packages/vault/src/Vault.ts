import { Entities, Mapping, NormalizedEntity } from './processing/normalize';
import { createStore } from './redux/createStore';
import { Store } from 'redux';
import { Epic } from 'redux-observable';
import Mitt from 'mitt';
import { AllActions, requestOfflineResource, requestResource, RequestState } from './redux/entities';
import { ActionType } from 'typesafe-actions';
import { CollectionNormalized, ManifestNormalized, Reference } from '@hyperion-framework/types';
import { TraversableEntityTypes } from './processing/traverse';
import { CtxFunction } from './context/createContext';
import {serialise, SerialiseConfig} from './processing/serialise';

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
  private readonly emitter: Mitt.Emitter;

  constructor(options?: Partial<VaultOptions>, store?: Store) {
    this.options = Object.assign(options || {}, {
      reducers: {},
      epics: [],
      middleware: [],
      defaultState: {},
    });
    this.store = store || createStore(
      this.options.reducers,
      [...this.options.middleware, this.middleware],
      this.options.epics,
      this.options.defaultState
    );
    this.emitter = new Mitt();
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
    const resource = state.hyperion.entities[reference.type][reference.id] as T;

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
