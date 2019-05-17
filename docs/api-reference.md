# API Reference


## __Content:__

- [Utils](#utils)
  - [combine()](#combine)
- [Hook Wrappers](#hookWrappers)
  - [State Related](#withState)
    - [withState()](#withState)
    - [withStateHandlers()](#withStateHandlers)
    - [withReducer()](#withReducer)
  - [Callbacks](#withCallback)
    - [withCallback()](#withCallbacks)
    - [withCallbacks()](#withCallbacks)
  - [Memo](#withMemo)
    - [withMemo()](#withMemo)
    - [withMemos()](#withMemos)
  - [Effect](#withEffect)
    - [withEffect()](#withEffect)
    - [withLayoutEffect()](#withLayoutEffect)
    - [withAsyncEffect()](#withAsyncEffect)
  - [Other](#withContext)
    - [withContext()](#withContext)
    - [withRef()](#withRef)
    - ~~[withImperativeHandle()](#withImperativeHandle)~~
    - [withDebugValue()](#withDebugValue)

## <a name="utils"></a>__Utils__

### <a name="combine"></a>__`combine()`__

```javascript
combine(hooks: Array.<Function -> CustomHook>) -> HigherOrderComponent (HOC)
```

```javascript
/**
 * @typedef CombineConfig
 * @type {object}
 * @property {Array.<Function -> HOC>} hocs - list of higher order components (HOC);
 * @property {Array.<Function -> CustomHook>} hooks - list of functions which create custom hooks;
 * @property {Boolean} forwardRef - passing ref to component;
 * @property {Object} defaultProps - set of default component props;
 * @property {Function -> Object} transformProps - props transformer to omit, filter, map props which are supposed to be passed
 * @property {Function -> Object} transformPropsBefore - props pre-transformer to omit, filter, map props which are supposed to be passed to custom hook composition and to transform props
*/
combine(config: CombineConfig) -> HigherOrderComponent
```

Combines [custom hook](https://reactjs.org/docs/hooks-custom.html) creators into single [custom hook](https://reactjs.org/docs/hooks-custom.html) and wrap original component to invoke the custom hook and pass values of it as props to inner one.

__NB!__: It's different from [recompose](https://github.com/acdlite/recompose) `compose` function because __`combine`__ wraps component only once per any number of provided hooks while `compose` wraps component as many times as hocs are included

As you can see above: two types of params are accepted:
- list of custom hook creators (withState, withCallbacks and so on)
- or __CombineConfig__ object

You can use __CombineConfig__ to cover the following cases:
- You need to use HOCS from 3rd party lib (e.g: Apollo GraphQl, Mobx-React, Recompose)
- You want to set default props for Wrapper
- You want to filter/omit/transform props before passing them down


__Example (list of hook creators):__

```javascript
import { combine, withState, withCallbacks } from 'react-hooks-combine'

import { Button } from './component.jsx'

const EnhancedButton = combine(
  withRef('refName', null),
  withState('someState', 'setSomeState', null),
  withCallbacks({
    onTrigger: (state, props) => () => {
      console.log(state) // { refName: React.ElementReference, someState: ... }
      console.log(props) // some props
    }
  }, ['someState'])
)(Button)

export default EnhancedButton
```


__Example (CombineConfig):__

```javascript
import _ from 'lodash'
import { tag } from 'graphql'
import { inject } from 'mobx-react'
import { combine, withState, withCallbacks } from 'react-hooks-combine'

import { Button } from './component.jsx'

const EnhancedButton = combine({
  hocs: [
    inject('applicationState'),
    tag(`
      query ....
    `)
  ],

  hooks: [
    withState(...),
    withCallbacks(...),
  ],

  degaultProps: {
    type: 'button',
    animated: true,
  },

  // it happens before hooks invocation, that's why we have no state props there
  // result of this operation will be used in custom hook and transformProps
  transformPropsBefore: props => _.omit(props, ['someExtraProp', 'someOtherProp'])

  // props combines state and props
  transformProps: props => _.pick(props, ['data', 'applicationState', 'animated', 'type'])
})(Button)

export default EnhancedButton
```

## <a name="hookWrappers"></a>__Hook Wrappers__

### <a name="withState"></a>__`withState()`__

```javascript
// @typedef {Function(state: Object, props: Object) -> any} InitStateFunc
withState(stateName: string, updateFn: string, initialState: any | InitStateFunc) -> CustomHook
```
Creates a custom hook which produces local state and update function, based on [useState](https://reactjs.org/docs/hooks-reference.html#usestate) hook.
3rd parameter can accept any value as initial state or function that inits state lazily.

__NB!__: The initialState argument is the state used during the initial render. In subsequent renders, it is disregarded. If the initial state is the result of an expensive computation, you may provide a function instead, which will be executed only on the initial render.

__Example__

```javascript
import { combine, withState } from 'react-hooks-combine'

import { Panel } from './component.jsx'

const EnhancedPanel = combine(
  withState('stateValue1', 'setStateValue1', 'Hello State Value 1'),
  withState('stateValue2', 'setStateValue2', (state, ownProps) => {
    // will be invoked only once
    console.log(ownProps) // component ownProps
    console.log(state) // { stateValue1: Hello State Value 1 }
    return someExpensiveComputation(state, props)
  })
)(Panel)

export default EnhancedPanel
```

### <a name="withStateHandlers"></a>__`withStateHandlers()`__

```javascript
withStateHandlers(
  initialState: Object | Function(state: Object, ownProps: Object) -> Object,
  stateUpdaters: {
    [key: string]: Function(state: Object, ownProps: Object) -> Function(...payload: any[]) -> Object
  }
) -> CustomHook
```
An alternative to [`withState()`](#withState).
Passes state object properties and immutable updater functions in a form of `Function(...payload: any[]) -> Object` to the wrapped component.

Every state updater function accepts state, props and payload and must return a new state or undefined. The new state is shallowly merged with the previous state. Returning undefined does not cause a component rerender.

__Example__

```javascript

import { combine, withStateHandlers } from 'react-hooks-combine'

import { Panel } from './component.jsx'

const EnhancedPanel = combine(
  withStateHandlers({
    collapsed: false,
    loading: false,
    data: null,
  }, {
    expand: () => () => ({ collapsed: false }),
    collapse: () => () => ({ collapsed: true }),
    setLoadingState: () => loading => ({ loading }),
    setData: () => data => ({ data })
  }),
  withCallbacks({
    onCollapse: (state, ownProps) => () => {
      if (props.canBeCollapsed) {
        state.collapse()
      }
    },
    ...
  })
)(Panel)

export default EnhancedPanel
```

### <a name="withReducer"></a>__`withReducer()`__

```javascript
withReducer<S, A>(
  config: {
    reducer: Function(state: S, action: any) -> S,
    stateName: string,
    dispatchName?: string, // 'dispatch' by default
    initialState?: S,
    init?: Function(S) -> S,
  }
) -> CustomHook
```

An alternative to [`withState()`](#withState). Based on [useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer) hook. Accepts a config object with required properties such as:
- reducer of type Function(state, action) -> newState
- stateName - will be found in result state object by provided name
- dispatchName (dispatch by default) - will be found in result state object by provided name
- initialState - complex initial state
- init - lazy state initializer function

Returns the current state paired with a dispatch method.

[`withReducer`](#withReducer) is usually preferable to useState when you have complex state logic that involves multiple sub-values or when the next state depends on the previous one. useReducer also lets you optimize performance for components that trigger deep updates because you can pass dispatch down instead of callbacks.


```javascript
// component.jsx
export const Counter = ({ counterState, onInc, onDec }) => (
  <>
    Count: {counterState.count}
    <button onClick={onInc}>+</button>
    <button onClick={onDec}>-</button>
  </>
)
```
```javascript
// container.js

import { combine, withReducer, withCallbacks } from 'react-hooks-combine'

import { Counter } from './component.jsx'

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'inc':
      return { count: state.count + 1 };
    case 'dec':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

const EnhancedCounter = combine(
  withReducer({
    reducer,
    stateName: 'counterState',
    initialState,
  }),
  withCallbacks({
    onInc: ({ dispatch }, ownProps) => () => {
      dispatch({ type: 'inc' })
    },

    onDec: ({ dispatch }, ownProps) => () => {
      dispatch({ type: 'dec' })
    }
  }, [])
)(Counter)

export default EnhancedCounter

```
### <a name="withCallback"></a>__`withCallback()`__
```javascript
// @typedef {Function(state: Object, ownProps: Object) -> Function(...args[]: any)} CallbackCreator
withCallback(cbName: string, cbCreator: CallbackCreator , dependencies: Array.<string>) -> CustomHook
```

Creates a custom hook to produce a memoized callback. Based on [useCallback](https://reactjs.org/docs/hooks-reference.html#usecallback) hook.

Pass an inline callback and an array of dependencies. Custom hook which is using [useCallback](https://reactjs.org/docs/hooks-reference.html#usecallback) will return a memoized version of the callback that only changes if one of the dependencies has changed. This is useful when passing callbacks to optimized child components that rely on reference equality to prevent unnecessary renders (e.g. shouldComponentUpdate).

__Example__

```javascript
// component.jsx
import React from 'react'

export const ToggleButton = ({ onToggle }) => (
  <button onClick={onToggle} ...>
    ...
  </button>
)

```
```javascript
// container.js

import { combine, withCallback } from 'react-hooks-combine'

import { ToogleButton } from './component'

const EnhancedToggleButton = combine(
  withCallback('onToggle', (state, ownProps) => )
)(ToggleButton)

export default ToggleButton
```

### <a name="withCallbacks"></a>__`withCallbacks()`__

```javascript
// @typedef {Function(state: Object, ownProps: Object) -> Function(...args[]: any)} CallbackCreator
withCallbacks({
  [key: string]: CallbackCreator
}, dependencies: Array.<string>) -> CustomHook

// or

withCallbacks({
  [key: string]: {
    func: CallbackCreator,
    deps: Array.<string> // <- deps only to the callback in block
  },

  [key: string]: CallbackCreator // <- use all defined as second param deps, see below
}, dependencies: Array.<string>) -> CustomHook
```

Works like [`withCallback`](#withCallaback) but allows to create a few callbacks at once.
There is an ability to define personal callback dependencies as well as deps for group of callback.
Based on [useCallback](https://reactjs.org/docs/hooks-reference.html#usecallback) hook.

__Example__

```javascript
import { combine, withState, withCallbacks } from 'react-hooks-combine'

import { Counter } from './component'

const EnhancedCounter = combine(
  withState('count', 'setCount', 0),
  withCallbacks({
    onInc: {
      func: (state, ownProps) => () => {
        state.setCount(state.count + 1)
      },
      deps: ['count'], // <- it's releveant only for callback in block (onInc)
    },

    onDec: (state, ownProps) => () => {
      state.setCount(state.count - 1)
    }
  }, ['count']) // relates only to onDec
)(Counter)
```

### <a name="withMemo"></a>__`withMemo()`__

```javascript
// @typedef {Function(state: Object, ownProps: Object) -> any} HeavyComputationWrapper
withMemo(memoizedValueName: string, memoFunction: HeavyComputationWrapper, dependencies: Array.<string>) -> CustomHook
```

Creates a custom hook to produce a memoized value. Based on [useMemo](https://reactjs.org/docs/hooks-reference.html#usememo) hook.

Pass a function and an array of dependencies. Custom hook which is using [useMemo](https://reactjs.org/docs/hooks-reference.html#usememo)
will only recompute the memoized value when one of the dependencies has changed. This optimization helps to avoid expensive calculations on every render.

__Example__

```javascript
// component.jsx
import React from 'react'

export const Board = ({ superData }) => (
  <Reporting data={superData} />
)
```
```javascript
// container.js
import { combine, withMemo } from 'react-hooks-combine'

import { Board } from './component'

const EnhancedBoard = combine(
  withMemo('superData', (state, ownProps) => {
    return superHeavyComputations(state)
  }, ['updatedAt'])
)

export default EnhancedBoard
```

__NB!__: [(From React Docs)](https://reactjs.org/docs/hooks-reference.html#usememo)

**"You may rely on useMemo as a performance optimization, not as a semantic guarantee."**

**"In the future, React may choose to “forget” some previously memoized values and recalculate them on next render, e.g. to free memory for offscreen components. Write your code so that it still works without useMemo — and then add it to optimize performance."**

### <a name="withMemos"></a>__`withMemos()`__

```javascript
// @typedef {Function(state: Object, ownProps: Object) -> any} HeavyComputationWrapper
withMemos({
  [key: string]: HeavyComputationWrapper
}, dependencies: Array.<string>) -> CustomHook

// or

withMemos({
  [key: string]: {
    func: HeavyComputationWrapper,
    deps: Array.<string> // <- deps only to the memoFunc in block
  },

  [key: string]: HeavyComputationWrapper // <- use all defined as second param deps, see below
}, dependencies: Array.<string>) -> CustomHook
```

Works like [`withMemo`](#withMemo) but allows to group memo calls logically.
There is an ability to define personal memoFunc dependencies as well as deps for group of memoFuncs.
Based on [useMemo](https://reactjs.org/docs/hooks-reference.html#usememo) hook.

__Example__

```javascript
import { combine, withMemos } from 'react-hooks-combine'

import { Counter } from './component'

const EnhancedCounter = combine(
  withMemos({
    firstValue: {
      func: (_state, ownProps) => {
        return ownProps.superHeavy1()
      },
      deps: ['createdAt'], // <- it's releveant only for memoFunc in block
    },

    secondValue: (state, ownProps) => () => {
      return ownProps.superHeavy2()
    }
  }, ['updateAt']) // relates only to onDec
)(Counter)
```

### <a name="withEffect"></a>__`withEffect()`__

```javascript
// @typedef {Function(state: Object, ownProps: Object) -> DisposeHandler?} EffectHandler
withEffect(effectHandler: EffectHandler, dependencies: Array.<string>) -> CustomHook
```

Creates a custom hook to run effectful code. Based on [useEffect](https://reactjs.org/docs/hooks-reference.html#useeffect) hook.
Accepts a function that contains imperative, possibly effectful code
and list of deps which can trigger effect exectuion.

By default, effects run after every completed render, but you can choose to fire it only when certain deps have changed.

__NB!__: Often, effects create resources that need to be cleaned up before the component leaves the screen, such as a subscription or timer ID. To do this, the function passed to withEffect may return a clean-up function. (The same as for [useEffect](https://reactjs.org/docs/hooks-reference.html#useeffect))


__Example__

```javascript
import { combine, withEffect } from 'react-hooks-combine'

import { Timer } from './component'

const EnhancedTimer = combine(
  withState('count', 'setCount', (_s, ownProps) => {
    return ownProps.initialCount
  }),
  withEffect(({ setCount }, ownProps) => {
    const intervalId = setInterval(() => {
      setCount(count => count + 1)
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [])
)(Timer)

```


### <a name="withLayoutEffect"></a>__`withLayoutEffect()`__
```javascript
// @typedef {Function(state: Object, ownProps: Object) -> DisposeHandler?} LayoutEffectHandler
withLayoutEffect(effectHandler: LayoutEffectHandler, dependencies: Array.<string>) - CustomHook
```

The signature is identical to [withEffect](#withEffect), but it based on [useLayoutEffect](https://reactjs.org/docs/hooks-reference.html#uselayouteffect) hook which fires synchronously after all DOM mutations. Practically you can use this to read layout from the DOM and synchronously re-render. Updates scheduled inside useLayoutEffect will be flushed synchronously, before the browser has a chance to paint.

Prefer the [withEffect](#withEffect) to create custom hook based on [useEffect](https://reactjs.org/docs/hooks-reference.html#useeffect) when possible to avoid blocking visual updates.

### <a name="withAsyncEffect"></a>__`withAsyncEffect()`__

```javascript
withAsyncEffect(config: {
  asyncAction: Function(state: Object, ownProps: Object) -> Promise,
  disposeAction?: Function(),
  dataName?: string, // 'data' by default
  deps?: Array.<string>,
}) -> CustomHook
```

Creates a custom hook to handle async calls, sort of helper hook.
Based on [useState](https://reactjs.org/docs/hooks-reference.html#usestate) and [useEffect](https://reactjs.org/docs/hooks-reference.html#useeffect).
Custom hook is created by withAsyncEffect returns async state object that contains loading indicator status, data of any form, and error if it's happened.

```javascript
const useCustomHook = withAsyncEffect({
  asyncAction: () => Promise.resolve('user data string'),
})

const {
  loading // boolean,
  data, // any
  error, // any, null if there is no error
} = useCustomHook(state, ownProps)

```

__Example__

```javascript
import { combine, withContext, withAsyncEffect } from 'react-hooks-combine'
import { APIServicesContext } from 'app/services/context'

import { EditForm } from './form'

const EnhancedForm = (
  withContext('services', APIServicesContext),
  withAsyncEffect({
    deps: [],
    dataName: 'userData', // 'data' by default
    asyncAction: ({ services }, ownProps) => {
      const { userService } = services
      return userService.get(ownProps.userId)
    },
  })
)(EditForm)
```

### <a name="withContext"></a>__`withContext()`__

```javascript
withContext(contextName: string, contextObject: ReactContextObject) -> CustomHook
```

Creates a custom hook based on [useContext](https://reactjs.org/docs/hooks-reference.html#usecontext).
Accepts alias of context object in final state and a context object (the value returned from React.createContext) and returns the current context value for that context. The current context value is determined by the value prop of the nearest <MyContext.Provider> above the calling component in the tree.

When the nearest <MyContext.Provider> above the component updates, this Hook will trigger a rerender with the latest context value passed to that MyContext provider.

```javascript
import { combine, withContext, withCallbacks } from 'react-hooks-combine'

import { APIServicesContext } from '...'
import { EditForm } from '...'

const EnhancedForm = combine(
  withContext('services', APIServicesContext),
  withCallbacks({
    onSave: ({ services }, ownProps) => (userData) => {
      const { userService } = services
      userService.save(userData)
    }
  }, [])
)(EditForm)

```

### <a name="withRef"></a>__`withRef()`__

```javascript
withRef(refName: string, initialRefValue?: any) -> CustomHook
```

Creates a custom hook based on [useRef](https://reactjs.org/docs/hooks-reference.html#useref). Accepts name of the ref in final state and initial ref value.
[useRef](https://reactjs.org/docs/hooks-reference.html#useref) returns a mutable ref object whose `.current` property is initialized to the passed argument (`initialRefValue`). The returned object will persist for the full lifetime of the component.

```javascript
import React from 'react'
import { combine, withRef } from 'react-hooks-combine'

const Input = ({ inputRef }) => (
  <input ref={inputRef} type="text" />
)

export default combine(
  withRef('inputRef', null)
)(Input)
```

### <a name="withImperativeHandle"></a>__`withImperativeHandle()`__

```javascript
useImperativeHandler<V>(createHandler: Function(state, ownProps) -> V, deps?: Array.<string>) -> CustomHook
```

Creates custom hook based on [useImperativeHandler]().
useImperativeHandle customizes the instance value that is exposed to parent components when using ref. As always, imperative code using refs should be avoided in most cases. useImperativeHandle should be used with forwardRef:

```javascript
import React, { forwardRef } from 'react'
import { combine, useImperativeHandler } from 'react-hooks-combine'

const Input = () => (
  <input type="text" />
)

export default forwardRef(combine(
  useImperativeHandler(
    () => ({ focus: () => {} }),
    [],
  )
))
```

***IMPORTANT:*** you should provide ref for [useImperativeHandler]() by [React.forwardRef](), but it will work only for [useImperativeHandler](). If you want using ref in your component, you have to use [forwardRef]() property for [combine]() function.

If you use [forwardRef]() property you don't have to wrap component by [React.forwardRef]().

```javascript
import React from 'react'
import { combine, useImperativeHandler } from 'react-hooks-combine'

const Input = (props, ref) => (
  <input type="text" ref={ref} />
)

export default combine({
  forwardRef: true,
  hooks: [
    useImperativeHandler(
      () => ({ focus: () => {} }),
      [],
    ),
  ],
})
```

### <a name="withDebugValue"></a>__`withDebugValue()`__

```javascript
withDebugValue<V>(valueExtractor: Function(state, ownProps) -> V, valueFormatter: Function(value: V) -> any)
```

Create a custom hook based on [useDebugValue](https://reactjs.org/docs/hooks-reference.html#usedebugvalue).
Hook is created by `withDebugValue` can be used to display a label for custom hooks in React DevTools.

In some cases formatting a value for display might be an expensive operation. It’s also unnecessary unless a Hook is actually inspected.

For this reason `withDebugValue` accepts a formatting function as an optional second parameter. This function is only called if the Hooks are inspected. It receives the debug value as a parameter and should return a formatted display value.

__Example__

```javascript
import { combine, ..., withDebugValue } from 'react-hooks-combine'

import { Panel } from './component'

export default combine(
  ...,
  withDebugValue((_state, _ownProps) => 'Debug Message')
)(Panel)
```
