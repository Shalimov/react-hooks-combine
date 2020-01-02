import { IReactComponent, IKVPair, IFnCfg } from "./types";

const bastToString = Object.prototype.toString;

/**
 * Retrieves internal constructor type
 * @param value
 */
export const getInternalCtor = (value: any): string =>
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
 * Tells whether argument is function
 *
 * @param {any} value
 * @return {boolean} whether it's object
 */
export const isFunction = createIsTypeFunc("Function");

/**
 * Tells whether argument is object structure
 *
 * @param {any} value
 * @return {boolean} whether it's object
 */
export const isObject = createIsTypeFunc("Object");

/**
 * Tells whether argument is promise like structure
 *
 * @param value
 */
export const isLikePromise = (value: any): boolean =>
  isPromise(value) || (isFunction(value?.then) && isFunction(value?.catch));

/**
 * Tells whether argument is not function
 *
 * @param value
 */
export const isNotFunction = (value: any): boolean => !isFunction(value);

/**
 * Tells whether argument is not function
 *
 * @param args
 */
export const isCombineConfigMode = (args: IKVPair[]): boolean =>
  isObject(args[0]);

/**
 *
 * @param value
 */
export const identity = <T>(value: T): T => value;

/**
 *  Unwind loop to line by line invocations of functions
 *
 * @param {(func: IFnCfg<T> | T, deps: string[], state: IKVPair, props: IKVPair) => IKVPair<T>} useCustomHook
 * @param {IKVPair<IFnCfg<T> | T>} funcDescriptions
 * @return {(deps: string[], state: IKVPair, props: IKVPair) => IKVPair} function which invokes array of passed functions outside of loop one by one
 */
export const unwindLoop = <T extends (...args: any[]) => any>(
  useCustomHook: (
    func: IFnCfg<T> | T,
    deps: string[],
    state: IKVPair,
    props: IKVPair
  ) => IKVPair<T>,
  funcDescriptions: IKVPair<IFnCfg<T> | T>
): ((deps: string[], state: IKVPair, props: IKVPair) => IKVPair) => {
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
export const prop = (value: IKVPair<any>, path: string): any => {
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
  source: IKVPair<any>,
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
  callbacks: [(component: IReactComponent) => IReactComponent],
  Component: IReactComponent
): IReactComponent => callbacks.reduce(iteratee, Component);
