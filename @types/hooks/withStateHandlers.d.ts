import { IKVPair, IInitFunc } from "../types";

declare type StateHandler = (params: {
  state: IKVPair;
  props: IKVPair;
  args: any[];
}) => any;

export declare const withStateHandlers: <S>(
  initialState: S | IInitFunc<S>,
  actionHandlers: IKVPair<StateHandler>
) => (state: IKVPair<any>, props: IKVPair<any>) => IKVPair<any>;
export {};
