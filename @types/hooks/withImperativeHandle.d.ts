/// <reference types="react" />
import { IKVPair } from "../types";

export declare const withImperativeHandle: <T>(
  createHandler: (state: IKVPair<any>, props: IKVPair<any>) => any,
  dependencies: string[]
) => (
  state: IKVPair<any>,
  props: IKVPair<any>,
  ref: import("react").Ref<T>
) => void;
