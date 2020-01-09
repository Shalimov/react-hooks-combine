import { useDebugValue } from "react";
import { IKVPair, ICustomHook } from "../types";

export const withDebugValue = <T>(
  valueExtractor: (state?: IKVPair, props?: IKVPair) => T,
  fromatter: (value: T) => any
): ICustomHook<any, void> => (state: IKVPair, props: IKVPair): void => {
  const status = valueExtractor(state, props);
  useDebugValue<T>(status, fromatter);
};
