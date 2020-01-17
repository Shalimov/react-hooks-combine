import * as React from "react";
import { IReactComponent, ICustomHook, IKVPair, ICombineConfig } from "./types";
export declare function combine(
  config: ICombineConfig
): () => (
  Component: IReactComponent<{}>
) => React.FunctionComponent<{}> | React.ComponentClass<{}, any>;
export declare function combine(
  ...hooks: ICustomHook<any, IKVPair<any>>[]
): (
  Component: IReactComponent<{}>
) => React.FunctionComponent<{}> | React.ComponentClass<{}, any>;
