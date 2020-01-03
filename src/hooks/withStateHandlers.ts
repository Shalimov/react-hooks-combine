import { useState } from "react";

import { IKVPair, IInitFunc } from "../types";
import { isFunction } from "../utils";

type StateHandler = (params: {
  state: IKVPair;
  props: IKVPair;
  args: any[];
}) => any;

export const withStateHandlers = <S>(
  initialState: S | IInitFunc<S>,
  actionHandlers: IKVPair<StateHandler>
) => {
  const initState = isFunction(initialState)
    ? (state: IKVPair, props: IKVPair) => () =>
        (<IInitFunc<S>>initialState)(state, props)
    : () => <S>initialState;

  const weekComponentRef = new WeakMap();

  return (state: IKVPair, props: IKVPair): IKVPair => {
    const [localState, updater] = useState(initState(state, props));

    if (!weekComponentRef.has(updater)) {
      const initialAttachedData = {
        state: localState,
        props,
        actionHandlers: <IKVPair<StateHandler>>{}
      };

      weekComponentRef.set(updater, initialAttachedData);

      const assignToState = (updatedStatePart: S) => {
        const internals = weekComponentRef.get(updater);
        const { state: inState } = internals;
        const needUpdate = Object.entries(updatedStatePart).some(
          ([key, value]) => inState[key] !== value
        );

        if (needUpdate) {
          const bufferedState = { ...inState, ...updatedStatePart };
          internals.state = bufferedState;
          updater(bufferedState);
        }
      };

      for (const [key, actionHandler] of Object.entries(actionHandlers)) {
        // eslint-disable-next-line no-loop-func
        initialAttachedData.actionHandlers[key] = (...args: any[]) => {
          const { state: inState, props: inProps } = weekComponentRef.get(
            updater
          );
          
          const result = actionHandler({
            args,
            state: inState,
            props: inProps
          });

          assignToState(result);
        };
      }
    }

    const internals = weekComponentRef.get(updater);
    internals.state = localState;
    internals.props = props;

    return { ...localState, ...internals.actionHandlers };
  };
};
