import { IAsyncEffectParams, IKVPair, ICustomHook } from "../types";
export declare const withAsyncEffect: <T>(
  params: IAsyncEffectParams<T>
) => ICustomHook<any, IKVPair<any>>;
