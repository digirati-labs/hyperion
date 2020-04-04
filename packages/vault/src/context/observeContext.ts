import { createContextReturn } from './createContext';
import { VaultState } from '../Vault';
import { Store } from 'redux';

export type Subscription<S, N extends string, R> = (state: S, context: { [name in N]: R }, utility: any) => void;

export function observeContext<S extends VaultState, N extends string, T, C, R>({
  store,
  context,
  initialValue,
  utility,
}: {
  store: Store;
  context: createContextReturn<N, T, C, R>;
  initialValue: T;
  utility: any;
}): {
  subscribe: (subscription: Subscription<S, N, R>) => () => void;
  unsubscribe: (subscription: Subscription<S, N, R>) => void;
  updateContext: (value: T) => void;
  unsubscribeAll: () => void;
} {
  const initialContextCreator = context(initialValue);
  const initialContext = initialContextCreator(store.getState(), utility);

  const state: {
    subscriptions: Array<Subscription<S, N, R>>;
    currentCreator: any;
    current: { [name in N]: R };
    hasStopped: boolean;
  } = {
    current: initialContext,
    currentCreator: initialContextCreator,
    subscriptions: [],
    hasStopped: false,
  };

  const storeSubscription = store.subscribe(() => {
    const newContext = state.currentCreator(store.getState(), utility);
    if (newContext !== state.current) {
      state.current = newContext;
      state.subscriptions.forEach(subscription => executePhaseShift(subscription, store.getState(), state.current));
    }
  });

  const executePhaseShift = (subscription: Subscription<any, N, R>, storeState: S, context: { [name in N]: R }) => {
    subscription(storeState, context, utility);
  };

  const subscribe = (subscription: Subscription<S, N, R>): (() => void) => {
    if (state.hasStopped) {
      // Could in future re-activate the subscription.
      throw new Error('All subscriptions have been stopped.');
    }
    state.subscriptions.push(subscription);
    // Execute the subscription initially with current values.
    executePhaseShift(subscription, store.getState(), state.current);
    return () => unsubscribe(subscription);
  };

  const unsubscribe = (subscription: Subscription<S, N, R>): void => {
    const index = state.subscriptions.indexOf(subscription);
    if (index !== -1) {
      state.subscriptions.splice(index, 1);
    }
  };

  // Primitive update method. If context is set twice in a frame, this will take the latest and perform that update.
  let scheduledUpdate: any = null;
  const updateContext = (value: T): void => {
    if (scheduledUpdate) {
      clearTimeout(scheduledUpdate);
    }
    // One update per frame-ish
    scheduledUpdate = setTimeout(() => {
      state.currentCreator = context(value);
      state.current = state.currentCreator(store.getState(), utility);
      state.subscriptions.forEach(subscription => executePhaseShift(subscription, store.getState(), state.current));
    }, 16);
  };

  const unsubscribeAll = () => {
    state.subscriptions = [];
    storeSubscription();
    state.hasStopped = true;
  };

  return {
    subscribe,
    unsubscribe,
    updateContext,
    unsubscribeAll,
  };
}
