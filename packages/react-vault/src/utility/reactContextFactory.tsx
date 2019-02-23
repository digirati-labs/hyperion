import {createContextReturn} from "@hyperion-framework/vault";
import React, {useEffect, useState} from "react";

export function reactContextFactory<N extends string, T, C, R>(
  hyperionContext: createContextReturn<N, T, C, R>,
  defaultValue: T
) {
  const ReactContext = React.createContext(hyperionContext(defaultValue));

  function Wrapper<Ch>({ id, children }: { id: T; children: Ch }) {
    const [currentCtx, setCtx] = useState(defaultValue);

    useEffect(
      () => {
        setCtx(id);
      },
      [id]
    );

    if (!currentCtx) {
      return children;
    }

    return <ReactContext.Provider value={hyperionContext(currentCtx)}>{children}</ReactContext.Provider>;
  }

  return { ReactContext, Wrapper, hyperionContext };
}
