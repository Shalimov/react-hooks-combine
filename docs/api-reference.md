# API Reference


## __Content:__

- [Utils](#utils)
  - [combine()](#combine)
- [Hook Wrappers](#hookWrappers)
  - [State Related](#withState)
    - [withState()](#withState)
    - [withStateHandlers()](#withStateHandlers)
    - [withReducer()](#withReducer)
  - [Callbacks](#withCallbacks)
    - [withCallbacks()](#withCallbacks)
    - [withCallback()](#withCallbacks)
  - [Memo](#withMemos)
    - [withMemos()](#withMemos)
    - [withMemo()](#withMemo)
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

NB!: It's different from [recompose](https://github.com/acdlite/recompose) `compose` function because __`combine`__ wraps component only once per any number of provided hooks while `compose` wraps component as many times as hocs are included

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
)

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
})

export default EnhancedButton
```


## <a name="hookWrappers"></a>__Hook Wrappers__

### <a name="withState"></a>__`withState()`__

### <a name="withStateHandlers"></a>__`withStateHandlers()`__

### <a name="withReducer"></a>__`withReducer()`__
