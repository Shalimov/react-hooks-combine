/// <reference types="react" />
import { IReactComponent, IKVPair, IFnCfg } from "./types";
export declare const getInternalCtor: (value: any) => string;
export declare const isPromise: (value: any) => boolean;
export declare const isFunction: (value: any) => boolean;
export declare const isObject: (value: any) => boolean;
export declare const isLikePromise: (value: any) => boolean;
export declare const isNotFunction: (value: any) => boolean;
export declare const isCombineConfigMode: (args: IKVPair<any>[]) => boolean;
export declare const identity: <T>(value: T) => T;
export declare const unwindLoop: <T extends (...args: any[]) => any>(
  useCustomHook: (
    func: T | IFnCfg<T>,
    deps: string[],
    state: IKVPair<any>,
    props: IKVPair<any>
  ) => IKVPair<T>,
  funcDescriptions: IKVPair<T | IFnCfg<T>>
) => (deps: string[], state: IKVPair<any>, props: IKVPair<any>) => IKVPair<any>;
export declare const prop: (value: IKVPair<any>, path: string) => any;
export declare const getDeps: (
  source: IKVPair<any>,
  depsNames?: string[]
) => import("react").DependencyList;
export declare const enchance: (
  callbacks: [(component: IReactComponent<{}>) => IReactComponent<{}>],
  Component: IReactComponent<{}>
) => IReactComponent<{}>;
