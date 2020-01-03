import { useEffect, useState, useRef } from "react";

import { IAsyncEffectParams, IKVPair, ICustomHook } from "../types";
import { getDeps, isLikePromise, getInternalCtor } from "../utils";

export const withAsyncEffect = <T>(
  params: IAsyncEffectParams<T>
): ICustomHook => {
  const {
    asyncAction,
    disposeAction,
    dataName,
    loadingName,
    errorName,
    deps
  } = {
    dataName: "data",
    errorName: "error",
    loadingName: "loading",
    ...params
  };

  return (state: IKVPair, props: IKVPair): IKVPair => {
    const referedStateProps = useRef({ state, props });
    const invalidatedRun = useRef(false);
    const [innerState, setData] = useState<IKVPair>({
      [loadingName]: true,
      [dataName]: null,
      [errorName]: null
    });

    useEffect(() => {
      if (invalidatedRun.current) {
        setData({
          [dataName]: innerState[dataName],
          [loadingName]: true,
          [errorName]: null
        });
      }

      invalidatedRun.current = true;

      const promise = asyncAction(state, props, referedStateProps.current);

      referedStateProps.current = { state, props };

      if (!isLikePromise(promise)) {
        throw Error(
          `withAsyncEffect expects Promise, got a: ${getInternalCtor(promise)}`
        );
      }

      promise.then(
        result => {
          setData({
            [loadingName]: false,
            [dataName]: result,
            [errorName]: null
          });
        },
        error => {
          setData({
            [loadingName]: false,
            [dataName]: innerState[dataName],
            [errorName]: error
          });
        }
      );

      return disposeAction;
    }, getDeps({ ...state, ...props }, deps));

    return innerState;
  };
};
