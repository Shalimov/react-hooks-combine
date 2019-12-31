export interface KVPair<T = any> {
  [key: string]: T;
}

export interface FnCfg<T> {
  deps: string[];
  func: T;
}

export type CustomHook<T = any> = (
  state?: KVPair<T>,
  props?: KVPair<T>
) => KVPair<T> | void;

export type IReactComponent<P = any> =
  | React.FunctionComponent<P>
  | React.ComponentClass<P>
  | React.ClassicComponentClass<P>;
