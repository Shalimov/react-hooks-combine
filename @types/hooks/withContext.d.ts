/// <reference types="react" />
import { IKVPair, ICustomHook } from "../types";
export declare const withContext: <C>(
  contextName: string,
  Context: import("react").Context<C>,
  transform?: <T>(value: T) => T
) => ICustomHook<C, IKVPair<C>>;
