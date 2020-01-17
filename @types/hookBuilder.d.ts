import { ICustomHook, IKVPair } from "./types";
export declare const hookBuilder: (
  combineFuncs: ICustomHook<any, IKVPair<any>>[]
) => ICustomHook<any, IKVPair<any>>;
