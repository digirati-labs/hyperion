import { Entities, Mapping, NormalizedEntity } from './processing/normalize';
import createStore from './redux/createStore';
import { Store } from 'redux';
import { Epic } from 'redux-observable';
import Mitt from 'mitt';
import { AllActions, requestResource, RequestState } from './redux/entities';
import { ActionType } from 'typesafe-actions';
import { CollectionNormalized, ManifestNormalized, Reference } from '@hyperion-framework/types';
import { TraversableEntityTypes } from './processing/traverse';
import { CtxFunction } from './context/createContext';

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

  constructor(options?: VaultOptions) {
    this.options = options || {
      reducers: {},
      epics: [],
      middleware: [],
      defaultState: {},
    };
    this.store = createStore(
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
    selector: (state: S, context: CtxFunction<S, this, C> | {}, util: this) => R,
    context: CtxFunction<S, this, C> | {} = {}
  ): R {
    return selector(this.getState(), context, this);
  }

  getStore(): Store {
    return this.store;
  }

  getState(): S {
    return this.store.getState();
  }

  loadManifest(id: string): Promise<ManifestNormalized> {
    return this.load<ManifestNormalized>(id);
  }

  loadCollection(id: string): Promise<CollectionNormalized> {
    return this.load<CollectionNormalized>(id);
  }

  load<T>(resource: string): Promise<T> {
    return new Promise(resolve => {
      this.store.dispatch(requestResource({ id: resource }));
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
