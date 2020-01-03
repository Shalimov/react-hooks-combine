import { useReducer } from "react";

import { IReducerParams } from "../types";

export const withReducer = <S, A>(config: IReducerParams<S, A>) => {
  const { reducer, stateName, dispatchName, initialState, init } = {
    dispatchName: "dispatch",
    ...config
  };

  return () => {
    const [state, dispatch] = useReducer(reducer, initialState, init);
    return { [stateName]: state, [dispatchName]: dispatch };
  };
};
