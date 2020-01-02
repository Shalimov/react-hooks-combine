import { useContext } from "react";

import { IKVPair, ICustomHook } from "../types";
import { identity } from "../utils";

export const withContext = <T>(
  contextName: string,
  Context: React.Context<T>,
  transform = identity
): ICustomHook<T> => (): IKVPair<T> => {
  const context = useContext(Context);
  return { [contextName]: transform(context) };
};
