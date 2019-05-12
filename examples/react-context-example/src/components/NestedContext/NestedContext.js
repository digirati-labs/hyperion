import * as React from 'react';
import { createSelector, manifestContext, createContext } from '@hyperion-framework/vault';
import { useSelector, Context, useCanvas } from '@hyperion-framework/react-vault';

const someRandomContext = createContext({
  name: 'myContext',
  creator: type => ({ type }),
});

const anotherContext = createContext({
  name: 'another',
  creator: type => ({ type }),
});

const contextDebugger = createSelector({
  context: [manifestContext, anotherContext, someRandomContext],
  selector: (state, ctx) => {
    return JSON.stringify(ctx, null, 2);
  },
});

const TestComp = () => {
  const label = useSelector(contextDebugger);

  return <pre>{label}</pre>;
};

export function NestedContext() {
  return (
    <div>
      <Context context={someRandomContext('something')}>
        <TestComp />
      </Context>
      <Context context={someRandomContext('something-else')}>
        <Context context={anotherContext('something-inner')}>
          <TestComp />
        </Context>
      </Context>
    </div>
  );
}
