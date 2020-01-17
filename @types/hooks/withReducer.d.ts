/// <reference types="react" />
import { IReducerParams } from "../types";

export declare const withReducer: <S, A>(
  config: IReducerParams<S, A>
) => () => {
  [x: string]: S | import("react").Dispatch<A>;
};
