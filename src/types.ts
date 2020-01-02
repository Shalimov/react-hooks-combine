/**
 *
 */
export interface ICombineConfig {
  hooks?: ICustomHook[];
  transformProps?(props: IKVPair): IKVPair;
  transformPropsBefore?(props: IKVPair): IKVPair;
}

/**
 *
 */
export interface IKVPair<T = any> {
  [key: string]: T;
}

/**
 *
 */
export interface IFnCfg<T> {
  deps: string[];
  func: T;
}

/**
 *
 */
export interface ICustomHook<T = any> {
  (state?: IKVPair<T>, props?: IKVPair<T>): IKVPair<T> | void;
}

/**
 *
 */
export type IReactComponent<P = {}> =
  | React.FunctionComponent<P>
  | React.ComponentClass<P>
  | React.ClassicComponentClass<P>;
