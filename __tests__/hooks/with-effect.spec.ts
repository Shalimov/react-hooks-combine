import { renderHook } from "@testing-library/react-hooks";
import { withEffect } from "../../src/hooks";
import { IKVPair } from "../../src/types";

describe("With Effect hook", () => {
  test("should call side effects when mounting, updating and unmounting", () => {
    const sideEffects: any = { 1: false, 2: false };

    const useHook = (state: IKVPair<any>, props: IKVPair<any>) => {
      sideEffects[props.id] = true;
      return () => {
        sideEffects[props.id] = false;
      };
    };

    const wEff = withEffect(useHook, ["id"]);

    const { unmount, rerender } = renderHook(({ id }) => wEff({}, { id }), {
      initialProps: { id: 1 }
    });

    expect(sideEffects[1]).toBe(true);
    expect(sideEffects[2]).toBe(false);

    rerender({ id: 2 });

    expect(sideEffects[1]).toBe(false);
    expect(sideEffects[2]).toBe(true);

    rerender();

    expect(sideEffects[1]).toBe(false);
    expect(sideEffects[2]).toBe(true);

    unmount();

    expect(sideEffects[1]).toBe(false);
    expect(sideEffects[2]).toBe(false);
  });

  test("should call side effects when mounting, updating and unmounting", () => {
    const sideEffects: any = { currProps: null, prevProps: null };

    const useHook = (
      state: IKVPair<any>,
      props: IKVPair<any>,
      prevStateProps: { state: IKVPair<any>; props: IKVPair<any> }
    ) => {
      sideEffects.currProps = props;
      sideEffects.prevProps = prevStateProps.props;
      return () => {
        sideEffects.currProps = props;
        sideEffects.prevProps = prevStateProps.props;
      };
    };

    const wEff = withEffect(useHook, ["id"]);

    const { rerender } = renderHook(({ id }) => wEff({}, { id }), {
      initialProps: { id: 1 }
    });

    expect(sideEffects.currProps.id).toBe(1);
    expect(sideEffects.prevProps.id).toBe(1);

    rerender({ id: 2 });

    expect(sideEffects.currProps.id).toBe(2);
    expect(sideEffects.prevProps.id).toBe(1);

    rerender({ id: 3 });

    expect(sideEffects.currProps.id).toBe(3);
    expect(sideEffects.prevProps.id).toBe(2);
  });
});
