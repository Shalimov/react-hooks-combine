import { useContext } from "react";

import { KVPair, CustomHook } from "../types";
import { identity } from "../utils";

export const withContext = <T>(
  contextName: string,
  Context: React.Context<T>,
  transform = identity
): CustomHook<T> => (): KVPair<T> => {
  const context = useContext(Context);
  return { [contextName]: transform(context) };
};
