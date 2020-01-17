import { IKVPair, IFnCfg } from "../types";
export declare type CallbackFunc = (state: IKVPair, props: IKVPair) => any;
export declare const withCallbacks: (
  callbacks: IKVPair<IFnCfg<CallbackFunc>>,
  dependencies?: string[]
) => (state: IKVPair<any>, props: IKVPair<any>) => IKVPair<any>;
export declare const withCallback: <T>(
  callbackName: string,
  callback: CallbackFunc,
  dependencies?: string[]
) => (state: IKVPair<any>, props: IKVPair<any>) => IKVPair<T>;
