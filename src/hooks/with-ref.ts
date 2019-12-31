import { useRef } from "react";

import { CustomHook, KVPair } from "../types";

export const withRef = <T>(
  refName: string,
  initialValue: T
): CustomHook => (): KVPair<React.MutableRefObject<T>> => {
  const ref = useRef(initialValue);
  return { [refName]: ref };
};
