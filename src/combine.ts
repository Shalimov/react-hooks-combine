import * as React from "react";

import { IReactComponent, ICombineConfig, ICustomHook, IKVPair } from "./types";
import { hookBuilder } from "./hookBuilder";
import { isCombineConfigMode, identity, enchance } from "./utils";

const combineFromConfig = (
  config: ICombineConfig,
  Component: IReactComponent
): IReactComponent => {
  const { hooks, transformProps, transformPropsBefore } = {
    hooks: <ICustomHook[]>[],
    transformProps: identity,
    transformPropsBefore: identity,
    ...config
  };

  const hooksComposition = hookBuilder(hooks);

  const ExtendedComponent = (props: IKVPair): React.ReactElement => {
    const transformedProps = transformPropsBefore(props);
    const { forwardedRef } = transformedProps;
    const state = hooksComposition(transformedProps, forwardedRef);
    const allProps = { ...transformedProps, ...state };

    return React.createElement(Component, {
      ...transformProps(allProps),
      ...(<any>{ ref: forwardedRef })
    });
  };

  return ExtendedComponent;
};

export const combine = (...hooks: ICustomHook[]) => (
  Component: IReactComponent
) => {
  const ExtendedComponent = isCombineConfigMode(hooks)
    ? combineFromConfig(hooks[0] as ICombineConfig, Component)
    : combineFromConfig({ hooks }, Component);

  ExtendedComponent.displayName = `${Component.displayName ||
    Component.name}Hooked`;

  return ExtendedComponent;
};
