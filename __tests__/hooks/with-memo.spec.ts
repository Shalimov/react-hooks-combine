import { act, renderHook } from "@testing-library/react-hooks";
import { withMemo, withMemos } from "../../src/hooks";
import { IFnCfg, IKVPair } from "../../src/types";
import { MemoFunc } from "../../src/hooks/withMemo";
import { useEffect, useMemo, useState } from "react";

describe("With Memo hook", () => {
  test("should use memo hook", () => {
    const { result, rerender } = renderHook(
      ({ value }) =>
        withMemo("memoValue", () => ({ value }), ["value"])(
          { value },
          { value }
        ),
      {
        initialProps: { value: 1 }
      }
    );

    const { memoValue: value1 } = result.current;
    expect(value1).toEqual({ value: 1 });

    rerender();

    const { memoValue: value2 } = result.current;
    expect(value2).toEqual({ value: 1 });
    expect(value2).toBe(value1);

    rerender({ value: 2 });

    const { memoValue: value3 } = result.current;
    expect(value3).toEqual({ value: 2 });
    expect(value3).not.toBe(value1);
  });

  test("should use memos hook with configs", () => {
    let value = 1;
    const funcs: IKVPair<IFnCfg<MemoFunc> | MemoFunc> = {
      memoValue1: {
        deps: ["value"],
        func: () => ({ value })
      },
      memoValue2: {
        deps: ["value"],
        func: () => ({ value: value * 2 })
      }
    };

    const wm = withMemos(funcs, ["value"]);

    const { result, rerender } = renderHook(({ value }) => wm({},{value}), {
      initialProps: { value: 1 }
    });

    const { memoValue1: value1 } = result.current;
    expect(value1).toEqual({ value: 1 });

    rerender();

    const { memoValue1: value2 } = result.current;
    expect(value2).toEqual({ value: 1 });
    expect(value2).toBe(value1);

    rerender({ value: 2 });

    const { memoValue1: value3 } = result.current;
    expect(value3).toEqual({ value: 2 });
    expect(value3).not.toBe(value1);

    rerender({ value: 1 });

    const { memoValue2: value4 } = result.current;
    expect(value4).toEqual({ value: 2 });

    rerender();

    const { memoValue2: value5 } = result.current;
    expect(value5).toEqual({ value: 2 });
    expect(value5).toBe(value4);

    rerender({ value: 2 });

    const { memoValue2: value6 } = result.current;
    expect(value6).toEqual({ value: 4 });
    expect(value6).not.toBe(value4);
  });

  test("should use memos hook with handlers", () => {
    const { result, rerender } = renderHook(
      ({ value }) =>
        withMemos(
          {
            memoValue1: () => ({ value }),
            memoValue2: () => ({ value: value * 2 })
          },
          ["value"]
        )({ value }, { value }),
      {
        initialProps: { value: 1 }
      }
    );

    const { memoValue1: value1 } = result.current;
    expect(value1).toEqual({ value: 1 });

    rerender();

    const { memoValue1: value2 } = result.current;
    expect(value2).toEqual({ value: 1 });
    expect(value2).toBe(value1);

    rerender({ value: 2 });

    const { memoValue1: value3 } = result.current;
    expect(value3).toEqual({ value: 2 });
    expect(value3).not.toBe(value1);

    rerender({ value: 1 });

    const { memoValue2: value4 } = result.current;
    expect(value4).toEqual({ value: 2 });

    rerender();

    const { memoValue2: value5 } = result.current;
    expect(value5).toEqual({ value: 2 });
    expect(value5).toBe(value4);

    rerender({ value: 2 });

    const { memoValue2: value6 } = result.current;
    expect(value6).toEqual({ value: 4 });
    expect(value6).not.toBe(value4);
  });
});
