import * as React from "react";
import {
  create,
  ReactTestInstance,
  ReactTestRenderer
} from "react-test-renderer";
import { renderHook, act } from "@testing-library/react-hooks";
import { withStateHandlers } from "../../src/hooks";
import { combine } from "../../src/combine";
import { IKVPair } from "../../src/types";

describe("With State Handlers hook", () => {
  test("should increment and decrement counter", () => {
    const initialState = {
      count: 0
    };
    const actionHandlers = {
      increment: ({ state }: IKVPair) => ({ count: state.count + 1 }),
      decrement: ({ state }: IKVPair) => ({ count: state.count - 1 })
    };

    const wsh = withStateHandlers(initialState, actionHandlers);
    const { result } = renderHook(() => wsh({}, {}));

    act(() => result.current.increment());
    act(() => result.current.increment());

    expect(result.current.count).toBe(2);

    act(() => result.current.decrement());

    expect(result.current.count).toBe(1);
  });

  test("should increment and decrement counter using handlers", () => {
    const initialState = ({ count }: { count: number }) => ({ count });
    const actionHandlers = {
      increment: ({ state }: IKVPair) => ({ count: state.count + 1 }),
      decrement: ({ state }: IKVPair) => ({ count: state.count - 1 })
    };

    const wsh = withStateHandlers(initialState, actionHandlers);

    const { result } = renderHook(() => wsh({ count: 2 }, {}));

    act(() => result.current.increment());
    act(() => result.current.increment());

    expect(result.current.count).toBe(4);

    act(() => result.current.decrement());

    expect(result.current.count).toBe(3);
  });

  test("should not rerender component if no changes", () => {
    let updateCount = 0;

    const Component = () => {
      updateCount += 1;
      return <span>component</span>;
    };

    const CombinedComponent = combine(
      withStateHandlers(
        {
          count: 0,
          innerCount: 1
        },
        {
          setCount: ({ args: [count] }) => ({ count })
        }
      )
    )(Component);

    const renderer: ReactTestRenderer = create(<CombinedComponent />);

    expect(updateCount).toBe(1);

    const zeroItem = renderer.root.children[0] as ReactTestInstance;

    act(() => zeroItem.props.setCount(1));

    expect(updateCount).toBe(2);

    act(() => zeroItem.props.setCount(1));
    act(() => zeroItem.props.setCount(1));

    expect(updateCount).toBe(2);

    act(() => zeroItem.props.setCount(1));
    act(() => zeroItem.props.setCount(1));

    expect(updateCount).toBe(2);

    act(() => zeroItem.props.setCount(2));

    expect(updateCount).toBe(3);
  });

  test("should not share state between hooked components", () => {
    const Component = () => <span>component</span>;

    const CombinedComponent = combine(
      withStateHandlers(
        {
          count: 0
        },
        {
          setCount: ({ args: [count] }) => ({ count })
        }
      )
    )(Component);

    const renderer1 = create(<CombinedComponent />);
    const renderer2 = create(<CombinedComponent />);

    const r1ZeroItem = renderer1.root.children[0] as ReactTestInstance;
    const r2ZeroItem = renderer2.root.children[0] as ReactTestInstance;

    expect(r1ZeroItem.props.count).toBe(0);
    expect(r2ZeroItem.props.count).toBe(0);

    act(() => r1ZeroItem.props.setCount(1));

    expect(r1ZeroItem.props.count).toBe(1);
    expect(r2ZeroItem.props.count).toBe(0);

    act(() => r2ZeroItem.props.setCount(2));

    expect(r1ZeroItem.props.count).toBe(1);
    expect(r2ZeroItem.props.count).toBe(2);
  });
});
