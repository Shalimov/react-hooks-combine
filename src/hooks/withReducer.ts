import { useReducer } from "react";

import {ICustomHook, IKVPair, IReducerParams} from '../types';

export const withReducer = <S, A>(config: IReducerParams<S, A>):ICustomHook => {
  const { reducer, stateName, dispatchName, initialState, init } = {
    dispatchName: "dispatch",
    ...config
  };

  return ():IKVPair => {
    const [state, dispatch] = useReducer(reducer, initialState, init);
    return { [stateName]: state, [dispatchName]: dispatch };
  };
};
