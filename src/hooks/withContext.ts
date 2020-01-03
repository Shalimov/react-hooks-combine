import { useContext } from "react";

import { IKVPair, ICustomHook } from "../types";
import { identity } from "../utils";

export const withContext = <C>(
  contextName: string,
  Context: React.Context<C>,
  transform = identity
): ICustomHook<C> => (): IKVPair<C> => {
  const context = useContext(Context);
  return { [contextName]: transform(context) };
};
