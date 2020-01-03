import { useState } from "react";

import { IKVPair, ICustomHook } from "../types";
import { isFunction } from "../utils";

interface IInitFunc<S> {
  (state: IKVPair, props: IKVPair): S
}

export const withState = <S>(
  stateName: string,
  handlerName: string,
  initialState?: S | IInitFunc<S>
): ICustomHook => {
  const initState = isFunction(initialState)
    ? (state: IKVPair, props: IKVPair) => () => (<IInitFunc<S>>initialState)(state, props)
    : () => initialState as S;

  return (state: IKVPair, props: IKVPair): IKVPair => {
    const [innerState, updater] = useState(initState(state, props));
    return { [stateName]: innerState, [handlerName]: updater };
  };
};
