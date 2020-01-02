import { useState } from "react";

import { IKVPair, ICustomHook } from "../types";
import { isFunction } from "../utils";

export const withState = (
  stateName: string,
  handlerName: string,
  initialState: <T>(state: IKVPair, props: IKVPair) => T
): ICustomHook => {
  const initState = isFunction(initialState)
    ? (state: IKVPair, props: IKVPair) => () => initialState(state, props)
    : () => initialState;

  return (state: IKVPair, props: IKVPair): IKVPair => {
    const [innerState, updater] = useState(initState(state, props));
    return { [stateName]: innerState, [handlerName]: updater };
  };
};
