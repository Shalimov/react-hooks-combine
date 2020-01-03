import { useState } from "react";

import { IKVPair, ICustomHook, IInitFunc } from "../types";
import { isFunction } from "../utils";

export const withState = <S>(
  stateName: string,
  handlerName: string,
  initialState?: S | IInitFunc<S>
): ICustomHook => {
  const initState = isFunction(initialState)
    ? (state: IKVPair, props: IKVPair) => () =>
        (<IInitFunc<S>>initialState)(state, props)
    : () => <S>initialState;

  return (state: IKVPair, props: IKVPair): IKVPair => {
    const [innerState, updater] = useState(initState(state, props));
    return { [stateName]: innerState, [handlerName]: updater };
  };
};
