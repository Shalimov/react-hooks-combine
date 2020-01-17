/// <reference types="react" />
export interface IInitFunc<S> {
  (state: IKVPair, props: IKVPair): S;
}

export interface IReducerParams<S, A> {
  reducer: (prevState?: S, action?: A) => S;
  stateName: string;
  dispatchName?: string;
  initialState: S;
  init: (initialState?: S) => S;
}

export interface IAsyncEffectParams<T> {
  deps?: string[];
  dataName?: string;
  loadingName?: string;
  errorName?: string;
  asyncAction(
    state: IKVPair,
    props: IKVPair,
    prevStateProps: {
      state: IKVPair;
      props: IKVPair;
    }
  ): PromiseLike<T>;
  disposeAction?(): void;
}

export interface ICombineConfig {
  hooks: ICustomHook[];
  transformProps?(props: IKVPair): IKVPair;
  transformPropsBefore?(props: IKVPair): IKVPair;
}

export interface IKVPair<V = any> {
  [key: string]: V;
}

export interface IFnCfg<T> {
  deps: string[];
  func: T;
}

export interface ICustomHook<T = any, R = IKVPair<T>> {
  (state?: IKVPair<T>, props?: IKVPair<T>): R;
}

export declare type IReactComponent<P = {}> =
  | React.ReactElement<P>
  | React.FunctionComponent<P>
  | React.ComponentClass<P>
  | React.ClassicComponentClass<P>;
