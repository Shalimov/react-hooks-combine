# React hooks combine

[Hooks](https://reactjs.org/docs/hooks-intro.html) powered, recompose like utility belt for ladies and gentlemen.

---

React Hooks Combine (RHC) is a simple utility belt to help you split up logic for your components between container (smart) part and dummy component (view) part.
It helps you to create only one [__HOC__](https://reactjs.org/docs/higher-order-components.html) effortlessly with [__custom hook__](https://reactjs.org/docs/hooks-custom.html) which combines all listed [HOOKS](https://reactjs.org/docs/hooks-intro.html) (all in one).

It has API Design similar to [Recompose](https://github.com/acdlite/recompose).

---
## Documentation
Documentation can be found here: [API Reference](/docs/api-reference.md)

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

export const UserPageComponent = ({ loading, userData, onSubmit, onCancel }) => (
  <div>
    <h2>User Form</h2>
    <ContentLoadIndicator loading={loading}>
      {
        () => (
          <UserForm 
            initialValues={userData}
            onSubmit={onSubmit}
            onCancel={onCancel} />
        )
      }
    </ContentLoadIndicator>
  </div>
)
```

```javascript
// container.js (withAsyncEffect + withCallbacks)
import { combine, withAsyncEffect, withCallbacks } from 'react-hooks-combine'

import { UserPageComponent } from './component'

export default combine(
  withAsyncEffect({
    deps: ['userId'], // will request again if user id is changed
    dataName: 'userData', // 'data' by default
    asyncAction: (_state, ownProps) => ownProps.userService.load(ownProps.userId),
  }),
  withCallbacks({
    onSubmit: (state, props) => async (formData) => {
      const { userData } = state
      const { userService } = props

      await userService.save({ ...userData, ...formData})
      ...
    },

    onCancel: () => () => {
      ...
    }
  }, ['userData'])
)(UserPageComponent)

```

__OR__

```javascript
// component.jsx
import React from 'react'

export const CounterComponent = ({ count, onPlus, onMinus }) => (
  <div>
    <strong>Active: {count}</strong>
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
  withReducer({
    reducer,
    stateName: counterState,
    initialState: 0,
  }),
  withCallbacks({
    onPlus: ({ counterState, dispatch }, _props) => () => {
      dispatch({ type: INC })
    },

    onMinus: ({ counterState, dispatch }, _props) => () => {
      dispatch({ type: DEC })
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

    onMinus: ({ setCount }, _props) => () => {
      setCount(count => count - 1) // function could be used
    }
  }, ['count']), // <-  deps for useCallback (CHECK API TO LEARN MORE)
)
```

__OR WHICHEVER YOU LIKE...__
