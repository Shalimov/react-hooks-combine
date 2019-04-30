# For Recompose Adepts

<style>
  .comparison {
    display: flex;
    flex-direction: row;
  }

  .divider {
    height: 100%;
    border-left: 1px solid #FFF;
    margin: 4px;
  }
</style>

API has smilarities to recompose library, in this guide we explain main difference between Recompose and React-Hooks-Combine

Let's start with example:

<div class="comparison">

<div>

### __Recompose__

```javascript
import { compose, withHandlers, withState } from 'recompose'

const enhance = compose(
  withState('stateName', 'updateStateFnName', initialStateOrFn),
  withHandlers({ 
    onAction: (allProps) => () => {
      allProps
    },

    onNextAction: (allProps) => () => {
      allProps
    },
  })
)

export default enhance(Component)

```
</div>

<div class="divider">
</div>

<div>

### __React-Hooks-Combine__

```javascript
import { combine, withCallbacks, withState } from 'react-hooks-combine'

const enhance = combine(
  withState('stateName', 'updateStateFnName', initialStateOrFn)
  withCallbacks({ 
    onAction: (state, props) => () => {
      // first diff is in params
    },

    onNextAction: (state, props) => () => {
      // first diff is in params
    },
  })
)

export enhance(Component)
```
</div>

</div>
