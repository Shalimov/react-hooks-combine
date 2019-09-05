import React from 'react'
import { create } from 'react-test-renderer'
import { act } from '@testing-library/react-hooks'

import { combine, withReducer, withImperativeHandle } from '../../src'

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
    // eslint-disable-next-line
    const Counter = ({ count }, ref) => (<span ref={ref}>{count}</span>)

    const CombineCounter = combine({
      forwardRef: true,
      hooks: [
        withReducer({
          reducer,
          stateName: 'count',
          initialState: 0,
        }),
        withImperativeHandle(({ dispatch }) => ({ dispatch }), ['count']),
      ],
    })(Counter)

    const counterRef = React.createRef(null);
    const render = create(<CombineCounter ref={counterRef} />);
    expect(render.root.findByType('span').children).toEqual(['0']);
    expect(counterRef.current.dispatch).not.toBe(undefined)

    act(() => counterRef.current.dispatch(INCREMENT))

    expect(render.root.findByType('span').children).toEqual(['1']);
  })
})
