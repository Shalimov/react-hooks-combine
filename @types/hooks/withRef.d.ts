/// <reference types="react" />
import { ICustomHook, IKVPair } from "../types";

export declare const withRef: <T>(
  refName: string,
  initialValue: T
) => ICustomHook<
  import("react").MutableRefObject<T>,
  IKVPair<import("react").MutableRefObject<T>>
>;
