import * as React from "react";
import { renderHook } from "@testing-library/react-hooks";
import { withContext } from "../../src/hooks";

describe("With Context hook", () => {
  test("should get default context value", () => {
    const TestContext = React.createContext("test_context");
    const { result } = renderHook(() =>
      withContext("testContext", TestContext)()
    );

    expect(result.current.testContext).toBe("test_context");
  });

  test("should get value from provider", () => {
    const TestContext = React.createContext("test_context");

    /* eslint-disable */
    const wrapper = ({ children }: any) => (
      <TestContext.Provider value="context_value">
        {children}
      </TestContext.Provider>
    );
    /* eslint-enable */

    const { result } = renderHook(
      () => withContext("testContext", TestContext)(),
      { wrapper }
    );

    expect(result.current.testContext).toBe("context_value");
  });

  test("should use transform fn param to transform or extract some prop from context", () => {
    const value = { services: "services", storages: "storages" };
    const TestContext = React.createContext(value);

    /* eslint-disable */
    const wrapper = ({ children }: any) => (
      <TestContext.Provider value={value}>{children}</TestContext.Provider>
    );
    /* eslint-enable */

    const { result } = renderHook(
      () =>
        withContext("services", TestContext, ({ services }: any) => services)(),
      { wrapper }
    );

    expect(result.current.services).toBe(value.services);
  });
});
