import { useState } from "react";

import { KVPair, CustomHook } from "../types";
import { isFunction } from "../utils";

export const withState = (
  stateName: string,
  handlerName: string,
  initialState: <T>(state: KVPair, props: KVPair) => T
): CustomHook => {
  const initState = isFunction(initialState)
    ? (state: KVPair, props: KVPair) => () => initialState(state, props)
    : () => initialState;

  return (state: KVPair, props: KVPair): KVPair => {
    const [innerState, updater] = useState(initState(state, props));
    return { [stateName]: innerState, [handlerName]: updater };
  };
};
