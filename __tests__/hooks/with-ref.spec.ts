import { renderHook } from "@testing-library/react-hooks";
import { withRef } from "../../src/hooks";
import { IKVPair } from "../../src/types";

describe("With Ref hook", () => {
  test("should exist ref object", () => {
    const { result } = renderHook<
      any,
      IKVPair<React.MutableRefObject<{ test: number }>>
    >(() => withRef("customRef", { test: 1 })());

    expect(result.current.customRef.current).toEqual({ test: 1 });
  });
});
