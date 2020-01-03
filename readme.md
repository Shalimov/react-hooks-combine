
# __Disclamer:__
```
Master contains v2 of react-hooks-combine which is written on TS
This version is not fully documented and work on it in progress
Expectations are the following: migration and changes will have been accomplished by the end of Junary
Meanwhile, pls, use latest version of it: 1.7.2
```

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
import React from 'react'

import { withState, pipe, withCallbacks } from 'react-hooks-combine'

const useCount = pipe(
  withState('count', 'setCount', 0),
  // try to not forget about dependencies since it's hooks, not a hocs
  withCallbacks({
    increment: ({ count, setCount }) => () => setCount(count + 1),
    decrement: ({ count, setCount }) => () => setCount(count - 1),
  })
)

function Counter() {
  const { count, increment, decrement } = useCount()

  return (
    <div>
      <button onClick={decrement}>-1</button>
      {count}
      <button onClick={increment}>+1</button>
    </div>
  )
}

export default Counter
```

__OR__

```javascript
import { pipe, withAsyncEffect, withCallbacks } from 'react-hooks-combine'

const useCurrentUser = pipe(
  withContext('repository', RepositoryContext),
  withAsyncEffect({
    deps: [],
    dataName: 'details',
    loadingName: 'loading',
    async asyncAction({ repository } /* state */, props) {
      const { userRepository } = repository
      const details = await userRepository.getCurrentUser()
      return details
    }
  }),
  // check withCallbacks section for syntax
  withCallbacks({
    onDelete: () => () => {
      ...
    },

    onUpdate: {
      deps: [...],
      func: () => () => {},
    },
  }, [...]),
)

export const UserView = (props) => {
  // useCurrentUser is a custom hook
  // and returns object which contains properties:
  // details, onDelete, onUpdate, loading, repository
  // details contains info that comes from some external source by async request
  const user = useCurrentUser(props)

  return (
    <div>
      <h2>Hello {user.details.firstName</h2>
      ...
      <button click={user.onUpdate}>Update</button>
      <button click={user.onDelete}>Delete</button>
    </div>
  )
}
```

__OR__

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
)(CounterComponent)

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
)(CounterComponent)
```

__OR WHICHEVER YOU LIKE...__
