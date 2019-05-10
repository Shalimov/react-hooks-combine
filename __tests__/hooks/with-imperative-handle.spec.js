import React, { useReducer, forwardRef } from 'react'
import { create, act } from 'react-test-renderer'

import { withImperativeHandle } from '../../src'

describe('Imperative handle', () => {
  test(`
    Check imperative handle customizes ref object
    - change the parent ref object should be changed
    - check the inner counter value should be changed by ref object
  `, () => {
    const INCREMENT = 'INCREMENT';

    function reducer(state, action) {
      return action === INCREMENT ? state + 1 : state;
    }

    function Counter(props, ref) {
      const [count, dispatch] = useReducer(reducer, 0);
      withImperativeHandle(ref, () => ({ dispatch }), ['count'])();
      // eslint-disable-next-line
      return <span>{count}</span>
    }

    const CounterWithRef = forwardRef(Counter);
    const counterRef = React.createRef(null);
    const render = create(<CounterWithRef ref={counterRef} />);
    expect(render.root.findByType('span').children).toEqual(['0']);
    expect(counterRef.current.dispatch).not.toBe(undefined)

    act(() => counterRef.current.dispatch(INCREMENT))

    expect(render.root.findByType('span').children).toEqual(['1']);
  })
})
