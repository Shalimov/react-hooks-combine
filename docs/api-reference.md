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
 * @property {Object} defaultProps - set of default component props;
 * @property {Function -> Object} transformProps - props transformer to omit, filter, map props which are supposed to be passed
*/
combine(config: CombineConfig) -> HigherOrderComponent
```

Combines [custom hook](https://reactjs.org/docs/hooks-custom.html) creators into single [custom hook](https://reactjs.org/docs/hooks-custom.html) and wrap original component to invoke the custom hook and pass values of it as props to inner one.

__NB!__: It's different from [recompose](https://github.com/acdlite/recompose) `compose` function because __`combine`__ wraps component only once per any number of provided hooks while `compose` wraps component as many times as hocs are included

As you can see above: two types of params are accepted:
- list of custom hook creators (withState, withCallbacks and so on)
- or __CombineConfig__ object

You can use __CombineConfig__ to cover the following cases:
- You need to use HOCS from 3td party lib (e.g: Apollo GraphQl, Mobx-React, Recompose)
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

  // props contains state and props
  transformProps: props => _.pick(props, ['data', 'applicationState', 'animated', 'type'])
})(Button)

export default EnhancedButton
```

## <a name="hookWrappers"></a>__Hook Wrappers__

### <a name="withState"></a>__`withState()`__

```javascript
withState(stateName: string, updateFn: string, initialValue: any | Function(state: Object, props: Object) -> any) -> CustomHook
```
Creates custom hook with produces local state and update function, based on [useState](https://reactjs.org/docs/hooks-reference.html#usestate) hook.
3td parameter can accept any value as initial state or function that inits state lazily.

__NB!__: The initialState argument is the state used during the initial render. In subsequent renders, it is disregarded. If the initial state is the result of an expensive computation, you may provide a function instead, which will be executed only on the initial render.

__Example__

```javascript
import { combine, withState } from 'react-hooks-combine'

import { Panel } from './component.jsx'

const EnhancedPanel = combine(
  withState('stateValue1', 'setStateValue1', 'Hello State Value 1'),
  withState('stateValue2', 'setStateValue2', (state, ownProps) => {
    // will be invoked only once
    console.log(props) // component ownProps
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
    dispatchName: string, // 'dispatch' by default
    initialState: S,
    init: Function(S) -> S,
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

Creates custom hook to produce a memoized callback. Based on [useCallback](https://reactjs.org/docs/hooks-reference.html#usecallback) hook.

Pass an inline callback and an array of dependencies. useCallback will return a memoized version of the callback that only changes if one of the dependencies has changed. This is useful when passing callbacks to optimized child components that rely on reference equality to prevent unnecessary renders (e.g. shouldComponentUpdate).

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


### <a name="withMemos"></a>__`withMemos()`__

### <a name="withMemo"></a>__`withMemo()`__

### <a name="withEffect"></a>__`withEffect()`__

### <a name="withLayoutEffect"></a>__`withLayoutEffect()`__

### <a name="withAsyncEffect"></a>__`withAsyncEffect()`__

### <a name="withContext"></a>__`withContext()`__

### <a name="withRef"></a>__`withRef()`__