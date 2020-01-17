import { IKVPair, IFnCfg, ICustomHook } from "../types";

export declare type MemoFunc = (state: IKVPair, props: IKVPair) => any;

export declare const withMemos: (
  funcs: IKVPair<MemoFunc | IFnCfg<MemoFunc>>,
  dependencies?: string[]
) => ICustomHook<any, IKVPair<any>>;

export declare const withMemo: <T>(
  memoizedName: string,
  callback: MemoFunc,
  dependencies?: string[]
) => ICustomHook<any, IKVPair<any>>;
