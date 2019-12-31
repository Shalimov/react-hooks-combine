import { IReactComponent, KVPair, FnCfg } from "./types";

const bastToString = Object.prototype.toString;

/**
 *
 * @param value
 */
const getInternalCtor = (value: any): string =>
  bastToString.call(value).slice(8, -1);

/**
 *
 * @param Component
 * @param callback
 */
const iteratee = (
  Component: IReactComponent,
  callback: (component: IReactComponent) => IReactComponent
): IReactComponent => callback(Component);

/**
 *
 * @param type
 */
const createIsTypeFunc = (type: string): ((value: any) => boolean) => (
  value: any
) => getInternalCtor(value) === type;

/**
 *
 */
export const isPromise = createIsTypeFunc("Promise");

/**
 *
 */
export const isFunction = createIsTypeFunc("Function");

/**
 *
 */
export const isObject = createIsTypeFunc("Object");

/**
 *
 * @param value
 */
export const isLikePromise = (value: any): boolean =>
  isPromise(value) || (isFunction(value?.then) && isFunction(value?.catch));

/**
 *
 * @param value
 */
export const isNotFunction = (value: any): boolean => !isFunction(value);

/**
 *
 * @param args
 */
export const isCombineConfigMode = (args: any[]): boolean => isObject(args[0]);

/**
 *
 * @param value
 */
export const identity = <T>(value: T): T => value;

/**
 *
 * @param useCustomHook
 * @param funcDescriptions
 */
export const unwindLoop = <T extends (...args: any[]) => any>(
  useCustomHook: (
    func: FnCfg<T> | T,
    deps: string[],
    state: KVPair,
    props: KVPair
  ) => KVPair<T>,
  funcDescriptions: KVPair<FnCfg<T> | T>
): ((deps: string[], state: KVPair, props: KVPair) => KVPair) => {
  const FuncCtor = Function;

  const invocations = [];

  for (const key of Object.keys(funcDescriptions)) {
    invocations.push(
      `box.${key} = useCustomHook(fns.${key}, deps, state, props);`
    );
  }

  const body = `
      const box = {};
      ${invocations.join("\n")}
      return box
    `;

  return new FuncCtor(
    "useCustomHook",
    "fns",
    "deps",
    "state",
    "props",
    body
  ).bind(null, useCustomHook, funcDescriptions);
};

/**
 *
 * @param value
 * @param path
 */
export const prop = (value: KVPair<any>, path: string): any => {
  if (value === undefined) {
    return undefined;
  }

  let stage = value;

  for (const part of path.split(".")) {
    stage = stage?.[part];

    if (stage === undefined) {
      return undefined;
    }
  }

  return stage;
};

/**
 *
 * @param source
 * @param depsNames
 */
export const getDeps = (
  source: KVPair<any>,
  depsNames?: string[]
): React.DependencyList => {
  if (depsNames === undefined) {
    return undefined;
  }

  const deps = [];

  for (const depName of depsNames) {
    deps.push(prop(source, depName));
  }

  return deps;
};

/**
 *
 * @param Component
 * @param callbacks
 */
export const enchance = (
  Component: IReactComponent,
  ...callbacks: [(component: IReactComponent) => IReactComponent]
): IReactComponent => callbacks.reduce(iteratee, Component);
