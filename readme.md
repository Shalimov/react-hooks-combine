# React hooks combine

[Hooks](https://reactjs.org/docs/hooks-intro.html) powered, recompose like utility belt for ladies and gentlemens.

---

React Hooks Combine (RHC) is a simple utility belt to help you split up logic for your components between container (smart) part and dummy component (view) part.
It helps you to create only one [__HOC__](https://reactjs.org/docs/higher-order-components.html) effortlessly with [__custom hook__](https://reactjs.org/docs/hooks-custom.html) which combines all listed [HOOKS](https://reactjs.org/docs/hooks-intro.html) (all in one).

It has API Design similar to [Recompose](https://github.com/acdlite/recompose), if you are already familiar with it you can start your discovery here: [For Recompose Adepts](/docs/for-recompose-adepts.md).

---
## Documentation
The documentation is divided into several sections:
- [API Reference](/docs/api-reference.md)
- [How it works](/docs/explanation.md)
- [Recompose Similarities](/docs/for-recompose-adepts.md)

You can improve it by sending pull requests to this repository.

---
## Let's Get Started

__Prerequisites:__
- [React >= 16.8.0](https://reactjs.org/)
- __[yarn](https://yarnpkg.com/ru/)__ _or_ __npm__


__Install (choose preferable way)__
- `yarn add react-hooks-combine`
- `npm install react-hooks-combine`

__Then...__

```javascript
// component.jsx
import React from 'react'

export const CounterComponent = ({ count, onPlus, onMinus }) => (
  <div>
    <strong>Active: {counter}</strong>
    <button type="button" onClick={onPlus}>+</button>
    <button type="button" onClick={onMinus}>-</button>
  </div>
)
```

```javascript
// container.js (withReducer + withCallbacks)
import { combine, withReducer, withCallbacks } from 'react-hooks-combine'

import { CounterComponent } from './component'

const INC = 'INC'
const DEC = 'DEC'

const reducer = (count, action) => {
    switch(action.type) {
      case INC: return count + 1
      case DEC: return count - 1
      default: return count
    }
}

export default combine(
  withReducer(reducer, 'counterState', 'dispatchFn', 0),
  withCallbacks({
    onPlus: ({ counterState, dispatchFn }, _props) => () => {
      dispatchFn({ type: INC })
    },

    onMinus: ({ counterState, dispatchFn }, _props) => () => {
      dispatchFn({ type: DEC })
    }
  }, ['counterState']), // <-  deps for useCallback (CHECK API TO LEARN MORE)
)

```
__OR__

```javascript
// container.js (withState + withCallbacks)
import { combine, withState, withCallbacks } from 'react-hooks-combine'

import { CounterComponent } from './component'

export default combine(
  withState('count', 'setCount', 0),
  withCallbacks({
    onPlus: ({ count, setCount }, _props) => () => {
      setCount(count + 1)
    },

    onMinus: ({ count, setCount }, _props) => () => {
      setCount(count - 1)
    }
  }, ['count']), // <-  deps for useCallback (CHECK API TO LEARN MORE)
)
```