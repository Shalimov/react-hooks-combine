import { useDebugValue } from "react";
import { KVPair, CustomHook } from "../types";

export const withDebugValue = <T>(
  valueExtractor: (state?: KVPair, props?: KVPair) => T,
  fromatter: (value: T) => any
): CustomHook => (state: KVPair, props: KVPair): void => {
  const status = valueExtractor(state, props);
  useDebugValue<T>(status, fromatter);
};
