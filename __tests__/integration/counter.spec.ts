import { renderHook, act } from "@testing-library/react-hooks";

import { withState, withCallbacks, withStateHandlers } from "../../src";
import { repeatScenario } from "../utils";
import { hookBuilder } from "../../src/hookBuilder";
import { IFnCfg, IKVPair } from "../../src/types";
import { CallbackFunc } from "../../src/hooks/withCallbacks";

describe("Counter Hook", () => {
  test(`
  Creates custom hook to control counter state
  - toggle 10 times and check the results of expand (use func updater for setExpand)
  - check reference persistency of onToggle function (empty array of deps)
  `, () => {
    const callbacks: IKVPair<IFnCfg<CallbackFunc>> = {
      onToggle: {
        func: (state, ownProps) => () => {
          state.setExpand((exp: boolean) => !exp);
        },
        deps: []
      }
    };

    const useCounterHook = hookBuilder([
      withState("expand", "setExpand", false),
      withCallbacks(callbacks, [])
    ]);

    const { result } = renderHook(() => useCounterHook(), {});

    let prevOnToggle = null;
    let prevExpand = null;

    repeatScenario(10, () => {
      prevOnToggle = result.current.onToggle;
      prevExpand = result.current.expand;

      act(() => result.current.onToggle());

      expect(result.current.onToggle).toEqual(prevOnToggle);
      expect(result.current.expand).not.toBe(prevExpand);
    });
  });

  test(`
  Creates custom hook to control counter state
  - toggle 10 times and check the results of expand
  - check reference persistency of onToggle function that depends on 'expand' value
  `, () => {
    const callbacks: IKVPair<IFnCfg<CallbackFunc>> = {
      onToggle: {
        func: (state, ownProps) => () => {
          state.setExpand((exp: boolean) => !exp);
        },
        deps: ["expand"]
      }
    };

    const useCounterHook = hookBuilder([
      withState("expand", "setExpand", false),
      withCallbacks(callbacks, ["expand"])
    ]);

    const { result } = renderHook(() => useCounterHook(), {});

    let prevOnToggle = null;
    let prevExpand = null;

    repeatScenario(10, () => {
      prevOnToggle = result.current.onToggle;
      prevExpand = result.current.expand;

      act(() => result.current.onToggle());

      expect(result.current.onToggle).not.toEqual(prevOnToggle);
      expect(result.current.expand).not.toBe(prevExpand);
    });
  });

  test(`
  Creates custom hook to control counter state
  - toggle 10 times and check the results of expand
  - check reference persistency of onToggle function that depends on 'expand' value
  `, () => {
    const callbacks: IKVPair<IFnCfg<CallbackFunc>> = {
      onToggle: {
        func: (state, ownProps) => () => {
          state.setExpand((exp: boolean) => !exp);
        },
        deps: []
      }
    };

    const useCounterHook = hookBuilder([
      withState("expand", "setExpand", false),
      withCallbacks(callbacks, [])
    ]);

    const { result, rerender } = renderHook<any, IKVPair>(
      () => useCounterHook(),
      {}
    );

    rerender();

    let prevOnToggle = null;
    let prevExpand = null;

    repeatScenario(10, () => {
      prevOnToggle = result.current.onToggle;
      prevExpand = result.current.expand;

      rerender();

      expect(result.current.onToggle).not.toEqual(prevOnToggle);
      expect(result.current.expand).toBe(prevExpand);
    });
  });

  test(`
  Creates custom hook to control counters state
  - check whether state is up to date every update in callbacks`, () => {
    const callbacks: IKVPair<IFnCfg<CallbackFunc>> = {
      onIncA: {
        func: (state, ownProps) => () => {
          state.incA(state);
        },
        deps: []
      },
      onIncB: {
        func: (state, ownProps) => () => {
          state.incB(state);
        },
        deps: []
      },

      onDecA: {
        func: (state, ownProps) => () => {
          state.decA(state);
        },
        deps: []
      },

      onDecB: {
        func: (state, ownProps) => () => {
          state.decB(state);
        },
        deps: []
      }
    };

    const useCounterHook = hookBuilder([
      withStateHandlers(
        {
          countA: 0,
          countB: 0
        },
        {
          incA: ({ state: { countA } }) => ({ countA: countA + 1 }),
          decA: ({ state: { countA } }) => ({ countA: countA - 1 }),
          incB: ({ state }) => ({ countB: state.countB + 1 }),
          decB: ({ state }) => ({ countB: state.countB - 1 })
        }
      ),
      withCallbacks(callbacks, [])
    ]);

    const { result } = renderHook(() => useCounterHook(), {});

    expect(result.current.countA).toBe(0);
    expect(result.current.countB).toBe(0);

    act(() => result.current.onIncB());
    act(() => result.current.onIncB());
    act(() => result.current.onIncA());

    expect(result.current.countA).toBe(1);
    expect(result.current.countB).toBe(2);

    act(() => result.current.onDecB());

    expect(result.current.countA).toBe(1);
    expect(result.current.countB).toBe(1);
  });
});
