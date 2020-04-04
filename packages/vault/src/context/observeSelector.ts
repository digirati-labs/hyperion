import { VaultState } from '../Vault';
import { Store } from 'redux';
import { createContextReturn } from './createContext';
import { StateSelector } from './createSelector';
import { observeContext, Subscription } from './observeContext';

export function observeSelector<S extends VaultState, N extends string, T, C, R, Sr>({
  store,
  context,
  initialValue,
  utility,
  selector,
}: {
  store: Store;
  context: createContextReturn<N, T, C, R>;
  initialValue: T;
  utility: any;
  selector: StateSelector<S, { [name in N]: R }, Sr>;
}) {
  const { subscribe: subscribeToContext, updateContext } = observeContext<S, N, T, C, R>({
    store,
    context,
    initialValue,
    utility,
  });

  const state: {
    subscriptions: Array<Subscription<Sr | null, N, R>>;
    currentSelectedState: Sr | null;
    hasStopped: boolean;
  } = {
    subscriptions: [],
    currentSelectedState: null,
    hasStopped: false,
  };

  const executePhaseShift = (
    subscription: Subscription<Sr | null, N, R>,
    selectedState: Sr | null,
    context: { [name in N]: R }
  ) => {
    subscription(selectedState, context, utility);
  };

  const contextSubscription = subscribeToContext((storeState, ctx, utility) => {
    const selectedState = selector(storeState, () => ctx, utility);
    if (selectedState !== state.currentSelectedState) {
      state.currentSelectedState = selectedState;
      state.subscriptions.forEach(subscription => executePhaseShift(subscription, selectedState, ctx));
    }
  });

  const unsubscribeAll = () => {
    // Unsubscribe main listener.
    contextSubscription();
  };

  const subscribe = (subscription: Subscription<Sr | null, N, R>): (() => void) => {
    if (state.hasStopped) {
      // Could in future re-activate the subscription.
      throw new Error('All subscriptions have been stopped.');
    }
    state.subscriptions.push(subscription);

    return () => unsubscribe(subscription);
  };

  const unsubscribe = (subscription: Subscription<Sr | null, N, R>): void => {
    const index = state.subscriptions.indexOf(subscription);
    if (index !== -1) {
      state.subscriptions.splice(index, 1);
    }
  };

  return { subscribe, unsubscribe, updateContext, unsubscribeAll };
}
