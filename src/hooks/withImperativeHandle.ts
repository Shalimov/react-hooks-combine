import { useImperativeHandle } from "react";

import { getDeps } from "../utils";
import { IKVPair } from "../types";

export const withImperativeHandle = <T>(
  createHandler: (state: IKVPair, props: IKVPair) => any,
  dependencies: string[]
) => (state: IKVPair, props: IKVPair, ref: React.Ref<T>) => {
  const deps = getDeps({ ...state, ...props }, dependencies);
  useImperativeHandle(ref, () => createHandler(state, props), deps);
};
