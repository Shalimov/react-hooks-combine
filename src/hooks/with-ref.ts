import { useRef } from "react";

import { ICustomHook, IKVPair } from "../types";

export const withRef = <T>(
  refName: string,
  initialValue: T
): ICustomHook => (): IKVPair<React.MutableRefObject<T>> => {
  const ref = useRef(initialValue);
  return { [refName]: ref };
};
