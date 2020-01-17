import { IKVPair, ICustomHook, IInitFunc } from "../types";

export declare const withState: <S>(
  stateName: string,
  handlerName: string,
  initialState?: S | IInitFunc<S>
) => ICustomHook<any, IKVPair<any>>;
