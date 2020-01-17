import { IKVPair, ICustomHook } from "../types";
export declare const withDebugValue: <T>(
  valueExtractor: (state?: IKVPair<any>, props?: IKVPair<any>) => T,
  fromatter?: (value: T) => any
) => ICustomHook<any, void>;
